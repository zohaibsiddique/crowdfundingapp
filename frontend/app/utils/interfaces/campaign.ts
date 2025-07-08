export interface Campaign {
  campaignAddress: string;
  owner: string;
  name: string;
  creationTime: number; // Unix timestamp
  paused: boolean;
}