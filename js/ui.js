import { SELECTORS, STORAGE_KEYS } from './config.js';
import { safeSet, safeGet }       from './storage.js';

let darkMode = safeGet(STORAGE_KEYS.darkMode) === 'true';

export function initDarkMode() {
  if (darkMode) document.body.classList.add('dark-mode');
}

export function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle('dark-mode');
  safeSet(STORAGE_KEYS.darkMode, darkMode);
  const stored = JSON.parse(safeGet(STORAGE_KEYS.outputSegments) || '[]');
  if (stored.length) displayResult(stored);
}

export function showToast(msg, type = 'success') {
  const t = document.querySelector(SELECTORS.toast);
  t.textContent = msg;
  t.style.backgroundColor = type === 'error' ? '#e74c3c' : '#27ae60';
  t.style.display = 'block';
  setTimeout(() => t.style.display = 'none', 3000);
}

export function displayResult(segments) {
  const out = document.querySelector(SELECTORS.output);
  out.innerHTML = segments.map((c, i) => `
    <div class="segment ${darkMode ? 'dark-mode' : ''}">
      <div class="segment-header">
        <div>Segmen #${i + 1}</div>
        <div class="char-count">${c.length} karakter</div>
      </div>
      <pre>${c}</pre>
      <button data-copy="${i}">📋 Salin</button>
      <button data-edit="${i}">✏️ Edit</button>
    </div>
  `).join('');
  safeSet(STORAGE_KEYS.outputSegments, JSON.stringify(segments));
  bindSegmentActions(segments);
}

export function bindSegmentActions(segments) {
  document.querySelectorAll('button[data-copy]').forEach(btn => {
    btn.onclick = async () => {
      const idx = +btn.getAttribute('data-copy');
      const text = segments[idx];
      try {
        await navigator.clipboard.writeText(text);
        document.querySelectorAll('.segment').forEach(s => s.classList.remove('copied-persistent'));
        document.querySelectorAll('.segment')[idx].classList.add('copied-persistent');
        safeSet(STORAGE_KEYS.lastCopied, idx);
        showToast('Tersalin ke clipboard!');
      } catch {
        showToast('Gagal menyalin!', 'error');
      }
    };
  });
  document.querySelectorAll('button[data-edit]').forEach(btn => {
    btn.onclick = () => {
      const idx = +btn.getAttribute('data-edit');
      const baru = prompt('Edit segmen:', segments[idx]);
      if (baru !== null) {
        segments[idx] = baru;
        safeSet(STORAGE_KEYS.outputSegments, JSON.stringify(segments));
        displayResult(segments);
        showToast('Segmen diperbarui');
      }
    };
  });
}
