"use client";

import { useState, useEffect } from "react";
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
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import type { ChemicalInstance } from "@/lib/types/chemical-instance";

export interface InstanceActiveToggleProps {
  isActive: boolean;
  onToggle: (nextActive: boolean) => Promise<ChemicalInstance>;
  disabled?: boolean;
}

export function InstanceActiveToggle({
  isActive,
  onToggle,
  disabled = false,
}: InstanceActiveToggleProps) {
  const [localActive, setLocalActive] = useState(isActive);
  useEffect(() => setLocalActive(isActive), [isActive]);

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const nextActive = !localActive;
  const label = nextActive ? "Activate" : "Deactivate";
  const colour = nextActive ? "" : "bg-muted text-foreground hover:bg-muted/80";

  const Icon = nextActive ? Check : X;

  /* ------- handlers ------- */
  async function handleConfirm() {
    setSubmitting(true);
    try {
      await onToggle(nextActive);
      setLocalActive(nextActive);
      toast.success(`Instance ${nextActive ? "activated" : "deactivated"}`);
    } catch (err) {
      toast.error("Update failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSubmitting(false);
      setOpen(false);
    }
  }

  /* ------- UI ------- */
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={disabled || submitting}
          size="sm"
          className={`flex items-center ${colour}`}
        >
          {submitting ? (
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                opacity="0.25"
              />
            </svg>
          ) : (
            <Icon className="h-4 w-4" />
          )}
          <span className="ml-1">{label}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirm {label}</DialogTitle>
        </DialogHeader>

        <p className="mb-4 text-sm">
          {`Are you sure you want to ${label.toLowerCase()} this chemical instance?`}
        </p>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" disabled={submitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleConfirm} disabled={submitting}>
            Yes, {label}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
