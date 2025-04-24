"use client"

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
  name: string
  surname: string
  rating: number
}

interface ParticipantsListProps {
  tournamentId: string
  initialParticipants: Participant[]
}

export function ParticipantsList({ tournamentId, initialParticipants }: ParticipantsListProps) {
  const router = useRouter()
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    surname: "",
    rating: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleAddParticipant(e: React.FormEvent) {
    e.preventDefault()
    if (!newParticipant.name || !newParticipant.surname || !newParticipant.rating) return

    setIsSubmitting(true)
    try {
      const participant = await addParticipant(tournamentId, {
        name: newParticipant.name,
        surname: newParticipant.surname,
        rating: Number.parseInt(newParticipant.rating),
      })

      setParticipants((prev) => [...prev, participant])
      setNewParticipant({ name: "", surname: "", rating: "" })
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
                  <Label htmlFor="name">First Name</Label>
                  <Input
                    id="name"
                    value={newParticipant.name}
                    onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="surname">Last Name</Label>
                  <Input
                    id="surname"
                    value={newParticipant.surname}
                    onChange={(e) => setNewParticipant({ ...newParticipant, surname: e.target.value })}
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
      </div>

      {participants.length === 0 ? (
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
                  {participant.surname}, {participant.name}
                </TableCell>
                <TableCell>{participant.rating}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveParticipant(participant.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
