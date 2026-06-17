import type { TextSettings } from "types";

export function applyTextSetting(
  settings: TextSettings,
  key: keyof TextSettings,
  value: string
): TextSettings {
  return { ...settings, [key]: value } as TextSettings;
}

/**
 * Builds an ActiveField `update` fn that writes a single text setting onto one
 * named part (e.g. "label" / "value" / "content") of a settings group.
 */
export function buildFieldUpdate(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSettings: (updater: (prev: any) => any) => void,
  part: string
) {
  return (key: keyof TextSettings, value: string) =>
    setSettings((prev: Record<string, TextSettings>) => ({
      ...prev,
      [part]: applyTextSetting(prev[part], key, value)
    }));
}
