export class NoteNotFoundException extends Error {
  constructor(msg?: string) {
    super(msg ?? "Failed to find note.");
  }
}
