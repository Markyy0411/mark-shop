// api/verify-cod.js
// Vercel Serverless Function — Garena CoD Player Verification
// Note: Garena has no public API. This returns a soft error so IGN can be typed manually.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing Player ID.' });
  }

  // Garena does not have a public player lookup API.
  // Return a graceful error so the frontend unlocks manual IGN entry.
  return res.status(404).json({
    error: 'Garena CoD auto-verify is not available. Please type your IGN manually.',
    manualEntry: true
  });
}
