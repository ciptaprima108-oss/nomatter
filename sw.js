const V='nomatter-v6';
const SHELL=['./','index.html','app.js','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png','wordmark.png','brand.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!=='nomatter-ai-v1').map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);if(url.origin!==location.origin)return;
  if(/(vision_|ort[.-]|\.task$|\.tflite$|\.wasm$)/.test(url.pathname)){ // file AI besar: simpan setelah pertama diunduh
    e.respondWith(caches.open('nomatter-ai-v1').then(c=>c.match(req).then(r=>r||fetch(req).then(res=>{if(res.ok)c.put(req,res.clone());return res;}))));return;}
  // aplikasi: coba jaringan dulu supaya selalu versi terbaru, kalau offline pakai cache
  e.respondWith(fetch(req).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(req,cp));}return res;}).catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('./'))));
});
