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
import { TokenizeCardDto } from '../dto/transaction.dto';

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

  @Post('acceptance-token')
  @ApiOperation({ summary: 'Get Acceptance Token' })
  getAcceptanceToken(): Promise<string> {
    return this.transactionService.getAcceptanceToken();
  }
  @Post('tokenize-card')
  @ApiOperation({ summary: 'Get Token to credit card' })
  tokenizeCard(@Body() cardData: TokenizeCardDto): Promise<string> {
    return this.transactionService.tokenizeCard(cardData);
  }
}
