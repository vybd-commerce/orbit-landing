import json, importlib.util, sys
import os
S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')+'/'
P=S+'pages/'
def load(name):
    spec=importlib.util.spec_from_file_location(name,S+'i18n/'+name+'.py'); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m.T
rows=load('tr1')+load('tr2')+load('tr3')+load('tr4')+load('tr5')+load('tr6')+load('tr7')+load('tr8')
LANGS=['fr','es','zh','ja','ko']
full={l:{} for l in LANGS}
for r in rows:
    assert len(r)==6,(r[0],len(r))
    for i,l in enumerate(LANGS):
        v=r[i+1]
        if isinstance(v,dict): v={str(k):x for k,x in v.items()}
        full[l][r[0]]=v
RT=open(S+'i18n/runtime.js').read()
TX={'Main':['st','co1','co2'],'Lab':['labh1'],'Product':['hwh1'],'CaseStudies':[]}
CASEP=['Case-the-indian-tapas','Case-emsworth','Case-flavor-atlas','Case-karma','Case-kashida-layone','Case-tanrom-lifesciences']
for c in CASEP: TX[c]=[]
for page in ['Main','CaseStudies','Lab','Product']+CASEP:
    path=P+page+'.dc.html'; s=open(path).read()
    if 'i18nInit()' in s:
        print(page,'already has i18n; skipping'); continue
    def rep(a,b,n=1):
        global s
        assert s.count(a)==n,(page,a[:60],s.count(a)); s=s.replace(a,b)
    # select
    rep('<select class="ls-select" id="footer-lang">','<select class="ls-select" id="footer-lang" data-notx="" value="{{ lang }}" onChange="{{ onLang }}">')
    # data-tx hooks
    if page=='Main':
        if '<p class="st-text">' in s:
            rep('<p class="st-text">','<p class="st-text" data-tx="st">')
            rep('/* footer (from vybd.ai) */','[data-lang]:not([data-lang="en"]) .st-nw{white-space:normal}\n/* footer (from vybd.ai) */')
        rep('<div style="--sec: ','<div ref="{{ i18nRef }}" style="--sec: ')
    if page=='Lab': rep('<h1 id="lb-h1" class="lb-h1">','<h1 id="lb-h1" class="lb-h1" data-tx="labh1">')
    if page=='Product': rep('<h1 id="hw-h1" class="hw-h1">','<h1 id="hw-h1" class="hw-h1" data-tx="hwh1">')
    # dictionary for this page
    js=s
    d={}
    for l in LANGS:
        d[l]={k:v for k,v in full[l].items() if (k.startswith('#') and k[1:] in TX[page]) or (not k.startswith('#'))}
    dj=json.dumps(d,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
    # constructor
    rep('super(props);','super(props);\nthis.I18N = '+dj+';\nthis.lang = \'en\';\nthis.onLang = (e) => this.setLang(e.target.value);\nthis.i18nRef = (el) => { this.i18nEl = el; };')
    # methods + mount/unmount
    rep('componentDidMount() {', RT+'componentDidMount() {\nthis.i18nInit();')
    rep('componentWillUnmount() {','componentWillUnmount() {\nif (this.i18nMO) this.i18nMO.disconnect();')
    # render vals
    key=[k for k in ['showNums: this.props.showSectionNumbers ?? true,','showNums: this.props.showSectionNumbers !== false,','showNums: this.props.showSectionNumbers === true,'] if k in s][0]
    rep(key, key+'\nlang: this.lang || \'en\', onLang: this.onLang, i18nRef: this.i18nRef,')
    open(path,'w').write(s)
    print(page,'ok', sum(len(d[l]) for l in LANGS)//5,'keys', len(dj)//1024,'KB')
