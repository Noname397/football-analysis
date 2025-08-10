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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { NumericInput } from "@/components/ui/numeric-input";
import { CalendarIcon, PlusCircle } from "lucide-react";
import type { ChemicalInstance } from "@/lib/types/chemical-instance";
import { useLocations } from "@/lib/queries/useLocation";
import { useEmployees } from "@/lib/queries/useEmployee";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCreateAliquot } from "@/lib/queries/instanceMutations";
import { NumericDisplay } from "@/components/ui/numeric-display";

interface TakeAliquotButtonProps {
  instance: ChemicalInstance;
  disabled?: boolean;
}

export function TakeAliquotButton({
  instance,
  disabled = false,
}: TakeAliquotButtonProps) {
  const [open, setOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  /* form state */
  const [grossWeight, setGrossWeight] = useState(0);
  const [netWeight, setNetWeight] = useState(0);
  const [locationUuid, setLocationUuid] = useState("");
  const [createdAt, setCreatedAt] = useState<Date>(new Date());
  const [ownerUuid, setOwnerUuid] = useState("");
  const [label, setLabel] = useState("");
  const [notes, setNotes] = useState("");

  const { data: locations = [], isLoading: locLoading } = useLocations({
    enabled: open,
  });
  const { data: employees = [], isLoading: empLoading } = useEmployees({
    enabled: open,
  });

  const createAliquot = useCreateAliquot();

  const formValid = useMemo(() => {
    return (
      grossWeight > 0 &&
      netWeight > 0 &&
      grossWeight >= netWeight &&
      locationUuid &&
      createdAt &&
      ownerUuid &&
      label.trim().length > 0
    );
  }, [grossWeight, netWeight, locationUuid, createdAt, ownerUuid, label]);

  async function handleSave() {
    try {
      const aliquot = await createAliquot.mutateAsync({
        parent: instance,
        grossWeight,
        netWeight,
        locationUuid,
        createdAt,
        ownerUuid,
        label,
        notes,
      });
      toast.success(`Aliquot created with instance ID ${aliquot.id}`);
      /* reset + close */
      setOpen(false);
      setGrossWeight(0);
      setNetWeight(0);
      setLocationUuid("");
      setCreatedAt(new Date());
      setOwnerUuid("");
      setLabel("");
      setNotes("");
    } catch (e) {
      toast.error("Save failed", {
        description: e instanceof Error ? e.message : "Unknown error",
      });
    }
  }

  const { recipe } = instance;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" disabled={disabled}>
          Aliquot
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Take Aliquot</DialogTitle>
        </DialogHeader>

        {/* instance snapshot */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Chemical:</span>
            <span className="font-medium">
              {recipe.chemical?.name} ({recipe.chemical?.formula})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current Net Weight:</span>
            <span className="font-medium">
              <NumericDisplay
                value={instance.netWeight}
                type="float"
              ></NumericDisplay>
            </span>
          </div>
        </div>

        <Separator />

        {/* inputs */}
        <div className="space-y-4">
          {/* label */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Label</label>
            <input
              autoFocus
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="e.g. Ethanol aliquot 1"
            />
          </div>

          {/* gross */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Gross weight</label>
            <NumericInput
              type="float"
              value={grossWeight}
              onChange={setGrossWeight}
              min={0}
              placeholder="eg. 0.5 kg"
            />
          </div>

          {/* net */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Net weight</label>
            <NumericInput
              type="float"
              value={netWeight}
              onChange={setNetWeight}
              min={0}
              placeholder="eg. 0.4 kg"
            />
          </div>

          {/* date created */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Date created</label>
            <Popover
              open={calendarOpen}
              onOpenChange={(o) => {
                setCalendarOpen(o);
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !createdAt && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {createdAt ? createdAt.toLocaleDateString() : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="z-[10000] w-auto p-0">
                <Calendar
                  mode="single"
                  selected={createdAt}
                  onSelect={(date) => {
                    date && setCreatedAt(date);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* owner */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Owner (employee)</label>
            <Select
              value={ownerUuid}
              onValueChange={setOwnerUuid}
              disabled={empLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent className="z-[10000]">
                {employees.map((emp) => (
                  <SelectItem key={emp.uuid} value={emp.uuid}>
                    {emp.firstName ?? `${emp.firstName} ${emp.lastName}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* destination location */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Destination location</label>
            <Select
              value={locationUuid}
              onValueChange={setLocationUuid}
              disabled={locLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent className="z-[10000]">
                {locations.map((loc) => (
                  <SelectItem
                    key={loc.uuid ?? loc.locationName}
                    value={loc.uuid}
                  >
                    {loc.locationName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* notes */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="Notes..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={!formValid}>
            Save Aliquot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
