"use client";

import { useOverlay } from "@lunarhue/overlays";
import { ConfirmDelete } from "../overlays/confirm-delete";

export default function Page() {
  const openConfirmDelete = useOverlay(ConfirmDelete);

  const handleDelete = () => {
    openConfirmDelete({
      props: {
        id: "item-123",
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
      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Delete Item
      </button>
    </div>
  );
}