'use client';

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/card";
import { connectFactoryContract } from "@/app/contract-utils/connect-factory-contract";
import { connectCrowdfundingContract } from "@/app/contract-utils/connect-crowdfunding-contract";
import { ArrowRightIcon } from "lucide-react";

export default function AllCompaigns() {

  
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setCampaigns([]); // Reset campaigns before fetching
        const factoryContract = await connectFactoryContract();
        console.log("Factory Contract:", factoryContract);

        const allCampaigns = await factoryContract.getAllCampaigns();
        console.log("All Campaigns:", allCampaigns);

        setCampaigns(allCampaigns);

        // if (allCampaigns.length > 0 && allCampaigns[0]?.campaignAddress) {
        //   const crowdfundingContract = await connectCrowdfundingContract(allCampaigns[0].campaignAddress);
        //   console.log("Campaign", crowdfundingContract.name());
        // } else {
        //   console.warn("No campaigns found or no campaign address in allCampaigns[0]");
        // }
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.length === 0 ? (
        <p>Loading campaigns...</p>
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
                {campaign.paused ? (
                  <Button className="w-full bg-blue-500 text-white" disabled>
                    Paused
                  </Button>
                ) : (
                  <Button asChild className="w-full bg-blue-500 text-white">
                    <a href="/compaign-details">
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





