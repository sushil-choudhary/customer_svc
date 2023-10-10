import { Exclude } from 'class-transformer';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Customers extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  public email!: string;

  @Column()
  public mobile!: string;

  @Column({ type: 'varchar' })
  public firstName!: string;

  @Column({ type: 'varchar' })
  public middleName!: string;

  @Column({ type: 'varchar' })
  public lastName!: string;

  @Column({ type: 'varchar' })
  public gender!: string;

  @Exclude()
  @Column({ type: 'varchar' })
  public password!: string;
}
