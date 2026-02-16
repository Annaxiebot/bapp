import { useState } from 'react';
import * as vibe from '../services/vibe';

interface VibePanelProps {
  apiKey?: string;
  provider?: 'gemini' | 'claude';
}

export default function VibePanel({ apiKey, provider = 'gemini' }: VibePanelProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);

  async function handleCustomize() {
    if (!prompt.trim() || !apiKey) return;

    setLoading(true);
    setResult('');

    try {
      const changes = await vibe.processVibePrompt(prompt);
      vibe.applyVibeChanges(changes);
      vibe.saveVibeCustomizations(changes);

      const summary = changes.map(c => `✓ ${c.description}`).join('\n');
      setResult(summary);
      setHistory(prev => [...prev, prompt]);
      setPrompt('');
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    if (confirm('Reset all customizations? 重置所有自定义设置？')) {
      vibe.clearVibeCustomizations();
      setHistory([]);
      setResult('✓ All customizations cleared. Reload the page to see changes.');
    }
  }

  if (!apiKey) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-center">
        <div>
          <div className="text-4xl mb-4">✨</div>
          <p className="text-slate-600 mb-2">Vibe-coding 需要配置 API 密钥</p>
          <p className="text-sm text-slate-500">请在设置中添加 {provider === 'gemini' ? 'Gemini' : 'Claude'} API Key</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          ✨ Vibe Coding
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
            {provider === 'gemini' ? 'Gemini' : 'Claude'}
          </span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Customize the app with natural language
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <p className="font-bold text-blue-900 mb-2">💡 Examples:</p>
          <ul className="text-blue-800 space-y-1 text-xs">
            <li>• "Make the background darker"</li>
            <li>• "Change verse numbers to gold"</li>
            <li>• "Add a keyboard shortcut Ctrl+B to toggle bookmark"</li>
            <li>• "Make the font larger when I press +"</li>
          </ul>
        </div>

        {result && (
          <div className={`p-3 rounded-lg ${result.startsWith('❌') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
            <pre className="text-sm whitespace-pre-wrap">{result}</pre>
          </div>
        )}

        {history.length > 0 && (
          <div>
            <h4 className="font-bold text-slate-700 mb-2">History:</h4>
            <div className="space-y-2">
              {history.map((item, i) => (
                <div key={i} className="p-2 bg-slate-50 rounded text-sm text-slate-600">
                  {i + 1}. {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCustomize()}
            placeholder="Describe what you want... 描述你想要的改变..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={handleCustomize}
            disabled={loading || !prompt.trim()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '...' : 'Apply'}
          </button>
        </div>
        <button
          onClick={handleReset}
          className="w-full px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm"
        >
          Reset All 重置所有
        </button>
      </div>
    </div>
  );
}
