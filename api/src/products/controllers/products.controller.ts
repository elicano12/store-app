import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { ProductsService } from '../services/products.service';
import { Product } from '../entities';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }
  @Get(':productId')
  @ApiOperation({ summary: 'Get a product by ID' })
  findById(@Param('productId', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.findById(id);
  }
}
