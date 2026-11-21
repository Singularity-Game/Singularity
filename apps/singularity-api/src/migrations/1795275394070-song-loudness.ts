import { MigrationInterface, QueryRunner } from "typeorm";

export class SongLoudness1795275394070 implements MigrationInterface {
    name = 'SongLoudness1795275394070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`song\` ADD \`lufs\` double NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`song\` ADD \`peakDb\` double NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`song\` DROP COLUMN \`peakDb\``);
        await queryRunner.query(`ALTER TABLE \`song\` DROP COLUMN \`lufs\``);
    }

}
