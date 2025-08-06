export interface SharedPrompt {
  _id: string;
  title: string;
  content: string;
  versionId: string;
  tags: string[];
  responseId: string;
  owner: {
    _id: string;
    avatar: string;
    username: string;
  };
  likeCount: number;
  saveCount: number;
  shareCount: number;
  commentCount: number;
  isUserLiked: boolean;
  isUserSaved: boolean;
  isUserShared: boolean;
  isUserCommented: boolean;
  isUserOwned: boolean;
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
  readonly showUser?: boolean;
}

export interface Comment {
  _id: string;
  author: {
    _id: string;
    username: string;
    avatar: string;
  };
  content: string;
  likeCount: number;
  isUserLiked: boolean;
  isUserOwned: boolean;
  createdAt: string;
}
