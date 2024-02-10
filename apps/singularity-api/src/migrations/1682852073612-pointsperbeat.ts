import { MigrationInterface, QueryRunner } from "typeorm";

export class pointsperbeat1682852073612 implements MigrationInterface {
    name = 'pointsperbeat1682852073612'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`song\` ADD \`pointsPerBeat\` double NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`song\` DROP COLUMN \`pointsPerBeat\``);
    }

}
