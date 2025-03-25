![ICESI University Logo](https://res.cloudinary.com/dxhi8xsyb/image/upload/v1731991202/ICESI_logo_prin_descriptor_RGB_POSITIVO_0924_bszq4w.png)

# Node.js PostgreSQL RESTful API

Esta API implementa un sistema de gestión de usuarios, productos y categorías con autenticación y autorización basado en JWT, construido con Node.js, TypeScript y PostgreSQL.

## Integrantes

- Juan David Calderón Salamanca 
- Santiago Escobar León

## Características

- Sistema de autenticación y autorización con JWT
- Gestión de usuarios con roles (admin y usuario regular)
- Gestión de productos y categorías
- Operaciones CRUD completas para todas las entidades
- Validación de datos con Zod
- Manejo de errores global
- Pruebas unitarias con Jest
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
- Jest (pruebas unitarias)
- Zod (validación de esquemas)

## Estructura del proyecto

```
├── src/
│   ├── config/            # Configuración (base de datos, etc.)
│   ├── controllers/       # Controladores de la API
│   ├── exceptions/        # Definiciones de errores personalizados
│   ├── interfaces/        # Interfaces y tipos
│   ├── middlewares/       # Middleware (auth, validación, roles)
│   ├── models/            # Modelos de datos
│   ├── routes/            # Definición de rutas
│   ├── schemas/           # Esquemas de validación (Zod)
│   ├── services/          # Lógica de negocio
│   ├── test/              # Pruebas unitarias
│   ├── utils/             # Utilidades
│   └── index.ts           # Punto de entrada de la aplicación
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
├── README.md
└── tsconfig.json
```

## Requisitos previos

- Node.js (v18 o superior)
- npm o yarn
- PostgreSQL (local o Docker)
- Docker y Docker Compose (para ejecución en contenedores)

## Instalación y configuración

### Opción 1: Instalación local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/santiesleo/backend-nodejs.git
   cd backend-nodejs
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   Crear un archivo `.env` con las siguientes variables:
   ```
   NODE_ENV=development
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=api_db
   DB_USER=postgres
   DB_PASSWORD=postgres
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=24h
   ```

4. Compilar el código TypeScript:
   ```bash
   npm run build
   ```

5. Inicializar la base de datos:
   ```bash
   npm run db:init
   ```

6. Iniciar la aplicación:
   ```bash
   npm start
   ```

7. Para desarrollo:
   ```bash
   npm run dev
   ```

### Opción 2: Usando Docker

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/santiesleo/backend-nodejs.git
   cd backend-nodejs
   ```

2. Iniciar los contenedores:
   ```bash
   docker-compose up -d
   ```

3. Ejecutar el script de inicialización:
   ```bash
   docker-compose exec app npm run db:init
   ```

## Endpoints de la API

La API implementa los siguientes endpoints:

### Usuarios

- `GET /user` - Obtener todos los usuarios
- `GET /user/:id` - Obtener usuario por ID
- `GET /user/profile` - Obtener perfil del usuario autenticado
- `POST /user` - Crear nuevo usuario
- `PUT /user/:id` - Actualizar usuario
- `DELETE /user/:id` - Eliminar usuario
- `POST /user/login` - Iniciar sesión y obtener token JWT

### Categorías

- `GET /category` - Obtener todas las categorías
- `GET /category/:id` - Obtener categoría por ID
- `POST /category` - Crear nueva categoría (solo admin)
- `PUT /category/:id` - Actualizar categoría (solo admin)
- `DELETE /category/:id` - Eliminar categoría (solo admin)

### Productos

- `GET /product` - Obtener todos los productos
- `GET /product/:id` - Obtener producto por ID
- `GET /product/category/:categoryId` - Obtener productos por categoría
- `POST /product` - Crear nuevo producto (solo admin)
- `PUT /product/:id` - Actualizar producto (solo admin)
- `DELETE /product/:id` - Eliminar producto (solo admin)

## Autenticación

La API utiliza autenticación basada en tokens JWT. Para acceder a las rutas protegidas, se debe incluir el token JWT en el encabezado de la solicitud:

```
Authorization: Bearer <token>
```

## Roles y Permisos

El sistema implementa dos tipos de roles:
- **Usuario regular**: Acceso limitado a operaciones de lectura y gestión de su propio perfil
- **Admin**: Acceso completo a todas las operaciones, incluida la gestión de productos y categorías

## Pruebas

### Ejecutar pruebas unitarias

```bash
npm test
```

### Ejecutar pruebas con cobertura

```bash
npm test -- --coverage
```

### Ejecutar pruebas en modo watch

```bash
npm run test:watch
```

## Consideraciones de seguridad

- Todas las contraseñas se almacenan encriptadas usando bcrypt
- Los tokens JWT tienen un tiempo de expiración configurable
- Las rutas sensibles están protegidas por middleware de autenticación y autorización
- Se implementa validación de datos con Zod en todas las entradas
- Middleware de roles para controlar el acceso a funcionalidades específicas
