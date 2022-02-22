import { ApiProperty } from "@nestjs/swagger";
import { EntityRepository, Repository } from "typeorm";
import { Booking } from "./entities/booking.entity";




@EntityRepository(Booking)
export class BookingRepository extends Repository<Booking> {



}