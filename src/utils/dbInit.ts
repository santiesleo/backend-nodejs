import sequelize from '../config/database';

async function initializeDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();
    // eslint-disable-next-line no-console
    console.log('Database connected successfully.');
    
    // Sincroniza los modelos
    await sequelize.sync({ force: true });
    // eslint-disable-next-line no-console
    console.log('All models were synchronized successfully.');
    
    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();