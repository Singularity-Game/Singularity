import { MigrationInterface, QueryRunner } from "typeorm";

export class ResetPasswordMails1684848770165 implements MigrationInterface {
    name = 'ResetPasswordMails1684848770165'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` DROP FOREIGN KEY \`FK_b6aaecfdd660b36e2637061b8e1\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`mail_template\` CHANGE \`type\` \`type\` enum ('CreatePassword', 'ResetPassword') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` ADD CONSTRAINT \`FK_b6aaecfdd660b36e2637061b8e1\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` DROP FOREIGN KEY \`FK_b6aaecfdd660b36e2637061b8e1\``);
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`mail_template\` CHANGE \`type\` \`type\` enum ('CreatePassword') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`create_password_token_entity\` ADD CONSTRAINT \`FK_b6aaecfdd660b36e2637061b8e1\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
