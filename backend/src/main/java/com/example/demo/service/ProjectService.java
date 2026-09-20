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
    private final ProjectCollaboratorRepository collaboratorRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository,
                          ProjectCollaboratorRepository collaboratorRepository,
                          UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.collaboratorRepository = collaboratorRepository;
        this.userRepository = userRepository;
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

        return mapToResponse(savedProject);
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
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void addCollaborator(Long projectId, CollaboratorRequest request, String ownerUsername) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getOwner().getUsername().equals(ownerUsername)) {
            throw new RuntimeException("Only the owner can add collaborators");
        }

        User collaboratorUser = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Collaborator not found with email: " + request.getEmail()));

        Optional<ProjectCollaborator> existing = collaboratorRepository.findByProjectIdAndUserId(projectId, collaboratorUser.getId());
        if (existing.isPresent()) {
            throw new RuntimeException("User is already a collaborator");
        }

        ProjectCollaborator newCollab = new ProjectCollaborator();
        newCollab.setProject(project);
        newCollab.setUser(collaboratorUser);
        newCollab.setRole(request.getRole() != null ? request.getRole() : ProjectRole.VIEWER);
        collaboratorRepository.save(newCollab);
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

    private ProjectResponse mapToResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setName(project.getName());
        response.setDescription(project.getDescription());
        response.setOwnerId(project.getOwner().getId());
        response.setOwnerUsername(project.getOwner().getUsername());
        response.setCreatedAt(project.getCreatedAt());
        response.setUpdatedAt(project.getUpdatedAt());
        return response;
    }
}
