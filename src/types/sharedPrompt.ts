export interface SharedPrompt {
  _id: string;
  ownerId: {
    fullname: string;
    avatar: string;
    username: string;
  };
  title: string;
  content: string;
  tags: string[];
  modelUsed: string;
  responseId?: Response;
  likes: string[];
  saves: string[];
  shares: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
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
