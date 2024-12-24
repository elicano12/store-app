import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities';
import { TransactionsService } from './services/transactions.service';
import { TransactionsController } from './controllers/transactions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), HttpModule, ConfigModule],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
