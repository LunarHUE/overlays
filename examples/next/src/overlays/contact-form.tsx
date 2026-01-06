import { defineOverlay, useOverlay } from "@lunarhue/overlays";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import { QuickAddCompany } from "./quick-add-company";

type Company = {
  id: string;
  name: string;
};

export const ContactForm = defineOverlay({
  id: "contact-form",
  props: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
  }),
  callbacks: {
    onSubmit: {
      input: z.object({
        name: z.string(),
        email: z.string(),
        companyId: z.string().optional(),
        companyName: z.string().optional(),
      }),
    },
    onCancel: {},
  },
  Component: ({ props, callbacks, close }) => {
    const [name, setName] = useState(props.name || "");
    const [email, setEmail] = useState(props.email || "");
    const [companies, setCompanies] = useState<Company[]>([
      { id: "1", name: "Acme Corp" },
      { id: "2", name: "Tech Industries" },
      { id: "3", name: "Global Solutions" },
    ]);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>();

    // This is the key feature: opening another overlay from within this overlay!
    const openQuickAddCompany = useOverlay(QuickAddCompany);

    const handleQuickAdd = () => {
      openQuickAddCompany({
        props: {},
        callbacks: {
          onSave: ({ companyId, companyName }) => {
            // Add the new company to the list
            setCompanies((prev) => [...prev, { id: companyId, name: companyName }]);
            // Auto-select the newly added company
            setSelectedCompanyId(companyId);
            console.log("Added company:", companyName);
          },
          onCancel: () => {
            console.log("Quick add cancelled");
          },
        },
      });
    };

    const handleSubmit = () => {
      const selectedCompany = companies.find((c) => c.id === selectedCompanyId);
      callbacks.onSubmit({
        name,
        email,
        companyId: selectedCompanyId,
        companyName: selectedCompany?.name,
      });
      close();
    };

    return (
      <Dialog open onOpenChange={(open) => !open && close()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Contact</DialogTitle>
            <DialogDescription>
              Add a new contact to your list. You can quick-add a company if needed.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label>Company</Label>
              <div className="flex gap-2">
                <Select
                  value={selectedCompanyId}
                  onValueChange={(value) => setSelectedCompanyId(value || undefined)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue>
                      {selectedCompanyId ? companies.find((c) => c.id === selectedCompanyId)?.name : "Select company..."}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleQuickAdd}
                  title="Quick add company"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Click the + button to add a new company (opens overlay on top)
              </p>
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
            <Button
              onClick={handleSubmit}
              disabled={!name.trim() || !email.trim()}
            >
              Save Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
});
