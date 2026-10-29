-- CreateEnum
CREATE TYPE "vendor_stage" AS ENUM ('CONTRACT_SENT', 'CONTRACT_SIGNED', 'KYC_DOCS_RECEIVED', 'KYC_VERIFIED', 'ACTIVE');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "stage" "vendor_stage" NOT NULL DEFAULT 'CONTRACT_SENT',
    "stage_entered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coordinator_id" INTEGER NOT NULL,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_stage_history" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "changed_by" INTEGER NOT NULL,
    "previous_stage" "vendor_stage" NOT NULL,
    "new_stage" "vendor_stage" NOT NULL,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendor_stage_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "vendors_stage_idx" ON "vendors"("stage");

-- CreateIndex
CREATE INDEX "vendors_stage_entered_at_idx" ON "vendors"("stage_entered_at");

-- CreateIndex
CREATE INDEX "vendor_stage_history_vendor_id_changed_at_idx" ON "vendor_stage_history"("vendor_id", "changed_at" DESC);

-- CreateIndex
CREATE INDEX "vendor_stage_history_changed_by_idx" ON "vendor_stage_history"("changed_by");

-- AddForeignKey
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_coordinator_id_fkey" FOREIGN KEY ("coordinator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_stage_history" ADD CONSTRAINT "vendor_stage_history_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_stage_history" ADD CONSTRAINT "vendor_stage_history_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
