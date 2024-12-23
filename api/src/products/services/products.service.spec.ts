import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductsService } from './products.service';
import { Product } from '../entities/';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  const mockProductRepository = {
    find: jest.fn(() =>
      Promise.resolve([
        { id: 1, name: 'ItemOne', price: 100 },
        { id: 2, name: 'ItemTwo', price: 200 },
      ]),
    ),
    findOneBy: jest.fn((condition) =>
      Promise.resolve({ id: condition.id, name: 'ItemOne', price: 100 }),
    ),
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
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all products', async () => {
    const result = await service.findAll();
    expect(result).toEqual([
      { id: 1, name: 'ItemOne', price: 100 },
      { id: 2, name: 'ItemTwo', price: 200 },
    ]);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should return a product by ID', async () => {
    const result = await service.findById(1);
    expect(result).toEqual({ id: 1, name: 'ItemOne', price: 100 });
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });
});
