# Setup

## Steps

1. Clone this project `git clone https://github.com/scottbenton/Iron-Fellowship.git`
1. Install node v18 and npm v10
   1. Follow [these instructions](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) to install nvm
   1. Switch to project dir and `nvm install` to install and configure the correct node version
1. Install dependencies `npm i`
1. Create an `.env.local` file (see `.env.local` below)
1. Set up firebase (see Firebase Setup below, or contact Scott to get credentials to the dev instance)
1. Run `npm run dev` and go to your browser to see the output.

## .env.local

Create a new file in the root of this repository, named `.env.local`.
This file will hold environment variables representing credentials needed to connect your instance with firebase.

Copy the following into your project

```
VITE_IRON_FELLOWSHIP_FIREBASE_APIKEY=
VITE_IRON_FELLOWSHIP_FIREBASE_AUTHDOMAIN=
VITE_IRON_FELLOWSHIP_FIREBASE_PROJECTID=
VITE_IRON_FELLOWSHIP_FIREBASE_STORAGEBUCKET=
VITE_IRON_FELLOWSHIP_FIREBASE_MESSAGINGSENDERID=
VITE_IRON_FELLOWSHIP_FIREBASE_APPID=

VITE_CREW_LINK_FIREBASE_APIKEY=
VITE_CREW_LINK_FIREBASE_AUTHDOMAIN=
VITE_CREW_LINK_FIREBASE_PROJECTID=
VITE_CREW_LINK_FIREBASE_STORAGEBUCKET=
VITE_CREW_LINK_FIREBASE_MESSAGINGSENDERID=
VITE_CREW_LINK_FIREBASE_APPID=

# Default values for the environment.
VITE_TITLE="Starforged Crew Link"
VITE_FAVICON_PATH=/theme/eidolon.svg
VITE_OPENGRAPH_PATH=/assets/starforged/opengraph-default.png
```

As you create firebase projects, you will get values to fill these config values in.
You can also just ask me directly, and I will send you the values I use in development.
Copy those values from into your `.env.local` file in the following properties:

## Firebase Setup

Firebase provides authentication, database, and image storage to this application.

The first step is to create firebase projects for Ironsworn and Starforged. You can create a new project by going to the [firebase console](https://console.firebase.google.com/). Once you have created a project, you need to follow the following steps.

### Add an App

1. From the homepage, under the `Get started` section, click `</>`.
1. Give your app a nickname, and if you plan on hosting your own version (and not just contributing to the existing deployments), click "Also set up Firebase Hosting"
1. Click next, and copy the apiKey, authDomain, projectId, storageBucket, messagingSenderId, and appId values into your `.env.local` file you created earlier
1. Complete your setup

![Firebase Web App Setup](./readme_assets/FirebaseWeb.png)

### Authentication

1. Under the `Build` tab on the left, select `Authentication`
1. Click `Get Started`
1. Select and enable `Google`
1. Add a new provider, and enable `Email/Password` with `Email link` sign in

Sign in is served by two flows. Emailed one-time codes are the primary flow, at
`/login` and `/join`; they are handled by the `requestOtpSignIn` and
`verifyOtpSignIn` cloud functions and need the AWS SES setup below. The Firebase
magic email link flow is kept as a backup at `/auth/login` and `/auth/signup`,
which is also where outstanding magic links are configured to land. Google sign
in is available on both. The `Email link` provider above is what the backup flow
uses, so leave it enabled.

### Firestore

1. Under the `Build` tab on the left, select `Firestore Database`
1. Create a new database, choosing the location of your choice.
1. Once your database has been provisioned, click the `rules` tab, and copy the contents of the `firestore.rules` file into the tab

### Cloud Storage

1. Under the `Build` tab on the left, select `Storage`
1. Set up cloud storage, and wait for it to be created
1. Once your storage has been created, click the `rules` tab, and copy the contents of the `storage.rules` file into the tab

## Sign-in Codes (AWS SES)

The primary sign in flow emails a 6 digit code through AWS SES. Without this
configured, `/login` and `/join` cannot send codes, and sign in falls back to
Google or the backup magic link flow at `/auth/login`.

### AWS side

1. Verify a sending identity in SES for the domain you send from (the code
   defaults to `auth@send.scottbenton.dev`).
1. Create two SES configuration sets, named `iron-fellowship-auth` and
   `crew-link-auth`, or override the names with the env vars below.
1. Request production access. A new SES account is in the sandbox, where mail
   is only delivered to verified addresses -- that silently breaks sign up for
   everyone else, so this step is not optional for a real deployment.
1. Create an IAM user limited to `ses:SendEmail` and take its access key pair.

### Firebase secrets

All three must be set, or the functions fail for every caller:

```
firebase functions:secrets:set AWS_ACCESS_KEY_ID
firebase functions:secrets:set AWS_SECRET_ACCESS_KEY
firebase functions:secrets:set OTP_HASH_SECRET
```

`OTP_HASH_SECRET` should be a high-entropy random value. It keys the HMAC for
both stored code hashes and rate-limit bucket ids, so rotating it invalidates
every in-flight code and resets rate-limit windows. Redeploy functions after
setting secrets.

### Firestore TTL

Sign-in attempts and rate-limit counters are written to the `authOtpAttempts`
and `authOtpRateLimits` collections. Neither is client readable (the default
deny rule in `firestore.rules` covers them), but both need a TTL policy so
spent documents get cleaned up. This cannot be expressed in `firebase.json`:

```
gcloud firestore fields ttls update expiresAt \
  --collection-group=authOtpAttempts --enable-ttl --project=<GCP_PROJECT_ID>

gcloud firestore fields ttls update expiresAt \
  --collection-group=authOtpRateLimits --enable-ttl --project=<GCP_PROJECT_ID>
```

TTL is a cleanup mechanism only, and deletion can lag by hours, so code expiry
stays enforced in `functions/src/authOtp.ts` as well.

### Optional env vars

Plain (non-secret) config, all with sensible defaults:
`SES_REGION` / `AWS_REGION`, `SES_IRONSWORN_CONFIGURATION_SET`,
`SES_STARFORGED_CONFIGURATION_SET`, `SES_IRONSWORN_FROM_EMAIL`,
`SES_STARFORGED_FROM_EMAIL`, `SES_FROM_EMAIL`, and the rate-limit caps
`OTP_IP_HOURLY_LIMIT` (default 10), `OTP_EMAIL_HOURLY_LIMIT` (default 6) and
`OTP_VERIFY_IP_HOURLY_LIMIT` (default 60).

Per-IP caps are derived from the leftmost `x-forwarded-for` entry, which is
client-supplied and therefore spoofable. They blunt cost and casual abuse; they
are not an authentication control. The per-email cap is what actually bounds
how much mail one address can be sent. Enabling Firebase App Check on both
callables is the durable fix, and is worth doing before this carries real
traffic.

## Posthog Setup (OPTIONAL)

Posthog gives us some light analytics (page views), and the ability to gate new features behind feature flags. If you need to set up posthog you can create a new project and then add the following to your `.env.local` file

```
VITE_POSTHOG_KEY=
VITE_POSTHOG_HOST=
```

---

With that, you should be all set up and ready to develop locally!
