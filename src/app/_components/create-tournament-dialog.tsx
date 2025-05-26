"use client"
// /src/app/_components/create-tournament-dialog.tsx
import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover" 
import { format } from "date-fns"
import { cn } from "../../lib/utils"
import { DayPicker } from "react-day-picker"
import { createTournament } from "../api/action/tournament-actions"

export function CreateTournamentDialog({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [rounds, setRounds] = useState("5")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !rounds || !date) return

    setIsSubmitting(true)
    try {
      const tournamentId = await createTournament({
        name,
        rounds: Number.parseInt(rounds),
        startDate: date.toISOString(),
      })

      if (tournamentId) {
        router.push(`/${encodeURIComponent(name)}`)
        setOpen(false)
      }
    } catch (error) {
      console.error("Failed to create tournament:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Tournament</DialogTitle>
            <DialogDescription>Enter the details for your new chess tournament.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tournament Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Tournament name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rounds">Number of Rounds</Label>
              <Input
                id="rounds"
                type="number"
                min="1"
                max="20"
                value={rounds}
                onChange={(e) => setRounds(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <DayPicker mode="single" selected={date} onSelect={setDate} disabled={{ before: new Date() }} /> 
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Tournament"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
