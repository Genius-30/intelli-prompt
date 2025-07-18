import { useQuery } from "@tanstack/react-query";

export function useGetPromptsByFolder(folderId: string) {
  return useQuery({
    queryKey: ["prompts", "folder", folderId],
    queryFn: async () => {
      // Replace with your actual API call
      const response = await fetch(`/api/folders/${folderId}/prompts`);
      if (!response.ok) {
        throw new Error("Failed to fetch prompts");
      }
      return response.json();
    },
    enabled: !!folderId,
  });
}

export function useGetPromptMeta(promptId: string) {
  return useQuery({
    queryKey: ["promptMeta", promptId],
    queryFn: async () => {
      if (!promptId) throw new Error("Prompt ID is required");

      const response = await fetch(`/api/prompts/${promptId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch prompt metadata");
      }
      return response.json();
    },
    enabled: !!promptId,
  });
}
