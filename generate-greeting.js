export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, relationship, customDetails, selectedStyle } = req.body;

    const prompt = `Generate a warm, festive Diwali greeting in ${selectedStyle} style for ${name}, who is my ${relationship}. ${customDetails ? `Additional context: ${customDetails}` : ''}. The greeting should be between 2-4 sentences, cheerful, and appropriate for the Diwali festival.`;

    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    if (!apiResponse.ok) {
      throw new Error(`API error: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    const greeting = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    res.status(200).json({ greeting });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate greeting' });
  }
}
