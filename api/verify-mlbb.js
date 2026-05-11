export default async function handler(req, res) {
  // Allow the frontend to talk to this backend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id, zone } = req.query;

  if (!id || !zone) {
    return res.status(400).json({ error: 'Missing Player ID or Zone ID.' });
  }

  try {
    // Calling the highly reliable ISAN Cloudflare API
    const response = await fetch(`https://api.isan.eu.org/nickname/ml?id=${id}&server=${zone}`);
    const data = await response.json();

    if (data.success && data.name) {
      return res.status(200).json({ ign: data.name, verified: true });
    } else {
      return res.status(404).json({ error: 'Player not found. Check ID and Zone.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Verification server is currently busy.' });
  }
}
