import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log(`Created a user with id ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`Removed a user with id ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated a user with id ${this.id}`);
  }
}
