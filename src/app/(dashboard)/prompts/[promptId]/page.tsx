import { redirect } from "next/navigation";

interface PromptPageProps {
  params: { promptId: string };
}

export const metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function PromptPage({ params }: PromptPageProps) {
  return redirect(`/prompts/${params.promptId}/versions`);
}
