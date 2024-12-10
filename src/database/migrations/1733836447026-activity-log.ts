import { MigrationInterface, QueryRunner } from 'typeorm';

export class activityLogs1733836447026 implements MigrationInterface {
  name = 'activityLogs1733836447026';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "activity_logs" ("id" SERIAL PRIMARY KEY, "user_name" character varying NOT NULL, "method" character varying NOT NULL, "url" character varying NOT NULL, "code" character varying NOT NULL, "status" INT NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT NOW())`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "activity_logs"`);
  }
}
