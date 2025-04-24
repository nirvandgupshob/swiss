// app/[tournamentName]/page.tsx
import { notFound } from "next/navigation"
import { getTournamentByName } from "../api/action/tournament-actions"
import { getParticipants } from "../api/action/participant-actions"
import { getPairings } from "../api/action/pairing-actions"
import { getStandings } from "../api/action/standings-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../_components/ui/tabs"
import { TournamentHeader } from "../_components/tournament-header"
import { ParticipantsList } from "../_components/participants-list"
import { PairingsTable } from "../_components/pairings-table"
import { StandingsTable } from "../_components/standings-table"

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ tournamentName: string }>
}) {
  const tournamentName = decodeURIComponent((await params).tournamentName)
  try {
    // Fetch all data on the server
    const tournament = await getTournamentByName(tournamentName)

    if (!tournament) {
      notFound()
    }

    // Pre-fetch all data needed by client components
    const participants = await getParticipants(tournament.id)
    const pairings = await getPairings(tournament.id)
    const standings = await getStandings(tournament.id)

    // Get unique rounds from pairings
    const rounds = [...new Set(pairings.map((p) => p.roundNumber))].sort((a, b) => a - b)
    const currentRound = rounds.length > 0 ? rounds[rounds.length - 1] : null

    return (
      <div className="container mx-auto py-6">
        <TournamentHeader tournament={tournament} />

        <Tabs defaultValue="participants" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="pairings">Pairings</TabsTrigger>
            <TabsTrigger value="standings">Standings</TabsTrigger>
          </TabsList>
          <TabsContent value="participants" className="mt-6">
            <ParticipantsList tournamentId={tournament.id} initialParticipants={participants} />
          </TabsContent>
          <TabsContent value="pairings" className="mt-6">
            <PairingsTable
              tournamentId={tournament.id}
              initialPairings={pairings}
              initialRounds={rounds}
              initialSelectedRound={currentRound}
            />
          </TabsContent>
          <TabsContent value="standings" className="mt-6">
            <StandingsTable tournamentId={tournament.id} initialStandings={standings} />
          </TabsContent>
        </Tabs>
      </div>
    )
  } catch (error) {
    console.error("Error loading tournament:", error)
    notFound()
  }
}
