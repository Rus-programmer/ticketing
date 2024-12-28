import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
    update: false,
  })
  stripeId: string;

  @Column({
    type: 'int',
    nullable: false,
    update: false,
  })
  orderId: number;
}
