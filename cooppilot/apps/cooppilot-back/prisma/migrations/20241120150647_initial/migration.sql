-- CreateTable
CREATE TABLE "UserChatHistoryCleanup" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "lastCleanup" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserChatHistoryCleanup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserChatHistoryCleanup_userId_key" ON "UserChatHistoryCleanup"("userId");
