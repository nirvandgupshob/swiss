"use server"
//src/app/api/action/pairing-actions.ts
import { revalidatePath } from "next/cache"
import { db } from "../../../server/db";

export async function getPairings(tournamentId: string) {
  return await db.pairing.findMany({
    where: { tournamentId },
    orderBy: { roundNumber: "asc" },
    include: {
      white: true, 
      black: true,  
    },
  });
}

export async function updateResult(
  tournamentId: string,
  pairingId: string,
  result: "1-0" | "0-1" | "½-½"
) {
  await db.pairing.update({
    where: { id: pairingId },
    data: { result },
  })

  const tournaments = await import("./tournament-actions").then((m) => m.getTournaments())
  const tournament = tournaments.find((t) => t.id === tournamentId)
  if (tournament) {
    revalidatePath(`/${encodeURIComponent(tournament.name)}`)
  }

  return true
}

