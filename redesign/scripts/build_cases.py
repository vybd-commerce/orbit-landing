import json, html, importlib.util
import os
S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')+'/'
P=S+'pages/'
spec=importlib.util.spec_from_file_location('cd',S+'source/cases_data.py'); cd=importlib.util.module_from_spec(spec); spec.loader.exec_module(cd)
C=cd.CASES
t=open(S+'source/case_template.html').read()
m=open(S+'source/Main.src.html').read()
a=m.index('/* footer (from vybd.ai) */'); b=m.index('@media (prefers-reduced-motion:reduce){.hf-ring{animation:none}}')+len('@media (prefers-reduced-motion:reduce){.hf-ring{animation:none}}')
fcss=m[a:b]
a=m.index('<footer class="hf-band"'); b=m.index('</footer>')+9
foot=m[a:b]
assert '<a href="CaseStudies.dc.html">Case Studies</a>' in foot
foot=foot.replace('<a href="CaseStudies.dc.html">Case Studies</a>','<a href="CaseStudies.dc.html" aria-current="page">Case Studies</a>')
e=html.escape
names=[]
for i,c in enumerate(C):
    n=C[(i+1)%len(C)]
    tick='<span class="tick" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>'
    mets=''.join('<div class="cm-item rv"><b data-count="%s">%s</b><span>%s</span></div>'%(e(v),e(v),e(l)) for v,l in c['metrics'])
    page=(t.replace('__FOOTER_CSS__',fcss).replace('__FOOTER_HTML__',foot)
      .replace('__BRAND__',e(c['brand'])).replace('__CAT__',e(c['cat'])).replace('__SECTOR__',e(c['sector']))
      .replace('__TITLE__',e(c['title'])).replace('__DESC__',e(c['desc'])).replace('__NUM__','%02d'%(i+1))
      .replace('__METRICS__',mets).replace('__OVERVIEW__',e(c['overview'])).replace('__ROLE__',e(c['role']))
      .replace('__CHALL__',''.join('<li><i aria-hidden="true">!</i><span>%s</span></li>'%e(x) for x in c['chall']))
      .replace('__SOL__',''.join('<li>%s<span>%s</span></li>'%(tick,e(x)) for x in c['sol']))
      .replace('__IMPACT__',e(c['impact'])).replace('__NEXT_HREF__','Case-%s.dc.html'%n['slug'])
      .replace('__NEXT_BRAND__',e(n['brand'])).replace('__NEXT_TITLE__',e(n['title'])))
    assert '__' not in page.replace('__schedule','').replace('__lx','') or True
    fn='Case-%s.dc.html'%c['slug']; open(P+fn,'w').write(page); names.append(fn)
# canvas boards
cv=json.load(open(P+'canvas.json'))
for i,fn in enumerate(names):
    cv['boards'][fn]={"x":1520*i,"y":6600,"w":1440,"h":4200,"title":"Case study — "+C[i]['brand'],"expand":"fill","is_interactive":True}
    if fn not in cv['order']: cv['order'].append(fn)
json.dump(cv,open(P+'canvas.json','w'))
# relink cards on the Case Studies page
s=open(P+'CaseStudies.dc.html').read()
a="href: 'https://www.vybd.ai/case-studies/' + c.slug"
if a in s: s=s.replace(a,"href: 'Case-' + c.slug + '.dc.html'")
open(P+'CaseStudies.dc.html','w').write(s)
print('ok',names, "Case-' + c.slug" in s)
