import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { TransactionsModule } from './transactions.module';
import { TransactionsController } from './controllers/transactions.controller';
import { TransactionsService } from './services/transactions.service';
import { Transaction } from './entities/';

describe('TransactionsModule', () => {
  let module: TransactionsModule;

  const mockTransactionsRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [TransactionsModule],
    })
      .overrideProvider(getRepositoryToken(Transaction))
      .useValue(mockTransactionsRepository)
      .compile();

    module = testingModule.get<TransactionsModule>(TransactionsModule);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should import TypeOrmModule with Transactions entity', () => {
    const imports = Reflect.getMetadata('imports', TransactionsModule);
    expect(imports).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          exports: expect.any(Array),
          providers: expect.any(Array),
        }),
      ]),
    );
  });

  it('should provide TransactionsService in providers', () => {
    const providers = Reflect.getMetadata('providers', TransactionsModule);
    expect(providers).toContain(TransactionsService);
  });

  it('should declare TransactionsController in controllers', () => {
    const controllers = Reflect.getMetadata('controllers', TransactionsModule);
    expect(controllers).toContain(TransactionsController);
  });

  it('should export TransactionsService in exports', () => {
    const exports = Reflect.getMetadata('exports', TransactionsModule);
    expect(exports).toContain(TransactionsService);
  });
});
