import {
  SendEmailCommand,
  SESv2Client,
} from "@aws-sdk/client-sesv2";
import * as admin from "firebase-admin";
import {
  FieldValue,
  Timestamp,
  getFirestore,
} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { defineSecret } from "firebase-functions/params";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { createHash, createHmac, randomInt } from "node:crypto";

type AuthApp = "ironsworn" | "starforged";

interface RequestOtpSignInData {
  app?: unknown;
  email?: unknown;
  name?: unknown;
}

interface VerifyOtpSignInData {
  code?: unknown;
  email?: unknown;
  name?: unknown;
}

interface OtpAttemptDocument {
  attemptCount: number;
  codeHash: string;
  email: string;
  expiresAt: Timestamp;
  resendAvailableAt: Timestamp;
}

const OTP_COLLECTION = "authOtpAttempts";
const OTP_LENGTH = 6;
const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_RESEND_MS = 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;
const awsAccessKeyId = defineSecret("AWS_ACCESS_KEY_ID");
const awsSecretAccessKey = defineSecret("AWS_SECRET_ACCESS_KEY");
const otpHashSecret = defineSecret("OTP_HASH_SECRET");
const otpCallableOptions = {
  secrets: [awsAccessKeyId, awsSecretAccessKey, otpHashSecret],
};

const appEmailConfig: Record<
  AuthApp,
  {
    appName: string;
    configurationSetName: string;
    fromEmailAddress: string;
  }
> = {
  ironsworn: {
    appName: "Iron Fellowship",
    configurationSetName:
      process.env.SES_IRONSWORN_CONFIGURATION_SET ?? "iron-fellowship-auth",
    fromEmailAddress:
      process.env.SES_IRONSWORN_FROM_EMAIL ??
      process.env.SES_FROM_EMAIL ??
      "Iron Fellowship <auth@send.scottbenton.dev>",
  },
  starforged: {
    appName: "Starforged Crew Link",
    configurationSetName:
      process.env.SES_STARFORGED_CONFIGURATION_SET ?? "crew-link-auth",
    fromEmailAddress:
      process.env.SES_STARFORGED_FROM_EMAIL ??
      process.env.SES_FROM_EMAIL ??
      "Starforged Crew Link <auth@send.scottbenton.dev>",
  },
};

const sesClient = new SESv2Client({
  region: process.env.SES_REGION ?? process.env.AWS_REGION ?? "us-east-1",
});

export const requestOtpSignIn = onCall<
  RequestOtpSignInData,
  Promise<{ sent: true }>
>(otpCallableOptions, async (request) => {
  const email = getNormalizedEmail(request.data.email);
  const app = getAuthApp(request.data.app);
  const config = appEmailConfig[app];
  const attemptRef = getOtpAttemptRef(email);
  const existingAttempt = await attemptRef.get();
  const existingAttemptData = existingAttempt.data() as
    | OtpAttemptDocument
    | undefined;
  const now = Date.now();

  if (
    existingAttemptData?.resendAvailableAt &&
    existingAttemptData.resendAvailableAt.toMillis() > now
  ) {
    throw new HttpsError(
      "resource-exhausted",
      "Please wait before requesting another code."
    );
  }

  const code = generateOtpCode();
  const expiresAt = Timestamp.fromMillis(now + OTP_TTL_MS);
  const resendAvailableAt = Timestamp.fromMillis(now + OTP_RESEND_MS);

  await attemptRef.set({
    attemptCount: 0,
    codeHash: hashOtpCode(email, code),
    createdAt: FieldValue.serverTimestamp(),
    email,
    expiresAt,
    resendAvailableAt,
    updatedAt: FieldValue.serverTimestamp(),
  });

  try {
    await sendOtpEmail({
      appName: config.appName,
      code,
      configurationSetName: config.configurationSetName,
      email,
      fromEmailAddress: config.fromEmailAddress,
    });
  } catch (error) {
    logger.error("Failed to send OTP email", error);
    await attemptRef.delete();
    throw new HttpsError(
      "internal",
      "Failed to send sign-in code. Please try again."
    );
  }

  return { sent: true };
});

export const verifyOtpSignIn = onCall<
  VerifyOtpSignInData,
  Promise<{ token: string }>
>(otpCallableOptions, async (request) => {
  const email = getNormalizedEmail(request.data.email);
  const code = getOtpCode(request.data.code);
  const name = getOptionalName(request.data.name);
  const attemptRef = getOtpAttemptRef(email);
  const attemptSnapshot = await attemptRef.get();
  const attempt = attemptSnapshot.data() as OtpAttemptDocument | undefined;
  const now = Date.now();

  if (!attempt) {
    throw new HttpsError("not-found", "No sign-in code was found.");
  }

  if (attempt.expiresAt.toMillis() < now) {
    await attemptRef.delete();
    throw new HttpsError("deadline-exceeded", "Sign-in code has expired.");
  }

  if (attempt.attemptCount >= MAX_VERIFY_ATTEMPTS) {
    await attemptRef.delete();
    throw new HttpsError(
      "resource-exhausted",
      "Too many attempts. Please request a new code."
    );
  }

  if (attempt.codeHash !== hashOtpCode(email, code)) {
    await attemptRef.update({
      attemptCount: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp(),
    });
    throw new HttpsError("permission-denied", "Invalid sign-in code.");
  }

  const user = await getOrCreateUser(email, name);
  const token = await admin.auth().createCustomToken(user.uid);
  await attemptRef.delete();

  return { token };
});

function getOtpAttemptRef(email: string) {
  return getFirestore().collection(OTP_COLLECTION).doc(hashEmail(email));
}

function getNormalizedEmail(value: unknown) {
  const email = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (!validateEmail(email)) {
    throw new HttpsError("invalid-argument", "Please enter a valid email.");
  }
  return email;
}

function getAuthApp(value: unknown): AuthApp {
  if (value === "ironsworn" || value === "starforged") {
    return value;
  }
  throw new HttpsError("invalid-argument", "Invalid app.");
}

function getOtpCode(value: unknown) {
  const code = typeof value === "string" ? value.trim() : "";
  if (!new RegExp(`^[0-9]{${OTP_LENGTH}}$`).test(code)) {
    throw new HttpsError("invalid-argument", "Invalid sign-in code.");
  }
  return code;
}

function getOptionalName(value: unknown) {
  const name = typeof value === "string" ? value.trim() : "";
  return name || undefined;
}

function generateOtpCode() {
  return randomInt(100000, 1000000).toString();
}

function hashEmail(email: string) {
  return createHash("sha256").update(email).digest("hex");
}

function hashOtpCode(email: string, code: string) {
  const secret = process.env.OTP_HASH_SECRET;
  if (!secret) {
    logger.error("OTP_HASH_SECRET is not configured.");
    throw new HttpsError("failed-precondition", "OTP auth is not configured.");
  }

  return createHmac("sha256", secret)
    .update(`${email}:${code}`)
    .digest("hex");
}

async function getOrCreateUser(email: string, displayName?: string) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    const update: admin.auth.UpdateRequest = {};

    if (displayName && user.displayName !== displayName) {
      update.displayName = displayName;
    }
    if (!user.emailVerified) {
      update.emailVerified = true;
    }

    if (Object.keys(update).length > 0) {
      await admin.auth().updateUser(user.uid, update);
      return admin.auth().getUser(user.uid);
    }
    return user;
  } catch (error) {
    if (isUserNotFoundError(error)) {
      return admin.auth().createUser({
        displayName,
        email,
        emailVerified: true,
      });
    }
    throw error;
  }
}

function isUserNotFoundError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "auth/user-not-found"
  );
}

async function sendOtpEmail(params: {
  appName: string;
  code: string;
  configurationSetName: string;
  email: string;
  fromEmailAddress: string;
}) {
  const { appName, code, configurationSetName, email, fromEmailAddress } =
    params;

  await sesClient.send(
    new SendEmailCommand({
      ConfigurationSetName: configurationSetName,
      Content: {
        Simple: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: getOtpEmailHtml(appName, code),
            },
            Text: {
              Charset: "UTF-8",
              Data: getOtpEmailText(appName, code),
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: `${appName} sign-in code`,
          },
        },
      },
      Destination: {
        ToAddresses: [email],
      },
      FromEmailAddress: fromEmailAddress,
    })
  );
}

function getOtpEmailText(appName: string, code: string) {
  return [
    `Your ${appName} sign-in code is ${code}.`,
    "",
    "This code expires in 10 minutes.",
    "If you did not request this code, you can ignore this email.",
  ].join("\n");
}

function getOtpEmailHtml(appName: string, code: string) {
  return `
    <p>Your ${appName} sign-in code is:</p>
    <p style="font-size: 24px; font-weight: 700; letter-spacing: 4px;">
      ${code}
    </p>
    <p>This code expires in 10 minutes.</p>
    <p>If you did not request this code, you can ignore this email.</p>
  `;
}

function validateEmail(email: string) {
  return email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]*)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}
