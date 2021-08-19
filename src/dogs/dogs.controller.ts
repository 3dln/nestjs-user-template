import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { DogsService } from './dogs.service';
import { CreateDogDto } from './dto/create-dog.dto';
import { IDog } from './interfaces/dog.interface';

@Controller('dogs')
export class DogsController {
  constructor(private dogsService: DogsService) {}

  @Post()
  async create(@Body() createDogDto: CreateDogDto) {
    this.dogsService.create(createDogDto);
  }

  @Get()
  async findAllDogs(): Promise<IDog[]> {
    return this.dogsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dogsService.findOne(id);
  }
}
