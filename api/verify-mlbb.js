export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { id, zone } = req.query;

  if (!id || !zone) return res.status(400).json({ error: 'Missing ID/Zone' });

  // 🛡️ FRESH API Fallback Engine (Updated May 2026)
  const apis = [
    `https://yanjiestore.com/submitt.php?ID=${id}&server=${zone}`,
    `https://api.sanzy.dev/mlbb/check?id=${id}&zone=${zone}`,
    `https://api.elxyz.me/api/mlbb?id=${id}&zone=${zone}`
  ];

  for (let url of apis) {
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }});
      
      // Some APIs return text, some return JSON. We handle both.
      const text = await response.text();
      let ign = "";

      try {
        const data = JSON.parse(text);
        ign = data.name || data.nickname || data.userName || data.username || data.result || "";
      } catch(e) {
        // If it's plain text (like yanjiestore)
        ign = text.trim();
      }

      if (ign && ign.length > 0 && !ign.toLowerCase().includes("not found") && !ign.includes("Error") && !ign.includes("<")) {
        return res.status(200).json({ ign: ign, verified: true });
      }
    } catch (e) {
      continue; // Try the next API in the list
    }
  }

  // If all APIs are dead, send a specific error flag to the frontend
  return res.status(404).json({ error: 'Servers busy', allowManual: true });
}
