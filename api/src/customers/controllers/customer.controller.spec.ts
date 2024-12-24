import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../entities';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomerService;

  const mockCustomers: Customer[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      address: '',
      transactions: [],
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      address: '',
      transactions: [],
    },
  ];

  const mockCustomerService = {
    findAll: jest.fn(() => Promise.resolve(mockCustomers)),
    findById: jest.fn((id: number) =>
      Promise.resolve(mockCustomers.find((c) => c.id === id)),
    ),
    create: jest.fn((data: Partial<Customer>) =>
      Promise.resolve({ id: 3, ...data }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: mockCustomerService,
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllCustomers', () => {
    it('should return an array of customers', async () => {
      const result = await controller.getAllCustomers();
      expect(result).toEqual(mockCustomers);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getCustomerById', () => {
    it('should return a customer by id', async () => {
      const result = await controller.getCustomerById(1);
      expect(result).toEqual(mockCustomers[0]);
      expect(service.findById).toHaveBeenCalledWith(1);
    });

    it('should throw an error if customer is not found', async () => {
      jest
        .spyOn(service, 'findById')
        .mockRejectedValueOnce(new Error('Not Found'));
      await expect(controller.getCustomerById(999)).rejects.toThrow(
        'Not Found',
      );
    });
  });

  describe('createCustomer', () => {
    it('should create and return a new customer', async () => {
      const newCustomerData = {
        name: 'Alice Brown',
        email: 'alice@example.com',
      };
      const result = await controller.createCustomer(newCustomerData);
      expect(result).toEqual({ id: 3, ...newCustomerData });
      expect(service.create).toHaveBeenCalledWith(newCustomerData);
    });

    it('should throw an error if creation fails', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(new Error('Creation Failed'));
      await expect(
        controller.createCustomer({ name: 'Error Case' }),
      ).rejects.toThrow('Creation Failed');
    });
  });
});
