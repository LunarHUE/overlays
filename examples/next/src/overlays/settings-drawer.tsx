import { defineOverlay } from "@lunarhue/overlays";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

function SettingsDrawerContent({
  props,
  close,
  callbacks,
  slots,
}: {
  props: {
    userId: string;
    notifications: boolean;
    darkMode: boolean;
    language: string;
    header?: any;
  };
  close: () => void;
  callbacks: {
    onSave: (data: { notifications: boolean; darkMode: boolean; language: string }) => void;
    onClose: () => void;
  };
  slots: { header?: React.ReactNode };
}) {
  const [notifications, setNotifications] = useState(props.notifications);
  const [darkMode, setDarkMode] = useState(props.darkMode);
  const [language, setLanguage] = useState(props.language);

  const handleSave = () => {
    callbacks.onSave({ notifications, darkMode, language });
    close();
  };

  return (
    <Sheet open onOpenChange={(open) => !open && close()}>
      <SheetContent>
        <SheetHeader>
          {(slots.header ?? props.header) && (
            <div className="mb-4">{slots.header ?? props.header}</div>
          )}
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Manage your account settings and preferences.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Notifications</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="flex-1">
                Enable notifications
              </Label>
              <input
                type="checkbox"
                id="notifications"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="h-4 w-4"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-medium">Appearance</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode" className="flex-1">
                Dark mode
              </Label>
              <input
                type="checkbox"
                id="darkMode"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="h-4 w-4"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-medium">Language</h3>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>

        <SheetFooter>
          <Button
            variant="outline"
            onClick={() => {
              callbacks.onClose();
              close();
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save preferences</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export const SettingsDrawer = defineOverlay({
  id: "settings-drawer",
  props: z.object({
    userId: z.string(),
    notifications: z.boolean().default(true),
    darkMode: z.boolean().default(false),
    language: z.string().default("en"),
    header: z.any().optional(),
  }),
  slots: ["header"] as const,
  callbacks: {
    onSave: {
      input: z.object({
        notifications: z.boolean(),
        darkMode: z.boolean(),
        language: z.string(),
      }),
    },
    onClose: {},
  },

  render: (params) => <SettingsDrawerContent {...params} />,
});
