import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { TransactionsService } from '../services/transactions.service';
import { Transaction } from '../entities';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  findAll(): Promise<Transaction[]> {
    return this.transactionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by id' })
  findById(@Param('id', ParseIntPipe) id: number): Promise<Transaction> {
    return this.transactionService.findById(id);
  }
}
