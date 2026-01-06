"use client";

import { useOverlay } from "@lunarhue/overlays";
import { ConfirmDelete } from "../overlays/confirm-delete";
import { Button } from "@/components/ui/button";

export default function Page() {
  const openConfirmDelete = useOverlay(ConfirmDelete);

  const handleDelete = () => {
    openConfirmDelete({
      props: {
        id: "item-123",
        // title: "Delete Item",
        // description: "Are you sure you want to delete this item? This action cannot be undone.",
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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Overlay Example</h1>
      <Button onClick={handleDelete} variant="destructive">
        Delete Item
      </Button>
    </div>
  );
}