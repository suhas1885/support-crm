import { useState } from 'react'
import { createTicket } from '../services/ticketApi.js'
import { getErrorMessage } from '../utils/getErrorMessage.js'

const INITIAL_FORM = {
  customerName: '',
  email: '',
  subject: '',
  description: '',
}

export default function CreateTicketForm({ onCreated }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError(null)
    setSuccess(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await createTicket(form)
      const ticket = result.data

      setSuccess(
        `Ticket ${ticket.ticketId ?? ''} created successfully!`,
      )
      setForm(INITIAL_FORM)
      onCreated?.()
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create ticket'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-white">Create new ticket</h3>
        <p className="mt-1 text-sm text-slate-400">
          Fill in customer details and issue information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Customer name"
          name="customerName"
          value={form.customerName}
          onChange={handleChange}
          placeholder="Jane Doe"
          required
        />
        <FormField
          label="Customer email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="jane@example.com"
          required
        />
        <div className="sm:col-span-2">
          <FormField
            label="Issue title (subject)"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Cannot login to account"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="description"
            className="mb-1.5 block text-sm font-medium text-slate-300"
          >
            Issue description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
            placeholder="Describe the problem in detail..."
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        {error && (
          <p className="sm:col-span-2 text-sm text-red-300" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="sm:col-span-2 text-sm text-emerald-300" role="status">
            {success}
          </p>
        )}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Creating...' : 'Create ticket'}
          </button>
        </div>
      </form>
    </section>
  )
}

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-slate-300"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
      />
    </div>
  )
}
