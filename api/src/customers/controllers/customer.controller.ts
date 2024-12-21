import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { CustomerService } from '../services/customer.service';
import { Customer } from '../entities';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  async getAllCustomers(): Promise<Customer[]> {
    return this.customerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by id' })
  async getCustomerById(@Param('id') id: number): Promise<Customer> {
    return this.customerService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  async createCustomer(
    @Body() customerData: Partial<Customer>,
  ): Promise<Customer> {
    return this.customerService.create(customerData);
  }
}
