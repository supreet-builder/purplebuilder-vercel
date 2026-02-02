export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { fileData, fileName, fileType } = req.body;

    const content = `Pitch deck file: "${fileName}". Generate a comprehensive summary covering: Executive Summary, Problem, Solution, Market (TAM/SAM/SOM), Business Model, Traction, Competition, Go-to-Market, Team, Financials, Funding Ask.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.VERCEL_URL || "https://purplebuilder.ai",
        "X-Title": "PurpleBuilder"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `${content}\n\nProvide a thorough AI summary of this pitch deck. Cover every section. Be structured and comprehensive.`
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(500).json({ error: "AI service error" });
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content || "Summary unavailable.";

    res.status(200).json({ summary });
  } catch (err) {
    console.error("Summary API error:", err);
    res.status(500).json({ error: "AI error", detail: String(err) });
  }
}
