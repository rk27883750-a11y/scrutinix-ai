export default async function handler(req, res) {
  // सिर्फ POST रिक्वेस्ट की अनुमति दें
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY; 

  try {
    // 🚀 जेमिनी का सबसे नया और डायरेक्ट ऑफिशियल रास्ता
    const response = await fetch(https://googleapis.com{apiKey}, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: query }]
        }]
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
