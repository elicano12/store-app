import AppDataSource from './database/data-source';
import { seedCustomers, seedProducts } from './database/seeds';

async function runSeed() {
  const dataSource = await AppDataSource.initialize();
  console.log('Database connected');

  try {
    await seedProducts(dataSource);
    await seedCustomers(dataSource);
    console.log('Seeding completed');
  } catch (error) {
    console.error('Seeding failed', error);
  } finally {
    await dataSource.destroy();
  }
}

runSeed();
