import { SELECTORS }      from './config.js';
import { loadHistory }    from './storage.js';
import { displayResult }  from './ui.js';

export function initHistory(onSelect) {
  const hist   = loadHistory();
  const container = document.querySelector(SELECTORS.history);
  container.innerHTML = ''; 
  hist.forEach((e, i) => {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.textContent = `${new Date(e.timestamp).toLocaleString()} — ${e.segments.length} segmen`;
    item.onclick = () => {
      document.querySelector('#inputText').value = e.text;
      displayResult(e.segments);
      onSelect(e);
    };
    container.appendChild(item);
  });
}
