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






> /plan Este en un software plataforma donde un usuario crea proyecto para diseñar uml diagramas de clases ,este diagrama podra ser colaborativo entre
  varios usuarios con permiso del owner esa seria la idea basica
  
  Funcionalidades
  
  (Modulo basico )
  
  *Poder iniciar sesion ,registrarse con google o gitgub
  *Poder crear(react flow),administrar,y ver historial de cambios
  *Poder compartir en tiempo real la creacion de los diagramas de forma interactiva
  *Comprobar y asignar o quitar permisos por parte del owner
  
  (Modulo IA ASISTANT)
    -(IA GENERAL para los diagrams)
  
       [ESTA IA DEPENDIENDO DE CUAL SEA MAS FACIL SERA LOCAL O USANDO UNA LLAVE DE API KEY DEPENDIENDO DE QUE TAN DIFICIL SEA LIDIAR CON ESO AL DESPLEGAR]
      *IA que ayudara como un asistente para ayudar a construir los diagramas por voz o texto
      *La IA podra sugerir cambios o sugerir estructuras mas convenientes
      *La IA no debe generar el diagrama solo nunca a partir de un enunciado tiene que guiar pero no hacer todo el trabajo
      *La IA debe poder tomar una foto o subirla de un diagra de clases y poder contruirlo
    -(IA Asistente )
      *Esta IA sera un asistente de como usar el software
      *La IA tambien ayudara con las especificaciones de como exportar crear,etc
      *Esta podra ser iniciada para voz o con comentarios
  (MOdulo de Exportacion)
  
       [ESTE MODULO ES MUY IMPORTANTE SE DIVIDE EN 2 ]
  
      -(EXPORTACION CON BACKEND)
         *El software podra generar/exportar la base de datos en postgres (sql)
         *El software podra generar/exportar un backend(SpringBoot) con todo lo necesario para que el backend este funcional
         *El software par ael Backend tendra que tener una configuracion por defecto para las sesiones
         *El software presentara un diseño preliminar del Backend explicando la arquitectura del Backend
         *Los Backends generados deberan ser sencillos mas que todo para inventarrios,etc en si sistemas de informacion
         *En este Backend generado se tendra que implementar una IA local
  
            (submodulo de EXPORTACION CON BACKEND IA LOCAL )
              *ESTA IA LOCAL correra para el backend o para el frontend(que sera movil Flutter)
              *ESTA IA LOCAL sera el orquestador para no tenener que hacer un frontend muy cargado de formularios para guardar la informacion
              *LA Persona para que generamos el Backeend y nosotros haremos el front(flutter) debera poder ingresar y guardar los datos con voz o
  registrar los datos en las tablas con voz obiviamente el no sabe de bases de datos el solo quiere guardar su informacion la IA se encarga
  del proceso
  
     -(EXPORTACION EA )
          *Este metodo permite al software exportar diagramas de ENTERPRISE ARCHITEC especificamente o viceversa
  
  
  
  ESO SERIA LAS FUNCIONES BASICAS QUE DEBEMOS IMPLEMENTAR AHORA EL STACK Y REFERENCIA
  
    BASE DE DATOS:POSTGRES GENERADO POR EL ORM DE SPRING-BOOT
    BACKEND:USAREMOS SPRING BOOT PARA EL BACKEND (YA EN USO) ASI PARA PODER GENERAR EL BACKEND DE LOS DAGRAMS FACIL IGUALMENTE
    FRONTEND:USANDO REACT CON TS USAMO REACT FLOW PARA GENERAR LOS DIAGRAMS
  
   CONTENCION:ESTOY USANDO DOCKER EN EL BACKEND Y BASE DE DATOS EN CONTENEDORES PARA SU DESPLIEGUE MAS FACIL ,APARTE USO .ENV EN CADA UNO Y .GITIGNORE
  PARA CUALQUIER ARCHIVO QUE NO DEBA SUBIRSE AL GIT
    EL .ENV: IMPORTANTE USARLO PARA NO HARDCODEAR CODIGO
  
    LA IA DEL PROYECTO: ESTA PUEDE SER NORMAL USANDO UNA APY KEY DE GOOGLE O ENTRANAR UN MODELO(LIGERO ) PARA ESTO AUN NO SE CUAL ES MEJOR PARA EL
  DESPLIEGUE Y USO DEL OSFTWARE
    LA IA QUE DEBE IR CON LA APP MOVIL: ESTA DEBE SER SI O SI LOCAL POR QUE DEBE PODER GUARDARSE INFORMACION AUN SIN CONEXION Y CUNADO HAY SINCORNIZARLA
  
  
  EL DESPLIEGUE (MUY IMPORTANTE)
  
   AUNQUE AUN NO SE USAR NI COMO CONFIGURAR AWS(DEBE SER DESPLEGADO AHI) USAREMOS AWS PARA ESO NECESITARE MUCHO AYUDA TUYA
  
  
  UNA COSA MAS QUE RECALCAR LA APP MOVIL/BACKEND/BASE DE DATOS GENERADOS DEBEN SER DESPLEGADOS IGUALEMNTE
  
  
  MUY IMPORTANTE ESTE UN SOFTWARE PARA UN PROYECTO DE UNIVERSIDAD POR ESO LAS CARGAS DE DATOS SOLO SERAN PARA PRUEBAS MERAMENTE Y PARA PRESENTACION NO
  ENTRARAN 1000 USARIOS NI 20 USUARIO NI 10 USUARIOS AL MISMO TIEMPO
  
  
  
  UNA VEZ YA CONOCIDO ESTO EMPEZEMOS (PUEDE INSPECCION MIS CONFIGURACIONES INICIALES DONDE YA TENGO HECHO EL INICIO DE SESION TANTO EN FRONTEND COMO EN
  VBACKEND CON DETALLES POR PULIR )
  
  INICIEMOS CON LO QUE SIGUE SEGUN A LOS MODULOS(RECUERDA RESPETAR LAS ESTRUCTURA Y LA MODULARIDAD TOTAL PARA NO SOBREPONER O CARGAR TODO EN UN MODULO O
  DIRECTORIO IGUALMENTE)
