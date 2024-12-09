import { MigrationInterface, QueryRunner } from 'typeorm';

export class user1733779428021 implements MigrationInterface {
  name = 'users1733779428021';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL PRIMARY KEY, "user_name" character varying NOT NULL, "password" character varying NOT NULL, "avatar" character varying NULL, "nickname" character varying NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT NOW(), "updated_at" TIMESTAMP NOT NULL DEFAULT NOW())`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
