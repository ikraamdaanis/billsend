import { IconDownload, IconPlus, IconTrash } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { NativeSelect } from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";

const VARIANTS = [
  "default",
  "primary",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link"
] as const;

const TEXT_SIZES = ["xs", "sm", "default", "lg"] as const;

const ICON_SIZES = ["icon-xs", "icon-sm", "icon", "icon-lg"] as const;

// The editor's UI primitives on the editor's own surface, every variant and
// size, enabled and disabled, for the design catalogue.
export function DesignControls() {
  return (
    <div className="bg-background text-foreground flex min-h-dvh flex-col gap-8 p-6">
      <Group title="Buttons">
        <div className="flex flex-col gap-3">
          {VARIANTS.map(variant => (
            <div key={variant} className="flex flex-wrap items-center gap-3">
              <span className="text-muted-foreground w-24 text-xs">
                {variant}
              </span>
              {TEXT_SIZES.map(size => (
                <Button key={size} variant={variant} size={size}>
                  <IconDownload aria-hidden="true" data-icon="inline-start" />
                  {size === "default" ? "Download" : size}
                </Button>
              ))}
              <Button variant={variant} disabled>
                Disabled
              </Button>
            </div>
          ))}
        </div>
      </Group>
      <Group title="Icon buttons">
        <div className="flex flex-col gap-3">
          {VARIANTS.filter(variant => variant !== "link").map(variant => (
            <div key={variant} className="flex flex-wrap items-center gap-3">
              <span className="text-muted-foreground w-24 text-xs">
                {variant}
              </span>
              {ICON_SIZES.map(size => (
                <Button
                  key={size}
                  variant={variant}
                  size={size}
                  aria-label={`${variant} ${size}`}
                >
                  <IconPlus aria-hidden="true" />
                </Button>
              ))}
              <Button
                variant={variant}
                size="icon"
                aria-label={`${variant} disabled`}
                disabled
              >
                <IconTrash aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>
      </Group>
      <Group title="Fields">
        <div className="grid max-w-xl grid-cols-2 gap-3 max-sm:grid-cols-1">
          <Input aria-label="Empty" placeholder="Placeholder" />
          <Input aria-label="Filled" defaultValue="Northwind Studio" />
          <Input aria-label="Disabled" defaultValue="Disabled" disabled />
          <Input aria-label="Invalid" defaultValue="Invalid" aria-invalid />
          <NativeSelect aria-label="Select" defaultValue="usd">
            <option value="usd">$ Dollar · USD</option>
            <option value="gbp">£ Pound · GBP</option>
          </NativeSelect>
          <NativeSelect aria-label="Disabled select" disabled>
            <option>Disabled</option>
          </NativeSelect>
          <Textarea
            aria-label="Text area"
            placeholder="Add any additional notes"
            className="col-span-full"
          />
        </div>
      </Group>
      <Group title="Switches">
        <div className="flex flex-wrap items-center gap-6">
          <Labelled label="Off">
            <Switch />
          </Labelled>
          <Labelled label="On">
            <Switch defaultChecked />
          </Labelled>
          <Labelled label="Small off">
            <Switch size="sm" />
          </Labelled>
          <Labelled label="Small on">
            <Switch size="sm" defaultChecked />
          </Labelled>
          <Labelled label="Disabled">
            <Switch disabled />
          </Labelled>
          <Labelled label="Disabled on">
            <Switch disabled defaultChecked />
          </Labelled>
        </div>
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Labelled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      {children}
      {label}
    </label>
  );
}
