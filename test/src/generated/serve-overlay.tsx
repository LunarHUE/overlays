// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.
"use client";

import React, { Suspense, lazy, useMemo } from "react";
import { useOverlayActions } from "./hooks";

import ProfileEditOverlay from "../overlays/profile/edit";

// Map of overlay names to components
const overlayComponents = {
  "profile/edit": ProfileEditOverlay,
} as const;

// Lazy-loaded versions for code splitting (optional)
const lazyOverlayComponents = {
  "profile/edit": lazy(() => import("../overlays/profile/edit")),
} as const;

interface ServeOverlayProps {
  overlayName: string;
  data?: any;
  lazy?: boolean;
}

export function ServeOverlay({ overlayName, data, lazy = false }: ServeOverlayProps) {
  const { closeOverlay } = useOverlayActions();

  const Component = useMemo(() => {
    const components = lazy ? lazyOverlayComponents : overlayComponents;
    return components[overlayName as keyof typeof components];
  }, [overlayName, lazy]);

  if (!Component) {
    console.error(`Overlay "${overlayName}" not found`);
    return null;
  }

  const content = <Component data={data} onClose={closeOverlay} />;

  if (lazy) {
    return (
      <Suspense fallback={<div>Loading overlay...</div>}>
        {content}
      </Suspense>
    );
  }

  return content;
}

export default ServeOverlay;