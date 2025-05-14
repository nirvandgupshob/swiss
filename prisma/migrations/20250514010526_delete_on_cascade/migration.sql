-- DropForeignKey
ALTER TABLE "Pairing" DROP CONSTRAINT "Pairing_blackId_fkey";

-- DropForeignKey
ALTER TABLE "Pairing" DROP CONSTRAINT "Pairing_whiteId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_tournamentId_fkey";

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pairing" ADD CONSTRAINT "Pairing_whiteId_fkey" FOREIGN KEY ("whiteId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pairing" ADD CONSTRAINT "Pairing_blackId_fkey" FOREIGN KEY ("blackId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
