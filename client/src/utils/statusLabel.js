const STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
}

const STATUS_STYLES = {
  open: 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
  in_progress: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  resolved: 'bg-violet-500/15 text-violet-300 ring-violet-500/30',
  closed: 'bg-slate-500/15 text-slate-300 ring-slate-500/30',
}

export function getStatusLabel(status) {
  return STATUS_LABELS[status] ?? status
}

export function getStatusStyles(status) {
  return STATUS_STYLES[status] ?? STATUS_STYLES.closed
}
