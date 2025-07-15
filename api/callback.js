export default async function handler(req, res) {
  const code = req.query.code;
  const redirect_uri = "https://stream-psi-six.vercel.app/callback.html";

  if (!code) return res.status(400).json({ error: "Código ausente" });

  try {
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: "1388158298305597483",
        client_secret: "hi4eqSy_EMAXNv1oG55HFtgiif0Iqt0n",
        grant_type: "authorization_code",
        code,
        redirect_uri
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return res.status(400).json({ error: "Erro ao obter token", debug: tokenData });
    }

    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const user = await userRes.json();

    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatar
          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
}
