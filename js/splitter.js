// Memecah teks menjadi kalimat
export function splitBySentence(text) {
  if (!text) return [];

  // Tetap: ambil kalimat yang diakhiri . ! ? 。 ！ ？,
  // dan juga bagian terakhir meskipun tanpa tanda baca.
  const matches = text.match(/[^.!?。！？]+(?:[.!?。！？]+|\s*$)/g) || [];

  // Penting: JANGAN .trim() supaya newline/indent asli tidak hilang.
  // Kita hanya buang hasil yang benar-benar kosong (semua whitespace).
  return matches.filter(s => s.trim().length > 0);
}

// Memecah teks menjadi paragraf (dipisah baris kosong)
export function splitByParagraph(text) {
  if (!text) return [];

  // Lebih fleksibel untuk \n (Unix) dan \r\n (Windows)
  // Newline DI DALAM paragraf tetap dipertahankan.
  return text.split(/\r?\n\s*\r?\n/);
}

// Memecah teks menjadi kata
export function splitByWord(text) {
  if (!text) return [];

  // Pecah berdasarkan satu atau lebih whitespace, buang string kosong.
  // Di level "kata", memang format newline sudah dianggap separator.
  return text.split(/\s+/).filter(Boolean);
}

// Memecah teks berdasarkan regex custom dari user (tanpa eval)
export function splitByCustomRegex(text) {
  if (!text) return [];

  const pattern = prompt("Masukkan pola regex (tanpa /), misal: \\n-\\d+-\\n");
  if (pattern === null) {
    // User cancel → kembalikan teks apa adanya
    return [text];
  }

  const flags = prompt("Masukkan flags (misal: gi), boleh kosong:") || '';

  try {
    const re = new RegExp(pattern, flags);
    return text.split(re);
  } catch (e) {
    throw new Error('Regex tidak valid: ' + e.message);
  }
}

// Menggabungkan parts jadi chunks dengan batas panjang dan overlap
export function smartSplit(parts, maxLen, overlap, separator = '') {
  if (!Array.isArray(parts)) {
    throw new Error('Parameter "parts" harus berupa array.');
  }
  if (typeof maxLen !== 'number' || maxLen <= 0) {
    throw new Error('Parameter "maxLen" harus berupa angka > 0.');
  }
  if (typeof overlap !== 'number' || overlap < 0) {
    throw new Error('Parameter "overlap" harus berupa angka >= 0.');
  }

  const chunks = [];
  let curr = [];
  let currLen = 0;

  for (let part of parts) {
    // Paksa part jadi string untuk konsistensi
    part = String(part);

    // Panjang tambahan kalau part ini dimasukkan ke chunk sekarang
    const extra = part.length + (curr.length > 0 && separator ? separator.length : 0);

    // Kalau lewat batas dan curr sudah ada isinya, tutup chunk dulu
    if (currLen + extra > maxLen && curr.length) {
      chunks.push(curr.join(separator));

      if (overlap > 0) {
        // Ambil beberapa elemen terakhir sebagai overlap
        curr = curr.slice(-overlap);
        currLen = curr.join(separator).length;
      } else {
        curr = [];
        currLen = 0;
      }
    }

    // Tambahkan part ke chunk sekarang
    if (curr.length > 0 && separator) {
      currLen += separator.length;
    }
    curr.push(part);
    currLen += part.length;
  }

  // Tambahkan sisa terakhir kalau ada
  if (curr.length) {
    chunks.push(curr.join(separator));
  }

  return chunks;
}
