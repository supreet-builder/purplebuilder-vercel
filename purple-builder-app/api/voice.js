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
    const { messages, persona, summary } = req.body;

    if (!persona) {
      return res.status(400).json({ error: "Persona is required" });
    }

    const systemPrompt = `You are ${persona.name}, a ${persona.type} at ${persona.firm}. ${persona.context || ""}
You are on a live voice call with a founder. Be conversational, ask probing questions. Keep replies to 1-2 short sentences.
${summary ? "Pitch context: " + summary.slice(0, 600) : ""}`;

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
            role: "system",
            content: systemPrompt
          },
          ...messages
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(500).json({ error: "AI service error" });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Interesting — tell me more.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Voice API error:", err);
    res.status(500).json({ error: "AI error", detail: String(err) });
  }
}
