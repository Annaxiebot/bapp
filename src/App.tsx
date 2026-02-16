import { useState, useEffect } from 'react';
import { useBible } from './hooks/useBible';
import { useSettings } from './hooks/useSettings';
import BibleReader from './components/BibleReader';
import Sidebar from './components/Sidebar';
import AIChat from './components/AIChat';
import Notebook from './components/Notebook';
import VibePanel from './components/VibePanel';
import SettingsModal from './components/SettingsModal';
import * as vibe from './services/vibe';

export default function App() {
  const { settings, updateSettings, loading: settingsLoading } = useSettings();
  const bible = useBible('gen', 1);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<'none' | 'ai' | 'notes' | 'vibe'>('none');
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Apply saved vibe customizations on mount
  useEffect(() => {
    if (settings.geminiApiKey) {
      vibe.applySavedCustomizations();
    }
  }, [settings.geminiApiKey]);

  // Load last reading position
  useEffect(() => {
    async function loadLastPosition() {
      const { progress } = await import('./services/storage');
      const last = await progress.getLatest();
      if (last) {
        bible.goTo(last.bookId, last.chapter);
      }
    }
    loadLastPosition();
  }, []);

  if (settingsLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📖</div>
          <div className="text-xl text-slate-600">Loading bapp...</div>
        </div>
      </div>
    );
  }

  const panelWidth = activePanel !== 'none' ? 'w-2/5' : 'w-0';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenSettings={() => setSettingsOpen(true)}
        onNavigate={(bookId, chapter) => {
          bible.goTo(bookId, chapter);
          setSidebarOpen(false);
        }}
        currentBook={bible.bookId}
        currentChapter={bible.chapter}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-slate-800">
              {bible.book?.name} {bible.chapter}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePanel(activePanel === 'vibe' ? 'none' : 'vibe')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                activePanel === 'vibe'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Vibe Coding - Customize the app with AI"
            >
              ✨ Vibe
            </button>
            <button
              onClick={() => setActivePanel(activePanel === 'ai' ? 'none' : 'ai')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                activePanel === 'ai'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🤖 AI
            </button>
            <button
              onClick={() => setActivePanel(activePanel === 'notes' ? 'none' : 'notes')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                activePanel === 'notes'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              📝 Notes
            </button>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Bible reader */}
          <div className={`transition-all duration-300 ${activePanel !== 'none' ? 'w-3/5' : 'w-full'}`}>
            <BibleReader
              bible={bible}
              settings={settings}
              onVerseSelect={setSelectedVerse}
              selectedVerse={selectedVerse}
            />
          </div>

          {/* Side panel */}
          <div className={`${panelWidth} transition-all duration-300 border-l border-slate-200 bg-white overflow-hidden`}>
            {activePanel === 'ai' && (
              <AIChat
                selectedVerse={selectedVerse}
                bookId={bible.bookId}
                chapter={bible.chapter}
                apiKey={settings.geminiApiKey}
              />
            )}
            {activePanel === 'notes' && (
              <Notebook
                selectedVerse={selectedVerse}
                bookId={bible.bookId}
                chapter={bible.chapter}
              />
            )}
            {activePanel === 'vibe' && (
              <VibePanel
                apiKey={settings.geminiApiKey || settings.claudeApiKey}
                provider={settings.aiProvider || 'gemini'}
              />
            )}
          </div>
        </div>
      </div>

      {/* Settings modal */}
      {settingsOpen && (
        <SettingsModal
          settings={settings}
          onSave={updateSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}
