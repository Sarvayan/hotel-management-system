import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateDescription = async (req, res) => {
  const { summary } = req.body;

  try {
    const prompt = `Generate a professional and brief description for blacklisting a guest based on the following reason: "${summary}".`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 60,
    });

    const description = completion.choices[0].message.content.trim();
    res.json({ description });
  } catch (error) {
    console.error("OpenAI Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate description" });
  }
};

export const generateDenyDescription = async (req, res) => {
  const { summary } = req.body;

  try {
    const prompt = `Generate a professional and brief description for denying a booking based on the following reason: "${summary}".`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 60,
    });

    const description = completion.choices[0].message.content.trim();
    res.json({ description });
  } catch (error) {
    console.error("OpenAI Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate description" });
  }
};

export const generateEventDescription = async (req, res) => {
  const { eventName } = req.body;

  try {
    const prompt = `Generate a professional and concise description for the event titled "${eventName}" to be added to the villa management system.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 60,
    });

    const description = completion.choices[0].message.content.trim();
    res.json({ description });
  } catch (error) {
    console.error("OpenAI Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate description" });
  }
};
