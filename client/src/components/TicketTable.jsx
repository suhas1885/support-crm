import StatusBadge from './StatusBadge.jsx'
import { formatDate } from '../utils/formatDate.js'
import { getTicketDisplayId } from '../utils/ticketDisplayId.js'

function TicketCard({ ticket, onSelect }) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(ticket)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(ticket)}
      className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition hover:border-indigo-500/40 hover:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-100">{ticket.subject}</p>
          <p className="mt-0.5 truncate text-sm text-slate-400">
            {ticket.customerName} · {ticket.email}
          </p>
        </div>
        <StatusBadge status={ticket.status} />
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-slate-400">
        {ticket.description}
      </p>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>{getTicketDisplayId(ticket)}</span>
        <span>{formatDate(ticket.createdAt)}</span>
      </div>
    </article>
  )
}

export default function TicketTable({ tickets, onSelectTicket }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-800 md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-900/80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 lg:px-6">
                  Ticket ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 lg:px-6">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 lg:px-6">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 lg:px-6">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 lg:px-6">
                  Created
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400 lg:px-6">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-950/50">
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="cursor-pointer transition hover:bg-slate-900/60"
                  onClick={() => onSelectTicket?.(ticket)}
                >
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-indigo-300 lg:px-6">
                    {getTicketDisplayId(ticket)}
                  </td>
                  <td className="px-4 py-4 lg:px-6">
                    <p className="font-medium text-slate-100">
                      {ticket.customerName}
                    </p>
                    <p className="text-sm text-slate-400">{ticket.email}</p>
                  </td>
                  <td className="max-w-xs px-4 py-4 lg:max-w-md lg:px-6">
                    <p className="font-medium text-slate-200">{ticket.subject}</p>
                    <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                      {ticket.description}
                    </p>
                  </td>
                  <td className="px-4 py-4 lg:px-6">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-400 lg:px-6">
                    {formatDate(ticket.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right lg:px-6">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectTicket?.(ticket)
                      }}
                      className="rounded-lg bg-indigo-600/20 px-3 py-1.5 text-xs font-medium text-indigo-300 ring-1 ring-indigo-500/30 transition hover:bg-indigo-600/30"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 md:hidden">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onSelect={onSelectTicket}
          />
        ))}
      </div>
    </>
  )
}
