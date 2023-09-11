import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Search Address')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  // - 0
  @ApiOperation({ summary: 'Check elasticsearch connect' })
  @Get()
  checkConnection() {
    return this.locationService.checkConnection();
  }

  @ApiOperation({ summary: 'add a address to history' })
  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @ApiOperation({ summary: 'get all address from history' })
  @Get('all')
  findAll() {
    return this.locationService.findAll();
  }

  @ApiOperation({ summary: 'search address from history' })
  @Get('search')
  findOne(@Query('address') address: string) {
    return this.locationService.find(address);
  }

  @ApiOperation({ summary: 'search address by place id from history' })
  @Get('search/:id')
  findOneByPlaceId(@Param('id') id: string) {
    return this.locationService.findByPlaceId(id);
  }

  // @ApiOperation({ summary: 'search address by id from history' })
  // @Get('search-id/:id')
  // findOneById(@Param('id') id: string) {
  //   return this.locationService.findById(id);
  // }

  // - 2 
  @ApiOperation({ summary: 'search address from google api' })
  @Get('search-api')
  findOneByAPI(@Query('address') address: string) {
    return this.locationService.findFromService(address);
  }

  // - TEST

  @ApiOperation({ summary: 'get all address from history (test)' })
  @Get('all/test')
  findAllTest() {
    return this.locationService.findAllTest();
  }

  @ApiQuery({
    name : 'address',
    required : true,
    example : 'nguyen van cu'
  })
  @ApiOperation({ summary: 'search address from history (test)' })
  @Get('search/test')
  findOneTest(@Query('address') address: string) {
    return this.locationService.findTest(address);
  }

  @ApiQuery({
    name : 'address',
    required : true,
    example : '227 Nguyễn Văn Cừ'
  })
  @ApiOperation({ summary: 'search address from google api (test)' })
  @Get('search-api/test')
  findOneByAPITest(@Query('address') address: string) {
    return this.locationService.findFromServiceTest(address);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationService.update(id, updateLocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationService.remove(id);
  }

  // - 1
  @Get('index')
  createIndex() {
    return this.locationService.createIndex();
  }
}
