import sys, re, json
src, out = sys.argv[1], sys.argv[2]
s = open(src).read()
helmet = re.search(r'<helmet>(.*?)</helmet>', s, re.S).group(1)
xdc = re.search(r'<x-dc>(.*?)</x-dc>', s, re.S).group(1)
xdc = re.sub(r'<helmet>.*?</helmet>', '', xdc, flags=re.S)
cls = re.search(r'<script type="text/x-dc"[^>]*>(.*?)</script>', s, re.S).group(1)
html = '''<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">%s</head><body><div id="root"></div>
<template id="tpl">%s</template>
<script>
class DCLogic { constructor(props){ this.props = props || {}; this.state = {}; }
  setState(o, cb){ const v = typeof o === 'function' ? o(this.state) : o; Object.assign(this.state, v); __schedule(cb); }
  forceUpdate(){ __schedule(); } }
%s
const TPL = document.getElementById('tpl');
let comp, pending = false, cbs = [];
function lookup(path, scope){ path = path.trim(); if (path === 'true') return true; if (path === 'false') return false; if (/^-?[0-9.]+$/.test(path)) return Number(path);
  const parts = path.split('.'); let v = scope; for (const p of parts) { if (v == null) return undefined; v = v[p]; } return v; }
function interp(str, scope){ const m = str.match(/^\\s*\\{\\{([^}]*)\\}\\}\\s*$/); if (m) return lookup(m[1], scope); return str.replace(/\\{\\{([^}]*)\\}\\}/g, (_, p) => { const v = lookup(p, scope); return v == null ? '' : v; }); }
const EV = { onClick:'click', onMouseMove:'mousemove', onMouseLeave:'mouseleave', onMouseEnter:'mouseenter', onPointerDown:'pointerdown', onPointerMove:'pointermove', onPointerUp:'pointerup', onPointerCancel:'pointercancel', onFocus:'focus', onBlur:'blur', onKeyDown:'keydown', onChange:'change' };
function build(node, scope, parent){
  if (node.nodeType === 3) { parent.appendChild(document.createTextNode(interp(node.textContent, scope))); return; }
  if (node.nodeType !== 1) return;
  const tag = node.tagName.toLowerCase();
  if (tag === 'sc-for') { const list = interp(node.getAttribute('list'), scope) || []; const as = node.getAttribute('as');
    list.forEach((item, i) => { const sc = Object.assign(Object.create(scope), { [as]: item, $index: i }); node.childNodes.forEach(c => build(c, sc, parent)); }); return; }
  if (tag === 'sc-if') { if (interp(node.getAttribute('value'), scope)) node.childNodes.forEach(c => build(c, scope, parent)); return; }
  const ns = node.namespaceURI; const el = ns && ns !== 'http://www.w3.org/1999/xhtml' ? document.createElementNS(ns, node.tagName) : document.createElement(node.tagName);
  let ref = null;
  for (const a of node.attributes) { const name = a.name; const v = interp(a.value, scope);
    if (name === 'ref') { ref = v; continue; }
    const ev = Object.keys(EV).find(k => k.toLowerCase() === name.toLowerCase());
    if (ev) { if (typeof v === 'function') el.addEventListener(EV[ev], v); continue; }
    if (v === false || v == null) continue; el.setAttribute(name, v === true ? '' : v); }
  node.childNodes.forEach(c => build(c, scope, el));
  if (tag === 'select' && node.getAttribute('value')) el.value = interp(node.getAttribute('value'), scope);
  parent.appendChild(el);
  if (typeof ref === 'function') ref(el);
}
function render(){ const vals = comp.renderVals(); const root = document.getElementById('root'); root.innerHTML = '';
  const frag = document.createElement('div'); TPL.content.childNodes.forEach(n => build(n, vals, frag)); while (frag.firstChild) root.appendChild(frag.firstChild); }
function __schedule(cb){ if (cb) cbs.push(cb); if (pending) return; pending = true; setTimeout(() => { pending = false; render(); const c = cbs; cbs = []; c.forEach(f => f()); }, 0); }
comp = new Component(%s); render(); if (comp.componentDidMount) comp.componentDidMount();
</script></body></html>''' % (helmet, xdc, cls, json.dumps({'showLoader': False}))
open(out, 'w').write(html)
print('ok')
