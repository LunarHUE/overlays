"use client";

import React from 'react';
import { z } from 'zod';
import { useOverlayContext } from './use-overlay-context';
import type { CallbackSchemas, InferCallbacks, BrandedOverlay } from '../types';

export function useOverlay<
  TPropsSchema extends z.ZodType<any, any>,
  TCallbackSchemas extends CallbackSchemas
>(
  overlayDefinition: BrandedOverlay<TPropsSchema, TCallbackSchemas>,
) {
  const { open, registerOverlay } = useOverlayContext();
  const id = `${overlayDefinition.__type}`;

  React.useEffect(() => {
    registerOverlay(id, overlayDefinition as any);
  }, [id, overlayDefinition, registerOverlay]);

  const openOverlay = React.useCallback(
    (options?: {
      props?: z.infer<TPropsSchema>;
      callbacks?: Partial<InferCallbacks<TCallbackSchemas>>;
    }) => {
      const props = overlayDefinition.validateProps(
        options?.props ?? overlayDefinition.defaultProps ?? {}
      );

      const callbacks = Object.fromEntries(
        Object.entries(options?.callbacks ?? {}).filter(([_, v]) => v !== undefined)
      ) as Record<string, (...args: any[]) => any>;

      open({
        id,
        definition: overlayDefinition as any,
        props,
        callbacks,
      });
    },
    [overlayDefinition, open, id]
  );

  return openOverlay;
}