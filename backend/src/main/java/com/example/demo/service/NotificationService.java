package com.example.demo.service;

import com.example.demo.dto.notification.NotificationResponse;
import com.example.demo.model.notification.Notification;
import com.example.demo.model.notification.NotificationType;
import com.example.demo.model.project.Project;
import com.example.demo.model.project.ProjectCollaborator;
import com.example.demo.model.project.ProjectRole;
import com.example.demo.model.user.User;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.repository.ProjectCollaboratorRepository;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectCollaboratorRepository collaboratorRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository,
                               ProjectRepository projectRepository,
                               ProjectCollaboratorRepository collaboratorRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.collaboratorRepository = collaboratorRepository;
    }

    public List<NotificationResponse> getUserNotifications(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void markAsRead(Long notificationId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = notificationRepository.findByIdAndRecipientId(notificationId, user.getId())
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void acceptProjectInvite(Long notificationId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = notificationRepository.findByIdAndRecipientId(notificationId, user.getId())
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (notification.getType() != NotificationType.PROJECT_INVITE) {
            throw new RuntimeException("This notification is not a project invite");
        }

        Project project = projectRepository.findById(notification.getRelatedEntityId())
                .orElseThrow(() -> new RuntimeException("Project no longer exists"));

        // Verify not already collaborator
        Optional<ProjectCollaborator> existing = collaboratorRepository.findByProjectIdAndUserId(project.getId(), user.getId());
        if (existing.isEmpty()) {
            ProjectRole role = ProjectRole.valueOf(notification.getMetadata());
            ProjectCollaborator newCollab = new ProjectCollaborator();
            newCollab.setProject(project);
            newCollab.setUser(user);
            newCollab.setRole(role);
            collaboratorRepository.save(newCollab);
        }

        // Delete the notification after accepting
        notificationRepository.delete(notification);
    }

    public void rejectProjectInvite(Long notificationId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = notificationRepository.findByIdAndRecipientId(notificationId, user.getId())
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (notification.getType() != NotificationType.PROJECT_INVITE) {
            throw new RuntimeException("This notification is not a project invite");
        }

        notificationRepository.delete(notification);
    }

    private NotificationResponse mapToResponse(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setType(notification.getType());
        response.setTitle(notification.getTitle());
        response.setMessage(notification.getMessage());
        response.setRead(notification.isRead());
        response.setRelatedEntityId(notification.getRelatedEntityId());
        response.setMetadata(notification.getMetadata());
        response.setCreatedAt(notification.getCreatedAt());
        return response;
    }
}
