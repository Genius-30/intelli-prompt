export type ParsedSection = {
  title: string;
  items: {
    subtitle: string;
    bullets: string[];
  }[];
};

function isSectionHeading(line: string): boolean {
  return /^(\*\*?)?[IVXLC]+\.\s+/.test(line) || /^##\s+/.test(line);
}

function parseSectionTitle(line: string): string {
  return line
    .replace(/^##\s*/, "")
    .replace(/^\*\*?/, "")
    .replace(/\*\*?$/, "")
    .trim();
}

function isSubheading(line: string): boolean {
  return /^[A-Z]\.\s+/.test(line) || /^[-*•]?\s*\*\*.+?\*\*/.test(line);
}

function parseSubtitle(line: string): string {
  return line
    .replace(/^[A-Z]\.\s+/, "")
    .replace(/^[-*•]?\s*\*\*/, "")
    .replace(/\*\*$/, "")
    .replace(/:$/, "")
    .trim();
}

function isBulletPoint(line: string): boolean {
  return /^(\s*)?[-*•]\s+/.test(line) || /^(\s*)?\d+\.\s+/.test(line);
}

function parseBulletContent(line: string): string {
  return line.replace(/^(\s*)?[-*•]|\d+\.\s+/, "").trim();
}

export function parseModelResponse(raw: string): ParsedSection[] {
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;
  let currentItem: ParsedSection["items"][0] | null = null;

  for (const line of lines) {
    if (isSectionHeading(line)) {
      if (currentItem) currentSection?.items.push(currentItem);
      if (currentSection) sections.push(currentSection);

      currentSection = {
        title: parseSectionTitle(line),
        items: [],
      };
      currentItem = null;
      continue;
    }

    if (isSubheading(line)) {
      if (currentItem) currentSection?.items.push(currentItem);

      currentItem = {
        subtitle: parseSubtitle(line),
        bullets: [],
      };
      continue;
    }

    if (isBulletPoint(line)) {
      const content = parseBulletContent(line);
      if (!currentItem) {
        currentItem = { subtitle: "Details", bullets: [] };
      }
      currentItem.bullets.push(content);
      continue;
    }

    // Treat as continuation of previous bullet
    if (currentItem?.bullets.length) {
      const lastIndex = currentItem.bullets.length - 1;
      currentItem.bullets[lastIndex] += " " + line;
    } else {
      // If no bullet but still inside a section/subsection
      if (!currentItem) {
        currentItem = { subtitle: "Details", bullets: [line] };
      } else {
        currentItem.bullets.push(line);
      }
    }
  }

  if (currentItem) currentSection?.items.push(currentItem);
  if (currentSection) sections.push(currentSection);

  return sections;
}
