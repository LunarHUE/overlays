import { z } from 'zod';
import type { OverlayDefinition, CallbackSchemas, BrandedOverlay } from './types';

export function defineOverlay<
  TPropsSchema extends z.ZodType<any, any>,
  TCallbackSchemas extends CallbackSchemas,
  TSlots extends readonly (keyof z.infer<TPropsSchema>)[] = readonly []
>(
  definition: OverlayDefinition<TPropsSchema, TCallbackSchemas, TSlots>
): BrandedOverlay<TPropsSchema, TCallbackSchemas, TSlots> {
  return {
    ...definition,
    __type: 'overlay' as const,
    validateProps: (props: unknown) => definition.props.parse(props),
    validatePropsSafe: (props: unknown) => definition.props.safeParse(props),
  };
}