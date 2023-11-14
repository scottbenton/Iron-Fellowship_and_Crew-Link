# Changelog

## 2.1.0

### New Features

### Changes

- Added ability to remove lore, location, and NPC images by making them fullscreen and clicking the delete button
- Moved Oracle tab to be with moves on desktop devices
- Moved oracle pins to be in the oracle dialog to save space
- Removed "Ask the Oracle" oracles from the oracle list, since they are pinned up top

### Accessibility

### Bug Fixes

- Fixed custom asset tracks not appearing if they weren't added initially
- Fixed oracle results that point to an oracle table not appearing correctly
- Removed links to oracles and moves that don't exist

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
