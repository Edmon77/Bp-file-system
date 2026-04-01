import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ValidationPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customerService: CustomersService) {}

  @Get() //   GET /customers?shelf=shelfNum
  retrieveShelf(@Query('shelfId') shelfId: string) {
    return this.customerService.retrieveShelf(shelfId);
  }

  @Get(':id') //   GET /customers/:id
  retrieveOne(@Param('id') id: string) {
    return this.customerService.retrieveOne(id);
  }

  @Post() //    POST /customers
  create(@Body(ValidationPipe) customer: CreateCustomerDto) {
    return this.customerService.create(customer);
  }

  @Patch(':id') //   PATCH /customers/:id
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updatedCustomer: UpdateCustomerDto,
  ) {
    return this.customerService.update(id, updatedCustomer);
  }

  @Delete(':id') //   DELETE /customers/:id
  delete(@Param('id') id: string) {
    return this.customerService.delete(id);
  }
}
