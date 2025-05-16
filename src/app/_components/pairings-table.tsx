"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Button } from "./ui/button"
import { updateResult } from "../api/action/pairing-actions"
import { useRouter } from "next/navigation"

type Pairing = {
  id: string;
  roundNumber: number;
  result: "1-0" | "0-1" | "½-½" | null;
  white: {  // Данные белого игрока
    id: string;
    firstName: string;
    lastName: string;
    rating: number;
  };
  black: {  // Данные чёрного игрока
    id: string;
    firstName: string;
    lastName: string;
    rating: number;
  };
};

interface PairingsTableProps {
  tournamentId: string
  initialPairings: Pairing[]
  initialRounds: number[]
  initialSelectedRound: number | null
}

export function PairingsTable({
  tournamentId,
  initialPairings,
  initialRounds,
  initialSelectedRound,
}: PairingsTableProps) {
  const router = useRouter()
  const [pairings, setPairings] = useState<Pairing[]>(initialPairings)
  const [selectedRound, setSelectedRound] = useState<number | null>(initialSelectedRound)

  async function handleResultChange(pairingId: string, result: "1-0" | "0-1" | "½-½") {
    try {
      const success = await updateResult(tournamentId, pairingId, result)
      if (success) {
        // Update local state
        setPairings((prev) => prev.map((pairing) => (pairing.id === pairingId ? { ...pairing, result } : pairing)))
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to update result:", error)
    }
  }

  if (initialRounds.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <p className="text-muted-foreground">No rounds have been generated yet.</p>
        <p className="text-sm text-muted-foreground mt-1">Generate a round to see pairings.</p>
      </div>
    )
  }

  const filteredPairings = selectedRound ? pairings.filter((p) => p.roundNumber === selectedRound) : []

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Pairings</h2>
        <Select
          value={selectedRound?.toString() || ""}
          onValueChange={(value) => setSelectedRound(Number.parseInt(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select round" />
          </SelectTrigger>
          <SelectContent>
            {initialRounds.map((round) => (
              <SelectItem key={round} value={round.toString()}>
                Round {round}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredPairings.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-muted-foreground">No pairings for this round.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Board</TableHead>
              <TableHead>White</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Black</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-center">Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {filteredPairings.map((pairing, index) => (
            <TableRow key={pairing.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>
              {pairing.white.lastName}, {pairing.white.firstName} 
                </TableCell>
                <TableCell>{pairing.white.rating}</TableCell>
                <TableCell>
                  {pairing.black.lastName}, {pairing.black.firstName} 
                </TableCell>
                <TableCell>{pairing.black.rating}</TableCell>
                <TableCell>
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant={pairing.result === "1-0" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleResultChange(pairing.id, "1-0")}
                    >
                      1-0
                    </Button>
                    <Button
                      variant={pairing.result === "½-½" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleResultChange(pairing.id, "½-½")}
                    >
                      ½-½
                    </Button>
                    <Button
                      variant={pairing.result === "0-1" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleResultChange(pairing.id, "0-1")}
                    >
                      0-1
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
