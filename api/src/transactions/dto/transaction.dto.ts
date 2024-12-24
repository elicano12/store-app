import { IsString, IsNotEmpty, Length, IsCreditCard } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokenizeCardDto {
  @IsNotEmpty()
  @IsString()
  @IsCreditCard()
  @ApiProperty({ description: 'Card Number' })
  readonly number: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 4)
  @ApiProperty({ description: 'CVC Number' })
  readonly cvc: number;

  @IsNotEmpty()
  @IsString()
  @Length(2)
  @ApiProperty({ description: 'Expiration Month' })
  readonly exp_month: string;

  @IsNotEmpty()
  @IsString()
  @Length(2)
  @ApiProperty({ description: 'Expiration Year' })
  readonly exp_year: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  @ApiProperty({ description: 'Card Holder' })
  readonly card_holder: string;
}
