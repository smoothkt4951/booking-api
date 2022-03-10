import { Exclude } from 'class-transformer'
import { RoomEntity } from '../../room/entities/room.entity'
import { UserEntity } from '../../user/entities/user.entity'
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Exclusion,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Exclusion(
  `USING gist ("RoomID" WITH =, tstzrange("check_in_date", "check_out_date") WITH &&)`,
)
@Entity()
export class BookingEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  booking_id: string

  @Column({ type: 'text', nullable: false })
  UserID: string
  @Exclude()
  @ManyToOne((type) => UserEntity, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'UserID' })
  User: UserEntity

  @Column({ type: 'text', nullable: false })
  RoomID: string
  @Exclude()
  @ManyToOne((type) => RoomEntity ,{onDelete: 'CASCADE'}) 
  @JoinColumn({ name: 'RoomID', })
  Room: RoomEntity

  @Column({ type: 'timestamptz' ,nullable:false})
  check_in_date: Date

  @Column({ type: 'timestamptz' ,nullable:false}) //check out date and check in date can be swapped to tsrange type
  check_out_date: Date
  @CreateDateColumn({ type: 'timestamptz' })
  created_date: Date

  @Column({ type: 'float', nullable: true })
  totalPrice: number

  @BeforeInsert()
  async addBookingId() {
    this.booking_id = this.UserID + this.RoomID + this.check_in_date
  }

  @BeforeUpdate()
  async changeBookingId() {
    this.booking_id = this.UserID + this.RoomID + this.check_in_date
  }
}
