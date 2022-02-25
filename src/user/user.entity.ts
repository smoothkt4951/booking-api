import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

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

  @IsEmail({ message: `This is not an email` })
  @IsNotEmpty({ message: `Email can not empty` })
  @Column({ unique: true })
  email: string;

  @IsString()
  @MinLength(6, { message: `Password must be at least 6 characters` })
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  @Column()
  @Exclude()
  password: string;

<<<<<<< HEAD
    @Column({
        type: 'enum',
        enum: Role,
        default: Role.Admin,
    })
    role: Role;
=======
  @IsEnum(['admin', 'user'])
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Admin,
  })
  role: Role;
>>>>>>> dev

  @IsString()
  @MinLength(2, { message: `Firstname must be at least 2 characters` })
  @MaxLength(20)
  @Column({
    type: 'text',
    nullable: true,
  })
  firstname: string;

  @IsString()
  @MinLength(2, { message: `Lastname must be at least 2 characters` })
  @MaxLength(20)
  @Column({
    type: 'text',
    nullable: true,
  })
  lastname: string;

  @IsEnum(['male', 'female', 'other'])
  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.OTHER,
  })
  gender: Gender;

  @IsDate()
  @MaxDate(new Date())
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
