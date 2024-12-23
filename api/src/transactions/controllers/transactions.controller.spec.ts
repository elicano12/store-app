import { Test, TestingModule } from '@nestjs/testing';

import { TransactionsController } from './transactions.controller';
import { TransactionsService } from '../services/transactions.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  const mockTransactionService = {
    findAll: jest.fn(() =>
      Promise.resolve([
        {
          id: 1,
          status: 'COMPLETED',
          totalAmount: 100.0,
          customer: { id: 1, name: 'John Doe' },
          products: [],
        },
        {
          id: 2,
          status: 'PENDING',
          totalAmount: 200.0,
          customer: { id: 2, name: 'Jane Smith' },
          products: [],
        },
      ]),
    ),
    findById: jest.fn((id) =>
      Promise.resolve({
        id,
        status: 'COMPLETED',
        totalAmount: 100.0,
        customer: { id: 1, name: 'John Doe' },
        products: [],
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all transactions', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([
      {
        id: 1,
        status: 'COMPLETED',
        totalAmount: 100.0,
        customer: { id: 1, name: 'John Doe' },
        products: [],
      },
      {
        id: 2,
        status: 'PENDING',
        totalAmount: 200.0,
        customer: { id: 2, name: 'Jane Smith' },
        products: [],
      },
    ]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a transaction by ID', async () => {
    const id = 1;
    const result = await controller.findById(id);
    expect(result).toEqual({
      id: 1,
      status: 'COMPLETED',
      totalAmount: 100.0,
      customer: { id: 1, name: 'John Doe' },
      products: [],
    });
    expect(service.findById).toHaveBeenCalledWith(id);
  });
});
