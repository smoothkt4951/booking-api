import { Exclude } from "class-transformer";
import { RoomEntity } from "src/room/entity/room.entity";
import { UserEntity } from "src/user/user.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BookingEntity {
    
    @PrimaryGeneratedColumn('uuid')
    uuid : string;

    @Column({
      type:'text',
      nullable:true,
      default:null
    })
    booking_id:string

    @Column({type:"text",nullable:true})
    UserID:string
    @Exclude()
    @ManyToOne(type => UserEntity)
    @JoinColumn({ name: "UserID" })
    User: UserEntity;

    @Column({type:"text",nullable:true})
    RoomID : string;
    @Exclude()
    @ManyToOne(type=> RoomEntity)
    @JoinColumn({name:"RoomID"})
    Room : RoomEntity

    @Column({ type: 'timestamptz' })
    check_in_date : Date;

    @Column({ type: 'timestamptz' })
    check_out_date : Date;
    @CreateDateColumn({ type: 'timestamptz' })
    created_date : Date;

    @Column({type:'float',nullable:true})
    totalPrice :number 

    @BeforeInsert()
    async addBookingId(){
        this.booking_id= this.UserID+this.RoomID+this.check_in_date
    }
  }
