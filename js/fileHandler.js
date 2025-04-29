export function showImportDialog(onLoad) {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = '.txt';
    inp.onchange = e => {
      const reader = new FileReader();
      reader.onload = ev => onLoad(ev.target.result);
      reader.readAsText(e.target.files[0]);
    };
    inp.click();
  }
  
  export function exportAsText(segments) {
    const text = segments.join('\n\n---\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `segmen-${new Date().toISOString()}.txt`;
    a.click();
  }
  