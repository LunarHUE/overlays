"use client";

import { useOverlay } from "@lunarhue/overlays";
import { ConfirmDelete } from "../overlays/confirm-delete";
import { EditProfile } from "../overlays/edit-profile";
import { SettingsDrawer } from "../overlays/settings-drawer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

export default function Page() {
  const openConfirmDelete = useOverlay(ConfirmDelete);
  const openEditProfile = useOverlay(EditProfile);
  const openSettings = useOverlay(SettingsDrawer);



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
                  <li>Custom header slot</li>
                  <li>Multiple settings sections</li>
                  <li>onSave callback with all settings</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />
      </div>
    </div>
  );
}