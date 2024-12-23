import { Product } from './product.entity';
import { getMetadataArgsStorage } from 'typeorm';

describe('Product Entity', () => {
  it('should have the correct columns', () => {
    const columns = getMetadataArgsStorage().columns.filter(
      (col) => col.target === Product,
    );

    expect(columns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ propertyName: 'id' }),
        expect.objectContaining({ propertyName: 'name' }),
        expect.objectContaining({ propertyName: 'description' }),
        expect.objectContaining({ propertyName: 'price' }),
        expect.objectContaining({ propertyName: 'stock' }),
        expect.objectContaining({ propertyName: 'imageUrl' }),
        expect.objectContaining({ propertyName: 'created_at' }),
        expect.objectContaining({ propertyName: 'updated_at' }),
      ]),
    );
  });

  it('should define the "id" as a primary column', () => {
    const primaryColumns = getMetadataArgsStorage().columns.filter(
      (col) => col.target === Product && col.options.primary,
    );

    expect(primaryColumns).toEqual(
      expect.arrayContaining([expect.objectContaining({ propertyName: 'id' })]),
    );
  });

  it('should define "created_at" as a CreateDateColumn', () => {
    const createDateColumn = getMetadataArgsStorage().columns.find(
      (col) => col.target === Product && col.propertyName === 'created_at',
    );

    expect(createDateColumn).toBeDefined();
    expect(createDateColumn?.options.type).toBe('timestamptz');
    expect(createDateColumn?.options.default).toBeInstanceOf(Function);
  });

  it('should define "updated_at" as an UpdateDateColumn', () => {
    const updateDateColumn = getMetadataArgsStorage().columns.find(
      (col) => col.target === Product && col.propertyName === 'updated_at',
    );

    expect(updateDateColumn).toBeDefined();
    expect(updateDateColumn?.options.type).toBe('timestamptz');
    expect(updateDateColumn?.options.default).toBeInstanceOf(Function);
  });

  it('should define the table name as "products"', () => {
    const entity = getMetadataArgsStorage().tables.find(
      (table) => table.target === Product,
    );

    expect(entity).toBeDefined();
    expect(entity?.name).toBe('products');
  });
});
