import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from '../services/products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductService = {
    findAll: jest.fn(() =>
      Promise.resolve([
        { id: 1, name: 'Product A', price: 100 },
        { id: 2, name: 'Product B', price: 200 },
      ]),
    ),
    findById: jest.fn((id: number) =>
      Promise.resolve({ id, name: `Product ${id}`, price: 100 }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all products', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([
      { id: 1, name: 'Product A', price: 100 },
      { id: 2, name: 'Product B', price: 200 },
    ]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a product by ID', async () => {
    const result = await controller.findById(1);
    expect(result).toEqual({ id: 1, name: 'Product 1', price: 100 });
    expect(service.findById).toHaveBeenCalledWith(1);
  });
});
