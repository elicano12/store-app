import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { TransactionsService } from '../services/transactions.service';
import { Transaction } from '../entities';
import { CreateTransactionDto } from '../dto/transaction.dto';

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

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  async createTransaction(
    @Body() transactionData: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionService.create(transactionData);
  }

  @Post('verify/:id')
  @ApiOperation({ summary: 'Verify transaction status' })
  async verifyTransaction(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Transaction> {
    return this.transactionService.verifyTransaction(id);
  }
}
