import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeDeleteSongs1700919270604 implements MigrationInterface {
    name = 'CascadeDeleteSongs1700919270604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`song_note\` DROP FOREIGN KEY \`FK_fa4f3dac75cba74e5c9cc705d99\``);
        await queryRunner.query(`ALTER TABLE \`song_note\` ADD CONSTRAINT \`FK_fa4f3dac75cba74e5c9cc705d99\` FOREIGN KEY (\`songId\`) REFERENCES \`song\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`song_note\` DROP FOREIGN KEY \`FK_fa4f3dac75cba74e5c9cc705d99\``);
        await queryRunner.query(`ALTER TABLE \`song_note\` ADD CONSTRAINT \`FK_fa4f3dac75cba74e5c9cc705d99\` FOREIGN KEY (\`songId\`) REFERENCES \`song\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
