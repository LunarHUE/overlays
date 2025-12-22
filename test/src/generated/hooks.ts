// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.
"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "overlay_router_state";
const EVENT_KEY = "overlay_router_change";

/**
 * Hook to manage overlay state through Session Storage
 */
export function useOverlay() {
  const [currentOverlay, setCurrentOverlay] = useState<{name: string, data: any} | null>(null);

  useEffect(() => {
    const checkOverlay = () => {
      try {
        const item = sessionStorage.getItem(STORAGE_KEY);
        if (item) {
          setCurrentOverlay(JSON.parse(item));
        } else {
          setCurrentOverlay(null);
        }
      } catch (e) {
        console.error("Failed to parse overlay state:", e);
        setCurrentOverlay(null);
      }
    };

    checkOverlay();
    window.addEventListener(EVENT_KEY, checkOverlay);
    return () => window.removeEventListener(EVENT_KEY, checkOverlay);
  }, []);

  const openOverlay = useCallback(
    <K extends keyof OverlayMap>(
      name: K,
      data?: OverlayMap[K]
    ) => {
      const state = { name, data };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new Event(EVENT_KEY));
    },
    []
  );

  const closeOverlay = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(EVENT_KEY));
  }, []);

  const updateOverlayData = useCallback(
    <K extends keyof OverlayMap>(data: OverlayMap[K]) => {
      const item = sessionStorage.getItem(STORAGE_KEY);
      if (item) {
        const current = JSON.parse(item);
        const newState = { ...current, data };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        window.dispatchEvent(new Event(EVENT_KEY));
      }
    },
    []
  );

  return {
    currentOverlay,
    openOverlay,
    closeOverlay,
    updateOverlayData,
    isOpen: currentOverlay !== null,
  };
}

/**
 * Hook for overlay actions (used inside overlay components)
 */
export function useOverlayActions() {
  const { closeOverlay, updateOverlayData } = useOverlay();
  return { closeOverlay, updateOverlayData };
}

/**
 * Hook to check if a specific overlay is open
 */
export function useIsOverlayOpen(name: keyof OverlayMap) {
  const { currentOverlay } = useOverlay();
  return currentOverlay?.name === name;
}