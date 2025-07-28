'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import NavBarCampaigns from "@/components/nav-bar-campaigns";
import { connectFactoryContract } from "@/app/contract-utils/connect-factory-contract";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export default function CreateCampaignForm() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let isMounted = true;
    setProgress("Connecting to contract...");

    try {
       const { contract } = await connectFactoryContract();
      if (!isMounted) return;

      setProgress("Creating campaign...");
      const tx = await contract.createCampaign(
        form._name,
        form._description,
        form._minGoal,
        form._maxGoal,
        form._durationInDays
      );
      await tx.wait(); // wait for transaction to confirm
      
      if (!isMounted) return;

      setProgress("Campaign created successfully!");
      setForm({
            _name: "",
            _description: "",
            _minGoal: "",
            _maxGoal: "",
            _durationInDays: "",
        });
      setTimeout(() => setProgress(""), 1500); // Auto close dialog after success
      
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      if (!isMounted) return;
      setProgress(`Error: ${error.message || "Failed to create campaign."}`);
      setTimeout(() => setProgress(""), 2500); // Auto close dialog after error
    }

    return () => {
      isMounted = false;
    };
  };

  return (
    <>
      <NavBarCampaigns />

      <Dialog open={!!progress} onOpenChange={() => setProgress("")}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle>Processing</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center gap-4 py-6">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="text-sm text-muted-foreground">{progress}</p>
          </div>
        </DialogContent>
      </Dialog>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 max-w-md mx-auto mt-4 p-2 border-2 rounded-2xl">
        <h1 className="text-2xl font-bold text-center">Create a New Campaign</h1>
        <div>
          <Label htmlFor="_name" className="mb-2">Campaign Name</Label>
          <Input id="_name" name="_name" value={form._name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="_minGoal" className="mb-2">Minimum Goal (wei)</Label>
          <Input
            id="_minGoal"
            name="_minGoal"
            type="number"
            min="0"
            value={form._minGoal}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="_maxGoal" className="mb-2">Maximum Goal (wei)</Label>
          <Input
            id="_maxGoal"
            name="_maxGoal"
            type="number"
            min="0"
            value={form._maxGoal}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="_durationInDays" className="mb-2">Duration (days)</Label>
          <Input
            id="_durationInDays"
            name="_durationInDays"
            type="number"
            min="1"
            value={form._durationInDays}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="_description" className="mb-2">Description</Label>
          <Textarea
            id="_description"
            name="_description"
            value={form._description}
            onChange={handleChange}
            
          />
        </div>
        <Button type="submit" className="my-3 bg-green-700 hover:bg-green-900">Create</Button>
      </form>
    </>
  );
}
