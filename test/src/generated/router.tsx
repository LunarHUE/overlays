// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.
"use client";

import { ServeOverlay } from "./serve-overlay";
import { useOverlay } from "./hooks";

export function OverlayRouter() {
  const { currentOverlay } = useOverlay();

  if (!currentOverlay) return null;

  return <ServeOverlay overlayName={currentOverlay.name} data={currentOverlay.data} />;
}

export default OverlayRouter;