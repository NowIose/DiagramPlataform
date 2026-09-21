package com.example.demo.controller;

import com.example.demo.dto.notification.NotificationResponse;
import com.example.demo.model.user.User;
import com.example.demo.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getUserNotifications(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(notificationService.getUserNotifications(user.getUsername()));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<String> markAsRead(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        notificationService.markAsRead(id, user.getUsername());
        return ResponseEntity.ok("Notification marked as read");
    }

    @PostMapping("/{id}/accept-invite")
    public ResponseEntity<String> acceptInvite(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        notificationService.acceptProjectInvite(id, user.getUsername());
        return ResponseEntity.ok("Invite accepted successfully");
    }

    @PostMapping("/{id}/reject-invite")
    public ResponseEntity<String> rejectInvite(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        notificationService.rejectProjectInvite(id, user.getUsername());
        return ResponseEntity.ok("Invite rejected");
    }
}
