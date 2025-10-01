// api/generate-greeting.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, relationship, customDetails, style } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const prompt = `Generate a warm, festive Diwali greeting in ${style} style for ${name}, who is my ${relationship}. ${customDetails ? `Additional context: ${customDetails}` : ''}. The greeting should be between 2-4 sentences, cheerful, and appropriate for the Diwali festival.`;

    const API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const greeting = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    res.status(200).json({ 
      success: true,
      greeting: greeting || "May the divine light of Diwali bring peace, prosperity, and happiness to you and your family. Wishing you a joyous festival and a wonderful year ahead!"
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      greeting: getFallbackGreeting(req.body.name)
    });
  }
}

function getFallbackGreeting(name) {
  const fallbackGreetings = [
    `Wishing ${name} and your loved ones a Diwali filled with joy, prosperity, and the warmth of family and friends. May the divine light of Diwali bring peace and happiness to your life.`,
    `May the beautiful festival of Diwali fill ${name}'s home and heart with countless blessings, joy, and prosperity. Wishing you a sparkling and safe celebration!`,
    `As you celebrate the festival of lights, ${name}, may your life be filled with new hopes, opportunities, and success. Happy Diwali to you and your family!`
  ];
  return fallbackGreetings[Math.floor(Math.random() * fallbackGreetings.length)];
}
