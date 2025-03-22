import sequelize from '../config/database';
import { User } from '../models';

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    
    // Sincroniza los modelos
    await sequelize.sync({ force: true });
    console.log('All models were synchronized successfully.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();