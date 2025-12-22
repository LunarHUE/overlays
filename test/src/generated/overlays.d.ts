// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.

import type { EditProfileOverlayData } from "../overlays/profile/edit.tsx";

declare global {
  interface OverlayMap {
    "profile/edit": EditProfileOverlayData;
  }

  interface OverlayProps<T> {
    data: T;
    onClose?: () => void;
  }
}

export type OverlayPath = keyof OverlayMap;

export {};