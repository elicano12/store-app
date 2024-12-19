import { DataSource } from 'typeorm';
import { Product } from '../../products/entities';

export async function seedProducts(dataSource: DataSource): Promise<void> {
  const productRepository = dataSource.getRepository(Product);

  // Productos iniciales
  const products = [
    {
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with long battery life',
      price: 150000,
      stock: 50,
      imageUrl: 'https://ik.imagekit.io/koet7mwio/mouse.jpg',
    },
    {
      name: 'Gaming Keyboard',
      description: 'Mechanical RGB keyboard for gaming enthusiasts',
      price: 250000,
      stock: 30,
      imageUrl: 'https://ik.imagekit.io/koet7mwio/keyboard.webp',
    },
    {
      name: '4K Monitor',
      description: '27-inch UHD monitor with stunning visuals',
      price: 1200000,
      stock: 20,
      imageUrl: 'https://ik.imagekit.io/koet7mwio/4k_monitor.webp',
    },
    {
      name: 'Noise Cancelling Headphones',
      description: 'Headphones with active noise cancelling feature',
      price: 850000,
      stock: 15,
      imageUrl:
        'https://ik.imagekit.io/koet7mwio/noise_cancellation_headphones.jpg',
    },
    {
      name: 'Smartphone Stand',
      description: 'Adjustable smartphone stand for desk use',
      price: 35000,
      stock: 100,
      imageUrl: 'https://ik.imagekit.io/koet7mwio/Smartphone%20Stand.jpg',
    },
  ];

  for (const product of products) {
    const existingProduct = await productRepository.findOneBy({
      name: product.name,
    });
    if (!existingProduct) {
      const newProduct = productRepository.create(product);
      await productRepository.save(newProduct);
      console.log(`Seeded product: ${product.name}`);
    }
  }
}
