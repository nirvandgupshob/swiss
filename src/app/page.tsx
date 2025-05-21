//src/app/page.tsx
import { Button } from "./_components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./_components/ui/card"
import { PlusCircle } from "lucide-react"
import { TournamentList } from "./_components/tournament-list"
import { CreateTournamentDialog } from "./_components/create-tournament-dialog"
import { getTournaments, getTournamentsForUser } from "./api/action/tournament-actions"
import { getParticipants } from "./api/action/participant-actions"
import { auth } from "~/server/auth"

export default async function Home() {
  const session = await auth(); 
  const role = session?.user.role;
  const userId = session?.user.id;
  console.log(userId);
  const tournaments = (role === "PLAYER" ? await getTournamentsForUser(userId!) : await getTournaments());
  const tournamentsWithCounts = await Promise.all(
  tournaments.map(async (tournament) => {
    const participants = await getParticipants(tournament.id)
     return {
      ...tournament,
      startDate: tournament.startDate.toISOString(),
      status: tournament.status as "upcoming" | "active" | "completed",
      participantsCount: participants.length,
    }
  })
)

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tournament Manager</h1>
        <h2>You are logged as a {role} </h2>
        {role === "JUDGE" && <CreateTournamentDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Tournament
          </Button>
        </CreateTournamentDialog>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Tournaments</CardTitle>
          <CardDescription>Manage your chess tournaments and track results.</CardDescription>
        </CardHeader>
        <CardContent>
          <TournamentList initialTournaments={tournamentsWithCounts} userRole={role as "PLAYER" | "JUDGE"} />
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
