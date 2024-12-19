import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Customer } from '../../customers/entities';
import { Product } from '../../products/entities';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string; // Example: PENDING, COMPLETED, FAILED

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @ManyToOne(() => Customer, (customer) => customer.transactions)
  customer: Customer;

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'transaction_products',
    joinColumn: { name: 'transaction_id' },
    inverseJoinColumn: { name: 'product_id' },
  })
  products: Product[];
}
