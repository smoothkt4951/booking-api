import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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

export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}
@Entity()
export class UserEntity {
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
  password: string;

  @IsEnum(['admin', 'client'])
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

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
  @Column({ type: 'date', nullable: true })
  dayOfBirth: string;
}
