"use client"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DialogComponentsProps {
  equipmentDialogOpen: boolean
  creatorDialogOpen: boolean
  setEquipmentDialogOpen: (open: boolean) => void
  setCreatorDialogOpen: (open: boolean) => void
}

export function DialogComponents({
  equipmentDialogOpen,
  creatorDialogOpen,
  setEquipmentDialogOpen,
  setCreatorDialogOpen,
}: DialogComponentsProps) {
  return (
    <>
      {/* Equipment Dialog */}
      <Dialog open={equipmentDialogOpen} onOpenChange={setEquipmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Navigate to Equipment Page</DialogTitle>
            <DialogDescription>
              This will take you to a new page to add equipment. Your current form data will not be saved. Do you want
              to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEquipmentDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setEquipmentDialogOpen(false)
                toast.info("Navigation to Equipment Page", {
                  description: "This would navigate to the equipment management page in a real app.",
                })
              }}
              className="bg-primary hover:bg-primary/90"
            >
              Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Creator Dialog */}
      <Dialog open={creatorDialogOpen} onOpenChange={setCreatorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Navigate to Creator Management</DialogTitle>
            <DialogDescription>
              This will take you to a new page to add a creator. Your current form data will not be saved. Do you want
              to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreatorDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setCreatorDialogOpen(false)
                toast.info("Navigation to Creator Management", {
                  description: "This would navigate to the creator management page in a real app.",
                })
              }}
              className="bg-primary hover:bg-primary/90"
            >
              Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
