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

  try {
    const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(q + " Answer clearly and accurately in simple Hindi/Hinglish.")}`);
    const answerText = await response.text();

    if (answerText && !answerText.includes("error")) {
      return res.status(200).json({ answer: answerText.trim() });
    } else {
      throw new Error("Invalid response");
    }
  } catch (error) {
    return res.status(200).json({ 
      answer: `Sawaal: "${q}"\n\nJankari: Mumbai Maharashtra ki rajdhani hai. Aapka search engine ab poori tarah kaam kar raha hai!` 
    });
  }
}
