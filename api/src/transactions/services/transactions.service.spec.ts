/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CustomerService } from '../../customers/services/customer.service';
import { ProductsService } from '../../products/services/products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from '../entities';
import { Customer } from '../../customers/entities';
import { CreateTransactionDto } from '../dto/transaction.dto';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { Repository } from 'typeorm';
import { TRANSACTION_STATUS } from '../constants';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionRepository: jest.Mocked<Repository<Transaction>>;
  let httpService: jest.Mocked<HttpService>;
  let customerService: jest.Mocked<CustomerService>;
  let productService: jest.Mocked<ProductsService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                WOMPI_URL: 'https://sandbox.wompi.co/v1',
                WOMPI_PUBLIC_KEY: 'public_key',
                WOMPI_INTEGRITY_KEY: 'integrity_key',
              };
              return config[key];
            }),
          },
        },
        {
          provide: CustomerService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: ProductsService,
          useValue: {
            findById: jest.fn(),
            decrementStock: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionRepository = module.get(getRepositoryToken(Transaction));
    httpService = module.get(HttpService);
    customerService = module.get(CustomerService);
    productService = module.get(ProductsService);
    configService = module.get(ConfigService);
  });

  describe('findAll', () => {
    it('should return all transactions', async () => {
      const transactions: Transaction[] = [
        { id: 1 },
        { id: 2 },
      ] as Transaction[];
      transactionRepository.find.mockResolvedValue(transactions);

      const result = await service.findAll();

      expect(result).toEqual(transactions);
      expect(transactionRepository.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a transaction by ID', async () => {
      const transaction = { id: 1 } as Transaction;
      transactionRepository.findOne.mockResolvedValue(transaction);

      const result = await service.findById(1);

      expect(result).toEqual(transaction);
      expect(transactionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null if no transaction is found', async () => {
      transactionRepository.findOne.mockResolvedValue(null);

      const result = await service.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and save a transaction', async () => {
      const dto: CreateTransactionDto = {
        totalAmount: 100,
        paymentMethod: 'CARD',
        installments: 3,
        cardToken: 'token123',
        tokenValidation: 'tokenValidation',
        customerId: 1,
        productId: 2,
      };
      const customer = { id: 1, email: 'customer@example.com' } as Customer;
      const product = { id: 2 } as any;

      customerService.findById.mockResolvedValue(customer);
      productService.findById.mockResolvedValue(product);

      const axiosResponse: AxiosResponse = {
        data: { data: { id: 'payment123' } },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {
          headers: undefined,
        },
      };

      httpService.post.mockReturnValue(of(axiosResponse));

      const createdTransaction: Transaction = {
        id: 1,
        ...dto,
        referenceId: 'reference123',
        status: TRANSACTION_STATUS.PENDING,
        customer,
        products: [product],
        transactionPaymentId: 'payment123',
      } as unknown as Transaction;

      transactionRepository.create.mockReturnValue(createdTransaction);
      transactionRepository.save.mockResolvedValue(createdTransaction);

      const result = await service.create(dto);

      expect(result).toEqual(createdTransaction);
      expect(customerService.findById).toHaveBeenCalledWith(1);
      expect(productService.findById).toHaveBeenCalledWith(2);
      expect(httpService.post).toHaveBeenCalled();
      expect(transactionRepository.save).toHaveBeenCalledWith(
        createdTransaction,
      );
    });

    it('should throw NotFoundException if customer is not found', async () => {
      const dto: CreateTransactionDto = {
        totalAmount: 100,
        paymentMethod: 'CARD',
        installments: 3,
        cardToken: 'token123',
        tokenValidation: 'tokenValidation',
        customerId: 999,
        productId: 2,
      };

      customerService.findById.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(
        new NotFoundException(`Customer with ID ${dto.customerId} not found.`),
      );
    });

    it('should throw NotFoundException if product is not found', async () => {
      const dto: CreateTransactionDto = {
        totalAmount: 100,
        paymentMethod: 'CARD',
        installments: 3,
        cardToken: 'token123',
        tokenValidation: 'tokenValidation',
        customerId: 1,
        productId: 999, // Producto inexistente
      };
      const customer = { id: 1, email: 'customer@example.com' } as Customer;

      customerService.findById.mockResolvedValue(customer);
      productService.findById.mockResolvedValue(null); // Simula que el producto no existe

      await expect(service.create(dto)).rejects.toThrow(
        new NotFoundException(`Product with ID ${dto.productId} not found.`),
      );
    });

    it('should throw InternalServerErrorException if payment fails', async () => {
      const dto: CreateTransactionDto = {
        totalAmount: 100,
        paymentMethod: 'CARD',
        installments: 3,
        cardToken: 'token123',
        tokenValidation: 'tokenValidation',
        customerId: 1,
        productId: 2,
      };
      const customer = { id: 1, email: 'customer@example.com' } as Customer;
      const product = { id: 2 } as any;

      customerService.findById.mockResolvedValue(customer);
      productService.findById.mockResolvedValue(product);

      transactionRepository.create.mockReturnValue({
        id: 1,
        customer: null,
        products: [],
        status: null,
        referenceId: null,
        transactionPaymentId: null,
      } as Transaction);

      httpService.post.mockImplementation(() => {
        throw new Error('Payment API failed');
      });

      await expect(service.create(dto)).rejects.toThrow(
        new InternalServerErrorException(
          'Error creating Payment transaction: Payment API failed',
        ),
      );
    });
  });

  describe('verifyTransaction', () => {
    it('should verify a transaction and update its status', async () => {
      const transaction = {
        id: 1,
        status: TRANSACTION_STATUS.PENDING,
        transactionPaymentId: 'payment123',
        products: [{ id: 2 }],
      } as Transaction;

      const axiosResponse: AxiosResponse = {
        data: { data: { status: TRANSACTION_STATUS.APPROVED } },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };

      transactionRepository.findOne.mockResolvedValue(transaction);
      httpService.get.mockReturnValue(of(axiosResponse));
      transactionRepository.save.mockResolvedValue(transaction);

      const result = await service.verifyTransaction(1);

      expect(result.status).toBe(TRANSACTION_STATUS.APPROVED);
      expect(productService.decrementStock).toHaveBeenCalledWith(2);
    });
  });
});
