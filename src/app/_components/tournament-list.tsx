"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card" 
import { Badge } from "./ui/badge" 
import { Calendar, Users, ChevronRight } from "lucide-react"
import Link from "next/link"

type Tournament = {
  id: string
  name: string
  rounds: number
  participantsCount: number
  startDate: string
  status: "upcoming" | "active" | "completed"
}

interface TournamentListProps {
  initialTournaments: Tournament[]
}

export function TournamentList({ initialTournaments }: TournamentListProps) {
  const [tournaments] = useState<Tournament[]>(initialTournaments)

  if (tournaments.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">You haven't created any tournaments yet.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tournaments.map((tournament) => (
        <Link href={`/${encodeURIComponent(tournament.name)}`} key={tournament.id}>
          <Card className="h-full cursor-pointer hover:bg-muted/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{tournament.name}</CardTitle>
                <StatusBadge status={tournament.status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Calendar className="mr-2 h-4 w-4" />
                <span suppressHydrationWarning={true}>{new Date(tournament.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-2 h-4 w-4" />
                <span>{tournament.participantsCount} participants</span>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <span className="text-sm">{tournament.rounds} rounds</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: Tournament["status"] }) {
  const variants = {
    upcoming: "bg-blue-100 text-blue-800",
    active: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
  }

  const labels = {
    upcoming: "Upcoming",
    active: "Active",
    completed: "Completed",
  }

  return (
    <Badge variant="outline" className={`${variants[status]} border-none`}>
      {labels[status]}
    </Badge>
  )
}
