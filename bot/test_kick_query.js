require('dotenv').config();

async function testKickAPIQuery() {
  const clientId = process.env.KICK_CLIENT_ID;
  const clientSecret = process.env.KICK_CLIENT_SECRET;

  try {
    const tokenResponse = await fetch('https://id.kick.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      })
    });
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const resSharke = await fetch('https://api.kick.com/public/v1/channels?slug=sharke', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const body = await resSharke.json();
    console.log(JSON.stringify(body, null, 2));

  } catch (err) {
    console.error('Error:', err);
  }
}

testKickAPIQuery();
