// api/verify-mlbb.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { id, zone } = req.query;

  if (!id || !zone) return res.status(400).json({ error: 'Missing ID/Zone' });

  // 🛡️ API Fallback Engine: Tries multiple free APIs so your site stays up!
  const apis = [
    `https://api.isan.eu.org/nickname/ml?id=${id}&server=${zone}`,
    `https://api.kyrie25.me/api/checkid/ml?id=${id}&zone=${zone}`,
    `https://api.vyturex.com/mlbb?id=${id}&zone=${zone}`
  ];

  for (let url of apis) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      // Different APIs use different JSON labels
      const ign = data.name || data.nickname || data.userName || data.username || data.result;

      if (ign && ign !== "Unknown" && ign !== "Not found" && !ign.includes("Error")) {
        const z = parseInt(zone);
        const isPH = (z >= 3000 && z <= 4500) || (z >= 9000 && z <= 11000) || (z >= 13000);
        return res.status(200).json({ 
          ign: ign, 
          verified: true,
          region: isPH ? "PH Server 🇵🇭" : "Global/Other 🌎"
        });
      }
    } catch (e) {
      // If one API fails, ignore it and automatically try the next one
      continue;
    }
  }

  return res.status(404).json({ error: 'Player not found or verification servers are currently down.' });
}
