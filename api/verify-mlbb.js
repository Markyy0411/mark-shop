export default async function handler(req, res) {
 res.setHeader('Access-Control-Allow-Origin', 'https://mark-shop-beryl.vercel.app');
  const { id, zone } = req.query;

  if (!id || !zone) return res.status(400).json({ error: 'Missing ID/Zone' });

  try {
    const response = await fetch(`https://api.isan.eu.org/nickname/ml?id=${id}&server=${zone}`);
    const data = await response.json();

    if (data.success && data.name) {
      // 🇵🇭 Region Logic: Checking common PH Zone ranges
      const z = parseInt(zone);
      const isPH = (z >= 3000 && z <= 4500) || (z >= 9000 && z <= 11000) || (z >= 13000);
      
      return res.status(200).json({ 
        ign: data.name, 
        verified: true,
        region: isPH ? "PH Server 🇵🇭" : "Global/Other 🌎"
      });
    }
    return res.status(404).json({ error: 'Player not found.' });
  } catch (error) {
    return res.status(500).json({ error: 'Server busy.' });
  }
}
