import React from 'react';
import { z } from 'zod';
import { useOverlayContext } from './use-overlay-context';
import { defineOverlay } from '../define-overlay';

type InferProps<T> = T extends { props: z.ZodType<infer P> } ? P : never;
type InferCallbacks<T> = T extends { callbacks?: infer C } ? C : {};

export function useOverlay<T extends ReturnType<typeof defineOverlay>>(
  overlayDefinition: T,
  overrideStorageKey?: string
) {
  const { open, registerOverlay } = useOverlayContext();
  const storageKey = overrideStorageKey || overlayDefinition.storageKey;
  const id = `${storageKey}-${overlayDefinition.__type}`;

  React.useEffect(() => {
    registerOverlay(id, overlayDefinition);
  }, [id, overlayDefinition, registerOverlay]);

  const openOverlay = React.useCallback(
    (options?: {
      props?: InferProps<T>;
      callbacks?: Partial<InferCallbacks<T>>;
    }) => {
      const props = overlayDefinition.validateProps(
        options?.props ?? overlayDefinition.defaultProps ?? {}
      );

      const callbacks = {
        ...overlayDefinition.callbacks,
        ...options?.callbacks,
      };

      overlayDefinition.defaultCallbacks?.onOpen?.(props);

      open({
        id,
        storageKey,
        definition: overlayDefinition,
        props,
        callbacks,
        usePortal: overlayDefinition.usePortal ?? false,
      });
    },
    [overlayDefinition, open, id, storageKey]
  );

  return openOverlay;
}