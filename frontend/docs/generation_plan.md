# Plan de Generación de Código y Base de Datos (DiagramConect)

## Fase 1: Vistas de Listado (UI)
Tanto para **Entidad y Modelos (SQL)** como para **Generador SpringBoot**, construiremos una interfaz unificada:
1. **Barra de Búsqueda:** Búsqueda en tiempo real por nombre de proyecto.
2. **Vista de Lista (Cards/List):** Cada ítem mostrará:
   - Nombre del diagrama.
   - Leyendas (Metadatos): Número de Clases, Número de Interfaces, Fecha de última modificación.
   - Estado: "Listo para generar" o "Faltan datos".
3. **Botón de Acción:** "Configurar Generación".

---

## Fase 2: Modal de Configuración (Condiciones de Construcción)

Al seleccionar un diagrama, se abrirá un Modal tipo ventana flotante con pestañas o pasos.

### A. Condiciones para el Backend (Spring Boot)
Para que el backend sea un proyecto ejecutable (`mvn spring-boot:run`), el usuario configurará:
1. **Metadatos del Proyecto:** 
   - `Group ID` (ej. *com.empresa*).
   - `Artifact ID` (ej. *inventario*).
   - Versión de Java (17 o 21).
2. **Dependencias y Opciones:**
   - **Usar Lombok:** (Toggle) Para reducir código *boilerplate* (`@Data`, `@NoArgsConstructor`).
   - **Generar CRUD Automático:** Si está activo, por cada Clase UML se creará automáticamente su *Controller*, *Service* y *Repository* con operaciones básicas (GET, POST, PUT, DELETE).
   - **Documentación:** Incluir Swagger/OpenAPI3 automáticamente.
3. **Credenciales de Base de Datos:**
   - Configuración para el archivo `application.properties` (URL, Usuario, Contraseña). Si se deja en blanco, usará placeholders predeterminados (ej. `jdbc:postgresql://localhost:5432/mibd`).

### B. Condiciones para la Base de Datos (SQL Postgres)
1. **Convención de Nombres:** Convertir nombres UML (Ej: `DetalleVenta`) a formato DB (Ej: `detalle_venta` en *snake_case*).
2. **Auditoría Automática:** (Toggle) Añadir automáticamente columnas de `created_at` y `updated_at` a todas las tablas.
3. **Manejo de Destrucción:** (Toggle) Añadir `DROP TABLE IF EXISTS CASCADE;` al inicio del script.

---

## Fase 3: Reglas de Mapeo (UML -> Lógica de Código)

Para que el backend "tenga sentido", nuestro motor interpretará el diagrama bajo estas reglas:

| Elemento UML | Mapeo en Spring Boot (Java) | Mapeo en SQL (Postgres) |
| :--- | :--- | :--- |
| **Clase (`umlClass`)** | `@Entity` + `@Table`. | Sentencia `CREATE TABLE`. |
| **Atributo** | Propiedad Java + `@Column`. Si se llama `id`, se añade `@Id` y `@GeneratedValue`. | Columna tipada (`VARCHAR`, `INT`, `SERIAL`). |
| **Relación 1:N / N:1** | `@OneToMany` / `@ManyToOne`. | `FOREIGN KEY` en la tabla hija apuntando al padre. |
| **Composición** | `@OneToMany(cascade = CascadeType.ALL)`. | `FOREIGN KEY` con `ON DELETE CASCADE`. |
| **Clase Asociación** | Entidad intermedia con dos `@ManyToOne`. | Tabla intermedia con doble `FOREIGN KEY`. |
| **Herencia** | `@Inheritance(strategy = InheritanceType.JOINED)`. | Tablas separadas unidas por FK en el ID. |
| **Enum** | `public enum NombreEnum { ... }` | Tipo `ENUM` nativo de Postgres o `VARCHAR CHECK`. |

---

## Fase 4: Vista Preliminar y Exportación ZIP

1. **Vista Preliminar (Editor Code Mirror):** Antes de descargar, el modal mostrará un visor de código con pestañas a la izquierda (árbol de archivos simulado) para revisar rápidamente cómo quedará un `Controller`, un `Entity` o el archivo `.sql`.
2. **Empaquetado (`jszip`):** 
   - El frontend usará la librería `jszip` y `file-saver`.
   - Construirá la estructura de carpetas real de Maven (`src/main/java/com/...`).
   - Construirá el `pom.xml` con las dependencias.
   - Generará el archivo `.zip`.
   - **Resultado:** El usuario descarga un archivo listo para descomprimir, abrir en IntelliJ/VSCode, y darle a *Play*.
