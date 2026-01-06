"use client";

import React from 'react';
import { z } from 'zod';
import { useOverlayContext } from './use-overlay-context';
import type { CallbackSchemas, InferCallbacks, BrandedOverlay } from '../types';

type MakeSlotPropsOptional<
  TProps,
  TSlots extends readonly (keyof TProps)[]
> = Omit<TProps, TSlots[number]> & Partial<Pick<TProps, TSlots[number]>>;

// Counter for generating unique overlay instance IDs
let overlayInstanceCounter = 0;

export function useOverlay<
  TPropsSchema extends z.ZodType<any, any>,
  TCallbackSchemas extends CallbackSchemas,
  TSlots extends readonly (keyof z.infer<TPropsSchema>)[] = readonly []
>(
  overlayDefinition: BrandedOverlay<TPropsSchema, TCallbackSchemas, TSlots>,
) {
  const { open, registerOverlay } = useOverlayContext();
  const definitionId = overlayDefinition.id;

  React.useEffect(() => {
    registerOverlay(definitionId, overlayDefinition as any);
  }, [definitionId, overlayDefinition, registerOverlay]);

  type Props = z.infer<TPropsSchema>;
  type SlotProps = MakeSlotPropsOptional<Props, TSlots>;

  const openOverlay = React.useCallback(
    (options?: {
      props?: SlotProps;
      callbacks?: Partial<InferCallbacks<TCallbackSchemas>>;
      slots?: {
        [K in TSlots[number]]?: React.ReactNode;
      };
    }) => {
      const props = overlayDefinition.validateProps(
        options?.props ?? overlayDefinition.defaultProps ?? {}
      );

      const callbacks = Object.fromEntries(
        Object.entries(options?.callbacks ?? {}).filter(([_, v]) => v !== undefined)
      ) as Record<string, (...args: any[]) => any>;

      // Generate a unique instance ID for each overlay
      const instanceId = `${definitionId}-${++overlayInstanceCounter}`;

      open({
        id: instanceId,
        definition: overlayDefinition as any,
        props,
        callbacks,
        slots: options?.slots as Record<string, React.ReactNode> | undefined,
      });
    },
    [overlayDefinition, open, definitionId]
  );

  return openOverlay;
}