import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { Product } from '../entities';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':productId')
  findById(@Param('productId', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.findById(id);
  }
}
