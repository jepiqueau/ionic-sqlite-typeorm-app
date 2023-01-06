import {MigrationInterface, QueryRunner} from "typeorm";

export class InitializeAuthorPost1671880018001 implements MigrationInterface {
    name: string = "InitializeAuthorPost1671880018001";

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        CREATE TABLE "author" (
          "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          "name" varchar NOT NULL,
          "birthday" varchar,
          "email" varchar NOT NULL,
          CONSTRAINT "UQ_384deada87eb62ab31c5d5afae5" UNIQUE ("email")
        )
      `);
      await queryRunner.query(`
        CREATE TABLE "category" (
          "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          "name" varchar NOT NULL,
          CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name")
        )
      `);
      await queryRunner.query(`
        CREATE TABLE "post" (
          "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          "title" varchar NOT NULL,
          "text" text NOT NULL,
          "authorId" integer,
          CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "author" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )
      `);
      await queryRunner.query(`
        CREATE TABLE "post_categories_category" (
          "postId" integer NOT NULL,
          "categoryId" integer NOT NULL,
          CONSTRAINT "FK_93b566d522b73cb8bc46f7405bd" FOREIGN KEY ("postId") REFERENCES "post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT "FK_a5e63f80ca58e7296d5864bd2d3" FOREIGN KEY ("categoryId") REFERENCES "category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
          PRIMARY KEY ("postId", "categoryId")
        )
      `);
      await queryRunner.query(`
        CREATE INDEX "IDX_93b566d522b73cb8bc46f7405b" ON "post_categories_category" ("postId")
      `);
      await queryRunner.query(`
        CREATE INDEX "IDX_a5e63f80ca58e7296d5864bd2d" ON "post_categories_category" ("categoryId")
      `);
      await queryRunner.query(`
        CREATE INDEX "IDX_e5c653ec0d5e4a31861258e251" ON "author" ("email")
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        DROP TABLE "posts";
      `);
      await queryRunner.query(`
        DROP TABLE "post_categories_category";
      `);
      await queryRunner.query(`
        DROP TABLE "author";
      `);
      await queryRunner.query(`
        DROP TABLE "category";
      `);
      await queryRunner.query(`
        DROP INDEX "IDX_93b566d522b73cb8bc46f7405b";
      `);
      await queryRunner.query(`
        DROP INDEX "IDX_a5e63f80ca58e7296d5864bd2d";
      `);
      await queryRunner.query(`
        DROP INDEX "IDX_e5c653ec0d5e4a31861258e251";
      `);
    }

}
