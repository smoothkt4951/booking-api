import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

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
  // uuid
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // email
  @Column({ unique: true })
  email: string;

  // password
  @Column()
  @Exclude()
  password: string;

  // userRole
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  // firstname
  @Column({
    type: 'text',
    nullable: true,
  })
  firstname: string;

  // lastname
  @Column({
    type: 'text',
    nullable: true,
  })
  lastname: string;

  // gender
  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.OTHER,
  })
  gender: Gender;

  // birthday
  @Column({ type: 'date', nullable: true, default: null })
  dateOfBirth: string;

  // avatar
  @Column({ nullable: true })
  avatarUrl: string;

  // @Column({ nullable: true })
  // avatar: string[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
