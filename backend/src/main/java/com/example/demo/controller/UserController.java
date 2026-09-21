package com.example.demo.controller;

import com.example.demo.dto.user.UserSearchResponse;
import com.example.demo.model.user.User;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import com.example.demo.model.project.ProjectCollaborator;
import com.example.demo.model.notification.Notification;
import com.example.demo.model.notification.NotificationType;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.ProjectCollaboratorRepository;
import com.example.demo.repository.NotificationRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectCollaboratorRepository collaboratorRepository;
    private final NotificationRepository notificationRepository;

    public UserController(UserRepository userRepository, 
                          ProjectRepository projectRepository,
                          ProjectCollaboratorRepository collaboratorRepository,
                          NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.collaboratorRepository = collaboratorRepository;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserSearchResponse>> searchUsers(@RequestParam String q, @RequestParam(required = false) Long projectId) {
        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.ok(List.of());
        }
        
        List<User> users = userRepository.findByUsernameContainingIgnoreCase(q.trim());
        
        List<UserSearchResponse> results = users.stream().map(user -> {
            String status = "NONE";
            if (projectId != null) {
                // Check if owner
                var projectOpt = projectRepository.findById(projectId);
                if (projectOpt.isPresent() && projectOpt.get().getOwner().getId().equals(user.getId())) {
                    status = "OWNER";
                } else {
                    // Check if collaborator
                    var collabOpt = collaboratorRepository.findByProjectIdAndUserId(projectId, user.getId());
                    if (collabOpt.isPresent()) {
                        status = "COLLABORATOR";
                    } else {
                        // Check if pending invite
                        var pendingOpt = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(user.getId())
                            .stream()
                            .filter(n -> n.getType() == NotificationType.PROJECT_INVITE && n.getRelatedEntityId().equals(projectId))
                            .findFirst();
                        if (pendingOpt.isPresent()) {
                            status = "PENDING";
                        }
                    }
                }
            }
            return new UserSearchResponse(user.getId(), user.getUsername(), user.getEmail(), user.getAvatarUrl(), status);
        }).collect(Collectors.toList());
                
        return ResponseEntity.ok(results);
    }
}
