package com.example.demo.model.diagramas;

import jakarta.persistence.*;

@Entity
@Table(name = "diagram_methods")
public class ClaseMetodos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "return_type", nullable = false)
    private String returnType = "void";

    @Column(nullable = false)
    private String visibility = "+";

    private String parameters;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private ClaseEntidad claseEntidad;

    public ClaseMetodos() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getReturnType() { return returnType; }
    public void setReturnType(String returnType) { this.returnType = returnType; }

    public String getVisibility() { return visibility; }
    public void setVisibility(String visibility) { this.visibility = visibility; }

    public String getParameters() { return parameters; }
    public void setParameters(String parameters) { this.parameters = parameters; }

    public ClaseEntidad getClaseEntidad() { return claseEntidad; }
    public void setClaseEntidad(ClaseEntidad claseEntidad) { this.claseEntidad = claseEntidad; }
}