import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
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
    res.status(200).json({ text, audio: null });

  } catch (err: any) {
    console.error("💥 GPT API lỗi:", err?.response?.data || err.message);
    res.status(500).json({
      error: 'GPT API error',
      detail: err?.response?.data || err.message
    });
  }
}
