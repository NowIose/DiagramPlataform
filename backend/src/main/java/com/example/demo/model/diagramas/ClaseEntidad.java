package com.example.demo.model.diagramas;

import jakarta.persistence.*;

@Entity
@Table(name = "diagram_classes")
public class ClaseEntidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "pos_x")
    private Double posX = 0.0;

    @Column(name = "pos_y")
    private Double posY = 0.0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diagram_id", nullable = false)
    private Diagram diagram;

    public ClaseEntidad() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getPosX() { return posX; }
    public void setPosX(Double posX) { this.posX = posX; }

    public Double getPosY() { return posY; }
    public void setPosY(Double posY) { this.posY = posY; }

    public Diagram getDiagram() { return diagram; }
    public void setDiagram(Diagram diagram) { this.diagram = diagram; }
}