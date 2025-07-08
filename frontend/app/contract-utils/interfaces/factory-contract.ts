import { Campaign } from "@/app/utils/interfaces/campaign";
import { TransactionResponse } from "ethers";

export interface FactoryContract {
    getUserCampaigns(userAddress: string): Promise<Campaign[]>;
    getAllCampaigns(): Promise<Campaign[]>;
    createCampaign(
        name: string,
        description: string,
        minGoal: bigint,
        maxGoal: bigint,
        durationInDays: number
    ): Promise<void>;
    togglePause(): Promise<TransactionResponse>;
    owner(): Promise<string>;
    paused(): Promise<boolean>;


}