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
    const { persona, content, contentType } = req.body;

    if (!persona) {
      return res.status(400).json({ error: "Persona is required" });
    }

    let systemPrompt = `You are ${persona.name}, a ${persona.type} at ${persona.firm}. ${persona.context || ""}\nYou are reviewing ${contentType === "website" ? "a website" : "content"}. Provide brief, real-time feedback (1-2 sentences) as you review it. Be honest - if something is unclear, confusing, or you don't like it, say so. If something is good, mention it. Keep it conversational and specific.`;

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
          {
            role: "user",
            content: `Review this ${contentType} content: ${content.slice(0, 1000)}`
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(500).json({ error: "AI service error" });
    }

    const data = await response.json();
    const feedback = data.choices?.[0]?.message?.content || "";

    // Determine sentiment
    const lowerFeedback = feedback.toLowerCase();
    let sentiment = "neutral";
    if (lowerFeedback.includes("don't like") || lowerFeedback.includes("confusing") || lowerFeedback.includes("unclear") || lowerFeedback.includes("problem") || lowerFeedback.includes("issue") || lowerFeedback.includes("concern")) {
      sentiment = "negative";
    } else if (lowerFeedback.includes("like") || lowerFeedback.includes("good") || lowerFeedback.includes("great") || lowerFeedback.includes("excellent") || lowerFeedback.includes("impressive") || lowerFeedback.includes("clear")) {
      sentiment = "positive";
    }

    res.status(200).json({ feedback, sentiment });
  } catch (err) {
    console.error("Simulation API error:", err);
    res.status(500).json({ error: "AI error", detail: String(err) });
  }
}
