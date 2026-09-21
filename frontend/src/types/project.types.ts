export interface Collaborator {
  userId: number;
  username: string;
  avatarUrl?: string;
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
}

export interface Project {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  ownerUsername: string;
  createdAt: string;
  updatedAt: string;
  diagramData: string | null;
  shareToken?: string;
  public?: boolean;
  currentUserRole?: 'OWNER' | 'EDITOR' | 'VIEWER';
  collaborators?: Collaborator[];
}

export interface CreateProjectRequest {
  name: string;
  description: string;
}

export interface CollaboratorRequest {
  email: string;
  role: 'VIEWER' | 'EDITOR' | 'OWNER';
}
