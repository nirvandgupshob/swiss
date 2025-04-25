"use server"
// app/api/action/tournament-actions.ts
import { revalidatePath } from "next/cache"
import { generatePairings } from "../../../lib/swiss-pairing"
import { db } from "../../../server/db";

// Mock data for demonstration purposes
// In a real application, this would be replaced with database calls

// let tournaments = [ 
//   {
//     id: "1",
//     name: "City Championship 2025",
//     rounds: 5,
//     currentRound: 2,
//     startDate: "2025-01-15T00:00:00.000Z",
//     status: "active",
//     participantsCount: 8,
//   },
//   {
//     id: "2",
//     name: "Junior Tournament",
//     rounds: 7,
//     currentRound: 0,
//     startDate: "2025-02-20T00:00:00.000Z",
//     status: "upcoming",
//     participantsCount: 0,
//   },
// ]

export async function getTournaments() {
  const tournaments = await db.tournament.findMany({
    orderBy: { startDate: "asc" },
    include: { players: true }, // если связь есть
  });
  return tournaments
}

export async function getTournamentByName(name: string) {
  try {
    const tournament = await db.tournament.findUnique({
      where: {
        name,
      },
      include: {
        players: true, // ВОЗМОЖНО НЕ НУЖНО
        pairings: true, // УБРАТЬ ПОТОМ
      },
    })

    return tournament
  } catch (error) {
    console.error("Error fetching tournament by name:", error)
    return null
  }
}

export async function createTournament({
  name,
  rounds,
  startDate,
}: {
  name: string;
  rounds: number;
  startDate: string;
}) {
  const tournament = await db.tournament.create({
    data: {
      name,
      rounds,
      startDate: new Date(startDate),
      currentRound: 0,
      status: "upcoming",
    },
  });

  revalidatePath("/");

  return tournament.id;
}

export async function generateNextRound(tournamentId: string) {
  try {
    // Find the tournament
    const tournament = tournaments.find((t) => t.id === tournamentId)
    if (!tournament) throw new Error("Tournament not found")

    // Get participants and current pairings
    const participants = await import("./participant-actions").then((module) =>
      module.getParticipants(tournamentId),
    )

    const pairings = await import("./pairing-actions").then((module) => module.getPairings(tournamentId))

    // Generate new pairings using Swiss system
    const nextRound = tournament.currentRound + 1
    const newPairings = generatePairings(participants, pairings, nextRound)

    // Save new pairings
    await import("./pairing-actions").then((module) => module.savePairings(tournamentId, newPairings))

    // Update tournament
    tournaments = tournaments.map((t) =>
      t.id === tournamentId
        ? {
            ...t,
            currentRound: nextRound,
            status: nextRound >= t.rounds ? "completed" : "active",
          }
        : t,
    )

    revalidatePath(`/${encodeURIComponent(tournament.name)}`)

    return true
  } catch (error) {
    console.error("Error generating next round:", error)
    return false
  }
}
