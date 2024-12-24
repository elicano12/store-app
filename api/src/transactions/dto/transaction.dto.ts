import { IsNumber, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Total Amount to payment' })
  readonly totalAmount: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Payment Method' })
  readonly paymentMethod: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'installments' })
  readonly installments: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Token Card' })
  readonly cardToken: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Token Validation' })
  readonly tokenValidation: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Customer ID' })
  readonly customerId: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'Product ID' })
  readonly productId: number;
}
