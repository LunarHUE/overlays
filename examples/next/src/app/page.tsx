"use client";

import { useOverlay } from "@lunarhue/overlays";
import { ConfirmDelete } from "../overlays/confirm-delete";
import { EditProfile } from "../overlays/edit-profile";
import { SettingsDrawer } from "../overlays/settings-drawer";
import { ContactForm } from "../overlays/contact-form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, UserPlus } from "lucide-react";
import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

export default function Page() {
  const openConfirmDelete = useOverlay(ConfirmDelete);
  const openEditProfile = useOverlay(EditProfile);
  const openSettings = useOverlay(SettingsDrawer);
  const openContactForm = useOverlay(ContactForm);



  const handleDelete = () => {
    openConfirmDelete({
      props: {
        id: "item-123",
        title: "Delete Item",
        description:
          "Are you sure you want to delete this item? This action cannot be undone.",
      },
      slots: {
        icon: <Trash2 className="w-4 h-4 text-red-600" />
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
          <SheetHeader>
            <SheetTitle>User Settings</SheetTitle>
            <SheetDescription>
              Manage your account settings and preferences.
            </SheetDescription>
          </SheetHeader>
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

  return (
    <div className="min-h-screen">
      <div className="container max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Nested Overlays (FILO Stack)</CardTitle>
              </div>
              <CardDescription>
                Open a new overlay from within an existing overlay. Perfect for
                "quick add" workflows where you need to create a related item.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() =>
                  openContactForm({
                    props: {},
                    callbacks: {
                      onSubmit: (data) => {
                        console.log("Contact saved:", data);
                      },
                      onCancel: () => {
                        console.log("Contact form cancelled");
                      },
                    },
                  })
                }
                className="w-full"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add New Contact
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}