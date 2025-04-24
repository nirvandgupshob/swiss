"use server"

import { revalidatePath } from "next/cache"

// Mock data for demonstration purposes
// In a real application, this would be replaced with database calls

let participants: {
  id: string
  tournamentId: string
  name: string
  surname: string
  rating: number
}[] = [
  {
    id: "p1",
    tournamentId: "1",
    name: "Magnus",
    surname: "Carlsen",
    rating: 2850,
  },
  {
    id: "p2",
    tournamentId: "1",
    name: "Fabiano",
    surname: "Caruana",
    rating: 2800,
  },
  {
    id: "p3",
    tournamentId: "1",
    name: "Ding",
    surname: "Liren",
    rating: 2780,
  },
  {
    id: "p4",
    tournamentId: "1",
    name: "Ian",
    surname: "Nepomniachtchi",
    rating: 2775,
  },
  {
    id: "p5",
    tournamentId: "1",
    name: "Hikaru",
    surname: "Nakamura",
    rating: 2770,
  },
  {
    id: "p6",
    tournamentId: "1",
    name: "Wesley",
    surname: "So",
    rating: 2760,
  },
  {
    id: "p7",
    tournamentId: "1",
    name: "Anish",
    surname: "Giri",
    rating: 2750,
  },
  {
    id: "p8",
    tournamentId: "1",
    name: "Alireza",
    surname: "Firouzja",
    rating: 2745,
  },
]

export async function getParticipants(tournamentId: string) {
  // In a real app, fetch from database
  return participants.filter((p) => p.tournamentId === tournamentId)
}

export async function addParticipant(
  tournamentId: string,
  { name, surname, rating }: { name: string; surname: string; rating: number },
) {
  // In a real app, save to database
  const newParticipant = {
    id: `p${Date.now()}`,
    tournamentId,
    name,
    surname,
    rating,
  }

  participants.push(newParticipant)

  // Update participant count in tournament
  const tournaments = await import("./tournament-actions").then((module) => module.getTournaments())

  const tournament = tournaments.find((t) => t.id === tournamentId)
  if (tournament) {
    tournament.participantsCount += 1
  }

  revalidatePath(`/${encodeURIComponent(tournament?.name || "")}`)

  return newParticipant
}

export async function removeParticipant(tournamentId: string, participantId: string) {
  // In a real app, delete from database
  const initialLength = participants.length
  participants = participants.filter((p) => !(p.tournamentId === tournamentId && p.id === participantId))

  if (participants.length < initialLength) {
    // Update participant count in tournament
    const tournaments = await import("./tournament-actions").then((module) => module.getTournaments())

    const tournament = tournaments.find((t) => t.id === tournamentId)
    if (tournament) {
      tournament.participantsCount -= 1
    }

    revalidatePath(`/${encodeURIComponent(tournament?.name || "")}`)
    return true
  }

  return false
}
