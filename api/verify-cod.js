export default async function handler(req, res) {
  const { id } = req.query; // CODM only needs Player ID, no Zone ID

  if (!id) {
    return res.status(400).json({ error: 'Missing Player ID' });
  }

  try {
    // Calling the CODM database (Assuming the same provider supports CODM)
    const response = await fetch(`https://api.isan.eu.org/nickname/codm?id=${id}`);
    const data = await response.json();

    if (data.success && data.name) {
      return res.status(200).json({ ign: data.name });
    } else {
      return res.status(404).json({ error: 'Player not found. Check ID.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Verification server is busy.' });
  }
}
