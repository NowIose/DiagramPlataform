export interface ParsedAttribute {
    name: string;
    type: string;
    isPrimaryKey: boolean;
    isString: boolean;
}

export interface ParsedRelation {
    type: 'ManyToOne' | 'OneToMany';
    targetClass: string;
    fieldName: string;
    joinColumn?: string;
    referencedColumn?: string;
    mappedBy?: string;
    cascade?: string;
}

export interface ParsedEnum {
    name: string;
    values: string[];
}

export interface ParsedClass {
    id: string;
    name: string;
    parentName: string | null;
    attributes: ParsedAttribute[];
    relations: ParsedRelation[];
    isIntermediate: boolean;
}

export interface ParsedModel {
    classes: ParsedClass[];
    enums: ParsedEnum[];
}

export class ASTParser {
    public static capitalize(str: string) {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    private static mapJavaType(typeStr: string): string {
        const t = (typeStr || '').toLowerCase();
        if (t === 'long' || t === 'bigint') return 'Long';
        if (t === 'int' || t === 'integer') return 'Integer';
        if (t === 'boolean' || t === 'bool') return 'Boolean';
        if (t === 'date' || t === 'datetime' || t === 'timestamp') return 'java.time.LocalDateTime';
        if (t === 'double' || t === 'decimal' || t === 'float') return 'Double';
        return 'String';
    }

    public static parseDiagram(nodes: any[], edges: any[]): ParsedModel {
        const parsedClasses: Record<string, ParsedClass> = {};
        const parsedEnums: ParsedEnum[] = [];

        nodes.filter(n => n.type === 'umlEnum').forEach(node => {
            const enumName = this.capitalize(node.data.label || 'Enum');
            const values = (node.data.attributes || []).map((a: any) => a.name.toUpperCase());
            parsedEnums.push({ name: enumName, values });
        });

        nodes.filter(n => n.type === 'umlClass' || n.type === 'umlIntermediateClass').forEach(node => {
            const className = this.capitalize(node.data.label || 'Entity');
            const parsedClass: ParsedClass = {
                id: node.id,
                name: className,
                parentName: null,
                attributes: [],
                relations: [],
                isIntermediate: node.type === 'umlIntermediateClass'
            };

            const attrs = node.data.attributes || [];
            let pkName = attrs.find((a: any) => a.name.toLowerCase() === 'id')?.name;
            if (!pkName && attrs.length > 0) pkName = attrs[0].name;
            if (attrs.length === 0) pkName = 'id';

            if (attrs.length === 0) {
                parsedClass.attributes.push({ name: 'id', type: 'Long', isPrimaryKey: true, isString: false });
            } else {
                attrs.forEach((attr: any) => {
                    let javaType = this.mapJavaType(attr.type);
                    if (parsedEnums.some(e => e.name.toLowerCase() === (attr.type || '').toLowerCase())) {
                        javaType = this.capitalize(attr.type);
                    }
                    
                    parsedClass.attributes.push({
                        name: attr.name,
                        type: javaType,
                        isPrimaryKey: attr.name === pkName,
                        isString: javaType === 'String'
                    });
                });
            }
            parsedClasses[node.id] = parsedClass;
        });

        edges.filter(e => e.data?.relationType === 'umlGeneralization').forEach(edge => {
            const parent = parsedClasses[edge.source];
            const child = parsedClasses[edge.target];
            if (parent && child) {
                child.parentName = parent.name;
                child.attributes.forEach(a => a.isPrimaryKey = false);
            }
        });

        edges.filter(e => e.data?.relationType === 'umlAssociationClass' && e.data?.associatedNodeId).forEach(edge => {
            const source = parsedClasses[edge.source];
            const target = parsedClasses[edge.target];
            const intermediate = parsedClasses[edge.data.associatedNodeId];

            if (source && target && intermediate) {
                const sourcePk = source.attributes.find(a => a.isPrimaryKey) || source.attributes[0] || { name: 'id' };
                const targetPk = target.attributes.find(a => a.isPrimaryKey) || target.attributes[0] || { name: 'id' };

                intermediate.relations.push({
                    type: 'ManyToOne',
                    targetClass: source.name,
                    fieldName: source.name.toLowerCase(),
                    joinColumn: `${source.name.toLowerCase()}_${sourcePk.name.toLowerCase()}`,
                    referencedColumn: sourcePk.name
                });
                source.relations.push({
                    type: 'OneToMany',
                    targetClass: intermediate.name,
                    fieldName: intermediate.name.toLowerCase() + "s",
                    mappedBy: source.name.toLowerCase(),
                    cascade: ', cascade = CascadeType.ALL, orphanRemoval = true'
                });

                intermediate.relations.push({
                    type: 'ManyToOne',
                    targetClass: target.name,
                    fieldName: target.name.toLowerCase(),
                    joinColumn: `${target.name.toLowerCase()}_${targetPk.name.toLowerCase()}`,
                    referencedColumn: targetPk.name
                });
                target.relations.push({
                    type: 'OneToMany',
                    targetClass: intermediate.name,
                    fieldName: intermediate.name.toLowerCase() + "s",
                    mappedBy: target.name.toLowerCase(),
                    cascade: ', cascade = CascadeType.ALL, orphanRemoval = true'
                });
            }
        });

        edges.filter(e => e.data?.relationType !== 'umlGeneralization' && e.data?.relationType !== 'umlAssociationClass').forEach(edge => {
            const source = parsedClasses[edge.source];
            const target = parsedClasses[edge.target];
            
            if (source && target) {
                const sourcePk = source.attributes.find(a => a.isPrimaryKey) || source.attributes[0] || { name: 'id' };
                
                let cascadeParams = '';
                if (edge.data?.relationType === 'umlComposition') cascadeParams = ', cascade = CascadeType.ALL, orphanRemoval = true';
                else if (edge.data?.relationType === 'umlAggregation') cascadeParams = ', cascade = {CascadeType.PERSIST, CascadeType.MERGE}';

                target.relations.push({
                    type: 'ManyToOne',
                    targetClass: source.name,
                    fieldName: source.name.toLowerCase(),
                    joinColumn: `${source.name.toLowerCase()}_${sourcePk.name.toLowerCase()}`,
                    referencedColumn: sourcePk.name
                });

                source.relations.push({
                    type: 'OneToMany',
                    targetClass: target.name,
                    fieldName: target.name.toLowerCase() + "s",
                    mappedBy: source.name.toLowerCase(),
                    cascade: cascadeParams
                });
            }
        });

        return { classes: Object.values(parsedClasses), enums: parsedEnums };
    }
}
