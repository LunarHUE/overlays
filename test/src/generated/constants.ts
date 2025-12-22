// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.

/**
 * Overlay paths as constants for easier imports and refactoring
 */
export const OVERLAYS = {
  PROFILE_EDIT: "profile/edit" as const,
  USER_CREATE: "user/create" as const,
} as const;

export type OverlayKey = typeof OVERLAYS[keyof typeof OVERLAYS];