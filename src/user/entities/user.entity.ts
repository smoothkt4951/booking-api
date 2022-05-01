import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude, Transform, Type } from 'class-transformer';
import { BookingEntity } from 'src/booking/entities/booking.entity';
import { RoomEntity } from '../../room/entities/room.entity';

import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEnum,
  IsDate,
  MaxDate,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
    firstname?: string,
    lastname?: string,
    email?: string,
    password?: string,
  ) {
    this.firstname = firstname
    this.lastname = lastname
    this.email = email
    this.password = password
  }
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty(
    {
      type: String,
      description: 'uuid'
    }
  )
  id: string

  @OneToMany((type) => BookingEntity, (booking) => booking.User)
  @ApiProperty(
    {
      type: RoomEntity,
      description: 'RoomEntity'
    }
  )
  Room: RoomEntity[]

 

  @IsEmail({ message: `This is not an email` })
  @IsNotEmpty({ message: `Email can not empty` })
  @Column({ unique: true })
  @ApiProperty({
    type: String,
    description: 'email'
  })
  email: string

  @IsString()
  @MinLength(6, { message: `Password must be at least 6 characters` })
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  @Column()
  @Exclude()
  @ApiProperty({
    type: String,
    description: 'password'
  })
  password: string

  @IsEnum(['admin', 'user'])
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  @ApiProperty({
    enum: Role,
    description: 'role'
  })
  role: Role; // note here : conflict resolve see default role of User and Admin, set default to user , change if needed

  @IsString()
  @MinLength(2, { message: `Firstname must be at least 2 characters` })
  @MaxLength(20)
  @Column({
    type: 'text',
    nullable: true,
  })
  @ApiProperty({
    description: 'firstname'
  })
  firstname: string

  @IsString()
  @MinLength(2, { message: `Lastname must be at least 2 characters` })
  @MaxLength(20)
  @Column({
    type: 'text',
    nullable: true,
  })
  @ApiProperty({description: 'lastname'})
  lastname: string

  @IsEnum(['male', 'female', 'other'])
  @Column({
    enum: Gender,
    default: Gender.OTHER,
    nullable: true,
  })
  @ApiProperty({enum: Gender, description:' gender'}, )
  gender: Gender

  
  @MaxDate(new Date())
  @Type(() => Date)
  @IsDate()
  @Column({ type: 'date', nullable: true, default: null })
  @ApiProperty({

    description: 'User birthday',
    
  })
  dateOfBirth: string

  @Column({ nullable: true })
  @ApiProperty({description: `User's avatar by URL from Cloudinary`})
  avatarUrl: string

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8)
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password)
  }
}

export interface User {
  id?: string;
  email?: string;
}
