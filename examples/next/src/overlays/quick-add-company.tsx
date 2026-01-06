import { defineOverlay } from "@lunarhue/overlays";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export const QuickAddCompany = defineOverlay({
  id: "quick-add-company",
  props: z.object({
    name: z.string().optional(),
  }),
  callbacks: {
    onSave: {
      input: z.object({
        companyId: z.string(),
        companyName: z.string(),
      }),
    },
    onCancel: {},
  },
  Component: ({ props, callbacks, close }) => {
    const [name, setName] = useState(props.name || "");

    const handleSave = () => {
      const companyId = crypto.randomUUID();
      callbacks.onSave({ companyId, companyName: name });
      close();
    };

    return (
      <Dialog open onOpenChange={(open) => !open && close()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Quick Add Company</DialogTitle>
            <DialogDescription>
              Add a new company to select from. This overlay opens on top of
              the contact form.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Acme Corporation"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                callbacks.onCancel();
                close();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!name.trim()}>
              Add Company
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
});
