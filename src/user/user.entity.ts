import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

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
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.Admin,
    })
    role: Role;

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

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 8);
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}
