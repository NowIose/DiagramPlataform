package com.example.demo.dto.user;

public class UserSearchResponse {
    private Long id;
    private String username;
    private String email;
    private String avatarUrl;
    private String projectStatus;

    public UserSearchResponse(Long id, String username, String email, String avatarUrl) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.avatarUrl = avatarUrl;
    }

    public UserSearchResponse(Long id, String username, String email, String avatarUrl, String projectStatus) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.avatarUrl = avatarUrl;
        this.projectStatus = projectStatus;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getProjectStatus() { return projectStatus; }
    public void setProjectStatus(String projectStatus) { this.projectStatus = projectStatus; }
}
