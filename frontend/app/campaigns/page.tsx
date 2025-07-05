'use client';

import NavBarCampaigns from '@/components/nav-bar-campaigns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import AllCampaigns from '@/components/all-campaigns';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { connectFactoryContract } from '../contract-utils/connect-factory-contract';
import { Switch } from '@/components/ui/switch';
import MyCompaigns from '@/components/my-campaigns';

export default function CampaignsPage() {
  
  const [paused, setPaused] = useState<boolean | null>(null);
  const [contract, setContract] = useState(null);

   useEffect(() => {

      const init = async () => {
        try {
          const { contract, paused } = await connectFactoryContract();
          setContract(contract);
          setPaused(paused);
        } catch (err) {
          console.error("Error initializing contract:", err);
        }
      };
      init();
    }, []);

     // Toggle handler
  const togglePause = async () => {
    if (!contract) return;
    try {
      const tx = await contract.togglePause();
      await tx.wait(); // wait for tx to confirm
      const pauseState = await contract.paused();
      setPaused(pauseState);
    } catch (err) {
      console.error("Error toggling pause:", err);
    }
  };
    
  return (
    <div className="min-h-screen">
      {/* --- Nav bar --- */}
      <NavBarCampaigns/>
       
      <div className="px-2">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col md:flex-row gap-2">
            {/* Left Side Tabs */}
            <TabsList className="flex md:flex-col gap-2 md:w-1/4 w-full">
              <TabsTrigger value="all" className="justify-start">All Campaigns</TabsTrigger>
              <TabsTrigger value="my" className="justify-start">My Campaigns</TabsTrigger>
              <TabsTrigger value="funded" className="justify-start">Funded Campaigns</TabsTrigger>
            </TabsList>

            {/* Right Side Content */}
            <div className="md:w-3/4 w-full">
              <TabsContent value="all">
                <Card className='border-none shadow-none'>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>All Campaigns</CardTitle>
                      <Button
                        asChild
                        className="text-white bg-green-500"
                        disabled={paused === true}>
                        <Link
                          href={paused === true ? "#" : "/campaigns/create-campaign"}
                          aria-label="Create a new campaign"
                          aria-disabled={paused === true}
                          style={paused === true ? { pointerEvents: "none", opacity: 0.5 } : {}}
                        >
                          New Campaign
                        </Link>
                      </Button>
                      {paused !== null && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{paused ? "Paused" : "Active"}</span>
                          <Switch checked={!paused} onCheckedChange={togglePause} />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <AllCampaigns/>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="my">
                <Card className='border-none shadow-none'>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>My Campaigns</CardTitle>
                      <Button asChild className="text-white bg-green-500">
                        <Link href="/campaigns/create-campaign" aria-label="Create a new campaign">
                          New Campaign
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <MyCompaigns/>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="funded">
                <Card className='border-none shadow-none'>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Funded Campaigns</CardTitle>
                      <Button asChild className="text-white bg-green-500">
                        <Link href="/campaigns/create-campaign" aria-label="Create a new campaign">
                          New Campaign
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <AllCampaigns/>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
      
    </div>
  );
}
