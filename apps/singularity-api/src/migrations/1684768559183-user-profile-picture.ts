import { MigrationInterface, QueryRunner } from "typeorm";

export class UserProfilePicture1684768559183 implements MigrationInterface {
    name = 'UserProfilePicture1684768559183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`mail_template\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('CreatePassword') NOT NULL, \`subject\` varchar(255) NOT NULL, \`textTemplate\` varchar(255) NOT NULL, \`htmlTemplate\` varchar(255) NULL, UNIQUE INDEX \`IDX_e9296bc9c66b2b4d72bacc5d89\` (\`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`profilePictureBase64\` varchar(255)`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`profilePictureBase64\``);
        await queryRunner.query(`DROP INDEX \`IDX_e9296bc9c66b2b4d72bacc5d89\` ON \`mail_template\``);
        await queryRunner.query(`DROP TABLE \`mail_template\``);
    }

}
