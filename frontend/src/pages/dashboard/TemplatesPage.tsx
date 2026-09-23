import { useState } from 'react';

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState('flujo');

  const tabs = [
    { id: 'flujo', name: 'Flujo de Arquitectura', icon: 'account_tree' },
    { id: 'transporte', name: 'Transporte (XMI / JSON)', icon: 'data_object' },
    { id: 'ir', name: 'Representación Intermedia (IR)', icon: 'account_tree' },
    { id: 'config', name: 'Configuraciones de Generación', icon: 'settings_applications' },
    { id: 'archivos', name: 'Archivos del Backend', icon: 'folder_zip' },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-6 shrink-0">
        <h2 className="text-2xl font-headline font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">menu_book</span>
          Documentación de Arquitectura y Generación
        </h2>
        <p className="text-on-surface-variant font-body text-sm mt-1">
          Descubre cómo DiagramConnect transforma tus diagramas visuales en código de producción funcional.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 shrink-0 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 custom-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-label font-semibold text-sm transition-colors text-left shrink-0 ${
                activeTab === tab.id
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-low p-6 lg:p-8 overflow-y-auto custom-scrollbar">
          
          {/* TAB 1: FLUJO */}
          {activeTab === 'flujo' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-xl font-headline font-bold text-on-surface">Flujo del Motor de Generación</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                El proceso de síntesis de código en DiagramConnect sigue un modelo de compilación clásico de múltiples etapas. Esto nos permite separar la interfaz visual de las reglas de negocio del código final.
              </p>
              
              <div className="p-6 bg-surface-container rounded-2xl border border-surface-container-highest flex flex-col md:flex-row items-center gap-4 justify-between">
                <div className="text-center w-full">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-surface-container-lowest text-primary flex items-center justify-center shadow-sm mb-2">
                    <span className="material-symbols-outlined">draw</span>
                  </div>
                  <h4 className="font-bold text-sm text-on-surface">1. Editor Visual</h4>
                  <p className="text-[10px] text-on-surface-variant mt-1">React Flow Nodos & Aristas</p>
                </div>
                <span className="material-symbols-outlined text-secondary hidden md:block">arrow_forward</span>
                <div className="text-center w-full">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-surface-container-lowest text-primary flex items-center justify-center shadow-sm mb-2">
                    <span className="material-symbols-outlined">data_object</span>
                  </div>
                  <h4 className="font-bold text-sm text-on-surface">2. Serialización</h4>
                  <p className="text-[10px] text-on-surface-variant mt-1">Exportación XMI / JSON</p>
                </div>
                <span className="material-symbols-outlined text-secondary hidden md:block">arrow_forward</span>
                <div className="text-center w-full">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm mb-2">
                    <span className="material-symbols-outlined">account_tree</span>
                  </div>
                  <h4 className="font-bold text-sm text-on-primary-container">3. Parser (IR/AST)</h4>
                  <p className="text-[10px] text-on-surface-variant mt-1">Representación Intermedia</p>
                </div>
                <span className="material-symbols-outlined text-secondary hidden md:block">arrow_forward</span>
                <div className="text-center w-full">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center shadow-sm mb-2">
                    <span className="material-symbols-outlined">terminal</span>
                  </div>
                  <h4 className="font-bold text-sm text-on-tertiary-container">4. Code Generator</h4>
                  <p className="text-[10px] text-on-surface-variant mt-1">Spring Boot / SQL / Flutter</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRANSPORTE */}
          {activeTab === 'transporte' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-xl font-headline font-bold text-on-surface border-b border-surface-container-high pb-3">Transporte (JSON / XMI)</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                El lienzo del editor no almacena código, sino metadatos puros. Cuando solicitas una generación, los nodos (clases) y las aristas (relaciones) se exportan en un formato estructurado. Transportamos estos datos hacia el motor <strong>Architect</strong> (Parser) para su interpretación.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-[#2d2d2d] text-gray-300 px-4 py-2 text-xs font-mono border-b border-[#404040]">Nodos (Entidades)</div>
                  <pre className="p-4 text-[#d4d4d4] font-mono text-xs overflow-x-auto">
{`{
  "id": "node_1",
  "type": "umlClass",
  "data": {
    "label": "Usuario",
    "attributes": [
      {
        "name": "id",
        "type": "Long",
        "isPrimaryKey": true
      },
      {
        "name": "email",
        "type": "String",
        "isPrimaryKey": false
      }
    ]
  }
}`}
                  </pre>
                </div>
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-[#2d2d2d] text-gray-300 px-4 py-2 text-xs font-mono border-b border-[#404040]">Aristas (Relaciones)</div>
                  <pre className="p-4 text-[#d4d4d4] font-mono text-xs overflow-x-auto">
{`{
  "id": "edge_1",
  "source": "node_1", // Usuario
  "target": "node_2", // Orden
  "type": "relation",
  "data": {
    "cardinalityStart": "1",
    "cardinalityEnd": "N"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IR */}
          {activeTab === 'ir' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-xl font-headline font-bold text-on-surface border-b border-surface-container-high pb-3">Representación Intermedia (IR/AST)</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Antes de escribir una sola línea de Java o SQL, el <code>ASTParser</code> convierte el JSON crudo del lienzo en un Árbol de Sintaxis Abstracta (AST) enfocado en el Dominio. Esto facilita la generación múltiple (puedes generar SQL y Spring Boot usando el mismo IR).
              </p>
              
              <div className="bg-surface-container p-5 rounded-2xl border border-surface-container-highest">
                <h4 className="font-bold text-sm text-on-surface mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">account_tree</span>
                  Estructura del IR (TypeScript)
                </h4>
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-sm">
                  <pre className="p-4 text-[#d4d4d4] font-mono text-xs overflow-x-auto">
{`interface ParsedModel {
  classes: Record<string, ParsedClass>;
  enums: ParsedEnum[];
}

interface ParsedClass {
  name: string;           // Ej: "Usuario"
  attributes: ParsedAttribute[]; 
  relations: ParsedRelation[];
}

interface ParsedRelation {
  type: 'OneToMany' | 'ManyToOne' | 'ManyToMany' | 'OneToOne';
  targetClass: string;    // Referencia a otra clase IR
  fieldName: string;      // Nombre generado (Ej: "ordenes")
  joinColumn?: string;    // Clave foránea calculada
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONFIG */}
          {activeTab === 'config' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-xl font-headline font-bold text-on-surface border-b border-surface-container-high pb-3">Configuraciones de Sistemas (Generadores)</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                El motor de generación soporta inyectar directivas de configuración que alteran drásticamente la salida arquitectónica.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-surface-container-high bg-surface">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-tertiary">shield_person</span>
                    <h4 className="font-bold text-sm text-on-surface">Seguridad JWT</h4>
                  </div>
                  <p className="text-xs text-on-surface-variant">Si se habilita, el generador inyecta <code>UserDetails</code> en tu entidad de usuario, y crea filtros de seguridad Spring Security con encriptación BCrypt y un <code>AuthController</code> automático.</p>
                </div>
                
                <div className="p-4 rounded-xl border border-surface-container-high bg-surface">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary">data_object</span>
                    <h4 className="font-bold text-sm text-on-surface">Patrón DTO y MapStruct</h4>
                  </div>
                  <p className="text-xs text-on-surface-variant">Habilita la separación de capas. El generador creará records DTO (ej. <code>UserRequestDTO</code>) para evitar exponer entidades JPA, previniendo referencias circulares (Infinite Recursion).</p>
                </div>

                <div className="p-4 rounded-xl border border-surface-container-high bg-surface">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-secondary">memory</span>
                    <h4 className="font-bold text-sm text-on-surface">JPA Auditing</h4>
                  </div>
                  <p className="text-xs text-on-surface-variant">Inyecta <code>@EntityListeners(AuditingEntityListener.class)</code>, <code>@CreatedDate</code> y <code>@LastModifiedDate</code> automáticamente para llevar trazabilidad de los datos.</p>
                </div>

                <div className="p-4 rounded-xl border border-surface-container-high bg-surface">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary-container">api</span>
                    <h4 className="font-bold text-sm text-on-surface">CRUD Automático y Swagger</h4>
                  </div>
                  <p className="text-xs text-on-surface-variant">Genera automáticamente métodos <code>GET</code>, <code>POST</code>, <code>PUT</code>, <code>DELETE</code> en los controladores y los documenta con OpenAPI 3 (Swagger UI).</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ARCHIVOS */}
          {activeTab === 'archivos' && (
            <div className="space-y-6 animate-in fade-in duration-300">
               <h3 className="text-xl font-headline font-bold text-on-surface border-b border-surface-container-high pb-3">Estructura de Archivos del Backend</h3>
               <p className="text-sm text-on-surface-variant leading-relaxed">
                 A partir del modelo IR y las configuraciones elegidas, el generador crea un repositorio estructurado siguiendo las mejores prácticas de <strong>Clean Architecture</strong> y el patrón <strong>MVC de Spring Boot</strong>.
               </p>

               <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-sm mt-4">
                 <div className="bg-[#2d2d2d] text-gray-300 px-4 py-2 text-xs font-mono border-b border-[#404040] flex items-center gap-2">
                   <span className="material-symbols-outlined text-[16px]">folder_open</span>
                   Árbol de Directorios Generado
                 </div>
                 <pre className="p-5 text-[#d4d4d4] font-mono text-[13px] leading-relaxed overflow-x-auto">
{`backend-service/
├── pom.xml                 `} <span className="text-secondary/80 italic"># Gestión de dependencias de Maven (Spring Boot, Postgres, JWT, Lombok)</span>{`
├── docker-compose.yml      `} <span className="text-secondary/80 italic"># Levanta la Base de Datos PostgreSQL / MySQL en contenedor local</span>{`
└── src/
    └── main/
        ├── resources/
        │   ├── application.yml   `} <span className="text-secondary/80 italic"># Configuraciones (Puerto, Conexión BD, DDL-Auto, JWT Secret)</span>{`
        │   └── static/           `} <span className="text-secondary/80 italic"># Frontend de prueba y mini-panel administrativo autogenerado</span>{`
        └── java/com/miempresa/
            ├── Application.java  `} <span className="text-secondary/80 italic"># Punto de entrada de la aplicación Spring Boot (@SpringBootApplication)</span>{`
            ├── config/           `} <span className="text-secondary/80 italic"># Configuraciones de infraestructura (Swagger, CORS, Bean de Encriptación)</span>{`
            │
            ├── entities/         `} <span className="text-secondary/80 italic"># Mapeo ORM: Clases Java decoradas con @Entity, @Id, @OneToMany, etc.</span>{`
            ├── repositories/     `} <span className="text-secondary/80 italic"># Acceso a datos: Interfaces que extienden JpaRepository para consultas SQL.</span>{`
            ├── services/         `} <span className="text-secondary/80 italic"># Lógica de Negocio: Clases @Service con @Transactional. Orquestan el CRUD.</span>{`
            ├── controllers/      `} <span className="text-secondary/80 italic"># API REST: Expone los Endpoints HTTP (GET, POST, PUT, DELETE).</span>{`
            │
            ├── dtos/             `} <span className="text-secondary/80 italic"># (Opcional) Objetos de transferencia para no exponer las entidades reales.</span>{`
            └── security/         `} <span className="text-secondary/80 italic"># (Opcional) Filtros JWT, AuthController, UserDetails y configuración de Auth.</span>
                 </pre>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                 <div className="bg-surface-container-lowest border border-surface-container-high rounded-xl p-4">
                   <h4 className="font-bold text-sm text-on-surface mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[18px]">engineering</span> ¿Por qué esta separación?</h4>
                   <p className="text-xs text-on-surface-variant">
                     La separación en <strong>Controladores</strong>, <strong>Servicios</strong> y <strong>Repositorios</strong> permite que la aplicación sea altamente escalable y testeable. Si cambias la base de datos, solo afecta al repositorio. Si cambia la API, solo afecta al controlador, manteniendo la lógica de negocio (Servicios) intacta.
                   </p>
                 </div>
                 <div className="bg-surface-container-lowest border border-surface-container-high rounded-xl p-4">
                   <h4 className="font-bold text-sm text-on-surface mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[18px]">security</span> Seguridad por Defecto</h4>
                   <p className="text-xs text-on-surface-variant">
                     La carpeta <code>security/</code> aísla por completo los filtros HTTP. Esto evita enredar tu lógica de negocio principal con validaciones de Tokens. Todo queda manejado globalmente antes de que la petición toque tus controladores.
                   </p>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
