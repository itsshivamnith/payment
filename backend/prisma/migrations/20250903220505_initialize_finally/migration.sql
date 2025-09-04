-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('MERCHANT', 'ADMIN');

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'MERCHANT';

-- CreateTable
CREATE TABLE "public"."webhook_logs" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "webhook_logs_status_createdAt_idx" ON "public"."webhook_logs"("status", "createdAt");

-- CreateIndex
CREATE INDEX "payments_status_createdAt_idx" ON "public"."payments"("status", "createdAt");

-- CreateIndex
CREATE INDEX "transactions_status_createdAt_idx" ON "public"."transactions"("status", "createdAt");
