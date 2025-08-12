import {
  improvePrompting,
  marketingPromptUseCases,
  openRouterVsOpenAI,
  organizeAIpromptsGuide,
  promptVersioningArticle,
  topChatGPTPrompts,
} from "@/lib/constants/BLOGS";

import type { Article } from "@/types/blog";
import BlogsPage from "@/components/pages/public/BlogsPage";
import { Metadata } from "next";

const blogs: Article[] = [
  improvePrompting,
  topChatGPTPrompts,
  organizeAIpromptsGuide,
  openRouterVsOpenAI,
  marketingPromptUseCases,
  promptVersioningArticle,
];

export const metadata: Metadata = {
  title: "Blogs",
  description: "Explore our latest articles on prompt engineering, AI tools, and more.",
  openGraph: {
    title: "Blogs",
    description: "Explore our latest articles on prompt engineering, AI tools, and more.",
  },
  twitter: {
    card: "summary",
    title: "Blogs",
    description: "Explore our latest articles on prompt engineering, AI tools, and more.",
  },
};

export default function page() {
  return <BlogsPage blogs={blogs} />;
}
