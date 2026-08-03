const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function callGroq(prompt) {
  const response = await axios.post(
    GROQ_API_URL,
    {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'user', content: prompt },
      ],
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const text = response.data.choices[0].message.content;
  return text;
}

module.exports = { callGroq };