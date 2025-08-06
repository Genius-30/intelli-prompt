import { PROMPT_TAGS } from "@/lib/constants/PROMPT_TAGS";

export const flattenPromptTags = () => {
  return PROMPT_TAGS.flatMap((group) =>
    group.tags.map((tag) => ({
      label: tag,
      value: tag,
      category: group.category,
    })),
  );
};
