// schemas/base.typedefs.ts
import { gql } from 'apollo-server-express';

export const baseTypeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;