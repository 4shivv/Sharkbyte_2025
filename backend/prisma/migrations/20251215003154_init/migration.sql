-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "agent_name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "description" TEXT,
    "system_prompt" TEXT,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scan" (
    "id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "security_score" INTEGER,
    "vulnerabilities" JSONB,
    "attack_simulations" JSONB,
    "remediation_steps" JSONB,
    "error_message" TEXT,
    "prompt_snapshot" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Agent_user_id_idx" ON "Agent"("user_id");

-- CreateIndex
CREATE INDEX "Scan_agent_id_idx" ON "Scan"("agent_id");

-- CreateIndex
CREATE INDEX "Scan_status_idx" ON "Scan"("status");

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
