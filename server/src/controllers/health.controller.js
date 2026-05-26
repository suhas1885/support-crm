/**
 * Health check — confirms API is alive (used by frontend / monitoring).
 */
export function getHealth(_req, res) {
  res.json({
    success: true,
    message: 'Support CRM API is running',
    timestamp: new Date().toISOString(),
  })
}
