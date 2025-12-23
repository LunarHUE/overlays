export class OverlayStorage {
  private static KEY_PREFIX = 'overlay:';

  static set(overlayId: string, data: any): void {
    if (typeof window === 'undefined') return;

    const key = `${this.KEY_PREFIX}${overlayId}`;
    try {
      sessionStorage.setItem(key, JSON.stringify({
        timestamp: Date.now(),
        data,
      }));
    } catch (e) {
      console.warn('Failed to save overlay data to session storage:', e);
    }
  }

  static get(overlayId: string): any | null {
    if (typeof window === 'undefined') return null;

    const key = `${this.KEY_PREFIX}${overlayId}`;
    const item = sessionStorage.getItem(key);

    if (!item) return null;

    try {
      const { data } = JSON.parse(item);
      return data;
    } catch {
      return null;
    }
  }

  static clear(overlayId: string): void {
    if (typeof window === 'undefined') return;

    const key = `${this.KEY_PREFIX}${overlayId}`;
    sessionStorage.removeItem(key);
  }

  static clearAll(): void {
    if (typeof window === 'undefined') return;

    Object.keys(sessionStorage)
      .filter(key => key.startsWith(this.KEY_PREFIX))
      .forEach(key => sessionStorage.removeItem(key));
  }
}