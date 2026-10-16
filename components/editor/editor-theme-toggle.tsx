import { IconMoon, IconSun } from "@tabler/icons-react";
import type { ComponentProps } from "react";
import { Button } from "~/components/ui/button";
import { useEditorTheme } from "~/hooks/use-editor-theme";

export function EditorThemeToggle(
  props: Omit<ComponentProps<typeof Button>, "onClick" | "children">
) {
  const { theme, toggleTheme } = useEditorTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
      {...props}
    >
      {isDark ? (
        <IconSun aria-hidden="true" />
      ) : (
        <IconMoon aria-hidden="true" />
      )}
    </Button>
  );
}
