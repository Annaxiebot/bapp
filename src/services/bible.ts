import { BibleVerse } from '../types';
import * as storage from './storage';

interface BibleChapterData {
  verses: BibleVerse[];
}

// Fetch a chapter from the API (using bible-api.com like the main bible app)
async function fetchChapter(bookId: string, chapter: number): Promise<BibleChapterData> {
  // Try to get from cache first
  const cached = await storage.bible.get(bookId, chapter);
  if (cached) {
    return cached;
  }

  // Fetch Chinese (CUV) and English (WEB) in parallel from bible-api.com
  const [cuvResponse, webResponse] = await Promise.all([
    fetch(`https://bible-api.com/${bookId}${chapter}?translation=cuv`),
    fetch(`https://bible-api.com/${bookId}${chapter}?translation=web`),
  ]);

  if (!cuvResponse.ok || !webResponse.ok) {
    throw new Error('Failed to fetch chapter data');
  }

  const [cuvData, webData] = await Promise.all([
    cuvResponse.json(),
    webResponse.json(),
  ]);

  // Merge the data - bible-api.com returns verses as an array of verse objects
  const verses: BibleVerse[] = [];
  const maxVerses = Math.max(cuvData.verses?.length || 0, webData.verses?.length || 0);

  for (let i = 0; i < maxVerses; i++) {
    const cuvVerse = cuvData.verses?.[i];
    const webVerse = webData.verses?.[i];
    
    verses.push({
      bookId,
      chapter,
      verse: i + 1,
      textCn: typeof cuvVerse === 'object' ? cuvVerse.text : cuvVerse || '',
      textEn: typeof webVerse === 'object' ? webVerse.text : webVerse || '',
    });
  }

  const result = { verses };
  
  // Cache the result
  await storage.bible.save(bookId, chapter, result);
  
  return result;
}

// Get a specific verse
export async function getVerse(
  bookId: string,
  chapter: number,
  verse: number
): Promise<BibleVerse | null> {
  try {
    const chapterData = await fetchChapter(bookId, chapter);
    return chapterData.verses.find(v => v.verse === verse) || null;
  } catch (error) {
    console.error('Error fetching verse:', error);
    return null;
  }
}

// Get an entire chapter
export async function getChapter(
  bookId: string,
  chapter: number
): Promise<BibleVerse[]> {
  try {
    const chapterData = await fetchChapter(bookId, chapter);
    return chapterData.verses;
  } catch (error) {
    console.error('Error fetching chapter:', error);
    return [];
  }
}

// Preload adjacent chapters for smoother navigation
export async function preloadAdjacentChapters(
  bookId: string,
  chapter: number,
  maxChapters: number
): Promise<void> {
  const promises: Promise<any>[] = [];
  
  // Preload previous chapter
  if (chapter > 1) {
    promises.push(fetchChapter(bookId, chapter - 1).catch(() => {}));
  }
  
  // Preload next chapter
  if (chapter < maxChapters) {
    promises.push(fetchChapter(bookId, chapter + 1).catch(() => {}));
  }
  
  await Promise.all(promises);
}

// Check if a chapter is cached
export async function isChapterCached(bookId: string, chapter: number): Promise<boolean> {
  return storage.bible.has(bookId, chapter);
}

// Search verses (simple text search)
export async function searchVerses(
  query: string,
  bookId?: string
): Promise<BibleVerse[]> {
  // For now, this is a simple implementation
  // In production, you'd want a more sophisticated search
  const results: BibleVerse[] = [];
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) {
    return results;
  }
  
  // This is a basic implementation - for a full search, you'd need to
  // load all chapters and search through them, which is beyond the scope
  // of this lightweight implementation
  
  return results;
}
