export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // वर्सेल से जेमिनी की नई चाबी उठाई जा रही है
  const apiKey = process.env.GEMINI_API_KEY; 

  try {
    const response = await fetch("https://googleapis.com", {
      method: "POST",
      headers: {
        "Authorization": Bearer ${apiKey},
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash", 
        messages: [{ role: "user", content: query }]
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
