/**
 * Root endpoint — basic API info (not used by CRM UI, useful for humans/tools).
 */
export function getRoot(_req, res) {
  res.json({
    success: true,
    name: 'Support CRM API',
    version: '1.0.0',
    docs: '/api/health',
  })
}
