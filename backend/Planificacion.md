Documentación del Proyecto: Plataforma DiagramConect
1. Visión General del Proyecto
DiagramConect es una plataforma de desarrollo de software colaborativo centrada en el modelado interactivo y asistido por Inteligencia Artificial. Diseñada para cubrir todo el ciclo de vida del desarrollo de software, permite que múltiples usuarios trabajen de forma concurrente en tiempo real sobre Diagramas de Clases y Modelos de Datos Relacionales.

La plataforma combina un lienzo interactivo multiusuario, entrada multimodal (voz, refactorización asistida por IA mediante texto/prompts, y reconocimiento de diagramas dibujados a mano o fotografías), capacidades móviles offline-first con modelos comprimidos locales e interoperabilidad con herramientas empresariales (como Enterprise Architect). Su característica principal es la generación automática de código, capaz de construir un backend completo, funcional y listo para producción en Spring Boot con persistencia en PostgreSQL a partir del modelo diseñado.

2. Stack Tecnológico
Backend Framework: Spring Boot 3 (Java 21)

Autenticación y Seguridad: Spring Security, BCrypt, JWT (JSON Web Tokens), Google OAuth2

Base de Datos y Persistencia: PostgreSQL, Spring Data JPA / Hibernate

Frontend Web: React (Vite / TypeScript), Canvas Engine / WebSockets (STOMP/SockJS para colaboración en tiempo real)

Aplicación Móvil: Flutter (Soporte Offline-First, ejecución de modelos de IA locales)

Servicios de IA y Multimodal: Cloud LLM APIs (refactorización por comandos de voz/texto, reconocimiento de imágenes/bocetos) + Modelo SLM Local Comprimido (para ejecución sin internet en el móvil)

DevOps e Infraestructura: Docker & Docker Compose, Variables de Entorno (.env), Despliegue en la Nube (AWS)

3. Plan Arquitectónico y Hoja de Ruta por Módulos
Plaintext
Fase 1: Infraestructura y Auth  ---> Fase 2: Lienzo Colaborativo
                                            │
Fase 4: Motor de IA Multimodal  <--- Fase 3: Integración Import / Export
        │
        ▼
Fase 5: Generación de Código    ---> Fase 6: App Móvil Offline y Nube
Módulo 1: Infraestructura Base y Autenticación Multitenant
Estructura Spring Boot: Arquitectura en capas limpia (Model, Repository, Service, Controller, DTO, Config).

Configuración de Entorno: Integración con .env para desarrollo local y mapeo dinámico para Docker/AWS.

Motor de Seguridad: Sistema de autenticación dual mediante credenciales locales (contraseñas cifradas con BCrypt) y Google OAuth2, generando sesiones Stateless con JWT.

Persistencia de Datos: Creación automática de esquemas en PostgreSQL y gestión de pool de conexiones.

Módulo 2: Lienzo Colaborativo en Tiempo Real (Modelado de Datos y Clases)
Lienzo Interactivo: Herramienta exclusiva para el diseño de diagramas de clases y modelos de datos relacionales (creación manual, arrastrar objetos, edición de atributos/relaciones).

Sincronización Multiusuario: Integración de WebSockets para permitir que varios usuarios editen de forma concurrente el mismo diagrama.

Módulo 3: Interoperabilidad e Integración (Import / Export)
Compatibilidad con Enterprise Architect (EA): Modulo de importación/exportación de archivos (XMI/XML) entre DiagramConect y EA.

Generación Cruzada de Diagramas: Capacidad de exportar el modelo de clases propio para construir diagramas de secuencia en herramientas externas y viceversa.

Módulo 4: Asistente de IA Multimodal (Voz, Texto y Visión)
Edición y Refactorización Autónoma: Motor de IA que obedece órdenes de voz o texto para modificar, editar y construir el diagrama en el lienzo sin necesidad de manipular objetos manualmente.

Reconocimiento de Imagen (Vision-to-Diagram): Procesamiento de fotografías o bocetos dibujados a mano para transformarlos automáticamente en objetos editables del diagrama.

Módulo 5: Motor de Generación Automática de Backend
Scaffolding de Proyecto Spring Boot: Generador que convierte el diagrama de clases en un proyecto Spring Boot completo con arquitectura en capas (@Entity, JpaRepository, Service, @RestController).

Generación de DTOs: Creación automática de Data Transfer Objects mapeados a cada entidad.

Persistencia PostgreSQL: Generación automática de scripts DDL y archivos de propiedades para PostgreSQL.

Módulo 6: Cliente Móvil (Flutter) e IA Offline
Sincronización Offline-First: App móvil en Flutter que permite trabajar sin conexión a internet y sincronizar cambios automáticamente al recuperar red.

IA Local Comprimida: Modelo de IA ejecutable de forma local en el dispositivo móvil para asistir en la captura y registro de datos sin internet.

Módulo 7: DevOps, Contenedores y Despliegue en AWS
Contenedorización: Configuración de Dockerfile multi-stage y docker-compose.yml orchestrando PostgreSQL, Backend Spring Boot y Frontend React.

Despliegue en AWS: Aprovisionamiento en infraestructura cloud con inyección segura de credenciales mediante variables de entorno en producción.