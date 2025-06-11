import NavBarDonate from '@/components/nav-bar-compaigns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const campaigns = [
  {
    id: 1,
    name: "Education for All",
    description: "Help provide quality education to underprivileged children.",
    duration: "30 Days Left",
    raised: 12500,
    goal: 20000,
  },
  {
    id: 2,
    name: "Clean Water Project",
    description: "Support building wells in rural areas to ensure access to clean water.",
    duration: "15 Days Left",
    raised: 8200,
    goal: 10000,
  },
  {
    id: 3,
    name: "Medical Aid for Refugees",
    description: "Provide emergency medical supplies and care for displaced families.",
    duration: "10 Days Left",
    raised: 5750,
    goal: 15000,
  },
];


export default function CompaignsPage() {
  return (
    <div className="min-h-screen">
      {/* --- Nav bar --- */}
      <NavBarDonate/>

      <section className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-10">Open Campaigns</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => {
            const progress = (campaign.raised / campaign.goal) * 100;

            return (
              <Card key={campaign.id} className="rounded-2xl shadow-md">
                <CardHeader>
                  <CardTitle>{campaign.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-2">{campaign.description}</p>
                  <p className="text-sm text-gray-500 mb-1">Duration: {campaign.duration}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    Raised: $
                    {campaign.raised ? campaign.raised.toLocaleString() : 0} / $
                    {campaign.goal ? campaign.goal.toLocaleString() : 0}
                  </p>

                  <Progress value={progress} className="mb-4 h-3" />
                  <Button className="w-full bg-sky-500 text-white">
                    Donate Now
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
      
    </div>
  );
}
