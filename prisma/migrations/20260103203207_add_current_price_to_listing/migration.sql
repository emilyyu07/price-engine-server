/*
  Warnings:

  - Added the required column `currentPrice` to the `product_listings` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "products_category_idx";

-- AlterTable
ALTER TABLE "product_listings" ADD COLUMN     "currentPrice" DECIMAL(10,2) NOT NULL;

-- CreateIndex
CREATE INDEX "products_category_title_idx" ON "products"("category", "title");
