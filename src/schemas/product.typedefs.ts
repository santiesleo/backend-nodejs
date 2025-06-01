import { gql } from 'apollo-server-express';

export const productTypeDefs = gql`
  type Product {
    id: ID!
    nombre: String!
    description: String!
    price: Float!
    image: String
    stock: Int!
    category_id: Int!
    createdAt: String!
    updatedAt: String!
    category: Category
  }

  input ProductInput {
    nombre: String!
    description: String!
    price: Float!
    image: String
    stock: Int!
    category_id: Int!
  }

  input ProductUpdateInput {
    nombre: String
    description: String
    price: Float
    image: String
    stock: Int
    category_id: Int
  }

  extend type Query {
    products: [Product!]!
    product(id: ID!): Product
    productsByCategory(categoryId: ID!): [Product!]!
  }

  extend type Mutation {
    createProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: ProductUpdateInput!): Product!
    deleteProduct(id: ID!): Boolean!
  }

  # Agregar relación a Category
  extend type Category {
    products: [Product!]!
  }
`;