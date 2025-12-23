import { useContext } from 'react';
import { OverlayContext } from '../provider/overlay-context';

export function useOverlayContext() {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('useOverlayContext must be used within OverlayProvider');
  }
  return context;
}