import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities';
import { TokenizeCardDto } from '../dto/transaction.dto';

@Injectable()
export class TransactionsService {
  private wompiUrl = this.configService.get('WOMPI_URL');
  private publicKey = this.configService.get('WOMPI_PUBLIC_KEY');

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  async findById(id: number): Promise<Transaction> {
    return this.transactionRepository.findOne({ where: { id } });
  }
  async tokenizeCard(cardData: TokenizeCardDto): Promise<string> {
    const payload = {
      number: cardData.number,
      cvc: cardData.cvc,
      exp_month: cardData.exp_month,
      exp_year: cardData.exp_year,
      card_holder: cardData.card_holder,
    };
    const response = await lastValueFrom(
      this.httpService.post(`${this.wompiUrl}/tokens/cards`, payload, {
        headers: { Authorization: `Bearer ${this.publicKey}` },
      }),
    );
    return response.data.data.id;
  }

  async getAcceptanceToken(): Promise<string> {
    console.log(this.publicKey);
    const response = await lastValueFrom(
      this.httpService.get(`${this.wompiUrl}/merchants/${this.publicKey}`, {
        headers: { Authorization: `Bearer ${this.publicKey}` },
      }),
    );
    return response.data.data.presigned_acceptance.acceptance_token;
  }
}
