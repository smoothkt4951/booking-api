import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
    ADMIN = "admin",
    CLIENT = "client",
}

export enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}
@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
        id: string;

    @Column()
        email: string;

    @Column()
        password: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.CLIENT
    })
        role: UserRole;

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

    @Column(
        {
            type: "enum",
            enum: Gender,
            default: Gender.OTHER
        }
    )
        gender: Gender;

    @Column({ type: 'date', nullable: true })
        birthday: string;

   

}
