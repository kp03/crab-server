import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // - 3
  @ApiOperation({summary : "send customer request"})
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @ApiOperation({summary : "get all driver"})
  @Get('driver')
  getAllDriver() {
    return this.customerService.getAllDriver();
  }

  @ApiOperation({summary : "send customer request (test)"})
  @Post('test')
  createTest(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.createTest(createCustomerDto);
  }


}
