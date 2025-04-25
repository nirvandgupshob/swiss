"use server"
//src/app/api/action/participant-actions.ts
import { revalidatePath } from "next/cache"
import { db } from "../../../server/db";

export async function getParticipants(tournamentId: string) {
  const players = await db.player.findMany({
    where: { tournamentId },
    orderBy: { rating: "desc" },
  })

  return players
}
export async function addParticipant(
  tournamentId: string,
  { firstName, lastName, rating }: { firstName: string; lastName: string; rating: number },
) {
  const newParticipant = await db.player.create({
    data: {
      tournamentId,
      firstName: firstName,
      lastName: lastName,
      rating,
    },
  })

  const tournament = await db.tournament.findUnique({
    where: { id: tournamentId },
  })

  revalidatePath(`/${encodeURIComponent(tournament?.name || "")}`)

  return newParticipant
}

export async function removeParticipant(tournamentId: string, participantId: string) {
  const participant = await db.player.findUnique({
    where: { id: participantId },
  })

  if (!participant || participant.tournamentId !== tournamentId) return false

  await db.player.delete({
    where: { id: participantId },
  })

  const tournament = await db.tournament.findUnique({
    where: { id: tournamentId },
  })

  revalidatePath(`/${encodeURIComponent(tournament?.name || "")}`)
  return true
}
