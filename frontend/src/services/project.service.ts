import axios from 'axios';
import type { Project, CreateProjectRequest, CollaboratorRequest } from '../types/project.types';

const API_URL = 'http://localhost:8080/api/projects';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const ProjectService = {
  getProjects: async (): Promise<Project[]> => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  },

  getProjectById: async (id: number): Promise<Project> => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  },

  createProject: async (request: CreateProjectRequest): Promise<Project> => {
    const response = await axios.post(API_URL, request, getAuthHeaders());
    return response.data;
  },

  updateDiagram: async (id: number, diagramData: string): Promise<Project> => {
    const response = await axios.put(`${API_URL}/${id}/diagram`, diagramData, {
      ...getAuthHeaders(),
      headers: {
        ...getAuthHeaders().headers,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  deleteProject: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  },

  addCollaborator: async (id: number, request: CollaboratorRequest): Promise<void> => {
    await axios.post(`${API_URL}/${id}/collaborators`, request, getAuthHeaders());
  },

  removeCollaborator: async (id: number, userId: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}/collaborators/${userId}`, getAuthHeaders());
  },
};
