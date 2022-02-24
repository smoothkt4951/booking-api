import { Column, CreateDateColumn, Entity, EntityRepository, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CreateBookingDtoRequest } from "../dto/create-booking.dto";
import { UpdateBookingDtoRequest } from "../dto/update-booking.dto";
@Entity()
export class BookingEntity {
    
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({
      type:'text',
      nullable:true,
      default:null
    })
    booking_id:string

    // @ManyToOne(type => User, { primary: true }) foreign keys , awaiting merging
    // @JoinColumn({ name: "user_id" })
    //   user_id: User;
    @Column({
      type:"text", 
      primary: true,
    })
    user_id:string

    // @OneToOne(type => Room, { primary: true }) foreign keys
    // @JoinColumn({ name: "room_id" })
    //   room_id:Room;
    @Column({
      type:"text", 
      primary: true,
    })
    room_id:string 

    @Column({ type: 'timestamptz' })
    check_in_date : Date;

    @Column({ type: 'timestamptz' })
    check_out_date : Date;
    @CreateDateColumn({ type: 'timestamptz' })
    created_date : Date;

    @Column({type:'float',nullable:true})
    totalPrice :number 

    days:number
  }
