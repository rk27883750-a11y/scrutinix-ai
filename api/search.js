export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { githubUrl } = req.body;

  if (!githubUrl) {
    return res.status(400).json({ error: 'GitHub URL is required' });
  }

  try {
    // 1. गिटहब यूआरएल से यूजर और रेपो का नाम निकालना
    const cleanUrl = githubUrl.replace("https://github.com", "");
    const urlParts = cleanUrl.split("/");
    const owner = urlParts[0];
    const repo = urlParts[1];

    if (!owner || !repo) {
      return res.status(400).json({ error: 'Invalid GitHub URL format' });
    }

    // 2. गिटहब एपीआई से index.html का कोड खींचना (User-Agent हेडर के साथ जो एरर को रोकेगा)
    const githubApiResponse = await fetch(https://github.com{owner}/${repo}/contents/index.html, {
      headers: {
        "User-Agent": "Scrutinix-DocBot-App"
      }
    });
    
    if (!githubApiResponse.ok) {
      return res.status(404).json({ error: 'Could not find index.html in this repository' });
    }

    const githubData = await githubApiResponse.json();
    const rawCode = Buffer.from(githubData.content, 'base64').toString('utf-8');

    // 3. जेमिनी डायरेक्ट ऑफिशियल एपीआई को कोड भेजना
    const apiKey = process.env.GEMINI_API_KEY; 
    const prompt = You are Scrutinix DocBot. Analyze this HTML code and write a professional GitHub README.md file in Hindi language. Explain what the project does, its features, and how to use it:\n\n${rawCode};

    const geminiResponse = await fetch(https://googleapis.com{apiKey}, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const geminiData = await geminiResponse.json();

    if (geminiData.candidates && geminiData.candidates[0].content.parts[0].text) {
      return res.status(200).json({ readme: geminiData.candidates[0].content.parts[0].text });
    } else {
      return res.status(500).json({ error: 'AI failed to generate docs: ' + JSON.stringify(geminiData) });
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
