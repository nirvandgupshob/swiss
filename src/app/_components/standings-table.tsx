"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"

type Standing = {
  participantId: string
  rank: number
  name: string
  surname: string
  rating: number
  points: number
  buchholz: number
  games: number
  wins: number
  draws: number
  losses: number
}

interface StandingsTableProps {
  tournamentId: string
  initialStandings: Standing[]
}

export function StandingsTable({ tournamentId, initialStandings }: StandingsTableProps) {
  const [standings] = useState<Standing[]>(initialStandings)

  if (standings.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <p className="text-muted-foreground">No standings available yet.</p>
        <p className="text-sm text-muted-foreground mt-1">Complete some games to see standings.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Standings</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="text-center">Points</TableHead>
            <TableHead className="text-center">Buchholz</TableHead>
            <TableHead className="text-center">W</TableHead>
            <TableHead className="text-center">D</TableHead>
            <TableHead className="text-center">L</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((standing) => (
            <TableRow key={standing.participantId}>
              <TableCell className="font-medium">{standing.rank}</TableCell>
              <TableCell>
                {standing.surname}, {standing.name}
              </TableCell>
              <TableCell>{standing.rating}</TableCell>
              <TableCell className="text-center">{standing.points}</TableCell>
              <TableCell className="text-center">{standing.buchholz.toFixed(1)}</TableCell>
              <TableCell className="text-center">{standing.wins}</TableCell>
              <TableCell className="text-center">{standing.draws}</TableCell>
              <TableCell className="text-center">{standing.losses}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
