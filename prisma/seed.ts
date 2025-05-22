import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

  const tournament = await prisma.tournament.create({
    data: {
      name: "Chess Masters",
      rounds: 3,
      currentRound: 1,
      startDate: new Date("2025-06-01T10:00:00Z"),
      status: "active",
    },
  })

  const playerData = [
    { firstName: "Grigori", lastName: "Pivovarov", rating: 2030 },
    { firstName: "Ryan", lastName: "Gosling", rating: 2150 },
    { firstName: "Light", lastName: "Yagami", rating: 2250 },
    { firstName: "Barack", lastName: "Obama", rating: 1980 },
    { firstName: "Mahatma", lastName: "Gandhi", rating: 1800 },
    { firstName: "Osama-bin", lastName: "Laden", rating: 1750 },
  ]

  const players = await Promise.all(
    playerData.map(player =>
      prisma.player.create({
        data: {
          ...player,
          tournamentId: tournament.id,
        },
      })
    )
  )

  const pairings = [
    {
      roundNumber: 1,
      whiteId: players[0].id,
      blackId: players[1].id,
      result: "1-0",
    },
    {
      roundNumber: 1,
      whiteId: players[2].id,
      blackId: players[3].id,
      result: "½-½",
    },
    {
      roundNumber: 1,
      whiteId: players[4].id,
      blackId: players[5].id,
      result: "0-1",
    },
  ]

  await Promise.all(
    pairings.map(pair =>
      prisma.pairing.create({
        data: {
          tournamentId: tournament.id,
          ...pair,
        },
      })
    )
  )

  await prisma.user.create({
    data: {
      firstname: "Admin",
      surname: "Judge",
      email: "judge@example.com",
      role: "JUDGE",
    },
  })
  await prisma.user.create({
    data: {
      firstname: "Light",
      surname: "Yagami",
      email: "user@test.com",
      role: "PLAYER",
    }
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(" Ошибка:", e)
    return prisma.$disconnect().then(() => process.exit(1))
  })