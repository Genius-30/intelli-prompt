interface ActiveVersion {
  _id: string;
  content: string;
  versionNumber: number;
  isActive: boolean;
  createdAt?: string;
}

export interface PromptCardProps {
  _id: string;
  title: string;
  totalVersions: number;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt?: string;
  activeVersion?: ActiveVersion;
}

export interface Prompt {
  _id: string;
  ownerId: string;
  folderId?: string;
  title: string;
  totalVersions: number;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
}
