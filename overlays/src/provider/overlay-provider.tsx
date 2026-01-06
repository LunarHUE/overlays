'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { OverlayContext } from './overlay-context';
import type { OverlayProviderProps, ActiveOverlay } from '../types';

interface ActiveOverlayState extends ActiveOverlay {
  callbacks: Record<string, (...args: any[]) => any>;
}

export function OverlayProvider({
  children,
  portal = false
}: OverlayProviderProps) {
  const registeredOverlays = React.useMemo(() => new Map(), []);
  const [activeOverlay, setActiveOverlay] = React.useState<ActiveOverlayState | null>(null);

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
  }) => {
    const { id, definition, props, callbacks } = options;

    setActiveOverlay({
      id,
      definition,
      props,
      callbacks,
    });
  }, []);

  const close = React.useCallback((id?: string) => {
    setActiveOverlay((current) => {
      if (!current) return null;
      if (id && current.id !== id) return current;
      return null;
    });
  }, []);

  const closeAll = React.useCallback(() => {
    setActiveOverlay(null);
  }, []);

  const overlayContent = activeOverlay && (
    <div className={portalConfig.className} data-overlay-id={activeOverlay.id}>
      {activeOverlay.definition.render({
        props: activeOverlay.props,
        close: () => close(activeOverlay.id),
        callbacks: activeOverlay.callbacks,
      })}
    </div>
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