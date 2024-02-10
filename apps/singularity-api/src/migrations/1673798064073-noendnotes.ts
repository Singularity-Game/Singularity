import { MigrationInterface, QueryRunner } from "typeorm";

export class noendnotes1673798064073 implements MigrationInterface {
    name = 'noendnotes1673798064073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`song_note\` CHANGE \`type\` \`type\` enum ('0', '1', '2', '3') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`song_note\` CHANGE \`type\` \`type\` enum ('0', '1', '2', '3', '4') NOT NULL`);
    }

}
