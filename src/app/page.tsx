//src/app/page.tsx
import { Button } from "./_components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./_components/ui/card"
import { PlusCircle } from "lucide-react"
import { TournamentList } from "./_components/tournament-list"
import { CreateTournamentDialog } from "./_components/create-tournament-dialog"
import { getTournaments } from "./api/action/tournament-actions"
import { getParticipants } from "./api/action/participant-actions"

export default async function Home() {
  const tournaments = await getTournaments()
  const tournamentsWithCounts = await Promise.all(
  tournaments.map(async (tournament) => {
    const participants = await getParticipants(tournament.id)
    return { ...tournament, participantsCount: participants.length }
  })
)

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tournament Manager</h1>
        <CreateTournamentDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Tournament
          </Button>
        </CreateTournamentDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Tournaments</CardTitle>
          <CardDescription>Manage your chess tournaments and track results.</CardDescription>
        </CardHeader>
        <CardContent>
          <TournamentList initialTournaments={tournamentsWithCounts} />
        </CardContent>
        {tournaments.length <= 1 && (
          <CardFooter className="border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Create a new tournament to get started.
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
