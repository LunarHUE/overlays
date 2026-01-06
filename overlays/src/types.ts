import { z } from 'zod';

export interface CallbackSchema {
  input?: z.ZodType<any, any>;
  output?: z.ZodType<any, any>;
}

export type CallbackSchemas = Record<string, CallbackSchema>;

type GetInputType<T extends CallbackSchema> = T['input'] extends z.ZodType<any, any>
  ? z.infer<T['input']>
  : void;

type GetOutputType<T extends CallbackSchema> = T['output'] extends z.ZodType<any, any>
  ? z.infer<T['output']>
  : void;

export type InferCallback<T extends CallbackSchema> =
  GetInputType<T> extends void
    ? GetOutputType<T> extends void
      ? () => void
      : () => GetOutputType<T>
    : GetOutputType<T> extends void
      ? (input: GetInputType<T>) => void
      : (input: GetInputType<T>) => GetOutputType<T>;

export type InferCallbacks<T extends CallbackSchemas> = {
  [K in keyof T]: InferCallback<T[K]>
};

type GenericOverlayProps = any
type GenericCallbackSchemas = Record<string, CallbackSchema>;
type GenericOverlayDefinition = OverlayDefinition<GenericOverlayProps, GenericCallbackSchemas>;

export interface OverlayDefinition<
  TPropsSchema extends z.ZodType<any, any>,
  TCallbackSchemas extends CallbackSchemas
  > {
  id: string;
  props: TPropsSchema;
  callbacks?: TCallbackSchemas;
  defaultProps?: Partial<z.infer<TPropsSchema>>;
  render: (params: {
    props: z.infer<TPropsSchema>;
    close: () => void;
    callbacks: InferCallbacks<TCallbackSchemas>;
  }) => React.ReactElement;
}

export interface BrandedOverlay<
  TPropsSchema extends z.ZodType<any, any>,
  TCallbackSchemas extends CallbackSchemas
> extends OverlayDefinition<TPropsSchema, TCallbackSchemas> {
  __type: 'overlay';
  validateProps: (props: unknown) => z.infer<TPropsSchema>;
  validatePropsSafe: (props: unknown) => z.ZodSafeParseResult<z.infer<TPropsSchema>>;
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
  definition: GenericOverlayDefinition;
  props: GenericOverlayProps;
}

export interface OverlayContextValue {
  open: (options: {
    id: string;
    definition: GenericOverlayDefinition;
    props: GenericOverlayProps;
    callbacks: Record<string, (...args: any[]) => any>;
  }) => void;
  close: (id?: string) => void;
  closeAll: () => void;
  registeredOverlays: Map<string, GenericOverlayDefinition>;
  registerOverlay: (id: string, definition: GenericOverlayDefinition) => void;
  activeCallbacks: Map<string, Record<string, (...args: any[]) => any>>;
}