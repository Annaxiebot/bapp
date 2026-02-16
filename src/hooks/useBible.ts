import { useState, useEffect, useCallback } from 'react';
import { BibleVerse } from '../types';
import * as bibleService from '../services/bible';
import * as storage from '../services/storage';
import { BIBLE_BOOKS } from '../constants';

export function useBible(initialBookId = 'gen', initialChapter = 1) {
  const [bookId, setBookId] = useState(initialBookId);
  const [chapter, setChapter] = useState(initialChapter);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const book = BIBLE_BOOKS.find(b => b.id === bookId);
  const maxChapters = book?.chapters || 1;

  const loadChapter = useCallback(async (newBookId: string, newChapter: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await bibleService.getChapter(newBookId, newChapter);
      setVerses(data);
      setBookId(newBookId);
      setChapter(newChapter);
      
      // Save progress
      await storage.progress.save({
        bookId: newBookId,
        chapter: newChapter,
        timestamp: Date.now(),
      });
      
      // Preload adjacent chapters
      const targetBook = BIBLE_BOOKS.find(b => b.id === newBookId);
      if (targetBook) {
        bibleService.preloadAdjacentChapters(newBookId, newChapter, targetBook.chapters);
      }
    } catch (err) {
      setError('Failed to load chapter');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial chapter
  useEffect(() => {
    loadChapter(bookId, chapter);
  }, []);

  const nextChapter = useCallback(() => {
    if (chapter < maxChapters) {
      loadChapter(bookId, chapter + 1);
    } else {
      // Move to next book
      const currentIndex = BIBLE_BOOKS.findIndex(b => b.id === bookId);
      if (currentIndex < BIBLE_BOOKS.length - 1) {
        const nextBook = BIBLE_BOOKS[currentIndex + 1];
        loadChapter(nextBook.id, 1);
      }
    }
  }, [bookId, chapter, maxChapters, loadChapter]);

  const prevChapter = useCallback(() => {
    if (chapter > 1) {
      loadChapter(bookId, chapter - 1);
    } else {
      // Move to previous book
      const currentIndex = BIBLE_BOOKS.findIndex(b => b.id === bookId);
      if (currentIndex > 0) {
        const prevBook = BIBLE_BOOKS[currentIndex - 1];
        loadChapter(prevBook.id, prevBook.chapters);
      }
    }
  }, [bookId, chapter, loadChapter]);

  const goTo = useCallback((newBookId: string, newChapter: number) => {
    loadChapter(newBookId, newChapter);
  }, [loadChapter]);

  return {
    bookId,
    chapter,
    verses,
    loading,
    error,
    book,
    maxChapters,
    nextChapter,
    prevChapter,
    goTo,
  };
}
