import NavBarFund from '@/components/nav-bar-compaigns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const campaign = [
  {
    id: 1,
    name: "Education for All",
    description: "Help provide quality education to underprivileged children.",
    duration: "30 Days Left",
    raised: 12500,
    goal: 20000,
    backers: 150,
  },
];


export default function CompaignDetailsPage() {
  return (
    <div className="min-h-screen">
      {/* --- Nav bar --- */}
      <NavBarFund/>
      

      <div className="flex justify-center mt-10">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold mb-2">{campaign[0].name}</CardTitle>
            <div className="text-gray-500 text-sm">{campaign[0].duration}</div>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-lg">{campaign[0].description}</p>
            <div className="mb-4">
              <Progress value={(campaign[0].raised / campaign[0].goal) * 100} />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>Raised: ${campaign[0].raised.toLocaleString()}</span>
                <span>Goal: ${campaign[0].goal.toLocaleString()}</span>
              </div>
            </div>
            <div className="mb-6 text-sm text-gray-700">
              <span className="font-semibold">{campaign[0].backers}</span> Backers
            </div>
            <div className="flex justify-end">
              <Button size="lg" className="px-8 py-2 bg-sky-500 text-white">Fund Now</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
    </div>
  );
}
