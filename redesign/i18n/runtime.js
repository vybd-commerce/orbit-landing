i18nInit() {
  let l = 'en'; try { l = window.localStorage.getItem('vybd-lang') || 'en'; } catch (e) {}
  if (l !== 'en' && !this.I18N[l]) l = 'en';
  this.lang = l;
  const root = this.i18nEl || this.root; if (!root) return;
  if ('MutationObserver' in window) {
    this.i18nMO = new MutationObserver(() => { if (this.lang !== 'en') this.i18nApply(); });
    this.i18nMO.observe(root, { subtree: true, childList: true, characterData: true });
  }
  if (l !== 'en') { this.setState({ i18nLang: l }); this.i18nApply(); }
}
setLang(l) {
  if (l !== 'en' && !this.I18N[l]) l = 'en';
  try { window.localStorage.setItem('vybd-lang', l); } catch (e) {}
  this.lang = l; this.setState({ i18nLang: l }); this.i18nApply();
  if (typeof this.measure === 'function') { try { this.measure(); } catch (e) {} }
  if (typeof this.skLayout === 'function') { try { this.skLayout(); } catch (e) {} }
}
i18nLookup(t) {
  const D = this.I18N[this.lang]; if (!D) return null;
  if (D[t] != null) return D[t];
  if (!this.i18nPats) this.i18nPats = {};
  if (!this.i18nPats[this.lang]) {
    const arr = [];
    Object.keys(D).forEach((k) => { if (k.indexOf('{n}') < 0) return; const src = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{n\\\}/g, '([\\d,.]+)'); arr.push([new RegExp('^' + src + '$'), D[k]]); });
    this.i18nPats[this.lang] = arr;
  }
  for (const p of this.i18nPats[this.lang]) { const m = t.match(p[0]); if (m) { let i = 1; return p[1].replace(/\{n\}/g, () => m[i++]); } }
  let m = t.match(/^(.+?) \(([^)]+)\)$/);
  if (m) { const a = this.i18nLookup(m[1]), b = this.i18nLookup(m[2]); if (a || b) return (a || m[1]) + ' (' + (b || m[2]) + ')'; }
  const k = t.indexOf(': ');
  if (k > 0) { const a = this.i18nLookup(t.slice(0, k)), b = this.i18nLookup(t.slice(k + 2)); if (a || b) return (a || t.slice(0, k)) + (this.lang === 'zh' || this.lang === 'ja' ? '：' : ': ') + (b || t.slice(k + 2)); }
  return null;
}
i18nNode(n) {
  if (n.__tr === undefined || n.nodeValue !== n.__tr) n.__en = n.nodeValue;
  const en = n.__en; let out = en;
  if (this.lang !== 'en' && /[A-Za-z]/.test(en)) {
    const tr = this.i18nLookup(en.replace(/\s+/g, ' ').trim());
    if (tr != null) out = en.match(/^\s*/)[0] + tr + en.match(/\s*$/)[0];
  }
  if (n.nodeValue !== out) n.nodeValue = out;
  n.__tr = out;
}
i18nApply() {
  const root = this.i18nEl || this.root; if (!root) return;
  const L = this.lang || 'en', D = this.I18N[L] || null, cjk = L === 'zh' || L === 'ja';
  const done = new Set();
  root.querySelectorAll('[data-tx]').forEach((el) => {
    const nodes = []; const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) nodes.push(n);
    const v = D ? D['#' + el.getAttribute('data-tx')] : null;
    let j = 0;
    nodes.forEach((n) => {
      done.add(n);
      if (n.__tr === undefined || n.nodeValue !== n.__tr) n.__en = n.nodeValue;
      let out = n.__en;
      if (v != null) {
        if (!/\S/.test(n.__en)) out = cjk ? '' : n.__en;
        else { out = typeof v === 'string' ? (j === 0 ? v : '') : (v[j] != null ? v[j] : ''); j++; }
      }
      if (n.nodeValue !== out) n.nodeValue = out;
      n.__tr = out;
    });
  });
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) {
    if (done.has(n)) continue;
    const p = n.parentElement; if (!p || p.closest('[data-notx],style,script')) continue;
    this.i18nNode(n);
  }
  root.setAttribute('data-lang', L);
  try { document.documentElement.setAttribute('lang', L === 'zh' ? 'zh-Hans' : L); } catch (e) {}
  if (this.i18nMO) this.i18nMO.takeRecords();
}
