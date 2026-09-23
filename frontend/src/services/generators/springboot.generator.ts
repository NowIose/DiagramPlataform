import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { Project } from '../../types/project.types';

// ==========================================
// INTERMEDIATE REPRESENTATION (AST)
// ==========================================
interface ParsedAttribute {
    name: string;
    type: string;
    isPrimaryKey: boolean;
    isString: boolean;
}

interface ParsedRelation {
    type: 'ManyToOne' | 'OneToMany';
    targetClass: string;
    fieldName: string;
    joinColumn?: string;
    referencedColumn?: string;
    mappedBy?: string;
    cascade?: string;
}

interface ParsedEnum {
    name: string;
    values: string[];
}

interface ParsedClass {
    id: string;
    name: string;
    parentName: string | null;
    attributes: ParsedAttribute[];
    relations: ParsedRelation[];
    isIntermediate: boolean;
}

interface ParsedModel {
    classes: ParsedClass[];
    enums: ParsedEnum[];
}

export class SpringBootGenerator {

  // ==========================================
  // MÓDULO 1: PARSER (Diagrama -> Modelo IR)
  // ==========================================
  private static parseDiagram(nodes: any[], edges: any[]): ParsedModel {
      const parsedClasses: Record<string, ParsedClass> = {};
      const parsedEnums: ParsedEnum[] = [];

      // 0. Procesar Enums
      nodes.filter(n => n.type === 'umlEnum').forEach(node => {
          const enumName = this.capitalize(node.data.label || 'Enum');
          const values = (node.data.attributes || []).map((a: any) => a.name.toUpperCase());
          parsedEnums.push({ name: enumName, values });
      });

      // 1. Inicializar Clases y Atributos
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
                  // Si el tipo coincide con un Enum, usar su nombre
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

      // 2. Procesar Herencia
      edges.filter(e => e.data?.relationType === 'umlGeneralization').forEach(edge => {
          const parent = parsedClasses[edge.source];
          const child = parsedClasses[edge.target];
          if (parent && child) {
              child.parentName = parent.name;
              // El hijo hereda la PK, por lo tanto sus propios atributos ya no son PK
              child.attributes.forEach(a => a.isPrimaryKey = false);
          }
      });

      // 3. Procesar Clases Intermedias (umlAssociationClass)
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

      // 4. Procesar Asociaciones, Agregaciones y Composiciones
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

  private static mapJavaType(typeStr: string): string {
    const t = (typeStr || '').toLowerCase();
    if (t === 'long' || t === 'bigint') return 'Long';
    if (t === 'int' || t === 'integer') return 'Integer';
    if (t === 'boolean' || t === 'bool') return 'Boolean';
    if (t === 'date' || t === 'datetime' || t === 'timestamp') return 'java.time.LocalDateTime';
    if (t === 'double' || t === 'decimal' || t === 'float') return 'Double';
    return 'String';
  }

  // ==========================================
  // MÓDULO 2: ENSAMBLADOR DE ENTIDAD (Desde IR)
  // ==========================================
  private static generateEnumClass(basePackage: string, parsedEnum: ParsedEnum) {
      const valuesStr = parsedEnum.values.join(', ');
      return `package ${basePackage}.model.entity;\n\npublic enum ${parsedEnum.name} {\n    ${valuesStr}\n}\n`;
  }

  private static generateEntityClass(basePackage: string, parsedClass: ParsedClass, parsedModel: ParsedModel) {
      let imports = `import jakarta.persistence.*;\nimport java.util.*;\nimport com.fasterxml.jackson.annotation.JsonIgnore;\nimport com.fasterxml.jackson.annotation.JsonFormat;\n`;
      let annotations = `@Entity\n@Table(name = "${parsedClass.name.toLowerCase()}")\n`;
      
      const isParent = parsedModel.classes.some(c => c.parentName === parsedClass.name);
      if (isParent) annotations += `@Inheritance(strategy = InheritanceType.JOINED)\n`;

      let extendsClause = parsedClass.parentName ? ` extends ${parsedClass.parentName}` : "";
      
      let fields = ``;
      let gettersSetters = ``;
      
      parsedClass.attributes.forEach(attr => {
          if (attr.isPrimaryKey && parsedClass.parentName) return;

          if (attr.isPrimaryKey) {
              fields += `    @Id\n`;
              if (!attr.isString) fields += `    @GeneratedValue(strategy = GenerationType.IDENTITY)\n`;
          }
          
          if (attr.type === 'java.time.LocalDateTime') {
              fields += `    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")\n`;
          }
          
          if (parsedModel.enums.some(e => e.name === attr.type)) {
              fields += `    @Enumerated(EnumType.STRING)\n`;
          }
          
          fields += `    @Column(name = "${attr.name.toLowerCase()}")\n`;
          fields += `    private ${attr.type} ${attr.name};\n\n`;

          const capName = this.capitalize(attr.name);
          gettersSetters += `    public ${attr.type} get${capName}() {\n        return this.${attr.name};\n    }\n`;
          gettersSetters += `    public void set${capName}(${attr.type} ${attr.name}) {\n        this.${attr.name} = ${attr.name};\n    }\n\n`;
      });

      parsedClass.relations.forEach(rel => {
          if (rel.type === 'ManyToOne') {
              fields += `    @ManyToOne\n`;
              fields += `    @JoinColumn(name = "${rel.joinColumn}", referencedColumnName = "${rel.referencedColumn}")\n`;
              fields += `    private ${rel.targetClass} ${rel.fieldName};\n\n`;
              
              const capName = this.capitalize(rel.fieldName);
              gettersSetters += `    public ${rel.targetClass} get${capName}() {\n        return this.${rel.fieldName};\n    }\n`;
              gettersSetters += `    public void set${capName}(${rel.targetClass} ${rel.fieldName}) {\n        this.${rel.fieldName} = ${rel.fieldName};\n    }\n\n`;
          } else if (rel.type === 'OneToMany') {
              fields += `    @OneToMany(mappedBy = "${rel.mappedBy}"${rel.cascade || ''})\n`;
              fields += `    @JsonIgnore\n`;
              fields += `    private List<${rel.targetClass}> ${rel.fieldName} = new ArrayList<>();\n\n`;
              
              const capName = this.capitalize(rel.fieldName);
              gettersSetters += `    public List<${rel.targetClass}> get${capName}() {\n        return this.${rel.fieldName};\n    }\n`;
              gettersSetters += `    public void set${capName}(List<${rel.targetClass}> ${rel.fieldName}) {\n        this.${rel.fieldName} = ${rel.fieldName};\n    }\n\n`;
          }
      });

      return `package ${basePackage}.model.entity;\n\n${imports}\n${annotations}public class ${parsedClass.name}${extendsClause} {\n\n${fields}\n${gettersSetters}}\n`;
  }

  // ==========================================
  // MÓDULO 3: DUMMY JSON BUILDER (Desde IR)
  // ==========================================
  private static generateDummyJson(parsedClass: ParsedClass, parsedModel: ParsedModel): any {
      const dummy: any = {};
      
      parsedClass.attributes.forEach(attr => {
          if (attr.isPrimaryKey && parsedClass.parentName) return;

          const isEnum = parsedModel.enums.find(e => e.name === attr.type);
          if (isEnum && isEnum.values.length > 0) {
              dummy[attr.name] = isEnum.values[0];
              return;
          }

          if (attr.type === 'String') dummy[attr.name] = `TXT-${Math.floor(Math.random() * 1000)}`;
          else if (attr.type === 'Integer' || attr.type === 'Long') dummy[attr.name] = 1;
          else if (attr.type === 'Boolean') dummy[attr.name] = true;
          else if (attr.type === 'Double') dummy[attr.name] = 1.0;
          else if (attr.type === 'java.time.LocalDateTime') dummy[attr.name] = "2024-01-01T12:00:00";
      });

      parsedClass.relations.filter(r => r.type === 'ManyToOne').forEach(rel => {
          dummy[rel.fieldName] = { 
              [rel.referencedColumn!]: 1
          };
      });

      return dummy;
  }

  // ==========================================
  // MÓDULO 4: GENERADORES DINÁMICOS CRUD
  // ==========================================
  private static getPkTypeForClass(parsedClass: ParsedClass, parsedModel: ParsedModel): string {
      if (parsedClass.parentName) {
          const parent = parsedModel.classes.find(p => p.name === parsedClass.parentName);
          if (parent) return this.getPkTypeForClass(parent, parsedModel);
      }
      const pk = parsedClass.attributes.find(a => a.isPrimaryKey);
      return pk ? pk.type : 'Long';
  }

  private static generateRepository(basePackage: string, parsedClass: ParsedClass, parsedModel: ParsedModel) {
      const pkType = this.getPkTypeForClass(parsedClass, parsedModel);
      return `package ${basePackage}.repository;\n\nimport ${basePackage}.model.entity.${parsedClass.name};\nimport org.springframework.data.jpa.repository.JpaRepository;\nimport org.springframework.stereotype.Repository;\n\n@Repository\npublic interface ${parsedClass.name}Repository extends JpaRepository<${parsedClass.name}, ${pkType}> {\n}\n`;
  }

  private static generateService(basePackage: string, parsedClass: ParsedClass, parsedModel: ParsedModel) {
      const pkType = this.getPkTypeForClass(parsedClass, parsedModel);
      return `package ${basePackage}.service;\n\nimport ${basePackage}.model.entity.${parsedClass.name};\nimport ${basePackage}.repository.${parsedClass.name}Repository;\nimport org.springframework.beans.factory.annotation.Autowired;\nimport org.springframework.stereotype.Service;\n\nimport java.util.List;\nimport java.util.Optional;\n\n@Service\npublic class ${parsedClass.name}Service {\n\n    @Autowired\n    private ${parsedClass.name}Repository repository;\n\n    public List<${parsedClass.name}> findAll() {\n        return repository.findAll();\n    }\n\n    public Optional<${parsedClass.name}> findById(${pkType} id) {\n        return repository.findById(id);\n    }\n\n    public ${parsedClass.name} save(${parsedClass.name} entity) {\n        return repository.save(entity);\n    }\n\n    public void deleteById(${pkType} id) {\n        repository.deleteById(id);\n    }\n}\n`;
  }

  private static generateController(basePackage: string, parsedClass: ParsedClass, parsedModel: ParsedModel, apiPrefix: string) {
      const pkType = this.getPkTypeForClass(parsedClass, parsedModel);
      const endpoint = parsedClass.name.toLowerCase() + "s";
      return `package ${basePackage}.controller;\n\nimport ${basePackage}.model.entity.${parsedClass.name};\nimport ${basePackage}.service.${parsedClass.name}Service;\nimport org.springframework.beans.factory.annotation.Autowired;\nimport org.springframework.http.ResponseEntity;\nimport org.springframework.web.bind.annotation.*;\n\nimport java.util.List;\n\n@RestController\n@RequestMapping("${apiPrefix}/${endpoint}")\n@CrossOrigin(origins = "*")\npublic class ${parsedClass.name}Controller {\n\n    @Autowired\n    private ${parsedClass.name}Service service;\n\n    @GetMapping\n    public List<${parsedClass.name}> getAll() {\n        return service.findAll();\n    }\n\n    @GetMapping("/{id}")\n    public ResponseEntity<${parsedClass.name}> getById(@PathVariable ${pkType} id) {\n        return service.findById(id)\n                .map(ResponseEntity::ok)\n                .orElse(ResponseEntity.notFound().build());\n    }\n\n    @PostMapping\n    public ${parsedClass.name} create(@RequestBody ${parsedClass.name} entity) {\n        return service.save(entity);\n    }\n\n    @PutMapping("/{id}")\n    public ResponseEntity<${parsedClass.name}> update(@PathVariable ${pkType} id, @RequestBody ${parsedClass.name} entity) {\n        return service.findById(id).map(existing -> {\n            return ResponseEntity.ok(service.save(entity));\n        }).orElse(ResponseEntity.notFound().build());\n    }\n\n    @DeleteMapping("/{id}")\n    public ResponseEntity<Void> delete(@PathVariable ${pkType} id) {\n        if (service.findById(id).isPresent()) {\n            service.deleteById(id);\n            return ResponseEntity.ok().build();\n        }\n        return ResponseEntity.notFound().build();\n    }\n}\n`;
  }

  // ==========================================
  // ENSAMBLAJE PRINCIPAL Y UTILIDADES EXTRAS
  // ==========================================
  static generateFiles(_project: Project, nodes: any[], edges: any[], config: any): Record<string, string> {
    const files: Record<string, string> = {};
    const basePackage = config.groupId + '.' + config.artifactId.replace(/[^a-zA-Z0-9]/g, '');
    const packagePath = basePackage.replace(/\./g, '/');
    const mainClassName = this.capitalize(config.artifactId.replace(/[^a-zA-Z0-9]/g, '')) + 'Application';

    files["docker-compose.yml"] = this.generateDockerCompose(config);
    const envContent = `DB_URL=${config.dbUrl}\nDB_USER=${config.dbUser}\nDB_PASS=${config.dbPass}\n`;
    files[".env"] = envContent;
    files[".env.example"] = envContent.replace(config.dbPass || '', 'your_password');

    files["pom.xml"] = this.generatePomXml(config);
    const resourcesPath = "src/main/resources/";
    files[resourcesPath + "application.yml"] = this.generateApplicationYml(config);

    const parsedModel = this.parseDiagram(nodes, edges);
    files["architecture-ir.json"] = JSON.stringify(parsedModel, null, 2);

    files[resourcesPath + "static/index.html"] = this.generateMiniFrontend(config, parsedModel);

    const javaSrcPath = `src/main/java/${packagePath}/`;
    files[javaSrcPath + `${mainClassName}.java`] = this.generateMainClass(basePackage, mainClassName);

    if (config.enableSwagger) {
      files[javaSrcPath + "config/SwaggerConfig.java"] = this.generateSwaggerConfig(basePackage);
    }

    const entitiesPath = javaSrcPath + "model/entity/";
    const repoPath = javaSrcPath + "repository/";
    const servicePath = javaSrcPath + "service/";
    const controllerPath = javaSrcPath + "controller/";

    parsedModel.enums.forEach(parsedEnum => {
        files[entitiesPath + `${parsedEnum.name}.java`] = this.generateEnumClass(basePackage, parsedEnum);
    });

    parsedModel.classes.forEach(parsedClass => {
        files[entitiesPath + `${parsedClass.name}.java`] = this.generateEntityClass(basePackage, parsedClass, parsedModel);

        if (config.enableCrud) {
            files[repoPath + `${parsedClass.name}Repository.java`] = this.generateRepository(basePackage, parsedClass, parsedModel);
            files[servicePath + `${parsedClass.name}Service.java`] = this.generateService(basePackage, parsedClass, parsedModel);
            files[controllerPath + `${parsedClass.name}Controller.java`] = this.generateController(basePackage, parsedClass, parsedModel, config.apiPrefix);
        }
    });

    return files;
  }

  static async generateAndDownload(project: Project, nodes: any[], edges: any[], config: any) {
    const count = parseInt(localStorage.getItem('generationsCount') || '0', 10);
    localStorage.setItem('generationsCount', (count + 1).toString());
    
    const files = this.generateFiles(project, nodes, edges, config);
    const zip = new JSZip();
    Object.entries(files).forEach(([path, content]) => zip.file(path, content));
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${config.artifactId}.zip`);
  }

  private static capitalize(str: string) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private static generateSwaggerConfig(basePackage: string) {
      return `package ${basePackage}.config;\n\nimport io.swagger.v3.oas.models.OpenAPI;\nimport io.swagger.v3.oas.models.info.Info;\nimport org.springframework.context.annotation.Bean;\nimport org.springframework.context.annotation.Configuration;\n\n@Configuration\npublic class SwaggerConfig {\n    @Bean\n    public OpenAPI customOpenAPI() {\n        return new OpenAPI().info(new Info().title("API Generada - CRUD Básico").version("1.0"));\n    }\n}\n`;
  }

  private static generateDockerCompose(config: any) {
    const port = config.dbPort || '5432';
    return `version: '3.8'\nservices:\n  db:\n    image: postgres:15-alpine\n    container_name: ${config.artifactId}-db\n    environment:\n      POSTGRES_USER: \${DB_USER}\n      POSTGRES_PASSWORD: \${DB_PASS}\n      POSTGRES_DB: ${config.artifactId}_db\n    ports:\n      - "${port}:5432"\n    volumes:\n      - postgres_data:/var/lib/postgresql/data\n    restart: unless-stopped\n\nvolumes:\n  postgres_data:\n`;
  }

  private static generatePomXml(config: any) {
    let dependencies = `\n    <dependency>\n      <groupId>org.springframework.boot</groupId>\n      <artifactId>spring-boot-starter-web</artifactId>\n    </dependency>\n    <dependency>\n      <groupId>org.springframework.boot</groupId>\n      <artifactId>spring-boot-starter-data-jpa</artifactId>\n    </dependency>\n    <dependency>\n      <groupId>org.postgresql</groupId>\n      <artifactId>postgresql</artifactId>\n      <scope>runtime</scope>\n    </dependency>`;
    if (config.enableSwagger) {
        dependencies += `\n    <dependency>\n      <groupId>org.springdoc</groupId>\n      <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>\n      <version>2.2.0</version>\n    </dependency>`;
    }
    return `<?xml version="1.0" encoding="UTF-8"?>\n<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">\n    <modelVersion>4.0.0</modelVersion>\n    <parent>\n        <groupId>org.springframework.boot</groupId>\n        <artifactId>spring-boot-starter-parent</artifactId>\n        <version>3.3.4</version>\n        <relativePath/>\n    </parent>\n    <groupId>${config.groupId}</groupId>\n    <artifactId>${config.artifactId}</artifactId>\n    <version>0.0.1-SNAPSHOT</version>\n    <name>${config.artifactId}</name>\n    <properties>\n        <java.version>${config.javaVersion}</java.version>\n    </properties>\n    <dependencies>\n        ${dependencies}\n    </dependencies>\n    <build>\n        <plugins>\n            <plugin>\n                <groupId>org.springframework.boot</groupId>\n                <artifactId>spring-boot-maven-plugin</artifactId>\n            </plugin>\n        </plugins>\n    </build>\n</project>`;
  }

  private static generateApplicationYml(config: any) {
    let yml = `server:\n  port: 8080\n  servlet:\n    context-path: /\n\nspring:\n  config:\n    import: optional:file:.env[.properties]\n  datasource:\n    url: \${DB_URL}\n    username: \${DB_USER}\n    password: \${DB_PASS}\n    driver-class-name: org.postgresql.Driver\n  jpa:\n    hibernate:\n      ddl-auto: ${config.ddlAuto}\n    show-sql: true\n`;
    if (config.enableSwagger) {
        yml += `springdoc:\n  api-docs:\n    path: ${config.apiPrefix}/api-docs\n  swagger-ui:\n    path: /swagger-ui.html\n`;
    }
    return yml;
  }

  private static generateMainClass(basePackage: string, className: string) {
    return `package ${basePackage};\n\nimport org.springframework.boot.SpringApplication;\nimport org.springframework.boot.autoconfigure.SpringBootApplication;\n\n@SpringBootApplication\npublic class ${className} {\n    public static void main(String[] args) {\n        SpringApplication.run(${className}.class, args);\n    }\n}\n`;
  }

  private static generateMiniFrontend(config: any, parsedModel: ParsedModel) {
      let links = '';
      if (config.enableSwagger) {
          links += `<a href="/swagger-ui.html" target="_blank" class="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">Abrir Swagger UI</a>`;
      }
      
      let apiCards = parsedModel.classes.map(parsedClass => {
          const endpoint = config.apiPrefix + '/' + parsedClass.name.toLowerCase() + 's';
          
          const dummyObj = this.generateDummyJson(parsedClass, parsedModel);
          const dummyBase64 = typeof window !== 'undefined' ? btoa(unescape(encodeURIComponent(JSON.stringify(dummyObj)))) : Buffer.from(JSON.stringify(dummyObj)).toString('base64');
          
          return `
          <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 class="text-lg font-bold text-gray-800 mb-1">${parsedClass.name} API</h3>
              <p class="text-sm text-gray-500 mb-4 font-mono">${endpoint}</p>
              <div class="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button onclick="testApi('${endpoint}', 'GET', null)" class="w-full px-3 py-2 bg-green-100 text-green-700 font-bold rounded hover:bg-green-200">Test GET</button>
                  <button onclick="testApi('${endpoint}', 'POST', '${dummyBase64}')" class="w-full px-3 py-2 bg-blue-100 text-blue-700 font-bold rounded hover:bg-blue-200">Test POST (Dummy Data)</button>
              </div>
          </div>
          `;
      }).join('');

      return `<!DOCTYPE html>\n<html lang="es">\n<head>\n    <meta charset="UTF-8">\n    <title>Dashboard | ${config.artifactId}</title>\n    <script src="https://cdn.tailwindcss.com"></script>\n</head>\n<body class="bg-slate-50 min-h-screen text-slate-800 font-sans">\n    <div class="max-w-5xl mx-auto py-12 px-4">\n        <header class="text-center mb-10">\n            <h1 class="text-4xl font-extrabold text-slate-900 mb-3">Backend CRUD Listo 🚀</h1>\n            <p class="text-slate-500 mb-2">Backend Básico Generado por DiagramConnect</p>\n            ${links}\n        </header>\n        <main>\n            <h2 class="text-2xl font-bold mb-6 text-slate-800 text-center">Endpoints Dinámicos</h2>\n            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">\n                ${apiCards}\n            </div>\n            <div class="mt-12 bg-slate-900 rounded-xl p-6 shadow-lg text-white">\n                <h3 class="text-lg font-bold mb-2 text-green-400">Consola</h3>\n                <pre id="console-output" class="font-mono text-sm h-48 overflow-y-auto whitespace-pre-wrap text-gray-300">Esperando ejecución...</pre>\n            </div>\n        </main>\n    </div>\n    <script>\n        async function testApi(endpoint, method, payloadBase64) {\n            const out = document.getElementById('console-output');\n            out.innerHTML = 'Ejecutando ' + method + ' ' + endpoint + '...\\n';\n            const opts = { method, headers: {'Content-Type': 'application/json'} };\n            \n            if (method === 'POST' && payloadBase64) {\n                opts.body = decodeURIComponent(escape(atob(payloadBase64)));\n                out.innerHTML += 'Payload: ' + opts.body + '\\n';\n            }\n            \n            try {\n                const res = await fetch(endpoint, opts);\n                if (!res.ok) throw new Error('Status: ' + res.status + ' (Error de validación o base de datos)');\n                const text = await res.text();\n                try { out.innerHTML += '\\nÉxito:\\n' + JSON.stringify(JSON.parse(text), null, 2); }\n                catch { out.innerHTML += '\\nÉxito:\\n' + text; }\n            } catch (e) {\n                out.innerHTML += '\\nError:\\n' + e.message;\n            }\n        }\n    </script>\n</body>\n</html>`;
  }
}