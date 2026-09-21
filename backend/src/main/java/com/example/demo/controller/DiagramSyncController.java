package com.example.demo.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.demo.service.ProjectService;

@Controller
public class DiagramSyncController {

    private final ProjectService projectService;

    @Autowired
    public DiagramSyncController(ProjectService projectService) {
        this.projectService = projectService;
    }

    /**
     * El cliente envía a /app/diagram.sync.{projectId}
     * El servidor retransmite a /topic/project.{projectId}
     */
    @MessageMapping("/diagram.sync.{projectId}")
    @SendTo("/topic/project.{projectId}")
    public String syncDiagram(@DestinationVariable Long projectId, @Payload String diagramData) {
        // Auto-guardado ligero
        try {
            com.example.demo.model.project.Project project = projectService.getProjectEntityById(projectId);
            project.setDiagramData(diagramData);
            projectService.saveProjectEntity(project);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return diagramData;
    }
}
