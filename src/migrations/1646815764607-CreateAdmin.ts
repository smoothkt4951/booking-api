import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcrypt';

export class CreateAdmin1646815764607 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {  
        const adminpassword = await bcrypt.hash('123456', 8)

        await queryRunner.query(
            `INSERT INTO user_entity (email, password, role) VALUES ('admin2@email.com', '${adminpassword}', 'admin')`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}
