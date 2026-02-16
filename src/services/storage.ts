import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Note, AIResearch, Bookmark, DrawingData, ReadingProgress, AppSettings } from '../types';

interface BappDB extends DBSchema {
  notes: {
    key: string;
    value: Note;
    indexes: { 'by-date': number };
  };
  research: {
    key: string;
    value: AIResearch;
    indexes: { 'by-verse': string; 'by-date': number };
  };
  bookmarks: {
    key: string;
    value: Bookmark;
    indexes: { 'by-date': number };
  };
  drawings: {
    key: string;
    value: DrawingData;
  };
  progress: {
    key: string;
    value: ReadingProgress;
    indexes: { 'by-time': number };
  };
  settings: {
    key: string;
    value: AppSettings;
  };
  bible: {
    key: string;
    value: { bookId: string; chapter: number; data: any };
  };
}

let db: IDBPDatabase<BappDB> | null = null;

async function getDB() {
  if (db) return db;
  
  db = await openDB<BappDB>('bapp-db', 1, {
    upgrade(db) {
      // Notes store
      const notesStore = db.createObjectStore('notes', { keyPath: 'id' });
      notesStore.createIndex('by-date', 'updatedAt');

      // AI Research store
      const researchStore = db.createObjectStore('research', { keyPath: 'id' });
      researchStore.createIndex('by-verse', 'verseId');
      researchStore.createIndex('by-date', 'createdAt');

      // Bookmarks store
      const bookmarksStore = db.createObjectStore('bookmarks', { keyPath: 'id' });
      bookmarksStore.createIndex('by-date', 'createdAt');

      // Drawings store
      db.createObjectStore('drawings', { keyPath: 'id' });

      // Progress store
      const progressStore = db.createObjectStore('progress', { keyPath: 'bookId' });
      progressStore.createIndex('by-time', 'timestamp');

      // Settings store
      db.createObjectStore('settings', { keyPath: 'key' });

      // Bible cache store
      db.createObjectStore('bible', { keyPath: ['bookId', 'chapter'] });
    },
  });
  
  return db;
}

// Notes operations
export const notes = {
  async getAll(): Promise<Note[]> {
    const db = await getDB();
    return db.getAll('notes');
  },
  
  async get(id: string): Promise<Note | undefined> {
    const db = await getDB();
    return db.get('notes', id);
  },
  
  async save(note: Note): Promise<void> {
    const db = await getDB();
    await db.put('notes', note);
  },
  
  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('notes', id);
  },
  
  async clear(): Promise<void> {
    const db = await getDB();
    await db.clear('notes');
  },
};

// AI Research operations
export const research = {
  async getAll(): Promise<AIResearch[]> {
    const db = await getDB();
    return db.getAll('research');
  },
  
  async getByVerse(verseId: string): Promise<AIResearch[]> {
    const db = await getDB();
    return db.getAllFromIndex('research', 'by-verse', verseId);
  },
  
  async save(item: AIResearch): Promise<void> {
    const db = await getDB();
    await db.put('research', item);
  },
  
  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('research', id);
  },
  
  async clear(): Promise<void> {
    const db = await getDB();
    await db.clear('research');
  },
};

// Bookmarks operations
export const bookmarks = {
  async getAll(): Promise<Bookmark[]> {
    const db = await getDB();
    return db.getAll('bookmarks');
  },
  
  async save(bookmark: Bookmark): Promise<void> {
    const db = await getDB();
    await db.put('bookmarks', bookmark);
  },
  
  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('bookmarks', id);
  },
  
  async exists(id: string): Promise<boolean> {
    const db = await getDB();
    const bookmark = await db.get('bookmarks', id);
    return !!bookmark;
  },
};

// Drawings operations
export const drawings = {
  async get(id: string): Promise<DrawingData | undefined> {
    const db = await getDB();
    return db.get('drawings', id);
  },
  
  async save(drawing: DrawingData): Promise<void> {
    const db = await getDB();
    await db.put('drawings', drawing);
  },
  
  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('drawings', id);
  },
};

// Progress operations
export const progress = {
  async get(bookId: string): Promise<ReadingProgress | undefined> {
    const db = await getDB();
    return db.get('progress', bookId);
  },
  
  async save(prog: ReadingProgress): Promise<void> {
    const db = await getDB();
    await db.put('progress', prog);
  },
  
  async getLatest(): Promise<ReadingProgress | undefined> {
    const db = await getDB();
    const all = await db.getAllFromIndex('progress', 'by-time');
    return all[all.length - 1];
  },
};

// Settings operations
export const settings = {
  async get(): Promise<AppSettings> {
    const db = await getDB();
    const stored = await db.get('settings', 'app');
    return stored || {
      language: 'both',
      theme: 'auto',
      fontSize: 16,
      showAnnotations: true,
      aiEnabled: true,
    };
  },
  
  async save(newSettings: AppSettings): Promise<void> {
    const db = await getDB();
    await db.put('settings', newSettings, 'app');
  },
};

// Bible cache operations
export const bible = {
  async get(bookId: string, chapter: number): Promise<any> {
    const db = await getDB();
    const key = `${bookId}-${chapter}`;
    const result = await db.get('bible', key);
    return result?.data;
  },
  
  async save(bookId: string, chapter: number, data: any): Promise<void> {
    const db = await getDB();
    const key = `${bookId}-${chapter}`;
    await db.put('bible', { bookId, chapter, data }, key);
  },
  
  async has(bookId: string, chapter: number): Promise<boolean> {
    const db = await getDB();
    const key = `${bookId}-${chapter}`;
    const result = await db.get('bible', key);
    return !!result;
  },
};

// Export/Import operations
export async function exportAll(): Promise<string> {
  const db = await getDB();
  const data = {
    notes: await db.getAll('notes'),
    research: await db.getAll('research'),
    bookmarks: await db.getAll('bookmarks'),
    drawings: await db.getAll('drawings'),
    progress: await db.getAll('progress'),
    settings: await db.getAll('settings'),
    version: 1,
  };
  return JSON.stringify(data, null, 2);
}

export async function importAll(jsonData: string): Promise<void> {
  const data = JSON.parse(jsonData);
  const db = await getDB();
  
  // Import all data
  if (data.notes) {
    for (const note of data.notes) {
      await db.put('notes', note);
    }
  }
  if (data.research) {
    for (const item of data.research) {
      await db.put('research', item);
    }
  }
  if (data.bookmarks) {
    for (const bookmark of data.bookmarks) {
      await db.put('bookmarks', bookmark);
    }
  }
  if (data.drawings) {
    for (const drawing of data.drawings) {
      await db.put('drawings', drawing);
    }
  }
  if (data.progress) {
    for (const prog of data.progress) {
      await db.put('progress', prog);
    }
  }
  if (data.settings) {
    for (const setting of data.settings) {
      await db.put('settings', setting);
    }
  }
}
