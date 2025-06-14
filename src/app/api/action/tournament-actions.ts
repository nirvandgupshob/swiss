"use server"
// app/api/action/tournament-actions.ts
import { revalidatePath } from "next/cache.js"
import { generatePairings } from "./swiss-pairing"
import { db } from "../../../server/db";


export async function getTournaments() {
  const tournaments = await db.tournament.findMany({
    orderBy: { startDate: "asc" },
  });
  return tournaments
}
export async function getTournamentsForUser(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { firstname: true, surname: true },
  })
  console.log("Имя и фамилия:", user?.firstname, user?.surname);
  if (!user || !user.firstname || !user.surname) {
    return [] 
  }

  const players = await db.player.findMany({
    where: {
      firstName: user.firstname,
      lastName: user.surname,
    },
    select: {
      tournamentId: true,
    },
  })

  const tournamentIds = players.map(p => p.tournamentId)

  if (tournamentIds.length === 0) return []

  // 2. Найдём турниры по ID
  const tournaments = await db.tournament.findMany({
    where: {
      id: {
        in: tournamentIds,
      },
    },
    orderBy: {
      startDate: "asc",
    },
  })

  return tournaments
}

export async function getTournamentByName(name: string) {
  try {
    const tournament = await db.tournament.findUnique({
      where: {
        name,
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

export async function deleteTournament(tournamentId: string) {
  await db.tournament.delete({
    where: { id: tournamentId },
  })
}

export async function generateNextRound(tournamentId: string) {
  try {
    // Получаем турнир из базы
    const tournament = await db.tournament.findUnique({
      where: { id: tournamentId },
    })

    if (!tournament) throw new Error("Tournament not found")

    const nextRound = tournament.currentRound + 1

    // Получаем всех игроков турнира
    const players = await db.player.findMany({
      where: { tournamentId },
      orderBy: { rating: "desc" }, // сортировка по рейтингу (можно убрать)
    })

    // Получаем все сыгранные пары
    const pastPairings = await db.pairing.findMany({
      where: { tournamentId },
    })

    // Генерация новых пар по Швейцарской системе
    const newPairings = generatePairings(players, pastPairings, nextRound)

    // Сохраняем новые пары в базу
    await db.pairing.createMany({
      data: newPairings.map((pair) => ({
        roundNumber: pair.roundNumber,
        whiteId: pair.whiteId,
        blackId: pair.blackId ?? null,
        result: null,
        tournamentId,
      })),
    })

    // Обновляем турнир: увеличиваем текущий раунд и обновляем статус
    await db.tournament.update({
      where: { id: tournamentId },
      data: {
        currentRound: nextRound,
        status: nextRound >= tournament.rounds ? "completed" : "active",
      },
    })

    revalidatePath(`/${encodeURIComponent(tournament.name)}`)

    return true
  } catch (error) {
    console.error("Error generating next round:", error)
    return false
  }
}
