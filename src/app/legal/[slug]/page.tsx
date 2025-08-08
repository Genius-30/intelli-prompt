export const dynamic = "force-static"; // Ensure SSG
export const runtime = "nodejs";       // Force Node.js runtime

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

interface LegalPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Scan both policy and terms folders
  const legalFolders = ["lib/content/policy", "lib/content/terms"];
  const slugs: { slug: string }[] = [];

  legalFolders.forEach((folder) => {
    const dirPath = path.join(process.cwd(), "src", folder);
    const files = fs.readdirSync(dirPath);
    files.forEach((filename) => {
      slugs.push({ slug: filename.replace(".md", "") });
    });
  });

  return slugs;
}

export default async function LegalPage({ params }: LegalPageProps) {
  // Check in both folders
  let filePath = path.join(process.cwd(), "src", "lib", "content", "policy", `${(await params).slug}.md`);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(process.cwd(), "src", "lib", "content", "terms", `${(await params).slug}.md`);
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter, content } = matter(fileContent);
  const htmlContent = await marked(content);

  return (
    <main className="prose lg:prose-xl mx-auto p-6">
      <h1>{frontmatter.title}</h1>
      <p className="text-gray-500 text-sm">
        Effective Date: {frontmatter.effectiveDate}
      </p>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </main>
  );
}
