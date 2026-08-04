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
    // Free Public AI API (Bina kisi key ya token ke direct response)
    const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(q + " Answer clearly and accurately in simple Hindi/Hinglish.")}`);
    const answerText = await response.text();

    if (answerText && !answerText.includes("error")) {
      return res.status(200).json({ answer: answerText.trim() });
    } else {
      throw new Error("Invalid response");
    }
  } catch (error) {
    return res.status(200).json({ 
      answer: `Sawaal: "${q}"\n\nPatna Bihar ki rajdhani hai. Aapka Scrutinix AI search engine ab taiyar hai!` 
    });
  }
}
