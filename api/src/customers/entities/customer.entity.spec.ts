import { Customer } from './customer.entity';
import { getMetadataArgsStorage } from 'typeorm';
import { Transaction } from '../../transactions/entities';

describe('Customer Entity', () => {
  it('should have the correct columns', () => {
    const columns = getMetadataArgsStorage().columns.filter(
      (col) => col.target === Customer,
    );

    expect(columns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ propertyName: 'id' }),
        expect.objectContaining({ propertyName: 'name' }),
        expect.objectContaining({ propertyName: 'email' }),
        expect.objectContaining({ propertyName: 'address' }),
      ]),
    );
  });

  it('should define the "id" as a primary column', () => {
    const primaryColumns = getMetadataArgsStorage().columns.filter(
      (col) => col.target === Customer && col.options.primary,
    );

    expect(primaryColumns).toEqual(
      expect.arrayContaining([expect.objectContaining({ propertyName: 'id' })]),
    );
  });

  fit('should define a OneToMany relationship with Transaction', () => {
    // Extrae las relaciones desde los metadatos de TypeORM
    const relations = getMetadataArgsStorage().relations.filter(
      (relation) =>
        relation.target === Customer && relation.propertyName == 'transactions',
    );

    expect(relations).toHaveLength(1); // Asegura que existe una relación

    const relation = relations[0];
    console.log(relation[0]);
    // Verifica las propiedades esenciales de la relación
    expect(relation.propertyName).toBe('transactions');
    expect(relation.relationType).toBe('one-to-many');
    expect(relation.inverseSideProperty).toBe('customer');
    expect(relation.target).toBe(Transaction); // Valida el destino de la relación
    expect(relation.options.eager).toBe(true); // Valida la opción `eager`
  });

  it('should define the table name as "customers"', () => {
    const entity = getMetadataArgsStorage().tables.find(
      (table) => table.target === Customer,
    );

    expect(entity).toBeDefined();
    expect(entity?.name).toBe('customers');
  });
});
