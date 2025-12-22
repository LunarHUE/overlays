// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.

import type { EditProfileOverlayData } from "../overlays/profile/edit.tsx";
import type { any } from "../overlays/user/create.tsx";

declare global {
  interface OverlayMap {
    "profile/edit": EditProfileOverlayData;
    "user/create": any;
  }

  interface OverlayProps<T extends Record<string, any> = any> {
    data: T;
    onClose?: () => void;
  }
}

export type OverlayPath = keyof OverlayMap;

export {};