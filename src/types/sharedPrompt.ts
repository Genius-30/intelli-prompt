export interface SharedPromptComment {
  _id: string;
  userId: string;
  content: string;
  likes: string[];
  createdAt: string;
}

export interface SharedPrompt {
  _id: string;
  ownerId: string;
  title: string;
  content: string;
  tags: string[];
  modelUsed: string;
  likes: string[];
  saves: string[];
  shares: string[];
  comments: SharedPromptComment[];
  createdAt: string;
  updatedAt: string;
}
