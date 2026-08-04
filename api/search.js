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

  const lowerQ = q.toLowerCase();
  let customAnswer = "";

  // Common keywords matching for instant robust responses
  if (lowerQ.includes("pani") || lowerQ.includes("water")) {
    customAnswer = "Pani ko English me 'Water' kaha jata hai.";
  } else if (lowerQ.includes("bihar")) {
    customAnswer = "Bihar ki rajdhani Patna hai.";
  } else if (lowerQ.includes("mumbai")) {
    customAnswer = "Mumbai Maharashtra ki rajdhani hai.";
  } else if (lowerQ.includes("job") || lowerQ.includes("naukri")) {
    customAnswer = "Job dhoondhne ke liye aap LinkedIn, Naukri.com, aur Indeed ka upyog kar sakte hain.";
  } else {
    customAnswer = `Aapka sawaal hai: "${q}". Scrutinix AI search engine par iski jankari keval kuch hi der me update ki ja rahi hai. Kripya apna search dobara try karein.`;
  }

  try {
    const apiRes = await fetch(`https://text.pollinations.ai/prompt/${encodeURIComponent(q)}`);
    const data = await apiRes.text();

    if (data && !data.includes("error") && data.length > 3) {
      return res.status(200).json({ answer: data.trim() });
    }
  } catch (err) {
    // Ignore error and use smart backup
  }

  return res.status(200).json({ answer: customAnswer });
}
