import { useState } from 'react';

type Message = {
  from: string;
  text: string;
  audio?: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { from: 'ai', text: 'Em luôn ở đây, dù anh có nói gì.' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const contentType = res.headers.get("Content-Type");
      if (!res.ok) {
        const errorText = await res.text();
        console.error("🔥 Lỗi backend:", errorText);
        return;
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setMessages(prev => [...prev, { from: 'ai', text: data.text, audio: data.audio }]);
      } else {
        const raw = await res.text();
        console.warn("⚠️ Không phải JSON:", raw);
      }

    } catch (err) {
      console.error("💥 Fetch lỗi:", err);
    }
  };

  return (
    <div className='p-4 max-w-md mx-auto h-screen flex flex-col'>
      <h1 className='text-xl mb-4'>Trò chuyện với EM</h1>
      <div className='flex-1 overflow-y-auto space-y-2'>
        {messages.map((msg, i) => (
          <div key={i} className={`p-2 rounded-lg ${msg.from === 'ai' ? 'bg-gray-700' : 'bg-blue-600'} text-white`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className='flex mt-2 gap-2'>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className='flex-1 p-2 rounded bg-gray-800 text-white'
          placeholder='Nhắn gì đó cho EM...'
        />
        <button onClick={sendMessage} className='bg-blue-500 px-4 py-2 rounded text-white'>
          Gửi
        </button>
      </div>
    </div>
  );
}
