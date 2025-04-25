"use server"
//src/app/api/action/pairing-actions.ts
import { revalidatePath } from "next/cache"
import { getParticipants } from "./participant-actions"
import { db } from "../../../server/db";
export async function getPairings(tournamentId: string) {
  return await db.pairing.findMany({
    where: { tournamentId },
    orderBy: { roundNumber: "asc" },
  })
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


export async function savePairings(tournamentId: string, newPairings: any[]) {
  const participants = await getParticipants(tournamentId)

  const formattedPairings = newPairings.map((pair) => {
    const white = participants.find((p) => p.id === pair.whiteId)
    const black = participants.find((p) => p.id === pair.blackId)

    return {
      tournamentId,
      roundNumber: pair.roundNumber,
      whiteId: pair.whiteId,
      blackId: pair.blackId,
      result: null,
      whiteName: white?.firstName || "",
      whiteSurname: white?.lastName || "",
      whiteRating: white?.rating || 0,
      blackName: black?.firstName || "",
      blackSurname: black?.lastName || "",
      blackRating: black?.rating || 0,
    }
  })

  await db.pairing.createMany({
    data: formattedPairings,
  })

  const tournaments = await import("./tournament-actions").then((m) => m.getTournaments())
  const tournament = tournaments.find((t) => t.id === tournamentId)
  if (tournament) {
    revalidatePath(`/${encodeURIComponent(tournament.name)}`)
  }

  return true
}
