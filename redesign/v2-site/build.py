import sys,os
D=os.path.dirname(os.path.abspath(__file__))
r=lambda p:open(os.path.join(D,'src',p)).read()
LOGO='<svg viewBox="4 4 92 84" aria-hidden="true"><path d="M4 4 L36 4 L50 46 Z" fill="#5FD6BF"/><path d="M4 4 L50 46 L38 88 Z" fill="#1BB59B"/><path d="M96 4 L64 4 L50 46 Z" fill="#7E8AA3"/><path d="M96 4 L50 46 L62 88 Z" fill="#B9C2D3"/><path d="M38 88 L50 46 L62 88 Z" fill="#13987F"/></svg>'
ARR='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>'
LOCAL='--local' in sys.argv
LIBS=['https://cdn.jsdelivr.net/npm/motion@12.43.0/dist/motion.js','https://cdn.jsdelivr.net/npm/animejs@4.4.1/dist/bundles/anime.umd.min.js']
def page(title,desc,body,css,js,out):
    libs=''.join('<script src="%s"></script>'%u for u in LIBS)
    h='<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<title>%s</title>\n<meta name="description" content="%s">\n<meta name="theme-color" content="#F3F5F1">\n<style>\n%s\n%s\n%s\n</style>\n</head>\n<body data-page="%s">\n%s\n%s\n<script>\n%s\n</script>\n<script>\n%s\n</script>\n<script>\n%s\n</script>\n</body>\n</html>\n'%(title,desc,r('font.css'),r('common.css'),r(css),('home' if out.startswith('index') else 'social'),r(body).replace('{{LOGO}}',LOGO).replace('{{MAP}}',open(os.path.join(D,'src','worldmap.txt')).read()).replace('{{ARR}}',ARR),libs,r('common.js'),r('analytics.js'),r(js))
    open(os.path.join(D,'dist',out),'w').write(h);print(out,len(h))
page('Vybd US Blueprint','Vybd is your US operating partner: the team, technology and infrastructure to enter the US, run your operations and grow.','home.html','home.css','home.js','index.html')
page('Vybd Social-First Ops','Vybd runs inventory, fulfillment, listings and data for brands selling on TikTok Shop, Amazon and DTC. AI agents plus senior operators.','social.html','social.css','social.js','social-commerce.html')

if '--b' in sys.argv:
    page('Vybd Hero B','Vybd home page with design B of the parcel hero: lanes from four countries into one US operation.','homeB.html','homeB.css','homeB.js','index-b.html')
