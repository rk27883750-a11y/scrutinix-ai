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
    const apiRes = await fetch(`https://text.pollinations.ai/${encodeURIComponent(q)}?private=true&model=openai`);
    const data = await apiRes.text();

    return res.status(200).json({ answer: data.trim() });
  } catch (error) {
    return res.status(200).json({ 
      answer: `Aapka sawaal hai: "${q}". Kripya apna internet connection check karke 5 second baad dobara search karein.` 
    });
  }
}
