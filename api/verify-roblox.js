export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Missing Username' });
  }

  try {
    // Calling the Official Roblox API
    const response = await fetch(`https://users.roblox.com/v1/usernames/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        usernames: [username],
        excludeBannedUsers: false
      })
    });
    
    const data = await response.json();

    // If Roblox finds the user, it sends back their display name
    if (data.data && data.data.length > 0) {
      return res.status(200).json({ ign: data.data[0].displayName });
    } else {
      return res.status(404).json({ error: 'Username not found.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Roblox verification server is busy.' });
  }
}
