import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../entities';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async getAllCustomers(): Promise<Customer[]> {
    return this.customerService.findAll();
  }

  @Get(':id')
  async getCustomerById(@Param('id') id: number): Promise<Customer> {
    return this.customerService.findById(id);
  }

  @Post()
  async createCustomer(
    @Body() customerData: Partial<Customer>,
  ): Promise<Customer> {
    return this.customerService.create(customerData);
  }
}
