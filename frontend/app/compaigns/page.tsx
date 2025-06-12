import NavBarCompaigns from '@/components/nav-bar-compaigns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import AllCompaigns from '@/components/all-compaigns';

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


export default function CompaignsPage() {
  return (
    <div className="min-h-screen">
      {/* --- Nav bar --- */}
      <NavBarCompaigns/>

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
                    <CardTitle>All Compaigns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AllCompaigns/>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="my">
                <Card className='border-none shadow-none'>
                  <CardHeader>
                    <CardTitle>My Campaigns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AllCompaigns/>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="funded">
                <Card className='border-none shadow-none'>
                  <CardHeader>
                    <CardTitle>Funded Campaigns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AllCompaigns/>
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
