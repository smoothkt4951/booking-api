import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { BookingEntity } from 'src/booking/entities/booking.entity';
import { RoomEntity } from 'src/room/entity/room.entity';

export enum Role {
  User = 'user',
  Admin = 'admin',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}
@Entity()
export class UserEntity {
  public constructor(
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(type=>BookingEntity,booking=>booking.User)
  Room: RoomEntity[];

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role; // note here : conflict resolve see default role of User and Admin, set default to user , change if needed 

  @Column({
    type: 'text',
    nullable: true,
  })
  firstname: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  lastname: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.OTHER,
  })
  gender: Gender;

  @Column({ type: 'date', nullable: true, default: null })
  dateOfBirth: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
