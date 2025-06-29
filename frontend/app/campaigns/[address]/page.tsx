'use client'
import { connectCrowdfundingContract } from '@/app/contract-utils/connect-crowdfunding-contract';
import NavBarCampaigns from '@/components/nav-bar-campaigns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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

                const campaign = {
                    name: name.toString(),
                    description: description.toString(),
                    minGoal: minGoal.toString(),
                    maxGoal: maxGoal.toString(),
                    deadline: deadline.toString(),
                    owner: owner.toString(),
                    paused: paused.toString(),
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
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">{campaign.name}</CardTitle>
                            <CardDescription>{campaign.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
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
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
        
    );
};

export default CampaignPage;