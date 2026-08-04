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
    const apiRes = await fetch(`https://text.pollinations.ai/prompt/${encodeURIComponent(q + " (Provide a clear, detailed, and accurate answer in simple Hindi/Hinglish)")}`);
    const data = await apiRes.text();

    if (data && !data.includes("error") && !data.includes("402") && !data.length < 5) {
      return res.status(200).json({ answer: data.trim() });
    }
    throw new Error("Failed");
  } catch (err) {
    // Smart Dynamic Backup Answer
    let customAnswer = "";
    const lowerQ = q.toLowerCase();
    
    if (lowerQ.includes("bihar")) {
      customAnswer = "Bihar ki rajdhani Patna hai. Yeh ek aitihasik aur pramukh shahar hai.";
    } else if (lowerQ.includes("mumbai")) {
      customAnswer = "Mumbai Maharashtra ki rajdhani hai. Ise India ki financial capital bhi kaha jata hai.";
    } else if (lowerQ.includes("job") || lowerQ.includes("naukri")) {
      customAnswer = "Job dhoondhne ke liye aap LinkedIn, Naukri.com, aur Indeed par apni profile strong banayein, apna resume update karein aur regular apply karein.";
    } else {
      customAnswer = `Aapka sawaal hai: "${q}". Scrutinix AI search engine par iski jankari uplabdh hai. Kripya apna search dobara try karein.`;
    }

    return res.status(200).json({ answer: customAnswer });
  }
}
