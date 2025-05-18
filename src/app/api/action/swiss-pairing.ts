// src/api/action/swiss-pairing.ts
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
    blackId: string | null;
    result: string | null;
    tournamentId: string;
  };
  
  type NewPairing = {
    whiteId: string;
    blackId: string | null; // null — бай-раунд
    roundNumber: number;
  };

  export function generatePairings(
  players: Player[],
  existingPairings: Pairing[],
  roundNumber: number
): NewPairing[] {
  const newPairings: NewPairing[] = [];

  const isFirstRound = existingPairings.length === 0; // Проверка - первый ли раунд

  if (isFirstRound) {
    const sorted = [...players].sort((a, b) => b.rating - a.rating); // Сортировка игроков по убыванию рейтинга
    const paired = new Set<string>(); // Вспомогательное множество

    // Бай получает последний по рейтингу, если нечётное число игроков
    if (sorted.length % 2 === 1) {
      const byePlayer = sorted[sorted.length - 1]!;
      newPairings.push({
        whiteId: byePlayer.id,
        blackId: null,
        roundNumber,
      });
      paired.add(byePlayer.id);
    }

    const eligible = sorted.filter((p) => !paired.has(p.id)); //Все игроки, кроме получившего Бай
    const half = eligible.length / 2;
    const top = eligible.slice(0, half);
    const bottom = eligible.slice(half);

    for (let i = 0; i < half; i++) {
      newPairings.push({
        whiteId: top[i]!.id,
        blackId: bottom[i]!.id,
        roundNumber,
      });
    }

    return newPairings;
  }

  // Для не-первого раунда

  const standings = calculateStandings(players, existingPairings); // Счет очков для каждого игрока
const sortedPlayers = [...standings].sort((a, b) => {
  if (b.points > a.points) {
    return 1; // b выше a — b идёт раньше
  } else if (b.points < a.points) {
    return -1; // a выше b — a идёт раньше
  } else {
    // Очки равны — сортируем по рейтингу
    if (b.rating > a.rating) {
      return 1;
    } else if (b.rating < a.rating) {
      return -1;
    } else {
      return 0; // и очки, и рейтинг равны
    }
  }
});

  const previousPairings = new Set<string>();
  for (const p of existingPairings) {
    if (p.blackId === null) continue; // пропускаем бай-раунды
    const key = [p.whiteId, p.blackId].sort().join("-");
    previousPairings.add(key);
  }

  const alreadyPaired = new Set<string>();
  const playerIdsWithBye = new Set(
    existingPairings
      .filter((p) => p.blackId === null)
      .map((p) => p.whiteId)
  );

  // Бай-раунд, если нечётное количество игроков
  if (sortedPlayers.length % 2 === 1) {
    const byeCandidate = [...sortedPlayers]
      .reverse()
      .find((p) => !playerIdsWithBye.has(p.id) && !alreadyPaired.has(p.id));

    if (byeCandidate) {
      newPairings.push({
        whiteId: byeCandidate.id,
        blackId: null,
        roundNumber,
      });
      alreadyPaired.add(byeCandidate.id);
    }
  }

  const unpaired = sortedPlayers.filter((p) => !alreadyPaired.has(p.id));

  for (let i = 0; i < unpaired.length; i++) {
    const p1 = unpaired[i]!;
    if (alreadyPaired.has(p1.id)) continue; // Не дублирование, так и должно быть
    for (let j = i + 1; j < unpaired.length; j++) {
      const p2 = unpaired[j]!;
      if (alreadyPaired.has(p2.id)) continue;

      const key = [p1.id, p2.id].sort().join("-");
      if (previousPairings.has(key)) continue;

      // баланс сторон
      const p1White = countWhiteGames(p1.id, existingPairings);
      const p2White = countWhiteGames(p2.id, existingPairings);

      const whiteId = p1White <= p2White ? p1.id : p2.id;
      const blackId = p1White <= p2White ? p2.id : p1.id;

      newPairings.push({ whiteId, blackId, roundNumber });
      alreadyPaired.add(p1.id);
      alreadyPaired.add(p2.id);
      break;
    }
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
        if (pairing.blackId === null && pairing.whiteId === player.id) {
          points += 1;
        } 
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