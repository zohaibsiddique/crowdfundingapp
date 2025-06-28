'use client'
import { useParams } from 'next/navigation';

const CampaignPage = () => {
    const params = useParams();
    const campaignAddress = params?.address as string | undefined;

    if (!campaignAddress) {
        return <div>Loading...</div>;
    }

    // Fetch campaign data here using the id if needed

    return (
        <div>
            <h1>Campaign Details</h1>
            <p>Campaign ID: {campaignAddress}</p>
            {/* Render campaign details here */}
        </div>
    );
};

export default CampaignPage;