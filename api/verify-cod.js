// api/verify-cod.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing Player ID.' });

  // 🛡️ API Fallback Engine for CODM
  const apis = [
    `https://api.isan.eu.org/nickname/cod?id=${id}`,
    `https://api.kyrie25.me/api/checkid/cod?id=${id}`
  ];

  for (let url of apis) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      const ign = data.name || data.nickname || data.userName || data.username;
      
      if (ign && ign !== "Unknown" && ign !== "Not found") {
        return res.status(200).json({ ign: ign, verified: true });
      }
    } catch (e) {
      continue;
    }
  }

  return res.status(404).json({ error: 'Player not found or verification servers are currently busy.' });
}
