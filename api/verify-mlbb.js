export default async function handler(req, res) {
  const { id, zone } = req.query;

  if (!id || !zone) {
    return res.status(400).json({ error: 'Missing Player ID or Zone ID' });
  }

  try {
    const response = await fetch(`https://api.isan.eu.org/nickname/ml?id=${id}&zone=${zone}`);
    const data = await response.json();

    if (data.success && data.name) {
      return res.status(200).json({ ign: data.name });
    } else {
      return res.status(404).json({ error: 'Player not found. Check ID and Zone.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Verification server is busy.' });
  }
}
