import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../entities/';

describe('CustomersController', () => {
  let controller: CustomerController;
  let service: CustomerService;

  const mockCustomerService = {
    findAll: jest.fn(() =>
      Promise.resolve([
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      ]),
    ),
    findById: jest.fn((id: number) =>
      Promise.resolve({ id, name: 'John Doe', email: 'john@example.com' }),
    ),
    create: jest.fn((customerData: Partial<Customer>) =>
      Promise.resolve({ id: 3, ...customerData }),
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

  it('should return all customers', async () => {
    const result = await controller.getAllCustomers();
    expect(result).toEqual([
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a customer by ID', async () => {
    const result = await controller.getCustomerById(1);
    expect(result).toEqual({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
    });
    expect(service.findById).toHaveBeenCalledWith(1);
  });

  it('should create a new customer', async () => {
    const customerData = { name: 'Alex M', email: 'Alexm@example.com' };
    const result = await controller.createCustomer(customerData);
    expect(result).toEqual({ id: 3, ...customerData });
    expect(service.create).toHaveBeenCalledWith(customerData);
  });
});
