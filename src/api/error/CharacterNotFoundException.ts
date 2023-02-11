export class CharacterNotFoundException extends Error {
  constructor(msg?: string) {
    super(msg ?? "Could not find character.");
  }
}
