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
import { HttpsError, Request, onCall } from "firebase-functions/v2/https";
import { createHash, createHmac, randomInt, timingSafeEqual } from "node:crypto";

type AuthApp = "ironsworn" | "starforged";

interface RequestOtpSignInData {
  app?: unknown;
  email?: unknown;
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

interface OtpRateLimitDocument {
  count: number;
  expiresAt: Timestamp;
  windowStartedAt: Timestamp;
}

type VerifyOtpOutcome =
  | "expired"
  | "invalid-code"
  | "not-found"
  | "ok"
  | "too-many-attempts";

const OTP_COLLECTION = "authOtpAttempts";
const OTP_RATE_LIMIT_COLLECTION = "authOtpRateLimits";
const OTP_LENGTH = 6;
const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_RESEND_MS = 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;

// Per-IP fixed-window cap on OTP sends. The 60s per-email cooldown does
// nothing to stop a caller walking a list of addresses: every send costs
// money, burns SES reputation, and delivers an unsolicited "your sign-in
// code" email to someone who never asked. 10 per hour is far above what a
// real person needs (a code lives 10 minutes and resends are already capped
// at 1/minute, so ~3 codes covers any realistic sign-in), while leaving
// headroom for households, offices, and other NAT'd networks sharing one
// egress IP. Raise via OTP_IP_HOURLY_LIMIT without a code change if a
// deployment turns out to share egress IPs more widely than expected.
const OTP_IP_WINDOW_MS = 60 * 60 * 1000;
const OTP_IP_MAX_REQUESTS = getPositiveIntFromEnv("OTP_IP_HOURLY_LIMIT", 10);

// Per-email fixed-window cap on OTP sends. The per-IP cap above doesn't bind
// once IPs are cheap: an attacker with a pool of them can still trickle
// ~1 send/minute at one chosen victim address forever (the 60s cooldown
// paces it but never stops it), which is unsolicited "your sign-in code"
// mail landing in a real inbox plus SES cost/reputation drain either way.
// 6 per hour is generous for any real sign-in - a code lives 10 minutes and
// resends are already capped at 1/minute, so that's room for the original
// send plus a couple of resends and a typo'd retry - while cutting the
// sustained-bombing ceiling from ~60/hr to 6/hr. Raise via
// OTP_EMAIL_HOURLY_LIMIT without a code change if that turns out too tight
// for a legitimate flow (e.g. shared team inboxes retrying often).
const OTP_EMAIL_WINDOW_MS = 60 * 60 * 1000;
const OTP_EMAIL_MAX_REQUESTS = getPositiveIntFromEnv(
  "OTP_EMAIL_HOURLY_LIMIT",
  6
);

// Per-IP fixed-window cap on verify calls. The per-document 5-attempt counter
// bounds guesses against any one code, but nothing bounds request volume, so
// garbage codes cost an unthrottled Firestore transaction each. Sized so no
// legitimate user can reach it: the per-IP send cap is 10 codes/hour and each
// code allows 5 attempts, so ~50 verify calls/hour is the ceiling an honest
// caller behind one IP can even produce. 60 sits just above that. Callers
// behind carrier-grade NAT share this bucket the same way they share the send
// cap - raise via OTP_VERIFY_IP_HOURLY_LIMIT if that bites.
// Longest possible textual IP address (IPv4-mapped IPv6, e.g.
// "0000:0000:0000:0000:0000:ffff:255.255.255.255").
const MAX_IP_LENGTH = 45;
const OTP_VERIFY_IP_WINDOW_MS = 60 * 60 * 1000;
const OTP_VERIFY_IP_MAX_REQUESTS = getPositiveIntFromEnv(
  "OTP_VERIFY_IP_HOURLY_LIMIT",
  60
);

// Every rate-limit rejection in a given callable has to be byte-identical, so
// a caller cannot tell which limit fired or infer anything about the address.
// Held as constants so that property is structural rather than copy-paste.
const SEND_RATE_LIMITED_MESSAGE = "Please wait before requesting another code.";
const VERIFY_RATE_LIMITED_MESSAGE =
  "Too many attempts. Please request a new code.";
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
    throw new HttpsError("resource-exhausted", SEND_RATE_LIMITED_MESSAGE);
  }

  // Order: free cooldown check first (no extra read - existingAttemptData is
  // already in hand), then the per-IP cap, and only then the per-email cap.
  //
  // The IP check MUST come first. The email counter is a resource belonging to
  // the victim, and consuming it is itself a denial of service: if we wrote it
  // before checking the caller's own budget, an attacker whose IP quota was
  // already spent could keep burning victims' email quotas on requests we were
  // always going to reject - no mail sent, no cost to the attacker, and six
  // cheap calls per address locks any number of innocent users out of sign-in
  // for up to an hour. Charging the attacker's own IP budget first, and never
  // touching the email counter on a request that is already doomed, is the
  // whole point of the ordering.
  //
  // Both checks key on the caller IP or the email string only, never on
  // whether an account exists.
  await enforceIpSendRateLimit(request.rawRequest);
  await enforceEmailSendRateLimit(email);

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

  // Before the transaction, so garbage-code spam cannot cost an unthrottled
  // Firestore transaction per call. Keyed on caller IP only - never on the
  // email, and never on whether an account exists.
  await enforceVerifyIpRateLimit(request.rawRequest);

  const attemptRef = getOtpAttemptRef(email);
  const expectedCodeHash = hashOtpCode(email, code);
  const now = Date.now();

  // Read, check and increment have to happen in one transaction. Done
  // separately, N parallel requests all read the same attemptCount, all see
  // themselves as under the cap, and the 5-attempt limit stops bounding
  // guesses against a 6-digit code. The transaction body is side-effect free
  // apart from its own writes, so a retry is safe.
  const outcome = await getFirestore().runTransaction<VerifyOtpOutcome>(
    async (transaction) => {
      const attemptSnapshot = await transaction.get(attemptRef);
      const attempt = attemptSnapshot.data() as OtpAttemptDocument | undefined;

      if (!attempt) {
        return "not-found";
      }

      if (attempt.expiresAt.toMillis() < now) {
        transaction.delete(attemptRef);
        return "expired";
      }

      if (attempt.attemptCount >= MAX_VERIFY_ATTEMPTS) {
        transaction.delete(attemptRef);
        return "too-many-attempts";
      }

      if (!matchesCodeHash(attempt.codeHash, expectedCodeHash)) {
        transaction.update(attemptRef, {
          attemptCount: FieldValue.increment(1),
          updatedAt: FieldValue.serverTimestamp(),
        });
        return "invalid-code";
      }

      // Consume the code as part of the same transaction so a correct code is
      // redeemable exactly once, even by concurrent requests.
      transaction.delete(attemptRef);
      return "ok";
    }
  );

  if (outcome === "not-found") {
    throw new HttpsError("not-found", "No sign-in code was found.");
  }

  if (outcome === "expired") {
    throw new HttpsError("deadline-exceeded", "Sign-in code has expired.");
  }

  if (outcome === "too-many-attempts") {
    throw new HttpsError("resource-exhausted", VERIFY_RATE_LIMITED_MESSAGE);
  }

  if (outcome === "invalid-code") {
    throw new HttpsError("permission-denied", "Invalid sign-in code.");
  }

  const user = await getOrCreateUser(email, name);
  const token = await admin.auth().createCustomToken(user.uid);

  return { token };
});

function getOtpAttemptRef(email: string) {
  return getFirestore().collection(OTP_COLLECTION).doc(hashEmail(email));
}

function getOtpRateLimitRef(docId: string) {
  return getFirestore().collection(OTP_RATE_LIMIT_COLLECTION).doc(docId);
}

// The caller IP, taken from the leftmost x-forwarded-for entry and falling
// back to the socket peer.
//
// rawRequest is the raw Express request, and Express's `trust proxy` defaults
// to false (the functions framework does not set it), so rawRequest.ip ignores
// x-forwarded-for and reports the socket peer - which inside a gen-2 container
// is the Google front end, identical for every caller on the internet. Keying
// a limit on that would put everyone in one bucket and kill OTP sending
// globally after a single bucket's worth of requests, so the header has to be
// read directly.
//
// A leftmost x-forwarded-for entry is client-supplied and therefore spoofable.
// Every per-IP limit here is consequently a cost/abuse-blunting control, not
// an authentication control, and must not be relied on as one - the per-email
// cap is what actually bounds bombing of any single address.
function getClientIp(rawRequest: Request) {
  const forwardedFor = rawRequest.headers["x-forwarded-for"];
  const forwardedForValue = Array.isArray(forwardedFor) ?
    forwardedFor[0] :
    forwardedFor;

  if (typeof forwardedForValue === "string") {
    const clientIp = forwardedForValue.split(",")[0].trim();
    // MAX_IP_LENGTH bounds what a caller can push through the HMAC via a
    // header they control. The value is only ever used as HMAC input, so it
    // cannot escape into the document path however malformed it is.
    if (clientIp && clientIp.length <= MAX_IP_LENGTH) {
      return clientIp;
    }
  }

  return typeof rawRequest.ip === "string" ? rawRequest.ip.trim() : "";
}

async function enforceIpRateLimit(params: {
  maxRequests: number;
  rawRequest: Request;
  rejectionMessage: string;
  scope: string;
  windowMs: number;
}) {
  const ip = getClientIp(params.rawRequest);

  if (!ip) {
    // Fail open. With no usable caller IP the alternative is funnelling every
    // caller into one shared bucket and locking the whole flow. Log it so it
    // is visible if it ever happens.
    logger.warn("OTP request had no caller IP; skipping per-IP rate limit.", {
      scope: params.scope,
    });
    return;
  }

  const allowed = await consumeRateLimitSlot(
    getOtpRateLimitRef(hashRateLimitKey(params.scope, ip)),
    params.windowMs,
    params.maxRequests
  );

  if (!allowed) {
    throw new HttpsError("resource-exhausted", params.rejectionMessage);
  }
}

function enforceIpSendRateLimit(rawRequest: Request) {
  return enforceIpRateLimit({
    maxRequests: OTP_IP_MAX_REQUESTS,
    rawRequest,
    rejectionMessage: SEND_RATE_LIMITED_MESSAGE,
    scope: "ip",
    windowMs: OTP_IP_WINDOW_MS,
  });
}

function enforceVerifyIpRateLimit(rawRequest: Request) {
  return enforceIpRateLimit({
    maxRequests: OTP_VERIFY_IP_MAX_REQUESTS,
    rawRequest,
    // Identical to the over-cap rejection in verifyOtpSignIn, so the caller
    // cannot tell which of the two limits rejected them.
    rejectionMessage: VERIFY_RATE_LIMITED_MESSAGE,
    scope: "verify-ip",
    windowMs: OTP_VERIFY_IP_WINDOW_MS,
  });
}

async function enforceEmailSendRateLimit(email: string) {
  const allowed = await consumeRateLimitSlot(
    getOtpRateLimitRef(hashRateLimitKey("email", email)),
    OTP_EMAIL_WINDOW_MS,
    OTP_EMAIL_MAX_REQUESTS
  );

  if (!allowed) {
    throw new HttpsError("resource-exhausted", SEND_RATE_LIMITED_MESSAGE);
  }
}

// Shared fixed-window counter used by both the per-IP and per-email caps.
// `limitRef` must already be scoped (by doc id) to the caller/email being
// limited - this function only implements the window/count bookkeeping.
async function consumeRateLimitSlot(
  limitRef: FirebaseFirestore.DocumentReference,
  windowMs: number,
  maxRequests: number
) {
  const now = Date.now();

  return getFirestore().runTransaction<boolean>(async (transaction) => {
    const snapshot = await transaction.get(limitRef);
    const limit = snapshot.data() as OtpRateLimitDocument | undefined;
    const windowStartedAt = limit?.windowStartedAt?.toMillis() ?? 0;
    const count = typeof limit?.count === "number" ? limit.count : 0;

    if (!limit || now - windowStartedAt >= windowMs) {
      transaction.set(limitRef, {
        count: 1,
        expiresAt: Timestamp.fromMillis(now + windowMs),
        updatedAt: FieldValue.serverTimestamp(),
        windowStartedAt: Timestamp.fromMillis(now),
      });
      return true;
    }

    if (count >= maxRequests) {
      return false;
    }

    transaction.update(limitRef, {
      count: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return true;
  });
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

// Doc id for a rate-limit bucket. All buckets share the authOtpRateLimits
// collection so they inherit one TTL policy on `expiresAt`; the `scope`
// prefix ("ip", "email", "verify-ip") is what keeps their key spaces disjoint,
// so an email's bucket can never collide with an IP's or with the same IP's
// separate send and verify budgets.
//
// Keyed (HMAC) rather than bare sha256: an unkeyed digest of an IPv4 address
// is brute-forceable across the whole address space in seconds, and an email
// digest is trivially checked against a guessed address, so an unkeyed hash
// would not actually pseudonymize either input. Rotating OTP_HASH_SECRET
// resets all rate-limit windows, which is harmless.
function hashRateLimitKey(scope: string, value: string) {
  return createHmac("sha256", getOtpHashSecret())
    .update(`${scope}:${value}`)
    .digest("hex");
}

function getOtpHashSecret() {
  const secret = process.env.OTP_HASH_SECRET;
  if (!secret) {
    logger.error("OTP_HASH_SECRET is not configured.");
    throw new HttpsError("failed-precondition", "OTP auth is not configured.");
  }
  return secret;
}

function hashOtpCode(email: string, code: string) {
  return createHmac("sha256", getOtpHashSecret())
    .update(`${email}:${code}`)
    .digest("hex");
}

function matchesCodeHash(storedHash: unknown, expectedHash: string) {
  if (typeof storedHash !== "string") {
    return false;
  }

  const stored = Buffer.from(storedHash, "utf8");
  const expected = Buffer.from(expectedHash, "utf8");

  // timingSafeEqual throws on unequal lengths, so the length check has to come
  // first. Length is not secret here - both sides are fixed-width hex digests
  // of a sha256 HMAC, so a mismatch only ever means a malformed stored doc.
  if (stored.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(stored, expected);
}

function getPositiveIntFromEnv(name: string, fallback: number) {
  const parsed = Number(process.env[name]);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
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
