// api/verify-cod.js
// Vercel Serverless Function — Call of Duty Mobile Player Verification

export default async function handler(req, res) {
  // Allow the frontend to talk to this backend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing Player ID.' });
  }

  try {
    // Calling the highly reliable ISAN Cloudflare API for CODM
    const response = await fetch(`https://api.isan.eu.org/nickname/cod?id=${id}`);
    const data = await response.json();

    if (data.success && data.name) {
      return res.status(200).json({ ign: data.name, verified: true });
    } else {
      return res.status(404).json({ error: 'Player not found. Check Player ID.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Verification server is currently busy.' });
  }
}
