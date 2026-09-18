package com.example.demo.model.diagramas;

import jakarta.persistence.*;

@Entity
@Table(name = "diagram_attributes")
public class ClaseAtributos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "data_type", nullable = false)
    private String dataType;

    @Column(nullable = false)
    private String visibility = "+";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private ClaseEntidad claseEntidad;

    public ClaseAtributos() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDataType() { return dataType; }
    public void setDataType(String dataType) { this.dataType = dataType; }

    public String getVisibility() { return visibility; }
    public void setVisibility(String visibility) { this.visibility = visibility; }

    public ClaseEntidad getClaseEntidad() { return claseEntidad; }
    public void setClaseEntidad(ClaseEntidad claseEntidad) { this.claseEntidad = claseEntidad; }
}