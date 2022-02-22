import { Column, Entity, EntityRepository, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BookingRepository } from "../booking.repository";




@Entity()
// - id
// - booking_id (transaction_token)
// - room_id
// - user_id
// - check_in_date
// - check_out_date
// - created_at
// - Total Price
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    private id : string;

    // @ManyToOne(type => User, { primary: true }) foreign keys , awaiting merging
    // @JoinColumn({ name: "userID" })
    // private user_id: User;

    // @OneToOne(type => Room, { primary: true }) foreign keys
    // @JoinColumn({ name: "roomID" })
    // private room_id:Room;

    @Column({ type: 'date' })
    private check_in_date : string;

    @Column({ type: 'date' })
    private check_out_date : string;

    @Column({ type: 'date' })
    private created_date : string;

    @Column()
    private totalPrice :number //float, currency issue ?
}
