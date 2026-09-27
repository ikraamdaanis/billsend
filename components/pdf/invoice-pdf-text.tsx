import { Text } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";

// Each line gets its own <Text>. An empty <Text> has no height in react-pdf, so
// a blank line renders as a single space to keep the vertical gap the editor's
// textarea shows.
export function PdfMultilineText({
  text,
  style
}: {
  text: string;
  style: Style;
}) {
  return text.split("\n").map((line, lineIndex) => (
    <Text key={lineIndex} style={style}>
      {line || " "}
    </Text>
  ));
}
