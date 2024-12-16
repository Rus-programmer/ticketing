import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'tickets',
})
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 500,
    type: 'varchar',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  price: number;

  @Column({
    type: 'int',
    nullable: false,
    unique: true,
    update: false,
  })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
