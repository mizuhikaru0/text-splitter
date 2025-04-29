import { SELECTORS } from './config.js';
import { safeSet, safeGet } from './storage.js';

let darkMode = safeGet('darkMode')==='true';

export function initDarkMode() {
  if (darkMode) document.body.classList.add('dark-mode');
}

export function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle('dark-mode');
  safeSet('darkMode', darkMode);
  // bisa reload output agar panel ikut gelap/terang
}

export function showToast(msg, type='success') {
  const t = document.querySelector(SELECTORS.toast);
  t.textContent = msg;
  t.style.backgroundColor = type==='error' ? '#e74c3c' : '#27ae60';
  t.style.display = 'block';
  setTimeout(() => t.style.display='none', 3000);
}

export function displayResult(segments) {
  const out = document.querySelector(SELECTORS.output);
  out.innerHTML = segments.map((c,i)=>`
    <div class="segment ${darkMode?'dark-mode':''}">
      <div class="segment-header">
        <div>Segmen #${i+1}</div>
        <div class="char-count">${c.length} karakter</div>
      </div>
      <pre>${c}</pre>
      <button data-copy="${i}">📋 Salin</button>
      <button data-edit="${i}">✏️ Edit</button>
    </div>
  `).join('');
  safeSet('outputSegments', JSON.stringify(segments));
}
