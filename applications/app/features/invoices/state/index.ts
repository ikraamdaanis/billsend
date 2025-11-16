import dayjs from "dayjs";
import type { Atom } from "jotai";
import { atom } from "jotai";
import type { CSSProperties } from "react";

export type TextConfig = {
  value: string;
  fontSize: number;
  color: string;
  fontWeight: number;
  fontFamily: string;
  textAlign: "left" | "center" | "right";
  textDecoration: "none" | "underline" | "overline" | "line-through";
  textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
  hidden: boolean;
};

export function getTextConfig(values: Partial<TextConfig>): TextConfig {
  return {
    value: values.value || "",
    fontSize: values.fontSize || 14,
    color: values.color || "var(--text-color)",
    fontWeight: values.fontWeight || 400,
    fontFamily: values.fontFamily || "Geist",
    textAlign: values.textAlign || "left",
    textDecoration: values.textDecoration || "none",
    textTransform: values.textTransform || "none",
    hidden: values.hidden || false
  };
}

export function getTextStyles(textConfig: TextConfig): CSSProperties {
  return {
    fontSize: textConfig.fontSize + "px",
    color: textConfig.color,
    fontWeight: textConfig.fontWeight,
    fontFamily: textConfig.fontFamily,
    textAlign: textConfig.textAlign,
    textDecoration: textConfig.textDecoration,
    textTransform: textConfig.textTransform
  };
}

export type PartyConfig = {
  name: TextConfig;
  address: TextConfig;
  email: TextConfig;
  phone: TextConfig;
};

export interface TemplateValues {
  components: {
    title: TextConfig;
    number: TextConfig;
    numberLabel: TextConfig;
    date: TextConfig;
    dateLabel: TextConfig;
    dueDate: TextConfig;
    dueDateLabel: TextConfig;
    from: PartyConfig;
    fromLabel: TextConfig;
    to: PartyConfig;
    notes: TextConfig;
    notesLabel: TextConfig;
    terms: TextConfig;
    termsLabel: TextConfig;
  };
  colors: {
    "--accent-color": string;
    "--primary-color": string;
    "--text-color": string;
    "--text-muted-color": string;
  };
}

export interface DesignState {
  currentSelectedPath: TemplatePaths | null;
}

export const designStateAtom = atom<DesignState>({
  currentSelectedPath: null
});

export const updateDesignStateAtom = atom(
  null,
  (get, set, update: { path: TemplatePaths | null }) => {
    const current = get(designStateAtom);
    set(designStateAtom, {
      ...current,
      currentSelectedPath: update.path
    });
  }
);

const DUMMY_ADDRESS = `
123 Main St
Anytown, USA
12345
`;

const initialTemplateValues: TemplateValues = {
  components: {
    title: getTextConfig({ value: "Invoice", fontSize: 32, fontWeight: 600 }),
    number: getTextConfig({ value: "INV-001" }),
    numberLabel: getTextConfig({
      value: "Invoice Number:",
      fontWeight: 500,
      color: "var(--text-muted-color)"
    }),
    date: getTextConfig({
      value: dayjs().format("YYYY-MM-DD")
    }),
    dateLabel: getTextConfig({
      value: "Issue date:",
      fontWeight: 500,
      color: "var(--text-muted-color)"
    }),
    dueDate: getTextConfig({
      value: dayjs().add(30, "day").format("YYYY-MM-DD")
    }),
    dueDateLabel: getTextConfig({
      value: "Due date:",
      fontWeight: 500,
      color: "var(--text-muted-color)"
    }),
    from: {
      name: getTextConfig({ value: "From", fontWeight: 500 }),
      address: getTextConfig({ value: DUMMY_ADDRESS, fontWeight: 500 }),
      email: getTextConfig({ value: "Email", fontWeight: 500 }),
      phone: getTextConfig({ value: "Phone", fontWeight: 500 })
    },
    fromLabel: getTextConfig({ value: "From", fontWeight: 500 }),
    to: {
      name: getTextConfig({ value: "To", fontWeight: 500 }),
      address: getTextConfig({ value: DUMMY_ADDRESS, fontWeight: 500 }),
      email: getTextConfig({ value: "Email", fontWeight: 500 }),
      phone: getTextConfig({ value: "Phone", fontWeight: 500 })
    },
    notes: getTextConfig({ value: "Notes", fontWeight: 500 }),
    notesLabel: getTextConfig({ value: "Notes", fontWeight: 500 }),
    terms: getTextConfig({ value: "Terms", fontWeight: 500 }),
    termsLabel: getTextConfig({ value: "Terms", fontWeight: 500 })
  },
  colors: {
    "--accent-color": "#000000",
    "--primary-color": "#3b82f6",
    "--text-color": "#000000",
    "--text-muted-color": "#6b7280"
  }
} as const;

export const cssVariablesAtom = atom<TemplateValues>(initialTemplateValues);

export const colorsAtom = atom(get => get(cssVariablesAtom).colors);
export const titleAtom = atom(get => get(cssVariablesAtom).components.title);
export const numberAtom = atom(get => get(cssVariablesAtom).components.number);
export const numberLabelAtom = atom(
  get => get(cssVariablesAtom).components.numberLabel
);
export const dateAtom = atom(get => get(cssVariablesAtom).components.date);
export const dateLabelAtom = atom(
  get => get(cssVariablesAtom).components.dateLabel
);
export const dueDateAtom = atom(
  get => get(cssVariablesAtom).components.dueDate
);
export const dueDateLabelAtom = atom(
  get => get(cssVariablesAtom).components.dueDateLabel
);
export const fromAtom = atom(get => get(cssVariablesAtom).components.from);
export const fromLabelAtom = atom(
  get => get(cssVariablesAtom).components.fromLabel
);
export const toAtom = atom(get => get(cssVariablesAtom).components.to);
export const notesAtom = atom(get => get(cssVariablesAtom).components.notes);
export const notesLabelAtom = atom(
  get => get(cssVariablesAtom).components.notesLabel
);
export const termsAtom = atom(get => get(cssVariablesAtom).components.terms);
export const termsLabelAtom = atom(
  get => get(cssVariablesAtom).components.termsLabel
);

export type VariableKeys = keyof (typeof initialTemplateValues)["colors"];

export type PathValue<
  TTemplate,
  TPath extends string
> = TPath extends `${infer TKey}.${infer TRest}`
  ? TKey extends keyof TTemplate
    ? PathValue<TTemplate[TKey], TRest>
    : never
  : TPath extends keyof TTemplate
    ? TTemplate[TPath]
    : never;

export type Paths<TTemplate> = TTemplate extends object
  ? {
      [TKey in keyof TTemplate]: TKey extends string
        ? TTemplate[TKey] extends object
          ? TKey | `${TKey}.${Paths<TTemplate[TKey]>}`
          : TKey
        : never;
    }[keyof TTemplate]
  : never;

export type TemplatePaths = Paths<TemplateValues>;
export type TemplateValue<TPath extends TemplatePaths> = PathValue<
  TemplateValues,
  TPath
>;

export type PathUpdate<TPath extends TemplatePaths> = {
  path: TPath;
  value: TemplateValue<TPath>;
};

function setNestedValue(
  obj: TemplateValues,
  path: string,
  value: unknown
): TemplateValues {
  const keys = path.split(".");
  const result = { ...obj };

  let current: Record<string, unknown> = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!(key in current) || typeof current[key] !== "object") {
      current[key] = {};
    }

    current = { ...(current[key] as Record<string, unknown>) };

    const parent = result;

    let parentRef: Record<string, unknown> = parent;

    for (let j = 0; j < i; j++) {
      parentRef = parentRef[keys[j]] as Record<string, unknown>;
    }

    parentRef[key] = current;
  }

  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return result;
}

function getNestedValue(obj: TemplateValues, path: string): unknown {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (typeof current === "object" && current !== null && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return current;
}

const cssVariableAtomCache = new Map<string, Atom<string>>();
const pathAtomCache = new Map<string, Atom<unknown>>();

export function getCssVariableAtom(variableName: VariableKeys) {
  if (!cssVariableAtomCache.has(variableName)) {
    const baseAtom = cssVariablesAtom;

    cssVariableAtomCache.set(
      variableName,
      atom(get => {
        const current = get(baseAtom);

        return current.colors[variableName];
      })
    );
  }

  return cssVariableAtomCache.get(variableName)!;
}

export function getPathAtom<TPath extends TemplatePaths>(
  path: TPath
): Atom<TemplateValue<TPath>> {
  if (!pathAtomCache.has(path)) {
    pathAtomCache.set(
      path,
      atom(get => {
        const current = get(cssVariablesAtom);
        return getNestedValue(current, path) as TemplateValue<TPath>;
      })
    );
  }

  return pathAtomCache.get(path)! as Atom<TemplateValue<TPath>>;
}

export const updateCssVariableAtom = atom(
  null,
  (get, set, update: { variableName: VariableKeys; value: string }) => {
    const current = get(cssVariablesAtom);

    if (current.colors[update.variableName] === update.value) {
      return;
    }

    set(cssVariablesAtom, {
      ...current,
      colors: {
        ...current.colors,
        [update.variableName]: update.value
      }
    });
  }
);

export const updateCssVariablesAtom = atom(
  null,
  (get, set, variables: Record<string, string>) => {
    const current = get(cssVariablesAtom);
    set(cssVariablesAtom, {
      ...current,
      ...variables
    });
  }
);

export const updatePathAtom = atom(
  null,
  (get, set, update: PathUpdate<TemplatePaths>) => {
    const current = get(cssVariablesAtom);
    const updated = setNestedValue(current, update.path, update.value);
    set(cssVariablesAtom, updated);
  }
);

export function createTypedUpdatePath(
  setter: (update: PathUpdate<TemplatePaths>) => void
) {
  return <TPath extends TemplatePaths>(
    path: TPath,
    value: TemplateValue<TPath>
  ) => {
    setter({ path, value } as PathUpdate<TemplatePaths>);
  };
}

export function createPathUpdater<TPath extends TemplatePaths>(path: TPath) {
  return (value: TemplateValue<TPath>): PathUpdate<TPath> => ({
    path,
    value
  });
}

export const resetAtomAtom = atom(null, (_get, set, values: TemplateValues) => {
  set(cssVariablesAtom, values);
});
