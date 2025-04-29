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
    const regex = prompt("Masukkan regex (contoh: /\\n-\\d+-\\n/):");
    try {
      return text.split(eval(regex));
    } catch {
      throw new Error('Regex tidak valid');
    }
  }
  
  export function smartSplit(parts, maxLen, overlap, sep='') {
    const chunks = [];
    let curr = [], currLen = 0;
  
    for (let p of parts) {
      const L = p.length + sep.length;
      if (currLen + L > maxLen && curr.length) {
        chunks.push(curr.join(sep));
        curr = overlap>0
          ? curr.slice(-overlap)
          : [];
        currLen = curr.join(sep).length;
      }
      curr.push(p);
      currLen += L;
    }
    if (curr.length) chunks.push(curr.join(sep));
    return chunks;
  }
  