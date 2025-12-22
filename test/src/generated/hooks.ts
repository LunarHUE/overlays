// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

/**
 * Hook to manage overlay state through URL search params
 */
export function useOverlay() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentOverlay = useMemo(() => {
    const overlayParam = searchParams.get("overlay");
    if (!overlayParam) return null;

    const overlayName = overlayParam.split(":")[1];
    const dataParam = searchParams.get("data");

    let data = undefined;
    if (dataParam) {
      try {
        data = JSON.parse(atob(dataParam));
      } catch (e) {
        console.error("Failed to parse overlay data:", e);
      }
    }

    return { name: overlayName, data };
  }, [searchParams]);

  const openOverlay = useCallback(
    <K extends keyof OverlayMap>(
      name: K,
      data?: OverlayMap[K],
      options?: { replace?: boolean }
    ) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("overlay", `o:${name}`);

      if (data !== undefined) {
        // Encode data as base64 JSON
        params.set("data", btoa(JSON.stringify(data)));
      } else {
        params.delete("data");
      }

      const url = `${pathname}?${params.toString()}`;
      
      if (options?.replace) {
        router.replace(url);
      } else {
        router.push(url);
      }
    },
    [router, pathname, searchParams]
  );

  const closeOverlay = useCallback(
    (options?: { replace?: boolean }) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("overlay");
      params.delete("data");

      const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;

      if (options?.replace) {
        router.replace(url);
      } else {
        router.push(url);
      }
    },
    [router, pathname, searchParams]
  );

  const updateOverlayData = useCallback(
    <K extends keyof OverlayMap>(data: OverlayMap[K]) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("data", btoa(JSON.stringify(data)));
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
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