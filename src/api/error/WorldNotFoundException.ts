export class CampaignNotFoundException extends Error {
  constructor(msg?: string) {
    super(msg ?? "Failed to find your world.");
  }
}
