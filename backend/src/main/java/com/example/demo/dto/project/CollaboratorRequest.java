package com.example.demo.dto.project;

import com.example.demo.model.project.ProjectRole;

public class CollaboratorRequest {
    private String email;
    private ProjectRole role;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public ProjectRole getRole() {
        return role;
    }

    public void setRole(ProjectRole role) {
        this.role = role;
    }
}
