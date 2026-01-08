-- AlterTable
ALTER TABLE "price_alerts" ADD COLUMN     "lastNotifiedAt" TIMESTAMP(3),
ADD COLUMN     "lastNotifiedPrice" DECIMAL(10,2);
