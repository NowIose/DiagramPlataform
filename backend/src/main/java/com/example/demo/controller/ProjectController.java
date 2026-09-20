package com.example.demo.controller;

import com.example.demo.dto.project.CollaboratorRequest;
import com.example.demo.dto.project.ProjectRequest;
import com.example.demo.dto.project.ProjectResponse;
import com.example.demo.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
        // authentication.getName() devuelve el username del usuario autenticado vía JWT
        return ResponseEntity.ok(projectService.createProject(request, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getUserProjects(Authentication authentication) {
        return ResponseEntity.ok(projectService.getUserProjects(authentication.getName()));
    }

    @PostMapping("/{id}/collaborators")
    public ResponseEntity<String> addCollaborator(@PathVariable Long id, @RequestBody CollaboratorRequest request, Authentication authentication) {
        projectService.addCollaborator(id, request, authentication.getName());
        return ResponseEntity.ok("Collaborator added successfully");
    }

    @DeleteMapping("/{id}/collaborators/{userId}")
    public ResponseEntity<String> removeCollaborator(@PathVariable Long id, @PathVariable Long userId, Authentication authentication) {
        projectService.removeCollaborator(id, userId, authentication.getName());
        return ResponseEntity.ok("Collaborator removed successfully");
    }
}
