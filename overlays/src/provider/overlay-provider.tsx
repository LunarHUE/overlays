'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { OverlayContext } from './overlay-context';
import type { OverlayProviderProps, ActiveOverlay } from '../types';

interface ActiveOverlayState extends ActiveOverlay {
  callbacks: Record<string, (...args: any[]) => any>;
  slots?: Record<string, React.ReactNode>;
}

export function OverlayProvider({
  children,
  portal = false
}: OverlayProviderProps) {
  const registeredOverlays = React.useMemo(() => new Map(), []);
  const [overlayStack, setOverlayStack] = React.useState<ActiveOverlayState[]>([]);

  const portalConfig = React.useMemo(() => {
    if (typeof portal === 'boolean') {
      return {
        enabled: portal,
        container: () => document.body,
        className: 'overlay-portal-root'
      };
    }
    return {
      enabled: portal.enabled ?? true,
      container: portal.container ?? (() => document.body),
      className: portal.className ?? 'overlay-portal-root'
    };
  }, [portal]);

  const registerOverlay = React.useCallback((id: string, definition: any) => {
    registeredOverlays.set(id, definition);
  }, [registeredOverlays]);

  const open = React.useCallback((options: {
    id: string;
    definition: any;
    props: any;
    callbacks: any;
    slots?: Record<string, React.ReactNode>;
  }) => {
    const { id, definition, props, callbacks, slots } = options;

    setOverlayStack((current) => [
      ...current,
      {
        id,
        definition,
        props,
        callbacks,
        slots,
      }
    ]);
  }, []);

  const close = React.useCallback((id?: string) => {
    setOverlayStack((current) => {
      if (current.length === 0) return current;

      // If no id provided, close the topmost overlay (FILO)
      if (!id) {
        return current.slice(0, -1);
      }

      // If id provided, close that specific overlay
      return current.filter((overlay) => overlay.id !== id);
    });
  }, []);

  const closeAll = React.useCallback(() => {
    setOverlayStack([]);
  }, []);

  const overlayContent = overlayStack.length > 0 && (
    <>
      {overlayStack.map((overlay, index) => {
        const Component = overlay.definition.Component;
        return (
          <div
            key={`${overlay.id}-${index}`}
            className={portalConfig.className}
            data-overlay-id={overlay.id}
            style={{ zIndex: 1000 + index }}
          >
            {Component && <Component
              props={overlay.props}
              close={() => close(overlay.id)}
              callbacks={overlay.callbacks}
              slots={overlay.slots ?? {}}
            />}
          </div>
        );
      })}
    </>
  );

  return (
    <OverlayContext.Provider
      value={{
        open,
        close,
        closeAll,
        registeredOverlays,
        registerOverlay,
      }}
    >
      {children}
      {typeof document !== 'undefined' && overlayContent && (
        portalConfig.enabled
          ? createPortal(
              overlayContent,
              typeof portalConfig.container === 'function'
                ? portalConfig.container()
                : portalConfig.container
            )
          : overlayContent
      )}
    </OverlayContext.Provider>
  );
}