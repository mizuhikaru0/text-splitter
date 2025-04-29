import { loadHistory, saveHistory } from './storage.js';
import { displayResult } from './ui.js';

export function initHistory(onSelect) {
  const hist = loadHistory();
  const container = document.createElement('div');
  container.id = 'history';
  hist.forEach((e,i)=>{
    const item = document.createElement('div');
    item.className = 'history-item';
    item.textContent = `${new Date(e.timestamp).toLocaleString()} — ${e.segments.length} segmen`;
    item.onclick = ()=> onSelect(e);
    container.appendChild(item);
  });
  document.body.appendChild(container);
}
