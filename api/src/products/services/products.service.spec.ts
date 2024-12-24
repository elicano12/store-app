import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductsService } from './products.service';
import { Product } from '../entities/';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: jest.Mocked<Repository<Product>>;

  const mockProductRepository = {
    find: jest.fn(() =>
      Promise.resolve([
        { id: 1, name: 'ItemOne', price: 100, stock: 10 },
        { id: 2, name: 'ItemTwo', price: 200, stock: 20 },
      ]),
    ),
    findOneBy: jest.fn((condition) =>
      Promise.resolve(
        condition.id === 1
          ? { id: 1, name: 'ItemOne', price: 100, stock: 10 }
          : null,
      ),
    ),
    save: jest.fn((product) => Promise.resolve(product)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<jest.Mocked<Repository<Product>>>(
      getRepositoryToken(Product),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all products', async () => {
    const result = await service.findAll();
    expect(result).toEqual([
      { id: 1, name: 'ItemOne', price: 100, stock: 10 },
      { id: 2, name: 'ItemTwo', price: 200, stock: 20 },
    ]);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should return a product by ID', async () => {
    const result = await service.findById(1);
    expect(result).toEqual({ id: 1, name: 'ItemOne', price: 100, stock: 10 });
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should decrement product stock successfully', async () => {
    const product = {
      id: 1,
      name: 'ItemOne',
      price: 100,
      stock: 10,
      description: 'Test Product',
      imageUrl: 'http://example.com/image.jpg',
      created_at: new Date(),
      updated_at: new Date(),
    } as Product;
    repository.findOneBy.mockResolvedValue(product);

    await service.decrementStock(1);

    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repository.save).toHaveBeenCalledWith({
      ...product,
      stock: 9,
    });
  });

  it('should throw NotFoundException if product does not exist for decrementStock', async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.decrementStock(999)).rejects.toThrow(
      new NotFoundException('Product not found or out of stock'),
    );
  });

  it('should throw NotFoundException if product stock is zero for decrementStock', async () => {
    const product = {
      id: 1,
      name: 'ItemOne',
      price: 100,
      stock: 0,
      description: 'Test Product',
      imageUrl: 'http://example.com/image.jpg',
      created_at: new Date(),
      updated_at: new Date(),
    } as Product;
    repository.findOneBy.mockResolvedValue(product);

    await expect(service.decrementStock(1)).rejects.toThrow(
      new NotFoundException('Product not found or out of stock'),
    );
  });
});
