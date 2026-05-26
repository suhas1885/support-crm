import { getStatusLabel, getStatusStyles } from '../utils/statusLabel.js'

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${getStatusStyles(status)}`}
    >
      {getStatusLabel(status)}
    </span>
  )
}
