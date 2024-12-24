import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1735020766634 implements MigrationInterface {
    name = 'Init1735020766634'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customers" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "address" character varying NOT NULL, CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text NOT NULL, "price" integer NOT NULL, "stock" integer NOT NULL, "imageUrl" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "referenceId" character varying NOT NULL, "transactionPaymentId" text, "totalAmount" numeric(10,2) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "customerId" integer, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction_products" ("transaction_id" integer NOT NULL, "product_id" integer NOT NULL, CONSTRAINT "PK_c73b6a09595a0910ef19bcaf280" PRIMARY KEY ("transaction_id", "product_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b22f13085f3a484980b687df10" ON "transaction_products" ("transaction_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_f95f27599ad766df9709876ef1" ON "transaction_products" ("product_id") `);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_52a272e6c6a006922bc80d7e197" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_products" ADD CONSTRAINT "FK_b22f13085f3a484980b687df106" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "transaction_products" ADD CONSTRAINT "FK_f95f27599ad766df9709876ef19" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_products" DROP CONSTRAINT "FK_f95f27599ad766df9709876ef19"`);
        await queryRunner.query(`ALTER TABLE "transaction_products" DROP CONSTRAINT "FK_b22f13085f3a484980b687df106"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_52a272e6c6a006922bc80d7e197"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f95f27599ad766df9709876ef1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b22f13085f3a484980b687df10"`);
        await queryRunner.query(`DROP TABLE "transaction_products"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "customers"`);
    }

}
