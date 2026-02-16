import { useState, useEffect, useRef } from 'react';
import * as bibleService from '../services/bible';
import * as ai from '../services/ai';

interface AIChatProps {
  selectedVerse: string | null;
  bookId: string;
  chapter: number;
  apiKey?: string;
}

export default function AIChat({ selectedVerse, bookId, chapter, apiKey }: AIChatProps) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!question.trim() || !apiKey) return;

    const userMessage = question;
    setQuestion('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      let response: string;

      if (selectedVerse) {
        const [bookId, chapterStr, verseStr] = selectedVerse.split(':');
        const verse = await bibleService.getVerse(bookId, parseInt(chapterStr), parseInt(verseStr));
        
        if (verse) {
          response = await ai.analyzeVerse(verse, userMessage);
        } else {
          response = 'Verse not found.';
        }
      } else {
        const verses = await bibleService.getChapter(bookId, chapter);
        const context = verses.map(v => `${v.verse}. ${v.textCn}`).join('\n');
        response = await ai.askQuestion(context, userMessage);
      }

      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'ai', content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!apiKey) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-center">
        <div>
          <div className="text-4xl mb-4">🔑</div>
          <p className="text-slate-600 mb-2">AI研究需要配置 API 密钥</p>
          <p className="text-sm text-slate-500">请在设置中添加 Gemini API Key</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <h3 className="font-bold text-slate-800">🤖 AI Scholar</h3>
        {selectedVerse && (
          <p className="text-sm text-slate-600 mt-1">Selected: {selectedVerse}</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 mt-8">
            <p>Ask me anything about the Scripture!</p>
            <p className="text-sm mt-2">向我询问任何关于圣经的问题</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-100 text-blue-900 ml-8'
                : 'bg-slate-100 text-slate-800 mr-8'
            }`}
          >
            <div className="text-xs font-bold mb-1">
              {msg.role === 'user' ? '🙋 You' : '🤖 AI'}
            </div>
            <div className="whitespace-pre-wrap">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="text-center text-slate-500">
            <div className="animate-pulse">Thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question... 提问..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={loading || !question.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
