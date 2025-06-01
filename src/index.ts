// index.ts - MIGRACIÓN A GRAPHQL
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
// NUEVO: Importar Apollo Server para GraphQL
import { ApolloServer } from 'apollo-server-express';
import { userRouter, postRouter, productRouter } from './routes'; // MODIFICADO: Removido categoryRouter (migrado a GraphQL)
import sequelize from "./config/database";

// NUEVO: Imports de GraphQL para categorías
import { baseTypeDefs } from './schemas/base.typedefs';
import { categoryTypeDefs } from './schemas/category.typedefs';
import { categoryResolvers } from './resolvers/category.resolvers';

dotenv.config();

const app: Express = express();
const port: number = process.env.PORT as any || 3000;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Rutas REST aún existentes 
app.use('/user', userRouter);
app.use('/api/products', productRouter); // Mantener hasta migrar productos

app.get('/', (req: Request, res: Response) => {
    res.send("Hello World");
});

app.get('/error', (req: Request, res: Response) => {
    res.status(500).send("Hello World");
});

app.get('/notfound', (req: Request, res: Response) => {
    res.status(404).send("Hello World");
});

// inicializar GraphQL Server
async function startApolloServer() {
    const server = new ApolloServer({
        typeDefs: [
            baseTypeDefs,
            categoryTypeDefs
            // resto de typeDefs se agregarán aquí
        ],
        resolvers: [
            categoryResolvers
            //agregaremos aqui el resto de los resolvers
        ],
        context: ({ req }: { req: any }) => {
            // TODO: Implementar autenticación JWT aquí
            return {};
        },
        formatError: (error) => {
            console.error('GraphQL Error:', error);
            return {
                message: error.message,
                code: error.extensions?.code,
                path: error.path
            };
        },
        introspection: true
    });

    await server.start();
    server.applyMiddleware({ 
        app: app as any, 
        path: '/graphql' 
    });
    
    console.log(`GraphQL Server ready at http://localhost:${port}${server.graphqlPath}`);
    
    // CAMBIO IMPORTANTE: Iniciar Express server AQUÍ
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

// MODIFICADO: Agregar inicialización de Apollo Server
sequelize.authenticate()
    .then(() => {
        console.log('Database connected successfully.');
        return sequelize.sync({ force: true }); // force:true recrea tablas 
    })
    .then(() => {
        console.log('Database synchronized successfully.');
        // NUEVO: Inicializar GraphQL Server (que también inicia Express)
        return startApolloServer();
    })
    .catch((error) => {
        console.error('Error connecting to database:', error);
    });