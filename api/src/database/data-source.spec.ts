/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import dataSource from './data-source';

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

jest.mock('@nestjs/config', () => {
  return {
    ConfigService: jest.fn().mockImplementation(() => ({
      get: jest.fn((key: string) => {
        const mockEnv = {
          DB_HOST: 'localhost',
          DB_PORT: '5432',
          DB_USERNAME: 'test_user',
          DB_PASSWORD: 'test_password',
          DB_NAME: 'test_db',
        };
        return mockEnv[key];
      }),
    })),
  };
});

describe('data-source', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService();
  });

  it('should initialize dotenv', () => {
    expect(config).toHaveBeenCalled();
  });

  it('should create a DataSource instance with the expected configuration', () => {
    const expectedOptions = {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test_user',
      password: 'test_password',
      database: 'test_db',
      logging: false,
      synchronize: false,
      entities: ['src/**/*.entity.ts'],
      migrations: ['src/database/migrations/*.ts'],
      migrationsTableName: 'migrations',
    };

    // Validamos que las opciones de configuración del DataSource sean correctas
    expect(dataSource.options).toMatchObject(expectedOptions);

    // Validamos que DataSource sea una instancia válida
    expect(dataSource).toBeInstanceOf(DataSource);
  });
});
