import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CustomerService } from './customer.service';
import { Customer } from '../entities/';

describe('CustomerService', () => {
  let service: CustomerService;
  let repository: Repository<Customer>;

  const mockCustomerRepository = {
    find: jest.fn(() =>
      Promise.resolve([
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          transactions: [],
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          transactions: [],
        },
      ]),
    ),
    findOne: jest.fn((condition) =>
      Promise.resolve({
        id: condition.where.id,
        name: `Name${condition.where.id}`,
        email: `Name${condition.where.id}@example.com`,
        transactions: [],
      }),
    ),
    create: jest.fn((customerData) => ({
      ...customerData,
    })),
    save: jest.fn((customer) => Promise.resolve({ id: 3, ...customer })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    repository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all customers with relations', async () => {
    const result = await service.findAll();
    expect(result).toEqual([
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        transactions: [],
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        transactions: [],
      },
    ]);
    expect(repository.find).toHaveBeenCalledWith({
      relations: ['transactions'],
    });
  });

  it('should return a customer by ID with relations', async () => {
    const id = 1;
    const result = await service.findById(id);
    expect(result).toEqual({
      id: 1,
      name: 'Name1',
      email: 'Name1@example.com',
      transactions: [],
    });
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id },
      relations: ['transactions'],
    });
  });

  it('should create and save a new customer', async () => {
    const customerData = {
      name: 'Alex M',
      email: 'Alexm@example.com',
    };
    const result = await service.create(customerData);
    expect(result).toEqual({ id: 3, ...customerData });
    expect(repository.create).toHaveBeenCalledWith(customerData);
    expect(repository.save).toHaveBeenCalledWith({
      name: 'Alex M',
      email: 'Alexm@example.com',
    });
  });
});
