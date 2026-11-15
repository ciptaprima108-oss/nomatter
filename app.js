'use strict';
/* No Matter — editor foto. Semua proses berjalan di perangkat. */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const cv=$('#cv'), ctx=cv.getContext('2d');
const SRC_MAX=2560, PREV_MAX=1080;
const EMOJI_FONT='"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));return c;};
const ctx2=c=>c.getContext('2d',{willReadFrequently:true});
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);

/* ================= DATA ================= */
const ADJ=[['bright','Kecerahan',-100,100],['contrast','Kontras',-100,100],['sat','Saturasi',-100,100],['warm','Kehangatan',-100,100],['tint','Rona',-100,100],['highl','Sorotan',-100,100],['shadow','Bayangan',-100,100],['clarity','Kejelasan',-100,100],['fade','Pudar',0,100],['sharp','Ketajaman',0,100],['vig','Vinyet',0,100],['grain','Butiran',0,100]];
const FILTERS=[
 {id:'asli',n:'Asli',p:{}},
 {id:'cerah',n:'Cerah',p:{bright:14,contrast:8,sat:12}},
 {id:'segar',n:'Segar',p:{bright:8,sat:18,contrast:10,warm:-6},hi:[0,8,4]},
 {id:'hangat',n:'Hangat',p:{warm:30,sat:8,bright:4}},
 {id:'sejuk',n:'Sejuk',p:{warm:-30,contrast:6}},
 {id:'lembut',n:'Lembut',p:{fade:30,contrast:-12,sat:-12,bright:6}},
 {id:'pastel',n:'Pastel',p:{fade:25,sat:-30,bright:10},hi:[18,0,12],sh:[0,6,14]},
 {id:'peach',n:'Persik',p:{bright:10,warm:12,fade:12},hi:[22,6,0]},
 {id:'susu',n:'Susu',p:{bright:16,fade:18,sat:-14,contrast:-6},hi:[8,6,4]},
 {id:'senja',n:'Senja',p:{warm:35,contrast:10,vig:25},hi:[20,0,6],sh:[10,0,24]},
 {id:'tropis',n:'Tropis',p:{sat:28,contrast:12},hi:[16,6,-10],sh:[-10,10,16]},
 {id:'kota',n:'Kota',p:{contrast:22,sat:-18,vig:20},hi:[14,8,-6],sh:[-8,6,18]},
 {id:'film',n:'Film',p:{fade:35,grain:30,contrast:6,warm:10,vig:20},sh:[0,10,12]},
 {id:'retro',n:'Retro',p:{warm:22,fade:30,sat:-25,grain:20,vig:35},hi:[14,8,-14]},
 {id:'y2k',n:'Y2K',p:{contrast:18,sat:22,bright:6},hi:[0,10,24],sh:[18,0,26]},
 {id:'malam',n:'Malam',p:{contrast:18,bright:-8,sat:10,warm:-18,vig:30},sh:[0,0,20]},
 {id:'mono',n:'Mono',mono:1,p:{contrast:12}},
 {id:'noir',n:'Noir',mono:1,p:{contrast:45,vig:45,grain:15}},
 {id:'sepia',n:'Sepia',mono:1,p:{contrast:6,fade:10},hi:[30,14,-14],sh:[22,8,-12]},
];
const FX=[['flash','Flash'],['retro','Flash Retro'],['glitter','Glitter'],['bloom','Glow'],['leak','Light Leak'],['bokeh','Bokeh'],['prism','Prisma'],['rgb','RGB Split'],['glitch','Glitch'],['dust','Debu Film'],['haze','Kabut']];
const STICKERS='❤️ 💖 💕 ✨ ⭐ 🌟 💫 🔥 🌸 🌼 🌷 🌹 🦋 🌈 ☀️ 🌙 ⚡ ☁️ 🎀 👑 💎 🎉 🎈 🎂 🍓 🍒 🍑 🍉 🧋 🍦 🐱 🐶 🐰 🐻 🧸 🐥 😎 😍 🥰 😘 😂 🤩 😇 🥳 😜 🤪 😴 🙈 👍 ✌️ 🤟 🙏 👀 💯 💋 📸 🎵 🎧 🌴 🌊 🏖️ ✈️ 💬 💭'.split(' ');
const COLORS=['#ffffff','#111111','#ff4d5e','#ff8a3d','#ffd23f','#5ee07a','#38c9ff','#4d6bff','#b45cff','#ff6fcf','#a0522d','#9aa0a6'];
const LIPS=['#c2185b','#e53950','#b71c1c','#d8645a','#ad1457','#8e2445','#ff6f91','#a0522d'];
const BLUSH=['#ff7a8a','#ff9a76','#e86a92','#f4a3a8','#ff6f61'];
const LOOKS={natural:{n:'Natural',smooth:40,glow:25,slim:15,eyes:10,lips:30,lipC:'#d8645a',blush:22,blushC:'#f4a3a8',teeth:30},
 korea:{n:'Korea',smooth:62,glow:45,slim:30,eyes:22,nose:20,lips:45,lipC:'#ff6f91',blush:38,blushC:'#ff9a76',teeth:40},
 glam:{n:'Glam',smooth:50,glow:30,slim:35,eyes:28,nose:25,lips:75,lipC:'#b71c1c',blush:32,blushC:'#e86a92',teeth:50},
 lembut:{n:'Lembut',smooth:68,glow:50,slim:20,eyes:15,lips:35,lipC:'#e53950',blush:42,blushC:'#f4a3a8',teeth:35},
 pesta:{n:'Pesta',smooth:55,glow:35,slim:30,eyes:30,nose:20,lips:85,lipC:'#8e2445',blush:30,blushC:'#ff6f61',teeth:60},
 cowok:{n:'Cowok',smooth:35,glow:12,slim:22,eyes:0,lips:0,blush:0,teeth:40}};
const BGCOL=['#ffffff','#111111','#f4e1d2','#ffd6e0','#cde7ff','#d8f5d0','#fff2a8','#e0d4ff','#ff4d5e','#4d6bff'];
const GRADS=[['#ff9a9e','#fad0c4'],['#a18cd1','#fbc2eb'],['#84fab0','#8fd3f4'],['#fccb90','#d57eeb'],['#30cfd0','#330867'],['#000000','#434343']];
const FONTS=[['Sans','800','-apple-system,"Helvetica Neue",Arial,sans-serif'],['Serif','700','Georgia,"Times New Roman",serif'],['Tegas','900','"Arial Black","Helvetica Neue",Impact,sans-serif'],['Tulis','400','"Snell Roundhand","Brush Script MT","Segoe Script",cursive'],['Mesin','700','"Courier New",Courier,monospace'],['Bulat','800','"Arial Rounded MT Bold","Avenir Next",Verdana,sans-serif']];
const FRAMES=[['none','Tanpa'],['putih','Putih'],['hitam','Hitam'],['polaroid','Polaroid'],['film','Film'],['bulat','Sudut Bulat'],['ganda','Garis Ganda'],['pelangi','Pelangi'],['bintik','Polkadot'],['kabur','Tepi Lembut']];
const BRUSH=[['draw','Kuas'],['marker','Stabilo'],['neon','Neon'],['mosaic','Mosaik'],['blur','Blur']];
const TABS=[
 ['filter','Filter','<circle cx="9" cy="10" r="5"/><circle cx="15" cy="10" r="5"/><circle cx="12" cy="15" r="5"/>'],
 ['fx','Efek','<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'],
 ['beauty','Cantik','<path d="M12 3l2.2 5.3L20 9l-4.4 3.8L17 19l-5-3-5 3 1.4-6.2L4 9l5.8-.7z"/>'],
 ['bg','Latar','<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-4 4-6 7-6s6 2 7 6"/><rect x="2" y="2" width="20" height="20" rx="3" stroke-dasharray="3 3"/>'],
 ['shape','Bentuk','<path d="M9 3c-2 4-2 8 0 9s2 5 0 9M15 3c2 4 2 8 0 9s-2 5 0 9"/>'],
 ['adjust','Atur','<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>'],
 ['crop','Potong','<path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M2 6h14a2 2 0 0 1 2 2v14"/>'],
 ['sticker','Stiker','<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0"/><path d="M9 9.5h.01M15 9.5h.01"/>'],
 ['text','Teks','<path d="M5 6V4h14v2M12 4v16M9 20h6"/>'],
 ['brush','Kuas','<path d="M18 3l3 3-9.5 9.5-3-3z"/><path d="M8.5 12.5C5 13 5 16 4 19c3-1 6-1 6.5-4.5"/>'],
 ['frame','Bingkai','<rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="10" height="10"/>'],
];

/* ================= STATE ================= */
const S={src:null};
function freshEdits(){return {rot:0,flip:false,straight:0,crop:null,adj:Object.fromEntries(ADJ.map(a=>[a[0],0])),filter:'asli',fstr:100,
 beauty:{smooth:0,glow:0},face:{slim:0,eyes:0,nose:0,lips:0,lipC:LIPS[0],blush:0,blushC:BLUSH[0],teeth:0},
 fx:Object.fromEntries(FX.map(f=>[f[0],0])),date:false,bg:{mode:'none',amt:60,color:'#ffffff',grad:0},
 body:{tall:0,y0:50},warps:[],items:[],strokes:[],frame:'none',canvas:{ratio:'none',bg:'blur'},seed:(Math.random()*1e9)|0,srcIdx:0};}
function resetEdits(){Object.assign(S,freshEdits());}
resetEdits();
let tab='filter', sel=-1, showOrig=false, cropDraft=null, aspect=null;
let adjSel='bright', beautySel='smooth', fxSel='flash', bgSel='none', shapeSel='push', brushMode='draw', brushColor='#ffffff', brushSize=0.02, spotSize=0.04, shapeSize=0.12;
let txtColor='#ffffff', txtStyle='garis', txtFont=0;
let LAYOUT={ox:0,oy:0,iw:1,ih:1};

/* ================= HISTORY ================= */
let hist=[], fut=[], cur=null;
const KEYS=['srcIdx','rot','flip','straight','crop','adj','filter','fstr','beauty','face','fx','date','bg','body','warps','strokes','frame','canvas','seed'];
function snap(){const o={};for(const k of KEYS)o[k]=S[k];o.items=S.items.map(({_hw,_hh,...r})=>r);return JSON.stringify(o);}
function commit(){const s=snap();if(s===cur)return;if(cur)hist.push(cur);if(hist.length>60)hist.shift();cur=s;fut=[];updHist();}
function restore(s){Object.assign(S,JSON.parse(s));S.src=SRCS[S.srcIdx||0]||SRCS[0];sel=-1;if(tab==='crop')cropDraft=S.crop?{...S.crop}:{x:0,y:0,w:1,h:1};buildTools();req();}
function undo(){if(!hist.length)return;fut.push(cur);cur=hist.pop();restore(cur);updHist();}
function redo(){if(!fut.length)return;hist.push(cur);cur=fut.pop();restore(cur);updHist();}
function updHist(){$('#bUndo').disabled=!hist.length;$('#bRedo').disabled=!fut.length;}

/* ================= PIXEL HELPERS ================= */
function boxBlur(src,w,h,r,passes){
 let a=new Uint8ClampedArray(src), t=new Uint8ClampedArray(src.length);
 for(let p=0;p<passes;p++){blurH(a,t,w,h,r);blurV(t,a,w,h,r);}
 return a;}
function blurH(s,o,w,h,r){const div=2*r+1;
 for(let y=0;y<h;y++){const row=y*w*4;
  for(let c=0;c<3;c++){let acc=0;
   for(let k=-r;k<=r;k++){const x=k<0?0:(k>w-1?w-1:k);acc+=s[row+x*4+c];}
   for(let x=0;x<w;x++){o[row+x*4+c]=acc/div;const xa=x+r+1>w-1?w-1:x+r+1, xr=x-r<0?0:x-r;acc+=s[row+xa*4+c]-s[row+xr*4+c];}}}}
function blurV(s,o,w,h,r){const div=2*r+1, st=w*4;
 for(let x=0;x<w;x++){const col=x*4;
  for(let c=0;c<3;c++){let acc=0;
   for(let k=-r;k<=r;k++){const y=k<0?0:(k>h-1?h-1:k);acc+=s[y*st+col+c];}
   for(let y=0;y<h;y++){o[y*st+col+c]=acc/div;const ya=y+r+1>h-1?h-1:y+r+1, yr=y-r<0?0:y-r;acc+=s[ya*st+col+c]-s[yr*st+col+c];}}}}
const blurRad=(w,h)=>Math.max(2,Math.round(Math.max(w,h)*0.007));
function soft(v,lo,hi){return v<lo?Math.max(0,1-(lo-v)/10):v>hi?Math.max(0,1-(v-hi)/10):1}
function hash(x,y){let n=Math.imul(x,374761393)+Math.imul(y,668265263)|0;n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295;}
function rng(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hex(c){const v=parseInt(c.slice(1),16);return [v>>16,v>>8&255,v&255];}
function lum(c){const [r,g,b]=hex(c);return (0.299*r+0.587*g+0.114*b)/255;}

/* ================= COLOUR PROCESS ================= */
function process(id,w,h,cfg,opt){
 const d=id.data, f=FILTERS.find(x=>x.id===cfg.filter)||FILTERS[0], k=cfg.fstr/100, fx=cfg.fx||{};
 const P={};for(const a of ADJ)P[a[0]]=(cfg.adj[a[0]]||0)+(f.p[a[0]]||0)*k;
 const ret=(fx.retro||0)/100;P.warm+=14*ret;P.fade+=22*ret;P.grain+=26*ret;
 const FL=Math.min(1,(fx.flash||0)/100+ret*0.7), HZ=(fx.haze||0)/100, fc=cfg.flashC||{x:0.5,y:0.42,r:0.32};
 const fcx=fc.x*w, fcy=fc.y*h, fs2=Math.pow(fc.r*Math.max(w,h),2);
 const mono=f.mono?k:0, hi=(f.hi||[0,0,0]).map(v=>v*k), sh=(f.sh||[0,0,0]).map(v=>v*k);
 const n=w*h*4;
 const sm=(cfg.beauty.smooth||0)/100, gl=(cfg.beauty.glow||0)/100;
 if((sm>0||gl>0)&&opt.getBlur){const bl=opt.getBlur();
  const fine=opt.getSharp?opt.getSharp():null, sk=opt.skin;
  for(let i=0;i<n;i+=4){const r=d[i],g=d[i+1],b=d[i+2];
   const cb=128-0.168736*r-0.331264*g+0.5*b, cr=128+0.5*r-0.418688*g-0.081312*b;
   let s;
   if(sk){s=sk[i>>2]/255;if(s<=0.01)continue;s*=0.3+0.7*soft(cb,72,132)*soft(cr,128,178);}
   else{s=soft(cb,77,127)*soft(cr,133,173);if(s<=0)continue;}
   const br=bl[i],bg=bl[i+1],bb=bl[i+2];
   const diff=(Math.abs(br-r)+Math.abs(bg-g)+Math.abs(bb-b))/3, q=diff/15, e=1/(1+q*q*q);
   const a=Math.min(1,sm*1.15)*s*e;
   let R=r+(br-r)*a, G=g+(bg-g)*a, B=b+(bb-b)*a;
   if(fine){const t=a*(0.55-0.25*sm);R+=(r-fine[i])*t;G+=(g-fine[i+1])*t;B+=(b-fine[i+2])*t;}
   if(sm>0){const red=R-(G+B)/2-28;if(red>0){const k=red*0.35*sm*s;R-=k;G+=k*0.25;}}
   if(gl>0){const t=gl*s*0.3;R+=(255-R)*t*0.56;G+=(255-G)*t*0.47;B+=(255-B)*t*0.46;}
   d[i]=R;d[i+1]=G;d[i+2]=B;}}
 if(P.clarity&&opt.getBlur){const bl=opt.getBlur(), am=P.clarity>0?P.clarity/100*1.1:P.clarity/100*0.8;
  for(let i=0;i<n;i+=4){d[i]+=(d[i]-bl[i])*am;d[i+1]+=(d[i+1]-bl[i+1])*am;d[i+2]+=(d[i+2]-bl[i+2])*am;}}
 if(P.sharp>0&&opt.getSharp){const bl=opt.getSharp(), am=P.sharp/100*1.6;
  for(let i=0;i<n;i+=4){d[i]+=(d[i]-bl[i])*am;d[i+1]+=(d[i+1]-bl[i+1])*am;d[i+2]+=(d[i+2]-bl[i+2])*am;}}
 const B=P.bright*0.9, sat=1+P.sat/100;
 let cf=P.contrast>=0?1+P.contrast/100*1.3:1+P.contrast/100*0.85; cf*=1+0.22*FL;
 const W=P.warm*0.45, T=P.tint*0.4, F=P.fade/100, V=P.vig/100+0.2*FL, G=P.grain, HL=P.highl/100, SH=P.shadow/100;
 const cx=w/2, cy=h/2, md=cx*cx+cy*cy, toned=hi[0]||hi[1]||hi[2]||sh[0]||sh[1]||sh[2];
 const gs=Math.max(1,Math.round(Math.max(w,h)/1100));
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;
  let r=d[i]+B, g=d[i+1]+B, b=d[i+2]+B;
  if(HL||SH){const l=(0.299*r+0.587*g+0.114*b)/255;
   const ad=(HL*(l>0.5?(l-0.5)*2:0)*(HL>0?(1-l):l)*120)+(SH*(l<0.5?(0.5-l)*2:0)*(SH>0?(1-l):l)*120);
   r+=ad;g+=ad;b+=ad;}
  r=(r-128)*cf+128;g=(g-128)*cf+128;b=(b-128)*cf+128;
  const L=0.299*r+0.587*g+0.114*b;
  r=L+(r-L)*sat;g=L+(g-L)*sat;b=L+(b-L)*sat;
  if(mono){r+=(L-r)*mono;g+=(L-g)*mono;b+=(L-b)*mono;}
  r+=W;b-=W;g-=T;r+=T*0.3;b+=T*0.3;
  if(toned){const l=L<0?0:L>255?1:L/255, m=1-l;r+=hi[0]*l+sh[0]*m;g+=hi[1]*l+sh[1]*m;b+=hi[2]*l+sh[2]*m;}
  if(F){r=r*(1-F*0.22)+F*38;g=g*(1-F*0.22)+F*38;b=b*(1-F*0.22)+F*38;}
  if(V||FL){const dd=((x-cx)*(x-cx)+(y-cy)*(y-cy))/md;
   if(FL){const ex=x-fcx, ey=y-fcy, hot=Math.exp(-(ex*ex+ey*ey)/fs2), k=FL*hot, fall=1-FL*0.42*(1-hot);
    r=r*fall*(1+0.24*k)+20*k;g=g*fall*(1+0.24*k)+21*k;b=b*fall*(1+0.28*k)+27*k;
    const L2=0.299*r+0.587*g+0.114*b;if(L2>195){const sp=Math.min(1,(L2-195)/60)*FL*0.4;r+=(255-r)*sp;g+=(255-g)*sp;b+=(255-b)*sp;}
    b+=7*FL;r-=2*FL;}
   if(V){const m=1-Math.min(0.95,V*0.8*dd*Math.sqrt(dd));r*=m;g*=m;b*=m;}}
  if(HZ){const t=HZ*0.32*(0.55+0.45*y/h);r=r*(1-t)+235*t;g=g*(1-t)+238*t;b=b*(1-t)+242*t;}
  if(G){const q=(hash((x/gs)|0,(y/gs)|0)-0.5)*G*0.9;r+=q;g+=q;b+=q;}
  d[i]=r;d[i+1]=g;d[i+2]=b;}
}
function flashCenter(faces){if(!faces||!faces.length)return null;let x=0,y=0,r=0;for(const f of faces){x+=f[1].x;y+=f[1].y;r=Math.max(r,Math.hypot(f[454].x-f[234].x,f[454].y-f[234].y));}
 return {x:x/faces.length,y:y/faces.length,r:Math.max(0.22,r*1.25)};}
const cfgS=faces=>({adj:S.adj,filter:S.filter,fstr:S.fstr,beauty:S.beauty,fx:S.fx,flashC:flashCenter(faces)});

/* ================= GEOMETRY ================= */
function rotDims(){const q=S.rot%2!==0;return q?[S.src.height,S.src.width]:[S.src.width,S.src.height];}
function buildBase(maxSide,crop,src=S.src){
 const q=S.rot%2!==0, RW=q?src.height:src.width, RH=q?src.width:src.height;
 const c=crop||{x:0,y:0,w:1,h:1}, cw=RW*c.w, ch=RH*c.h, sc=Math.min(1,maxSide/Math.max(cw,ch));
 const out=mk(cw*sc,ch*sc), x=ctx2(out);x.imageSmoothingQuality='high';
 x.scale(out.width/cw,out.height/ch);x.translate(-c.x*RW,-c.y*RH);x.translate(RW/2,RH/2);
 const a=S.straight*Math.PI/180, co=Math.abs(Math.cos(a)), si=Math.abs(Math.sin(a));
 const cover=Math.max((RW*co+RH*si)/RW,(RW*si+RH*co)/RH);
 x.rotate(a);x.scale(cover,cover);x.rotate(S.rot*Math.PI/2);if(S.flip)x.scale(-1,1);
 x.drawImage(src,-src.width/2,-src.height/2);
 return out;}

/* ================= WARP (bentuk wajah/badan) ================= */
function warp(d,w,h,op){
 const R=op.r;if(!(R>=2))return;
 const x0=Math.max(0,Math.floor(op.x-R)), x1=Math.min(w-1,Math.ceil(op.x+R)), y0=Math.max(0,Math.floor(op.y-R)), y1=Math.min(h-1,Math.ceil(op.y+R));
 if(x0>=x1||y0>=y1)return;
 const m=Math.ceil(op.t==='push'?Math.max(Math.abs(op.dx),Math.abs(op.dy)):R)+2;
 const sx0=Math.max(0,x0-m), sx1=Math.min(w-1,x1+m), sy0=Math.max(0,y0-m), sy1=Math.min(h-1,y1+m), sw=sx1-sx0+1, sh=sy1-sy0+1;
 if(sw<2||sh<2)return;
 const src=new Uint8ClampedArray(sw*sh*4);
 for(let y=0;y<sh;y++)src.set(d.subarray(((sy0+y)*w+sx0)*4,((sy0+y)*w+sx1+1)*4),y*sw*4);
 const R2=R*R;
 for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
  const ex=x-op.x, ey=y-op.y, dd=ex*ex+ey*ey;if(dd>=R2)continue;
  let f=1-dd/R2;f*=f;let fx,fy;
  if(op.t==='push'){fx=x-op.dx*f;fy=y-op.dy*f;}else{const k=1-op.s*f;fx=op.x+ex*k;fy=op.y+ey*k;}
  let lx=fx-sx0, ly=fy-sy0;if(lx<0)lx=0;if(ly<0)ly=0;if(lx>sw-1.001)lx=sw-1.001;if(ly>sh-1.001)ly=sh-1.001;
  const ix=lx|0, iy=ly|0, ax=lx-ix, ay=ly-iy, i00=(iy*sw+ix)*4, i10=i00+4, i01=i00+sw*4, i11=i01+4, o=(y*w+x)*4;
  for(let c=0;c<4;c++)d[o+c]=(src[i00+c]*(1-ax)+src[i10+c]*ax)*(1-ay)+(src[i01+c]*(1-ax)+src[i11+c]*ax)*ay;}
}
function stretch(id,w,h,y0,a){
 const Y0=y0*h, nh=Math.round(Y0+(h-Y0)*(1+a)), out=new ImageData(w,nh), s=id.data, o=out.data, row=w*4;
 for(let yo=0;yo<nh;yo++){let ys=yo<Y0?yo:Y0+(yo-Y0)/(1+a);if(ys>h-1)ys=h-1;const iy=ys|0, f=ys-iy, iy2=Math.min(h-1,iy+1);
  const a1=iy*row, a2=iy2*row, b=yo*row;
  if(f<0.01)o.set(s.subarray(a1,a1+row),b);else for(let x=0;x<row;x++)o[b+x]=s[a1+x]*(1-f)+s[a2+x]*f;}
 return out;}
function faceWarps(faces,w,h,F){const ops=[];
 for(const f of faces){const P=i=>({x:f[i].x*w,y:f[i].y*h});const fw=dist(P(234),P(454)), nose=P(1);
  if(F.slim){const k=F.slim/100;for(const i of [93,132,58,172,136,150,323,361,288,397,365,379]){const p=P(i);ops.push({t:'push',x:p.x,y:p.y,dx:(nose.x-p.x)*0.15*k,dy:(nose.y-p.y)*0.04*k,r:fw*0.2});}
   const ch=P(152);ops.push({t:'push',x:ch.x,y:ch.y,dx:0,dy:-fw*0.03*k,r:fw*0.2});}
  if(F.eyes){const s=F.eyes/100*0.3;for(const [c,a,b] of [[468,33,133],[473,362,263]]){const p=P(c);ops.push({t:'bulge',x:p.x,y:p.y,r:dist(P(a),P(b))*1.15,s});}}
  if(F.nose){const p=P(4), q=P(1);ops.push({t:'bulge',x:(p.x+q.x)/2,y:(p.y+q.y)/2,r:dist(P(98),P(327))*1.0,s:-F.nose/100*0.35});}}
 return ops;}

/* ================= MAKEUP ================= */
const LO=[61,146,91,181,84,17,314,405,321,375,291,409,270,269,267,0,37,39,40,185], LI=[78,95,88,178,87,14,317,402,318,324,308,415,310,311,312,13,82,81,80,191];
function softShape(bw,bh,blur,drawPath,color){const o=mk(bw,bh), x=o.getContext('2d'), OFF=bw+blur*4+10;
 x.save();x.translate(-OFF,0);x.shadowColor=color;x.shadowBlur=blur;x.shadowOffsetX=OFF;x.fillStyle=color;drawPath(x,OFF);x.restore();return o;}
function drawMakeup(cx,w,h,faces,F){
 for(const f of faces){const P=i=>({x:f[i].x*w,y:f[i].y*h});const fw=dist(P(234),P(454));
  const outer=LO.map(P), inner=LI.map(P);
  const xs=outer.map(p=>p.x), ys=outer.map(p=>p.y), pad=fw*0.06;
  const bx=Math.floor(Math.min(...xs)-pad), by=Math.floor(Math.min(...ys)-pad), bw=Math.ceil(Math.max(...xs)-bx+pad), bh=Math.ceil(Math.max(...ys)-by+pad);
  if(F.lips&&bw>2&&bh>2){const a=F.lips/100;
   const o=softShape(bw,bh,Math.max(1,fw*0.012),(x,off)=>{x.beginPath();outer.forEach((p,i)=>i?x.lineTo(p.x-bx+off,p.y-by):x.moveTo(p.x-bx+off,p.y-by));x.closePath();inner.slice().reverse().forEach((p,i)=>i?x.lineTo(p.x-bx+off,p.y-by):x.moveTo(p.x-bx+off,p.y-by));x.closePath();x.fill('evenodd');},F.lipC);
   cx.save();cx.globalCompositeOperation='color';cx.globalAlpha=a*0.55;cx.drawImage(o,bx,by);
   cx.globalCompositeOperation='soft-light';cx.globalAlpha=a*0.6;cx.drawImage(o,bx,by);
   cx.globalCompositeOperation='multiply';cx.globalAlpha=a*0.22;cx.drawImage(o,bx,by);cx.restore();}
  if(F.teeth&&bw>2&&bh>2){const a=F.teeth/100, m=mk(bw,bh), mx=m.getContext('2d');mx.fillStyle='#fff';mx.beginPath();inner.forEach((p,i)=>i?mx.lineTo(p.x-bx,p.y-by):mx.moveTo(p.x-bx,p.y-by));mx.closePath();mx.fill();
   const sx=clamp(bx,0,w-1), sy=clamp(by,0,h-1), ew=Math.min(bw,w-sx), eh=Math.min(bh,h-sy);
   if(ew>0&&eh>0){const md=mx.getImageData(sx-bx,sy-by,ew,eh).data, id=cx.getImageData(sx,sy,ew,eh), d=id.data;
    for(let i=0;i<d.length;i+=4){const mm=md[i+3]/255;if(!mm)continue;const r=d[i],g=d[i+1],b=d[i+2],L=0.299*r+0.587*g+0.114*b;if(L<65)continue;
     const k=a*mm*Math.min(1,(L-65)/50), t=Math.min(255,L*1.15+12);d[i]=r+(t-r)*k*0.8;d[i+1]=g+(t-g)*k*0.8;d[i+2]=b+(t+6-b)*k*0.9;}
    cx.putImageData(id,sx,sy);}}
  if(F.blush){const a=F.blush/100;for(const i of [50,280]){const p=P(i), r=fw*0.15, g=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,r);const [R,G,B]=hex(F.blushC);
    g.addColorStop(0,`rgba(${R},${G},${B},0.9)`);g.addColorStop(1,`rgba(${R},${G},${B},0)`);cx.save();cx.fillStyle=g;
    cx.globalCompositeOperation='soft-light';cx.globalAlpha=a*0.7;cx.fillRect(p.x-r,p.y-r,r*2,r*2);cx.globalCompositeOperation='multiply';cx.globalAlpha=a*0.18;cx.fillRect(p.x-r,p.y-r,r*2,r*2);cx.restore();}}
 }
}

const OVAL=[10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109];
const EYE_L=[33,246,161,160,159,158,157,173,133,155,154,153,145,144,163,7], EYE_R=[362,398,384,385,386,387,388,466,263,249,390,373,374,380,381,382];
const BROW_L=[70,63,105,66,107,55,65,52,53,46], BROW_R=[300,293,334,296,336,285,295,282,283,276], NOSTR=[];
function skinMask(w,h,faces,seg){const m=mk(w,h), x=m.getContext('2d',{willReadFrequently:true}), OFF=w+500;
 if(seg){x.fillStyle='#fff';x.fillRect(0,0,w,h);}
 const poly=(pts,sc)=>{let cx=0,cy=0;pts.forEach(p=>{cx+=p.x;cy+=p.y;});cx/=pts.length;cy/=pts.length;x.beginPath();pts.forEach((p,i)=>{const X=cx+(p.x-cx)*sc+OFF, Y=cy+(p.y-cy)*sc;i?x.lineTo(X,Y):x.moveTo(X,Y);});x.closePath();x.fill();};
 for(const f of faces){const P=i=>({x:f[i].x*w,y:f[i].y*h}), fw=dist(P(234),P(454));
  x.save();x.translate(-OFF,0);x.shadowOffsetX=OFF;x.fillStyle=x.shadowColor='#fff';x.shadowBlur=fw*0.05;if(!seg)poly(OVAL.map(P),0.97);
  x.globalCompositeOperation='destination-out';x.shadowBlur=fw*0.025;
  poly(EYE_L.map(P),1.7);poly(EYE_R.map(P),1.7);poly(BROW_L.map(P),1.35);poly(BROW_R.map(P),1.35);poly(LO.map(P),1.18);x.restore();}
 const d=x.getImageData(0,0,w,h).data, out=new Uint8Array(w*h);
 if(seg){const sx=seg.w/w, sy=seg.h/h, same=seg.w===w&&seg.h===h;for(let y=0;y<h;y++)for(let X=0;X<w;X++){const i=y*w+X, v=same?seg.skin[i]:seg.skin[Math.min(seg.h-1,(y*sy)|0)*seg.w+Math.min(seg.w-1,(X*sx)|0)];let t=(v-0.2)/0.6;t=t<0?0:t>1?1:t;out[i]=d[i*4+3]*t;}}
 else for(let i=0;i<out.length;i++)out[i]=d[i*4+3];return out;}
/* ================= AI (MediaPipe, disimpan lokal di folder ai/) ================= */
const AI={vision:null,fileset:null,face:null,seg:null};
async function aiFileset(){if(!AI.vision)AI.vision=await import('./vision_bundle.js');if(!AI.fileset)AI.fileset=await AI.vision.FilesetResolver.forVisionTasks(new URL('.',location.href).href.replace(/\/$/,''));return AI.fileset;}
async function aiFace(){if(AI.face)return AI.face;const fs=await aiFileset();
 AI.face=await AI.vision.FaceLandmarker.createFromOptions(fs,{baseOptions:{modelAssetPath:new URL('face_landmarker.task',location.href).href,delegate:'CPU'},runningMode:'IMAGE',numFaces:4});return AI.face;}
async function aiSeg(){if(AI.seg)return AI.seg;const fs=await aiFileset();
 AI.seg=await AI.vision.ImageSegmenter.createFromOptions(fs,{baseOptions:{modelAssetPath:new URL('selfie_multiclass_256x256.tflite',location.href).href,delegate:'CPU'},runningMode:'IMAGE',outputConfidenceMasks:true,outputCategoryMask:false});return AI.seg;}
let FACE={key:'',faces:null,status:'idle'}, MASK={key:'',mask:null,status:'idle'};
function needSeg(){return S.bg.mode!=='none'||S.beauty.smooth>0||S.beauty.glow>0;}
function needFace(){const F=S.face;return S.beauty.smooth>0||S.beauty.glow>0||(S.fx.flash||0)>0||(S.fx.retro||0)>0||F.slim>0||F.eyes>0||F.nose>0||F.lips>0||F.blush>0||F.teeth>0;}
function aiNote(t){const n=$('#aiNote');if(n)n.textContent=t;}
function requestFace(key,canvas){if(FACE.key===key&&FACE.status!=='idle')return;FACE={key,faces:null,status:'loading'};aiNote('Memuat AI wajah… (sekali saja)');
 aiFace().then(lm=>{if(FACE.key!==key)return;const r=lm.detect(canvas);FACE.faces=(r.faceLandmarks||[]).filter(f=>f.length>=478);FACE.status=FACE.faces.length?'ready':'none';
  aiNote(FACE.faces.length?`AI wajah aktif (${FACE.faces.length} wajah)`:'Wajah tidak terdeteksi di foto ini');req();})
 .catch(e=>{console.error(e);FACE.status='error';aiNote('AI wajah gagal dimuat. Buka sekali saat online.');});}
function boxF(src,w,h,r){const t=new Float32Array(w*h), o=new Float32Array(w*h), dv=2*r+1;
 for(let y=0;y<h;y++){const row=y*w;let a=0;for(let k=-r;k<=r;k++)a+=src[row+clamp(k,0,w-1)];for(let x=0;x<w;x++){t[row+x]=a/dv;a+=src[row+Math.min(w-1,x+r+1)]-src[row+Math.max(0,x-r)];}}
 for(let x=0;x<w;x++){let a=0;for(let k=-r;k<=r;k++)a+=t[clamp(k,0,h-1)*w+x];for(let y=0;y<h;y++){o[y*w+x]=a/dv;a+=t[Math.min(h-1,y+r+1)*w+x]-t[Math.max(0,y-r)*w+x];}}return o;}
function guided(I,p,w,h,r,eps){const n=w*h, Ip=new Float32Array(n), II=new Float32Array(n);for(let i=0;i<n;i++){Ip[i]=I[i]*p[i];II[i]=I[i]*I[i];}
 const mI=boxF(I,w,h,r), mP=boxF(p,w,h,r), mIp=boxF(Ip,w,h,r), mII=boxF(II,w,h,r), A=new Float32Array(n), B=new Float32Array(n);
 for(let i=0;i<n;i++){const v=mII[i]-mI[i]*mI[i], cv=mIp[i]-mI[i]*mP[i];A[i]=cv/(v+eps);B[i]=mP[i]-A[i]*mI[i];}
 const mA=boxF(A,w,h,r), mB=boxF(B,w,h,r), q=new Float32Array(n);for(let i=0;i<n;i++){const v=mA[i]*I[i]+mB[i];q[i]=v<0?0:v>1?1:v;}return q;}
async function segmentCanvas(canvas){const seg=await aiSeg();const r=seg.segment(canvas);const M=r.confidenceMasks, w=M[0].width, h=M[0].height, n=w*h;
 const bg=M[0].getAsFloat32Array(), bs=M[2].getAsFloat32Array(), fsk=M[3].getAsFloat32Array();
 const person=new Float32Array(n), skin=new Float32Array(n);for(let i=0;i<n;i++){person[i]=1-bg[i];skin[i]=Math.min(1,bs[i]+fsk[i]);}
 try{r.close&&r.close();}catch(e){}
 // haluskan tepi orang mengikuti detail foto (guided filter) supaya rambut & tepi rapi
 let refined=person;try{const g=ctx2(canvas).getImageData(0,0,w,h).data, I=new Float32Array(n);for(let i=0;i<n;i++)I[i]=(0.299*g[i*4]+0.587*g[i*4+1]+0.114*g[i*4+2])/255;
  refined=guided(I,person,w,h,Math.max(2,Math.round(Math.min(w,h)*0.012)),0.0008);}catch(e){console.error(e);}
 return {w,h,data:refined,skin};}
function requestMask(key,canvas){if(MASK.key===key&&MASK.status!=='idle')return;MASK={key,mask:null,status:'loading'};aiNote('Memuat AI kulit & latar… (sekali saja)');
 segmentCanvas(canvas).then(m=>{if(MASK.key!==key)return;MASK.mask=m;MASK.status='ready';aiNote('AI kulit & latar aktif');req();})
 .catch(e=>{console.error(e);MASK.status='error';aiNote('AI latar gagal dimuat. Buka sekali saat online.');});}

/* ================= BACKGROUND ================= */
function maskAt(mask,w,h){ // returns function(index)->0..1
 const same=mask.w===w&&mask.h===h, md=mask.data, sx=mask.w/w, sy=mask.h/h;
 return (x,y)=>{let v=same?md[y*w+x]:md[Math.min(mask.h-1,(y*sy)|0)*mask.w+Math.min(mask.w-1,(x*sx)|0)];v=(v-0.12)/0.76;return v<0?0:v>1?1:v;};}
function applyBg(d,w,h,mask,bg,getBlur){
 const M=maskAt(mask,w,h);let bl=null, col=null, g1=null, g2=null;
 if(bg.mode==='blur')bl=getBlur();if(bg.mode==='color')col=hex(bg.color);if(bg.mode==='grad'){g1=hex(GRADS[bg.grad][0]);g2=hex(GRADS[bg.grad][1]);}
 for(let y=0;y<h;y++){let gc=null;if(g1){const t=y/h;gc=[g1[0]+(g2[0]-g1[0])*t,g1[1]+(g2[1]-g1[1])*t,g1[2]+(g2[2]-g1[2])*t];}
  for(let x=0;x<w;x++){const i=(y*w+x)*4, m=M(x,y);if(m>=1)continue;const n=1-m;
   if(bl){d[i]=d[i]*m+bl[i]*n;d[i+1]=d[i+1]*m+bl[i+1]*n;d[i+2]=d[i+2]*m+bl[i+2]*n;}
   else if(col||gc){const c=col||gc;d[i]=d[i]*m+c[0]*n;d[i+1]=d[i+1]*m+c[1]*n;d[i+2]=d[i+2]*m+c[2]*n;}
   else if(bg.mode==='remove'){d[i+3]=d[i+3]*m;}}}}
function splash(d,w,h,mask){const M=maskAt(mask,w,h);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4, n=1-M(x,y);if(!n)continue;const L=0.299*d[i]+0.587*d[i+1]+0.114*d[i+2];d[i]+=(L-d[i])*n;d[i+1]+=(L-d[i+1])*n;d[i+2]+=(L-d[i+2])*n;}}

/* ================= CANVAS EFFECTS ================= */
function star(c,x,y,s,rot){c.save();c.translate(x,y);c.rotate(rot);
 const g=c.createRadialGradient(0,0,0,0,0,s*0.45);g.addColorStop(0,'rgba(255,255,255,0.85)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.beginPath();c.arc(0,0,s*0.45,0,7);c.fill();
 c.fillStyle='rgba(255,255,255,0.95)';c.beginPath();for(let k=0;k<8;k++){const a=k*Math.PI/4, r=k%2?s*0.07:s;c.lineTo(Math.cos(a)*r,Math.sin(a)*r);}c.closePath();c.fill();c.restore();}
function applyFx(c,w,h,fx,id,seed,date){
 const A=k=>(fx[k]||0)/100, m=Math.min(w,h), d=id.data;
 if(A('bloom')){const a=A('bloom'), s=mk(w/14,h/14), sx=ctx2(s);sx.drawImage(c.canvas,0,0,s.width,s.height);const q=sx.getImageData(0,0,s.width,s.height), qd=q.data;
  for(let i=0;i<qd.length;i+=4){const L=0.299*qd[i]+0.587*qd[i+1]+0.114*qd[i+2], t=L<120?0:Math.min(1,(L-120)/110);qd[i]*=t;qd[i+1]*=t;qd[i+2]*=t;}sx.putImageData(q,0,0);
  const s2=mk(s.width/2,s.height/2);s2.getContext('2d').drawImage(s,0,0,s2.width,s2.height);
  c.save();c.imageSmoothingQuality='high';c.globalCompositeOperation='screen';c.globalAlpha=Math.min(1,a*0.9);c.drawImage(s,0,0,w,h);c.globalAlpha=Math.min(1,a*0.7);c.drawImage(s2,0,0,w,h);c.restore();}
 if(A('leak')){const a=A('leak');c.save();c.globalCompositeOperation='screen';c.globalAlpha=a;
  const L=[[0,h*0.35,m*0.9,'255,95,20','255,30,70'],[w,0,m*0.75,'255,200,60','255,120,40'],[w*0.85,h,m*0.6,'255,60,140','160,40,255']];
  for(const [x,y,r,c1,c2] of L){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${c1},0.95)`);g.addColorStop(0.45,`rgba(${c2},0.4)`);g.addColorStop(1,`rgba(${c2},0)`);c.fillStyle=g;c.fillRect(0,0,w,h);}c.restore();}
 if(A('prism')){const a=A('prism');c.save();c.globalCompositeOperation='screen';c.globalAlpha=a*0.55;const g=c.createLinearGradient(0,h*0.15,w,h*0.85);
  [['0','255,0,0,0'],['.30','255,0,0,0'],['.38','255,60,60,.8'],['.44','255,200,0,.8'],['.5','60,255,120,.8'],['.56','40,160,255,.8'],['.62','170,60,255,.8'],['.70','170,60,255,0'],['1','0,0,0,0']].forEach(([o,cc])=>g.addColorStop(+o,`rgba(${cc})`));
  c.fillStyle=g;c.fillRect(0,0,w,h);c.restore();}
 if(A('bokeh')){const a=A('bokeh'), R=rng(seed+11), n=Math.round(8+34*a);c.save();c.globalCompositeOperation='screen';
  for(let i=0;i<n;i++){const x=R()*w, y=R()*h, r=m*(0.02+R()*0.07), px=Math.min(w-1,x|0), py=Math.min(h-1,y|0), j=(py*w+px)*4;
   const col=`${Math.min(255,d[j]+90)|0},${Math.min(255,d[j+1]+90)|0},${Math.min(255,d[j+2]+90)|0}`;const g=c.createRadialGradient(x,y,r*0.6,x,y,r);
   g.addColorStop(0,`rgba(${col},${0.25+0.3*a})`);g.addColorStop(0.85,`rgba(${col},${0.32+0.3*a})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();}c.restore();}
 if(A('glitter')){const a=A('glitter'), R=rng(seed+7), N=48, step=m/N;c.save();c.globalCompositeOperation='lighter';
  for(let gy=0;gy*step<h;gy++)for(let gx=0;gx*step<w;gx++){const r1=R(), r2=R(), r3=R(), r4=R(), r5=R();
   const x=Math.min(w-1,(gx+r1)*step)|0, y=Math.min(h-1,(gy+r2)*step)|0, j=(y*w+x)*4, L=0.299*d[j]+0.587*d[j+1]+0.114*d[j+2];
   if(L>175&&r3<a*0.6*((L-175)/80))star(c,x,y,m*(0.01+r4*0.025)*(0.6+a*0.6),r5*0.6);
   else if(r3<a*0.05){c.fillStyle='rgba(255,255,255,0.8)';c.beginPath();c.arc(x,y,m*0.002*(1+r4*2),0,7);c.fill();}}c.restore();}
 if(A('rgb')||A('glitch')){const off=Math.round((A('rgb')*0.012+A('glitch')*0.004)*m);if(off>0){const q=c.getImageData(0,0,w,h), s=new Uint8ClampedArray(q.data), o=q.data;
   for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4, xr=Math.min(w-1,x+off), xb=Math.max(0,x-off);o[i]=s[(y*w+xr)*4];o[i+2]=s[(y*w+xb)*4+2];}c.putImageData(q,0,0);}}
 if(A('glitch')){const a=A('glitch'), R=rng(seed+3), n=Math.round(4+12*a);for(let i=0;i<n;i++){const y=R()*h, bh=h*(0.008+R()*0.05), dx=(R()-0.5)*w*0.14*a;c.drawImage(c.canvas,0,y,w,bh,dx,y,w,bh);}}
 if(A('dust')){const a=A('dust'), R=rng(seed+5), n=Math.round(40+320*a);c.save();
  for(let i=0;i<n;i++){const x=R()*w, y=R()*h, r=m*(0.0012+R()*0.003);c.fillStyle=R()<0.5?`rgba(255,255,250,${0.35+0.4*a})`:`rgba(20,15,10,${0.3+0.4*a})`;c.beginPath();c.arc(x,y,r,0,7);c.fill();}
  c.strokeStyle=`rgba(255,255,245,${0.12+0.25*a})`;for(let i=0;i<1+Math.round(3*a);i++){const x=R()*w;c.lineWidth=Math.max(1,m*0.0012);c.beginPath();c.moveTo(x,R()*h*0.3);c.lineTo(x+(R()-0.5)*m*0.02,h*(0.6+R()*0.4));c.stroke();}c.restore();}
 if(date||A('retro')){const t=new Date(), s=`'${String(t.getFullYear()).slice(2)} ${String(t.getMonth()+1).padStart(2,'0')} ${String(t.getDate()).padStart(2,'0')}`, fs=m*0.055;
  c.save();c.font=`700 ${fs}px "Courier New",Courier,monospace`;c.textAlign='right';c.textBaseline='alphabetic';c.shadowColor='rgba(255,120,20,0.9)';c.shadowBlur=fs*0.35;c.fillStyle='#ff9a2e';c.fillText(s,w-m*0.06,h-m*0.06);c.shadowBlur=0;c.fillStyle='rgba(255,210,150,0.9)';c.fillText(s,w-m*0.06,h-m*0.06);c.restore();}
}

/* ================= STROKES / ITEMS / FRAME ================= */
function fxLayer(src,w,h,kind){
 const div=kind==='mosaic'?Math.max(6,Math.round(Math.max(w,h)/55)):kind==='heal'?Math.max(4,Math.round(Math.max(w,h)/90)):Math.max(6,Math.round(Math.max(w,h)/45));
 const s=mk(w/div,h/div), sx=s.getContext('2d');sx.imageSmoothingQuality='high';sx.drawImage(src,0,0,s.width,s.height);
 const o=mk(w,h), ox=o.getContext('2d');ox.imageSmoothingEnabled=kind!=='mosaic';ox.imageSmoothingQuality='high';ox.drawImage(s,0,0,w,h);return o;}
function pathStroke(x,st,w,h){const p=st.p;x.beginPath();x.moveTo(p[0][0]*w,p[0][1]*h);
 if(p.length===1)x.lineTo(p[0][0]*w+0.01,p[0][1]*h);
 for(let i=1;i<p.length-1;i++){const mx=(p[i][0]+p[i+1][0])/2*w,my=(p[i][1]+p[i+1][1])/2*h;x.quadraticCurveTo(p[i][0]*w,p[i][1]*h,mx,my);}
 if(p.length>1){const l=p[p.length-1];x.lineTo(l[0]*w,l[1]*h);}
 x.lineCap='round';x.lineJoin='round';x.lineWidth=st.w*w;}
function drawStrokes(c,w,h){
 if(!S.strokes.length)return;
 for(const kind of ['heal','mosaic','blur']){const list=S.strokes.filter(s=>s.k===kind);if(!list.length)continue;
  const layer=fxLayer(c.canvas,w,h,kind), m=mk(w,h), mx=m.getContext('2d');
  for(const st of list){
   if(kind==='heal'){const [px,py]=st.p[0], r=st.w*w/2, g=mx.createRadialGradient(px*w,py*h,0,px*w,py*h,r);g.addColorStop(0,'#000');g.addColorStop(.6,'#000');g.addColorStop(1,'#0000');mx.fillStyle=g;mx.beginPath();mx.arc(px*w,py*h,r,0,7);mx.fill();}
   else{pathStroke(mx,st,w,h);mx.strokeStyle='#000';mx.stroke();}}
  mx.globalCompositeOperation='source-in';mx.drawImage(layer,0,0);c.drawImage(m,0,0);}
 for(const st of S.strokes){if(!['draw','marker','neon'].includes(st.k))continue;c.save();pathStroke(c,st,w,h);
  if(st.k==='marker'){c.globalAlpha=.45;c.lineCap='square';c.strokeStyle=st.c;c.stroke();}
  else if(st.k==='neon'){c.shadowColor=st.c;c.shadowBlur=st.w*w*1.6;c.strokeStyle=st.c;c.stroke();c.shadowBlur=0;c.lineWidth=st.w*w*0.4;c.strokeStyle='#fff';c.stroke();}
  else{c.strokeStyle=st.c;c.stroke();}c.restore();}}
function drawItems(c,w,h,preview){
 S.items.forEach((it,idx)=>{const fs=it.size*w;c.save();c.translate(it.x*w,it.y*h);c.rotate(it.rot||0);c.textAlign='center';c.textBaseline='middle';let hw,hh;
  if(it.type==='emoji'){c.font=fs+'px '+EMOJI_FONT;c.fillText(it.text,0,fs*0.05);hw=fs*0.6;hh=fs*0.6;}
  else{const F=FONTS[it.font]||FONTS[0];c.font=F[1]+' '+fs+'px '+F[2];const lines=String(it.text).split('\n'), lh=fs*1.18;
   const mw=Math.max(...lines.map(l=>c.measureText(l).width),fs*0.5);hw=mw/2;hh=lines.length*lh/2;const y0=-hh+lh/2;
   if(it.style==='latar'){const px=fs*0.35,py=fs*0.18;c.fillStyle=it.color;const rx=-hw-px,ry=-hh-py,rw=mw+px*2,rh=hh*2+py*2;
    c.beginPath();if(c.roundRect)c.roundRect(rx,ry,rw,rh,fs*0.3);else c.rect(rx,ry,rw,rh);c.fill();hw+=px;hh+=py;
    c.fillStyle=lum(it.color)>0.6?'#111':'#fff';lines.forEach((l,i)=>c.fillText(l,0,y0+i*lh));}
   else{if(it.style==='garis'){c.lineJoin='round';c.lineWidth=fs*0.14;c.strokeStyle=lum(it.color)>0.5?'#111':'#fff';lines.forEach((l,i)=>c.strokeText(l,0,y0+i*lh));}
    else if(it.style==='bayang'){c.shadowColor='#000a';c.shadowBlur=fs*0.15;c.shadowOffsetY=fs*0.05;}
    else if(it.style==='neon'){c.shadowColor=it.color;c.shadowBlur=fs*0.45;}
    c.fillStyle=it.style==='neon'?'#fff':it.color;lines.forEach((l,i)=>c.fillText(l,0,y0+i*lh));
    if(it.style==='neon'){c.fillStyle=it.color;c.globalAlpha=.35;lines.forEach((l,i)=>c.fillText(l,0,y0+i*lh));}}}
  it._hw=hw/w;it._hh=hh/w;
  if(preview&&idx===sel){const p=Math.max(6,w*0.012);c.shadowBlur=0;c.globalAlpha=1;c.setLineDash([w*0.012,w*0.008]);c.lineWidth=Math.max(2,w*0.0035);c.strokeStyle='#fff';c.strokeRect(-hw-p,-hh-p,hw*2+p*2,hh*2+p*2);}
  c.restore();});}
function drawFrame(c,w,h,f){
 if(f==='none')return;const m=Math.min(w,h);c.save();
 const border=(t,col)=>{c.fillStyle=col;c.fillRect(0,0,w,t);c.fillRect(0,h-t,w,t);c.fillRect(0,0,t,h);c.fillRect(w-t,0,t,h);};
 if(f==='putih')border(m*0.04,'#fff');
 else if(f==='hitam')border(m*0.04,'#000');
 else if(f==='polaroid'){const t=m*0.05;c.fillStyle='#fbfaf6';c.fillRect(0,0,w,t);c.fillRect(0,0,t,h);c.fillRect(w-t,0,t,h);c.fillRect(0,h-m*0.17,w,m*0.17);}
 else if(f==='film'){const t=m*0.09;c.fillStyle='#111';c.fillRect(0,0,t,h);c.fillRect(w-t,0,t,h);c.fillStyle='#f4f1e8';const hs=t*0.38,gap=hs*1.9;for(let y=gap/2;y<h;y+=gap){c.fillRect(t*0.31,y,hs,hs*0.75);c.fillRect(w-t*0.31-hs,y,hs,hs*0.75);}}
 else if(f==='bulat'){c.fillStyle='#000';c.beginPath();c.rect(0,0,w,h);if(c.roundRect)c.roundRect(m*0.03,m*0.03,w-m*0.06,h-m*0.06,m*0.08);c.fill('evenodd');}
 else if(f==='ganda'){border(m*0.03,'#fff');c.strokeStyle='#fff';c.lineWidth=m*0.006;c.strokeRect(m*0.05,m*0.05,w-m*0.1,h-m*0.1);}
 else if(f==='pelangi'){const g=c.createLinearGradient(0,0,w,h);['#ff4d5e','#ff8a3d','#ffd23f','#5ee07a','#38c9ff','#b45cff'].forEach((col,i,a)=>g.addColorStop(i/(a.length-1),col));c.strokeStyle=g;c.lineWidth=m*0.07;c.strokeRect(0,0,w,h);}
 else if(f==='bintik'){const t=m*0.06;border(t,'#ffd6e0');c.fillStyle='#fff';const s=t*0.5;for(let x=s;x<w;x+=t*0.9)for(const y of [t/2,h-t/2]){c.beginPath();c.arc(x,y,t*0.16,0,7);c.fill();}for(let y=s;y<h;y+=t*0.9)for(const x of [t/2,w-t/2]){c.beginPath();c.arc(x,y,t*0.16,0,7);c.fill();}}
 else if(f==='kabur'){const g=c.createRadialGradient(w/2,h/2,m*0.35,w/2,h/2,Math.hypot(w,h)/2);g.addColorStop(0,'#fff0');g.addColorStop(1,'#fff');c.fillStyle=g;c.fillRect(0,0,w,h);}
 c.restore();}

/* ================= PIPELINE ================= */
function stageKeyParts(){return JSON.stringify([S.face,S.body,S.warps]);}
function buildStage(geoC,faces){
 const w=geoC.width, h0=geoC.height, F=S.face, wk=mk(w,h0), cx=ctx2(wk);cx.drawImage(geoC,0,0);
 if(faces&&faces.length&&(F.lips||F.blush||F.teeth))drawMakeup(cx,w,h0,faces,F);
 let id=cx.getImageData(0,0,w,h0);
 if(faces&&faces.length)for(const op of faceWarps(faces,w,h0,F))warp(id.data,w,h0,op);
 if(S.body.tall>0)id=stretch(id,w,h0,S.body.y0/100,S.body.tall/100*0.3);
 const h=id.height;
 for(const o of S.warps)warp(id.data,w,h,o.t==='push'?{t:'push',x:o.x*w,y:o.y*h,dx:o.dx*w,dy:o.dy*h,r:o.r*w}:{t:'bulge',x:o.x*w,y:o.y*h,r:o.r*w,s:o.s});
 return {data:id,w,h};}
function stageCanvas(st){const c=mk(st.w,st.h);c.getContext('2d').putImageData(st.data,0,0);return c;}
function finishImage(st,mask,preview,light,faces){
 const {w,h}=st, id=new ImageData(new Uint8ClampedArray(st.data.data),w,h);
 if(mask&&S.bg.mode!=='none'&&S.bg.mode!=='splash')applyBg(id.data,w,h,mask,S.bg,()=>{const r=Math.max(3,Math.round(Math.min(w,h)*(0.006+S.bg.amt/100*0.03)));if(st.bgR!==r){st.bgR=r;st.bgBlur=boxBlur(st.data.data,w,h,r,3);}return st.bgBlur;});
 const wantSkin=S.beauty.smooth||S.beauty.glow, sg=mask&&mask.skin?mask:null;
 const skin=wantSkin&&(sg||(faces&&faces.length))?((st.skinFor===sg&&st.skin)||(st.skinFor=sg,st.skin=skinMask(w,h,faces||[],sg))):null;
 process(id,w,h,cfgS(faces),{skin,getBlur:()=>st.blur||(st.blur=boxBlur(st.data.data,w,h,blurRad(w,h),3)),getSharp:()=>st.sblur||(st.sblur=boxBlur(st.data.data,w,h,1,1))});
 if(mask&&S.bg.mode==='splash')splash(id.data,w,h,mask);
 const c=mk(w,h), cx=ctx2(c);cx.putImageData(id,0,0);
 if(!light){applyFx(cx,w,h,S.fx,id,S.seed,S.date);drawStrokes(cx,w,h);drawItems(cx,w,h,preview);}
 return c;}
function canvasRatio(){const r=S.canvas.ratio;return r==='none'?0:+r;}
function finalize(img){
 const r=canvasRatio();let FW=img.width,FH=img.height,ox=0,oy=0;
 if(r){if(FW/FH>r)FH=Math.round(FW/r);else FW=Math.round(FH*r);ox=Math.round((FW-img.width)/2);oy=Math.round((FH-img.height)/2);}
 const f=mk(FW,FH), fx=f.getContext('2d');
 if(r){if(S.canvas.bg==='blur'){const s=mk(FW/24,FH/24), sx=s.getContext('2d'), sc=Math.max(s.width/img.width,s.height/img.height);sx.imageSmoothingQuality='high';
   sx.drawImage(img,(s.width-img.width*sc)/2,(s.height-img.height*sc)/2,img.width*sc,img.height*sc);fx.imageSmoothingQuality='high';fx.drawImage(s,0,0,FW,FH);fx.fillStyle='rgba(0,0,0,0.12)';fx.fillRect(0,0,FW,FH);}
  else{fx.fillStyle=S.canvas.bg;fx.fillRect(0,0,FW,FH);}}
 fx.drawImage(img,ox,oy);drawFrame(fx,FW,FH,S.frame);
 return {canvas:f,ox,oy,iw:img.width,ih:img.height};}

/* ---- preview caches ---- */
let GEO={key:''}, STG={key:''};
function geoKey(crop){return [S.srcIdx,S.rot,S.flip,S.straight,JSON.stringify(crop)].join('|');}
let dragging=false;
function getGeo(){const crop=tab==='crop'?null:S.crop, gk=geoKey(crop), size=dragging?620:PREV_MAX, key=gk+'@'+size;if(GEO.key!==key){GEO={key,gk,base:buildBase(size,crop)};if(!dragging)thumbsKey='';}return GEO;}
function getStage(geo){
 let faces=null;
 if(needFace()&&tab!=='crop'){if(!dragging||FACE.key!==geo.gk)requestFace(geo.gk,geo.base);if(FACE.key===geo.gk&&FACE.status==='ready')faces=FACE.faces;}
 const key=geo.key+'#'+(tab==='crop'?'plain':stageKeyParts()+(faces?'F':''));
 const mkey=geo.gk+'#'+stageKeyParts()+(faces?'F':'');
 if(STG.key!==key){STG=tab==='crop'?(()=>{const c=ctx2(geo.base);return {data:c.getImageData(0,0,geo.base.width,geo.base.height),w:geo.base.width,h:geo.base.height};})():buildStage(geo.base,faces);STG.key=key;STG.mkey=mkey;STG.faces=faces;}
 return STG;}
function render(){if(!S.src)return;
 const geo=getGeo(), st=getStage(geo);let mask=null;
 if(tab!=='crop'&&needSeg()){if(!dragging||MASK.key!==st.mkey)requestMask(st.mkey,stageCanvas(st));if(MASK.key===st.mkey&&MASK.status==='ready')mask=MASK.mask;}
 if(showOrig){setCv(geo.base.width,geo.base.height);ctx.drawImage(geo.base,0,0);LAYOUT={ox:0,oy:0,iw:geo.base.width,ih:geo.base.height};return;}
 const img=finishImage(st,mask,true,tab==='crop',st.faces);
 const fin=tab==='crop'?{canvas:img,ox:0,oy:0,iw:img.width,ih:img.height}:finalize(img);
 setCv(fin.canvas.width,fin.canvas.height);ctx.clearRect(0,0,cv.width,cv.height);ctx.drawImage(fin.canvas,0,0);LAYOUT=fin;
 if(tab==='crop')updateCropBox();
 const gd=$('#guide');if(tab==='shape'&&shapeSel==='tall'){gd.style.display='block';gd.style.top=((fin.oy+(S.body.y0/100)*geo.base.height)/fin.canvas.height*100)+'%';}else gd.style.display='none';
 if(tab==='filter'&&!dragging)renderThumbs();}
function setCv(w,h){if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;fit();}}
let raf=0;function req(){if(!raf)raf=requestAnimationFrame(()=>{raf=0;try{render();}catch(e){console.error(e);}});}
function fit(){if(!cv.width)return;const st=$('#stage'),sw=st.clientWidth-20,sh=st.clientHeight-20,s=Math.min(sw/cv.width,sh/cv.height);const fr=$('#frame');fr.style.width=Math.floor(cv.width*s)+'px';fr.style.height=Math.floor(cv.height*s)+'px';}
addEventListener('resize',()=>{fit();});
let hintT=0;function hint(t){const e=$('#hint');e.textContent=t;e.style.opacity=1;clearTimeout(hintT);hintT=setTimeout(()=>e.style.opacity=0,2400);}

/* ---- full-resolution render for saving ---- */
async function renderFull(){
 const geo=buildBase(SRC_MAX,S.crop), key=geoKey(S.crop);let faces=null;dragging=false;
 if(needFace()){if(!(FACE.key===key&&FACE.status==='ready')){requestFace(key,buildBase(PREV_MAX,S.crop));await waitFor(()=>FACE.key===key&&FACE.status!=='loading');}if(FACE.status==='ready')faces=FACE.faces;}
 const st=buildStage(geo,faces);let mask=null;
 if(needSeg()){try{mask=await segmentCanvas(stageCanvas(st));}catch(e){console.error(e);}}
 return finalize(finishImage(st,mask,false,false,faces)).canvas;}
function waitFor(f){return new Promise(r=>{const t=setInterval(()=>{if(f()){clearInterval(t);r();}},100);setTimeout(()=>{clearInterval(t);r();},30000);});}

/* ================= FILTER THUMBNAILS ================= */
let thumbsKey='';
function renderThumbs(){const box=$('#thumbs');if(!box)return;if(thumbsKey===GEO.key&&box.dataset.ok)return;thumbsKey=GEO.key;box.dataset.ok=1;
 const b=GEO.base, s=Math.min(b.width,b.height), t=mk(110,110), tx=ctx2(t);tx.drawImage(b,(b.width-s)/2,(b.height-s)/2,s,s,0,0,110,110);const src=tx.getImageData(0,0,110,110);
 box.querySelectorAll('canvas').forEach(c=>{const id=new ImageData(new Uint8ClampedArray(src.data),110,110);process(id,110,110,{adj:{},filter:c.dataset.f,fstr:100,beauty:{},fx:{}},{});c.getContext('2d').putImageData(id,0,0);});}

/* ================= TOOLS UI ================= */
function el(html){const d=document.createElement('div');d.innerHTML=html.trim();return d.firstChild;}
function slider(label,min,max,val,oninput,onchange){
 const r=el(`<div class="row"><span class="lbl">${label}</span><input type="range" min="${min}" max="${max}" step="1" value="${val}"><span class="val">${Math.round(val)}</span></div>`);
 const i=r.querySelector('input'),v=r.querySelector('.val');
 i.addEventListener('input',()=>{dragging=true;v.textContent=i.value;oninput(+i.value);});
 i.addEventListener('change',()=>{dragging=false;(onchange||commit)();req();});
 i.addEventListener('dblclick',()=>{const z=min<0?0:min;i.value=z;v.textContent=z;oninput(z);(onchange||commit)();});
 return r;}
function chips(list,on,cb,opts={}){const c=document.createElement('div');c.className='chips';
 list.forEach(([id,n,cls])=>{const b=document.createElement('button');b.className='chip'+(id===on?' on':'')+(cls?' '+cls:'')+(opts.dot&&opts.dot(id)?' dot':'');b.textContent=n;b.dataset.id=id;
  b.onclick=()=>{if(!opts.toggle){c.querySelectorAll('.chip').forEach(x=>x.classList.remove('on'));b.classList.add('on');}cb(id,b);};c.appendChild(b);});return c;}
function swatches(list,on,cb){const c=document.createElement('div');c.className='sw';
 list.forEach(col=>{const b=document.createElement('button');b.style.background=Array.isArray(col)?`linear-gradient(${col[0]},${col[1]})`:col;if(col===on)b.className='on';b.onclick=()=>{c.querySelectorAll('button').forEach(x=>x.className='');b.className='on';cb(col);};c.appendChild(b);});return c;}
function note(t,ai){const n=document.createElement('div');n.className='note'+(ai?' ai':'');if(ai)n.id='aiNote';n.textContent=t;return n;}
function selItem(){return sel>=0?S.items[sel]:null;}
function itemBar(){const it=selItem();if(!it)return null;
 const bar=document.createElement('div');bar.className='itembar';
 const s=slider('Ukuran',2,60,Math.round(it.size*100),v=>{it.size=v/100;req();});s.style.flex='1';s.style.padding='0 4px';
 const del=document.createElement('button');del.className='btn sm';del.textContent='Hapus';del.onclick=()=>{S.items.splice(sel,1);sel=-1;commit();buildTools();req();};
 const dup=document.createElement('button');dup.className='btn sm';dup.textContent='Salin';dup.onclick=()=>{const c=JSON.parse(JSON.stringify(it));c.x=Math.min(.95,c.x+.05);c.y=Math.min(.95,c.y+.05);S.items.push(c);sel=S.items.length-1;commit();buildTools();req();};
 bar.append(s,dup,del);return bar;}
function btn(t,fn,cls='btn sm'){const b=document.createElement('button');b.className=cls;b.textContent=t;b.onclick=fn;return b;}
function rowOf(...els){const r=document.createElement('div');r.className='row';r.style.flexWrap='wrap';r.append(...els);return r;}
function aiStatusText(kind){const s=kind==='face'?FACE:MASK;return s.status==='loading'?'Memuat AI… (sekali saja, perlu internet saat pertama)':s.status==='ready'?(kind==='face'?`AI wajah aktif (${FACE.faces.length} wajah)`:'AI latar aktif'):s.status==='none'?'Wajah tidak terdeteksi di foto ini':s.status==='error'?'AI gagal dimuat. Buka sekali saat online.':'Diproses AI di HP kamu';}

function buildTools(){const T=$('#tools');T.innerHTML='';T.scrollTop=0;
 $('#crop').style.display=tab==='crop'?'block':'none';
 if(tab==='filter'){
  const th=document.createElement('div');th.className='thumbs';th.id='thumbs';
  FILTERS.forEach(f=>{const b=document.createElement('button');b.className='thumb'+(S.filter===f.id?' on':'');b.innerHTML=`<canvas width="110" height="110" data-f="${f.id}"></canvas>${f.n}`;
   b.onclick=()=>{S.filter=f.id;th.querySelectorAll('.thumb').forEach(x=>x.classList.remove('on'));b.classList.add('on');commit();req();};th.appendChild(b);});
  T.append(th,slider('Kekuatan',0,100,S.fstr,v=>{S.fstr=v;req();}));thumbsKey='';}
 else if(tab==='fx'){
  const box=document.createElement('div');
  const mkS=()=>{box.innerHTML='';const f=FX.find(x=>x[0]===fxSel);box.append(slider(f[1],0,100,S.fx[fxSel],v=>{S.fx[fxSel]=v;req();},()=>{commit();refreshDots();}));};
  const ch=chips(FX,fxSel,id=>{fxSel=id;if(!S.fx[id]){S.fx[id]=id==='flash'||id==='retro'?70:55;commit();req();}mkS();refreshDots();},{dot:id=>S.fx[id]>0});
  const refreshDots=()=>ch.querySelectorAll('.chip').forEach(b=>b.classList.toggle('dot',S.fx[b.dataset.id]>0));
  T.append(ch,box);mkS();
  T.append(rowOf(btn((S.date?'☑':'☐')+' Cap Tanggal',e=>{S.date=!S.date;e.target.textContent=(S.date?'☑':'☐')+' Cap Tanggal';commit();req();}),btn('Hapus semua efek',()=>{for(const f of FX)S.fx[f[0]]=0;S.date=false;commit();buildTools();req();})));}
 else if(tab==='beauty'){
  const box=document.createElement('div');
  const L=[['enhance','AI Enhance','pro'],['auto','✨ Gaya'],['smooth','Haluskan'],['glow','Cerahkan'],['spot','Hapus Noda'],['slim','Wajah Tirus','pro'],['eyes','Mata Besar','pro'],['nose','Hidung Ramping','pro'],['lips','Lipstik','pro'],['blush','Perona','pro'],['teeth','Gigi Putih','pro']];
  const val=id=>id in S.beauty?S.beauty[id]:S.face[id];
  const setv=(id,v)=>{if(id in S.beauty)S.beauty[id]=v;else S.face[id]=v;};
  const mkS=()=>{box.innerHTML='';
   if(beautySel==='enhance'){box.append(slider('Kekuatan',20,100,enhStrength,v=>{enhStrength=v;},()=>{}),rowOf(btn('✨ Jalankan AI Enhance',aiEnhance,'btn sm primary')),note('Perbaiki wajah: lebih tajam, kulit mulus, mata jernih. Pertama kali unduh ±75 MB.',true));return;}
   if(beautySel==='auto'){box.append(chips(Object.keys(LOOKS).map(k=>[k,LOOKS[k].n]),null,k=>{const L=LOOKS[k];S.beauty={smooth:L.smooth,glow:L.glow};Object.assign(S.face,{slim:L.slim,eyes:L.eyes,nose:L.nose||0,lips:L.lips,lipC:L.lipC||S.face.lipC,blush:L.blush,blushC:L.blushC||S.face.blushC,teeth:L.teeth});commit();req();aiNote('Gaya '+L.n+' diterapkan');}),note('Satu ketuk: kulit, bentuk wajah & makeup sekaligus.',true),rowOf(btn('Reset Cantik',()=>{S.beauty={smooth:0,glow:0};Object.assign(S.face,{slim:0,eyes:0,nose:0,lips:0,blush:0,teeth:0});S.strokes=S.strokes.filter(s=>s.k!=='heal');commit();buildTools();req();})));return;}
   if(beautySel==='spot'){box.append(slider('Ukuran',1,12,Math.round(spotSize*100),v=>{spotSize=v/100;},()=>{}),note('Ketuk jerawat / noda di foto untuk menghilangkannya.'));return;}
   const lab=L.find(x=>x[0]===beautySel)[1];
   box.append(slider(lab,0,100,val(beautySel),v=>{setv(beautySel,v);req();}));
   if(beautySel==='lips')box.append(swatches(LIPS,S.face.lipC,c=>{S.face.lipC=c;if(!S.face.lips)S.face.lips=60;commit();mkS();req();}));
   if(beautySel==='blush')box.append(swatches(BLUSH,S.face.blushC,c=>{S.face.blushC=c;if(!S.face.blush)S.face.blush=55;commit();mkS();req();}));
   box.append(note(['smooth','glow'].includes(beautySel)?(MASK.status==='ready'?'AI kulit aktif':MASK.status==='loading'?'Memuat AI kulit… (sekali saja)':'AI mendeteksi kulit wajah & badan'):aiStatusText('face'),true));};
  T.append(chips(L,beautySel,id=>{beautySel=id;mkS();if(!['enhance','auto','smooth','glow','spot'].includes(id)&&!val(id)){setv(id,id==='lips'?60:id==='blush'?55:40);commit();req();mkS();}}),box);mkS();}
 else if(tab==='bg'){
  const box=document.createElement('div');
  const mkS=()=>{box.innerHTML='';const m=S.bg.mode;
   if(m==='blur')box.append(slider('Blur',0,100,S.bg.amt,v=>{S.bg.amt=v;req();}));
   if(m==='color')box.append(swatches(BGCOL,S.bg.color,c=>{S.bg.color=c;commit();req();}));
   if(m==='grad')box.append(swatches(GRADS,GRADS[S.bg.grad],c=>{S.bg.grad=GRADS.indexOf(c);commit();req();}));
   if(m==='remove')box.append(note('Latar jadi transparan, hasil disimpan sebagai PNG.'));
   box.append(note(m==='none'?'Pisahkan orang dari latar pakai AI di HP kamu.':aiStatusText('mask'),m!=='none'));};
  T.append(chips([['none','Asli'],['blur','Blur Potret','pro'],['remove','Hapus Latar','pro'],['color','Warna','pro'],['grad','Gradasi','pro'],['splash','Fokus Warna','pro']],S.bg.mode,id=>{S.bg.mode=id;commit();mkS();req();}),box);mkS();}
 else if(tab==='shape'){
  const box=document.createElement('div');
  const mkS=()=>{box.innerHTML='';
   if(shapeSel==='tall'){box.append(slider('Tinggi',0,100,S.body.tall,v=>{S.body.tall=v;req();}),slider('Mulai dari',15,85,S.body.y0,v=>{S.body.y0=v;req();}),note('Garis hijau = batas mulai memanjang (mis. pinggang).'));}
   else{box.append(slider('Ukuran kuas',4,30,Math.round(shapeSize*100),v=>{shapeSize=v/100;},()=>{}),
     note(shapeSel==='push'?'Geser di foto untuk merampingkan / membentuk.':shapeSel==='grow'?'Ketuk untuk membesarkan bagian foto.':'Ketuk untuk mengecilkan bagian foto.'));}
   box.append(rowOf(btn('Batalkan terakhir',()=>{if(S.warps.length){S.warps.pop();commit();req();}}),btn('Reset bentuk',()=>{S.warps=[];S.body.tall=0;commit();buildTools();req();})));};
  T.append(chips([['push','Dorong / Ramping'],['grow','Besarkan'],['shrink','Kecilkan'],['tall','Tinggi Badan']],shapeSel,id=>{shapeSel=id;mkS();req();}),box);mkS();}
 else if(tab==='adjust'){
  const box=document.createElement('div');
  const mkS=()=>{box.innerHTML='';const a=ADJ.find(x=>x[0]===adjSel);box.append(slider(a[1],a[2],a[3],S.adj[adjSel],v=>{S.adj[adjSel]=v;req();}));};
  T.append(chips(ADJ.map(a=>[a[0],a[1]]),adjSel,id=>{adjSel=id;mkS();}),box);mkS();
  const r=rowOf(note('Ketuk 2x slider untuk reset'));r.firstChild.style.padding='0';const rb=btn('Reset semua',()=>{for(const a of ADJ)S.adj[a[0]]=0;commit();buildTools();req();});rb.style.marginLeft='auto';r.append(rb);T.append(r);}
 else if(tab==='crop'){
  T.append(chips([['free','Bebas'],['1','1:1'],['0.8','4:5'],['0.75','3:4'],['0.5625','9:16'],['1.7778','16:9'],['1.3333','4:3'],['orig','Asli']],aspect||'free',id=>{aspect=id==='free'?null:id;applyAspect();req();}));
  T.append(rowOf(btn('⟲ Putar',()=>{S.rot=(S.rot+3)%4;cropDraft={x:0,y:0,w:1,h:1};applyAspect();req();}),btn('⇋ Cermin',()=>{S.flip=!S.flip;cropDraft.x=1-cropDraft.x-cropDraft.w;req();}),btn('Reset',()=>{S.rot=0;S.flip=false;S.straight=0;aspect=null;cropDraft={x:0,y:0,w:1,h:1};buildTools();req();})),
   slider('Luruskan',-30,30,S.straight,v=>{S.straight=v;req();},()=>{}));}
 else if(tab==='sticker'){
  const bar=itemBar();if(bar)T.append(bar);
  const g=document.createElement('div');g.className='grid';if(bar)g.style.height='90px';
  STICKERS.forEach(e=>{const b=document.createElement('button');b.textContent=e;b.onclick=()=>{S.items.push({type:'emoji',text:e,x:.5,y:.5,size:.18,rot:0});sel=S.items.length-1;commit();buildTools();req();hint('Geser untuk pindah, cubit 2 jari untuk ukuran & putar');};g.appendChild(b);});
  T.append(g);}
 else if(tab==='text'){
  const it=selItem()&&selItem().type==='text'?selItem():null;
  const ti=el(`<div class="txtin"><input id="txt" placeholder="Tulis teks…" maxlength="80" enterkeyhint="done"><button class="btn sm primary" id="tAdd">${it?'Selesai':'Tambah'}</button></div>`);
  const inp=ti.querySelector('input');if(it)inp.value=it.text;
  inp.addEventListener('input',()=>{if(it){it.text=inp.value||' ';req();}});
  inp.addEventListener('change',()=>{if(it)commit();});
  ti.querySelector('#tAdd').onclick=()=>{if(it){sel=-1;commit();buildTools();req();inp.blur();return;}
   const t=inp.value.trim();if(!t){inp.focus();return;}S.items.push({type:'text',text:t,x:.5,y:.5,size:.09,rot:0,color:txtColor,style:txtStyle,font:txtFont});sel=S.items.length-1;commit();buildTools();req();};
  const curS=it?it.style:txtStyle, curF=it?it.font:txtFont;
  const st=chips([['polos','Polos'],['garis','Garis'],['latar','Latar'],['bayang','Bayangan'],['neon','Neon']],curS,id=>{txtStyle=id;if(it){it.style=id;commit();req();}});
  const fo=chips(FONTS.map((f,i)=>['f'+i,'Aa '+f[0]]),'f'+curF,id=>{txtFont=+id.slice(1);if(it){it.font=txtFont;commit();req();}});
  T.append(ti,st,fo,swatches(COLORS,it?it.color:txtColor,col=>{txtColor=col;if(it){it.color=col;commit();req();}}));
  if(it)T.append(itemBar());}
 else if(tab==='brush'){
  T.append(chips(BRUSH,brushMode,id=>{brushMode=id;}),slider('Ukuran',1,15,Math.round(brushSize*200),v=>{brushSize=v/200;},()=>{}),swatches(COLORS,brushColor,c=>{brushColor=c;}));
  T.append(rowOf(btn('Hapus coretan terakhir',()=>{const i=findLast(S.strokes,s=>s.k!=='heal');if(i>=0){S.strokes.splice(i,1);commit();req();}}),btn('Hapus semua',()=>{S.strokes=S.strokes.filter(s=>s.k==='heal');commit();req();})));}
 else if(tab==='frame'){
  T.append(note('Ukuran sosmed'),chips([['none','Asli'],['1','1:1 Feed'],['0.8','4:5 Feed'],['0.5625','9:16 Story'],['1.7778','16:9']],S.canvas.ratio,id=>{S.canvas.ratio=id;commit();req();}),
   chips([['blur','Latar Blur'],['#ffffff','Putih'],['#000000','Hitam'],['#ffd6e0','Pink'],['#cde7ff','Biru']],S.canvas.bg,id=>{S.canvas.bg=id;commit();req();}),
   note('Bingkai'),chips(FRAMES,S.frame,id=>{S.frame=id;commit();req();}));}
}
function findLast(a,f){for(let i=a.length-1;i>=0;i--)if(f(a[i]))return i;return -1;}

/* ================= TABS ================= */
function buildTabs(){const n=$('#tabs');TABS.forEach(([id,name,svg])=>{const b=document.createElement('button');b.className='tab'+(id===tab?' on':'');b.dataset.t=id;b.innerHTML=`<svg viewBox="0 0 24 24">${svg}</svg>${name}`;b.onclick=()=>setTab(id);n.appendChild(b);});}
function setTab(t){if(t===tab)return;
 if(tab==='crop'&&cropDraft){const d=cropDraft;S.crop=(d.x<0.001&&d.y<0.001&&d.w>0.999&&d.h>0.999)?null:{...d};commit();}
 tab=t;if(t==='crop'){cropDraft=S.crop?{...S.crop}:{x:0,y:0,w:1,h:1};sel=-1;}
 if(t!=='sticker'&&t!=='text')sel=-1;
 $$('.tab').forEach(b=>b.classList.toggle('on',b.dataset.t===t));
 const tb=$(`.tab[data-t="${t}"]`);if(tb&&tb.scrollIntoView)tb.scrollIntoView({inline:'nearest',block:'nearest'});
 buildTools();req();
 if(t==='brush')hint('Gores di foto untuk menggambar');
 if(t==='crop')hint('Geser kotak atau sudutnya');
 if(t==='shape')hint('Geser di foto untuk membentuk');}

/* ================= CROP ================= */
function updateCropBox(){const b=$('#crop'),d=cropDraft;if(!d)return;b.style.left=d.x*100+'%';b.style.top=d.y*100+'%';b.style.width=d.w*100+'%';b.style.height=d.h*100+'%';}
function ratioVal(){if(!aspect)return null;if(aspect==='orig'){const [w,h]=[S.src.width,S.src.height];return S.rot%2?h/w:w/h;}return +aspect;}
function applyAspect(){const r=ratioVal();if(!r)return;const [RW,RH]=rotDims();let w=1,h=RW/(RH*r);if(h>1){h=1;w=RH*r/RW;}cropDraft={x:(1-w)/2,y:(1-h)/2,w,h};}

/* ================= POINTER ================= */
const frame=$('#frame'), pts=new Map();let drag=null, lastPush=null;
function pos(e){const r=cv.getBoundingClientRect(), px=(e.clientX-r.left)/r.width*cv.width, py=(e.clientY-r.top)/r.height*cv.height;
 return {x:(px-LAYOUT.ox)/LAYOUT.iw,y:(py-LAYOUT.oy)/LAYOUT.ih,cx:e.clientX,cy:e.clientY,fw:r.width*LAYOUT.iw/cv.width};}
function hitTest(p){const w=LAYOUT.iw,h=LAYOUT.ih;for(let i=S.items.length-1;i>=0;i--){const it=S.items[i];if(it._hw==null)continue;
 const dx=(p.x-it.x)*w, dy=(p.y-it.y)*h, a=-(it.rot||0), lx=dx*Math.cos(a)-dy*Math.sin(a), ly=dx*Math.sin(a)+dy*Math.cos(a), pad=w*0.03;
 if(Math.abs(lx)<=it._hw*w+pad&&Math.abs(ly)<=it._hh*w+pad)return i;}return -1;}
frame.addEventListener('pointerdown',e=>{if(!S.src)return;e.preventDefault();frame.setPointerCapture(e.pointerId);const p=pos(e);pts.set(e.pointerId,p);
 if(tab==='crop'){if(pts.size>1)return;const d=cropDraft,tol=34/p.fw;
  const corners=[[d.x,d.y],[d.x+d.w,d.y],[d.x,d.y+d.h],[d.x+d.w,d.y+d.h]];let ci=-1,best=tol;
  corners.forEach(([x,y],i)=>{const dd=Math.hypot(x-p.x,(y-p.y)*LAYOUT.ih/LAYOUT.iw);if(dd<best){best=dd;ci=i;}});
  if(ci>=0){const o=corners[3-ci];drag={type:'corner',ax:o[0],ay:o[1]};}
  else if(p.x>=d.x&&p.x<=d.x+d.w&&p.y>=d.y&&p.y<=d.y+d.h)drag={type:'cmove',sx:p.x,sy:p.y,ox:d.x,oy:d.y};return;}
 if(tab==='brush'){if(pts.size>1){if(drag&&drag.type==='draw'){S.strokes.pop();drag=null;req();}return;}
  S.strokes.push({k:brushMode,c:brushColor,w:brushMode==='mosaic'||brushMode==='blur'?brushSize*2.5:brushSize,p:[[p.x,p.y]]});drag={type:'draw'};req();return;}
 if(tab==='beauty'&&beautySel==='spot'){if(pts.size===1){S.strokes.push({k:'heal',w:spotSize,p:[[p.x,p.y]]});commit();req();}return;}
 if(tab==='shape'&&shapeSel!=='tall'){if(pts.size>1)return;
  if(shapeSel==='push'){drag={type:'push'};lastPush=p;}
  else{S.warps.push({t:'bulge',x:p.x,y:p.y,r:shapeSize,s:shapeSel==='grow'?0.25:-0.25});commit();req();}return;}
 if(pts.size===1){const hit=hitTest(p);
  if(hit>=0){const changed=sel!==hit;sel=hit;const it=S.items[hit];drag={type:'move',sx:p.x,sy:p.y,ox:it.x,oy:it.y};
   const want=it.type==='text'?'text':'sticker';if(tab!==want)setTab(want);else if(changed)buildTools();}
  else if(sel>=0){sel=-1;buildTools();drag=null;}
  req();}
 else if(pts.size===2&&sel>=0){const [a,b]=[...pts.values()],it=S.items[sel];drag={type:'pinch',d0:Math.hypot(a.cx-b.cx,a.cy-b.cy),a0:Math.atan2(b.cy-a.cy,b.cx-a.cx),s0:it.size,r0:it.rot||0};}
});
frame.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;const p=pos(e);pts.set(e.pointerId,p);if(!drag)return;
 if(drag.type==='cmove'){const d=cropDraft;d.x=clamp(drag.ox+p.x-drag.sx,0,1-d.w);d.y=clamp(drag.oy+p.y-drag.sy,0,1-d.h);updateCropBox();}
 else if(drag.type==='corner'){const {ax,ay}=drag,sx=p.x>=ax?1:-1,sy=p.y>=ay?1:-1,[RW,RH]=rotDims(),r=ratioVal();
  let w=Math.max(0.06,Math.abs(p.x-ax)),h=Math.max(0.06,Math.abs(p.y-ay));if(r)h=w*RW/(RH*r);
  const mW=sx>0?1-ax:ax,mH=sy>0?1-ay:ay;if(w>mW){const f=mW/w;w*=f;if(r)h*=f;}if(h>mH){const f=mH/h;h*=f;if(r)w*=f;}
  cropDraft={x:sx>0?ax:ax-w,y:sy>0?ay:ay-h,w,h};updateCropBox();}
 else if(drag.type==='draw'){const st=S.strokes[S.strokes.length-1],l=st.p[st.p.length-1];if(Math.hypot(l[0]-p.x,(l[1]-p.y)*LAYOUT.ih/LAYOUT.iw)>0.004){st.p.push([+p.x.toFixed(4),+p.y.toFixed(4)]);req();}}
 else if(drag.type==='push'){const dx=p.x-lastPush.x, dy=p.y-lastPush.y;if(Math.hypot(dx,dy*LAYOUT.ih/LAYOUT.iw)>shapeSize*0.12){S.warps.push({t:'push',x:+lastPush.x.toFixed(4),y:+lastPush.y.toFixed(4),dx:+dx.toFixed(4),dy:+dy.toFixed(4),r:shapeSize});lastPush=p;req();}}
 else if(drag.type==='move'&&pts.size===1){const it=S.items[sel];if(!it)return;it.x=clamp(drag.ox+p.x-drag.sx,0,1);it.y=clamp(drag.oy+p.y-drag.sy,0,1);req();}
 else if(drag.type==='pinch'&&pts.size===2){const [a,b]=[...pts.values()],it=S.items[sel];if(!it)return;
  it.size=clamp(drag.s0*Math.hypot(a.cx-b.cx,a.cy-b.cy)/drag.d0,0.02,0.9);it.rot=drag.r0+Math.atan2(b.cy-a.cy,b.cx-a.cx)-drag.a0;req();}
});
function endPtr(e){if(!pts.has(e.pointerId))return;pts.delete(e.pointerId);
 if(drag&&['move','pinch','draw','push'].includes(drag.type)){if(pts.size===0){commit();drag=null;if(tab==='sticker'||tab==='text')buildTools();}else if(drag.type==='pinch'){const it=S.items[sel],p=[...pts.values()][0];drag={type:'move',sx:p.x,sy:p.y,ox:it.x,oy:it.y};}}
 else if(pts.size===0)drag=null;}
frame.addEventListener('pointerup',endPtr);frame.addEventListener('pointercancel',endPtr);
frame.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});

/* ================= LOAD / SAVE ================= */
function busy(on,t){$('#busy').style.display=on?'flex':'none';$('#busyT').textContent=t||'Memproses…';}
function fileToCanvas(f,max=SRC_MAX){return new Promise((res,rej)=>{const url=URL.createObjectURL(f), i=new Image();
 i.onload=()=>{const s=Math.min(1,max/Math.max(i.naturalWidth,i.naturalHeight)), c=mk(i.naturalWidth*s,i.naturalHeight*s), x=c.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(i,0,0,c.width,c.height);URL.revokeObjectURL(url);res(c);};
 i.onerror=e=>{URL.revokeObjectURL(url);rej(e);};i.src=url;});}
function loadCanvas(c,keep){
 if(Math.max(c.width,c.height)>SRC_MAX){const s=SRC_MAX/Math.max(c.width,c.height), d=mk(c.width*s,c.height*s);d.getContext('2d').drawImage(c,0,0,d.width,d.height);c=d;}
 S.src=c;SRCS=[c];const k=keep||{};resetEdits();Object.assign(S,k);sel=-1;aspect=null;GEO={key:''};STG={key:''};FACE={key:'',faces:null,status:'idle'};MASK={key:'',mask:null,status:'idle'};
 hist=[];fut=[];cur=snap();updHist();
 $('#empty').style.display='none';$('#frame').style.display='block';$('#panel').classList.remove('off');['#bSave','#bCmp'].forEach(s=>$(s).disabled=false);
 if(tab==='crop'){tab='';setTab('crop');}else buildTools();cv.width=0;render();}
$('#file').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;busy(true,'Membuka foto…');
 try{loadCanvas(await fileToCanvas(f));}catch(err){alert('Foto tidak bisa dibuka. Coba foto lain.');}busy(false);});
let outFiles=[], outURL=null;
function showOut(blob,files,text){if(outURL)URL.revokeObjectURL(outURL);outURL=URL.createObjectURL(blob);outFiles=files;$('#outImg').src=outURL;$('#outP').innerHTML=text;$('#out').style.display='flex';}
$('#bSave').onclick=async()=>{if(!S.src)return;if(tab==='crop')setTab('filter');sel=-1;busy(true,'Menyimpan kualitas penuh…');await new Promise(r=>setTimeout(r,40));
 try{const c=await renderFull(), png=S.bg.mode==='remove', type=png?'image/png':'image/jpeg';
  const blob=await new Promise(r=>c.toBlob(r,type,0.93));
  showOut(blob,[new File([blob],'nomatter-'+Date.now()+(png?'.png':'.jpg'),{type})],'Ketuk <b>Simpan ke Foto</b>, atau tekan lama gambar lalu pilih "Simpan ke Foto".');
 }catch(err){console.error(err);alert('Gagal menyimpan: '+err.message);}
 busy(false);req();};
$('#bShare').onclick=async()=>{if(!outFiles.length)return;
 if(navigator.canShare&&navigator.canShare({files:outFiles})){try{await navigator.share({files:outFiles});return;}catch(e){if(e.name==='AbortError')return;}}
 for(const f of outFiles){const a=document.createElement('a');a.href=URL.createObjectURL(f);a.download=f.name;document.body.appendChild(a);a.click();a.remove();}};
$('#bOutClose').onclick=()=>{$('#out').style.display='none';};
$('#bUndo').onclick=undo;$('#bRedo').onclick=redo;
const cmp=$('#bCmp');
cmp.addEventListener('pointerdown',e=>{e.preventDefault();showOrig=true;req();});
['pointerup','pointerleave','pointercancel'].forEach(t=>cmp.addEventListener(t,()=>{if(showOrig){showOrig=false;req();}}));

/* ================= AI ENHANCE (perbaiki wajah, model GPEN open-source, jalan di HP) ================= */
let SRCS=[];
const ENH={session:null}, GPEN_URL='https://huggingface.co/facefusion/models-3.0.0/resolve/main/gpen_bfr_256.onnx';
const TPL=[[0.36167656,0.40387734],[0.63696719,0.40235469],[0.50019687,0.56044219],[0.38710391,0.72160547],[0.61507734,0.72034453]].map(p=>[p[0]*256,p[1]*256]);
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s);});}
async function fetchCached(url,onp){let c=null;try{c=await caches.open('nomatter-ai-v1');const hit=await c.match(url);if(hit)return await hit.arrayBuffer();}catch(e){}
 const r=await fetch(url,{mode:'cors'});if(!r.ok)throw new Error('HTTP '+r.status);const total=+r.headers.get('content-length')||0;
 let buf;if(r.body&&r.body.getReader){const rd=r.body.getReader(), parts=[];let got=0;for(;;){const {done,value}=await rd.read();if(done)break;parts.push(value);got+=value.length;onp&&onp(got,total);}buf=new Uint8Array(got);let o=0;for(const p of parts){buf.set(p,o);o+=p.length;}}
 else buf=new Uint8Array(await r.arrayBuffer());
 try{c&&await c.put(url,new Response(buf.slice(0),{headers:{'content-type':'application/octet-stream'}}));}catch(e){}return buf.buffer;}
async function enhSession(onp){if(ENH.session)return ENH.session;if(!window.ort)await loadScript('ort.wasm.min.js');
 ort.env.wasm.numThreads=1;ort.env.logLevel='error';ort.env.wasm.wasmPaths=new URL('.',location.href).href;
 const buf=await fetchCached(window.GPEN_LOCAL||GPEN_URL,onp);ENH.session=await ort.InferenceSession.create(buf,{executionProviders:['wasm'],graphOptimizationLevel:'all'});return ENH.session;}
function simT(src,dst){const n=src.length;let mx=0,my=0,ux=0,uy=0;for(let i=0;i<n;i++){mx+=src[i][0];my+=src[i][1];ux+=dst[i][0];uy+=dst[i][1];}mx/=n;my/=n;ux/=n;uy/=n;
 let n1=0,n2=0,den=0;for(let i=0;i<n;i++){const sx=src[i][0]-mx, sy=src[i][1]-my, dx=dst[i][0]-ux, dy=dst[i][1]-uy;n1+=sx*dx+sy*dy;n2+=sx*dy-sy*dx;den+=sx*sx+sy*sy;}
 const a=n1/den, b=n2/den;return {a,b,tx:ux-(a*mx-b*my),ty:uy-(b*mx+a*my)};}
let enhStrength=85;
async function aiEnhance(){if(!S.src)return;busy(true,'Memuat AI Enhance… (sekali saja, ±75 MB)');
 try{const sess=await enhSession((g,t)=>{$('#busyT').textContent='Mengunduh AI Enhance '+(t?Math.round(g/t*100)+'%':Math.round(g/1e6)+' MB')+' (sekali saja)';});
  $('#busyT').textContent='Mencari wajah…';await new Promise(r=>setTimeout(r,20));
  const src=S.src, W=src.width, H=src.height, sc=Math.min(1,1280/Math.max(W,H)), det=mk(W*sc,H*sc);det.getContext('2d').drawImage(src,0,0,det.width,det.height);
  const faces=((await aiFace()).detect(det).faceLandmarks||[]).filter(f=>f.length>=478);
  if(!faces.length){busy(false);hint('Wajah tidak terdeteksi');return;}
  const out=mk(W,H), ox=out.getContext('2d');ox.drawImage(src,0,0);
  const msk=mk(256,256), mx=msk.getContext('2d');mx.save();mx.shadowOffsetX=600;mx.shadowColor='#000';mx.shadowBlur=22;mx.fillStyle='#000';mx.beginPath();if(mx.roundRect)mx.roundRect(30-600,26,196,212,60);else mx.rect(30-600,26,196,212);mx.fill();mx.restore();
  let k=0;for(const f of faces){k++;$('#busyT').textContent=`AI Enhance wajah ${k}/${faces.length}…`;await new Promise(r=>setTimeout(r,20));
   const P=i=>[f[i].x*W,f[i].y*H], eyes=[P(468),P(473)].sort((a,b)=>a[0]-b[0]), mouth=[P(61),P(291)].sort((a,b)=>a[0]-b[0]);
   const T=simT([eyes[0],eyes[1],P(1),mouth[0],mouth[1]],TPL);
   const crop=mk(256,256), cx=ctx2(crop);cx.imageSmoothingQuality='high';cx.setTransform(T.a,T.b,-T.b,T.a,T.tx,T.ty);cx.drawImage(src,0,0);cx.setTransform(1,0,0,1,0,0);
   const id=cx.getImageData(0,0,256,256).data, N=256*256, inp=new Float32Array(3*N);
   for(let i=0;i<N;i++){inp[i]=id[i*4]/127.5-1;inp[N+i]=id[i*4+1]/127.5-1;inp[2*N+i]=id[i*4+2]/127.5-1;}
   const res=await sess.run({[sess.inputNames[0]]:new ort.Tensor('float32',inp,[1,3,256,256])}), o=res[sess.outputNames[0]].data;
   const od=cx.createImageData(256,256);for(let i=0;i<N;i++){od.data[i*4]=(clamp(o[i],-1,1)+1)*127.5;od.data[i*4+1]=(clamp(o[N+i],-1,1)+1)*127.5;od.data[i*4+2]=(clamp(o[2*N+i],-1,1)+1)*127.5;od.data[i*4+3]=255;}
   cx.putImageData(od,0,0);cx.globalCompositeOperation='destination-in';cx.drawImage(msk,0,0);cx.globalCompositeOperation='source-over';
   const det2=T.a*T.a+T.b*T.b, A=T.a/det2, C=T.b/det2, B=-T.b/det2, D=T.a/det2;
   ox.save();ox.imageSmoothingQuality='high';ox.setTransform(A,B,C,D,-(A*T.tx+C*T.ty),-(B*T.tx+D*T.ty));ox.globalAlpha=enhStrength/100;ox.drawImage(crop,0,0);ox.restore();}
  SRCS=SRCS.slice(0,(S.srcIdx||0)+1);SRCS.push(out);S.srcIdx=SRCS.length-1;S.src=out;GEO={key:''};STG={key:''};commit();buildTools();req();hint('AI Enhance selesai ✓ (bisa diurungkan)');
 }catch(e){console.error(e);alert('AI Enhance gagal: '+(e.message||e)+'\nPastikan internet aktif saat pertama kali.');}
 busy(false);}

/* ================= MENU / RECIPE / BATCH ================= */
const RECIPE=['adj','filter','fstr','beauty','face','fx','date','bg','frame','canvas'];
function act(a){$('#sheet').style.display='none';
 if(a==='open'){$('#file').value='';$('#file').click();}
 else if(a==='cam')openCam();
 else if(a==='collage'){multiMode='collage';$('#fileMulti').value='';$('#fileMulti').click();}
 else if(a==='batch'){multiMode='batch';$('#fileMulti').value='';$('#fileMulti').click();}
 else if(a==='copy'){if(!S.src)return hint('Buka foto dulu');const r={};for(const k of RECIPE)r[k]=S[k];try{localStorage.setItem('nm_recipe',JSON.stringify(r));}catch(e){}window._recipe=r;hint('Edit disalin. Buka foto lain lalu Tempel Edit.');}
 else if(a==='paste'){let r=window._recipe;try{r=r||JSON.parse(localStorage.getItem('nm_recipe'));}catch(e){}if(!r)return hint('Belum ada edit yang disalin');if(!S.src)return hint('Buka foto dulu');
  Object.assign(S,JSON.parse(JSON.stringify(r)));commit();buildTools();req();hint('Edit ditempel ✓');}}
$$('[data-act]').forEach(b=>b.addEventListener('click',()=>act(b.dataset.act)));
$('#bMenu').onclick=()=>{$('#sheet').style.display='flex';};
$('#sheet').addEventListener('click',e=>{if(e.target.id==='sheet')$('#sheet').style.display='none';});
let multiMode='';
$('#fileMulti').addEventListener('change',async e=>{const fs=[...e.target.files];if(!fs.length)return;
 if(multiMode==='collage')openCollage(fs.slice(0,9));else runBatch(fs.slice(0,30));});
async function runBatch(files){
 const files2=[];let first=null;
 for(let n=0;n<files.length;n++){busy(true,`Edit massal ${n+1}/${files.length}…`);await new Promise(r=>setTimeout(r,20));
  try{const c=await fileToCanvas(files[n]), w=c.width, h=c.height, x=ctx2(c), id=x.getImageData(0,0,w,h), o=new Uint8ClampedArray(id.data);
   process(id,w,h,cfgS(),{getBlur:()=>boxBlur(o,w,h,blurRad(w,h),3),getSharp:()=>boxBlur(o,w,h,1,1)});x.putImageData(id,0,0);applyFx(x,w,h,S.fx,id,S.seed+n,S.date);
   const fin=finalize(c).canvas, blob=await new Promise(r=>fin.toBlob(r,'image/jpeg',0.92));files2.push(new File([blob],`nomatter-${Date.now()}-${n+1}.jpg`,{type:'image/jpeg'}));if(!first)first=blob;}
  catch(err){console.error(err);}}
 busy(false);if(first)showOut(first,files2,`<b>${files2.length} foto</b> sudah diedit dengan filter, atur, cantik & efek yang sama. Ketuk <b>Simpan ke Foto</b>.`);}

/* ================= CAMERA ================= */
const CAM={stream:null,facing:'user',flash:false,timer:0,beauty:true,filter:'asli',raf:0,work:null};
async function openCam(){$('#cam').style.display='flex';
 const ch=chips(FILTERS.map(f=>[f.id,f.n]),CAM.filter,id=>{CAM.filter=id;});ch.id='camF';$('#camF').replaceWith(ch);
 await startStream();}
async function startStream(){stopStream();
 try{CAM.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:CAM.facing,width:{ideal:1920},height:{ideal:1440}},audio:false});
  const v=$('#camV');v.srcObject=CAM.stream;await v.play().catch(()=>{});loopCam();}
 catch(e){alert('Kamera tidak bisa dibuka. Izinkan akses kamera untuk aplikasi ini di Pengaturan.');closeCam();}}
function stopStream(){cancelAnimationFrame(CAM.raf);if(CAM.stream){CAM.stream.getTracks().forEach(t=>t.stop());CAM.stream=null;}}
function closeCam(){stopStream();$('#cam').style.display='none';}
function loopCam(){const v=$('#camV'), c=$('#camC');
 const tick=()=>{CAM.raf=requestAnimationFrame(tick);if(v.readyState<2||!v.videoWidth)return;
  const s=Math.min(1,560/Math.max(v.videoWidth,v.videoHeight)), w=Math.round(v.videoWidth*s), h=Math.round(v.videoHeight*s);
  if(c.width!==w||c.height!==h){c.width=w;c.height=h;CAM.work=mk(w,h);}
  const x=ctx2(CAM.work);x.save();if(CAM.facing==='user'){x.translate(w,0);x.scale(-1,1);}x.drawImage(v,0,0,w,h);x.restore();
  const id=x.getImageData(0,0,w,h), o=CAM.beauty?new Uint8ClampedArray(id.data):null;
  process(id,w,h,{adj:{},filter:CAM.filter,fstr:100,beauty:CAM.beauty?{smooth:50,glow:25}:{},fx:{}},{getBlur:()=>boxBlur(o,w,h,blurRad(w,h),2)});
  c.getContext('2d').putImageData(id,0,0);};tick();}
$('#camX').onclick=closeCam;
$('#camFlip').onclick=()=>{CAM.facing=CAM.facing==='user'?'environment':'user';startStream();};
$('#camFlash').onclick=e=>{CAM.flash=!CAM.flash;e.target.textContent='⚡ Flash: '+(CAM.flash?'Nyala':'Mati');};
$('#camTimer').onclick=e=>{CAM.timer=CAM.timer===0?3:CAM.timer===3?10:0;e.target.textContent=`⏱ ${CAM.timer} dtk`;};
$('#camBeauty').onclick=e=>{CAM.beauty=!CAM.beauty;e.target.textContent='✨ Cantik: '+(CAM.beauty?'Nyala':'Mati');};
$('#camShot').onclick=async()=>{const v=$('#camV');if(!v.videoWidth)return;
 for(let t=CAM.timer;t>0;t--){const cc=$('#camCount');cc.style.display='block';cc.textContent=t;await new Promise(r=>setTimeout(r,1000));cc.style.display='none';}
 let torch=false, track=CAM.stream&&CAM.stream.getVideoTracks()[0];
 if(CAM.flash){if(CAM.facing==='user'){$('#camFlashScr').style.display='block';await new Promise(r=>setTimeout(r,450));}
  else{try{const cap=track.getCapabilities?track.getCapabilities():{};if(cap.torch){await track.applyConstraints({advanced:[{torch:true}]});torch=true;await new Promise(r=>setTimeout(r,500));}}catch(e){}}}
 const c=mk(v.videoWidth,v.videoHeight), x=c.getContext('2d');if(CAM.facing==='user'){x.translate(c.width,0);x.scale(-1,1);}x.drawImage(v,0,0);
 $('#camFlashScr').style.display='none';if(torch){try{await track.applyConstraints({advanced:[{torch:false}]});}catch(e){}}
 const keep={filter:CAM.filter};const fe=freshEdits();
 if(CAM.beauty)keep.beauty={smooth:50,glow:25};
 if(CAM.flash&&CAM.facing!=='user'&&!torch){keep.fx={...fe.fx,flash:60};}
 closeCam();loadCanvas(c,keep);};

/* ================= COLLAGE ================= */
const COL={imgs:[],cells:[],lay:0,ratio:1,gap:2,rad:0,bg:'#ffffff',sel:0};
function grid(n,cols){const rows=Math.ceil(n/cols), out=[];for(let r=0;r<rows;r++){const cnt=r===rows-1?n-cols*(rows-1):cols;for(let c=0;c<cnt;c++)out.push([c/cnt,r/rows,1/cnt,1/rows]);}return out;}
const tr=L=>L.map(([x,y,w,h])=>[y,x,h,w]);
function layouts(n){const L=[];
 if(n===1)return [[[0,0,1,1]]];
 L.push(grid(n,n<=3?1:2));L.push(tr(grid(n,n<=3?1:2)));
 if(n>=3){L.push(grid(n,3));L.push(tr(grid(n,3)));}
 if(n===3)L.push([[0,0,1,.6],[0,.6,.5,.4],[.5,.6,.5,.4]],[[0,0,.6,1],[.6,0,.4,.5],[.6,.5,.4,.5]]);
 if(n===4)L.push([[0,0,1,.6],[0,.6,1/3,.4],[1/3,.6,1/3,.4],[2/3,.6,1/3,.4]],[[0,0,.6,1],[.6,0,.4,1/3],[.6,1/3,.4,1/3],[.6,2/3,.4,1/3]]);
 if(n===5)L.push([[0,0,.5,.5],[.5,0,.5,.5],[0,.5,1/3,.5],[1/3,.5,1/3,.5],[2/3,.5,1/3,.5]]);
 const seen=new Set();return L.filter(l=>{const k=JSON.stringify(l);if(seen.has(k))return false;seen.add(k);return true;});}
async function openCollage(files){busy(true,'Menyiapkan kolase…');COL.imgs=[];for(const f of files){try{COL.imgs.push(await fileToCanvas(f,1800));}catch(e){}}busy(false);
 if(!COL.imgs.length)return;COL.cells=COL.imgs.map(img=>({img,z:1,ox:0,oy:0}));COL.lay=0;COL.sel=0;$('#col').style.display='flex';buildColTools();drawCol();}
function colDims(maxW,maxH){const r=COL.ratio;let W=maxW,H=maxW/r;if(H>maxH){H=maxH;W=H*r;}return [W,H];}
function cellRects(W,H){const L=layouts(COL.cells.length)[COL.lay]||layouts(COL.cells.length)[0], g=COL.gap/100*Math.min(W,H);
 return L.map(([x,y,w,h])=>({x:g/2+x*(W-g)+g/2,y:g/2+y*(H-g)+g/2,w:w*(W-g)-g,h:h*(H-g)-g}));}
function paintCol(c,W,H,preview){const x=c.getContext('2d');x.fillStyle=COL.bg;x.fillRect(0,0,W,H);const R=cellRects(W,H);
 R.forEach((r,i)=>{const cell=COL.cells[i];if(!cell)return;const im=cell.img, sc=Math.max(r.w/im.width,r.h/im.height)*cell.z, dw=im.width*sc, dh=im.height*sc;
  const mx=(dw-r.w)/2, my=(dh-r.h)/2;cell.ox=clamp(cell.ox,-mx,mx);cell.oy=clamp(cell.oy,-my,my);
  x.save();x.beginPath();const rad=COL.rad/100*Math.min(r.w,r.h)*0.5;if(x.roundRect)x.roundRect(r.x,r.y,r.w,r.h,rad);else x.rect(r.x,r.y,r.w,r.h);x.clip();
  x.imageSmoothingQuality='high';x.drawImage(im,r.x+(r.w-dw)/2+cell.ox,r.y+(r.h-dh)/2+cell.oy,dw,dh);x.restore();
  if(preview&&i===COL.sel){x.strokeStyle='#7CFFB2';x.lineWidth=3;x.strokeRect(r.x+1.5,r.y+1.5,r.w-3,r.h-3);}});return R;}
let COLR=[];
function drawCol(){const st=$('#colStage'), c=$('#colC'), dpr=Math.min(2,devicePixelRatio||1), [W,H]=colDims(st.clientWidth-24,st.clientHeight-24);
 c.style.width=W+'px';c.style.height=H+'px';c.width=Math.round(W*dpr);c.height=Math.round(H*dpr);
  const k=c.width/W, saved=COL.cells.map(q=>[q.ox,q.oy]);COL.cells.forEach(q=>{q.ox*=k;q.oy*=k;});paintCol(c,c.width,c.height,true);
 COL.cells.forEach((q,i)=>{q.ox=q.ox/k;q.oy=q.oy/k;});COLR=cellRects(W,H);COL.pw=W;}
function buildColTools(){const T=$('#colTools');T.innerHTML='';const n=COL.cells.length;
 T.append(chips(layouts(n).map((l,i)=>[String(i),'Tata '+(i+1)]),String(COL.lay),id=>{COL.lay=+id;drawCol();}),
  chips([['1','1:1'],['0.8','4:5'],['0.5625','9:16'],['0.75','3:4'],['1.7778','16:9']],String(COL.ratio),id=>{COL.ratio=+id;drawCol();}),
  slider('Jarak',0,8,COL.gap,v=>{COL.gap=v;drawCol();},()=>{}),slider('Sudut',0,60,COL.rad,v=>{COL.rad=v;drawCol();},()=>{}),
  swatches(['#ffffff','#111111','#f4e1d2','#ffd6e0','#cde7ff','#d8f5d0'],COL.bg,c=>{COL.bg=c;drawCol();}),
  rowOf(note('Geser foto di kotak untuk mengatur, cubit untuk zoom.'),btn('⇄ Tukar',()=>{const i=COL.sel, j=(i+1)%n;[COL.cells[i],COL.cells[j]]=[COL.cells[j],COL.cells[i]];COL.sel=j;drawCol();})));}
(()=>{const c=$('#colC'), P=new Map();let d=null;
 const at=e=>{const r=c.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top,cx:e.clientX,cy:e.clientY};};
 c.addEventListener('pointerdown',e=>{e.preventDefault();c.setPointerCapture(e.pointerId);const p=at(e);P.set(e.pointerId,p);
  if(P.size===1){const i=COLR.findIndex(r=>p.x>=r.x&&p.x<=r.x+r.w&&p.y>=r.y&&p.y<=r.y+r.h);if(i<0)return;COL.sel=i;const cell=COL.cells[i];d={i,sx:p.x,sy:p.y,ox:cell.ox,oy:cell.oy};drawCol();}
  else if(P.size===2&&d){const [a,b]=[...P.values()];d.pinch={d0:Math.hypot(a.cx-b.cx,a.cy-b.cy),z0:COL.cells[d.i].z};}});
 c.addEventListener('pointermove',e=>{if(!P.has(e.pointerId)||!d)return;const p=at(e);P.set(e.pointerId,p);const cell=COL.cells[d.i];
  if(d.pinch&&P.size===2){const [a,b]=[...P.values()];cell.z=clamp(d.pinch.z0*Math.hypot(a.cx-b.cx,a.cy-b.cy)/d.pinch.d0,1,4);}
  else if(P.size===1){cell.ox=d.ox+p.x-d.sx;cell.oy=d.oy+p.y-d.sy;}drawCol();});
 const up=e=>{P.delete(e.pointerId);if(!P.size)d=null;else if(d)d.pinch=null;};c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);})();
$('#colX').onclick=()=>{$('#col').style.display='none';};
$('#colDone').onclick=()=>{const long=2400, W=COL.ratio>=1?long:long*COL.ratio, H=COL.ratio>=1?long/COL.ratio:long, k=W/COL.pw;
 const saved=COL.cells.map(c=>[c.ox,c.oy]);COL.cells.forEach(c=>{c.ox*=k;c.oy*=k;});const out=mk(W,H);paintCol(out,out.width,out.height,false);
 COL.cells.forEach((c,i)=>{[c.ox,c.oy]=saved[i];});$('#col').style.display='none';loadCanvas(out);};
addEventListener('resize',()=>{if($('#col').style.display==='flex')drawCol();});

/* ================= INIT ================= */
buildTabs();buildTools();
if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('sw.js').catch(()=>{});
