//let express = require("express");
import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import {userRouter, postRouter, categoryRouter} from './routes';
import sequelize from "./config/database";

dotenv.config();

const app: Express = express();
const port: number = process.env.PORT as any || 3000;

app.use(express.json()); 
app.use(express.urlencoded({ extended:true }))

app.use('/user', userRouter);
app.use('/api/categories', categoryRouter); // Añadido para rutas de categorías

app.get('/', (req: Request, res: Response)=>{
    res.send("Hello World");
});

app.get('/error', (req: Request, res: Response)=>{
    res.status(500).send("Hello World");
});

app.get('/notfound', (req: Request, res: Response)=>{
    res.status(404).send("Hello World");
});

sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully.');
    return sequelize.sync({ force: true }); // force:true recrea tablas 
  })
  .then(() => {
    console.log('Database synchronized successfully.');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });