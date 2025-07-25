'use client';

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { connectFactoryContract } from "@/app/contract-utils/connect-factory-contract";
import { ArrowRightIcon } from "lucide-react";
import { Campaign } from "@/app/utils/interfaces/campaign";
import { useAccount } from 'wagmi';

export default function MyCompaigns() {

  const { address, isConnected } = useAccount();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!isConnected) return;
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setCampaigns([]); // Reset campaigns before fetching
        const { contract} = await connectFactoryContract();
        const allCampaigns = await contract.getUserCampaigns(address || "");
        setCampaigns(allCampaigns);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [address, isConnected]);

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





