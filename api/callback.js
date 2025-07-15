export default async function handler(req, res) {
  const code = req.query.code;
  const redirect_uri = 'https://lily-dashboard-five.vercel.app/callback.html';

  if (!code) return res.status(400).json({ error: 'Código ausente' });

  try {
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: '1392176069070557365',
        client_secret: 'ARWfBzUjAMjZoKIbZHjT9tUbeUk4HlZ6',
        grant_type: 'authorization_code',
        code,
        redirect_uri
      })
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) return res.status(400).json({ error: 'Erro token', debug: tokenData });

    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const user = await userRes.json();

    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
