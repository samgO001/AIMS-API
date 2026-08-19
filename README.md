# AIMS API — Academic Intelligent Management System API

Backend RESTful API para la plataforma **AIMS (Academic Intelligent Management System)**, desarrollada con **Node.js**, **Express v5**, **Prisma 7** y **PostgreSQL**. Ofrece un sistema integral de autenticación con rotación de tokens (JWT), verificación de correo, recuperación de contraseña, asignación automática de roles por dominio de correo, control de acceso basado en roles (RBAC) y gestión completa de usuarios.

---

## Repositorio Frontend Relacionado

El repositorio con el código fuente del cliente de interfaz de usuario (**Frontend**) de AIMS se encuentra disponible en:
* **AIMS Frontend Repository:** [https://github.com/wsderfghbgv/AIMS](https://github.com/wsderfghbgv/AIMS)

---

## Tecnologías Utilizadas

* **Entorno de ejecución:** Node.js (CommonJS)
* **Framework Web:** Express v5 (`express`)
* **Base de Datos & ORM:** PostgreSQL con Prisma 7 (`@prisma/client`, `@prisma/adapter-pg`, `pg`)
* **Autenticación & Seguridad:** 
  * JSON Web Tokens (`jsonwebtoken`)
  * Hashing de contraseñas con Bcrypt (`bcryptjs`)
  * Protecciones HTTP con Helmet (`helmet`)
  * Control de CORS (`cors`)
  * Limitación de tasa de peticiones (`express-rate-limit`)
* **Validación de Datos:** Joi (`joi`)
* **Documentación API:** Swagger UI & OpenAPI (`swagger-ui-express`, `swagger-jsdoc`)
* **Servicio de Correo:** Nodemailer (`nodemailer`)
* **Testing:** Jest & Supertest (`jest`, `supertest`)
* **Herramientas de Desarrollo:** Nodemon (`nodemon`), TSX (`tsx`)

---

## Requisitos Previos

Antes de comenzar, asegúrate de contar con lo siguiente instalado en tu equipo:

* **Node.js** (v18.x o superior recomendado)
* **npm** (incluido con Node.js)
* **PostgreSQL** (instancia local o remota en ejecución)

---

## Guía de Instalación y Configuración Paso a Paso

### 1. Clonar el Repositorio

```bash
git clone https://github.com/samgO001/AIMS-API.git
cd AIMS-API
```

### 2. Instalar Dependencias

Ejecuta el siguiente comando para instalar las dependencias de producción y desarrollo:

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto tomando como plantilla el archivo `.env.example`:

```bash
cp .env.example .env
```

Edita el archivo `.env` configurando las variables correspondientes a tu entorno local.

#### Variables de Entorno Requeridas y Opcionales

| Variable | Requerida | Valor por Defecto / Descripción |
| :--- | :--- | :--- |
| `DATABASE_URL` | **Sí** | Cadena de conexión PostgreSQL (ej. `postgresql://usuario:password@localhost:5432/aims_db?schema=public`) |
| `JWT_SECRET` | **Sí** | Clave secreta segura para firmar los Access Tokens JWT |
| `PORT` | No | Puerto en el que correrá el servidor (por defecto `3000`) |
| `NODE_ENV` | No | Entorno de ejecución (`development` / `production` / `test`) |
| `JWT_EXPIRES_IN` | No | Tiempo de expiración del Access Token (por defecto `15m`) |
| `JWT_REFRESH_SECRET` | No | Clave secreta para Refresh Tokens (por defecto `<JWT_SECRET>_refresh`) |
| `JWT_REFRESH_EXPIRES_IN` | No | Tiempo de expiración del Refresh Token (por defecto `7d`) |
| `FRONTEND_URL` | No | URL del cliente frontend para enlaces de correo (por defecto `http://localhost:3000`) |
| `SMTP_HOST` | No | Servidor SMTP para envío de correos (por defecto `smtp.ethereal.email`) |
| `SMTP_PORT` | No | Puerto SMTP (por defecto `587`) |
| `SMTP_USER` | No | Usuario de autenticación SMTP |
| `SMTP_PASS` | No | Contraseña de autenticación SMTP |
| `EMAIL_FROM` | No | Remitente de los correos enviados (por defecto `AIMS API <noreply@aims-api.com>`) |

> **Nota de Seguridad:** NUNCA subas el archivo `.env` al repositorio ni expongas credenciales o secretos reales en control de versiones.

---

### 4. Configurar la Base de Datos con Prisma 7

#### Generar el Cliente de Prisma
```bash
npm run prisma:generate
```

#### Ejecutar las Migraciones en Desarrollo
Crea las tablas e índices necesarios en la base de datos PostgreSQL:
```bash
npm run prisma:migrate
```

#### Poblar la Base de Datos (Opcional - Seed)
Inserta datos iniciales de prueba (como un usuario administrador predeterminado):
```bash
npm run prisma:seed
```

#### Explorar la Base de Datos con Prisma Studio (Opcional)
Abre la interfaz gráfica de administración de datos de Prisma:
```bash
npm run prisma:studio
```

---

## Ejecución de la Aplicación

### Modo Desarrollo (con recarga automática)
```bash
npm run dev
```

### Modo Producción
```bash
npm start
```

---

## Documentación de la API y Health Check

Una vez que el servidor esté en ejecución en `http://localhost:3000`:

* **Documentación Interactiva Swagger UI:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
* **Verificación de Estado (Health Check):** [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## Reglas de Asignación Automática de Roles

El sistema implementa una **política estricta de asignación automática de roles por dominio de correo** en el registro público (`POST /api/v1/auth/register`):

1. **El cliente NO puede elegir el rol durante el registro público:** Cualquier campo `role` enviado en el cuerpo de la petición de registro público es ignorado por seguridad.
2. **Resolución automática de roles por dominio (`roleResolver`):**
   * Correo finalizado en `@gmail.com` $\rightarrow$ Asigna rol **`APRENDIZ`**
   * Correo finalizado en `@soy.sena.edu.co` $\rightarrow$ Asigna rol **`APRENDIZ`**
   * Correo finalizado en `@sena.edu.co` $\rightarrow$ Asigna rol **`INSTRUCTOR`**
   * Cualquier otro dominio de correo $\rightarrow$ El registro es **rechazado** con código HTTP `400 Bad Request` (*"El dominio del correo no está permitido para registro"*).
3. **Rol `ADMIN`:** El rol de Administrador **NO** se puede obtener mediante el registro público. Únicamente puede ser asignado por un usuario `ADMIN` existente desde el panel de administración (`PUT /api/v1/users/:id`) o cargado en la base de datos mediante el script de *seed*.

---

## Mecanismos de Seguridad e Infraestructura

* **Autenticación JWT Dual (Access & Refresh Tokens):**
  * **Access Token:** Firma de corta duración (15 minutos) enviada en la cabecera `Authorization: Bearer <token>`.
  * **Refresh Token Rotation:** Tokens de larga duración (7 días) almacenados de forma segura en la base de datos. Al solicitar un nuevo token de acceso (`POST /api/v1/auth/refresh-token`), el Refresh Token anterior se revoca y se expide uno nuevo para prevenir la reutilización no autorizada.
* **Cierre de Sesión Seguro (Logout):** Al cerrar sesión (`POST /api/v1/auth/logout`), se revoca el Refresh Token en la base de datos.
* **Cambio de Contraseña Seguro:** La ruta oficial `POST /api/v1/auth/change-password` invalida automáticamente todas las sesiones activas del usuario al actualizar la clave.
* **Protección Hashing:** Las contraseñas se encriptan con Bcrypt utilizando un factor de costo seguro.
* **Validación de Esquemas:** Todas las peticiones HTTP entrantes son validadas estrictamente con esquemas de Joi antes de ser procesadas por los controladores.
* **Rate Limiting:** Protección contra ataques de fuerza bruta en endpoints sensibles de autenticación (`login`, `forgot-password`, `verify-email`).
* **Control de Acceso basado en Roles (RBAC):** Middleware `authorize('ADMIN')` para proteger endpoints restringidos.

---

## Endpoints de la API

El prefijo base de la API es `/api/v1`.

### Módulo Auth (`/api/v1/auth`)

| Método | Ruta | Autenticación | Rol | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Pública | Ninguno | Registro de usuario (Rol resuelto automáticamente según dominio). |
| `POST` | `/api/v1/auth/login` | Pública | Ninguno | Inicio de sesión. Devuelve `accessToken` y `refreshToken`. |
| `POST` | `/api/v1/auth/verify-email` | Pública | Ninguno | Confirmar correo electrónico mediante token (Body). |
| `GET` | `/api/v1/auth/verify-email` | Pública | Ninguno | Confirmar correo electrónico mediante token (Query). |
| `POST` | `/api/v1/auth/resend-verification` | Pública | Ninguno | Reenviar correo de verificación de cuenta. |
| `POST` | `/api/v1/auth/forgot-password` | Pública | Ninguno | Solicitar recuperación de contraseña (envía correo). |
| `POST` | `/api/v1/auth/validate-reset-token` | Pública | Ninguno | Validar token de recuperación (Body). |
| `GET` | `/api/v1/auth/validate-reset-token` | Pública | Ninguno | Validar token de recuperación (Query). |
| `POST` | `/api/v1/auth/reset-password` | Pública | Ninguno | Restablecer contraseña utilizando token seguro. |
| `POST` | `/api/v1/auth/refresh-token` | Pública | Ninguno | Renovar Access Token usando Refresh Token Rotation. |
| `POST` | `/api/v1/auth/logout` | Pública / Token | Ninguno | Cierre de sesión y revocación de Refresh Token. |
| `POST` | `/api/v1/auth/change-password` | **Bearer JWT** | Cualquiera | **Ruta Oficial:** Cambia contraseña del usuario e invalida sesiones activas. |
| `GET` | `/api/v1/auth/me` | **Bearer JWT** | Cualquiera | Obtener información del usuario autenticado en sesión. |

### Módulo Users (`/api/v1/users`)

| Método | Ruta | Autenticación | Rol | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/users/profile` | **Bearer JWT** | Cualquiera | Obtener datos del perfil del usuario autenticado. |
| `PUT` | `/api/v1/users/profile` | **Bearer JWT** | Cualquiera | Actualizar datos propios del perfil (`firstName`, `lastName`, `phone`). |
| `GET` | `/api/v1/users` | **Bearer JWT** | **ADMIN** | Listar usuarios con paginación, filtros (`role`, `isActive`), búsqueda y ordenamiento. |
| `GET` | `/api/v1/users/:id` | **Bearer JWT** | **ADMIN** | Obtener información detallada de un usuario por UUID. |
| `PUT` | `/api/v1/users/:id` | **Bearer JWT** | **ADMIN** | Actualizar cualquier usuario (permite cambiar rol y estado activo). |
| `DELETE` | `/api/v1/users/:id` | **Bearer JWT** | **ADMIN** | Eliminar un usuario de la base de datos por UUID. |
| `PATCH` | `/api/v1/users/:id/toggle-active` | **Bearer JWT** | **ADMIN** | Activar o desactivar el acceso de un usuario. |

---

## Pruebas y Testing

El proyecto cuenta con una suite completa de pruebas unitarias y de integración desarrolladas en **Jest** y **Supertest**.

Actualmente se encuentran implementadas y pasando al 100%:
* **3 Test Suites:** (`tests/integration/auth.register.test.js`, `tests/integration/auth.endpoints.test.js`, `tests/unit/roleResolver.test.js`).
* **26 Pruebas Totales (26/26 pasadas exitosamente).**

### Ejecutar la Suite de Pruebas

```bash
npm test
```

---

## Estructura del Proyecto

```text
AIMS-API/
├── .env.example                # Plantilla de variables de entorno
├── .gitignore                  # Exclusiones de Git
├── package.json                # Dependencias y scripts del proyecto
├── package-lock.json           # Árbol de dependencias bloqueado
├── prisma.config.ts            # Configuración de Prisma 7
├── requests.http               # Colección de peticiones de prueba HTTP
├── prisma/
│   ├── migrations/             # Historial de migraciones SQL de la BD
│   ├── schema.prisma           # Modelos y esquemas de Prisma ORM
│   └── seed.js                 # Script de sembrado de datos iniciales
├── src/
│   ├── app.js                  # Configuración de Express, middlewares y Swagger
│   ├── server.js               # Punto de entrada y arranque del servidor HTTP
│   ├── config/                 # Configuraciones de base de datos, entorno y Swagger
│   │   ├── database.js
│   │   ├── env.js
│   │   └── swagger.js
│   ├── controllers/            # Controladores de peticiones de Auth y Usuarios
│   │   ├── auth.controller.js
│   │   └── user.controller.js
│   ├── middlewares/            # Middlewares de Auth, Errores, Rate Limit y Validación
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validate.js
│   ├── repositories/           # Capa de acceso a datos con Prisma Client
│   │   ├── auth.repository.js
│   │   └── user.repository.js
│   ├── routes/                 # Definición de rutas del sistema
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   └── user.routes.js
│   ├── services/               # Lógica de negocio y casos de uso
│   │   ├── auth.service.js
│   │   └── user.service.js
│   ├── utils/                  # Clases de error, mailer, JWT y roleResolver
│   │   ├── appError.js
│   │   ├── catchAsync.js
│   │   ├── mailer.js
│   │   ├── response.js
│   │   ├── roleResolver.js
│   │   └── token.js
│   └── validators/             # Esquemas de validación de Joi
│       ├── auth.validator.js
│       └── user.validator.js
└── tests/
    ├── integration/            # Pruebas de integración de endpoints de Auth
    │   ├── auth.endpoints.test.js
    │   └── auth.register.test.js
    └── unit/                   # Pruebas unitarias de roleResolver
        └── roleResolver.test.js
```

---

## Flujo de Trabajo Git y Convención de Commits

El equipo utiliza una estrategia basada en **Git Flow** y la convención de **Conventional Commits**:

### Estrategia de Ramas
* `main`: Rama de código estable en producción.
* `develop`: Rama principal de integración para desarrollo.
* `feature/<nombre-feature>`: Ramas para el desarrollo de nuevas características.
* `hotfix/<version>` / `release/<version>`: Ramas para corrección rápida de errores o preparación de lanzamientos.

### Formato de Commits
Formato estándar: `<tipo>(<alcance>): <descripción>`

* `feat(auth)`: Agregar nueva característica en autenticación.
* `fix(users)`: Corrección de error en módulo de usuarios.
* `test(auth)`: Agregar o actualizar pruebas.
* `docs(readme)`: Actualizaciones en documentación.
* `refactor(code)`: Mejoras de código sin cambiar comportamiento.
* `chore(deps)`: Tareas de mantenimiento o actualización de dependencias.
