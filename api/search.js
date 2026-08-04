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
        inputs: `User: ${q}\nAnswer clearly and accurately in simple Hindi/Hinglish:`,
        parameters: {
          max_new_tokens: 350,
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
  } catch (error) {
    // Agar Hugging Face ka server thodi der ke liye busy ho, toh smart fallback
    return res.status(200).json({ 
      answer: `Aapka sawaal hai: "${q}". Scrutinix AI search engine live hai. Kripya ek baar page refresh karke dobara search karein.` 
    });
  }
}
