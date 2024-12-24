import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities';
import { Customer } from '../../customers/entities';
import { CreateTransactionDto } from '../dto/transaction.dto';
import { CustomerService } from '../../customers/services/customer.service';
import { ProductsService } from '../../products/services/products.service';
import { TRANSACTION_STATUS, CURRENCY_TYPES } from '../constants';

@Injectable()
export class TransactionsService {
  private wompiUrl: string;
  private publicKey: string;
  private signatureKey: string;

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly customerService: CustomerService,
    private readonly productService: ProductsService,
  ) {
    this.wompiUrl = this.configService.get('WOMPI_URL');
    this.publicKey = this.configService.get('WOMPI_PUBLIC_KEY');
    this.signatureKey = this.configService.get('WOMPI_INTEGRITY_KEY');
  }
  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  async findById(id: number): Promise<Transaction> {
    return this.transactionRepository.findOne({ where: { id } });
  }
  async create(transactionData: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionRepository.create(transactionData);
    const customer = await this.customerService.findById(
      transactionData.customerId,
    );

    if (!customer) {
      throw new NotFoundException(
        `Customer with ID ${transactionData.customerId} not found.`,
      );
    }

    const product = await this.productService.findById(
      transactionData.productId,
    );

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${transactionData.productId} not found.`,
      );
    }

    transaction.customer = customer;
    transaction.products = [product];
    transaction.status = TRANSACTION_STATUS.PENDING;
    transaction.referenceId = uuidv4();

    const signature = this.createTransactionSignature(
      transaction,
      transactionData,
    );

    const paymentTransactionData = this.buildPaymentTransactionData(
      transactionData,
      transaction,
      customer,
      signature,
    );

    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.wompiUrl}/transactions`,
          paymentTransactionData,
          {
            headers: {
              Authorization: `Bearer ${this.publicKey}`,
            },
          },
        ),
      );
      transaction.transactionPaymentId = response.data.data.id;
      return this.transactionRepository.save(transaction);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `Error creating Payment transaction: ${error.message}`,
      );
    }
  }

  private createTransactionSignature(
    transaction: Transaction,
    transactionData: CreateTransactionDto,
  ): string {
    const signatureString = `${transaction.referenceId}${transactionData.totalAmount * 100}COP${this.signatureKey}`;
    const signature = crypto
      .createHash('sha256')
      .update(signatureString)
      .digest('hex');
    return signature;
  }

  private buildPaymentTransactionData(
    transactionData: CreateTransactionDto,
    transaction: Transaction,
    customer: Customer,
    signature: string,
  ) {
    return {
      amount_in_cents: transactionData.totalAmount * 100,
      payment_method: {
        type: transactionData.paymentMethod,
        installments: transactionData.installments,
        token: transactionData.cardToken,
      },
      currency: CURRENCY_TYPES.COP,
      reference: transaction.referenceId,
      customer_email: customer.email,
      acceptance_token: transactionData.tokenValidation,
      signature,
    };
  }

  async verifyTransaction(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    const paymentId = transaction.transactionPaymentId;

    const response = await lastValueFrom(
      this.httpService.get(`${this.wompiUrl}/transactions/${paymentId}`),
    );
    if (response.data.data.status !== TRANSACTION_STATUS.PENDING) {
      transaction.status = response.data.data.status;
    }
    if (response.data.data.status === TRANSACTION_STATUS.APPROVED) {
      const [product] = transaction.products;
      await this.productService.decrementStock(product.id);
    }
    return this.transactionRepository.save(transaction);
  }
}
