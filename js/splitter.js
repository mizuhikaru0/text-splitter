export function splitBySentence(text) {
    return text.match(/[^.!?。！？]+[.!?。！？]+(?:\s|$)/g) || [];
  }
  
  export function splitByParagraph(text) {
    return text.split(/\n\s*\n/);
  }
  
  export function splitByWord(text) {
    return text.split(/\s+/);
  }
  
  export function splitByCustomRegex(text) {
    const regex = prompt("Masukkan regex untuk pembagian (misal: /\\n-\\d+-\\n/):");
    try {
      return text.split(eval(regex));
    } catch {
      throw new Error('Regex tidak valid!');
    }
  }
  
  export function smartSplit(parts, maxLen, overlap, separator = '') {
    const chunks = [];
    let curr = [], currLen = 0;
  
    for (let part of parts) {
      const L = part.length + (separator ? separator.length : 0);
      if (currLen + L > maxLen && curr.length) {
        chunks.push(curr.join(separator));
        if (overlap > 0) {
          curr = curr.slice(-overlap);
          currLen = curr.join(separator).length;
        } else {
          curr = [];
          currLen = 0;
        }
      }
      curr.push(part);
      currLen += L;
    }
    if (curr.length) chunks.push(curr.join(separator));
    return chunks;
  }
  