import { BibleBook } from './types';

// Bible books (Old Testament + New Testament)
export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament
  { id: 'gen', name: '创世记', nameEn: 'Genesis', chapters: 50, testament: 'OT' },
  { id: 'exo', name: '出埃及记', nameEn: 'Exodus', chapters: 40, testament: 'OT' },
  { id: 'lev', name: '利未记', nameEn: 'Leviticus', chapters: 27, testament: 'OT' },
  { id: 'num', name: '民数记', nameEn: 'Numbers', chapters: 36, testament: 'OT' },
  { id: 'deu', name: '申命记', nameEn: 'Deuteronomy', chapters: 34, testament: 'OT' },
  { id: 'jos', name: '约书亚记', nameEn: 'Joshua', chapters: 24, testament: 'OT' },
  { id: 'jdg', name: '士师记', nameEn: 'Judges', chapters: 21, testament: 'OT' },
  { id: 'rut', name: '路得记', nameEn: 'Ruth', chapters: 4, testament: 'OT' },
  { id: '1sa', name: '撒母耳记上', nameEn: '1 Samuel', chapters: 31, testament: 'OT' },
  { id: '2sa', name: '撒母耳记下', nameEn: '2 Samuel', chapters: 24, testament: 'OT' },
  { id: '1ki', name: '列王纪上', nameEn: '1 Kings', chapters: 22, testament: 'OT' },
  { id: '2ki', name: '列王纪下', nameEn: '2 Kings', chapters: 25, testament: 'OT' },
  { id: '1ch', name: '历代志上', nameEn: '1 Chronicles', chapters: 29, testament: 'OT' },
  { id: '2ch', name: '历代志下', nameEn: '2 Chronicles', chapters: 36, testament: 'OT' },
  { id: 'ezr', name: '以斯拉记', nameEn: 'Ezra', chapters: 10, testament: 'OT' },
  { id: 'neh', name: '尼希米记', nameEn: 'Nehemiah', chapters: 13, testament: 'OT' },
  { id: 'est', name: '以斯帖记', nameEn: 'Esther', chapters: 10, testament: 'OT' },
  { id: 'job', name: '约伯记', nameEn: 'Job', chapters: 42, testament: 'OT' },
  { id: 'psa', name: '诗篇', nameEn: 'Psalms', chapters: 150, testament: 'OT' },
  { id: 'pro', name: '箴言', nameEn: 'Proverbs', chapters: 31, testament: 'OT' },
  { id: 'ecc', name: '传道书', nameEn: 'Ecclesiastes', chapters: 12, testament: 'OT' },
  { id: 'sng', name: '雅歌', nameEn: 'Song of Solomon', chapters: 8, testament: 'OT' },
  { id: 'isa', name: '以赛亚书', nameEn: 'Isaiah', chapters: 66, testament: 'OT' },
  { id: 'jer', name: '耶利米书', nameEn: 'Jeremiah', chapters: 52, testament: 'OT' },
  { id: 'lam', name: '耶利米哀歌', nameEn: 'Lamentations', chapters: 5, testament: 'OT' },
  { id: 'ezk', name: '以西结书', nameEn: 'Ezekiel', chapters: 48, testament: 'OT' },
  { id: 'dan', name: '但以理书', nameEn: 'Daniel', chapters: 12, testament: 'OT' },
  { id: 'hos', name: '何西阿书', nameEn: 'Hosea', chapters: 14, testament: 'OT' },
  { id: 'jol', name: '约珥书', nameEn: 'Joel', chapters: 3, testament: 'OT' },
  { id: 'amo', name: '阿摩司书', nameEn: 'Amos', chapters: 9, testament: 'OT' },
  { id: 'oba', name: '俄巴底亚书', nameEn: 'Obadiah', chapters: 1, testament: 'OT' },
  { id: 'jon', name: '约拿书', nameEn: 'Jonah', chapters: 4, testament: 'OT' },
  { id: 'mic', name: '弥迦书', nameEn: 'Micah', chapters: 7, testament: 'OT' },
  { id: 'nah', name: '那鸿书', nameEn: 'Nahum', chapters: 3, testament: 'OT' },
  { id: 'hab', name: '哈巴谷书', nameEn: 'Habakkuk', chapters: 3, testament: 'OT' },
  { id: 'zep', name: '西番雅书', nameEn: 'Zephaniah', chapters: 3, testament: 'OT' },
  { id: 'hag', name: '哈该书', nameEn: 'Haggai', chapters: 2, testament: 'OT' },
  { id: 'zec', name: '撒迦利亚书', nameEn: 'Zechariah', chapters: 14, testament: 'OT' },
  { id: 'mal', name: '玛拉基书', nameEn: 'Malachi', chapters: 4, testament: 'OT' },
  
  // New Testament
  { id: 'mat', name: '马太福音', nameEn: 'Matthew', chapters: 28, testament: 'NT' },
  { id: 'mrk', name: '马可福音', nameEn: 'Mark', chapters: 16, testament: 'NT' },
  { id: 'luk', name: '路加福音', nameEn: 'Luke', chapters: 24, testament: 'NT' },
  { id: 'jhn', name: '约翰福音', nameEn: 'John', chapters: 21, testament: 'NT' },
  { id: 'act', name: '使徒行传', nameEn: 'Acts', chapters: 28, testament: 'NT' },
  { id: 'rom', name: '罗马书', nameEn: 'Romans', chapters: 16, testament: 'NT' },
  { id: '1co', name: '哥林多前书', nameEn: '1 Corinthians', chapters: 16, testament: 'NT' },
  { id: '2co', name: '哥林多后书', nameEn: '2 Corinthians', chapters: 13, testament: 'NT' },
  { id: 'gal', name: '加拉太书', nameEn: 'Galatians', chapters: 6, testament: 'NT' },
  { id: 'eph', name: '以弗所书', nameEn: 'Ephesians', chapters: 6, testament: 'NT' },
  { id: 'php', name: '腓立比书', nameEn: 'Philippians', chapters: 4, testament: 'NT' },
  { id: 'col', name: '歌罗西书', nameEn: 'Colossians', chapters: 4, testament: 'NT' },
  { id: '1th', name: '帖撒罗尼迦前书', nameEn: '1 Thessalonians', chapters: 5, testament: 'NT' },
  { id: '2th', name: '帖撒罗尼迦后书', nameEn: '2 Thessalonians', chapters: 3, testament: 'NT' },
  { id: '1ti', name: '提摩太前书', nameEn: '1 Timothy', chapters: 6, testament: 'NT' },
  { id: '2ti', name: '提摩太后书', nameEn: '2 Timothy', chapters: 4, testament: 'NT' },
  { id: 'tit', name: '提多书', nameEn: 'Titus', chapters: 3, testament: 'NT' },
  { id: 'phm', name: '腓利门书', nameEn: 'Philemon', chapters: 1, testament: 'NT' },
  { id: 'heb', name: '希伯来书', nameEn: 'Hebrews', chapters: 13, testament: 'NT' },
  { id: 'jas', name: '雅各书', nameEn: 'James', chapters: 5, testament: 'NT' },
  { id: '1pe', name: '彼得前书', nameEn: '1 Peter', chapters: 5, testament: 'NT' },
  { id: '2pe', name: '彼得后书', nameEn: '2 Peter', chapters: 3, testament: 'NT' },
  { id: '1jn', name: '约翰一书', nameEn: '1 John', chapters: 5, testament: 'NT' },
  { id: '2jn', name: '约翰二书', nameEn: '2 John', chapters: 1, testament: 'NT' },
  { id: '3jn', name: '约翰三书', nameEn: '3 John', chapters: 1, testament: 'NT' },
  { id: 'jud', name: '犹大书', nameEn: 'Jude', chapters: 1, testament: 'NT' },
  { id: 'rev', name: '启示录', nameEn: 'Revelation', chapters: 22, testament: 'NT' },
];

export const APP_NAME = 'bapp';
export const APP_VERSION = '1.0.0';
export const STORAGE_PREFIX = 'bapp_';

// API endpoints
export const BIBLE_API_BASE = 'https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles';

export const COLOR_PALETTE = [
  '#000000', // Black
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#6B7280', // Gray
];

export const TOOL_OPTIONS = [
  { id: 'pen' as const, name: '钢笔 Pen', width: 2 },
  { id: 'marker' as const, name: '马克笔 Marker', width: 4 },
  { id: 'highlighter' as const, name: '荧光笔 Highlighter', width: 8 },
  { id: 'eraser' as const, name: '橡皮擦 Eraser', width: 10 },
];
