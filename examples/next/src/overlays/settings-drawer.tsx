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
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectGroup, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';

export const SettingsDrawer = defineOverlay({
  id: "settings-drawer",
  props: z.object({
    userId: z.string(),
    notifications: z.boolean().default(true),
    darkMode: z.boolean().default(false),
    language: z.string().default("en"),
    header: z.any().optional(),
  }),
  slots: ["header"],
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

  Component: ({ props, close, callbacks, slots }) => {
    const [notifications, setNotifications] = useState(props.notifications);
    const [darkMode, setDarkMode] = useState(props.darkMode);

    const languageOptions = [
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Spanish' },
      { value: 'fr', label: 'French' },
      { value: 'de', label: 'German' },
    ] as const;

    const defaultLanguage = languageOptions.find(option => option.value === props.language);
    const [language, setLanguage] = useState(defaultLanguage ? defaultLanguage.value : languageOptions[0].value);

    const handleSave = () => {
      callbacks.onSave({ notifications, darkMode, language });
      close();
    };

    return (
      <Sheet open onOpenChange={(open) => !open && close()}>
        <SheetContent>
          {slots.header ? (
              slots.header
          ) : (
            <SheetHeader>
              <SheetTitle>{props.header ?? 'Settings'}</SheetTitle>
              <SheetDescription>
                Manage your account settings and preferences.
              </SheetDescription>
            </SheetHeader>
          )}
          <div className="py-6 space-y-6 px-4">
            <div className="space-y-4">
              <h3 className="font-medium">Notifications</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="flex-1">
                  Enable notifications
                </Label>
                <Checkbox
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={(checked) => setNotifications(checked)}
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
                <Checkbox
                  id="darkMode"
                  checked={darkMode}
                  onCheckedChange={(checked) => setDarkMode(checked)}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">Language</h3>
               <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue>{languageOptions.find(option => option.value === language)?.label ?? 'Select a language'}</SelectValue>
                  </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {languageOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
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
  },
});
