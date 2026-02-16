import { useEffect, useRef } from 'react';
import { BibleVerse, AppSettings } from '../types';

interface BibleReaderProps {
  bible: {
    bookId: string;
    chapter: number;
    verses: BibleVerse[];
    loading: boolean;
    error: string | null;
    book: any;
    maxChapters: number;
    nextChapter: () => void;
    prevChapter: () => void;
  };
  settings: AppSettings;
  onVerseSelect: (verseId: string | null) => void;
  selectedVerse: string | null;
}

export default function BibleReader({ bible, settings, onVerseSelect, selectedVerse }: BibleReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') {
        bible.prevChapter();
      } else if (e.key === 'ArrowRight') {
        bible.nextChapter();
      }
    }

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [bible]);

  // Touch swipe navigation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartX = 0;
    let touchEndX = 0;

    function handleTouchStart(e: TouchEvent) {
      touchStartX = e.touches[0].clientX;
    }

    function handleTouchEnd(e: TouchEvent) {
      touchEndX = e.changedTouches[0].clientX;
      handleSwipe();
    }

    function handleSwipe() {
      const diff = touchStartX - touchEndX;
      const threshold = 50;

      if (diff > threshold) {
        bible.nextChapter();
      } else if (diff < -threshold) {
        bible.prevChapter();
      }
    }

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [bible]);

  if (bible.loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <div className="text-slate-600">Loading chapter...</div>
        </div>
      </div>
    );
  }

  if (bible.error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-600">
          <div className="text-4xl mb-4">❌</div>
          <div>{bible.error}</div>
        </div>
      </div>
    );
  }

  const showChinese = settings.language === 'cn' || settings.language === 'both';
  const showEnglish = settings.language === 'en' || settings.language === 'both';

  return (
    <div ref={containerRef} className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Chapter header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            {bible.book?.name} 第 {bible.chapter} 章
          </h2>
          <p className="text-lg text-slate-600">
            {bible.book?.nameEn} Chapter {bible.chapter}
          </p>
        </div>

        {/* Verses */}
        <div className="space-y-4 mb-16">
          {bible.verses.map((verse) => {
            const verseId = `${verse.bookId}:${verse.chapter}:${verse.verse}`;
            const isSelected = selectedVerse === verseId;

            return (
              <div
                key={verseId}
                onClick={() => onVerseSelect(isSelected ? null : verseId)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-50 border-2 border-blue-300 shadow-md'
                    : 'hover:bg-slate-50 border-2 border-transparent'
                }`}
                style={{ fontSize: `${settings.fontSize}px` }}
              >
                <div className="flex gap-4">
                  <span className="text-slate-400 font-bold min-w-[40px] text-right">
                    {verse.verse}
                  </span>
                  <div className="flex-1 space-y-2">
                    {showChinese && (
                      <p className="text-slate-800 leading-relaxed">{verse.textCn}</p>
                    )}
                    {showEnglish && (
                      <p className="text-slate-600 leading-relaxed italic">{verse.textEn}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation buttons */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 bg-white rounded-full shadow-lg px-6 py-3 border border-slate-200">
          <button
            onClick={bible.prevChapter}
            disabled={bible.bookId === 'gen' && bible.chapter === 1}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>
          <div className="flex items-center px-4 text-sm text-slate-600">
            {bible.chapter} / {bible.maxChapters}
          </div>
          <button
            onClick={bible.nextChapter}
            disabled={bible.bookId === 'rev' && bible.chapter === bible.maxChapters}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Next
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
