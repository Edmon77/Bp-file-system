import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async retrieveShelf(shelfId: string) {
    return this.databaseService.customer.findMany({
      where: {
        shelfId: shelfId,
      },
    });
  }

  async retrieveOne(id: string) {
    return this.databaseService.customer.findUnique({
      where: {
        customerId: id,
      },
    });
  }

  async create(customer: CreateCustomerDto) {
    try {
      return await this.databaseService.customer.create({
        data: customer,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('customer already exists');
      }

      throw error;
    }
  }

  async update(id: string, updatedCustomer: UpdateCustomerDto) {
    try {
      return await this.databaseService.customer.update({
        where: {
          customerId: id,
        },
        data: updatedCustomer,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new ConflictException("customer doesn't exist");
      }

      throw error;
    }
  }

  async delete(id: string) {
    try {
      return await this.databaseService.customer.delete({
        where: {
          customerId: id,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new ConflictException("customer doesn't exist");
      }

      throw error;
    }
  }
}
