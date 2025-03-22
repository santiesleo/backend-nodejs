# Node.js PostgreSQL RESTful API

Esta API implementa un sistema de gestión de usuarios con autenticación y autorización basado en JWT, construido con Node.js, TypeScript y PostgreSQL.

## Características

- Sistema de autenticación y autorización con JWT
- Gestión de usuarios con roles (superadmin y usuario regular)
- Gestión de roles y permisos
- Operaciones CRUD completas
- Validación de datos
- Manejo de errores global
- Pruebas unitarias y de integración
- Documentación de API
- Clean Architecture

## Tecnologías utilizadas

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Sequelize (ORM)
- JWT (jsonwebtoken)
- bcrypt (encriptación de contraseñas)
- Docker y Docker Compose

## Estructura del proyecto

```
├── src/
│   ├── config/            # Configuración (base de datos, etc.)
│   ├── controllers/       # Controladores de la API
│   ├── middleware/        # Middleware (auth, error handling)
│   ├── models/            # Modelos de datos
│   ├── routes/            # Definición de rutas
│   ├── services/          # Lógica de negocio
│   ├── tests/             # Pruebas unitarias y de integración
│   ├── utils/             # Utilidades
│   └── app.ts             # Punto de entrada de la aplicación
├── .env                   # Variables de entorno
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
├── README.md
└── tsconfig.json
```

## Requisitos previos

- Node.js (v14 o superior)
- npm o yarn
- PostgreSQL (local o Docker)
- Docker y Docker Compose (opcional, para ejecución en contenedores)

## Instalación y configuración

### Opción 1: Instalación local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio.git
   cd tu-repositorio
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   Crear un archivo `.env` basado en `.env.example` y configurar las variables necesarias.

4. Compilar el código TypeScript:
   ```bash
   npm run build
   ```

5. Inicializar la base de datos:
   ```bash
   npm run seed
   ```

6. Iniciar la aplicación:
   ```bash
   npm start
   ```

### Opción 2: Usando Docker

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio.git
   cd tu-repositorio
   ```

2. Configurar variables de entorno:
   Editar las variables en `docker-compose.yml` según sea necesario.

3. Iniciar los contenedores:
   ```bash
   docker-compose up -d
   ```

4. Ejecutar el script de inicialización:
   ```bash
   docker-compose exec app npm run seed
   ```

## Endpoints de la API

La API implementa los siguientes endpoints:

### Autenticación

- `POST /api/auth/register` - Registrar un nuevo usuario
- `POST /api/auth/login` - Iniciar sesión y obtener token JWT
- `GET /api/auth/profile` - Obtener perfil del usuario autenticado

### Usuarios

- `GET /api/users` - Obtener todos los usuarios (solo superadmin)
- `GET /api/users/:id` - Obtener usuario por ID (propio perfil o superadmin)
- `POST /api/users` - Crear nuevo usuario (solo superadmin)
- `PUT /api/users/:id` - Actualizar usuario (propio perfil o superadmin)
- `DELETE /api/users/:id` - Eliminar usuario (solo superadmin)

### Roles

- `GET /api/roles` - Obtener todos los roles (solo superadmin)
- `GET /api/roles/:id` - Obtener rol por ID (solo superadmin)
- `POST /api/roles` - Crear nuevo rol (solo superadmin)
- `PUT /api/roles/:id` - Actualizar rol (solo superadmin)
- `DELETE /api/roles/:id` - Eliminar rol (solo superadmin)

## Autenticación

La API utiliza autenticación basada en tokens JWT. Para acceder a las rutas protegidas, se debe incluir el token JWT en el encabezado de la solicitud:

```
Authorization: Bearer <token>
```

## Usuarios predeterminados

Al ejecutar el script de inicialización (`npm run seed`), se crean dos usuarios por defecto:

1. Superadmin:
   - Username: superadmin
   - Password: superadmin123

2. Usuario regular:
   - Username: user
   - Password: user123

## Pruebas

### Ejecutar pruebas unitarias

```bash
npm test
```

### Ejecutar pruebas en modo watch

```bash
npm run test:watch
```

## Documentación de Postman

Se incluye una colección de Postman (`postman_collection.json`) con ejemplos de todas las operaciones disponibles en la API. Para utilizarla:

1. Importar la colección en Postman
2. Crear un entorno con las siguientes variables:
   - `baseUrl`: URL base de la API (por defecto: http://localhost:3000/api)
   - `token`: Token JWT (se actualizará automáticamente al iniciar sesión)

## Despliegue en producción

Para desplegar en producción, asegúrate de:

1. Cambiar el valor de `NODE_ENV` a `production`
2. Establecer un `JWT_SECRET` seguro
3. Configurar credenciales seguras para la base de datos
4. Utilizar HTTPS para todas las comunicaciones

## Consideraciones de seguridad

- Todas las contraseñas se almacenan encriptadas usando bcrypt
- Los tokens JWT tienen un tiempo de expiración configurable
- Las rutas sensibles están protegidas por middleware de autenticación y autorización
- Se implementa validación de datos en todas las entradas

## Licencia

Este proyecto está licenciado bajo [MIT License](LICENSE).