import { BIBLE_BOOKS } from '../constants';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onNavigate: (bookId: string, chapter: number) => void;
  currentBook: string;
  currentChapter: number;
}

export default function Sidebar({ open, onClose, onOpenSettings, onNavigate, currentBook, currentChapter }: SidebarProps) {
  if (!open) return null;

  const otBooks = BIBLE_BOOKS.filter(b => b.testament === 'OT');
  const ntBooks = BIBLE_BOOKS.filter(b => b.testament === 'NT');

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 overflow-y-auto shadow-2xl">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-slate-800">📖 bapp</h2>
          <div className="flex gap-2">
            <button
              onClick={onOpenSettings}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Settings"
            >
              ⚙️
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              ✕
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-bold text-slate-600 mb-3">旧约 Old Testament</h3>
          <div className="space-y-1 mb-6">
            {otBooks.map((book) => (
              <button
                key={book.id}
                onClick={() => {
                  onNavigate(book.id, 1);
                  onClose();
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  currentBook === book.id
                    ? 'bg-blue-100 text-blue-800 font-semibold'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                {book.name}
                <span className="text-xs text-slate-500 ml-2">({book.chapters}章)</span>
              </button>
            ))}
          </div>

          <h3 className="text-sm font-bold text-slate-600 mb-3">新约 New Testament</h3>
          <div className="space-y-1">
            {ntBooks.map((book) => (
              <button
                key={book.id}
                onClick={() => {
                  onNavigate(book.id, 1);
                  onClose();
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  currentBook === book.id
                    ? 'bg-blue-100 text-blue-800 font-semibold'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                {book.name}
                <span className="text-xs text-slate-500 ml-2">({book.chapters}章)</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
