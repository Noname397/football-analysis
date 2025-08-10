"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { NumericInput } from "@/components/ui/numeric-input";
import type { ChemicalInstance } from "@/lib/types/chemical-instance";
import { toast } from "sonner";
import { NumericDisplay } from "@/components/ui/numeric-display";

/** ---  props  ------------------------------------------------------- */
interface ConsumeAmountButtonProps {
  instance: ChemicalInstance; // parent instance
  onConsume: (amount: number) => void; // mutation callback
  disabled?: boolean;
}

/** ---  component  --------------------------------------------------- */
export function ConsumeAmountButton({
  instance,
  disabled = false,
  onConsume,
}: ConsumeAmountButtonProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);

  const remainingAfter = useMemo(
    () => instance.netWeight - amount,
    [amount, instance.netWeight]
  );

  // we can consume more amount than current net weight due to manufacturer might have provided more than the net weight
  // this is importnat for audting purpose.
  const formValid = amount > 0;

  async function handleSave() {
    try {
      await onConsume(amount);
      toast.success("Amount consumed successfully!", {
        description: `Remaining: ${remainingAfter} kg`,
      });
      setOpen(false);
      setAmount(0);
    } catch (e) {
      toast.error("Failed", {
        description: e instanceof Error ? e.message : "Unknown error",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" disabled={disabled}>
          Consume
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Consume Amount</DialogTitle>
        </DialogHeader>

        {/* Remaining snapshot */}
        <div className="mb-4 space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current net weight:</span>
            <NumericDisplay
              value={instance.netWeight}
              type="float"
            ></NumericDisplay>
          </div>

          {/* Input */}
          <div className="mb-2 space-y-1">
            <label className="text-sm font-medium">Amount to consume</label>
            <NumericInput
              type="float"
              value={amount}
              onChange={setAmount}
              min={0}
              max={instance.amount}
              placeholder="e.g. 3.0"
            />
          </div>

          {/* Remaining after */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Net weight after consumption:
            </span>
            <NumericDisplay
              value={remainingAfter}
              type="float"
              className={remainingAfter < 0 ? "text-red-500" : "font-medium"}
            ></NumericDisplay>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={!formValid}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
