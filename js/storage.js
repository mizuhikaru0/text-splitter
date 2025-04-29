import { STORAGE_KEYS } from './config.js';

export function safeGet(key) {
  try { return localStorage.getItem(key); }
  catch { return null; }
}

export function safeSet(key, value) {
  try { localStorage.setItem(key, value); }
  catch { /* localStorage penuh */ }
}

export function loadHistory() {
  const raw = safeGet(STORAGE_KEYS.history) || '[]';
  return JSON.parse(raw);
}

export function saveHistory(entry) {
  let hist = loadHistory();
  hist.unshift(entry);
  hist = hist.slice(0, 10);
  safeSet(STORAGE_KEYS.history, JSON.stringify(hist));
}

export function clearAll() {
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
}
