import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from '../services/transactions.service';
import { CreateTransactionDto } from '../dto/transaction.dto';
import { ValidationPipe } from '@nestjs/common';
import { Transaction } from '../entities';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  const mockTransactions: Transaction[] = [
    {
      id: 1,
      status: 'COMPLETED',
      referenceId: 'REF123',
      transactionPaymentId: 'PAY123',
      totalAmount: 100,
      created_at: new Date(),
      updated_at: new Date(),
      customer: null,
      products: [],
    },
  ];

  const mockTransactionsService = {
    findAll: jest.fn(() => Promise.resolve(mockTransactions)),
    findById: jest.fn((id: number) =>
      Promise.resolve(mockTransactions.find((t) => t.id === id)),
    ),
    create: jest.fn((dto: CreateTransactionDto) => {
      const newTransaction = {
        id: mockTransactions.length + 1,
        status: 'PENDING',
        ...dto,
        created_at: new Date(),
        updated_at: new Date(),
      };
      return Promise.resolve(newTransaction);
    }),
    verifyTransaction: jest.fn((id: number) => {
      const transaction = mockTransactions.find((t) => t.id === id);
      if (!transaction) {
        return Promise.reject(new Error('Transaction not found'));
      }
      transaction.status = 'VERIFIED';
      return Promise.resolve(transaction);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create a new transaction successfully', async () => {
      const dto: CreateTransactionDto = {
        totalAmount: 150,
        paymentMethod: 'CREDIT_CARD',
        installments: 3,
        cardToken: 'token123',
        tokenValidation: 'validation123',
        customerId: 1,
        productId: 2,
      };

      const result = await controller.createTransaction(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        id: mockTransactions.length + 1,
        status: 'PENDING',
        ...dto,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });

    it('should throw a validation error for missing fields', async () => {
      const dto: Partial<CreateTransactionDto> = {
        totalAmount: 150,
        paymentMethod: 'CREDIT_CARD',
        // Missing required fields like installments, cardToken, etc.
      };

      // Simulate NestJS ValidationPipe
      const validationPipe = new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      await expect(
        validationPipe.transform(dto, {
          type: 'body',
          metatype: CreateTransactionDto,
        }),
      ).rejects.toThrowError();
    });

    it('should throw a validation error for incorrect data types', async () => {
      const dto: any = {
        totalAmount: 'invalid-number', // Should be a number
        paymentMethod: 123, // Should be a string
        installments: 'three', // Should be a number
        cardToken: null, // Should be a string
        tokenValidation: 456, // Should be a string
        customerId: 'abc', // Should be a number
        productId: 'invalid-id', // Should be a number
      };

      // Simulate NestJS ValidationPipe
      const validationPipe = new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      await expect(
        validationPipe.transform(dto, {
          type: 'body',
          metatype: CreateTransactionDto,
        }),
      ).rejects.toThrowError();
    });
  });
});
