import { useState, useEffect } from 'react';
import * as storage from '../services/storage';
import { Note } from '../types';

interface NotebookProps {
  selectedVerse: string | null;
  bookId: string;
  chapter: number;
}

export default function Notebook({ selectedVerse, bookId, chapter }: NotebookProps) {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    loadNotes();
  }, [bookId, chapter]);

  useEffect(() => {
    if (selectedVerse) {
      loadNote(selectedVerse);
    }
  }, [selectedVerse]);

  async function loadNotes() {
    const allNotes = await storage.notes.getAll();
    const chapterNotes = allNotes.filter(n => n.id.startsWith(`${bookId}:${chapter}:`));
    setNotes(chapterNotes);
  }

  async function loadNote(verseId: string) {
    const note = await storage.notes.get(verseId);
    setContent(note?.content || '');
  }

  async function saveNote() {
    if (!selectedVerse) return;

    setSaving(true);
    try {
      if (content.trim()) {
        await storage.notes.save({
          id: selectedVerse,
          content,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      } else {
        await storage.notes.delete(selectedVerse);
      }
      await loadNotes();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <h3 className="font-bold text-slate-800">📝 My Notes</h3>
        {selectedVerse && (
          <p className="text-sm text-slate-600 mt-1">Editing: {selectedVerse}</p>
        )}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedVerse ? (
          <>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your notes here... 在此记录笔记..."
              className="flex-1 p-4 border-none focus:outline-none resize-none"
            />
            <div className="p-4 border-t border-slate-200 flex gap-2">
              <button
                onClick={saveNote}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : 'Save Note 保存'}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-slate-500 mb-4">Select a verse to add notes</p>
            {notes.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold text-slate-700">Chapter Notes:</h4>
                {notes.map((note) => (
                  <div key={note.id} className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-xs font-bold text-slate-600 mb-1">
                      Verse {note.id.split(':')[2]}
                    </div>
                    <p className="text-sm text-slate-700">{note.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
