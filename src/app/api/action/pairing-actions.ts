"use server"

import { revalidatePath } from "next/cache"

// Mock data for demonstration purposes
// In a real application, this would be replaced with database calls

let pairings: {
  id: string
  tournamentId: string
  roundNumber: number
  whiteId: string
  whiteName: string
  whiteSurname: string
  whiteRating: number
  blackId: string
  blackName: string
  blackSurname: string
  blackRating: number
  result: "1-0" | "0-1" | "½-½" | null
}[] = [
  {
    id: "pair1",
    tournamentId: "1",
    roundNumber: 1,
    whiteId: "p1",
    whiteName: "Magnus",
    whiteSurname: "Carlsen",
    whiteRating: 2850,
    blackId: "p8",
    blackName: "Alireza",
    blackSurname: "Firouzja",
    blackRating: 2745,
    result: "1-0",
  },
  {
    id: "pair2",
    tournamentId: "1",
    roundNumber: 1,
    whiteId: "p2",
    whiteName: "Fabiano",
    whiteSurname: "Caruana",
    whiteRating: 2800,
    blackId: "p7",
    blackName: "Anish",
    blackSurname: "Giri",
    blackRating: 2750,
    result: "½-½",
  },
  {
    id: "pair3",
    tournamentId: "1",
    roundNumber: 1,
    whiteId: "p3",
    whiteName: "Ding",
    whiteSurname: "Liren",
    whiteRating: 2780,
    blackId: "p6",
    blackName: "Wesley",
    blackSurname: "So",
    blackRating: 2760,
    result: "0-1",
  },
  {
    id: "pair4",
    tournamentId: "1",
    roundNumber: 1,
    whiteId: "p4",
    whiteName: "Ian",
    whiteSurname: "Nepomniachtchi",
    whiteRating: 2775,
    blackId: "p5",
    blackName: "Hikaru",
    blackSurname: "Nakamura",
    blackRating: 2770,
    result: "1-0",
  },
  {
    id: "pair5",
    tournamentId: "1",
    roundNumber: 2,
    whiteId: "p1",
    whiteName: "Magnus",
    whiteSurname: "Carlsen",
    whiteRating: 2850,
    blackId: "p4",
    blackName: "Ian",
    blackSurname: "Nepomniachtchi",
    blackRating: 2775,
    result: null,
  },
  {
    id: "pair6",
    tournamentId: "1",
    roundNumber: 2,
    whiteId: "p6",
    whiteName: "Wesley",
    whiteSurname: "So",
    whiteRating: 2760,
    blackId: "p2",
    blackName: "Fabiano",
    blackSurname: "Caruana",
    blackRating: 2800,
    result: null,
  },
  {
    id: "pair7",
    tournamentId: "1",
    roundNumber: 2,
    whiteId: "p5",
    whiteName: "Hikaru",
    whiteSurname: "Nakamura",
    whiteRating: 2760,
    blackId: "p7",
    blackName: "Anish",
    blackSurname: "Giri",
    blackRating: 2750,
    result: null,
  },
  {
    id: "pair8",
    tournamentId: "1",
    roundNumber: 2,
    whiteId: "p8",
    whiteName: "Alireza",
    whiteSurname: "Firouzja",
    whiteRating: 2745,
    blackId: "p3",
    blackName: "Ding",
    blackSurname: "Liren",
    blackRating: 2780,
    result: null,
  },
]

export async function getPairings(tournamentId: string) {
  // In a real app, fetch from database
  return pairings.filter((p) => p.tournamentId === tournamentId)
}

export async function updateResult(tournamentId: string, pairingId: string, result: "1-0" | "0-1" | "½-½") {
  // In a real app, update in database
  pairings = pairings.map((p) => (p.id === pairingId && p.tournamentId === tournamentId ? { ...p, result } : p))

  // Get tournament to revalidate path
  const tournaments = await import("./tournament-actions").then((module) => module.getTournaments())

  const tournament = tournaments.find((t) => t.id === tournamentId)
  if (tournament) {
    revalidatePath(`/${encodeURIComponent(tournament.name)}`)
  }

  return true
}

export async function savePairings(tournamentId: string, newPairings: any[]) {
  // In a real app, save to database
  const participants = await import("./participant-actions").then((module) =>
    module.getParticipants(tournamentId),
  )

  const formattedPairings = newPairings.map((pair) => {
    const white = participants.find((p) => p.id === pair.whiteId)
    const black = participants.find((p) => p.id === pair.blackId)

    return {
      id: `pair${Date.now()}-${pair.whiteId}-${pair.blackId}`,
      tournamentId,
      roundNumber: pair.roundNumber,
      whiteId: pair.whiteId,
      whiteName: white?.name || "",
      whiteSurname: white?.surname || "",
      whiteRating: white?.rating || 0,
      blackId: pair.blackId,
      blackName: black?.name || "",
      blackSurname: black?.surname || "",
      blackRating: black?.rating || 0,
      result: null,
    }
  })

  pairings = [...pairings, ...formattedPairings]

  // Get tournament to revalidate path
  const tournaments = await import("./tournament-actions").then((module) => module.getTournaments())

  const tournament = tournaments.find((t) => t.id === tournamentId)
  if (tournament) {
    revalidatePath(`/${encodeURIComponent(tournament.name)}`)
  }

  return true
}
