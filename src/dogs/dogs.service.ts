import { Injectable } from '@nestjs/common';
import { IDog } from './interfaces/dog.interface';

@Injectable()
export class DogsService {
  private readonly dogs: IDog[] = [{ name: 'Edgar', breed: 'Sharpei', age: 9 }];

  create(dog: IDog) {
    this.dogs.push(dog);
  }

  findAll(): IDog[] {
    return this.dogs;
  }

  findOne(id: number): IDog {
    return this.dogs[id];
  }
}
