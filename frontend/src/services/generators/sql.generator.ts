import type { Project } from '../../types/project.types';
import { ASTParser } from './ast.parser';
import type { ParsedModel } from './ast.parser';

export class SqlGenerator {
  static generateFiles(project: Project, nodes: any[], edges: any[], config: any): Record<string, string> {
    let sql = `-- Script DDL generado por DiagramConnect\n`;
    sql += `-- Proyecto: ${project.name}\n`;
    sql += `-- Base de Datos: PostgreSQL\n`;
    sql += `-- Fecha: ${new Date().toISOString()}\n\n`;

    const getDbName = (name: string) => {
        if (!name) return 'table_name';
        if (config.namingConvention === 'snake_case') {
            return name.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, '').toLowerCase();
        }
        return name;
    };

    // 1. Usar el nuevo motor AST para entender el diagrama correctamente
    const parsedModel: ParsedModel = ASTParser.parseDiagram(nodes, edges);

    if (config.dropTables) {
        // Drop tables in reverse order to avoid FK constraint errors, or just use CASCADE
        parsedModel.classes.forEach(parsedClass => {
            const tableName = getDbName(parsedClass.name);
            sql += `DROP TABLE IF EXISTS ${tableName} CASCADE;\n`;
        });
        
        parsedModel.enums.forEach(parsedEnum => {
            const enumName = getDbName(parsedEnum.name);
            sql += `DROP TYPE IF EXISTS ${enumName} CASCADE;\n`;
        });
        sql += `\n`;
    }

    // 2. Generar Tipos ENUM
    parsedModel.enums.forEach(parsedEnum => {
        const enumName = getDbName(parsedEnum.name);
        const values = parsedEnum.values.map(v => `'${v}'`).join(', ');
        sql += `CREATE TYPE ${enumName} AS ENUM (${values});\n\n`;
    });

    // 3. Generar Tablas
    parsedModel.classes.forEach(parsedClass => {
        const tableName = getDbName(parsedClass.name);
        sql += `CREATE TABLE ${tableName} (\n`;
        
        const columns: string[] = [];
        
        // 3.1 Atributos propios
        parsedClass.attributes.forEach(attr => {
            // Si hereda de un padre, omitir generar una PK propia (se genera como FK más abajo)
            if (attr.isPrimaryKey && parsedClass.parentName) return;

            const colName = getDbName(attr.name);
            let colType = 'VARCHAR(255)';
            
            if (attr.type === 'Long') colType = 'BIGINT';
            else if (attr.type === 'Integer') colType = 'INTEGER';
            else if (attr.type === 'Boolean') colType = 'BOOLEAN';
            else if (attr.type === 'Double') colType = 'DOUBLE PRECISION';
            else if (attr.type === 'java.time.LocalDateTime') colType = 'TIMESTAMP';
            else if (parsedModel.enums.some(e => e.name === attr.type)) colType = getDbName(attr.type); // Enum type

            let columnDef = `    ${colName} ${colType}`;
            
            if (attr.isPrimaryKey) {
                if (colType === 'BIGINT' || colType === 'INTEGER') {
                    columnDef = `    ${colName} SERIAL PRIMARY KEY`;
                } else {
                    columnDef += ` PRIMARY KEY`;
                }
            }
            columns.push(columnDef);
        });

        // 3.2 Llaves Foráneas (Relaciones ManyToOne y Herencia)
        const fks: string[] = [];

        // Si hay herencia, generar la FK hacia la tabla padre que actúa también como PK
        if (parsedClass.parentName) {
            const parentClass = parsedModel.classes.find(c => c.name === parsedClass.parentName);
            if (parentClass) {
                const parentPk = parentClass.attributes.find(a => a.isPrimaryKey) || { name: 'id', type: 'Long' };
                const pkType = (parentPk.type === 'Long' || parentPk.type === 'Integer') ? 'BIGINT' : 'VARCHAR(255)';
                const pkColName = getDbName(parentPk.name);
                const parentTableName = getDbName(parentClass.name);
                
                columns.push(`    ${pkColName} ${pkType} PRIMARY KEY`);
                fks.push(`    CONSTRAINT fk_${tableName}_${parentTableName} FOREIGN KEY (${pkColName}) REFERENCES ${parentTableName}(${pkColName}) ON DELETE CASCADE`);
            }
        }

        // Relaciones ManyToOne detectadas por el AST (incluyendo clases intermedias)
        parsedClass.relations.filter(r => r.type === 'ManyToOne').forEach(rel => {
            const joinCol = getDbName(rel.joinColumn || `${rel.fieldName}_id`);
            const targetTable = getDbName(rel.targetClass);
            const refCol = getDbName(rel.referencedColumn || 'id');
            
            // Asumimos BIGINT para FKs por defecto si no sabemos el tipo exacto, o VARCHAR si es string
            const targetClass = parsedModel.classes.find(c => c.name === rel.targetClass);
            let fkType = 'BIGINT';
            if (targetClass) {
                const targetPk = targetClass.attributes.find(a => a.isPrimaryKey);
                if (targetPk && targetPk.type === 'String') fkType = 'VARCHAR(255)';
            }

            columns.push(`    ${joinCol} ${fkType}`);
            fks.push(`    CONSTRAINT fk_${tableName}_${joinCol} FOREIGN KEY (${joinCol}) REFERENCES ${targetTable}(${refCol}) ON DELETE CASCADE`);
        });

        if (config.auditColumns) {
            columns.push(`    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
            columns.push(`    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
        }

        sql += columns.concat(fks).join(',\n') + '\n);\n\n';
    });

    const filename = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.sql`;
    
    // Retornamos tanto el SQL como el IR para el visualizador
    return { 
        [filename]: sql,
        "architecture-ir.json": JSON.stringify(parsedModel, null, 2)
    };
  }
}
