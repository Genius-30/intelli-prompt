import { redirect } from "next/navigation";

interface FolderPageProps {
  params: { folderId: string };
}

export const metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function FolderPage({ params }: FolderPageProps) {
  redirect(`/folders/${params.folderId}/prompts`);
}
