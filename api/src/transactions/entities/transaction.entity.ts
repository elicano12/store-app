import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from '../../customers/entities';
import { Product } from '../../products/entities';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string; // Example: PENDING, COMPLETED, FAILED

  @Column()
  referenceId: string;

  @Column({ type: 'text', nullable: true })
  transactionPaymentId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

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
