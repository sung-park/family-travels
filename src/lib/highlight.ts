/** Split text so free-cancellation phrases can be styled distinctly. */
export type TextPart = { text: string; highlight: boolean };

/**
 * Highlights free-cancel deadlines, e.g.
 * "🆓 무료 취소: … 23:59까지" / "센터 포인트 무료 취소: …"
 */
export function splitFreeCancelHighlight(line: string): TextPart[] {
  // Match optional emoji + "무료 취소" through the rest of that clause
  // (prefer ending at 까지. or first period after 취소)
  const re =
    /(?:🆓\s*)?무료\s*취소[^\n]*?(?:까지\.?|(?=\s*$)|(?=\s{2,}))/g;
  const parts: TextPart[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) {
      parts.push({ text: line.slice(last, m.index), highlight: false });
    }
    parts.push({ text: m[0].trimEnd(), highlight: true });
    last = m.index + m[0].length;
  }
  if (last < line.length) {
    parts.push({ text: line.slice(last), highlight: false });
  }
  if (parts.length === 0) {
    parts.push({ text: line, highlight: false });
  }
  // Fallback: whole line about free cancel if regex missed a variant
  if (
    parts.length === 1 &&
    !parts[0]!.highlight &&
    /무료\s*취소/.test(line)
  ) {
    return [{ text: line, highlight: true }];
  }
  return parts;
}

/** Inline **bold** from the markdown bodies, which are rendered as plain text. */
export function splitBold(line: string): TextPart[] {
  const parts: TextPart[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) {
      parts.push({ text: line.slice(last, m.index), highlight: false });
    }
    parts.push({ text: m[1]!, highlight: true });
    last = m.index + m[0].length;
  }
  if (last < line.length) {
    parts.push({ text: line.slice(last), highlight: false });
  }
  if (parts.length === 0) parts.push({ text: line, highlight: false });
  return parts;
}
