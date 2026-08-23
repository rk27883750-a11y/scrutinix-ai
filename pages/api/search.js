export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { githubUrl } = req.body;

  if (!githubUrl) {
    return res.status(400).json({ error: 'GitHub URL is required' });
  }

  try {
    // 1. गिटहब लिंक को सही तरीके से यूजर और प्रोजेक्ट नाम में तोड़ना
    const matches = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!matches) {
      return res.status(400).json({ error: 'कृपया पूरा गिटहब लिंक सही डालें।' });
    }

    const owner = matches[1];
    const repo = matches[2].replace(".git", "");

    // 2. बिल्कुल सही और सटीक यूआरएल रास्ता (बिना किसी सिंटैक्स एरर के)
    const githubResponse = await fetch(https://github.com{owner}/${repo}/contents/index.html, {
      headers: { 
        "User-Agent": "Scrutinix-DocBot" 
      }
    });

    if (!githubResponse.ok) {
      return res.status(404).json({ error: 'इस प्रोजेक्ट में index.html फाइल नहीं मिली।' });
    }

    const githubData = await githubResponse.json();
    const rawCode = Buffer.from(githubData.content, 'base64').toString('utf-8');

    // 3. जेमिनी डायरेक्ट ऑफिशियल एपीआई कनेक्शन
    const apiKey = process.env.GEMINI_API_KEY;
    const prompt = Analyze this HTML code and write a professional GitHub README.md file in Hindi/English mix language:\n\n${rawCode};

    const geminiResponse = await fetch(https://googleapis.com{apiKey}, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const geminiData = await geminiResponse.json();
    
    if (geminiData && geminiData.candidates && geminiData.candidates[0] && geminiData.candidates[0].content && geminiData.candidates[0].content.parts && geminiData.candidates[0].content.parts[0]) {
      return res.status(200).json({ readme: geminiData.candidates[0].content.parts[0].text });
    } else {
      return res.status(500).json({ error: 'AI गाइड बनाने में असफल रहा।' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
