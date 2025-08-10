"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Action {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "outline" | "destructive";
}

interface Section {
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface SuccessModalProps<T> {
  title: string;
  subtitle: string;
  data: T | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sections: Section[];
  actions: Action[];
}

export function SuccessModal<T>({
  title,
  subtitle,
  data,
  open,
  onOpenChange,
  sections,
  actions,
}: SuccessModalProps<T>) {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-w-4xl flex-col overflow-hidden p-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          </div>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index} className="space-y-4">
                {index > 0 && <Separator />}
                <h3 className="flex items-center text-lg font-medium text-gray-700">
                  {section.icon && (
                    <span className="mr-2 rounded bg-primary/10 p-1">
                      {section.icon}
                    </span>
                  )}
                  {section.title}
                </h3>
                {section.content}
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="border-t bg-gray-50 p-6">
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "outline"}
                onClick={action.onClick}
                className="flex-1"
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </Button>
            ))}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
