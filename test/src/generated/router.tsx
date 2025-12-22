// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.
"use client";

import { useSearchParams } from "next/navigation";
import { ServeOverlay } from "./serve-overlay";

export function OverlayRouter() {
  const searchParams = useSearchParams();

  const overlayParam = searchParams.get("overlay");
  const dataParam = searchParams.get("data");

  if (!overlayParam) return null;

  // Format: "o:path/to/overlay"
  const overlayName = overlayParam.split(":")[1];
  if (!overlayName) return null;

  let overlayData = {};
  if (dataParam) {
    try {
      // Decode base64 and parse JSON
      overlayData = JSON.parse(atob(dataParam));
    } catch (e) {
      console.error("Failed to parse overlay data:", e);
    }
  }

  return <ServeOverlay overlayName={overlayName} data={overlayData} />;
}

export default OverlayRouter;