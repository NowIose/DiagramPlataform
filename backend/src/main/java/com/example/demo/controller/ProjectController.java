package com.example.demo.controller;

import com.example.demo.dto.project.CollaboratorRequest;
import com.example.demo.dto.project.ProjectRequest;
import com.example.demo.dto.project.ProjectResponse;
import com.example.demo.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.user.User;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@RequestBody ProjectRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(projectService.createProject(request, user.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getUserProjects(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(projectService.getUserProjects(user.getUsername()));
    }

    @PostMapping("/{id}/collaborators")
    public ResponseEntity<String> addCollaborator(@PathVariable Long id, @RequestBody CollaboratorRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        projectService.addCollaborator(id, request, user.getUsername());
        return ResponseEntity.ok("Collaborator added successfully");
    }

    @DeleteMapping("/{id}/collaborators/{userId}")
    public ResponseEntity<String> removeCollaborator(@PathVariable Long id, @PathVariable Long userId, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        projectService.removeCollaborator(id, userId, user.getUsername());
        return ResponseEntity.ok("Collaborator removed successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(projectService.getProjectById(id, user.getUsername()));
    }

    @PutMapping("/{id}/diagram")
    public ResponseEntity<ProjectResponse> updateDiagram(@PathVariable Long id, @RequestBody String diagramData, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(projectService.updateDiagram(id, diagramData, user.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProject(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        projectService.deleteProject(id, user.getUsername());
        return ResponseEntity.ok("Project deleted successfully");
    }

    @PostMapping("/{id}/share")
    public ResponseEntity<ProjectResponse> updateShareSettings(@PathVariable Long id, @RequestBody java.util.Map<String, Boolean> body, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        boolean isPublic = body.getOrDefault("isPublic", false);
        return ResponseEntity.ok(projectService.generateShareLink(id, user.getUsername(), isPublic));
    }

    @GetMapping("/shared/{token}")
    public ResponseEntity<ProjectResponse> getSharedProject(@PathVariable String token) {
        return ResponseEntity.ok(projectService.getProjectByShareToken(token));
    }
}
