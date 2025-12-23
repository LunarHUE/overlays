import { z } from 'zod';
import type { OverlayDefinition } from './types';

export function defineOverlay<
  TPropsSchema extends z.ZodType<any, any>,
  TCallbacks extends Record<string, (...args: any[]) => any>
>(
  definition: OverlayDefinition<TPropsSchema, TCallbacks>
) {
  return {
    ...definition,
    __type: 'overlay' as const,
    validateProps: (props: unknown) => definition.props.parse(props),
    validatePropsSafe: (props: unknown) => definition.props.safeParse(props),
  };
}