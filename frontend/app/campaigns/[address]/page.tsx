'use client'
import { connectCrowdfundingContract } from '@/app/contract-utils/connect-crowdfunding-contract';
import { CrowdfundingContract } from '@/app/contract-utils/interfaces/crowdfunding-contract';
import { Campaign } from '@/app/utils/interfaces/campaign';
import { Tier } from '@/app/utils/interfaces/tier';
import NavBarCampaigns from '@/components/nav-bar-campaigns';
import TiersSection from '@/components/tiers-section';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useWallet } from '@/components/wallet-provider';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';


const CampaignPage = () => {
    const params = useParams();
    const campaignAddress = params?.address as string | undefined;

    if (!campaignAddress) {
        return <div>Loading...</div>;
    }

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAddTierForm, setShowAddTierForm] = useState(false);
    const [progress, setProgress] = useState<string | {message: string, index?: number}>("");
    const [paused, setPaused] = useState<boolean | null>(null);
    const [contract, setContract] = useState<CrowdfundingContract | null>(null);
    const { wallet } = useWallet();

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

        if (wallet?.address) {
            init();
        }

    }, [wallet]);

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
                const myContributon = await crowdfundingContract.getBackerContribution(wallet?.address);
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
    
          setProgress("Tier added successfully!");
          setShowAddTierForm(false)
          setTimeout(() => setProgress(""), 1500); // Auto close dialog after success

          fetchData(); // Refresh campaign data after adding tier
        } catch (error: any) {
          if (!isMounted) return;
          setProgress(`Error: ${error.message || "Failed to add tier."}`);
          setTimeout(() => setProgress(""), 2500); // Auto close dialog after error
        }
    
        return () => {
          isMounted = false;
        };
      };

    const fund = async (tierIndex: number) => {
        if (!campaignAddress || !Array.isArray(campaign?.tiers)) return;
        try {
            setProgress({ message: "Connecting to contract...", index: tierIndex });
            const tier = campaign?.tiers[tierIndex];
            if (!tier) throw new Error("Tier not found");
            setProgress({ message: "Sending funds...", index: tierIndex });
            const tx = await contract?.fund(tierIndex, { value: tier.amount });
            await tx.wait();
            setProgress({ message: "Funded successfully!", index: tierIndex });
            setTimeout(() => setProgress(""), 1500);
        } catch (error: any) {
            setProgress({ message: `Error: ${error.message || "Failed to fund."}`, index: tierIndex });
            setTimeout(() => setProgress(""), 2500);
        }
    };

    const removeTier = async (tierIndex: number) => {
        if (!campaignAddress || !Array.isArray(campaign?.tiers)) return;
        try {
            setProgress({ message: "Connecting to contract...", index: tierIndex });
            const tier = campaign.tiers[tierIndex];
            if (!tier) throw new Error("Tier not found");
            setProgress({ message: "Removing Tier", index: tierIndex });
            const tx = await contract?.removeTier(tierIndex);
            await tx.wait();
            setProgress({ message: "Tier removed", index: tierIndex });
            setTimeout(() => setProgress(""), 1500);
        } catch (error: any) {
            setProgress({ message: `Error: ${error.message || "Failed to remove Tier."}`, index: tierIndex });
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
            setProgress({ message: "Connecting to contract..."});
            setProgress({ message: "Withdrawing funds..."});
            const tx = await contract?.withdraw();
            await tx.wait();
            setProgress({ message: "Withdraw successfully!" });
            setTimeout(() => setProgress(""), 1500);
        } catch (error: any) {
            setProgress({ message: `Error: ${error.message || "Failed to withdraw fund."}` });
            setTimeout(() => setProgress(""), 2500);
        }
    };

    const handleRefund = async () => {
        if (!campaignAddress) return;
        try {
            setProgress({ message: "Connecting to contract..."});
            setProgress({ message: "Refunding..."});
            const tx = await contract?.refund();
            await tx.wait();
            setProgress({ message: "Refund successfull!" });
            setTimeout(() => setProgress(""), 1500);
        } catch (error: any) {
            setProgress({ message: `Error: ${error.message || "Failed to refund fund."}` });
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
        } catch (err) {
            console.error("Error toggling pause:", err);
        }
    };

    const isOwner = () => wallet?.address.toLowerCase() === campaign?.owner?.toLowerCase();

    return (
        <>
            <NavBarCampaigns />
            <div className="max-w-xl mx-auto my-8">
                <h1 className="text-3xl mb-6 text-gray-800 font-bold">Campaign Details</h1>
                <div className="mb-4">
                    <strong>Campaign Address:</strong>
                    <div className="break-all text-gray-600">{campaignAddress}</div>
                </div>
                {loading ? (
                    <div>Loading campaign data...</div>
                ) : (
                    <>  
                        {isOwner() && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm">{paused ? "Paused" : "Active"}</span>
                                <Switch checked={!paused} onCheckedChange={togglePause} />
                            </div>
                        )}
                                 
                        {(campaign?.state === 1 || campaign?.state === 3 && isOwner()) && (
                            <div className="text-right">
                                <button
                                onClick={handleWithdraw}
                                className="bg-green-600 hover:bg-green-700 text-white p-2"
                                >
                                Withdraw
                                </button>
                                <span>{typeof progress === "string"? progress: progress.message}</span>
                            </div>
                        )}

                         {campaign?.state === 2 && (
                            <div className="text-right">
                                <button
                                    onClick={handleRefund}
                                    className="bg-gray-600 hover:bg-gray-700 text-white p-2"
                                >
                                    Refund
                                </button>
                                <span>{typeof progress === "string"? progress: progress.message}</span>
                            </div>
                        )}

                        <div className="text-xs text-muted-foreground text-right">
                            {Number(campaign?.balance)} / {Number(campaign?.maxGoal)}
                        </div>
                        <Progress value={getProgress()} />
                        
                        <div>
                            <strong>My Contribution:</strong>{" "}
                            <span className="text-green-600">{campaign?.myContributon ?? 0 }</span>
                        </div>

                        <div>
                            <strong>Minimum Goal:</strong>{" "}
                            <span className="text-green-600">{campaign?.minGoal.toString()}</span>
                        </div>
                        <div>
                            <strong>Maximum Goal:</strong>{" "}
                            <span className="text-green-600">{campaign?.maxGoal.toString()}</span>
                        </div>
                        <div>
                            <strong>Balance</strong>{" "}
                            <span className="text-green-600">{campaign?.balance.toString()}</span>
                        </div>
                        <div>
                            <strong>Deadline:</strong>{" "}
                            <span className="text-yellow-600">
                                {new Date(Number(campaign?.deadline) * 1000).toLocaleString()}
                            </span>
                        </div>
                        <div>
                            <strong>Owner:</strong>
                            <div className="break-all text-gray-600">{campaign?.owner}</div>
                        </div>
                        <div>
                            <strong>Status:</strong>
                            <span className={`font-semibold ml-2 ${campaign?.paused === true ? 'text-red-600' : 'text-green-600'}`}>
                                {campaign?.paused === true ? 'Paused' : 'Active'}
                            </span>
                        </div>
                        <div>
                            <strong>Campaign State:{campaign?.state}</strong>
                            <span className="ml-2 font-semibold">
                                {["Active", "Successful", "Failed"][Number(campaign?.state)] ?? "Unknown"}
                            </span>
                        </div>
                        <TiersSection
                            tiers={campaign?.tiers || []}
                            state={campaign?.state.toString() || "0"}
                            progress={progress}
                            fund={fund}
                            isOwner={isOwner()}
                            removeTier = {removeTier}
                            showAddTierForm={showAddTierForm}
                            setShowAddTierForm={setShowAddTierForm}
                            handleSubmit={handleSubmit}
                            handleChange={handleChange}
                        />
                    </>   
                )}
            </div>
        </>
        
    );
};

export default CampaignPage;