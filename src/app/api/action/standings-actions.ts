"use server"
//src/app/api/action/standings-actions.ts
export async function getStandings(tournamentId: string) {
  // Get participants and pairings
  const participants = await import("./participant-actions").then((module) =>
    module.getParticipants(tournamentId),
  )

  const pairings = await import("./pairing-actions").then((module) => module.getPairings(tournamentId))

  // Calculate standings
  const standings = participants.map((participant) => {
    // Find all pairings where this participant played
    const participantPairings = pairings.filter(
      (p) => (p.whiteId === participant.id || p.blackId === participant.id) && p.result !== null,
    )

    // Calculate points
    let points = 0
    let wins = 0
    let draws = 0
    let losses = 0

    participantPairings.forEach((pairing) => {
      if (pairing.result === "1-0" && pairing.whiteId === participant.id) {
        points += 1
        wins += 1
      } else if (pairing.result === "0-1" && pairing.blackId === participant.id) {
        points += 1
        wins += 1
      } else if (pairing.result === "½-½") {
        points += 0.5
        draws += 1
      } else {
        losses += 1
      }
    })

    // Calculate Buchholz coefficient (sum of opponents' scores)
    const opponents = participantPairings.map((pairing) =>
      pairing.whiteId === participant.id ? pairing.blackId : pairing.whiteId,
    )

    let buchholz = 0
    opponents.forEach((opponentId) => {
      const opponentPairings = pairings.filter(
        (p) => (p.whiteId === opponentId || p.blackId === opponentId) && p.result !== null,
      )

      let opponentPoints = 0
      opponentPairings.forEach((pairing) => {
        if (pairing.result === "1-0" && pairing.whiteId === opponentId) {
          opponentPoints += 1
        } else if (pairing.result === "0-1" && pairing.blackId === opponentId) {
          opponentPoints += 1
        } else if (pairing.result === "½-½") {
          opponentPoints += 0.5
        }
      })

      buchholz += opponentPoints
    })

    return {
      participantId: participant.id,
      name: participant.firstName,
      surname: participant.lastName,
      rating: participant.rating,
      points,
      buchholz,
      games: participantPairings.length,
      wins,
      draws,
      losses,
      rank: 0, // Will be calculated after sorting
    }
  })

  // Sort by points (descending) and then by Buchholz (descending)
  standings.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points
    }
    return b.buchholz - a.buchholz
  })

  // Assign ranks
  standings.forEach((standing, index) => {
    standing.rank = index + 1
  })

  return standings
}
 