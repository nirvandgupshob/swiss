// src/lib/swiss-pairing.ts
type Player = {
    id: string;
    firstName: string;
    lastName: string;
    rating: number;
  };
  
  type Pairing = {
    id: string;
    roundNumber: number;
    whiteId: string;
    blackId: string;
    result: string | null;
    tournamentId: string;
  };
  
  type NewPairing = {
    whiteId: string;
    blackId: string;
    roundNumber: number;
  };
  
  export function generatePairings(
    players: Player[],
    existingPairings: Pairing[],
    roundNumber: number
  ): NewPairing[] {
    // Calculate current standings to determine pairing order
    const standings = calculateStandings(players, existingPairings);
  
    // Sort players by points (descending) and then by rating (descending)
    const sortedPlayers = [...standings].sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return b.rating - a.rating;
    });
  
    // Get previous pairings to avoid repeats
    const previousPairings = new Set<string>();
    existingPairings.forEach((pairing) => {
      const pairingKey = [pairing.whiteId, pairing.blackId].sort().join("-");
      previousPairings.add(pairingKey);
    });
  
    // Generate pairings
    const newPairings: NewPairing[] = [];
    const paired = new Set<string>();
  
    // First try to pair players with the same score
    const scoreGroups: { [key: number]: typeof sortedPlayers } = {};
  
    // Group players by score
    sortedPlayers.forEach((player) => {
      if (!scoreGroups[player.points]) {
        scoreGroups[player.points] = [];
      }
      scoreGroups[player.points].push(player);
    });
  
    // Sort score groups by descending score
    const scoreKeys = Object.keys(scoreGroups)
      .map(Number)
      .sort((a, b) => b - a);
  
    // Pair within each score group
    for (const score of scoreKeys) {
      const group = scoreGroups[score];
  
      // If odd number in group and not the last group, move last player to next group
      if (group.length % 2 === 1 && score !== scoreKeys[scoreKeys.length - 1]) {
        const lastPlayer = group.pop()!;
        if (!scoreGroups[scoreKeys[scoreKeys.indexOf(score) + 1]]) {
          scoreGroups[scoreKeys[scoreKeys.indexOf(score) + 1]] = [];
        }
        scoreGroups[scoreKeys[scoreKeys.indexOf(score) + 1]].unshift(lastPlayer);
      }
  
      // Pair players in this score group
      for (let i = 0; i < group.length; i += 2) {
        if (i + 1 >= group.length) continue; // Skip if no partner (should only happen in last group)
  
        const player1 = group[i];
        const player2 = group[i + 1];
  
        // Check if these players have played before
        const pairingKey = [player1.id, player2.id].sort().join("-");
  
        if (!previousPairings.has(pairingKey) && !paired.has(player1.id) && !paired.has(player2.id)) {
          // Alternate colors based on previous games
          const player1WhiteCount = countWhiteGames(player1.id, existingPairings);
          const player2WhiteCount = countWhiteGames(player2.id, existingPairings);
  
          let whiteId, blackId;
          if (player1WhiteCount < player2WhiteCount) {
            whiteId = player1.id;
            blackId = player2.id;
          } else {
            whiteId = player2.id;
            blackId = player1.id;
          }
  
          newPairings.push({
            whiteId,
            blackId,
            roundNumber,
          });
  
          paired.add(player1.id);
          paired.add(player2.id);
        }
      }
    }
  
    // Handle remaining unpaired players
    const unpaired = sortedPlayers.filter((p) => !paired.has(p.id));
  
    for (let i = 0; i < unpaired.length; i += 2) {
      if (i + 1 >= unpaired.length) continue; // Skip if no partner
  
      const player1 = unpaired[i];
      const player2 = unpaired[i + 1];
  
      // Alternate colors based on previous games
      const player1WhiteCount = countWhiteGames(player1.id, existingPairings);
      const player2WhiteCount = countWhiteGames(player2.id, existingPairings);
  
      let whiteId, blackId;
      if (player1WhiteCount < player2WhiteCount) {
        whiteId = player1.id;
        blackId = player2.id;
      } else {
        whiteId = player2.id;
        blackId = player1.id;
      }
  
      newPairings.push({
        whiteId,
        blackId,
        roundNumber,
      });
    }
  
    return newPairings;
  }
  
  function calculateStandings(players: Player[], pairings: Pairing[]) {
    return players.map((player) => {
      // Find all pairings where this player played
      const playerPairings = pairings.filter(
        (p) => (p.whiteId === player.id || p.blackId === player.id) && p.result !== null
      );
  
      // Calculate points
      let points = 0;
  
      playerPairings.forEach((pairing) => {
        if (pairing.result === "1-0" && pairing.whiteId === player.id) {
          points += 1;
        } else if (pairing.result === "0-1" && pairing.blackId === player.id) {
          points += 1;
        } else if (pairing.result === "½-½") {
          points += 0.5;
        }
      });
  
      return {
        ...player,
        points,
      };
    });
  }
  
  function countWhiteGames(playerId: string, pairings: Pairing[]) {
    return pairings.filter((p) => p.whiteId === playerId).length;
  }