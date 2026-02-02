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
    const { messages, persona, summary, topics } = req.body;

    if (!persona) {
      return res.status(400).json({ error: "Persona is required" });
    }

    // Build system prompt from persona
    let systemPrompt = `You are ${persona.name}, a ${persona.type} at ${persona.firm}. ${persona.context || ""}\nRespond in character. Ask probing questions. Keep to 2-4 sentences.`;
    
    if (topics && topics.length > 0) {
      systemPrompt += `\nTopics: ${topics.join(", ")}.`;
    }
    
    if (summary) {
      systemPrompt += `\nDeck context: ${summary.slice(0, 800)}`;
    }

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
        max_tokens: 600,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter error:", errorData);
      return res.status(500).json({ error: "AI service error", detail: errorData });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Tell me more.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    res.status(500).json({ error: "AI error", detail: String(err) });
  }
}
