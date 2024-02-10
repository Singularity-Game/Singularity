import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePasswordToken1684772705026 implements MigrationInterface {
    name = 'CreatePasswordToken1684772705026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`create_password_token_entity\` (\`id\` varchar(36) NOT NULL, \`token\` varchar(255) NOT NULL, \`validUntil\` date NOT NULL, \`userId\` varchar(36) NULL, UNIQUE INDEX \`IDX_e6aefc0b8af2cd40b28cb20cc0\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` ADD CONSTRAINT \`FK_b6aaecfdd660b36e2637061b8e1\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` DROP FOREIGN KEY \`FK_b6aaecfdd660b36e2637061b8e1\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`DROP INDEX \`IDX_e6aefc0b8af2cd40b28cb20cc0\` ON \`create_password_token_entity\``);
        await queryRunner.query(`DROP TABLE \`create_password_token_entity\``);
    }

}
