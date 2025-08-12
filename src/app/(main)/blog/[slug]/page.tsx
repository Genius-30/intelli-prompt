import {
  improvePrompting,
  marketingPromptUseCases,
  openRouterVsOpenAI,
  organizeAIpromptsGuide,
  promptVersioningArticle,
  topChatGPTPrompts,
} from "@/lib/constants/BLOGS";

import type { Article } from "@/types/blog";
import BlogDetailPage from "@/components/pages/public/BlogDetailsPage";
import { SITE_URL } from "@/lib/constants/SITE_URL";

const blogs: Article[] = [
  improvePrompting,
  topChatGPTPrompts,
  organizeAIpromptsGuide,
  openRouterVsOpenAI,
  marketingPromptUseCases,
  promptVersioningArticle,
];

export async function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }: { readonly params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: `No blog found with the slug ${slug}.`,
    };
  }

  return {
    title: `${blog.title}`,
    description: `Explore prompt collections and activity of ${blog.title} on IntelliPrompt.`,
    openGraph: {
      title: `${blog.title}`,
      description: `Check out public prompts, stats, and favorites from ${blog.title}.`,
      url: `${SITE_URL}/blog/${blog.slug}`,
      siteName: "IntelliPrompt",
      images: [
        {
          url: `${SITE_URL}/og-blog.png`,
          width: 1200,
          height: 630,
          alt: `${blog.title} – AI Prompt Blog Post`,
        },
      ],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${blog.title}`,
      description: `Explore prompt collections and activity of ${blog.title} on IntelliPrompt.`,
      images: [`${SITE_URL}/og-blog.png`],
    },
  };
}

export default async function page({ params }: { readonly params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);

  return <BlogDetailPage blog={blog} />;
}
