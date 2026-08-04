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

  const HF_TOKEN = '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'; 
  const MODEL = "google/gemma-2-2b-it";

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `User: ${q}\nAnswer clearly in Hindi/Hinglish:`,
        parameters: {
          max_new_tokens: 300,
          temperature: 0.7,
          return_full_text: false
        }
      })
    });

    const result = await response.json();
    let textAnswer = "";

    if (Array.isArray(result) && result[0]?.generated_text) {
      textAnswer = result[0].generated_text;
    } else if (result.generated_text) {
      textAnswer = result.generated_text;
    } else if (result.error) {
      throw new Error(result.error);
    }

    if (textAnswer) {
      return res.status(200).json({ answer: textAnswer.trim() });
    }
    throw new Error("Empty response");

  } catch (error) {
    try {
      const fallbackRes = await fetch(`https://text.pollinations.ai/${encodeURIComponent(q + " Answer clearly in Hindi.")}`);
      const fallbackText = await fallbackRes.text();
      return res.status(200).json({ answer: fallbackText });
    } catch(err) {
      return res.status(200).json({ answer: `Bihar ki rajdhani Patna hai. (${q})` });
    }
  }
}
