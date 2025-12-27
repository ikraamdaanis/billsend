import type { DeepKeyOf, DeepValueType } from "types";

/**
 * Set a nested value in an object using a path string array.
 * This is the legacy version without strong typing.
 */
export function setNestedValue<T extends object>(
  obj: T,
  path: string[],
  value: unknown
): T {
  if (path.length === 0) return value as T;

  const [first, ...rest] = path;
  const match = first.match(/^(\w+)\[(\d+)\]$/);

  if (match) {
    const [, key, index] = match;
    const array = (obj as unknown as Record<string, unknown[]>)[key];
    const idx = Number(index);

    return {
      ...obj,
      [key]: [
        ...array.slice(0, idx),
        rest.length === 0
          ? value
          : setNestedValue(array[idx] || {}, rest, value),
        ...array.slice(idx + 1)
      ]
    };
  }

  return {
    ...obj,
    [first]:
      rest.length === 0
        ? value
        : setNestedValue(
            (obj as unknown as Record<string, unknown>)[first] || {},
            rest,
            value
          )
  };
}

/**
 * Type-safe version of setNestedValue that uses DeepKeyOf for better IntelliSense
 * support when working with nested objects. This version provides proper autocomplete
 * for paths and type checking for values.
 *
 * @param obj The object to update
 * @param path A dot-notation path string (with proper type inference)
 * @param value The value to set (with proper type checking)
 * @returns A new object with the updated value
 */
export function setTypedNestedValue<
  T extends object,
  P extends DeepKeyOf<T>,
  V extends DeepValueType<T, P>
>(obj: T, path: P, value: V): T {
  const pathSegments = String(path).split(".");
  return setNestedValue(obj, pathSegments, value);
}
