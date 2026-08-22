export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // अब हम यूजर से गिटहब का रिपोजिटरी यूआरएल लेंगे
  const { githubUrl } = req.body;

  if (!githubUrl) {
    return res.status(400).json({ error: 'GitHub URL is required' });
  }

  try {
    // 1. गिटहब यूआरएल से यूजर का नाम और प्रोजेक्ट का नाम अलग करना
    // उदाहरण: https://github.com -> ["user", "repo"]
    const urlParts = githubUrl.replace("https://github.com", "").split("/");
    const owner = urlParts[0];
    const repo = urlParts[1];

    if (!owner || !repo) {
      return res.status(400).json({ error: 'Invalid GitHub URL format' });
    }

    // 2. गिटहब एपीआई से प्रोजेक्ट की मुख्य फाइल (index.html या main.js) का कोड खींचना
    // अभी टेस्टिंग के लिए हम मुख्य index.html का कोड पढ़ रहे हैं
    const githubApiResponse = await fetch(https://github.com{owner}/${repo}/contents/index.html);
    
    if (!githubApiResponse.ok) {
      return res.status(404).json({ error: 'Could not find index.html in this repository' });
    }

    const githubData = await githubApiResponse.json();
    
    // गिटहb कोड Base64 फॉर्मेट में देता है, उसे साधारण टेक्स्ट में बदलना
    const rawCode = Buffer.from(githubData.content, 'base64').toString('utf-8');

    // 3. इस कोड को जेमिनी एआई के पास भेजना ताकि वह गाइड लिख सके
    const apiKey = process.env.GEMINI_API_KEY; 
    const prompt = You are Scrutinix DocBot. Analyze this code and write a beautiful, professional GitHub README.md file in Hindi/English mix language. Explain what the project does, its features, and how to use it:\n\n${rawCode};

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
      return res.status(500).json({ error: 'AI failed to generate documentation' });
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
