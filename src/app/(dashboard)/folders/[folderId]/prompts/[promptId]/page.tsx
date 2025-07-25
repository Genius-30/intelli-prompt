import { redirect } from "next/navigation";

interface PromptPageProps {
  params: Promise<{ folderId: string; promptId: string }>;
}

export const metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default async function PromptsPage({ params }: PromptPageProps) {
  const { folderId, promptId } = await params;
  redirect(`/folders/${folderId}/prompts/${promptId}/versions`);
}
