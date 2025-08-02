export interface SharedPrompt {
  _id: string;
  owner: {
    avatar: string;
    username: string;
  };
  title: string;
  content: string;
  tags: string[];
  modelUsed: string;
  responseId?: Response;
  likeCount: number;
  saveCount: number;
  shareCount: number;
  commentCount: number;
  latestComments: Comment[];
  createdAt: string;
}

export interface Comment {
  _id: string;
  userId: string;
  content: string;
  likes: string[];
  createdAt: string;
}

export type Response = {
  _id: string;
  model: string;
  temperature: number;
  createdAt: string;
  responseId: string;
};

export interface SharedPromptCardProps {
  readonly prompt: SharedPrompt;
  readonly showTrendingIndicator?: boolean;
  readonly showUser?: boolean;
}
