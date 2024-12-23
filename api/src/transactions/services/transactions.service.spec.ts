import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TransactionsService } from './transactions.service';
import { Transaction } from '../entities/';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: Repository<Transaction>;

  const mockTransactionRepository = {
    find: jest.fn(() =>
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
    findOne: jest.fn((condition) =>
      Promise.resolve({
        id: condition.where.id,
        status: 'COMPLETED',
        totalAmount: 100.0,
        customer: { id: condition.where.id, name: 'John Doe' },
        products: [],
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all transactions', async () => {
    const result = await service.findAll();
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
    expect(repository.find).toHaveBeenCalled();
  });

  it('should return a transaction by ID', async () => {
    const id = 1;
    const result = await service.findById(id);
    expect(result).toEqual({
      id: 1,
      status: 'COMPLETED',
      totalAmount: 100.0,
      customer: { id: 1, name: 'John Doe' },
      products: [],
    });
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id },
    });
  });
});
