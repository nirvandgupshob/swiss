//app/_components/tournament-header.tsx
"use client"

import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Calendar, Users, Trophy, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { generateNextRound } from "../api/action/tournament-actions"
import { useState } from "react"
import Link from "next/link"

type TournamentHeaderProps = {
  tournament: {
    id: string
    name: string
    rounds: number
    currentRound: number
    startDate: string
    status: "upcoming" | "active" | "completed"
    participantsCount: number
  }
}

export function TournamentHeader({ tournament }: TournamentHeaderProps) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)

  async function handleGenerateNextRound() {
    if (tournament.currentRound >= tournament.rounds) return

    setIsGenerating(true)
    try {
      const success = await generateNextRound(tournament.id)
      if (success) {
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to generate next round:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800",
    active: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
  }

  const statusLabels = {
    upcoming: "Upcoming",
    active: "Active",
    completed: "Completed",
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Tournaments
        </Link>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold">{tournament.name}</h1>
          <div className="flex items-center mt-2 space-x-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              <span suppressHydrationWarning={true}>{new Date(tournament.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-1 h-4 w-4" />
              <span>{tournament.participantsCount} participants</span> {/* ОШИБКА ЗДЕСЬ */}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Trophy className="mr-1 h-4 w-4" />
              <span>
                Round {tournament.currentRound} of {tournament.rounds}
              </span>
            </div>
            <Badge variant="outline" className={`${statusColors[tournament.status]} border-none`}>
              {statusLabels[tournament.status]}
            </Badge>
          </div>
        </div>

        <div className="flex space-x-2">
          {tournament.status !== "completed" && tournament.currentRound < tournament.rounds && (
            <Button onClick={handleGenerateNextRound} disabled={isGenerating}>
              {isGenerating ? "Generating..." : `Generate Round ${tournament.currentRound + 1}`}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
