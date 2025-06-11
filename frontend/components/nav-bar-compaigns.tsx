"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export default function NavBarCompaigns() {
  return (
    <header className="border-b py-4 px-6">
      <nav className="flex items-center justify-between max-w-7xl mx-auto" aria-label="Compaign Navigation">
        {/* Logo */}
        <Link href="/" aria-label="Go to homepage">
          <div className="flex items-center space-x-2">
            <Image
              src="/baig.webp"
              alt="FundBase - Community Crowdfunding Logo"
              width={48}
              height={48}
              className="rounded-full"
              priority
            />
            <span className="font-bold text-lg text-green-700">FundBase</span>
          </div>
        </Link>

        {/* CTA Button */}
        <div className="flex flex-row items-center space-x-4 lg:flex-row-reverse">
          <Button asChild className="text-white ml-4 ">
            <Link href="/compaigns" aria-label="View open fundraising campaigns">
              Connect Wallet
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
