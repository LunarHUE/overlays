import { z } from 'zod';
import type { OverlayDefinition, CallbackSchemas, BrandedOverlay } from './types';

export function defineOverlay<
  TPropsSchema extends z.ZodType<any, any>,
  TCallbackSchemas extends CallbackSchemas
>(
  definition: OverlayDefinition<TPropsSchema, TCallbackSchemas>
): BrandedOverlay<TPropsSchema, TCallbackSchemas> {
  return {
    ...definition,
    __type: 'overlay' as const,
    validateProps: (props: unknown) => definition.props.parse(props),
    validatePropsSafe: (props: unknown) => definition.props.safeParse(props),
  };
}