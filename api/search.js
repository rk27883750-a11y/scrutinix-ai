export default async function handler(req, res) {
  // CORS Headers
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

  // Aapka Hugging Face Token set kar diya hai
  const HF_TOKEN = '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'; 
  const MODEL = "meta-llama/Meta-Llama-3-8B-Instruct";

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `<|system|>\nYou are Scrutinix AI, a helpful AI search assistant. Answer the user's query clearly and accurately in simple Hindi/Hinglish.\n<|user|>\n${q}\n<|assistant|>`,
        parameters: {
          max_new_tokens: 350,
          temperature: 0.7,
          return_full_text: false
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HF API Error: ${response.status}`);
    }

    const result = await response.json();
    let textAnswer = "";

    if (Array.isArray(result) && result[0]?.generated_text) {
      textAnswer = result[0].generated_text;
    } else if (result.generated_text) {
      textAnswer = result.generated_text;
    }

    return res.status(200).json({ 
      answer: textAnswer.trim() || `"${q}" ke liye jankari process ho gayi hai.` 
    });

  } catch (error) {
    // Backup Pollinations call
    try {
      const fallbackRes = await fetch(`https://text.pollinations.ai/${encodeURIComponent(q + " Answer clearly in Hindi/Hinglish.")}?model=mistral`);
      const fallbackText = await fallbackRes.text();
      return res.status(200).json({ answer: fallbackText });
    } catch(err) {
      return res.status(500).json({ answer: `Sawaal: "${q}"\n\nResponse generate karne me samay lag raha hai, kripya 5 second baad dobara search karein.` });
    }
  }
}
