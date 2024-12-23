import { getMetadataArgsStorage } from 'typeorm';
import { Transaction } from './transaction.entity';
import { Customer } from '../../customers/entities';
import { Product } from '../../products/entities';

describe('Transaction Entity', () => {
  it('should have the correct columns', () => {
    const columns = getMetadataArgsStorage().columns.filter(
      (column) => column.target === Transaction,
    );

    expect(columns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ propertyName: 'id', type: 'int' }),
        expect.objectContaining({ propertyName: 'status', type: 'varchar' }),
        expect.objectContaining({
          propertyName: 'totalAmount',
          type: 'decimal',
          precision: 10,
          scale: 2,
        }),
      ]),
    );
  });

  it('should define a ManyToOne relationship with Customer', () => {
    const relations = getMetadataArgsStorage().relations.filter(
      (relation) =>
        relation.target === Transaction && relation.propertyName === 'customer',
    );

    expect(relations).toHaveLength(1);

    const relation = relations[0];
    expect(relation.relationType).toBe('many-to-one');
    expect(relation.target).toBe(Customer);
    expect(relation.inverseSideProperty).toBe('transactions');
  });

  it('should define a ManyToMany relationship with Product', () => {
    const relations = getMetadataArgsStorage().relations.filter(
      (relation) =>
        relation.target === Transaction && relation.propertyName === 'products',
    );

    expect(relations).toHaveLength(1);

    const relation = relations[0];
    expect(relation.relationType).toBe('many-to-many');
    expect(relation.target).toBe(Product);

    // Verifica la configuración de la tabla de unión
    const joinTable = getMetadataArgsStorage().joinTables.find(
      (jt) => jt.target === Transaction && jt.propertyName === 'products',
    );

    expect(joinTable).toBeDefined();
    expect(joinTable.name).toBe('transaction_products');
    expect(joinTable.joinColumns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'transaction_id' }),
      ]),
    );
    expect(joinTable.inverseJoinColumns).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'product_id' })]),
    );
  });
});
