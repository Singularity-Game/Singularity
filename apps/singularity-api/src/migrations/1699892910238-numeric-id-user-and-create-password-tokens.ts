import { MigrationInterface, QueryRunner } from "typeorm";

export class NumericIdUserAndCreatePasswordTokens1699892910238 implements MigrationInterface {
    name = 'NumericIdUserAndCreatePasswordTokens1699892910238'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` DROP FOREIGN KEY \`FK_b6aaecfdd660b36e2637061b8e1\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` ADD \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` ADD CONSTRAINT \`FK_b6aaecfdd660b36e2637061b8e1\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` DROP FOREIGN KEY \`FK_b6aaecfdd660b36e2637061b8e1\``);
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` ADD \`userId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` ADD CONSTRAINT \`FK_b6aaecfdd660b36e2637061b8e1\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
