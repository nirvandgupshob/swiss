// src/app/_components/tournament-list.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom/vitest'

// Моки уже есть в твоем коде, повторно их не трогаем
import { TournamentList } from '../../src/app/_components/tournament-list'
import { deleteTournament } from '../../src/app/api/action/tournament-actions'

vi.mock('../../src/server/db', () => ({
  prisma: {
    tournament: {
      delete: vi.fn(() => Promise.resolve())
    }
  }
}))

vi.mock('../../src/app/api/action/tournament-actions', () => ({
  deleteTournament: vi.fn(() => Promise.resolve())
}))

describe('TournamentList - Isolated Tests', () => {
  const mockTournaments = [
    {
      id: '1',
      name: 'Test Tournament 1',
      rounds: 5,
      participantsCount: 10,
      startDate: '2023-01-01',
      status: 'upcoming' as const,
    },
    {
      id: '2',
      name: 'Test Tournament 2',
      rounds: 3,
      participantsCount: 8,
      startDate: '2023-02-01',
      status: 'active' as const,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty state correctly', () => {
    render(<TournamentList initialTournaments={[]} userRole="PLAYER" />)
    expect(screen.getByText(/You haven't created any tournaments yet/i)).toBeInTheDocument()
  })

  it('renders tournament cards with correct data', () => {
    render(<TournamentList initialTournaments={mockTournaments} userRole="PLAYER" />)
    
    expect(screen.getByText('Test Tournament 1')).toBeInTheDocument()
    expect(screen.getByText('5 rounds')).toBeInTheDocument()
    expect(screen.getByText('10 participants')).toBeInTheDocument()
    expect(screen.getByText('Upcoming')).toBeInTheDocument()

    expect(screen.getByText('Test Tournament 2')).toBeInTheDocument()
    expect(screen.getByText('3 rounds')).toBeInTheDocument()
    expect(screen.getByText('8 participants')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('does not show delete button for PLAYER role', () => {
    render(<TournamentList initialTournaments={mockTournaments} userRole="PLAYER" />)
    expect(screen.queryByRole('button', { name: /trash/i })).not.toBeInTheDocument()
  })

  it('shows delete button for JUDGE role', () => {
    render(<TournamentList initialTournaments={mockTournaments} userRole="JUDGE" />)
    expect(screen.getAllByRole('button')).toHaveLength(2) // 2 иконки удаления
  })

  it('deletes tournament when delete button is clicked by JUDGE', async () => {
    render(<TournamentList initialTournaments={mockTournaments} userRole="JUDGE" />)

    const deleteButtons = screen.getAllByRole('button')
    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(deleteTournament).toHaveBeenCalledWith('1')
    })

    expect(screen.queryByText('Test Tournament 1')).not.toBeInTheDocument()
  })
})