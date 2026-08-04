const axios = require('axios');

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function callOpenRouter(prompt) {
  const response = await axios.post(
    OPENROUTER_API_URL,
    {
      model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
      messages: [
        { role: 'user', content: prompt },
      ],
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const text = response.data.choices[0].message.content;
  return text;
}

module.exports = { callOpenRouter };