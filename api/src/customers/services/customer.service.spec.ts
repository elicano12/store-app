import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { Repository } from 'typeorm';
import { Customer } from '../entities';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CustomerService', () => {
  let service: CustomerService;
  let customerRepository: jest.Mocked<Repository<Customer>>;

  const mockCustomers: Customer[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      address: '123 Main St',
      transactions: [],
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      address: '456 Elm St',
      transactions: [],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    customerRepository = module.get<jest.Mocked<Repository<Customer>>>(
      getRepositoryToken(Customer),
    );
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      customerRepository.find.mockResolvedValue(mockCustomers);

      const result = await service.findAll();

      expect(customerRepository.find).toHaveBeenCalledWith({
        relations: ['transactions'],
      });
      expect(result).toEqual(mockCustomers);
    });
  });

  describe('findById', () => {
    it('should return a customer by ID', async () => {
      const customer = mockCustomers[0];
      customerRepository.findOne.mockResolvedValue(customer);

      const result = await service.findById(1);

      expect(customerRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['transactions'],
      });
      expect(result).toEqual(customer);
    });

    it('should return null if no customer is found', async () => {
      customerRepository.findOne.mockResolvedValue(null);

      const result = await service.findById(999);

      expect(customerRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['transactions'],
      });
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return a new customer', async () => {
      const customerData = {
        name: 'Alice Brown',
        email: 'alice@example.com',
        address: '789 Pine St',
      };
      const savedCustomer = { id: 3, ...customerData };

      customerRepository.create.mockReturnValue(savedCustomer as Customer);
      customerRepository.save.mockResolvedValue(savedCustomer as Customer);

      const result = await service.create(customerData);

      expect(customerRepository.create).toHaveBeenCalledWith(customerData);
      expect(customerRepository.save).toHaveBeenCalledWith(savedCustomer);
      expect(result).toEqual(savedCustomer);
    });

    it('should throw an error if save fails', async () => {
      customerRepository.save.mockRejectedValue(new Error('Save failed'));

      const customerData = {
        name: 'Error Case',
        email: 'error@example.com',
        address: '000 Error St',
      };

      await expect(service.create(customerData)).rejects.toThrow('Save failed');
    });
  });
});
