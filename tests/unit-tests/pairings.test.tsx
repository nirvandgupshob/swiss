import { render, screen, fireEvent } from "@testing-library/react"
import { PairingsTable } from "../../src/app/_components/pairings-table"
import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom/vitest'

// Мокаем useRouter
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}))

vi.mock('../../src/server/db', () => ({ // Без этого просто не работает
}))

// Мокаем server action updateResult
vi.mock("@/app/api/action/pairing-actions", () => ({
  updateResult: vi.fn().mockResolvedValue(true),
}))


describe("PairingsTable", () => {
  const mockPairings = [
    {
      id: "1",
      roundNumber: 1,
      result: null,
      white: {
        id: "w1",
        firstName: "Alice",
        lastName: "Smith",
        rating: 1500,
      },
      black: {
        id: "b1",
        firstName: "Bob",
        lastName: "Johnson",
        rating: 1450,
      },
    },
  ]

  const baseProps = {
    tournamentId: "t1",
    initialPairings: mockPairings,
    initialRounds: [1, 2],
    initialSelectedRound: 1,
    userRole: "JUDGE",
  }


  it("renders empty state when no rounds", () => {
    render(<PairingsTable {...baseProps} initialRounds={[]} />)
    expect(screen.getByText("No rounds have been generated yet.")).toBeInTheDocument()
  })

  it("shows message when round has no pairings", () => {
    render(<PairingsTable {...baseProps} initialSelectedRound={2} />)
    expect(screen.getByText("No pairings for this round.")).toBeInTheDocument()
  })

  it("renders readonly result for PLAYER", () => {
    render(<PairingsTable {...baseProps} userRole="PLAYER" initialPairings={[{ ...mockPairings[0], result: "½-½" }]} />)
    expect(screen.getByText("½-½")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "1-0" })).not.toBeInTheDocument()
  })
})