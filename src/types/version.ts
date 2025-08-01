export interface Version {
  _id: string;
  ownerId: string;
  promptId: string;
  versionNumber: number;
  content: string;
  isActive: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface VersionCardProps {
  version: Version;
  isLatest?: boolean;
}
