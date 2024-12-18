import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    type: 'varchar',
    nullable: false,
  })
  username: string;

  @Column({
    length: 100,
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    length: 150,
    type: 'varchar',
    nullable: false,
  })
  @Exclude()
  password?: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
