export interface CrowdfundingContract {
  name(): Promise<string>;
  description(): Promise<string>;
  minGoal(): Promise<BigInt>;
  maxGoal(): Promise<BigInt>;
  deadline(): Promise<BigInt>;
  owner(): Promise<string>;
  paused(): Promise<boolean>;
  state(): Promise<number>;
  getTiers(): Promise<Array<{ name: string; amount: BigInt; backers: BigInt }>>;
  getContractBalance(): Promise<BigInt>;
  getBackerContribution(address: string): Promise<BigInt>;
  addTier(name: string, amount: BigInt): Promise<any>;
  removeTier(index: number): Promise<any>;
  fund(index: number, overrides?: { value: BigInt }): Promise<any>;
  withdraw(): Promise<any>;
  refund(): Promise<any>;
  hasFundedTier(backer: string, tierIndex: number): Promise<boolean>;
  togglePause(): Promise<any>;
  getCampaignStatus(): Promise<number>;
  extendDeadline(daysToAdd: number): Promise<any>;
}