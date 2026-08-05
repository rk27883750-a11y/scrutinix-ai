export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let userQuery = '';
  if (req.method === 'GET') {
    userQuery = req.query.q;
  } else if (req.method === 'POST') {
    userQuery = req.body?.q || (req.body?.contents && req.body.contents[0]?.parts[0]?.text);
  }

  if (!userQuery) {
    return res.status(400).json({ error: "Query is required" });
  }

  const GEMINI_API_KEY = "AQ.Ab8RN6LhTQnKskrXMKrkrrcjC4vRcL2tYpwpKJrIW_K6HJuGNw";

  try {
    const apiResponse = await fetch(https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: userQuery }]
        }]
      })
    });

    const data = await apiResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong", details: error.message });
  }
}
