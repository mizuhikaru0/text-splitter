import { SELECTORS, STORAGE_KEYS } from './config.js';
import * as storage        from './storage.js';
import * as splitter       from './splitter.js';
import * as ui             from './ui.js';
import * as fileHandler    from './fileHandler.js';
import * as historyModule  from './history.js';

document.addEventListener('DOMContentLoaded', () => {
  ui.initDarkMode();

  historyModule.initHistory(entry => {
  });

  const last = storage.safeGet(STORAGE_KEYS.lastText);
  if (last) document.querySelector(SELECTORS.inputText).value = last;

  const savedOut = JSON.parse(storage.safeGet(STORAGE_KEYS.outputSegments) || '[]');
  if (savedOut.length) {
    ui.displayResult(savedOut);
    const lastIdx = storage.safeGet(STORAGE_KEYS.lastCopied);
    if (lastIdx !== null) {
      const seg = document.querySelectorAll('.segment')[lastIdx];
      if (seg) seg.classList.add('copied-persistent');
    }
  }

  document.querySelector(SELECTORS.btnToggleDark)
    .onclick = () => ui.toggleDarkMode();

  document.querySelector(SELECTORS.btnImport)
    .onclick = () => fileHandler.showImportDialog(text => {
      document.querySelector(SELECTORS.inputText).value = text;
    });

  document.querySelector(SELECTORS.btnExport)
    .onclick = () => {
      const segs = JSON.parse(storage.safeGet(STORAGE_KEYS.outputSegments) || '[]');
      fileHandler.exportAsText(segs);
    };

  document.querySelector(SELECTORS.btnProcess)
    .onclick = () => {
      const text   = document.querySelector(SELECTORS.inputText).value;
      const maxL   = +document.querySelector(SELECTORS.maxLength).value;
      const ov     = +document.querySelector(SELECTORS.overlap).value;
      const method = document.querySelector(SELECTORS.splitMethod).value;

      if (!text.trim()) {
        ui.showToast('Masukkan teks terlebih dahulu!', 'error');
        return;
      }

      let parts;
      try {
        switch (method) {
          case 'sentence':  parts = splitter.splitBySentence(text);     break;
          case 'paragraph': parts = splitter.splitByParagraph(text);    break;
          case 'word':      parts = splitter.splitByWord(text);         break;
          case 'custom':    parts = splitter.splitByCustomRegex(text);  break;
          default:
            ui.showToast('Metode tidak dikenal!', 'error');
            return;
        }
      } catch (e) {
        ui.showToast(e.message, 'error');
        return;
      }

      const segments = splitter.smartSplit(
        parts,
        maxL,
        ov,
        method === 'word' ? ' ' : ''
      );

      storage.saveHistory({ text, segments, timestamp: new Date().toISOString() });
      historyModule.initHistory(); 
      ui.displayResult(segments);
      storage.safeSet(STORAGE_KEYS.lastText, text);
    };

  document.querySelector(SELECTORS.btnClear)
    .onclick = () => {
      if (confirm('Yakin hapus semua data?')) {
        storage.clearAll();
        location.reload();
      }
    };
});
