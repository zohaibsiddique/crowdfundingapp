import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import React from "react";
import { DialogHeader } from "./ui/dialog";

interface Tier {
    id: string;
    name: string;
    amount: number;
    backers: number;
}

interface TiersSectionProps {
    tiers: Tier[];
    progress: number;
    fund: number;
    showAddTierForm: boolean;
    setShowAddTierForm: (show: boolean) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    setProgress: (progress: number) => void;
}

const TiersSection: React.FC<TiersSectionProps> = ({
    tiers,
    progress,
    fund,
    showAddTierForm,
    setShowAddTierForm,
    handleSubmit,
    handleChange,
    setProgress,
}) => {
    return (
        <section>
            <strong><h2>Tiers</h2></strong>
           <div className="flex items-center gap-4">
                <span className="block text-gray-600">
                    {Array.isArray(tiers) && tiers.length > 0 ? (
                        <ul className="list-disc ml-5">
                            {tiers.map((tier: any, idx: number) => (
                                <li key={idx} className="mb-2 flex items-center">
                                    <span className="font-semibold">{tier.name}</span> - {tier.amount} ({tier.backers} backers)
                                    <button
                                        className="ml-2 p-2 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                                        onClick={() => fund(tier.index)}
                                        type="button"
                                    >
                                        Select
                                    </button>
                                    {progress && progress.index === tier.index && (
                                        <span className="ml-2 text-xs text-gray-500">{progress.message}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <span>No tiers available.</span>
                    )}
                </span>
                <button
                    className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    onClick={() => setShowAddTierForm(true)}
                    type="button"
                >
                    Add Tier
                </button>
                {showAddTierForm && (
                    <Dialog open={showAddTierForm} onOpenChange={setShowAddTierForm}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Tier</DialogTitle>
                                <DialogDescription>
                                    Add a new tier to this campaign.
                                </DialogDescription>
                            </DialogHeader>
                            <form className="flex flex-col gap-2" onSubmit={handleSubmit} >
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tier Name</label>
                                    <input
                                        name="name"
                                        type="text"
                                        className="w-full border rounded px-2 py-1"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Amount</label>
                                    <input
                                        name="amount"
                                        type="number"
                                        min="1"
                                        onChange={handleChange}
                                        className="w-full border rounded px-2 py-1"
                                        required
                                    />
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        type="submit"
                                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                                        onClick={() => setShowAddTierForm(false)}
                                    >
                                        Cancel
                                    </button>
                                    <span className="text-sm text-gray-500">
                                        {progress}
                                    </span>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </section>
    );
};

export default TiersSection;




                              