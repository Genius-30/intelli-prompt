export interface Article {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  slug: string;
  content: string;
}

export interface BlogsResponse {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
}
