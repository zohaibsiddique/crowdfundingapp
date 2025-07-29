'use client'
import { connectCrowdfundingContract } from '@/app/contract-utils/connect-crowdfunding-contract';
import { CrowdfundingContract } from '@/app/contract-utils/interfaces/crowdfunding-contract';
import { Campaign } from '@/app/utils/interfaces/campaign';
import { Tier } from '@/app/utils/interfaces/tier';
import NavBarCampaigns from '@/components/nav-bar-campaigns';
import TiersSection from '@/components/tiers-section';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from "sonner"
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import CampaignSkeleton from '@/components/campaign-skeleton';
import { Anybody } from 'next/font/google';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CampaignPage = () => {
    const params = useParams();
    const campaignAddress = params?.address as string | undefined;

    if (!campaignAddress) {
        return <div>Loading...</div>;
    }

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAddTierForm, setShowAddTierForm] = useState(false);
    const [progress, setProgress] = useState<string>("");
    const [paused, setPaused] = useState<boolean | null>(null);
    const [contract, setContract] = useState<CrowdfundingContract | null>(null);
    const { address, isConnected } = useAccount();

    const [form, setForm] = useState({
        name: "",
        amount: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    useEffect(() => {

        const init = async () => {
            try {
                fetchData();
            } catch (err) {
                console.error("Error initializing contract:", err);
            }
        };

        if (address) {
            init();
        }

    }, [address, isConnected]);

    const fetchData = async () => {
        const crowdfundingContract = await connectCrowdfundingContract(campaignAddress);
        console.log(crowdfundingContract)
        setContract(crowdfundingContract as unknown as CrowdfundingContract);
        
        const fetchCampaign = async () => {
            try {
                setLoading(true);
                setCampaign(null); // Reset campaign before fetching

                const name = await crowdfundingContract.name();
                const description = await crowdfundingContract.description();
                const minGoal = await crowdfundingContract.minGoal();
                const maxGoal = await crowdfundingContract.maxGoal();
                const deadline = await crowdfundingContract.deadline();
                const owner = await crowdfundingContract.owner();
                const paused = await crowdfundingContract.paused();
                const tiers = await crowdfundingContract.getTiers();
                const state = await crowdfundingContract.state();
                const balance = await crowdfundingContract.getContractBalance();
                const formattedTiers = tiers.map((tier: Tier, idx: number) => ({
                    index: idx,
                    name: tier.name.toString(),
                    amount: tier.amount.toString(),
                    backers: tier.backers.toString(),
                }));
                const myContributon = await crowdfundingContract.getBackerContribution(address);
                const campaign = {
                    name: name.toString(),
                    description: description.toString(),
                    minGoal: minGoal.toString(),
                    maxGoal: maxGoal.toString(),
                    deadline: deadline.toString(),
                    owner: owner.toString(),
                    paused: paused.toString(),
                    state: state.toString(),
                    tiers: formattedTiers,
                    balance: balance.toString(),
                    myContributon: myContributon.toString(),
                    campaignAddress: campaignAddress, 
                    creationTime: 0, 

                };
                // Set the campaign state with the fetched data
                setCampaign(campaign);

            } catch (err) {
                console.error("Error fetching campaigns:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaign();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        let isMounted = true;
        setProgress("Connecting to contract...");
    
        try {
          if (!isMounted) return;
    
          setProgress("Adding Tier...");

          if (!contract) throw new Error("Contract not connected");
          const tx = await contract.addTier(
            form.name,
            BigInt(form.amount),
          );
          await tx.wait(); // wait for tx to confirm

          if (!isMounted) return;
    
          toast.success("Tier added successfully!")
          setShowAddTierForm(false)
          setTimeout(() => setProgress(""), 1500); // Auto close dialog after success

          fetchData(); // Refresh campaign data after adding tier
        } catch (error: any) {
          if (!isMounted) return;
          toast.error(error.reason || "Failed to add tier.")
          setTimeout(() => setProgress(""), 2500); // Auto close dialog after error
        }
    
        return () => {
          isMounted = false;
        };
      };

    const fund = async (tierIndex: number) => {
        if (!campaignAddress || !Array.isArray(campaign?.tiers)) return;
        try {
            setProgress("Connecting to contract..." );
            const tier = campaign?.tiers[tierIndex];
            if (!tier) throw new Error("Tier not found");
            setProgress("Sending funds...");
            const tx = await contract?.fund(tierIndex, { value: tier.amount });
            await tx.wait();

            toast.success("Funded successfully!")
            setTimeout(() => setProgress(""), 1500);

            fetchData(); // Refresh campaign data after funding
        } catch (error: any) {
            toast.error(error.reason || "Failed to fund tier.")
            setTimeout(() => setProgress(""), 2500);
        }
    };

    const removeTier = async (tierIndex: number) => {
        if (!campaignAddress || !Array.isArray(campaign?.tiers)) return;
        try {
            setProgress("Connecting to contract...");
            const tier = campaign.tiers[tierIndex];
            if (!tier) throw new Error("Tier not found");
            setProgress("Removing Tier");
            const tx = await contract?.removeTier(tierIndex);
            await tx.wait();

            toast.success("Tier removed")
            setTimeout(() => setProgress(""), 1500);

            fetchData(); // Refresh campaign data after removing tier
        } catch (error: any) {
            toast.error(error.reason || "Failed to remove Tier.")
            setTimeout(() => setProgress(""), 2500);
        }
    };

    const getProgress = () => {
      const progress = (Number(campaign?.balance) / Number(campaign?.maxGoal)) * 100;
       return Math.min(progress, 100); // Ensure it doesn’t exceed 100%
    };

    const handleWithdraw = async () => {
        if (!campaignAddress) return;
        try {
            setProgress("Connecting to contract...");
            setProgress("Withdrawing funds...");
            const tx = await contract?.withdraw();
            await tx.wait();

            toast.success("Withdraw successfully!")
            setTimeout(() => setProgress(""), 1500);
        } catch (error: any) {
            toast.error(error.reason || "Failed to withdraw fund.")
            setTimeout(() => setProgress(""), 2500);
        }
    };

    const handleRefund = async () => {
        if (!campaignAddress) return;
        try {
            setProgress("Connecting to contract...");
            setProgress("Refunding...");
            const tx = await contract?.refund();
            await tx.wait();

            toast.success("Refund successfull!")
            setTimeout(() => setProgress(""), 1500);
        } catch (error: any) {
            toast.error(error.reason || "Failed to refund fund.")
            setTimeout(() => setProgress(""), 2500);
        }
    };

    // Toggle handler
    const togglePause = async () => {
        if (!contract) return;
        try {
            const tx = await contract.togglePause();
            await tx.wait(); // wait for tx to confirm
            const pauseState = await contract.paused();
            setPaused(pauseState);
        } catch (error: any) {
            toast.error(error.reason || "Failed to toggle.")
        }
    };

    const isOwner = () => address?.toLowerCase() === campaign?.owner?.toLowerCase();

    return (
        <>
            <NavBarCampaigns />

            <Dialog open={!!progress} onOpenChange={() => setProgress("")}>
                <DialogContent className="sm:max-w-md text-center">
                <DialogHeader>
                    <DialogTitle>Processing</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center gap-4 py-6">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                    <p className="text-sm text-muted-foreground">{progress}</p>
                </div>
                </DialogContent>
            </Dialog>

            
            {loading ? (
                    <CampaignSkeleton/>
                ) : (

                <div className="max-w-xl mx-auto my-4 ">
                    <div className="w-fit mx-auto border border-gray-300 rounded-md p-4 my-4 text-center">
                        <span className="block text-sm text-gray-700">Balance</span>
                        <span className=" text-lg font-bold">
                            {campaign?.balance}
                        </span>
                    </div>
                   
                    <div className="flex justify-between">
                        <div>
                            <strong>{campaign?.name}</strong>
                            <div className="break-all text-gray-600">{campaign?.description}</div>
                        </div>
                        {isOwner() && (
                            <div className="flex gap-2">
                                <span className="text-sm">{paused ? "Paused" : "Active"}</span>
                                <Switch checked={!paused} onCheckedChange={togglePause} />
                            </div>
                        )}
                    </div>
                    

                    <div className="text-xs text-muted-foreground text-right">
                        {Number(campaign?.balance)} / {Number(campaign?.maxGoal)}
                    </div>
                    <Progress value={getProgress()} />

                    <div className='mt-2'>
                        <span className='mr-4'>Minimum Goal:</span>
                        <span className="">{campaign?.minGoal}</span>
                    </div>

                    <div className='mt-2'>
                        <span className='mr-4'>Maximum Goal:</span>
                        <span className="  ">{campaign?.maxGoal}</span>
                    </div>

                        <div className='mt-2'>
                        <span className='mr-2'>Deadline:</span>
                        <span className="">
                            {new Date(Number(campaign?.deadline) * 1000).toLocaleString()}
                        </span>
                    </div>

                     {/* withdraw buttons */}
                    {isOwner() && (campaign?.state == 1 || campaign?.state == 3) && (
                        <div className="text-right">
                            <Button
                                onClick={handleWithdraw}
                                className=" bg-green-500 hover:bg-green-700 text-white p-2"
                            >
                            Withdraw
                            </Button>
                        </div>
                    )}

                    {/* Refund */}
                    {campaign?.state == 2 && (
                        <div className="text-right">
                            <Button
                                onClick={handleRefund}
                                className="bg-gray-500 hover:bg-gray-700 text-white p-2"
                            >
                                Refund
                            </Button>
                        </div>
                    )}

                    <TiersSection
                        tiers={campaign?.tiers || []}
                        state={campaign?.state?.toString() || "0"}
                        progress={progress}
                        fund={fund}
                        isOwner={isOwner()}
                        removeTier = {removeTier}
                        showAddTierForm={showAddTierForm}
                        setShowAddTierForm={setShowAddTierForm}
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                    />
                </div>
            )}
        </>
        
    );
};

export default CampaignPage;