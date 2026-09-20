package com.example.demo.repository;

import com.example.demo.model.project.ProjectCollaborator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectCollaboratorRepository extends JpaRepository<ProjectCollaborator, Long> {
    List<ProjectCollaborator> findByProjectId(Long projectId);
    List<ProjectCollaborator> findByUserId(Long userId);
    Optional<ProjectCollaborator> findByProjectIdAndUserId(Long projectId, Long userId);
}
