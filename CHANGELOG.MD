# Changelog

## 3.0.0

### New Features

- Added new pages for custom content management

### Changes

- Changed the layout of the app
- Added ability to add extra experience points past 30 (Ironsworn)
- Added the ability to delete Rolls from the log (AnnB)
- Added ability for GMs to remove other players and their characters from campaigns
- Added the ability for users to view completed campaign & character tracks and clocks

### Bug Fixes

- Fixed cursor issue on the notes page with mobile Safari
- Fixed a performance issue that made switching tabs super slow
- Fixed a few crashes that could occur when switching pages after the application updated in the background
- Fixed an issue on the sectors page where saving would cause users to be kicked from the notes box

## 2.2.0

### New Features

- Added a new beta tests dialog in the user settings menu - this will allow me to test changes before fully releasing them
- Added the ability to copy rolls to the clipboard
- Added the ability to reroll rolls
- Added the ability to burn momentum to update rolls
- Added a search box to the asset card dialog to make find assets quicker

### Changes

- Added ability to remove lore, location, and NPC images by making them fullscreen and clicking the delete button
- Moved Oracle tab to be with moves on desktop devices
- Moved oracle pins to be in the oracle dialog to save space
- Removed "Ask the Oracle" oracles from the oracle list, since they are pinned up top
- Added a test mobile view for moves and oracles
- Redesigned stats and tracks sections on mobile
- Redesigned moves and oracles to make each section collapsible
- Added bond tracks, experience, and legacy tracks to the character cards on the GM screen
- Added a checkbox to reset track progress when changing the difficulty of a progress track
- Changed labels for matches and ones on the action die
- Characters that are at a bonded location can now also be bonded with individually

### Accessibility

- Disabled oracles and moves when collapsing sections to prevent tab focus being lost
- Removed a couple of instances of unexpected focusing around the app.
- Updated list pages (character, campaign, and world) to fix a few accessibility issues

### Bug Fixes

- Fixed custom asset tracks not appearing if they weren't added initially
- Fixed oracle results that point to an oracle table not appearing correctly
- Removed links to oracles and moves that don't exist
- Fixed an issue where deleting a custom move caused the app to crash
- Made some performance improvements on the character view
- Fixed shared tracks not showing up in the move rollers
- Prevented oracle inputs from reordering themselves
- Cleaned up a few error messages across the app

---

## 2.1.0

### New Features

- Added ability to upload images to NPCs, Ironsworn locations, and lore documents

### Changes

- Added ability to remove character portraits
- Added ability to delete sectors (meathox)
- Added some extra text and styling to make rolls of 1's more obvious (meathox)
- World owners will no longer see Location, NPC, and Lore GM notes on the character sheet if they aren't the GM

### Accessibility

- Improved tab focus indicators
- Changed progress tracks to use the meter aria-role, and added announcements to the increment and decrement buttons
- Changed stat tracks and custom stat tracks to be radio buttons under the surface for better screen reader support

### Bug Fixes

- Fixed Planet Class not being properly set when creating new planets
- Fixed custom move and custom oracle ids not being created properly
- Fixed action rolls being able to go over a 10 on the d6.
- Fixed custom oracles not being pinned properly

---

## 2.0.0

### New Features

- Added Starforged!
- Added sectors in Starforged worlds
- Added new NPC options for Starforged games
- Added shared assets for Starforged games
- Added clocks for Starforged games

### Changes

- Simplified world creation so that you no longer need to go through all the world truths when creating a world.
- Progress tracks are no longer deleted upon completion, but are hidden from the user for now
- Slightly changed look of NPC view
- Added move name to the roll log

### Accessibility

- Added a skip link to the application
- Added screen reader feedback to text inputs with attached oracle roll buttons
- Added screen reader feedback to other rolls

### Bug Fixes

- Fixed a bug on read only rich text editors that still allowed cursors to appear
- Fixed an incorrect oracle link on the Loyalist asset
- Fixed progress tracks breaking whenever a user used a period in the title
- Fixed notes sometimes not saving when the browser is closed on mobile
- Fixed pinned oracles not working

---

## 1.3.0

### New Features

- Added a "Role" type to custom assets, in case users are playing with custom roles
- Added the ability for GMs (in multiplayer) and players (in singleplayer) to define custom stats for their campaigns or characters
- Added the ability for GMs (in multiplayer) and players (in singleplayer) to define custom tracks for their campaigns or characters
- Custom stats and tracks can now be used in custom moves

### Changes

- Removed restrictions on number of abilities when creating or modifying custom assets.

### Bug Fixes

- Fixed a bug when switching GMs that didn't allow the new GM access to the world
- Fixed non companion assets with tracks showing up in the "Companion Endure Harm" Move

---

## 1.2.0

### New Features

- Added an input in the character sheet header for "Adds", allowing users to add roll modifiers to rolls
- Added bonds checkbox to locations & NPCs to track bonds
- Added a dark theme. Click your user icon in the top right corner to switch themes.
- Added NPC list to locations, showing the NPCs that are present at that location

### Changes

- Character Creation Changes
  - Users can now select a character portrait when creating a character
  - Users can now choose to enter in custom stat values instead of being limited to the standard array
  - Adding assets during character creation is now optional
  - Assets can now be modified during character creation (ex: Giving a companion a name)
- Added ability to filter out Ironsworn Delve moves and oracles.

### Bug Fixes

- Fixed notes autosaving causing users to be kicked out of the text box.

---
