import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    nullable: false,
    update: false,
  })
  stripeId: number;

  @Column({
    type: 'int',
    nullable: false,
    update: false,
  })
  orderId: number;
}
