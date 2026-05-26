import { FieldValue } from 'firebase-admin/firestore'
import { getFirestoreDb } from '../config/firebase.js'
import { isFirebaseConfigured } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'
import { generateTicketId } from '../utils/generateTicketId.js'

const TICKETS_COLLECTION = 'tickets'

function ensureFirebaseReady() {
  if (!isFirebaseConfigured()) {
    throw new ApiError(
      503,
      'Firebase is not configured. Add Firebase Admin credentials to server/.env',
    )
  }
}

/**
 * Older tickets may not have ticketId — assign one (TKT-001 style) on read.
 */
async function backfillTicketIdIfMissing(doc, db) {
  const data = doc.data()
  if (data.ticketId) return doc

  const ticketId = await generateTicketId(db)
  await doc.ref.update({
    ticketId,
    updatedAt: FieldValue.serverTimestamp(),
  })

  return doc.ref.get()
}

/**
 * Converts Firestore Timestamp fields to ISO strings for JSON responses.
 */
const NOTES_SUBCOLLECTION = 'notes'

function formatNoteDocument(doc) {
  const data = doc.data()
  return {
    id: doc.id,
    content: data.content,
    author: data.author ?? 'Support Agent',
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
  }
}

function formatTicketDocument(doc, notes = []) {
  const data = doc.data()

  return {
    id: doc.id,
    ticketId: data.ticketId ?? null,
    customerName: data.customerName,
    email: data.email,
    subject: data.subject,
    description: data.description,
    status: data.status,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? null,
    notes,
  }
}

async function getTicketDocOrThrow(db, id) {
  const doc = await db.collection(TICKETS_COLLECTION).doc(id).get()
  if (!doc.exists) {
    throw new ApiError(404, 'Ticket not found')
  }
  return doc
}

async function fetchNotesForTicket(ticketRef) {
  const snapshot = await ticketRef
    .collection(NOTES_SUBCOLLECTION)
    .orderBy('createdAt', 'asc')
    .get()

  return snapshot.docs.map(formatNoteDocument)
}

/**
 * Returns true if the search term appears in any searchable ticket field.
 */
function matchesSearch(ticket, searchTerm) {
  const term = searchTerm.toLowerCase()
  const searchableFields = [
    ticket.ticketId,
    ticket.customerName,
    ticket.email,
    ticket.subject,
    ticket.description,
  ]

  return searchableFields.some((value) =>
    String(value ?? '').toLowerCase().includes(term),
  )
}

/**
 * Sort tickets by createdAt descending (latest first).
 */
function sortTicketsLatestFirst(tickets) {
  return tickets.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return dateB - dateA
  })
}

/**
 * Fetches tickets with optional search + status filters.
 *
 * Step 1: Query Firestore (filter by status if provided)
 * Step 2: Sort latest first in memory
 * Step 3: Apply text search in memory (name, email, subject, description)
 */
export async function getTickets({ search = '', status = null } = {}) {
  ensureFirebaseReady()

  const db = getFirestoreDb()
  let query = db.collection(TICKETS_COLLECTION)

  // Step 1 — Firestore filter by status (exact match)
  if (status) {
    query = query.where('status', '==', status)
  }

  const snapshot = await query.get()
  const docsWithIds = await Promise.all(
    snapshot.docs.map((doc) => backfillTicketIdIfMissing(doc, db)),
  )
  let tickets = docsWithIds.map(formatTicketDocument)

  // Step 2 — latest first
  tickets = sortTicketsLatestFirst(tickets)

  // Step 3 — text search across multiple fields
  if (search) {
    tickets = tickets.filter((ticket) => matchesSearch(ticket, search))
  }

  return {
    tickets,
    count: tickets.length,
    filters: {
      search: search || null,
      status: status || null,
    },
  }
}

/**
 * Creates a new support ticket in Firestore.
 * Firestore auto-generates the document ID (ticket ID).
 */
/**
 * GET single ticket with all notes/comments.
 */
export async function getTicketById(id) {
  ensureFirebaseReady()

  const db = getFirestoreDb()
  let doc = await getTicketDocOrThrow(db, id)
  doc = await backfillTicketIdIfMissing(doc, db)

  const notes = await fetchNotesForTicket(doc.ref)
  return formatTicketDocument(doc, notes)
}

/**
 * Update ticket status and/or add a note.
 */
export async function updateTicket(id, { status, note, author }) {
  ensureFirebaseReady()

  const db = getFirestoreDb()
  let doc = await getTicketDocOrThrow(db, id)
  doc = await backfillTicketIdIfMissing(doc, db)
  const ticketRef = doc.ref

  const updates = { updatedAt: FieldValue.serverTimestamp() }
  if (status) {
    updates.status = status
  }

  if (status) {
    await ticketRef.update(updates)
  }

  if (note) {
    await ticketRef.collection(NOTES_SUBCOLLECTION).add({
      content: note,
      author: author ?? 'Support Agent',
      createdAt: FieldValue.serverTimestamp(),
    })
    if (!status) {
      await ticketRef.update({ updatedAt: FieldValue.serverTimestamp() })
    }
  }

  const refreshed = await ticketRef.get()
  const notes = await fetchNotesForTicket(ticketRef)
  return formatTicketDocument(refreshed, notes)
}

export async function createTicket(ticketData) {
  ensureFirebaseReady()

  const db = getFirestoreDb()
  const ticketRef = db.collection(TICKETS_COLLECTION).doc()
  const ticketId = await generateTicketId(db)

  const payload = {
    ticketId,
    customerName: ticketData.customerName,
    email: ticketData.email,
    subject: ticketData.subject,
    description: ticketData.description,
    status: ticketData.status,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  }

  await ticketRef.set(payload)

  const savedDoc = await ticketRef.get()
  return formatTicketDocument(savedDoc, [])
}
