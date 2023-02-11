export class UserNotLoggedInException extends Error {
  constructor(msg?: string) {
    super(msg ?? "You must be logged in to perform this action.");
  }
}
