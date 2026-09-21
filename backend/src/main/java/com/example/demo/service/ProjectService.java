package com.example.demo.service;

import com.example.demo.dto.project.CollaboratorRequest;
import com.example.demo.dto.project.ProjectRequest;
import com.example.demo.dto.project.ProjectResponse;
import com.example.demo.model.project.Project;
import com.example.demo.model.project.ProjectCollaborator;
import com.example.demo.model.project.ProjectRole;
import com.example.demo.model.user.User;
import com.example.demo.repository.ProjectCollaboratorRepository;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectCollaboratorRepository collaboratorRepository;
    private final com.example.demo.repository.NotificationRepository notificationRepository;

    public ProjectService(ProjectRepository projectRepository,
                          UserRepository userRepository,
                          ProjectCollaboratorRepository collaboratorRepository,
                          com.example.demo.repository.NotificationRepository notificationRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.collaboratorRepository = collaboratorRepository;
        this.notificationRepository = notificationRepository;
    }

    public ProjectResponse createProject(ProjectRequest request, String ownerUsername) {
        User owner = userRepository.findByUsername(ownerUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setOwner(owner);

        Project savedProject = projectRepository.save(project);
        
        // El creador también se añade como colaborador OWNER para facilitar las queries
        ProjectCollaborator ownerCollaborator = new ProjectCollaborator();
        ownerCollaborator.setProject(savedProject);
        ownerCollaborator.setUser(owner);
        ownerCollaborator.setRole(ProjectRole.OWNER);
        collaboratorRepository.save(ownerCollaborator);

        return mapToResponse(savedProject, ownerUsername);
    }

    public List<ProjectResponse> getUserProjects(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Obtener proyectos donde es dueño
        List<Project> ownedProjects = projectRepository.findByOwnerId(user.getId());
        
        // Obtener proyectos donde es colaborador
        List<ProjectCollaborator> collaborations = collaboratorRepository.findByUserId(user.getId());
        List<Project> collaboratedProjects = collaborations.stream()
                .map(ProjectCollaborator::getProject)
                .collect(Collectors.toList());

        // Unir ambas listas sin duplicados
        return Stream.concat(ownedProjects.stream(), collaboratedProjects.stream())
                .distinct()
                .map(project -> mapToResponse(project, username))
                .collect(Collectors.toList());
    }

    public void addCollaborator(Long projectId, CollaboratorRequest request, String ownerUsername) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getOwner().getUsername().equals(ownerUsername)) {
            throw new RuntimeException("Only the owner can add collaborators");
        }

        User collaboratorUser = userRepository.findByEmailOrUsername(request.getEmail(), request.getEmail())
                .orElseThrow(() -> new RuntimeException("Collaborator not found with email or username: " + request.getEmail()));

        Optional<ProjectCollaborator> existing = collaboratorRepository.findByProjectIdAndUserId(projectId, collaboratorUser.getId());
        if (existing.isPresent()) {
            throw new RuntimeException("User is already a collaborator");
        }

        ProjectRole role = request.getRole() != null ? request.getRole() : ProjectRole.VIEWER;

        // Crear notificación de invitación
        com.example.demo.model.notification.Notification notification = new com.example.demo.model.notification.Notification();
        notification.setRecipient(collaboratorUser);
        notification.setType(com.example.demo.model.notification.NotificationType.PROJECT_INVITE);
        notification.setTitle("Invitación a proyecto");
        notification.setMessage("El usuario " + ownerUsername + " te ha invitado a colaborar en el proyecto: " + project.getName());
        notification.setRelatedEntityId(project.getId());
        notification.setMetadata(role.name()); // Guardamos el rol (EDITOR o VIEWER) en los metadatos
        
        // Guardar la notificación
        notificationRepository.save(notification);
    }

    public void removeCollaborator(Long projectId, Long collaboratorUserId, String ownerUsername) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getOwner().getUsername().equals(ownerUsername)) {
            throw new RuntimeException("Only the owner can remove collaborators");
        }
        
        if (project.getOwner().getId().equals(collaboratorUserId)) {
            throw new RuntimeException("Owner cannot be removed from project");
        }

        ProjectCollaborator collab = collaboratorRepository.findByProjectIdAndUserId(projectId, collaboratorUserId)
                .orElseThrow(() -> new RuntimeException("Collaborator not found in this project"));

        collaboratorRepository.delete(collab);
    }

    public ProjectResponse getProjectById(Long projectId, String username) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isOwner = project.getOwner().getId().equals(user.getId());
        boolean isCollaborator = collaboratorRepository.findByProjectIdAndUserId(projectId, user.getId()).isPresent();

        if (!isOwner && !isCollaborator) {
            throw new RuntimeException("You do not have access to this project");
        }

        return mapToResponse(project, username);
    }

    public ProjectResponse updateDiagram(Long projectId, String diagramData, String username) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isOwner = project.getOwner().getId().equals(user.getId());
        Optional<ProjectCollaborator> collab = collaboratorRepository.findByProjectIdAndUserId(projectId, user.getId());
        boolean isEditor = collab.isPresent() && (collab.get().getRole() == ProjectRole.EDITOR || collab.get().getRole() == ProjectRole.OWNER);

        if (!isOwner && !isEditor) {
            throw new RuntimeException("You do not have edit access to this project");
        }

        project.setDiagramData(diagramData);
        Project savedProject = projectRepository.save(project);
        return mapToResponse(savedProject, username);
    }

    public void deleteProject(Long projectId, String username) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getOwner().getUsername().equals(username)) {
            throw new RuntimeException("Only the owner can delete the project");
        }

        projectRepository.delete(project);
    }

    public ProjectResponse generateShareLink(Long projectId, String username, boolean isPublic) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getOwner().getUsername().equals(username)) {
            throw new RuntimeException("Only the owner can modify sharing settings");
        }

        if (isPublic && project.getShareToken() == null) {
            project.setShareToken(java.util.UUID.randomUUID().toString());
        }
        project.setPublic(isPublic);
        
        Project savedProject = projectRepository.save(project);
        return mapToResponse(savedProject, username);
    }

    public ProjectResponse getProjectByShareToken(String token) {
        Project project = projectRepository.findByShareToken(token)
                .orElseThrow(() -> new RuntimeException("Project not found or invalid token"));

        if (!project.isPublic()) {
            throw new RuntimeException("This project is no longer public");
        }

        return mapToResponse(project, null);
    }

    private ProjectResponse mapToResponse(Project project, String currentUsername) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setName(project.getName());
        response.setDescription(project.getDescription());
        response.setOwnerId(project.getOwner().getId());
        response.setOwnerUsername(project.getOwner().getUsername());
        response.setCreatedAt(project.getCreatedAt());
        response.setUpdatedAt(project.getUpdatedAt());
        response.setDiagramData(project.getDiagramData());
        response.setShareToken(project.getShareToken());
        response.setPublic(project.isPublic());

        // Mapear colaboradores
        List<ProjectCollaborator> collabs = collaboratorRepository.findByProjectId(project.getId());
        List<com.example.demo.dto.project.CollaboratorResponse> collabResponses = collabs.stream()
            .map(c -> new com.example.demo.dto.project.CollaboratorResponse(
                c.getUser().getId(),
                c.getUser().getUsername(),
                c.getUser().getAvatarUrl(),
                c.getRole().name()
            ))
            .collect(Collectors.toList());
        response.setCollaborators(collabResponses);

        // Determinar rol del usuario actual
        if (currentUsername == null) {
            response.setCurrentUserRole("VIEWER"); // Default for public links
        } else if (project.getOwner().getUsername().equals(currentUsername)) {
            response.setCurrentUserRole("OWNER");
        } else {
            collabs.stream()
                .filter(c -> c.getUser().getUsername().equals(currentUsername))
                .findFirst()
                .ifPresentOrElse(
                    c -> response.setCurrentUserRole(c.getRole().name()),
                    () -> response.setCurrentUserRole("VIEWER")
                );
        }

        return response;
    }

    public Project getProjectEntityById(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public void saveProjectEntity(Project project) {
        projectRepository.save(project);
    }
}
