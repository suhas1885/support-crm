import { useCallback, useEffect, useState } from 'react'
import { fetchTickets } from '../services/ticketApi.js'
import { getErrorMessage } from '../utils/getErrorMessage.js'

const SEARCH_DEBOUNCE_MS = 350

/**
 * Custom hook: loads tickets from Express API via Axios.
 * Manages loading, error, search, and status filter state.
 */
export function useTickets() {
  const [tickets, setTickets] = useState([])
  const [count, setCount] = useState(0)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadTickets = useCallback(async (searchTerm, statusFilter) => {
    setLoading(true)
    setError(null)

    try {
      const result = await fetchTickets({
        search: searchTerm,
        status: statusFilter,
      })

      setTickets(result.data ?? [])
      setCount(result.count ?? 0)
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load tickets'))
      setTickets([])
      setCount(0)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTickets(search, status)
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [search, status, loadTickets])

  return {
    tickets,
    count,
    search,
    setSearch,
    status,
    setStatus,
    loading,
    error,
    refresh: () => loadTickets(search, status),
  }
}
