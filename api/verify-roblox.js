// api/verify-roblox.js
// Vercel Serverless Function — Roblox Username Verification
// Uses Roblox's official public API (no key needed)

export default async function handler(req, res) {
 res.setHeader('Access-Control-Allow-Origin', 'https://mark-shop-beryl.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Missing username.' });
  }

  try {
    // Roblox has a free, public API to look up users by username
    const response = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: false })
    });

    const data = await response.json();

    if (data && data.data && data.data.length > 0) {
      const user = data.data[0];
      // Return both the display name and username
      return res.status(200).json({
        ign: user.displayName || user.name,
        username: user.name,
        id: user.id,
        verified: true
      });
    }

    return res.status(404).json({ error: 'Roblox username not found. Check the spelling.' });

  } catch (err) {
    console.error('Roblox verify error:', err.message);
    return res.status(500).json({ error: 'Verification service unavailable. Please check username manually.' });
  }
}
