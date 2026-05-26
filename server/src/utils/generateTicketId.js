/**
 * Generates a human-readable ticket ID like TKT-001, TKT-002 ...
 * Uses a Firestore counter so IDs stay unique and sequential.
 */
export async function generateTicketId(db) {
  const counterRef = db.collection('counters').doc('tickets')

  const ticketId = await db.runTransaction(async (transaction) => {
    const counterDoc = await transaction.get(counterRef)
    const lastNumber = counterDoc.exists ? counterDoc.data().lastNumber : 0
    const nextNumber = lastNumber + 1

    transaction.set(counterRef, { lastNumber: nextNumber }, { merge: true })

    return `TKT-${String(nextNumber).padStart(3, '0')}`
  })

  return ticketId
}
