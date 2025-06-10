
# **Informe Completo de GraphQL**

---

## 1. ¿Qué es GraphQL?

- **GraphQL** es un lenguaje de consulta para APIs y un entorno de ejecución para satisfacer esas consultas con tus datos existentes.
- Fue desarrollado por Facebook en 2012 y liberado como open source en 2015.
- Permite a los clientes pedir exactamente los datos que necesitan, ni más ni menos.

---

## 2. Conceptos Básicos

### 2.1. **Schema (Esquema)**
- Es la definición de los tipos de datos, las relaciones y las operaciones disponibles en la API.
- Se define usando el **GraphQL Schema Definition Language (SDL)**.

### 2.2. **Types (Tipos)**
- **Scalar Types:** Tipos primitivos (`Int`, `Float`, `String`, `Boolean`, `ID`).
- **Object Types:** Definen un objeto con campos y sus tipos.
- **Enum Types:** Conjunto de valores posibles.
- **Input Types:** Usados para pasar objetos complejos como argumentos.
- **Interface Types:** Definen campos que deben implementar otros tipos.
- **Union Types:** Permiten que un campo retorne uno de varios tipos.

### 2.3. **Query**
- Operación para **leer** datos.
- Ejemplo:
  ```graphql
  query {
    user(id: "1") {
      name
      email
    }
  }
  ```

### 2.4. **Mutation**
- Operación para **modificar** datos (crear, actualizar, eliminar).
- Ejemplo:
  ```graphql
  mutation {
    createUser(input: {name: "Juan", email: "juan@mail.com"}) {
      id
      name
    }
  }
  ```

### 2.5. **Subscription**
- Permite recibir **actualizaciones en tiempo real** desde el servidor.
- Ejemplo:
  ```graphql
  subscription {
    userCreated {
      id
      name
    }
  }
  ```

---

## 3. Estructura de una API GraphQL

### 3.1. **Resolvers**
- Son funciones que resuelven el valor de un campo en el esquema.
- Cada campo en el esquema tiene un resolver asociado.

### 3.2. **Root Types**
- **Query:** Punto de entrada para lecturas.
- **Mutation:** Punto de entrada para escrituras.
- **Subscription:** Punto de entrada para eventos en tiempo real.

### 3.3. **Arguments**
- Los campos pueden aceptar argumentos para filtrar, paginar, etc.

### 3.4. **Variables**
- Permiten parametrizar consultas y mutaciones.
- Ejemplo:
  ```graphql
  query getUser($id: ID!) {
    user(id: $id) {
      name
    }
  }
  ```

---

## 4. Características Avanzadas

### 4.1. **Fragments**
- Permiten reutilizar partes de consultas.
- Ejemplo:
  ```graphql
  fragment userFields on User {
    id
    name
    email
  }
  query {
    user(id: "1") {
      ...userFields
    }
  }
  ```

### 4.2. **Directives**
- Modifican la ejecución de una consulta (`@include`, `@skip`, `@deprecated`).
- Ejemplo:
  ```graphql
  query getUser($withEmail: Boolean!) {
    user(id: "1") {
      name
      email @include(if: $withEmail)
    }
  }
  ```

### 4.3. **Aliasing**
- Permite cambiar el nombre de los campos en la respuesta.
- Ejemplo:
  ```graphql
  {
    firstUser: user(id: "1") { name }
    secondUser: user(id: "2") { name }
  }
  ```

### 4.4. **Introspection**
- Permite consultar el propio esquema de GraphQL.
- Ejemplo:
  ```graphql
  {
    __schema {
      types {
        name
      }
    }
  }
  ```

### 4.5. **Batching y Caching**
- Herramientas como DataLoader permiten optimizar consultas para evitar el problema N+1.
- Caching a nivel de cliente y servidor para mejorar el rendimiento.

---

## 5. Seguridad en GraphQL

- **Autenticación:** Usualmente con JWT o tokens en headers.
- **Autorización:** Validar permisos en los resolvers.
- **Rate Limiting:** Limitar la cantidad de consultas por usuario.
- **Depth Limiting:** Limitar la profundidad de las consultas para evitar abusos.
- **Query Complexity Analysis:** Limitar la complejidad de las consultas.

---

## 6. Buenas Prácticas

- **Documentar el esquema** usando descripciones en SDL.
- **Versionar el API** mediante deprecación de campos, no cambiando endpoints.
- **Validar entradas** en los resolvers.
- **Evitar exponer información sensible** en el esquema.
- **Usar paginación** en listas grandes.

---

## 7. Herramientas y Ecosistema

- **Apollo Server/Client:** Implementación popular para Node.js y frontend.
- **GraphQL Yoga:** Otro servidor GraphQL para Node.js.
- **Relay:** Cliente avanzado de Facebook.
- **GraphiQL / Playground:** IDEs para probar consultas.
- **Prisma:** ORM que se integra con GraphQL.
- **Hasura:** Motor GraphQL instantáneo sobre PostgreSQL.

---

## 8. Integración con otras tecnologías

- **REST to GraphQL:** Puedes envolver APIs REST con GraphQL.
- **Microservicios:** GraphQL puede actuar como gateway unificando varios servicios.
- **Federation:** Permite dividir el esquema en subesquemas manejados por distintos equipos.

---

## 9. Ejemplo de Esquema Completo

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
}

type Query {
  users: [User!]!
  user(id: ID!): User
  posts: [Post!]!
}

type Mutation {
  createUser(name: String!, email: String!): User!
  createPost(title: String!, content: String!, authorId: ID!): Post!
}

type Subscription {
  postCreated: Post!
}
```

---

## 10. Ejemplo de Resolver en Node.js (Apollo Server)

```js
const resolvers = {
  Query: {
    users: () => getUsers(),
    user: (_, { id }) => getUserById(id),
    posts: () => getPosts(),
  },
  Mutation: {
    createUser: (_, { name, email }) => createUser(name, email),
    createPost: (_, { title, content, authorId }) => createPost(title, content, authorId),
  },
  Subscription: {
    postCreated: {
      subscribe: () => pubsub.asyncIterator(['POST_CREATED']),
    },
  },
  User: {
    posts: (parent) => getPostsByUser(parent.id),
  },
  Post: {
    author: (parent) => getUserById(parent.authorId),
  },
};
```

---

## 11. Ventajas y Desventajas

### Ventajas
- Solo pides los datos que necesitas.
- Una sola petición para obtener datos relacionados.
- Tipado fuerte y autodescriptivo.
- Evolución del API sin romper clientes existentes.

### Desventajas
- Puede ser más complejo de implementar que REST.
- Problemas de N+1 si no se optimiza.
- Requiere herramientas adicionales para caché y seguridad.

---

## 12. Recursos para Aprender Más

- [Documentación oficial de GraphQL](https://graphql.org/learn/)
- [Apollo GraphQL Docs](https://www.apollographql.com/docs/)
- [How to GraphQL](https://www.howtographql.com/)
- [GraphQL Playground](https://www.graphqlbin.com/)

---