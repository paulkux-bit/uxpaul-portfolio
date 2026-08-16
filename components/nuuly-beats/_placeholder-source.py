# Generates the three PLACEHOLDER beat figures. Paul replaces these with real art;
# see claude/nuuly-illustration-briefs.md for the Gemini prompts and the export path.
# Run:  python3 components/nuuly-beats/_placeholder-source.py && npm run regen:nuuly-beats
#
# Why a script and not hand-authored SVG: all three must show the SAME workstation
# (Paul, 14 Aug), and the only reliable way to guarantee that is one cart() function.
import io, os
W,H=2750,1536; SW=9
S=f'fill="none" stroke="currentColor" stroke-width="{SW}" stroke-linejoin="round" stroke-linecap="round"'
DX,DY=210,-115
def off(p): return (p[0]+DX,p[1]+DY)
def L(*p): return 'M'+' L'.join(f'{x:.0f} {y:.0f}' for x,y in p)
def Lz(*p): return L(*p)+' Z'
def c(x,y,r): return f'M{x-r:.0f} {y:.0f} a{r:.0f} {r:.0f} 0 1 0 {2*r:.0f} 0 a{r:.0f} {r:.0f} 0 1 0 {-2*r:.0f} 0'
def pth(d,o=''): return f'<path {S}{o} d="{d}"/>'
def cart(ox=0,oy=0,faint=False):
    o=' opacity="0.26"' if faint else ''
    P=lambda x,y:(x+ox,y+oy)
    FL,FR=P(760,935),P(1580,935); BL,BR=off(FL),off(FR); T=52
    d=[Lz(BL,BR,FR,FL), Lz(FL,FR,(FR[0],FR[1]+T),(FL[0],FL[1]+T)),
       L(FR,BR), L((FR[0],FR[1]+T),(BR[0],BR[1]+T)), L(BR,(BR[0],BR[1]+T))]
    for k in (FL,FR,BL,BR):
        y0=k[1]+T; y1=k[1]+T+250
        d += [L((k[0],y0),(k[0],y1)), c(k[0],y1+38,38)]
    d.append(L((FL[0],FL[1]+T+250),(FR[0],FR[1]+T+250)))
    mp=BR
    d.append(L(mp,(mp[0],mp[1]-330))); d.append(L((mp[0],mp[1]-275),(mp[0]-215,mp[1]-300)))
    sx,sy=mp[0]-215,mp[1]-300
    d.append(Lz((sx,sy-105),(sx-175,sy-155),(sx-175,sy-10),(sx,sy+38)))
    rp=BL
    d.append(L(rp,(rp[0],rp[1]-430))); d.append(L((rp[0],rp[1]-400),(rp[0]+300,rp[1]-430)))
    for k in (0.28,0.55,0.82):
        hx=rp[0]+300*k; hy=rp[1]-400-30*k
        d += [L((hx,hy),(hx,hy+38)), L((hx-38,hy+70),(hx,hy+38),(hx+38,hy+70))]
    return ''.join(pth(x,o) for x in d)
def worker(cx,feet,h,arms=()):
    hd=h*0.115; sh=feet-h*0.79; hip=feet-h*0.46
    d=[c(cx,feet-h+hd,hd), L((cx,feet-h+2*hd),(cx,sh)),
       Lz((cx-h*0.155,sh),(cx+h*0.155,sh),(cx+h*0.13,hip),(cx-h*0.13,hip)),
       L((cx-h*0.135,sh+h*0.19),(cx+h*0.135,sh+h*0.19)),
       Lz((cx-h*0.12,hip),(cx-h*0.015,hip),(cx-h*0.025,feet),(cx-h*0.115,feet)),
       Lz((cx+h*0.015,hip),(cx+h*0.12,hip),(cx+h*0.115,feet),(cx+h*0.025,feet))]
    return ''.join(pth(x) for x in d)+''.join(pth(a) for a in arms)
def garment(cx,top,sw,hw,h): return pth(Lz((cx-sw,top),(cx+sw,top),(cx+hw,top+h),(cx-hw,top+h)))
def svg(b): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">{b}</svg>'
d=os.path.dirname(os.path.abspath(__file__))
b = cart(ox=250, faint=True) + cart()
b += worker(600,1300,880, arms=[L((600,830),(770,930)),L((600,850),(765,960))])
b += ''.join(pth(L((2060+i*150,1390),(2330+i*150,1390)),' opacity="0.4"') for i in range(2))
io.open(os.path.join(d,'beat-01-station.svg'),'w').write(svg(b))
b = cart()
for cx,sw,hw,h,t in [(880,62,105,150,860),(1090,54,92,132,880),(1300,68,115,145,868),(1500,56,96,128,884)]:
    b += garment(cx,t,sw,hw,h)
b += worker(1210,1360,880, arms=[L((1210,835),(1010,935)),L((1210,850),(1400,945))])
io.open(os.path.join(d,'beat-02-surface.svg'),'w').write(svg(b))
b = cart()
b += worker(1320,1360,880, arms=[L((1320,845),(1080,690)),L((1320,860),(1520,930))])
b += pth(L((1030,655),(1080,690),(1130,655))) + garment(1080,690,82,150,360)
b += pth(Lz((1520,895),(1650,895),(1650,975),(1520,975))) + pth(L((1520,925),(1400,860)))
io.open(os.path.join(d,'beat-03-hands.svg'),'w').write(svg(b))
print('3 placeholder svgs regenerated')
