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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

function CreateProductWizardContent({
  props,
  close,
  callbacks,
  slots,
}: {
  props: {
    categoryId?: string;
    initialStep: number;
    headerIcon?: any;
    imagePreview?: any;
    customFooter?: any;
  };
  close: () => void;
  callbacks: {
    onCreate: (data: {
      name: string;
      description: string;
      price: number;
      category: string;
      tags: string[];
    }) => void;
    onStepChange: (data: { from: number; to: number }) => void;
    onCancel: () => void;
    onValidationError: (data: { step: number; errors: string[] }) => void;
  };
  slots: {
    headerIcon?: React.ReactNode;
    imagePreview?: React.ReactNode;
    customFooter?: React.ReactNode;
  };
}) {
    const [currentStep, setCurrentStep] = useState(props.initialStep);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState(props.categoryId ?? "");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    const totalSteps = 3;

    const validateStep = (step: number): string[] => {
      const errors: string[] = [];

      if (step === 1) {
        if (!name) errors.push("Product name is required");
        if (!description) errors.push("Description is required");
      } else if (step === 2) {
        if (!price || isNaN(parseFloat(price))) errors.push("Valid price is required");
        if (!category) errors.push("Category is required");
      }

      return errors;
    };

    const handleNext = () => {
      const errors = validateStep(currentStep);

      if (errors.length > 0) {
        callbacks.onValidationError({ step: currentStep, errors });
        return;
      }

      const nextStep = currentStep + 1;
      callbacks.onStepChange({ from: currentStep, to: nextStep });
      setCurrentStep(nextStep);
    };

    const handleBack = () => {
      const prevStep = currentStep - 1;
      callbacks.onStepChange({ from: currentStep, to: prevStep });
      setCurrentStep(prevStep);
    };

    const handleCreate = () => {
      const errors = validateStep(currentStep);

      if (errors.length > 0) {
        callbacks.onValidationError({ step: currentStep, errors });
        return;
      }

      callbacks.onCreate({
        name,
        description,
        price: parseFloat(price),
        category,
        tags,
      });
      close();
    };

    const addTag = () => {
      if (tagInput && !tags.includes(tagInput)) {
        setTags([...tags, tagInput]);
        setTagInput("");
      }
    };

    const removeTag = (tag: string) => {
      setTags(tags.filter((t) => t !== tag));
    };

    return (
      <Dialog open onOpenChange={(open) => !open && close()}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              {(slots.headerIcon ?? props.headerIcon) && (
                <div>{slots.headerIcon ?? props.headerIcon}</div>
              )}
              <div className="flex-1">
                <DialogTitle>Create New Product</DialogTitle>
                <DialogDescription>
                  Step {currentStep} of {totalSteps}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-6">
            {/* Progress indicator */}
            <div className="flex gap-2 mb-6">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded-full ${
                    step <= currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your product..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Pricing & Category */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select a category</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="books">Books</option>
                    <option value="home">Home & Garden</option>
                    <option value="toys">Toys & Games</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Tags & Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      placeholder="Add a tag..."
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      Add
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-2 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Preview */}
                <div className="space-y-3">
                  <h4 className="font-medium">Preview</h4>
                  {(slots.imagePreview ?? props.imagePreview) && (
                    <div className="border rounded-lg p-4 bg-muted/50">
                      {slots.imagePreview ?? props.imagePreview}
                    </div>
                  )}
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {name || "Not set"}</p>
                    <p><strong>Price:</strong> ${price || "0.00"}</p>
                    <p><strong>Category:</strong> {category || "Not selected"}</p>
                    <p><strong>Description:</strong> {description || "No description"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {slots.customFooter ? (
            slots.customFooter
          ) : (
            <DialogFooter>
              <div className="flex gap-2 w-full justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    callbacks.onCancel();
                    close();
                  }}
                >
                  Cancel
                </Button>
                <div className="flex gap-2">
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={handleBack}>
                      Back
                    </Button>
                  )}
                  {currentStep < totalSteps ? (
                    <Button onClick={handleNext}>Next</Button>
                  ) : (
                    <Button onClick={handleCreate}>Create Product</Button>
                  )}
                </div>
              </div>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
}

export const CreateProductWizard = defineOverlay({
  id: "create-product-wizard",
  props: z.object({
    categoryId: z.string().optional(),
    initialStep: z.number().default(1),
    headerIcon: z.any().optional(),
    imagePreview: z.any().optional(),
    customFooter: z.any().optional(),
  }),
  slots: ["headerIcon", "imagePreview", "customFooter"] as const,
  callbacks: {
    onCreate: {
      input: z.object({
        name: z.string(),
        description: z.string(),
        price: z.number(),
        category: z.string(),
        tags: z.array(z.string()),
      }),
    },
    onStepChange: {
      input: z.object({
        from: z.number(),
        to: z.number(),
      }),
    },
    onCancel: {},
    onValidationError: {
      input: z.object({
        step: z.number(),
        errors: z.array(z.string()),
      }),
    },
  },

  render: (params) => <CreateProductWizardContent {...params} />,
});
