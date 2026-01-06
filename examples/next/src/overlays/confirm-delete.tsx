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
} from "@/components/ui/alert-dialog";

export const ConfirmDelete = defineOverlay({
  id: "confirm-delete",
  props: z.object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
  }),
  callbacks: {
    onConfirm: {
      input: z.object({
        id: z.string(),
      }),
    },
    onCancel: {},
  },
  render: ({ props, close, callbacks }) => {
    return (
      <AlertDialog open onOpenChange={(open) => !open && close()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {props.title ?? "Are you absolutely sure?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {props.description ??
                `This action cannot be undone. This will permanently delete item ${props.id}.`}
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