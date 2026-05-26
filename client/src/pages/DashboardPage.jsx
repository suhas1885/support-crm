import { useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout.jsx'
import SearchBar from '../components/SearchBar.jsx'
import StatusFilter from '../components/StatusFilter.jsx'
import TicketTable from '../components/TicketTable.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorAlert from '../components/ErrorAlert.jsx'
import EmptyState from '../components/EmptyState.jsx'
import CreateTicketForm from '../components/CreateTicketForm.jsx'
import TicketDetailModal from '../components/TicketDetailModal.jsx'
import { useTickets } from '../hooks/useTickets.js'

export default function DashboardPage() {
  const [selectedTicketId, setSelectedTicketId] = useState(null)
  const {
    tickets,
    count,
    search,
    setSearch,
    status,
    setStatus,
    loading,
    error,
    refresh,
  } = useTickets()

  const hasFilters = Boolean(search.trim() || status)

  return (
    <DashboardLayout ticketCount={count}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Tickets
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Manage and track customer support requests
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total shown" value={count} />
          <StatCard
            label="Status filter"
            value={status ? status.replace('_', ' ') : 'All'}
          />
          <StatCard label="Search" value={search.trim() || 'None'} />
        </div>

        <CreateTicketForm onCreated={refresh} />

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:flex-row sm:items-center sm:p-5">
          <SearchBar
            value={search}
            onChange={setSearch}
            disabled={loading && !tickets.length}
          />
          <StatusFilter
            value={status}
            onChange={setStatus}
            disabled={loading && !tickets.length}
          />
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4 sm:p-6">
          {error && <ErrorAlert message={error} onRetry={refresh} />}

          {!error && loading && <LoadingSpinner />}

          {!error && !loading && tickets.length === 0 && (
            <EmptyState hasFilters={hasFilters} />
          )}

          {!error && !loading && tickets.length > 0 && (
            <TicketTable
              tickets={tickets}
              onSelectTicket={(ticket) => setSelectedTicketId(ticket.id)}
            />
          )}
        </section>

        {selectedTicketId && (
          <TicketDetailModal
            ticketId={selectedTicketId}
            onClose={() => setSelectedTicketId(null)}
            onUpdated={refresh}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-1 truncate text-lg font-semibold capitalize text-slate-100">
        {value}
      </p>
    </div>
  )
}
