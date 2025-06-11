import { ArrowRight } from "lucide-react";
import Nav from "./nav";
import { Button } from "./ui/button";

export default function NavBar() {
  return (
    <div className="border-b py-4 px-6 flex items-center justify-between">
        <a href="/">
            <div className="flex items-center space-x-2">
                <img src="/baig.webp" alt="FundBase Logo" className="w-12 h-12" />
                <div className="font-bold text-lg text-green-700">FundBase</div>
            </div>
        </a>
        <div className='flex flex-row items-center justify-between space-x-4 lg:flex-row-reverse'>
            <Button asChild className="text-white bg-blue-500 ml-4">
                <a href="/compaigns">
                    Fund Now <ArrowRight className="ml-2 w-4 h-4" />
                </a>
            </Button>            
            <Nav/>
        </div>
    </div>
    );
}