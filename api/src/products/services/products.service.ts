import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findById(id: number): Promise<Product> {
    return this.productRepository.findOneBy({ id });
  }

  async decrementStock(id: number): Promise<void> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product || product.stock <= 0) {
      throw new NotFoundException('Product not found or out of stock');
    }
    product.stock = product.stock - 1;
    await this.productRepository.save(product);
  }
}
