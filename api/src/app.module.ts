import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from './database/database.module';
import config from './config';
import { envSchema } from './util/schemas';
import { CustomerModule } from './customers/customer.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema: envSchema,
    }),
    DatabaseModule,
    ProductsModule,
    CustomerModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
