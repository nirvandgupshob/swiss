"use client"
//src/app/_components/participants-list.tsx
import type React from "react"
import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { PlusCircle, Trash2 } from "lucide-react"
import { addParticipant, removeParticipant } from "../api/action/participant-actions"
import { useRouter } from "next/navigation"

type Participant = {
  id: string
  firstName: string
  lastName: string
  rating: number
}

interface ParticipantsListProps {
  tournamentId: string
  tournamentStatus: "upcoming" | "active" | "completed"
  initialParticipants: Participant[]
  userRole: "PLAYER" | "JUDGE"
}

export function ParticipantsList({ tournamentId, tournamentStatus, initialParticipants, userRole }: ParticipantsListProps) {
  const router = useRouter()
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newParticipant, setNewParticipant] = useState({
    firstName: "",
    lastName: "",
    rating: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleAddParticipant(e: React.FormEvent) {
    e.preventDefault()
    if (!newParticipant.firstName || !newParticipant.lastName || !newParticipant.rating) return

    setIsSubmitting(true)
    try {
      const participant = await addParticipant(tournamentId, {
        firstName: newParticipant.firstName,
        lastName: newParticipant.lastName,
        rating: Number.parseInt(newParticipant.rating),
      })

      setParticipants((prev) => [...prev, participant])
      setNewParticipant({ firstName: "", lastName: "", rating: "" })
      setDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Failed to add participant:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRemoveParticipant(participantId: string) {
    try {
      const success = await removeParticipant(tournamentId, participantId)
      if (success) {
        setParticipants((prev) => prev.filter((p) => p.id !== participantId))
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to remove participant:", error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Participants</h2>
        {tournamentStatus === "upcoming" && userRole === "JUDGE" && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Participant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddParticipant}>
              <DialogHeader>
                <DialogTitle>Add Participant</DialogTitle>
                <DialogDescription>Enter the details of the participant to add to the tournament.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={newParticipant.firstName}
                    onChange={(e) => setNewParticipant({ ...newParticipant, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={newParticipant.lastName}
                    onChange={(e) => setNewParticipant({ ...newParticipant, lastName: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="0"
                    max="3000"
                    value={newParticipant.rating}
                    onChange={(e) => setNewParticipant({ ...newParticipant, rating: e.target.value })}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Participant"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        )}
      </div>

      {participants === undefined ? (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-muted-foreground">No participants added yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Add participants to start the tournament.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map((participant, index) => (
              <TableRow key={participant.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  {participant.lastName}, {participant.firstName}
                </TableCell>
                <TableCell>{participant.rating}</TableCell>
                <TableCell className="text-right">
                  {/* Условный рендеринг */}
                  {tournamentStatus === "upcoming" && userRole === "JUDGE" && (
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveParticipant(participant.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
