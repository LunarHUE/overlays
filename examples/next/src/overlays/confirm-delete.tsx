import { defineOverlay } from "@lunarhue/overlays";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogMedia,
} from "@/components/ui/alert-dialog";

export const ConfirmDelete = defineOverlay({
  id: "confirm-delete",
  props: z.object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    icon: z.any().optional(),
  }),
  slots: ["icon"] ,
  callbacks: {
    onConfirm: {
      input: z.object({
        id: z.string(),
      }),
    },
    onCancel: {},
  },

  render: ({ props, close, callbacks, slots }) => {
    return (
      <AlertDialog open onOpenChange={(open) => !open && close()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            {(slots.icon ?? props.icon) && (
              <AlertDialogMedia>{slots.icon ?? props.icon}</AlertDialogMedia>
            )}
            <AlertDialogTitle>
              {props.title ?? "Are you absolutely sure?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {props.description ?? `This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                callbacks.onCancel();
                close();
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                callbacks.onConfirm({ id: props.id });
                close();
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
});