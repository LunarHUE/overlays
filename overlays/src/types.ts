import { z } from 'zod';

export interface OverlayDefinition<
  TPropsSchema extends z.ZodType<any, any>,
  TCallbacks extends Record<string, (...args: any[]) => any>
> {
  storageKey: string;
  props: TPropsSchema;
  callbacks?: TCallbacks;
  defaultProps?: Partial<z.infer<TPropsSchema>>;
  defaultCallbacks?: {
    onOpen?: (props: z.infer<TPropsSchema>) => void | Promise<void>;
  };
  usePortal?: boolean;
  render: (params: {
    props: z.infer<TPropsSchema>;
    close: () => void;
    isOpen: boolean;
    callbacks: TCallbacks;
  }) => React.ReactElement;
}

export interface OverlayProviderProps {
  children: React.ReactNode;
  portal?: boolean | {
    enabled?: boolean;
    container?: HTMLElement | (() => HTMLElement);
    className?: string;
  };
}

export interface ActiveOverlay {
  id: string;
  storageKey: string;
  definition: any;
  props: any;
  usePortal: boolean;
}

export interface OverlayContextValue {
  open: (options: {
    id: string;
    storageKey: string;
    definition: any;
    props: any;
    callbacks: any;
    usePortal?: boolean;
  }) => void;
  close: (id?: string) => void;
  closeAll: () => void;
  registeredOverlays: Map<string, any>;
  registerOverlay: (id: string, definition: any) => void;
  activeCallbacks: Map<string, any>;
}