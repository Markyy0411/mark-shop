// api/verify-mlbb.js
// Vercel Serverless Function — MLBB Player ID + Zone ID Verification
// Uses cekidml.caliph.dev (open source MLBB checker)

export default async function handler(req, res) {
  // Allow all origins (needed for your frontend to call this)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id, zone } = req.query;

  if (!id || !zone) {
    return res.status(400).json({ error: 'Missing Player ID or Zone ID.' });
  }

  try {
    // Primary: cekidml.caliph.dev
    const response = await fetch(`https://cekidml.caliph.dev/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://cekidml.caliph.dev/'
      },
      body: JSON.stringify({ userId: id, serverId: zone })
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch(e) { data = null; }

    if (data && (data.username || data.nickname || data.name)) {
      const ign = data.username || data.nickname || data.name;
      return res.status(200).json({ ign, verified: true });
    }

    // Fallback: try GET format
    const response2 = await fetch(
      `https://cekidml.caliph.dev/check?userId=${id}&serverId=${zone}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );
    const text2 = await response2.text();
    let data2;
    try { data2 = JSON.parse(text2); } catch(e) { data2 = null; }

    if (data2 && (data2.username || data2.nickname || data2.name)) {
      const ign = data2.username || data2.nickname || data2.name;
      return res.status(200).json({ ign, verified: true });
    }

    return res.status(404).json({ error: 'Player not found. Check your Player ID and Zone ID.' });

  } catch (err) {
    console.error('MLBB verify error:', err.message);
    return res.status(500).json({ error: 'Verification service unavailable. Please type your IGN manually.' });
  }
}
