import { useState, useEffect } from 'react';
import type { Project } from '../../types/project.types';

interface GenerationConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  mode: 'sql' | 'springboot';
  onGenerate: (config: any) => void;
}

export default function GenerationConfigModal({ isOpen, onClose, project, mode, onGenerate }: GenerationConfigModalProps) {
  const [activeTab, setActiveTab] = useState(1);

  // Estados Formulario - Spring Boot
  const [groupId, setGroupId] = useState('com.miempresa');
  const [artifactId, setArtifactId] = useState('');
  const [javaVersion, setJavaVersion] = useState('21');
  const [apiPrefix, setApiPrefix] = useState('/api/v1');
  const [enableCors, setEnableCors] = useState(true);
  
  const [securityType, setSecurityType] = useState('none');
  const [userEntityName, setUserEntityName] = useState('Usuario');
  const [generateRoles, setGenerateRoles] = useState(true);

  const [ddlAuto, setDdlAuto] = useState('update');
  const [dbPort, setDbPort] = useState('5432');
  const [dbUrl, setDbUrl] = useState('jdbc:postgresql://localhost:5432/mibd');
  const [dbUser, setDbUser] = useState('postgres');
  const [dbPass, setDbPass] = useState('');
  const [enableAuditing, setEnableAuditing] = useState(true);

  const [enableCrud, setEnableCrud] = useState(true);
  const [enableDto, setEnableDto] = useState(true);
  const [enableSwagger, setEnableSwagger] = useState(true);
  const [enableLombok, setEnableLombok] = useState(true);
  const [enableFlutter, setEnableFlutter] = useState(true); // Estado para Agentic Frontend

  // Estados Formulario - SQL
  const [namingConvention, setNamingConvention] = useState('snake_case');
  const [dropTables, setDropTables] = useState(true);
  const [auditColumns, setAuditColumns] = useState(true);

  useEffect(() => {
    if (project) {
      setArtifactId(project.name.toLowerCase().replace(/[^a-z0-9]/g, '-'));
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const handleGenerateClick = () => {
    const config = mode === 'springboot' ? {
      groupId, artifactId, javaVersion, apiPrefix, enableCors,
      securityType, userEntityName, generateRoles,
      ddlAuto, dbUrl, dbPort, dbUser, dbPass, enableAuditing,
      enableCrud, enableDto, enableSwagger, enableLombok,
      enableFlutter
    } : {
      namingConvention, dropTables, auditColumns
    };
    onGenerate(config);
  };

  const renderToggle = (label: string, desc: string, state: boolean, setter: (val: boolean) => void) => (
    <label className="flex items-start gap-3 p-3 rounded-xl border border-surface-container-high bg-surface-container-lowest hover:border-primary/50 cursor-pointer transition-colors">
      <div className="pt-0.5">
        <input 
          type="checkbox" 
          checked={state} 
          onChange={(e) => setter(e.target.checked)}
          className="w-4 h-4 rounded text-primary focus:ring-primary/50 border-surface-container-highest cursor-pointer accent-primary"
        />
      </div>
      <div>
        <p className="text-sm font-headline font-semibold text-on-surface leading-tight">{label}</p>
        <p className="text-xs font-body text-on-surface-variant mt-0.5">{desc}</p>
      </div>
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/40 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-4xl rounded-3xl shadow-xl border border-surface-container overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-surface-container-low flex items-center justify-between bg-surface-container-lowest shrink-0">
          <div>
            <h2 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                {mode === 'sql' ? 'database' : 'local_fire_department'}
              </span>
              Configuración de Generación: {mode === 'sql' ? 'Script DDL' : 'Spring Boot'}
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Proyecto base: <span className="font-semibold text-on-surface">{project.name}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Pestañas Laterales (Solo para Spring Boot) */}
          {mode === 'springboot' && (
            <div className="w-56 bg-surface-container-lowest border-r border-surface-container-low flex flex-col shrink-0 overflow-y-auto">
              <button onClick={() => setActiveTab(1)} className={`p-4 text-left border-l-4 transition-colors ${activeTab === 1 ? 'border-primary bg-primary/10 text-primary' : 'border-transparent text-on-surface hover:bg-surface-container-high'}`}>
                <span className="block font-headline font-semibold text-sm">1. Proyecto base</span>
                <span className="block text-xs text-on-surface-variant mt-0.5 opacity-80">Maven, Java, Paquetes</span>
              </button>
              <button onClick={() => setActiveTab(2)} className={`p-4 text-left border-l-4 transition-colors ${activeTab === 2 ? 'border-primary bg-primary/10 text-primary' : 'border-transparent text-on-surface hover:bg-surface-container-high'}`}>
                <span className="block font-headline font-semibold text-sm">2. Seguridad</span>
                <span className="block text-xs text-on-surface-variant mt-0.5 opacity-80">JWT, Autenticación</span>
              </button>
              <button onClick={() => setActiveTab(3)} className={`p-4 text-left border-l-4 transition-colors ${activeTab === 3 ? 'border-primary bg-primary/10 text-primary' : 'border-transparent text-on-surface hover:bg-surface-container-high'}`}>
                <span className="block font-headline font-semibold text-sm">3. Base de Datos</span>
                <span className="block text-xs text-on-surface-variant mt-0.5 opacity-80">PostgreSQL, JPA, Audits</span>
              </button>
              <button onClick={() => setActiveTab(4)} className={`p-4 text-left border-l-4 transition-colors ${activeTab === 4 ? 'border-primary bg-primary/10 text-primary' : 'border-transparent text-on-surface hover:bg-surface-container-high'}`}>
                <span className="block font-headline font-semibold text-sm">4. Arquitectura</span>
                <span className="block text-xs text-on-surface-variant mt-0.5 opacity-80">DTOs, Swagger, CRUD</span>
              </button>
              <button onClick={() => setActiveTab(5)} className={`p-4 text-left border-l-4 transition-colors ${activeTab === 5 ? 'border-primary bg-primary/10 text-primary' : 'border-transparent text-on-surface hover:bg-surface-container-high'}`}>
                <span className="block font-headline font-semibold text-sm">5. App Móvil</span>
                <span className="block text-xs text-on-surface-variant mt-0.5 opacity-80">Flutter, Agentic AI, Offline</span>
              </button>
            </div>
          )}

          {/* Contenedor Principal de Pestaña */}
          <div className="flex-1 p-6 overflow-y-auto bg-surface">
            
            {/* ------------ SPRING BOOT: TAB 1 ------------ */}
            {mode === 'springboot' && activeTab === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-lg font-headline font-bold border-b border-surface-container-low pb-2">Configuración General</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-label font-bold text-on-surface-variant mb-1">Group ID</label>
                    <input type="text" value={groupId} onChange={e => setGroupId(e.target.value)} className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-label font-bold text-on-surface-variant mb-1">Artifact ID</label>
                    <input type="text" value={artifactId} onChange={e => setArtifactId(e.target.value)} className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-label font-bold text-on-surface-variant mb-1">Versión de Java</label>
                    <select value={javaVersion} onChange={e => setJavaVersion(e.target.value)} className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                      <option value="17">Java 17 (LTS)</option>
                      <option value="21">Java 21 (LTS)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-label font-bold text-on-surface-variant mb-1">Prefijo Rutas API REST</label>
                    <input type="text" value={apiPrefix} onChange={e => setApiPrefix(e.target.value)} className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                  </div>
                </div>
                {renderToggle('Habilitar Configuración CORS', 'Permite que aplicaciones Frontend externas (React, Angular) consulten los endpoints sin error de CORS.', enableCors, setEnableCors)}
              </div>
            )}

            {/* ------------ SPRING BOOT: TAB 2 ------------ */}
            {mode === 'springboot' && activeTab === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-lg font-headline font-bold border-b border-surface-container-low pb-2">Seguridad y Autenticación</h3>
                
                <div>
                  <label className="block text-xs font-label font-bold text-on-surface-variant mb-1">Estrategia de Seguridad</label>
                  <select value={securityType} onChange={e => setSecurityType(e.target.value)} className="w-full p-2.5 rounded-xl bg-surface-container-low border border-primary text-sm focus:border-primary outline-none text-primary font-semibold">
                    <option value="none">Ninguna (API Pública y Abierta)</option>
                    <option value="jwt">Sistema Multiusuario con JWT Token (Recomendado)</option>
                  </select>
                </div>

                {securityType === 'jwt' && (
                  <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-highest space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-secondary mt-1">shield_person</span>
                      <div>
                        <h4 className="text-sm font-headline font-bold text-on-surface">Configuración JWT</h4>
                        <p className="text-xs text-on-surface-variant mt-1">El generador creará automáticamente un <code className="bg-surface px-1 py-0.5 rounded">AuthController</code>, filtros HTTP y encriptación Bcrypt.</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-label font-bold text-on-surface-variant mb-1">Entidad de Usuario</label>
                      <p className="text-[11px] text-on-surface-variant mb-2">Ingresa el nombre de la clase de tu diagrama que representa al usuario (Ej: Usuario, Empleado). Se le inyectará la interfaz UserDetails.</p>
                      <input type="text" value={userEntityName} onChange={e => setUserEntityName(e.target.value)} className="w-full p-2.5 rounded-xl bg-surface border border-surface-container-highest text-sm focus:border-primary outline-none" placeholder="Usuario" />
                    </div>

                    {renderToggle('Generar script de Roles Básicos', 'Inserta en base de datos los roles genéricos ADMIN y USER al iniciar la app.', generateRoles, setGenerateRoles)}
                  </div>
                )}
              </div>
            )}

            {/* ------------ SPRING BOOT: TAB 3 ------------ */}
            {mode === 'springboot' && activeTab === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-lg font-headline font-bold border-b border-surface-container-low pb-2">Base de Datos (PostgreSQL)</h3>
                
                <div>
                  <label className="block text-xs font-label font-bold text-on-surface-variant mb-1">Estrategia DDL de Hibernate (spring.jpa.hibernate.ddl-auto)</label>
                  <select value={ddlAuto} onChange={e => setDdlAuto(e.target.value)} className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest text-sm outline-none">
                    <option value="update">update (Actualiza tablas sin borrar datos existentes - Seguro)</option>
                    <option value="create-drop">create-drop (Borra y crea las tablas al reiniciar - Ideal desarrollo)</option>
                    <option value="none">none (No modifica la base de datos - Usar si exportas SQL manual)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-label font-bold text-on-surface-variant mb-1">URL de Conexión (Local)</label>
                    <input type="text" value={dbUrl} onChange={e => setDbUrl(e.target.value)} className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest text-sm outline-none font-mono text-[13px]" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-label font-bold text-on-surface-variant mb-1">Puerto (Host Docker)</label>
                    <input type="text" value={dbPort} onChange={e => setDbPort(e.target.value)} className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest text-sm outline-none font-mono text-[13px]" placeholder="Ej. 5432 o 5433" />
                  </div>
                  <div>
                    <label className="block text-xs font-label font-bold text-on-surface-variant mb-1">Usuario DB</label>
                    <input type="text" value={dbUser} onChange={e => setDbUser(e.target.value)} className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-label font-bold text-on-surface-variant mb-1">Contraseña DB</label>
                    <input type="password" value={dbPass} onChange={e => setDbPass(e.target.value)} className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest text-sm outline-none" placeholder="Dejar vacío si no aplica" />
                  </div>
                </div>

                {renderToggle('Auditoría JPA Automática', 'Agrega columnas de fecha de creación y actualización (@CreatedDate, @LastModifiedDate) a las entidades.', enableAuditing, setEnableAuditing)}
              </div>
            )}

            {/* ------------ SPRING BOOT: TAB 4 ------------ */}
            {mode === 'springboot' && activeTab === 4 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-lg font-headline font-bold border-b border-surface-container-low pb-2 mb-4">Arquitectura de Código</h3>
                
                {renderToggle('Generar CRUD Automático', 'Sintetiza automáticamente Controladores REST, Servicios y Repositorios con métodos GET, POST, PUT, DELETE para todas las entidades.', enableCrud, setEnableCrud)}
                {renderToggle('Usar Patrón DTO (Data Transfer Object)', 'Crea clases DTO separadas y utiliza Mappers para evitar exponer las entidades de base de datos directamente a los clientes de la API.', enableDto, setEnableDto)}
                {renderToggle('Incluir Documentación Swagger (OpenAPI 3)', 'Agrega la dependencia springdoc-openapi-starter-webmvc-ui y configura la ruta /swagger-ui.html para probar los endpoints.', enableSwagger, setEnableSwagger)}
                {renderToggle('Usar Lombok', 'Genera un código mucho más limpio utilizando anotaciones @Data, @Builder y constructores automáticos en lugar de getters y setters explícitos.', enableLombok, setEnableLombok)}
              </div>
            )}

            {/* ------------ SPRING BOOT: TAB 5 (FLUTTER) ------------ */}
            {mode === 'springboot' && activeTab === 5 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-lg font-headline font-bold border-b border-surface-container-low pb-2 mb-4">Frontend Móvil (Agentic AI)</h3>
                
                <div className="bg-primary-container text-on-primary-container p-4 rounded-xl flex items-start gap-3 mb-4">
                  <span className="material-symbols-outlined mt-0.5">smart_toy</span>
                  <div>
                    <h4 className="font-headline font-bold text-sm">Arquitectura Offline-First generada</h4>
                    <p className="text-xs mt-1">Se construirá un proyecto Flutter básico con SQLite local, un archivo JSON de Tool Calling para la IA, y plantillas UI dinámicas que responden a comandos de voz, sincronizándose automáticamente al backend cuando hay red.</p>
                  </div>
                </div>

                {renderToggle('Generar App Móvil (Flutter)', 'Crea la carpeta flutter_client con los modelos Dart, servicios API y la base de datos local preconfigurada para este backend.', enableFlutter, setEnableFlutter)}
              </div>
            )}

            {/* ------------ MODO SQL ------------ */}
            {mode === 'sql' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-primary-container text-on-primary-container p-4 rounded-xl flex items-start gap-3">
                  <span className="material-symbols-outlined mt-0.5">info</span>
                  <div>
                    <h4 className="font-headline font-bold text-sm">Generador Independiente</h4>
                    <p className="text-xs mt-1">Este script DDL se utiliza para inicializar la base de datos de manera manual, ideal para bases de datos compartidas o fuera del ecosistema Spring Boot.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-label font-bold text-on-surface-variant mb-1">Convención de Nombres (Naming Strategy)</label>
                  <select value={namingConvention} onChange={e => setNamingConvention(e.target.value)} className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest text-sm outline-none">
                    <option value="snake_case">snake_case (Ej: detalle_venta, id_usuario) - Recomendado para Postgres</option>
                    <option value="camelCase">camelCase (Ej: detalleVenta, idUsuario) - Usado a veces en SQL Server</option>
                  </select>
                </div>

                {renderToggle('Añadir DROP TABLE IF EXISTS', 'Incluye sentencias de destrucción al inicio del archivo para poder ejecutar el script múltiples veces limpiamente.', dropTables, setDropTables)}
                {renderToggle('Añadir columnas de Auditoría', 'Inserta columnas "created_at" (TIMESTAMP) y "updated_at" en todas las tablas generadas.', auditColumns, setAuditColumns)}
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-surface-container-low bg-surface-container-lowest flex items-center justify-between shrink-0">
          <div>
            {mode === 'springboot' && (
              <span className="text-xs text-secondary font-label bg-secondary/10 px-3 py-1.5 rounded-lg flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">psychology</span> AI Smart Mapping Activo
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-label font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors">
              Cancelar
            </button>
            <button 
              onClick={handleGenerateClick}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-label font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                {mode === 'sql' ? 'code_blocks' : 'package'}
              </span>
              Previsualizar y Construir
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
