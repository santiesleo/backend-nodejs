// index.ts - MIGRACIÓN A GRAPHQL
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
// NUEVO: Importar Apollo Server para GraphQL
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';


import sequelize from "./config/database";

// NUEVO: Imports de GraphQL para categorías, productos y usuarios
import { baseTypeDefs } from './schemas';
import { categoryTypeDefs } from './schemas';
import { categoryResolvers , productResolvers } from './resolvers';
import { productTypeDefs } from './schemas';
import { userTypeDefs } from './schemas/user.typedefs';
import { userResolvers } from './resolvers/user.resolver';
import { authMiddleware } from './middlewares/auth.middleware';
import { Context } from './interfaces/context.interface';

dotenv.config();

const app: Express = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));



app.get('/', (req: Request, res: Response): void => {
    res.send("Hello World - GraphQL Server with Categories, Products & Users");
});

app.get('/error', (req: Request, res: Response): void => {
    res.status(500).send("Hello World");
});

app.get('/notfound', (req: Request, res: Response): void => {
    res.status(404).send("Hello World");
});

// CORREGIDO: Merge TODOS los type definitions y resolvers
const typeDefs = mergeTypeDefs([
  baseTypeDefs,      // Queries y Mutations base
  categoryTypeDefs,  // Esquemas de categorías
  productTypeDefs,   // Esquemas de productos
  userTypeDefs       // Esquemas de usuarios
]);

const resolvers = mergeResolvers([
  categoryResolvers, // Resolvers de categorías
  productResolvers,  // Resolvers de productos
  userResolvers      // Resolvers de usuarios
]);

// Create executable schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create Apollo Server
const server = new ApolloServer({
  schema,
  context: async ({ req }): Promise<Context> => {
    // Tipo más específico para req
    const context: Context = { req: req as Request };
    return authMiddleware(context);
  },
  // Agregamos introspection y playground para desarrollo
  introspection: true,
});

async function startServer(): Promise<void> {
  try {
    // Sync database
    await sequelize.sync();
    // eslint-disable-next-line no-console
    console.log('Database synced successfully');

    // Start Apollo Server
    await server.start();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    server.applyMiddleware({ app: app as any });

    // Start Express server
    const PORT = parseInt(process.env.PORT || '4000', 10);
    app.listen(PORT, (): void => {
      // eslint-disable-next-line no-console
      console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
      // eslint-disable-next-line no-console
      console.log('Available GraphQL operations:');
      // eslint-disable-next-line no-console
      console.log('- Categories: queries and mutations');
      // eslint-disable-next-line no-console
      console.log('- Products: queries and mutations');
      // eslint-disable-next-line no-console
      console.log('- Users: queries and mutations with auth');
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error starting server:', error);
  }
}

startServer();