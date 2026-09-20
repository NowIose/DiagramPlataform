export interface Project {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  ownerUsername: string;
  createdAt: string;
  updatedAt: string;
  diagramData: string | null;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
}

export interface CollaboratorRequest {
  email: string;
  role: 'VIEWER' | 'EDITOR' | 'OWNER';
}
