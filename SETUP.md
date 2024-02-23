# Setup

## Steps

1. Clone this project `git clone https://github.com/scottbenton/Iron-Fellowship.git`
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
VITE_FAVICON_PATH=/crew-link-logo.svg
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

### Firestore

1. Under the `Build` tab on the left, select `Firestore Database`
1. Create a new database, choosing the location of your choice.
1. Once your database has been provisioned, click the `rules` tab, and copy the contents of the `firestore.rules` file into the tab

### Cloud Storage

1. Under the `Build` tab on the left, select `Storage`
1. Set up cloud storage, and wait for it to be created
1. Once your storage has been created, click the `rules` tab, and copy the contents of the `storage.rules` file into the tab

## Posthog Setup (OPTIONAL)

Posthog gives us some light analytics (page views), and the ability to gate new features behind feature flags. If you need to set up posthog you can create a new project and then add the following to your `.env.local` file

```
VITE_POSTHOG_KEY=
VITE_POSTHOG_HOST=
```

---

With that, you should be all set up and ready to develop locally!
