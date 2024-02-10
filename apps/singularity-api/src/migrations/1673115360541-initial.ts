import { MigrationInterface, QueryRunner } from "typeorm";

export class initial1673115360541 implements MigrationInterface {
    name = 'initial1673115360541'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`song\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`artist\` varchar(255) NOT NULL, \`year\` int NOT NULL, \`bpm\` double NOT NULL, \`gap\` int NOT NULL, \`start\` double NOT NULL, \`end\` double NOT NULL, \`audioFileName\` varchar(255) NOT NULL, \`videoFileName\` varchar(255) NOT NULL, \`coverFileName\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`song_note\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('0', '1', '2', '3') NOT NULL, \`startBeat\` int NOT NULL, \`lengthInBeats\` int NOT NULL, \`pitch\` int NOT NULL, \`text\` varchar(255) NOT NULL, \`songId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`song_note\` ADD CONSTRAINT \`FK_fa4f3dac75cba74e5c9cc705d99\` FOREIGN KEY (\`songId\`) REFERENCES \`song\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`song_note\` DROP FOREIGN KEY \`FK_fa4f3dac75cba74e5c9cc705d99\``);
        await queryRunner.query(`DROP TABLE \`song_note\``);
        await queryRunner.query(`DROP TABLE \`song\``);
    }

}
