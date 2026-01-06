"use client";

import { useOverlay } from "@lunarhue/overlays";
import { ConfirmDelete } from "../overlays/confirm-delete";
import { EditProfile } from "../overlays/edit-profile";
import { SettingsDrawer } from "../overlays/settings-drawer";
import { CreateProductWizard } from "../overlays/create-product-wizard";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  const openConfirmDelete = useOverlay(ConfirmDelete);
  const openEditProfile = useOverlay(EditProfile);
  const openSettings = useOverlay(SettingsDrawer);
  const openProductWizard = useOverlay(CreateProductWizard);

  const handleDelete = () => {
    openConfirmDelete({
      props: {
        id: "item-123",
        title: "Delete Item",
        description:
          "Are you sure you want to delete this item? This action cannot be undone.",
      },
      slots: {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-600"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        ),
      },
      callbacks: {
        onConfirm: ({ id }) => {
          console.log("Deleting item:", id);
        },
        onCancel: () => {
          console.log("Cancelling delete");
        },
      },
    });
  };

  const handleEditProfile = () => {
    openEditProfile({
      props: {
        name: "John Doe",
        email: "john@example.com",
        bio: "Software engineer and open source enthusiast.",
      },
      slots: {
        avatar: (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
            JD
          </div>
        ),
      },
      callbacks: {
        onSave: (data) => {
          console.log("Saving profile:", data);
        },
        onCancel: () => {
          console.log("Edit cancelled");
        },
      },
    });
  };

  const handleOpenSettings = () => {
    openSettings({
      props: {
        userId: "user-123",
        notifications: true,
        darkMode: false,
        language: "en",
      },
      slots: {
        header: (
          <div className="flex items-center gap-2 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="font-semibold">User Settings</span>
          </div>
        ),
      },
      callbacks: {
        onSave: (settings) => {
          console.log("Saving settings:", settings);
        },
        onClose: () => {
          console.log("Settings closed");
        },
      },
    });
  };

  const handleCreateProduct = () => {
    openProductWizard({
      props: {
        initialStep: 0,
        categoryId: "electronics",
      },
      slots: {
        headerIcon: (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
        ),
        imagePreview: (
          <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm">
            Product Image Preview
          </div>
        ),
      },
      callbacks: {
        onCreate: (product) => {
          console.log("Creating product:", product);
        },
        onStepChange: ({ from, to }) => {
          console.log(`Step changed from ${from} to ${to}`);
        },
        onCancel: () => {
          console.log("Product creation cancelled");
        },
        onValidationError: ({ step, errors }) => {
          console.error(`Validation errors on step ${step}:`, errors);
          alert(`Please fix the following errors:\n${errors.join("\n")}`);
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Overlay Examples
          </h1>
          <p className="text-muted-foreground">
            Explore different overlay patterns with type-safe callbacks and slots
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Alert Dialog Example */}
          <Card>
            <CardHeader>
              <CardTitle>Alert Dialog</CardTitle>
              <CardDescription>
                Confirmation dialog with custom icon slot and typed callbacks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleDelete} variant="destructive" className="w-full">
                Delete Item
              </Button>
              <div className="mt-4 text-xs text-muted-foreground">
                <p className="font-semibold mb-1">Features:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Custom SVG icon via slot</li>
                  <li>onConfirm callback with ID parameter</li>
                  <li>onCancel callback</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Dialog Example */}
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile Dialog</CardTitle>
              <CardDescription>
                Form dialog with avatar slot and form state management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleEditProfile} className="w-full">
                Edit Profile
              </Button>
              <div className="mt-4 text-xs text-muted-foreground">
                <p className="font-semibold mb-1">Features:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Avatar slot for custom rendering</li>
                  <li>Form inputs with validation</li>
                  <li>onSave callback with form data</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Drawer Example */}
          <Card>
            <CardHeader>
              <CardTitle>Settings Drawer</CardTitle>
              <CardDescription>
                Side drawer with header slot and settings management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleOpenSettings} variant="outline" className="w-full">
                Open Settings
              </Button>
              <div className="mt-4 text-xs text-muted-foreground">
                <p className="font-semibold mb-1">Features:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Custom header with icon slot</li>
                  <li>Multiple settings sections</li>
                  <li>onSave callback with all settings</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Complex Wizard Example */}
          <Card>
            <CardHeader>
              <CardTitle>Multi-Step Wizard</CardTitle>
              <CardDescription>
                Complex wizard with multiple slots and validation callbacks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleCreateProduct} variant="default" className="w-full">
                Create Product
              </Button>
              <div className="mt-4 text-xs text-muted-foreground">
                <p className="font-semibold mb-1">Features:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>3 slots: header icon, image preview, footer</li>
                  <li>Step validation with error callback</li>
                  <li>onStepChange callback for tracking</li>
                  <li>Complex onCreate callback</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <div className="rounded-lg bg-muted/50 p-6">
          <h2 className="text-lg font-semibold mb-2">About this example</h2>
          <p className="text-sm text-muted-foreground mb-4">
            This demo showcases the overlay system with type-safe Zod schemas, callback definitions,
            and React slots. All overlays are fully typed and provide excellent developer experience.
          </p>
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div>
              <h3 className="font-medium mb-2">Key Features</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Zod schema validation for props</li>
                <li>Type-safe callback definitions</li>
                <li>React slots for flexible rendering</li>
                <li>Optional props when using slots</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Overlay Types</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Alert Dialogs - Quick confirmations</li>
                <li>Dialogs - Complex forms and content</li>
                <li>Drawers - Side panels for settings</li>
                <li>Wizards - Multi-step processes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}