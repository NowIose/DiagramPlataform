package com.example.demo.dto;

import com.example.demo.model.user.User;

public class AuthResponse {
    private Long id;
    private String token;
    private String username;
    private String email;
    private String avatarUrl;
    private String role;
    private String authProvider;

    public AuthResponse() {}

    public AuthResponse(String token, User user) {
        this.token = token;
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.avatarUrl = user.getAvatarUrl();
        this.role = user.getRole() != null ? user.getRole().name() : null;
        this.authProvider = user.getAuthProvider() != null ? user.getAuthProvider().name() : null;
    }

    public AuthResponse(String token, String username, String email) {
        this.token = token;
        this.username = username;
        this.email = email;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getAuthProvider() { return authProvider; }
    public void setAuthProvider(String authProvider) { this.authProvider = authProvider; }
}