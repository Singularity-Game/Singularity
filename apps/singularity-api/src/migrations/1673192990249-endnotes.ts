import { MigrationInterface, QueryRunner } from "typeorm";

export class endnotes1673192990249 implements MigrationInterface {
    name = 'endnotes1673192990249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`song_note\` CHANGE \`type\` \`type\` enum ('0', '1', '2', '3', '4') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`song_note\` CHANGE \`type\` \`type\` enum ('0', '1', '2', '3') NOT NULL`);
    }

}
