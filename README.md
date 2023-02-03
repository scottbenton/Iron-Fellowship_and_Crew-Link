# Iron Fellowship

Welcome! Iron Fellowship is an application for anyone playing the Tabletop RPG [Ironsworn](https://www.ironswornrpg.com/) to use.
Featuring a clean character sheet, campaigns with shared assets and tracks, and cloud sync across all your devices.

## Features

### Character Sheet

![Character Sheet Screenshot](./readme_assets/CharacterView.png)

- Quickly view your characters stats.
- View moves, and use the built in dice roller to determine success or failure.
- View and update your character's assets, even creating your own custom asset cards.
- Update personal and shared tracks.
- Share a supply track with other members of your campaign.

### Campaigns

![Campaign View Screenshot](./readme_assets/CampaignView.png)

- Share a supply track, vows, and more with your party.
- Invite new players to your campaign with a simple invite link.

### Future Changes

There is more to come for the Iron Fellowship.
Note keeping, NPCs, Combat Tracking, and Oracle tables are on the backlog.
Keep checking back!

## Development

Any development help on this project is more than welcome!
New features should be developed in feature branches, and then merged into the `dev` branch to deploy to our [development environment](https://dev.iron-fellowship.scottbenton.dev). Once our dev branch is at a point where everything looks good to ship, we can merge into the `main` branch to deploy to our production environment.

### Setup

1. Clone this project `git clone https://github.com/scottbenton/Iron-Journal.git`
1. Install dependencies `npm i`
1. Set up firebase (see Firebase Setup below)
1. Run `npm run dev` and go to your browser to see the output.

### Firebase Setup

Firebase provides authentication, database, and image storage to this application. In order to run the application locally, you will need to set up a `.env.local` file with the information firebase needs to connect to these services. You can either get access to the dev environment from me, or you can set up your own firebase instance. Either way, you will need to fill out your `.env.local` file, adding values to the following properties.

```
VITE_FIREBASE_APIKEY=
VITE_FIREBASE_AUTHDOMAIN=
VITE_FIREBASE_PROJECTID=
VITE_FIREBASE_STORAGEBUCKET=
VITE_FIREBASE_MESSAGINGSENDERID=
VITE_FIREBASE_APPID=
```
