import { redirect } from "next/navigation";

interface PromptPageProps {
  params: { folderId: string; promptId: string };
}

export const metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function PromptsPage({ params }: PromptPageProps) {
  redirect(`/folders/${params.folderId}/prompts/${params.promptId}`);
}
