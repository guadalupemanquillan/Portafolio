# Guadalupe Portfolio — API (Spring Boot)

Backend REST del portfolio personal: experiencia, formación, habilidades, contacto y métricas.

## Requisitos

- JDK 21  
- MongoDB accesible (local o Atlas)

## Configuración

Variables y propiedades principales (ver `src/main/resources/application.properties`):

| Clave / variable        | Descripción |
|-------------------------|-------------|
| `spring.data.mongodb.uri` | URI de MongoDB (incluye nombre de base al final). |
| `app.display-name` / `APP_DISPLAY_NAME` | Nombre del servicio (health check, correos). |
| `app.base-url` / `APP_BASE_URL` | URL pública de esta API. |
| `app.cors.allowed-origins` | Orígenes del front permitidos (lista separada por comas). |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL` | Envío de correo vía Resend. |

Perfil local opcional: `application-dev.properties` (`spring.profiles.active=dev`).

## Ejecutar

```bash
./mvnw spring-boot:run
```

API por defecto: `http://localhost:9090` (ajustable con `server.port` / `PORT`).

## Buenas prácticas aplicadas

- **CORS** centralizado en `GlobalCorsBeansConfig` + `app.cors.*` (sin repetir `@CrossOrigin` en cada controlador).
- **Metadatos de producto** (`app.display-name`) reutilizados en salud del servicio y plantillas de correo.
- **Sin secretos en el repositorio**: claves solo por entorno.

---

## Migrar datos de la base `portfolio` → `guadalupe_manquillan`

Si antes usabas la base **`portfolio`** y ahora la API apunta a **`guadalupe_manquillan`**, los iconos y el resto de documentos siguen en la base vieja hasta que copies las colecciones.

**Colecciones que usa esta API** (mismos nombres en ambas bases):  
`Habilidades`, `Experiencia`, `Formacion`, `Users`, `ContactaConmigo`, `VisitCounter`.

**Iconos / imágenes:** en MongoDB solo se guarda la **ruta** (campo `image` en `Habilidades`). Los archivos deben existir en el servidor, carpeta **`uploads/`** de este proyecto (o la ruta que indique cada documento). Si faltan archivos, copiá también esa carpeta desde tu backup o repo anterior.

### Opción 1 — La más rápida (sin copiar nada)

Volvé a usar la base antigua en `application.properties` y `application-dev.properties`:

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/portfolio
```

Reiniciá Spring. Verás de inmediato los mismos datos que en Compass bajo `portfolio`.

### Opción 2 — Copiar toda la base con herramientas de MongoDB (recomendada si querés el nombre `guadalupe_manquillan`)

1. Instalá **MongoDB Database Tools** (incluye `mongodump` y `mongorestore`) si no los tenés en el PATH.  
2. En una terminal (PowerShell o CMD):

```bash
mongodump --uri="mongodb://localhost:27017" --db=portfolio --out=%USERPROFILE%\mongo-backup-portfolio
mongorestore --uri="mongodb://localhost:27017" --db=guadalupe_manquillan %USERPROFILE%\mongo-backup-portfolio\portfolio
```

3. Dejá en propiedades la URI con **`guadalupe_manquillan`** (como ahora). Reiniciá Spring.

### Opción 3 — MongoDB Compass (sin consola)

1. Conectá a `localhost:27017`.  
2. Entrá a la base **`portfolio`**.  
3. Para cada colección de la lista de arriba: abrila → menú **Export collection** (JSON o CSV según versión) o usá **Clone / Duplicate** hacia la base **`guadalupe_manquillan`** si tu versión de Compass lo ofrece.  
4. Si exportás JSON: creá la base **`guadalupe_manquillan`**, colección con el **mismo nombre**, e **Import data**.

Después comprobá en Compass que en **`guadalupe_manquillan`** exista **`Habilidades`** con documentos y que el backend esté levantado con `VITE_API_BASE_URL` (o equivalente) apuntando a tu API para que el front cargue las rutas de imagen contra `http://localhost:9090/...`.
