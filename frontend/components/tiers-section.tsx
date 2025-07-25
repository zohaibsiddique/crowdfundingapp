import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import React from "react";
import { DialogHeader } from "./ui/dialog";
import { ConfirmationDialog } from "./confirmation-dialog";
import { Tier } from "@/app/utils/interfaces/tier";
import { Card, CardHeader, CardContent } from "./ui/card";

interface TiersSectionProps {
    tiers: Tier[];
    state: number | string;
    progress: string | {message: string, index?: number};
    fund: (index: number) => void;
    isOwner: boolean;
    removeTier: (index: number) => Promise<void>;
    showAddTierForm: boolean;
    setShowAddTierForm: (show: boolean) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const TiersSection: React.FC<TiersSectionProps> = ({
    tiers,
    state, 
    progress,
    fund,
    isOwner,
    removeTier,
    showAddTierForm,
    setShowAddTierForm,
    handleSubmit,
    handleChange,
}) => {
    return (
        <section className="mt-2">
            <div className="flex justify-between items-center mb-2">
                <strong><h2>Tiers</h2></strong>
                <button
                disabled={state !== "0" || !isOwner}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700 transition"
                onClick={() => setShowAddTierForm(true)}
                type="button"
                >
                    Add Tier
                </button>
            </div>
            
           <div className="flex flex-col gap-2">
                {Array.isArray(tiers) && tiers.length > 0 ? (
                    tiers.map((tier: any, idx: number) => (
                        <Card key={idx} className="shadow-md">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="font-semibold">{tier.name} - {tier.amount}</h4>
                                        <p className="text-sm text-gray-600">
                                            ({tier.backers} backers)
                                        </p>
                                    </div>
                                   
                                    <div className="flex gap-2">
                                        <button
                                            disabled={state !== "0"}
                                            className="w-20 px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-700"
                                            onClick={() => fund(tier.index)}
                                        >
                                            Fund
                                        </button>
                                        {isOwner && (
                                            <ConfirmationDialog
                                                btnTxt="Remove"
                                                title="Are you sure?"
                                                description="This action is irreversible."
                                                waitingMsgContent="Removing tier, please wait..."
                                                waitingMsgBtn="Removing"
                                                onConfirm={async () => {
                                                    await removeTier(tier.index);
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </CardHeader>

                            {typeof progress !== "string" && progress.index === tier.index && (
                            <CardContent>
                                <span className="text-xs text-blue-500">{progress.message}</span>
                            </CardContent>
                            )}
                        </Card>
                    ))
                ) : (
                    <span className="text-gray-600">No tiers available.</span>
                )}

               

                {showAddTierForm && (
                    <Dialog open={showAddTierForm} onOpenChange={setShowAddTierForm}>
                    <DialogContent className="relative [&>button[data-radix-dialog-close]]:hidden">
                        <DialogHeader>
                        <DialogTitle>Add Tier</DialogTitle>
                        </DialogHeader>

                        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
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
                        <div className="flex justify-end items-center mt-2">
                            <button
                            type="submit"
                            className="mr-2 w-24 py-1 bg-green-500 text-white rounded hover:bg-green-700 transition"
                            >
                            Save
                            </button>
                            <button
                            type="button"
                            className="w-24 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                            onClick={() => setShowAddTierForm(false)}
                            >
                            Cancel
                            </button>
                        </div>
                        <span className="text-sm text-gray-500">
                            {typeof progress === "string" ? progress : ""}
                        </span>
                        </form>
                    </DialogContent>
                    </Dialog>
                )}
            </div>

        </section>
    );
};

export default TiersSection;




                              