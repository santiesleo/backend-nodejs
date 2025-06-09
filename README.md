# Documentación Completa - API GraphQL
## Sistema de Gestión de Usuarios, Categorías y Productos

---

## GUÍA DE EJECUCIÓN

### Prerrequisitos
- Node.js (v16 o superior)
- MySQL (v8.0 o superior)
- Postman (para pruebas GraphQL)

### Instalación y Configuración

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd backend-panaderia
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear archivo `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=panaderia_db
DB_PORT=3306
JWT_SECRET=tu_jwt_secret_super_seguro
PORT=4000
```

4. **Configurar base de datos**
```bash
# Crear la base de datos
mysql -u root -p
CREATE DATABASE panaderia_db;
```

5. **Ejecutar migraciones**
```bash
# Ejecutar el script SQL de creación de tablas
mysql -u root -p panaderia_db < database/schema.sql
```

6. **Iniciar el servidor**
```bash
npm start
# El servidor estará disponible en: http://localhost:4000/graphql
```

### Acceso a GraphQL Playground
- **URL:** `http://localhost:4000/graphql`
- **Interfaz:** GraphQL Playground integrada
- **Postman:** Configurar endpoint POST a `http://localhost:4000/graphql`

---

## ENDPOINTS Y OPERACIONES

### QUERIES (Consultas)

#### 1. Usuarios

**Obtener todos los usuarios**
```graphql
query {
  users {
    id
    name
    email
    roles {
      id
      name
    }
  }
}
```

**Obtener usuario por ID**
```graphql
query {
  user(id: "1") {
    id
    name
    email
    roles {
      id
      name
    }
  }
}
```

#### 2. Categorías

**Obtener todas las categorías**
```graphql
query {
  categories {
    id
    name
    description
    createdAt
  }
}
```

**Obtener categoría por ID**
```graphql
query {
  category(id: "1") {
    id
    name
    description
  }
}
```

#### 3. Productos

**Obtener todos los productos**
```graphql
query {
  products {
    id
    nombre
    description
    price
    stock
    category {
      id
      name
    }
  }
}
```

**Obtener producto por ID**
```graphql
query {
  product(id: "1") {
    id
    nombre
    description
    price
    image
    stock
    category {
      id
      name
      description
    }
  }
}
```

### MUTATIONS (Modificaciones)

#### 1. Autenticación

**Login**
```graphql
mutation {
  login(email: "nuevo@email.com", password: "admin123") {
    token
    user {
      id
      name
      email
      roles { id name }
    }
  }
}
```

**Registro**
```graphql
mutation {
  register(input: {
    name: "Prueba Usuario"
    email: "prueba@email.com"
    password: "prueba123"
    roleIds: [1]
  }) {
    token
    user {
      id
      name
      email
      roles { id name }
    }
  }
}
```

#### 2. Gestión de Usuarios

**Actualizar usuario**
```graphql
mutation {
  updateUser(id: "1", input: {
    name: "Usuario Actualizado"
    password: "nuevoPassword123"
    roleIds: [1,2]
  }) {
    id
    name
    email
    roles { id name }
  }
}
```

**Eliminar usuario**
```graphql
mutation {
  deleteUser(id: "1")
}
```

#### 3. Gestión de Categorías

**Crear categoría**
```graphql
mutation {
  createCategory(input: {
    name: "panes artesanales"
    description: "de los panes"
  }) {
    id
    name
    description
    createdAt
  }
}
```

**Actualizar categoría**
```graphql
mutation {
  updateCategory(id: "1", input: {
    name: "pan actualizado"
    description: "bodrio stars"
  }) {
    id
    name
    description
    updatedAt
  }
}
```

**Eliminar categoría**
```graphql
mutation {
  deleteCategory(id: "1")
}
```

#### 4. Gestión de Productos

**Crear producto**
```graphql
mutation {
  createProduct(input: {
    nombre: "ponquesito"
    description: "es un ponqué pero chikito"
    price: 999.99
    image: "ponquesito.jpg"
    stock: 50
    category_id: 1
  }) {
    id
    nombre
    description
    price
    image
    stock
    category_id
    createdAt
    category {
      id
      name
    }
  }
}
```

**Actualizar producto**
```graphql
mutation {
  updateProduct(id: "1", input: {
    nombre: "ponque grande"
    price: 1199.99
    stock: 25
  }) {
    id
    nombre
    price
    stock
    updatedAt
  }
}
```

**Eliminar producto**
```graphql
mutation {
  deleteProduct(id: "1")
}
```

---

## TIPOS DE DOCUMENTOS Y ESQUEMAS

### Input Types (Tipos de Entrada)

#### RegisterInput
```graphql
input RegisterInput {
  name: String!
  email: String!
  password: String!
  roleIds: [Int!]!
}
```

#### UpdateUserInput
```graphql
input UpdateUserInput {
  name: String
  password: String
  roleIds: [Int!]
}
```

#### CategoryInput
```graphql
input CategoryInput {
  name: String!
  description: String
}
```

#### ProductInput
```graphql
input ProductInput {
  nombre: String!
  description: String
  price: Float!
  image: String
  stock: Int!
  category_id: Int!
}
```

#### UpdateProductInput
```graphql
input UpdateProductInput {
  nombre: String
  description: String
  price: Float
  image: String
  stock: Int
  category_id: Int
}
```

### Output Types (Tipos de Salida)

#### User
```graphql
type User {
  id: ID!
  name: String!
  email: String!
  roles: [Role!]!
  createdAt: String
  updatedAt: String
}
```

#### Role
```graphql
type Role {
  id: ID!
  name: String!
  description: String
}
```

#### Category
```graphql
type Category {
  id: ID!
  name: String!
  description: String
  createdAt: String
  updatedAt: String
}
```

#### Product
```graphql
type Product {
  id: ID!
  nombre: String!
  description: String
  price: Float!
  image: String
  stock: Int!
  category_id: Int!
  category: Category
  createdAt: String
  updatedAt: String
}
```

#### AuthPayload
```graphql
type AuthPayload {
  token: String!
  user: User!
}
```

---

## AUTENTICACIÓN Y AUTORIZACIÓN

### Cómo usar el token JWT

1. **Obtener token mediante login**
2. **Incluir en headers** de las siguientes peticiones:
```json
{
  "Authorization": "Bearer tu_jwt_token_aqui"
}
```

### Roles del sistema
- **superadmin**: Acceso completo
- **admin**: Gestión de usuarios y contenido
- **user**: Acceso básico

---

## HERRAMIENTAS DE DESARROLLO

### Postman Configuration
```json
{
  "url": "http://localhost:4000/graphql",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer {{token}}"
  },
  "body": {
    "query": "tu consulta graphql aqui"
  }
}
```

### Variables de entorno para Postman
- `baseUrl`: `http://localhost:4000`
- `token`: `[token obtenido del login]`

---

## DEBUGGING Y TROUBLESHOOTING

### Errores comunes

1. **"Could not load GraphQL schema"**
   - Verificar que el servidor esté ejecutándose
   - Comprobar conexión a base de datos

2. **"Authentication required"**
   - Incluir token JWT en headers
   - Verificar que el token no haya expirado

3. **"Database connection failed"**
   - Verificar credenciales en `.env`
   - Asegurar que MySQL esté ejecutándose

### Logs del servidor
```bash
npm start
# Ver logs en tiempo real para debugging
```

---

## EJEMPLOS DE USO COMPLETO

### Flujo típico de uso

1. **Registrar usuario**
2. **Hacer login**
3. **Crear categorías**
4. **Crear productos**
5. **Consultar datos**

### Ejemplo completo en Postman

```json
// 1. Login
{
  "query": "mutation { login(email: \"admin@example.com\", password: \"admin123\") { token user { id name } } }"
}

// 2. Crear categoría (con token)
{
  "query": "mutation { createCategory(input: { name: \"Panadería\", description: \"Productos de panadería\" }) { id name } }"
}

// 3. Crear producto (con token)
{
  "query": "mutation { createProduct(input: { nombre: \"Pan Francés\", description: \"Pan crujiente\", price: 2.50, stock: 100, category_id: 1 }) { id nombre price } }"
}
```

---

## ESTRUCTURA DEL PROYECTO

```
backend-panaderia/
├── src/
│   ├── resolvers/
│   ├── schema/
│   ├── models/
│   ├── middleware/
│   └── utils/
├── database/
│   ├── schema.sql
│   └── reset.sql
├── .env
├── package.json
└── README.md
```

