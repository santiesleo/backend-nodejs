
import { gql } from 'apollo-server-express';

export const categoryTypeDefs = gql`
  type Category {
    id: ID!
    name: String!
    description: String!
    createdAt: String!
    updatedAt: String!
  }

  input CategoryInput {
    name: String!
    description: String!
  }

  input CategoryUpdateInput {
    name: String
    description: String
  }

  extend type Query {
    categories: [Category!]!
    category(id: ID!): Category
  }

  extend type Mutation {
    createCategory(input: CategoryInput!): Category!
    updateCategory(id: ID!, input: CategoryUpdateInput!): Category!
    deleteCategory(id: ID!): Boolean!
  }
`;