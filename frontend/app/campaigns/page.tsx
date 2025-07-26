'use client';

import NavBarCampaigns from '@/components/nav-bar-campaigns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { FactoryContract } from '../contract-utils/interfaces/factory-contract';
import { useAccount } from 'wagmi';

export default function CampaignsPage() {
  
  const [paused, setPaused] = useState<boolean | null>(null);
  const [contract, setContract] = useState<FactoryContract | null>(null);
  const { address, isConnected } = useAccount();
  const [isOwner, setIsOwner] = useState(false);
   
   useEffect(() => {

      const init = async () => {
        try {
          const { contract, paused } = await connectFactoryContract();
          const owner = await contract.owner()
          if (isConnected && address) {
            setIsOwner(Boolean(address && address.toLowerCase() === owner.toLowerCase()));
          }
          setContract(contract as unknown as FactoryContract);
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
       
        <Tabs defaultValue="all" className="">
            <TabsList className="flex items-center mx-auto">
              <TabsTrigger value="all" className="justify-start">All Campaigns</TabsTrigger>
              <TabsTrigger value="my" className="justify-start">My Campaigns</TabsTrigger>
              <TabsTrigger value="funded" className="justify-start">Funded Campaigns</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card className='border-none shadow-none'>
                <CardHeader>
                  <div className="flex flex-row justify-between">
                    <CardTitle>All Campaigns</CardTitle>
                    <div className='flex gap-6'>
                       {/* {(paused !== null && isOwner) && ( */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{paused ? "Paused" : "Active"}</span>
                          <Switch checked={!paused} onCheckedChange={togglePause} />
                        </div>
                      {/* )} */}
                      <Button
                        asChild
                        className="text-white bg-green-500 hover:bg-green-700"
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
                     
                    </div>
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
        </Tabs>
    </div>
  );
}
