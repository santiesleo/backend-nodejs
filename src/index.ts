// index.ts - MIGRACIÓN A GRAPHQL
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
// NUEVO: Importar Apollo Server para GraphQL
import { ApolloServer } from 'apollo-server-express';
import { userRouter, postRouter,  } from './routes'; 
import sequelize from "./config/database";

// NUEVO: Imports de GraphQL para categorías
import { baseTypeDefs } from './schemas';
import { categoryTypeDefs } from './schemas';
import { categoryResolvers } from './resolvers';

import { productResolvers } from './resolvers';
import { productTypeDefs } from './schemas';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { userTypeDefs } from './schemas/user.typedefs';
import { userResolvers } from './resolvers/user.resolver';
import { authMiddleware } from './middlewares/auth.middleware';
import { Context } from './interfaces/context.interface';

dotenv.config();

const app: Express = express();
const port: number = process.env.PORT as any || 3000;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Rutas REST aún existentes 
app.use('/user', userRouter);


app.get('/', (req: Request, res: Response) => {
    res.send("Hello World");
});

app.get('/error', (req: Request, res: Response) => {
    res.status(500).send("Hello World");
});

app.get('/notfound', (req: Request, res: Response) => {
    res.status(404).send("Hello World");
});

// Merge type definitions and resolvers
const typeDefs = mergeTypeDefs([userTypeDefs]);
const resolvers = mergeResolvers([userResolvers]);

// Create executable schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create Apollo Server
const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const context: Context = { req: req as any };
    return authMiddleware(context);
  },
});

async function startServer() {
  try {
    // Sync database
    await sequelize.sync();
    console.log('Database synced successfully');

    // Start Apollo Server
    await server.start();
    server.applyMiddleware({ app: app as any });

    // Start Express server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer();