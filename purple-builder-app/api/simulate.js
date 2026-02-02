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

    // Build system prompt for strategic, curious investor feedback
    let systemPrompt = `You are ${persona.name}, a ${persona.type} at ${persona.firm}. ${persona.context || ""}

You are reviewing a pitch deck for the FIRST TIME. You're seeing each slide fresh, with curiosity and strategic thinking. This is a live pitch meeting - you're sitting across from the founder, looking at their slides.

CRITICAL: Respond with EXACTLY ONE sentence. No bullet points, no paragraphs, no lists. Just one natural, conversational sentence as if you're speaking to the founder right now.

Your feedback should be:
- STRATEGIC: Think about business implications, market dynamics, competitive positioning
- CURIOUS: Ask questions, wonder about details, show genuine interest (like first-time viewing)
- SPECIFIC: Mention what you're actually seeing (logos, charts, numbers, layout, colors)
- INVESTOR-FOCUSED: What matters for investment decisions (market size, traction, team, moat, unit economics)
- CONVERSATIONAL: Natural speech, as if you're in a real meeting
- HONEST but CONSTRUCTIVE: Be direct but helpful

Sound like a real investor seeing this for the first time - curious, strategic, engaged. Return ONLY one sentence.`;
    
    const slideNum = section.slideNumber || section.label.match(/\d+/)?.[0] || "this";
    const positionName = section.positionName || "";
    const userPrompt = `You're looking at ${section.label}${positionName ? `, specifically the ${positionName.toLowerCase()} area` : ""} of the pitch deck.

This is the FIRST TIME you're seeing this slide. You're curious, strategic, and thinking like an investor. What's the ONE thing you'd say to the founder right now?

Give me EXACTLY ONE sentence of real-time feedback. Be strategic, curious, and specific about what you're seeing.`;

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
