package com.example.demo.model.diagramas;

import jakarta.persistence.*;

@Entity
@Table(name = "diagram_relations")
public class ClaseRelaciones {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "relation_type", nullable = false)
    private RelationType relationType;

    @Column(name = "source_multiplicity")
    private String sourceMultiplicity;

    @Column(name = "target_multiplicity")
    private String targetMultiplicity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_class_id", nullable = false)
    private ClaseEntidad sourceClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_class_id", nullable = false)
    private ClaseEntidad targetClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diagram_id", nullable = false)
    private Diagram diagram;

    public enum RelationType {
        ASSOCIATION,
        INHERITANCE,
        AGGREGATION,
        COMPOSITION,
        DEPENDENCY
    }

    public ClaseRelaciones() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public RelationType getRelationType() { return relationType; }
    public void setRelationType(RelationType relationType) { this.relationType = relationType; }

    public String getSourceMultiplicity() { return sourceMultiplicity; }
    public void setSourceMultiplicity(String sourceMultiplicity) { this.sourceMultiplicity = sourceMultiplicity; }

    public String getTargetMultiplicity() { return targetMultiplicity; }
    public void setTargetMultiplicity(String targetMultiplicity) { this.targetMultiplicity = targetMultiplicity; }

    public ClaseEntidad getSourceClass() { return sourceClass; }
    public void setSourceClass(ClaseEntidad sourceClass) { this.sourceClass = sourceClass; }

    public ClaseEntidad getTargetClass() { return targetClass; }
    public void setTargetClass(ClaseEntidad targetClass) { this.targetClass = targetClass; }

    public Diagram getDiagram() { return diagram; }
    public void setDiagram(Diagram diagram) { this.diagram = diagram; }
}