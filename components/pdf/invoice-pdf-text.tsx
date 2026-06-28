import { Text } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";

export function PdfMultilineText({
  text,
  style
}: {
  text: string;
  style: Style;
}) {
  return text.split("\n").map((line, lineIndex) => (
    <Text key={lineIndex} style={style}>
      {line}
    </Text>
  ));
}
