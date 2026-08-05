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

  const GEMINI_API_KEY = "AQ.Ab8RN6I__cwKPYgSatOwy-3nZpS1QhEq2q8FoGLmRl_oPxnCkQ";

  try {
    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY.trim()}`, {
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

    const data = await apiResponse.json();
    
    if (data && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const answer = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ answer: answer.trim() });
    } else {
      const errorMsg = data.error ? data.error.message : "Unknown API error";
      return res.status(200).json({ answer: `API Error: ${errorMsg}` });
    }
  } catch (error) {
    return res.status(200).json({ 
      answer: "Connection error. Kripya kuch samay baad prayas karein." 
    });
  }
}
