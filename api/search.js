export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Query is required" });
  }

  const GEMINI_API_KEY = "AQ.Ab8RN6KhfbCMaRP0ncrbRMPMI...";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Answer this user query accurately, clearly, and directly in simple Hindi/Hinglish: ${q}` }]
        }]
      })
    });

    const data = await response.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (answer) {
      return res.status(200).json({ answer: answer.trim() });
    } else {
      throw new Error("Invalid response from Gemini");
    }
  } catch (error) {
    return res.status(200).json({ 
      answer: `Aapka sawaal hai: "${q}". Kripya page ko refresh karke dobara search karein.` 
    });
  }
}
