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
    const { persona, section, previewMode } = req.body;

    if (!persona) {
      return res.status(400).json({ error: "Persona is required" });
    }

    if (!section) {
      return res.status(400).json({ error: "Section is required" });
    }

    // Build system prompt for section feedback
    let systemPrompt = `You are ${persona.name}, a ${persona.type} at ${persona.firm}. ${persona.context || ""}
You are reviewing ${previewMode === "deck" ? "a pitch deck" : "a website"} section by section.
Provide concise, actionable feedback as an investor would. Be specific and honest.
Format your response as 3-6 bullet points. Each bullet should be one line, actionable, and investor-focused.`;

    const userPrompt = `Review this section: "${section.label}"
${section.textSnippet ? `\nContent snippet: ${section.textSnippet.slice(0, 800)}` : ""}

Provide 3-6 bullet points of feedback. Be specific about what works, what doesn't, and what could be improved.`;

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
            content: userPrompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter error:", errorData);
      return res.status(500).json({ error: "AI service error", detail: errorData });
    }

    const data = await response.json();
    const feedback = data.choices?.[0]?.message?.content || "No feedback available.";

    // Format feedback as bullets
    const feedbackBullets = feedback
      .split('\n')
      .filter(line => line.trim() && (line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().match(/^\d+\./)))
      .map(line => line.replace(/^[-•\d.\s]+/, '').trim())
      .filter(line => line.length > 0);

    res.status(200).json({ 
      feedback: feedbackBullets.length > 0 ? feedbackBullets.join('\n') : feedback,
      feedbackBullets: feedbackBullets.length > 0 ? feedbackBullets : [feedback]
    });
  } catch (err) {
    console.error("Simulate API error:", err);
    res.status(500).json({ error: "AI error", detail: String(err) });
  }
}
