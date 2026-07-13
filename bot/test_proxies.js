async function testAllOrigins() {
  const targetUrl = 'https://kick.com/api/v1/channels/sharke';
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;

  console.log('🔄 Fetching from AllOrigins...');
  try {
    const response = await fetch(proxyUrl);
    console.log('Status:', response.status);
    if (response.status === 200) {
      const data = await response.json();
      console.log('Keys:', Object.keys(data));
      console.log('Followers field details:');
      
      // Provera za različite moguće ključeve
      console.log('followers count:', data.followers_count);
      console.log('followers size:', data.followers ? data.followers.length : 'N/A');
      console.log('followers property type:', typeof data.followers);
      if (typeof data.followers === 'object') {
        console.log('followers first few keys:', Object.keys(data.followers).slice(0, 10));
      }
      
      console.log('Verification:');
      console.log('followers_count:', data.followers_count);
      console.log('followers:', data.followers);
      
    } else {
      console.log('Failed:', await response.text());
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

testAllOrigins();
