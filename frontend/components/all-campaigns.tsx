'use client';

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { connectFactoryContract } from "@/app/contract-utils/connect-factory-contract";
import { ArrowRightIcon } from "lucide-react";
import { Campaign } from "@/app/utils/interfaces/campaign";
import { connectCrowdfundingContract } from "@/app/contract-utils/connect-crowdfunding-contract";
import { ethers } from "ethers";
import { Progress } from "./ui/progress";

export default function AllCompaigns() {

  const [campaigns, setCampaigns] = useState<Campaign[]>([]); 
  const [campaignDetails, setCampaignDetails] = useState<Campaign[]>([]); 

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setCampaigns([]); // Reset campaigns before fetching
        const { contract} = await connectFactoryContract();
        const allCampaigns = await contract.getAllCampaigns();
        setCampaigns(allCampaigns);

        const campaignsData = [];
        for (let i = 0; i < allCampaigns.length; i++) {
          const crowdfundingContract = await connectCrowdfundingContract(allCampaigns[i].campaignAddress);
          const [
            name,
            description,
            minGoal,
            maxGoal,
            deadline,
            balance,
            state
          ] = await Promise.all([
            crowdfundingContract.name(),
            crowdfundingContract.description(),
            crowdfundingContract.minGoal(),
            crowdfundingContract.maxGoal(),
            crowdfundingContract.deadline(),
            crowdfundingContract.getContractBalance(),
            crowdfundingContract.getCampaignStatus()
          ]);
          campaignsData.push({
            campaignAddress: allCampaigns[i].campaignAddress,
            owner: allCampaigns[i].owner,
            name,
            description,
            minGoal: minGoal,
            maxGoal: maxGoal,
            deadline: deadline,
            balance: balance,
            state: state,
          });
          setCampaignDetails(campaignsData);
      }
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []); 

  const getProgress = (campaign: Campaign) => {
    const progress = (Number(campaign?.balance) / Number(campaign?.maxGoal)) * 100;
      return Math.min(progress, 100); // Ensure it doesn’t exceed 100%
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {loading ? (
      <p>Loading campaigns...</p>
      ) : campaigns.length === 0 ? (
      <p>No campaigns found.</p>
      ) : (
      campaigns.map((campaign, i) => {
        return (
        <Card key={i} className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="flex justify-between items-start">
              <span>{campaign.name}</span>
              <span className="text-xs text-gray-500 ml-2 self-center">
                {new Date(Number(campaign.creationTime) * 1000).toLocaleString()}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            
            <p>{campaignDetails[i].description}</p>
            
            <Progress className="mb-2" value={getProgress(campaignDetails[i])} />

            {campaign.paused ? (
              <Button className="w-full bg-blue-500 text-white" disabled>
              Paused
              </Button>
            ) : (
              <Button asChild className="w-full bg-blue-500 text-white">
              <a href={`/campaigns/${campaign.campaignAddress}`}>
                <span>View Campaign</span>
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </a>
              </Button>
            )}
          </CardContent>
        </Card>
        );
      })
      )}
    </div>
  );
}





