import { useState } from 'react';
import { AppSettings } from '../types';
import * as storage from '../services/storage';

interface SettingsModalProps {
  settings: AppSettings;
  onSave: (settings: Partial<AppSettings>) => void;
  onClose: () => void;
}

export default function SettingsModal({ settings, onSave, onClose }: SettingsModalProps) {
  const [geminiApiKey, setGeminiApiKey] = useState(settings.geminiApiKey || '');
  const [claudeApiKey, setClaudeApiKey] = useState(settings.claudeApiKey || '');
  const [aiProvider, setAiProvider] = useState<'gemini' | 'claude'>(settings.aiProvider || 'gemini');
  const [language, setLanguage] = useState(settings.language);
  const [fontSize, setFontSize] = useState(settings.fontSize);

  function handleSave() {
    onSave({
      geminiApiKey,
      claudeApiKey,
      aiProvider,
      language,
      fontSize,
    });
    onClose();
  }

  async function handleExport() {
    try {
      const data = await storage.exportAll();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bapp-backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Export failed: ' + error);
    }
  }

  async function handleImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        await storage.importAll(text);
        alert('Import successful! 导入成功！');
        window.location.reload();
      } catch (error) {
        alert('Import failed: ' + error);
      }
    };
    input.click();
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-2xl z-50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">⚙️ Settings</h2>
          <button onClick={onClose} className="text-2xl text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* AI Provider */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              AI Provider 提供商
            </label>
            <select
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value as 'gemini' | 'claude')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="gemini">Gemini (Google)</option>
              <option value="claude">Claude (Anthropic)</option>
            </select>
          </div>

          {/* Gemini API Key */}
          {aiProvider === 'gemini' && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Gemini API Key
              </label>
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="Enter your Gemini API key..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                Get your key at{' '}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  aistudio.google.com
                </a>
              </p>
            </div>
          )}

          {/* Claude API Key */}
          {aiProvider === 'claude' && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Claude API Key
              </label>
              <input
                type="password"
                value={claudeApiKey}
                onChange={(e) => setClaudeApiKey(e.target.value)}
                placeholder="Enter your Claude API key..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                Get your key at{' '}
                <a
                  href="https://console.anthropic.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  console.anthropic.com
                </a>
              </p>
            </div>
          )}

          {/* Language */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Display Language 显示语言
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="both">Both 中英双语</option>
              <option value="cn">Chinese Only 仅中文</option>
              <option value="en">English Only 仅英文</option>
            </select>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Font Size 字体大小: {fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Data Management */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-700 mb-3">Data Management 数据管理</h3>
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                Export 导出
              </button>
              <button
                onClick={handleImport}
                className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                Import 导入
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save 保存
          </button>
        </div>
      </div>
    </>
  );
}
