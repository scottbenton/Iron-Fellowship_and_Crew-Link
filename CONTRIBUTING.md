# Contributing

Any development help on this project is more than welcome!
New features should be developed in feature branches, and then will be merged into the `prod` branch to deploy to production.

New features should be gated behind feature flags, until they are fully tested, which I can create from [posthog](posthog.com/). We can work out the details whenever you create a pull request for your work!

### Setup

1. Clone this project `git clone https://github.com/scottbenton/Iron-Fellowship.git`
1. Install dependencies `npm i`
1. Set up firebase (see Firebase Setup below)
1. Run `npm run dev` and go to your browser to see the output.

### Firebase Setup

Firebase provides authentication, database, and image storage to this application.

The first step is to create a firebase project. You can do this by going to the [firebase console](https://console.firebase.google.com/). Once you have created a project, you will need to register a web app.

![Firebase Web App Setup](./readme_assets/FirebaseWeb.png)

In order to run the application locally, you will need to set up a `.env.local` file with the information firebase needs to connect to these services.

Once registered the web app, it will give you a config object. Copy the values from this object into your `.env.local` file in the following properties:

```
VITE_FIREBASE_APIKEY=
VITE_FIREBASE_AUTHDOMAIN=
VITE_FIREBASE_PROJECTID=
VITE_FIREBASE_STORAGEBUCKET=
VITE_FIREBASE_MESSAGINGSENDERID=
VITE_FIREBASE_APPID=
```

Also remember to enable Google Authentication as provider in your firebase project. You can do this by going to the Authentication tab in the firebase console.

### Posthog Setup (OPTIONAL)

Posthog gives us some light analytics (page views), and the ability to gate new features behind feature flags. If you need to set up posthog you can create a new project and then add the following to your `.env.local` file

```
VITE_POSTHOG_KEY=
VITE_POSTHOG_HOST=
```
