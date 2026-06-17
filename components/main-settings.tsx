import { useUI } from "context/ui-context";
import type { LucideIcon } from "lucide-react";
import {
  Building2Icon,
  CalculatorIcon,
  ChevronRightIcon,
  FileTextIcon,
  InfoIcon,
  TableIcon,
  TypeIcon,
  UserIcon
} from "lucide-react";
import type { SettingsType } from "types";

const SECTIONS: { type: SettingsType; label: string; Icon: LucideIcon }[] = [
  { type: "title", label: "Title", Icon: TypeIcon },
  { type: "seller", label: "From", Icon: Building2Icon },
  { type: "client", label: "To", Icon: UserIcon },
  { type: "details", label: "Details", Icon: InfoIcon },
  { type: "table", label: "Line items", Icon: TableIcon },
  { type: "totals", label: "Totals", Icon: CalculatorIcon },
  { type: "terms", label: "Terms", Icon: FileTextIcon }
];

const SECTION_HEADER =
  "text-muted-foreground text-[10px] font-medium uppercase tracking-wider";

export function MainSettings() {
  return (
    <div className="flex h-full flex-col gap-1.5">
      <span className={SECTION_HEADER}>Sections</span>
      <SectionNav />
    </div>
  );
}

function SectionNav() {
  const { setActiveSettings } = useUI();

  function handleSelect(type: SettingsType) {
    setActiveSettings(type);

    const field = document.getElementById(`invoice-field-${type}`);
    if (field) {
      field.focus();
    }
  }

  return (
    <div className="flex flex-col gap-0.5">
      {SECTIONS.map(({ type, label, Icon }) => (
        <button
          key={type}
          type="button"
          onClick={() => handleSelect(type)}
          className="group hover:bg-accent flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-1.5 text-left transition-colors"
        >
          <span className="flex items-center gap-2">
            <Icon className="text-muted-foreground size-3.5" />
            <span className="text-sm">{label}</span>
          </span>
          <ChevronRightIcon className="text-muted-foreground/50 size-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      ))}
    </div>
  );
}
