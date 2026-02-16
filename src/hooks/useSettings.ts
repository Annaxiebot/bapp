import { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import * as storage from '../services/storage';
import * as ai from '../services/ai';
import * as vibe from '../services/vibe';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>({
    language: 'both',
    theme: 'auto',
    fontSize: 16,
    showAnnotations: true,
    aiEnabled: true,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const stored = await storage.settings.get();
      setSettings(stored);
      
      // Initialize AI based on provider
      const provider = stored.aiProvider || 'gemini';
      const apiKey = provider === 'gemini' ? stored.geminiApiKey : stored.claudeApiKey;
      
      if (apiKey) {
        if (provider === 'gemini') {
          ai.initializeAI(apiKey);
        }
        vibe.initializeVibeCoding(apiKey, provider);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateSettings(newSettings: Partial<AppSettings>) {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await storage.settings.save(updated);
    
    // Re-initialize AI if key or provider changed
    const provider = updated.aiProvider || 'gemini';
    const apiKey = provider === 'gemini' ? updated.geminiApiKey : updated.claudeApiKey;
    
    if (apiKey) {
      if (provider === 'gemini') {
        ai.initializeAI(apiKey);
      }
      vibe.initializeVibeCoding(apiKey, provider);
    }
  }

  return {
    settings,
    updateSettings,
    loading,
  };
}
