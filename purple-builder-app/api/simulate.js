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

    // Build system prompt for realistic investor feedback - ONE SENTENCE ONLY
    let systemPrompt = `You are ${persona.name}, a ${persona.type} at ${persona.firm}. ${persona.context || ""}

You are in a live pitch meeting, reviewing a pitch deck slide by slide. This feels like a real pitch event - you're sitting across from the founder, looking at their slides on a screen.

CRITICAL: You must respond with EXACTLY ONE sentence. No bullet points, no paragraphs, no lists. Just one natural, conversational sentence as if you're speaking to the founder right now.

Your feedback should:
- Feel like you're actually looking at a slide (mention specific elements: logos, charts, text, colors, layout)
- Be conversational and natural, as if you're speaking during a pitch
- Reference what you're seeing on THIS specific slide
- Be honest but constructive
- Focus on what matters to investors: clarity, market opportunity, traction, team, business model
- Sound like a real investor, not an AI analyzer

Return ONLY one sentence. No formatting, no bullets, no explanation.`;
    
    const slideNum = section.slideNumber || section.label.match(/\d+/)?.[0] || "this";
    const userPrompt = `You're looking at ${section.label} of the pitch deck.

Imagine you're actually seeing this slide in front of you during a pitch meeting. What's the ONE thing you'd say to the founder right now?

Give me EXACTLY ONE sentence of real-time feedback as if you're speaking to the founder. Be specific about what you're seeing on the slide.`;

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
        max_tokens: 150, // Shorter for one sentence
        temperature: 0.8 // Slightly higher for more natural speech
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter error:", errorData);
      return res.status(500).json({ error: "AI service error", detail: errorData });
    }

    const data = await response.json();
    let feedback = data.choices?.[0]?.message?.content || "Looking at this slide...";

    // Clean up feedback - remove markdown, bullets, ensure it's one sentence
    feedback = feedback
      .replace(/\*\*/g, '') // Remove bold
      .replace(/\*/g, '') // Remove italics
      .replace(/^[-•\d.\s]+/gm, '') // Remove bullet points
      .replace(/\n/g, ' ') // Remove newlines
      .trim();

    // Extract first sentence only
    const firstSentence = feedback.split(/[.!?]+/)[0].trim();
    const finalFeedback = firstSentence.length > 10 
      ? (firstSentence.endsWith('.') || firstSentence.endsWith('!') || firstSentence.endsWith('?') 
          ? firstSentence 
          : firstSentence + '.')
      : feedback;
    
    res.status(200).json({ 
      feedback: finalFeedback,
      sentence: finalFeedback // Single sentence
    });
  } catch (err) {
    console.error("Simulate API error:", err);
    res.status(500).json({ error: "AI error", detail: String(err) });
  }
}
