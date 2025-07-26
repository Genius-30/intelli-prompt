import { redirect } from "next/navigation";

interface FolderPageProps {
  params: Promise<{ folderId: string }>;
}

export const metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default async function FolderPage({ params }: FolderPageProps) {
  const { folderId } = await params;
  redirect(`/folders/${folderId}/prompts`);
}
