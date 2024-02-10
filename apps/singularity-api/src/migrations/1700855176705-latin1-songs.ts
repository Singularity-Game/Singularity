import { MigrationInterface, QueryRunner } from "typeorm";

export class utf8mb4Songs1700855176705 implements MigrationInterface {
    name = 'utf8mb4Songs1700855176705'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`song\` CHANGE \`name\` \`name\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_general_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`song\` CHANGE \`audioFileName\` \`audioFileName\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_general_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`song\` CHANGE \`videoFileName\` \`videoFileName\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_general_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`song\` CHANGE \`coverFileName\` \`coverFileName\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_general_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`song\` CHANGE \`artist\` \`artist\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_general_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`song_note\` CHANGE \`text\` \`text\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_general_ci" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE \`song_note\` CHANGE \`text\` \`text\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_general_ci" NULL`);
      await queryRunner.query(`ALTER TABLE \`song\` CHANGE \`artist\` \`artist\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_general_ci" NULL`);
      await queryRunner.query(`ALTER TABLE \`song\` CHANGE \`name\` \`name\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_general_ci" NULL`);
      await queryRunner.query(`ALTER TABLE \`song\` CHANGE \`audioFileName\` \`audioFileName\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_general_ci" NOT NULL`);
      await queryRunner.query(`ALTER TABLE \`song\` CHANGE \`videoFileName\` \`videoFileName\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_general_ci" NOT NULL`);
      await queryRunner.query(`ALTER TABLE \`song\` CHANGE \`coverFileName\` \`coverFileName\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_general_ci" NOT NULL`);
    }

}
