import { useEffect, useState } from 'react'
import { fetchTicketById, updateTicket } from '../services/ticketApi.js'
import { getErrorMessage } from '../utils/getErrorMessage.js'
import { formatDate } from '../utils/formatDate.js'
import { getTicketDisplayId } from '../utils/ticketDisplayId.js'
import { getStatusLabel } from '../utils/statusLabel.js'
import StatusBadge from './StatusBadge.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
]

export default function TicketDetailModal({ ticketId, onClose, onUpdated }) {
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('')
  const [note, setNote] = useState('')
  const [author, setAuthor] = useState('Support Agent')
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState(null)

  useEffect(() => {
    if (!ticketId) return

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const result = await fetchTicketById(ticketId)
        setTicket(result.data)
        setStatus(result.data.status)
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to load ticket'))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [ticketId])

  async function handleUpdate(event) {
    event.preventDefault()
    setSaving(true)
    setSaveMessage(null)
    setError(null)

    const payload = {}
    if (status && status !== ticket.status) payload.status = status
    if (note.trim()) {
      payload.note = note.trim()
      payload.author = author.trim() || 'Support Agent'
    }

    if (!payload.status && !payload.note) {
      setError('Change status or add a note before saving')
      setSaving(false)
      return
    }

    try {
      const result = await updateTicket(ticketId, payload)
      setTicket(result.data)
      setStatus(result.data.status)
      setNote('')
      setSaveMessage('Ticket updated successfully')
      onUpdated?.()
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update ticket'))
    } finally {
      setSaving(false)
    }
  }

  if (!ticketId) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-detail-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close dialog"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-slate-800 bg-slate-950 shadow-2xl sm:rounded-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-800 px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">
              {ticket ? getTicketDisplayId(ticket) : 'Loading...'}
            </p>
            <h2
              id="ticket-detail-title"
              className="mt-1 truncate text-lg font-semibold text-white"
            >
              {ticket?.subject ?? 'Ticket details'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading && <LoadingSpinner label="Loading ticket..." />}

          {!loading && error && !ticket && (
            <p className="text-sm text-red-300" role="alert">
              {error}
            </p>
          )}

          {!loading && ticket && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={ticket.status} />
                <span className="text-xs text-slate-500">
                  Created {formatDate(ticket.createdAt)}
                </span>
                <span className="text-xs text-slate-500">
                  Updated {formatDate(ticket.updatedAt)}
                </span>
              </div>

              <DetailSection title="Customer">
                <p className="font-medium text-slate-100">{ticket.customerName}</p>
                <p className="text-sm text-slate-400">{ticket.email}</p>
              </DetailSection>

              <DetailSection title="Description">
                <p className="text-sm leading-relaxed text-slate-300">
                  {ticket.description}
                </p>
              </DetailSection>

              <form onSubmit={handleUpdate} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <h3 className="text-sm font-semibold text-white">
                  Update ticket
                </h3>

                <div>
                  <label
                    htmlFor="ticket-status"
                    className="mb-1.5 block text-sm font-medium text-slate-300"
                  >
                    Status
                  </label>
                  <select
                    id="ticket-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-slate-500">
                    Current: {getStatusLabel(ticket.status)}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="note-author"
                    className="mb-1.5 block text-sm font-medium text-slate-300"
                  >
                    Your name (optional)
                  </label>
                  <input
                    id="note-author"
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Support Agent"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div>
                  <label
                    htmlFor="ticket-note"
                    className="mb-1.5 block text-sm font-medium text-slate-300"
                  >
                    Add note / comment
                  </label>
                  <textarea
                    id="ticket-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    placeholder="Internal note or reply to customer..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-300" role="alert">
                    {error}
                  </p>
                )}
                {saveMessage && (
                  <p className="text-sm text-emerald-300" role="status">
                    {saveMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </form>

              <DetailSection title={`Notes & comments (${ticket.notes?.length ?? 0})`}>
                {ticket.notes?.length === 0 && (
                  <p className="text-sm text-slate-500">No notes yet.</p>
                )}
                <ul className="space-y-3">
                  {ticket.notes?.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-xl border border-slate-800 bg-slate-900/80 p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-indigo-300">
                          {item.author}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-300">{item.content}</p>
                    </li>
                  ))}
                </ul>
              </DetailSection>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailSection({ title, children }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </h3>
      {children}
    </section>
  )
}
