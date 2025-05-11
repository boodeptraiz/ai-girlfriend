import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { message } = req.body;
  const openai = process.env.OPENAI_API_KEY;

  const completion = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'Bạn là một cô gái Việt trầm cảm, lạnh lùng, thì thầm.' },
      { role: 'user', content: message }
    ]
  }, {
    headers: { Authorization: `Bearer ${openai}` }
  });

  const text = completion.data.choices[0].message.content;
  const audio = null;

  res.status(200).json({ text, audio });
}
