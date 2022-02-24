import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum RoomSize {
  SINGLE = 'single',
  DOUBLE = 'double',
  DORMITORY = 'dormitory',
}

@Entity()
export class RoomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  codeName: string;
  @Column('boolean', { default: true })
  isVacant: boolean;
  @Column({
    type: 'enum',
    enum: RoomSize,
    default: RoomSize.SINGLE,
  })
  size: RoomSize;
  @Column('float', { default: 0 })
  price: number;
  @Column('simple-array', { nullable: true })
  images?: string[];
}
