import { ArrowRight } from "lucide-react";
import Nav from "./nav";
import { Button } from "./ui/button";

export default function NavBar() {
  return (
    <div className="border-b py-4 px-6 flex items-center justify-between">
        <a href="/">
            <div className="font-bold text-lg text-green-700">FundBase</div>
        </a>
        <div className='flex flex-row items-center justify-between space-x-4 lg:flex-row-reverse'>
            <Button asChild className="text-white bg-blue-500 ml-4">
                <a href="/compaigns">
                    Donate Now <ArrowRight className="ml-2 w-4 h-4" />
                </a>
            </Button>            
            <Nav/>
        </div>
    </div>
    );
}