import React from 'react';
import Svg,{Defs,LinearGradient,RadialGradient,Stop,Rect,Path,Circle,Ellipse,Polygon,Line,G,Text as T} from 'react-native-svg';
const {curveAt,nextLight,MODES}=require('./engine.cjs');
const colors=['#6ee7ef','#f0b45a','#aeb3c5','#b5c1a4','#b478bd'];
export function Car({x=0,y=0,scale=1,color='#d5ee57',player=false,brake=false,steer=0}){return <G transform={`translate(${x} ${y}) scale(${scale}) rotate(${steer*2})`}>
 <Ellipse cx="0" cy="2" rx="40" ry="9" fill="#000" opacity=".35"/>
 <Rect x="-33" y="-33" width="8" height="31" rx="3" fill="#070b12"/><Rect x="25" y="-33" width="8" height="31" rx="3" fill="#070b12"/>
 <Path d="M-32 0 L-35 -23 L-26 -43 L-19 -61 Q0 -70 19 -61 L26 -43 L35 -23 L32 0 Z" fill={color}/>
 <Path d="M-26 -43 L-17 -59 Q0 -65 17 -59 L26 -43 Z" fill="#c9f5ff" opacity=".65"/>
 <Path d="M-25 -39 L-17 -55 Q0 -60 17 -55 L25 -39 Z" fill="#102b40"/>
 <Path d="M-17 -54 L-11 -54 L-20 -40 L-25 -40 Z" fill="#9abbd0" opacity=".6"/>
 <Path d="M-31 -25 L-24 -39 L24 -39 L31 -25 Z" fill="#12202c"/>
 <Path d="M-18 -38 L-13 -26 L14 -26 L19 -38" fill="#6e96a0" opacity=".5"/>
 <Path d="M-33 -22 Q0 -29 33 -22 L32 -3 Q0 4 -32 -3 Z" fill={color}/>
 <Path d="M-30 -20 L30 -20" stroke="#f4ffb8" strokeWidth="1" opacity=".6"/>
 <Path d="M-29 -12 L-10 -11 M10 -11 L29 -12" stroke={brake?'#ff272e':'#f06d69'} strokeWidth={brake?5:3}/>
 <Path d="M-26 -2 L26 -2 L21 -7 L-21 -7 Z" fill="#162029"/>
 <Circle cx="-21" cy="-2" r="2" fill="#bdc3be"/><Circle cx="21" cy="-2" r="2" fill="#bdc3be"/>
 {player&&<><Path d="M-33 -28 L33 -28" stroke="#131d24" strokeWidth="5"/><Rect x="-8" y="-6" width="16" height="5" rx="1" fill="#e9f0da"/><T x="0" y="-2" textAnchor="middle" fontSize="3" fill="#182c30">ND • 01</T></>}
 </G>}
export default function Scene({game:g,width,height,cockpit=false}){
 const night=g.mode==='night'||g.mode==='rush',coast=g.mode==='coast',horizon=188;
 const sky=night?['#090d25','#442b60','#df7184']:coast?['#243e69','#ca8f8a','#ffd18a']:['#172f51','#698eaa','#dfc6aa'];
 const project=(z,lane=0)=>{const p=12/(z+2);const half=238*p;const center=200-g.x*half*.77+(curveAt(g.s+z,g.mode)-curveAt(g.s,g.mode))*210*(1-p);return{x:center+lane*half,y:horizon+(600-horizon)*p,half,p}};
 const strips=[];for(let i=40;i>=0;i--){const z1=10+i*i*.25,z2=10+(i+1)*(i+1)*.25;const a=project(z1),b=project(z2);const stripe=Math.floor((g.s+z1)/6)%2;strips.push(<G key={'road'+i}>
 <Polygon points={`${a.x-a.half*1.09},${a.y} ${a.x+a.half*1.09},${a.y} ${b.x+b.half*1.09},${b.y} ${b.x-b.half*1.09},${b.y}`} fill={stripe?(night?'#d5578b':'#e2d6b9'):'#4a5863'}/>
 <Polygon points={`${a.x-a.half},${a.y} ${a.x+a.half},${a.y} ${b.x+b.half},${b.y} ${b.x-b.half},${b.y}`} fill={stripe?(night?'#19283d':'#34434d'):(night?'#1b2c42':'#35454f')}/>
 {[-.97,.97].map(l=><Line key={l} x1={a.x+a.half*l} y1={a.y} x2={b.x+b.half*l} y2={b.y} stroke={night?'#f2bdde':'#edddbb'} strokeWidth={Math.max(.3,a.p*1.4)}/>)}
 {Math.floor((g.s+z1)/8)%2===0&&[-1/3,1/3].map(l=><Polygon key={l} points={`${a.x+a.half*l-1.3*a.p},${a.y} ${a.x+a.half*l+1.3*a.p},${a.y} ${b.x+b.half*l+1.3*b.p},${b.y} ${b.x+b.half*l-1.3*b.p},${b.y}`} fill={night?'#b9cbd9':'#cdd6d6'}/>)}
 </G>)}
 const props=[];for(let n=20;n>=0;n--){const z=18+n*20-(g.s%20),p=project(z),side=n%2?1:-1,x=p.x+side*p.half*1.29,y=p.y,sc=p.p;
 if(coast)props.push(<G key={'prop'+n} transform={`translate(${x} ${y}) scale(${sc})`}><Path d="M0 0 Q10 -50 -2 -111" stroke="#493d39" strokeWidth="7" fill="none"/><Path d="M-2 -110 Q-33 -144 -62 -113 Q-26 -125 -2 -110 M-2 -110 Q21 -150 54 -121 Q22 -132 -2 -110 M-2 -110 Q-46 -119 -50 -90 Q-28 -109 -2 -110 M-2 -110 Q46 -119 48 -86 Q26 -110 -2 -110" fill="#27473d"/></G>);
 else props.push(<G key={'prop'+n} transform={`translate(${x} ${y}) scale(${sc})`}><Path d={`M0 0 L0 -135 L${side*-26} -150 L${side*-47} -150`} fill="none" stroke={night?'#8592a9':'#5a6871'} strokeWidth="3"/><Rect x={side===1?-49:23} y="-153" width="26" height="4" rx="2" fill={night?'#dbb7f4':'#b6c9ca'}/>{night&&<Ellipse cx={side===1?-35:35} cy="-145" rx="28" ry="8" fill="#ffb8e7" opacity=".17"/>}</G>);
 }
 let checkpoint=null;const cp=g.nextCheckpoint-g.s;if(g.mode!=='academy'&&g.nextCheckpoint<MODES[g.mode].distance&&cp>0&&cp<360){const p=project(Math.max(10,cp));checkpoint=<G><Path d={`M${p.x-p.half*1.08} ${p.y} L${p.x-p.half*1.08} ${p.y-96*p.p} L${p.x+p.half*1.08} ${p.y-96*p.p} L${p.x+p.half*1.08} ${p.y}`} stroke="#81edce" strokeWidth={4*p.p} fill="none"/><Rect x={p.x-83*p.p} y={p.y-108*p.p} width={166*p.p} height={24*p.p} rx={3*p.p} fill="#183f45" stroke="#81edce" strokeWidth={p.p}/><T x={p.x} y={p.y-92*p.p} fontSize={11*p.p} fill="#c9ffe9" textAnchor="middle" fontWeight="bold">CHECKPOINT +5s</T></G>}
 const light=nextLight(g);let signal=null;if(light&&light.dist<350){const p=project(Math.max(10,light.dist));signal=<G><Line x1={p.x-p.half} y1={p.y} x2={p.x+p.half} y2={p.y} stroke="#e9e1d6" strokeWidth={5*p.p}/><G transform={`translate(${p.x+p.half*1.15} ${p.y}) scale(${p.p})`}><Path d="M0 0 L0 -175 L-95 -175" stroke="#5b6f7a" strokeWidth="5" fill="none"/><Rect x="-116" y="-180" width="25" height="65" rx="7" fill="#112230" stroke="#637583"/>{['red','yellow','green'].map((c,i)=><Circle key={c} cx="-103.5" cy={-166+i*19} r="6" fill={light.state===c?{red:'#ff6474',yellow:'#ffd569',green:'#72f4b0'}[c]:'#29343b'}/>)}</G></G>}
 return <Svg width={width} height={height} viewBox="0 0 400 600" preserveAspectRatio="none">
 <Defs><LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">{sky.map((c,i)=><Stop key={c} offset={i/2} stopColor={c}/>)}</LinearGradient><LinearGradient id="land" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor={coast?'#a59a80':night?'#25263d':'#7c9086'}/><Stop offset="1" stopColor={coast?'#776a55':night?'#0a1729':'#526f67'}/></LinearGradient><LinearGradient id="water" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#c3b8b0"/><Stop offset="1" stopColor="#327c89"/></LinearGradient><LinearGradient id="vignette" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#0b1420" stopOpacity=".4"/><Stop offset=".5" stopColor="#0b1420" stopOpacity="0"/><Stop offset="1" stopColor="#0b1420" stopOpacity=".25"/></LinearGradient><LinearGradient id="bonnet" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#e1ed74"/><Stop offset="1" stopColor="#63722c"/></LinearGradient></Defs>
 <Rect width="400" height="600" fill="url(#sky)"/>
 {night?Array.from({length:35},(_,i)=><Circle key={i} cx={(i*73+12)%400} cy={(i*31+8)%140} r={i%3?.65:1.2} fill="#f2e1ff" opacity=".6"/>):<><Ellipse cx="298" cy="105" rx="68" ry="68" fill="#ffe1b2" opacity=".06"/><Circle cx="298" cy="105" r={coast?30:21} fill={coast?'#ffd8a0':'#f7e1bf'} opacity=".9"/><Path d="M20 78 Q70 66 130 80 M170 48 Q225 40 260 51" fill="none" stroke="#ecdbcd" strokeWidth="2" opacity=".3"/></>}
 <Path d="M-20 189 L-20 144 L25 157 L60 106 L110 156 L150 130 L205 170 L260 142 L325 177 L365 145 L420 184 L420 230 Z" fill={coast?'#5b6575':night?'#26304b':'#657f91'}/>
 <Path d="M-20 194 L15 169 L70 172 L120 147 L180 181 L220 162 L280 189 L350 172 L420 191 L420 235 L-20 235 Z" fill={night?'#272a43':'#819392'}/>
 {!coast&&Array.from({length:20},(_,i)=>{const x=i*23-12,ht=22+((i*31)%80);return <G key={i}><Rect x={x} y={190-ht} width={17+i%5} height={ht} fill={night?i%2?'#18243c':'#1b2b44':'#667c86'}/>{Array.from({length:Math.floor(ht/7)},(_,j)=><G key={j}>{[3,9,14].map(k=><Rect key={k} x={x+k} y={194-ht+j*7} width="2" height="2.5" fill={night?(i+j+k)%3?'#ccb8ad':'#96c1dc':'#b2c3c7'} opacity={night?.55:.35}/>)}</G>)}{night&&i%4===0&&<Line x1={x} y1={190-ht} x2={x+16} y2={190-ht} stroke="#f486cf" strokeWidth="2"/>}</G>})}
 <Rect y={horizon} width="400" height={600-horizon} fill="url(#land)"/>
 {coast&&<><Path d="M0 188 L156 188 L75 600 L0 600 Z" fill="url(#water)"/>{Array.from({length:8},(_,i)=><Path key={i} d={`M0 ${210+i*i*5} L${123-i*5} ${210+i*i*5}`} stroke="#f1dfc4" strokeWidth="1" opacity=".35"/>)}</>}
 {strips}{signal}{checkpoint}{props}
 {[...g.cars,...(g.hazards||[]).filter(h=>!h.hit).map(h=>({...h,barrier:true}))].filter(c=>c.s-g.s>0&&c.s-g.s<420).sort((a,b)=>b.s-a.s).map(c=>{const p=project(c.s-g.s+14,c.x);return c.barrier?<G key={'h'+c.id} transform={`translate(${p.x} ${p.y}) scale(${p.p})`}><Ellipse cx="0" cy="0" rx="43" ry="8" fill="#000" opacity=".3"/><Path d="M-35 -2 L-32 -28 L32 -28 L35 -2 Z" fill="#e9a55c" stroke="#ffd1a3" strokeWidth="2"/><Path d="M-29 -25 L-18 -25 L-32 -8 L-33 -13 M-6 -25 L6 -25 L-13 -4 L-25 -4 M20 -25 L30 -25 L11 -4 L-1 -4" fill="#514035"/><Circle cx="-23" cy="-33" r="5" fill={Math.floor(g.time*3)%2?'#ffcd75':'#8c543d'}/><Circle cx="23" cy="-33" r="5" fill={Math.floor(g.time*3)%2?'#ffcd75':'#8c543d'}/></G>:<Car key={c.id} x={p.x} y={p.y} scale={p.p*1.04} color={colors[c.color]} brake={c.speed<3}/>})}
 {coast&&<Path d="M0 500 L45 499 M0 520 L38 517" stroke="#fee5bf" opacity=".3"/>}
 {!cockpit?<Car x={200+g.x*34} y={526} scale={1.04} color="#d4e967" player brake={g.braking} steer={g.steer*1.5}/>:<><Path d="M50 600 L65 554 Q200 516 335 554 L350 600 Z" fill="url(#bonnet)"/><Path d="M91 600 L121 542 M309 600 L279 542" stroke="#586a35" strokeWidth="2"/><Path d="M140 573 Q200 563 260 573" stroke="#f0f9bb" fill="none" opacity=".6"/></>}
 <Rect width="400" height="600" fill="url(#vignette)"/>
 {g.speed>30&&Array.from({length:g.nitroActive?20:8},(_,i)=>{const side=i%2?1:-1,spread=100+(i*31)%110,yy=210+(i*67+g.s*3)%320;return <Line key={'speed'+i} x1={200+side*spread*.65} y1={yy} x2={200+side*(spread+30)} y2={yy+(g.nitroActive?100:35)} stroke={g.nitroActive?'#94efff':'#d9e8e9'} strokeWidth={g.nitroActive?1.3:.7} opacity={g.nitroActive?.38:.12}/>})}
 {g.nitroActive&&<><Path d={`M${184+g.x*34} 526 L${179+g.x*34} ${550+Math.sin(g.time*45)*10} L${190+g.x*34} 534 M${216+g.x*34} 526 L${221+g.x*34} ${550+Math.sin(g.time*45)*10} L${210+g.x*34} 534`} fill="#8cefff" opacity=".9"/><Rect x="1" y="1" width="398" height="598" rx="10" stroke="#75cfea" strokeWidth="4" fill="none" opacity=".55"/></>}
 {g.bonusFlash>0&&<Rect width="400" height="600" fill="#ffe7aa" opacity={g.bonusFlash*.055}/>}

 {g.flash>0&&<Rect width="400" height="600" fill="#ff5679" opacity={g.flash*.55}/>}
 </Svg>
}
