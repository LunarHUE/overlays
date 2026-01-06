'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { OverlayContext } from './overlay-context';
import { useURLParams } from '../hooks/use-search-params';
import { OverlayStorage } from '../storage';
import type { OverlayProviderProps, ActiveOverlay } from '../types';

export function OverlayProvider({
  children,
  portal = false
}: OverlayProviderProps) {
  const { searchParams, updateParams } = useURLParams();
  const registeredOverlays = React.useMemo(() => new Map(), []);
  const activeCallbacks = React.useMemo(() => new Map(), []);
  const [activeOverlay, setActiveOverlay] = React.useState<ActiveOverlay | null>(null);

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
    const { id, props, callbacks } = options;

    const currentOverlayId = searchParams.get('overlay');
    const currentStorageKey = searchParams.get('overlay-key');

    if (currentOverlayId && currentOverlayId !== id) {
      if (currentStorageKey) {
        OverlayStorage.clear(currentStorageKey);
      }
      activeCallbacks.delete(currentOverlayId);
    }

    OverlayStorage.set(id, props);
    activeCallbacks.set(id, callbacks);

    updateParams(params => {
      params.set('overlay', id);
    });
  }, [searchParams, updateParams, activeCallbacks]);

  const close = React.useCallback((id?: string) => {
    const currentOverlayId = searchParams.get('overlay');

    if (!id || currentOverlayId === id) {
      if (currentOverlayId) {
        OverlayStorage.clear(currentOverlayId);
        activeCallbacks.delete(currentOverlayId);
      }

      updateParams(params => {
        params.delete('overlay');
      });
    }
  }, [searchParams, updateParams, activeCallbacks]);

  const closeAll = React.useCallback(() => {
    OverlayStorage.clearAll();
    activeCallbacks.clear();

    updateParams(params => {
      params.delete('overlay');
    });
  }, [updateParams, activeCallbacks]);

  React.useEffect(() => {
    const overlayId = searchParams.get('overlay');

    if (!overlayId) {
      setActiveOverlay(null);
      return;
    }

    const definition = registeredOverlays.get(overlayId);
    if (!definition) {
      return;
    }

    const storedData = OverlayStorage.get(overlayId);

    if (storedData) {
      setActiveOverlay({
        id: overlayId,
        definition,
        props: storedData,
      });
    } else {
      close(overlayId);
    }
  }, [searchParams, registeredOverlays, close]);

  const overlayContent = activeOverlay && (
    <div className={portalConfig.className} data-overlay-id={activeOverlay.id}>
      {activeOverlay.definition.render({
        props: activeOverlay.props,
        close: () => close(activeOverlay.id),
        callbacks: activeCallbacks.get(activeOverlay.id) || {},
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
        activeCallbacks
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