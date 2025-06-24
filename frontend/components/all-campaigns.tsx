'use client';

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { connectFactoryContract } from "@/app/contract-utils/connect-factory-contract";
import { connectCrowdfundingContract } from "@/app/contract-utils/connect-crowdfunding-contract";

export default function AllCompaigns() {

  const campaigns = [
    {
      id: 1,
      name: "Education for All",
      description: "Help provide quality education to underprivileged children.",
      duration: "30 Days Left",
      raised: 12500,
      goal: 20000,
      backers: 150,
      paused: true,
    },
    {
      id: 2,
      name: "Clean Water Project",
      description: "Support building wells in rural areas to ensure access to clean water.",
      duration: "15 Days Left",
      raised: 8200,
      goal: 10000,
      backers: 500,
      paused: false,
    },
    {
      id: 3,
      name: "Medical Aid for Refugees",
      description: "Provide emergency medical supplies and care for displaced families.",
      duration: "10 Days Left",
      raised: 5750,
      goal: 15000,
      backers: 200,
      paused: false,
    },
  ];

  const [campaignss, setCampaignss] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const factoryContract = await connectFactoryContract();
        console.log("Factory Contract:", factoryContract);

        const allCampaigns = await factoryContract.getAllCampaigns();
        console.log("All Campaigns:", allCampaigns);

        // setCampaignss(allCampaigns);

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
          const progress =
            Number(campaign.raised) && Number(campaign.goal)
              ? (Number(campaign.raised) / Number(campaign.goal)) * 100
              : 0;

          return (
            <Card key={i} className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle>{campaign.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2">{campaign.description}</p>
                <p className="text-sm text-gray-500 mb-1">
                  Duration: {campaign.duration}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  Raised: {campaign.raised} / {campaign.goal}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Backers: {campaign.backers || 0}
                </p>

                <Progress value={progress} className="mb-4 h-3" />
                {campaign.paused ? (
                  <Button className="w-full bg-blue-500 text-white" disabled>
                    Paused
                  </Button>
                ) : (
                  <Button asChild className="w-full bg-blue-500 text-white">
                    <a href="/compaign-details">Details</a>
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





