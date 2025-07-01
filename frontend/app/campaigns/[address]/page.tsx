'use client'
import { connectCrowdfundingContract } from '@/app/contract-utils/connect-crowdfunding-contract';
import NavBarCampaigns from '@/components/nav-bar-campaigns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const CampaignPage = () => {
    const params = useParams();
    const campaignAddress = params?.address as string | undefined;

    if (!campaignAddress) {
        return <div>Loading...</div>;
    }

    const [campaign, setCampaign] = useState({});
    const [loading, setLoading] = useState(true);
    const [showAddTierForm, setShowAddTierForm] = useState(false);
    const [progress, setProgress] = useState<string>("");
    const [form, setForm] = useState({
        _name: "",
        _description: "",
        _minGoal: "",
        _maxGoal: "",
        _durationInDays: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                setLoading(true);
                setCampaign({}); // Reset campaign before fetching
                
                const crowdfundingContract = await connectCrowdfundingContract(campaignAddress);

                const name = await crowdfundingContract.name();
                const description = await crowdfundingContract.description();
                const minGoal = await crowdfundingContract.minGoal();
                const maxGoal = await crowdfundingContract.maxGoal();
                const deadline = await crowdfundingContract.deadline();
                const owner = await crowdfundingContract.owner();
                const paused = await crowdfundingContract.paused();
                const tiers = await crowdfundingContract.getTiers();
                const state = await crowdfundingContract.state();
                const formattedTiers = tiers.map((tier: any, idx: number) => ({
                    index: idx,
                    name: tier.name.toString(),
                    amount: tier.amount.toString(),
                    backers: tier.backers.toString(),
                }));
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
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        let isMounted = true;
        setProgress("Connecting to contract...");
    
        try {
          const contract = await connectCrowdfundingContract(campaignAddress);
          if (!isMounted) return;
    
          setProgress("Adding Tier...");
          await contract.addTier(
            form.name,
            form.amount,
          );
          if (!isMounted) return;
    
          setProgress("Tier added successfully!");
          setShowAddTierForm(false)
          setTimeout(() => setProgress(""), 1500); // Auto close dialog after success
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
        if (!campaignAddress || !Array.isArray(campaign.tiers)) return;
        try {
            setProgress({ message: "Connecting to contract...", index: tierIndex });
            const contract = await connectCrowdfundingContract(campaignAddress);
            const tier = campaign.tiers[tierIndex];
            if (!tier) throw new Error("Tier not found");
            setProgress({ message: "Sending funds...", index: tierIndex });
            const tx = await contract.fund(tierIndex, { value: tier.amount });
            await tx.wait();
            setProgress({ message: "Funded successfully!", index: tierIndex });
            setTimeout(() => setProgress(""), 1500);
        } catch (error: any) {
            setProgress({ message: `Error: ${error.message || "Failed to fund."}`, index: tierIndex });
            setTimeout(() => setProgress(""), 2500);
        }
    };

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
                        <div>
                            <strong>Minimum Goal:</strong>{" "}
                            <span className="text-green-600">{campaign.minGoal}</span>
                        </div>
                        <div>
                            <strong>Maximum Goal:</strong>{" "}
                            <span className="text-green-600">{campaign.maxGoal}</span>
                        </div>
                        <div>
                            <strong>Deadline:</strong>{" "}
                            <span className="text-yellow-600">
                                {new Date(Number(campaign.deadline) * 1000).toLocaleString()}
                            </span>
                        </div>
                        <div>
                            <strong>Owner:</strong>
                            <div className="break-all text-gray-600">{campaign.owner}</div>
                        </div>
                        <div>
                            <strong>Status:</strong>
                            <span className={`font-semibold ml-2 ${campaign.paused === 'true' ? 'text-red-600' : 'text-green-600'}`}>
                                {campaign.paused === 'true' ? 'Paused' : 'Active'}
                            </span>
                        </div>
                        <div>
                            <strong>Campaign State:{campaign.state}</strong>
                            <span className="ml-2 font-semibold">
                                {(() => {
                                    switch (campaign.state) {
                                        case "0":
                                        case 0:
                                            return "Active";
                                        case "1":
                                        case 1:
                                            return "Successful";
                                        case "2":
                                        case 2:
                                            return "Failed";
                                        default:
                                            return "Unknown";
                                    }
                                })()}
                            </span>
                        </div>
                        <div>
                            <strong>Tiers:</strong>
                            <div className="flex items-center gap-4">
                                <span className="block text-gray-600">
                                    {Array.isArray(campaign.tiers) && campaign.tiers.length > 0 ? (
                                        <ul className="list-disc ml-5">
                                            {campaign.tiers.map((tier: any, idx: number) => (
                                                <li key={idx} className="mb-2 flex items-center">
                                                    <span className="font-semibold">{tier.name}</span> - {tier.amount} ({tier.backers} backers)
                                                    <button
                                                        className="ml-2 p-2 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                                                        onClick={() => fund(tier.index)}
                                                        type="button"
                                                    >
                                                        Select
                                                    </button>
                                                    {progress && progress.index === tier.index && (
                                                        <span className="ml-2 text-xs text-gray-500">{progress.message}</span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span>No tiers available.</span>
                                    )}
                                </span>
                                <button
                                    className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                    onClick={() => setShowAddTierForm(true)}
                                    type="button"
                                >
                                    Add Tier
                                </button>
                                {showAddTierForm && (
                                    <Dialog open={showAddTierForm} onOpenChange={setShowAddTierForm}>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add Tier</DialogTitle>
                                                <DialogDescription>
                                                    Add a new tier to this campaign.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form className="flex flex-col gap-2" onSubmit={handleSubmit} >
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Tier Name</label>
                                                    <input
                                                        name="name"
                                                        type="text"
                                                        className="w-full border rounded px-2 py-1"
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Amount</label>
                                                    <input
                                                        name="amount"
                                                        type="number"
                                                        min="1"
                                                        onChange={handleChange}
                                                        className="w-full border rounded px-2 py-1"
                                                        required
                                                    />
                                                </div>
                                                <div className="flex gap-2 mt-2">
                                                    <button
                                                        type="submit"
                                                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                                                        onClick={() => setShowAddTierForm(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <span className="text-sm text-gray-500">
                                                        {progress}
                                                    </span>
                                                </div>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>
                        </div>
                    </>
                            
                )}
            </div>
        </>
        
    );
};

export default CampaignPage;