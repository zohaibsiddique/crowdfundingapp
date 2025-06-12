import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";

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

export default function AllCompaigns() {
  return (
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
                <p className="text-sm text-gray-500 mb-1">
                    Raised: $
                    {campaign.raised ? campaign.raised.toLocaleString() : 0} / $
                    {campaign.goal ? campaign.goal.toLocaleString() : 0}
                </p>
                <p className="text-sm text-gray-500 mb-2">Backers: {campaign.backers}</p>

                <Progress value={progress} className="mb-4 h-3" />
                {campaign.paused ? (
                    <Button
                    className="w-full bg-sky-500 text-white"
                    disabled
                    >
                    Paused
                    </Button>
                ) : (
                    <Button
                    asChild
                    className="w-full bg-sky-500 text-white"
                    >
                    <a href="/compaign-details">
                        Details
                    </a>
                    </Button>
                )}
                </CardContent>
            </Card>
            );
        })}
    </div>
  );
}