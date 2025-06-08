// index.ts - MIGRACIÓN A GRAPHQL
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
//Importar Apollo Server para GraphQL
import { ApolloServer } from 'apollo-server-express';
import sequelize from "./config/database";

//  Imports de GraphQL 
import { baseTypeDefs } from './schemas';
import { categoryTypeDefs } from './schemas';
import { categoryResolvers } from './resolvers';
import { productResolvers } from './resolvers';
import { productTypeDefs } from './schemas';

dotenv.config();

const app: Express = express();
const port: number = parseInt(process.env.PORT || '3000', 10);

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba básica
app.get('/', (req: Request, res: Response): void => {
    res.send("Hello World");
});

// Ruta de prueba para errores 500
app.get('/error', (req: Request, res: Response): void => {
    res.status(500).send("Hello World");
});

// Ruta de prueba para errores 404
app.get('/notfound', (req: Request, res: Response): void => {
    res.status(404).send("Hello World");
});

// Inicializar GraphQL Server
async function startApolloServer(): Promise<void> {
    const server = new ApolloServer({
        typeDefs: [
            baseTypeDefs,
            categoryTypeDefs,
            productTypeDefs,
        ],
        resolvers: [
            categoryResolvers,
            productResolvers,
        ],
        context: (): Record<string, unknown> => {
            // TODO: Implementar autenticación JWT aquí
            return {};
        },
        formatError: (error: import('graphql').GraphQLError): import('graphql').GraphQLFormattedError => {
            console.error('GraphQL Error:', error);
            return {
                message: error.message,
                locations: error.locations,
                path: error.path,
                extensions: error.extensions
            };
        },
        introspection: true
    });

    await server.start();
    server.applyMiddleware({ 
        app: app as unknown as Parameters<typeof server.applyMiddleware>[0]['app'], 
        path: '/graphql' 
    });
    
    console.log(`GraphQL Server ready at http://localhost:${port}${server.graphqlPath}`);
    
    // Iniciar Express server
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

// Inicialización de la base de datos y servidor
sequelize.authenticate()
    .then(() => {
        console.log('Database connected successfully.');
        return sequelize.sync({ force: true }); // force:true recrea tablas 
    })
    .then(() => {
        console.log('Database synchronized successfully.');
        // Inicializar GraphQL Server que también inicia Express
        return startApolloServer();
    })
    .catch((error: Error) => {
        console.error('Error connecting to database:', error);
    });