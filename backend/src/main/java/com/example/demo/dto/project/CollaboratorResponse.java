package com.example.demo.dto.project;

public class CollaboratorResponse {
    private Long userId;
    private String username;
    private String avatarUrl;
    private String role;

    public CollaboratorResponse() {}

    public CollaboratorResponse(Long userId, String username, String avatarUrl, String role) {
        this.userId = userId;
        this.username = username;
        this.avatarUrl = avatarUrl;
        this.role = role;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
