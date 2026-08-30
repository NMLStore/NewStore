/* ============================================================
   NEW MAA LOKHI STORES — core app: state, cart, router, chrome
   Security notes: all user-generated text is rendered via
   textContent (never innerHTML); localStorage is try/catch
   guarded; no eval, no third-party scripts.
   ============================================================ */
'use strict';

/* ---------- tiny DOM helpers ---------- */
const $  = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
function h(tag, attrs, ...kids){
  const el = document.createElement(tag);
  if(attrs) for(const [k,v] of Object.entries(attrs)){
    if(v===null||v===undefined||v===false) continue;
    if(k==='class') el.className = v;
    else if(k==='dataset') Object.assign(el.dataset, v);
    else if(k==='html') el.innerHTML = v;               // trusted, static markup only
    else if(k.startsWith('on')&&typeof v==='function') el.addEventListener(k.slice(2), v);
    else if(k==='style'&&typeof v==='object') Object.assign(el.style, v);
    else if(v===true) el.setAttribute(k,'');
    else el.setAttribute(k, String(v));
  }
  for(const kid of kids.flat(9)){
    if(kid===null||kid===undefined||kid===false) continue;
    el.append(kid.nodeType?kid:document.createTextNode(String(kid)));
  }
  return el;
}
const svgIcon = (d, size=18, extra={}) => h('svg',{viewBox:'0 0 24 24',width:size,height:size,'aria-hidden':'true',...extra}, h('path',{d,fill:'none',stroke:'currentColor','stroke-width':'1.7','stroke-linecap':'round','stroke-linejoin':'round'}));
const ICONS = {
  truck:'M3 7h11v9H3zM14 10h4l3 3v3h-7zM6.5 19a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4zM17.5 19a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4z',
  shield:'M12 3l7 3v5c0 4.4-3 7.4-7 10-4-2.6-7-5.6-7-10V6l7-3zM9 11.5l2 2 4-4.5',
  cash:'M3 7h18v10H3zM7 12h4M16.5 11.5a1 1 0 1 0 0 .01M6 10v4',
  ret:'M4 12a8 8 0 1 1 2.3 5.7M4 21v-5h5',
  pin:'M12 21s-7-5.8-7-11a7 7 0 0 1 14 0c0 5.2-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  check:'M5 12.5l4.5 4.5L19 7.5',
  tag:'M3 12l9-9 9 9-9 9zM8.5 8.5a1 1 0 1 0 0 .01',
  star:'M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6L3.2 9.4l6.1-.8L12 3z',
  box:'M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8',
  heart:'M12 20.3C6.4 16.6 3 13.4 3 9.8 3 7.1 5.1 5 7.7 5c1.7 0 3.3.9 4.3 2.4C13 5.9 14.6 5 16.3 5 18.9 5 21 7.1 21 9.8c0 3.6-3.4 6.8-9 10.5z',
};

/* ---------- safe storage ---------- */
const store = {
  get(key, fb){
    try{ const v = localStorage.getItem(key); return v===null?fb:JSON.parse(v); }
    catch(e){ return fb; }
  },
  set(key, val){ try{ localStorage.setItem(key, JSON.stringify(val)); }catch(e){/* private mode */} },
  del(key){ try{ localStorage.removeItem(key); }catch(e){} },
};

/* ---------- state ---------- */
const state = {
  cart: new Map(store.get('nmls_cart', [])),        // [[id, qty]]
  wishlist: new Set(store.get('nmls_wishlist', [])),
  coupon: store.get('nmls_coupon', null),           // {code}
  get orders(){ return store.get('nmls_orders', []); },
};
function saveCart(){ store.set('nmls_cart', [...state.cart]); }
function saveWish(){ store.set('nmls_wishlist', [...state.wishlist]); }

/* ---------- cart ops ---------- */
function cartCount(){ let n=0; for(const q of state.cart.values()) n+=q; return n; }
function cartSubtotal(){ let s=0; for(const [id,q] of state.cart){ const p=productById(id); if(p) s+=p.price*q; } return s; }
function addToCart(id, qty=1, openDrawer=true){
  const p = productById(id); if(!p) return;
  const cur = state.cart.get(id)||0;
  const max = Math.min(10, p.stock||10);
  state.cart.set(id, Math.min(max, cur+qty));
  saveCart(); renderCartUI();
  if(openDrawer) openDrawer_('cart');
  else toast('Added to cart', p.name);
}
function setCartQty(id, qty){
  if(qty<=0) state.cart.delete(id); else state.cart.set(id, Math.min(10, qty));
  saveCart(); renderCartUI();
}
function cartTotals(){
  const sub = cartSubtotal();
  const c = state.coupon && COUPONS[state.coupon.code] ? COUPONS[state.coupon.code] : null;
  let discount = 0, ship = sub>=CONFIG.freeShipAbove ? 0 : CONFIG.shipFee, codeOk=false;
  if(c && sub>=c.min){
    codeOk = true;
    if(c.type==='pct') discount = Math.min(Math.round(sub*c.value/100), c.cap||Infinity);
    if(c.type==='flat') discount = Math.min(c.value, sub);
    if(c.type==='ship') ship = 0;
  }
  return { sub, discount, ship, total: Math.max(0, sub - discount) + ship, codeOk };
}

/* ---------- wishlist ---------- */
function wishlistHas(id){ return state.wishlist.has(id); }
function toggleWish(id){
  if(state.wishlist.has(id)){ state.wishlist.delete(id); toast('Removed from wishlist'); }
  else{ state.wishlist.add(id); toast('Saved to wishlist', 'Find it under the ♥ icon'); }
  saveWish(); renderWishUI();
  $$('.wish-btn[data-wish="'+id+'"]').forEach(b=>b.classList.toggle('on', state.wishlist.has(id)));
}

/* ---------- toast ---------- */
function toast(title, sub, isErr){
  const t = h('div',{class:'toast'+(isErr?' err':''),role:'status'},
    h('span',{class:'t-ico'}, isErr?'!':svgIcon(ICONS.check,15).outerHTML),
    h('div',{}, h('b',{},title), sub?h('small',{},sub):null));
  $('#toastRoot').append(t);
  setTimeout(()=>{ t.classList.add('out'); setTimeout(()=>t.remove(),380); }, 2600);
}

/* ---------- ui updates ---------- */
function renderCartUI(){
  const n = cartCount();
  const cc = $('#cartCount'); cc.textContent = n; cc.hidden = n===0;
  cc.classList.remove('pop'); void cc.offsetWidth; if(n) cc.classList.add('pop');
  $('#cartDrawerCount').textContent = n;
  renderCartDrawer();
}
function renderWishUI(){
  const n = state.wishlist.size;
  const wc = $('#wishCount'); wc.textContent = n; wc.hidden = n===0;
}
function renderCartDrawer(){
  const body = $('#cartDrawerBody'), foot = $('#cartDrawerFoot');
  body.textContent=''; foot.textContent='';
  if(state.cart.size===0){
    body.append(emptyState('Your cart is empty', 'Beautiful things are waiting — start with our bestsellers.', '#/shop', 'Start shopping'));
    return;
  }
  const tot = cartTotals();
  if(tot.ship>0){
    const need = CONFIG.freeShipAbove - tot.sub;
    body.append(h('div',{class:'ship-bar warn'},
      h('span',{}, 'Add ', h('b',{}, fmt(need)), ' more for FREE delivery'),
      h('div',{class:'ship-track'}, h('div',{class:'ship-fill',style:{width:Math.min(100,Math.round(tot.sub/CONFIG.freeShipAbove*100))+'%'}}))));
  } else {
    body.append(h('div',{class:'ship-bar'}, svgIcon(ICONS.truck,16), h('span',{}, 'Yay! You\'ve unlocked ', h('b',{},'FREE delivery'))));
  }
  for(const [id,q] of state.cart){
    const p = productById(id); if(!p) continue;
    body.append(h('div',{class:'cart-item'},
      h('a',{href:'#/product/'+id}, h('img',{class:'ci-img',src:'img/'+p.img+'.jpg',alt:p.name,loading:'lazy',onerror:imgFallback(p)})),
      h('div',{class:'ci-info'},
        h('div',{class:'ci-brand'},p.brand),
        h('a',{class:'ci-name',href:'#/product/'+id},p.name),
        h('div',{class:'ci-price'}, fmt(p.price), h('span',{class:'price-mrp',style:{margin:'0 0 0 7px'}}, fmt(p.mrp))),
        h('div',{class:'ci-row'},
          h('span',{class:'qty'},
            h('button',{'aria-label':'Decrease quantity',onclick:()=>setCartQty(id,q-1)},'−'),
            h('span',{},q),
            h('button',{'aria-label':'Increase quantity',onclick:()=>setCartQty(id,q+1)},'+')),
          h('button',{class:'ci-remove',onclick:()=>{setCartQty(id,0);toast('Removed from cart');}},'Remove')))));
  }
  foot.append(
    h('div',{class:'cart-sub'}, h('span',{},'Subtotal'), h('b',{}, fmt(tot.sub))),
    h('div',{class:'cart-note'}, tot.ship>0 ? ' + '+fmt(tot.ship)+' delivery · COD available' : ' Free delivery · COD available'),
    h('a',{class:'btn btn-primary btn-block',href:'#/checkout'}, 'Checkout Securely'),
    h('div',{class:'d-foot-note',style:{marginTop:'10px'}}, '🔒 Demo checkout — no real payment is taken'));
}

/* ---------- image fallback (offline-safe placeholder) ---------- */
function imgFallback(p){
  return function(){
    const img = this || event && event.target; if(!img || img.dataset.fb) return; img.dataset.fb='1';
    const seed = hashStr(p.id); const hue = seed%360;
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl('+hue+',32%,88%)"/><stop offset="1" stop-color="hsl('+((hue+40)%360)+',30%,78%)"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/><circle cx="200" cy="185" r="70" fill="none" stroke="hsl('+hue+',30%,45%)" stroke-opacity=".45" stroke-width="2"/><path d="M200 140c11 15 11 30 0 45-11-15-11-30 0-45z M165 158c16 6 24 19 23 37-16-6-24-19-23-37z M235 158c-16 6-24 19-23 37 16-6 24-19 23-37z" fill="hsl('+hue+',30%,42%)" fill-opacity=".5"/><text x="200" y="300" text-anchor="middle" font-family="Georgia,serif" font-size="26" fill="hsl('+hue+',30%,32%)">'+CONFIG.storeName+'</text></svg>';
    img.src = 'data:image/svg+xml;utf8,'+encodeURIComponent(svg);
  };
}
function prodImg(p, cls, alt){ return h('img',{class:cls,src:'img/'+p.img+'.jpg',alt:alt||p.name,loading:'lazy',decoding:'async',onerror:imgFallback(p)}); }

/* ---------- stars ---------- */
function starRow(rating, count, opts={}){
  const pctW = Math.round(rating/5*100);
  return h('span',{class:'rate-wrap',style:{display:'inline-flex',alignItems:'center',gap:'7px'}},
    h('span',{class:'stars',role:'img','aria-label':rating+' out of 5 stars'},
      h('span',{'aria-hidden':'true'},'★★★★★'),
      h('span',{class:'stars-fill',style:{width:pctW+'%'},'aria-hidden':'true'},'★★★★★')),
    opts.compact?null:h('span',{}, count!=null ? rating+' ('+count.toLocaleString('en-IN')+')' : rating.toFixed(1)));
}

/* ---------- product card ---------- */
function productCard(p){
  const off = pct(p);
  return h('article',{class:'card reveal'},
    h('div',{class:'card-img'},
      p.badge==='hot'?h('span',{class:'badge b-hot'},'Bestseller'): p.badge==='new'?h('span',{class:'badge b-new'},'New'): off>=45?h('span',{class:'badge b-deal'},off+'% OFF'):null,
      h('a',{href:'#/product/'+p.id,'aria-label':p.name}, prodImg(p,'')),
      h('button',{class:'wish-btn'+(wishlistHas(p.id)?' on':''),'data-wish':p.id,'aria-label':'Save to wishlist',onclick:(e)=>{e.preventDefault();toggleWish(p.id);}}, svgIcon(ICONS.heart,16)),
      h('button',{class:'quick-add',onclick:()=>addToCart(p.id,1,false)}, 'Add to Cart')),
    h('div',{class:'card-body'},
      h('span',{class:'card-brand'},p.brand),
      h('h3',{class:'card-title'}, h('a',{href:'#/product/'+p.id},p.name)),
      h('span',{class:'card-rate'}, starRow(p.rating,null,{compact:true}), h('span',{}, p.rating+' · '+p.reviews.toLocaleString('en-IN')+' reviews')),
      h('div',{class:'card-price'}, h('span',{class:'price-now'},fmt(p.price)), h('span',{class:'price-mrp'},fmt(p.mrp)), h('span',{class:'price-off'},off+'% off'))));
}

/* ---------- empty state ---------- */
function emptyState(title, sub, href, cta){
  return h('div',{class:'empty'},
    svgIcon(ICONS.box,44),
    h('h3',{},title), h('p',{},sub),
    href?h('a',{class:'btn btn-primary',href},cta||'Explore'):null);
}

/* ---------- drawers ---------- */
let openDrawerEl = null;
function openDrawer_(which){
  closeDrawers(true);
  const d = which==='cart'?$('#cartDrawer'):$('#navDrawer');
  d.classList.add('open'); d.setAttribute('aria-hidden','false');
  const scrim = $('#scrim'); scrim.hidden=false; requestAnimationFrame(()=>scrim.classList.add('show'));
  document.body.style.overflow='hidden';
  openDrawerEl = d;
}
function closeDrawers(soft){
  $$('.drawer').forEach(d=>{ d.classList.remove('open'); d.setAttribute('aria-hidden','true'); });
  const scrim = $('#scrim'); scrim.classList.remove('show');
  setTimeout(()=>{ if(!scrim.classList.contains('show')) scrim.hidden=true; },320);
  document.body.style.overflow='';
  if(!soft) openDrawerEl=null;
}

/* ---------- reveal on scroll ---------- */
let revealIO = null;
function initReveal(root=document){
  const els = $$('.reveal:not(.in)', root);
  if(!('IntersectionObserver' in window)){ els.forEach(e=>e.classList.add('in')); return; }
  if(!revealIO) revealIO = new IntersectionObserver(entries=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); revealIO.unobserve(en.target); } });
  },{rootMargin:'0px 0px -40px 0px',threshold:.06});
  els.forEach(e=>revealIO.observe(e));
}

/* ---------- routing ---------- */
const ROUTES = {};
function registerRoutes(map){ Object.assign(ROUTES, map); }
function parseHash(){
  let raw = location.hash.replace(/^#\/?/,'');
  const [path, qs] = raw.split('?');
  return { path: path||'', parts: path.split('/').filter(Boolean), params: new URLSearchParams(qs||'') };
}
let lastRouteKey = '';
function route(){
  const { path, parts, params } = parseHash();
  closeDrawers(); closeMobileSearch();
  const view = $('#view');
  view.classList.remove('page-enter'); void view.offsetWidth; view.classList.add('page-enter');
  const fn = ROUTES[parts[0]||'home'] || ROUTES.notfound;
  try{ fn(view, parts, params); }
  catch(err){ console.error(err); view.textContent=''; view.append(emptyState('Something went wrong','Please refresh the page.','#/','Back to home')); }
  if(!parts[0]||parts[0]==='home') window.scrollTo(0,0);
  initReveal(view);
  markActiveNav(parts[0]||'home', params);
}
function markActiveNav(page, params){
  $$('.nav-link').forEach(a=>{
    const target = a.dataset.nav;
    const cat = a.dataset.cat;
    a.classList.toggle('active', target===page && (!cat || params.get('cat')===cat));
  });
  $$('.bottnav a').forEach(a=>a.classList.toggle('active', a.dataset.bn===page));
}
function go(path){ location.hash = path; }

/* ---------- header chrome ---------- */
function buildAnnounce(){
  const msgs = [
    'FREE delivery on orders above <b>₹499</b> · COD available',
    'Delivering to <b>19,500+ pincodes</b> — metro cities to remote villages',
    'Use code <b>WELCOME10</b> for 10% off your first order',
  ];
  const track = $('#announceTrack');
  msgs.forEach(m=>track.append(h('div',{class:'announce-item'}, h('span',{html:m}))));
}
function buildNav(){
  const nav = $('#hdrNav');
  nav.textContent='';
  const row = h('div',{class:'nav-row'});
  row.append(h('a',{class:'nav-link','data-nav':'shop',href:'#/shop'},'All Products'));
  CATEGORIES.forEach(c=>row.append(h('a',{class:'nav-link','data-nav':'shop','data-cat':c.id,href:'#/shop?cat='+c.id},c.label)));
  row.append(h('a',{class:'nav-link','data-nav':'orders',href:'#/orders'},'Track Orders'));
  nav.append(row);

  const nb = $('#navDrawerBody'); nb.textContent='';
  CATEGORIES.forEach(c=>rowCount(c));
  function rowCount(c){
    const n = PRODUCTS.filter(p=>p.cat===c.id).length;
    nb.append(h('button',{class:'nav-link-big',onclick:()=>go('/shop?cat='+c.id)}, c.label, h('span',{class:'cnt'},n+' items')));
  }
  const nf = $('#navDrawerFoot'); nf.textContent='';
  nf.append(h('div',{class:'nav-plain'},
    h('a',{href:'#/shop'},'All Products'),
    h('a',{href:'#/orders'},'Track Orders'),
    h('a',{href:'#/wishlist'},'Wishlist'),
    h('a',{href:'#/contact'},'Contact & Store Location'),
    h('a',{href:'#/about'},'About Us')));
  nf.append(h('div',{class:'d-foot-note',style:{marginTop:'14px'}}, CONFIG.hours, h('br'), CONFIG.phone));
}
function buildFooter(){
  const f = $('#footer'); f.textContent='';
  f.append(
    h('div',{class:'foot-grid'},
      h('div',{},
        h('div',{class:'foot-brand'}, h('img',{src:'img/favicon.svg',alt:'',width:'30',height:'30'}), CONFIG.storeName),
        h('p',{class:'foot-about'},'Serving families since '+CONFIG.since+' — from a much-loved neighbourhood counter to every corner of India. Jewellery, home & kitchen essentials, watches, toys, gifts and school supplies, delivered with the same trust.')),
      h('div',{}, h('div',{class:'foot-title'},'Shop'),
        h('ul',{class:'foot-links'},
          CATEGORIES.slice(0,6).map(c=>h('li',{},h('a',{href:'#/shop?cat='+c.id},c.label))),
          h('li',{},h('a',{href:'#/shop'},'View all →')))),
      h('div',{}, h('div',{class:'foot-title'},'Help'),
        h('ul',{class:'foot-links'},
          h('li',{},h('a',{href:'#/orders'},'Track your order')),
          h('li',{},h('a',{href:'#/contact'},'Contact us')),
          h('li',{},h('a',{href:'#/about'},'About us')),
          h('li',{},h('a',{href:'#/shop?sort=discount'},'Today\'s deals')),
          h('li',{},h('a',{href:'#/wishlist'},'Wishlist')))),
      h('div',{}, h('div',{class:'foot-title'},'Visit the Store'),
        h('address',{class:'foot-contact'}, h('b',{},CONFIG.address), h('br'), CONFIG.phone,' · ',CONFIG.email, h('br'), CONFIG.hours),
        h('div',{class:'pay-chips'}, ['UPI','Visa','Mastercard','RuPay','NetBanking','COD'].map(x=>h('span',{class:'pay-chip'},x))))),
    h('div',{class:'foot-bottom'}, '© '+new Date().getFullYear()+' ', h('b',{},CONFIG.storeName), ' · Crafted with care in India · ', h('a',{href:'#/about'},'About'),' · ',h('a',{href:'#/contact'},'Contact')));
}

/* ---------- search ---------- */
function searchMatches(q){
  q = q.trim().toLowerCase();
  if(q.length<2) return [];
  return PRODUCTS.filter(p=> (p.name+' '+p.brand+' '+catLabel(p.cat)+' '+p.cat).toLowerCase().includes(q)).slice(0,6);
}
function renderSug(box, q){
  box.textContent=''; box.hidden=false;
  const res = searchMatches(q);
  if(!res.length){ box.append(h('div',{class:'sug-empty'},'No matches for “'+q.slice(0,30)+'” — try “kundan”, “milton”, “watch”…')); return; }
  res.forEach(p=>{
    box.append(h('button',{class:'sug-item',type:'button',onclick:()=>{go('/product/'+p.id);box.hidden=true;}},
      h('img',{src:'img/'+p.img+'.jpg',alt:'',loading:'lazy',onerror:imgFallback(p)}),
      h('span',{}, h('span',{class:'sug-name'},p.name), h('span',{class:'sug-meta'},p.brand)),
      h('span',{class:'sug-price'},fmt(p.price))));
  });
  box.append(h('button',{class:'sug-item',type:'button',onclick:()=>{go('/shop?q='+encodeURIComponent(q));box.hidden=true;}},
    h('span',{class:'sug-name',style:{marginLeft:'56px'}},'See all results for “'+q.slice(0,30)+'” →')));
}
function closeMobileSearch(){ const m=$('#mSearch'); if(m) m.classList.remove('open'); }

/* ---------- HOME ---------- */
function renderHome(view){
  const heroP2 = productById('p7');
  view.textContent='';
  view.append(
    h('section',{class:'hero'},
      h('div',{class:'hero-inner'},
        h('div',{},
          h('span',{class:'eyebrow'},'Trusted since '+CONFIG.since),
          h('h1',{class:'hero-title'},'Treasures for every home, ',h('em',{},'delivered everywhere')),
          h('p',{class:'hero-sub'},'From bridal kundan to Bajaj mixers — ',h('b',{},CONFIG.storeName),' brings the warmth of your favourite neighbourhood store online. We ship to ',h('b',{},'19,500+ pincodes'),' — big cities, small towns and the remotest villages.'),
          h('div',{class:'hero-cta'},
            h('a',{class:'btn btn-primary',href:'#/shop'},'Shop All Products'),
            h('a',{class:'btn btn-gold',href:'#/shop?cat=imitation-jewellery'},'Explore Jewellery')),
          h('div',{class:'stats'},
            h('div',{class:'stat'},h('b',{},'27K+'),h('span',{},'Happy customers')),
            h('div',{class:'stat'},h('b',{},'11'),h('span',{},'Categories')),
            h('div',{class:'stat'},h('b',{},'4.8★'),h('span',{},'Average rating')),
            h('div',{class:'stat'},h('b',{},'COD'),h('span',{},'Available')))),
        h('div',{class:'hero-media'},
          h('div',{class:'hero-frame'}, h('img',{class:'hero-img',src:'img/hero.jpg',alt:'Festive collection of kundan jewellery and gifts',fetchpriority:'high'})),
          h('div',{class:'hero-frame2'}, h('a',{href:'#/product/'+heroP2.id}, prodImg(heroP2,'','Oxidised jhumka earrings'))),
          h('div',{class:'float-chip fc-1'}, svgIcon(ICONS.truck,17), h('span',{},'Free shipping ',h('b',{},'₹499+'))),
          h('div',{class:'float-chip fc-2'}, svgIcon(ICONS.shield,17), h('span',{},h('b',{},'7-day'),h('span',{},' easy returns'))),
          h('div',{class:'float-chip fc-3'}, svgIcon(ICONS.cash,17), h('span',{},h('b',{},'COD'),h('span',{},' everywhere')))))));

  /* categories */
  view.append(h('section',{class:'sec'},
    h('div',{class:'sec-head'},
      h('div',{}, h('div',{class:'sec-kicker'},'Browse'), h('h2',{class:'sec-title'},'Shop by Category'), h('p',{class:'sec-sub'},'Eleven aisles of our store, now in your pocket.')),
      h('a',{class:'sec-link',href:'#/shop'},'View all products →')),
    h('div',{class:'cat-grid'}, CATEGORIES.map((c,i)=>
      h('a',{class:'cat-tile reveal'+(i===0?' wide':''),href:'#/shop?cat='+c.id},
        prodImg(productById(c.img),'',c.label),
        h('div',{class:'cat-label'},h('b',{},c.label),h('span',{},c.sub)))))));

  /* trending tabs row */
  view.append(h('section',{class:'sec'},
    h('div',{class:'sec-head'},
      h('div',{}, h('div',{class:'sec-kicker'},'Customer favourites'), h('h2',{class:'sec-title'},'Trending This Week')),
      h('a',{class:'sec-link',href:'#/shop?sort=popular'},'See bestsellers →')),
    scrollRow(PRODUCTS.filter(p=>p.badge==='hot').concat(PRODUCTS.filter(p=>p.rating>=4.6&&p.badge!=='hot')).slice(0,10))));

  /* collections */
  COLLECTIONS.forEach(col=>{
    view.append(h('section',{class:'sec'},
      h('div',{class:'sec-head'},
        h('div',{}, h('div',{class:'sec-kicker'},'Collection'), h('h2',{class:'sec-title'},col.title), h('p',{class:'sec-sub'},col.sub)),
        h('a',{class:'sec-link',href:'#/shop?q='+encodeURIComponent(col.title.split(' ')[0])},'Shop collection →')),
      scrollRow(col.items.map(productById))));
  });

  /* brands */
  view.append(h('div',{class:'marquee',ariaLabel:'Brands we stock'},
    h('div',{class:'marquee-track'},
      [...BRANDS,...BRANDS].map(b=>h('span',{class:'mq-item'},b)))));

  /* value / reach */
  view.append(h('section',{class:'sec'},
    h('div',{class:'sec-head'},
      h('div',{}, h('div',{class:'sec-kicker'},'Maximum reach'), h('h2',{class:'sec-title'},'From Our Counter to Your Doorstep'), h('p',{class:'sec-sub'},'Regional, remote or right around the corner — if India Post delivers there, so do we.'))),
    h('div',{class:'value-grid'},
      h('div',{class:'value reveal'}, svgIcon(ICONS.truck,30), h('b',{},'Pan-India Delivery'), h('span',{},'19,500+ pincodes via BlueDart, Delhivery & India Post — including COD.')),
      h('div',{class:'value reveal'}, svgIcon(ICONS.cash,30), h('b',{},'Cash on Delivery'), h('span',{},'Pay when it reaches your hands. Available even in remote blocks.')),
      h('div',{class:'value reveal'}, svgIcon(ICONS.shield,30), h('b',{},'Genuine Products'), h('span',{},'Authorised retailer for Milton, Cello, Prestige, Borosil, La Opala, Bajaj & Agaro.')),
      h('div',{class:'value reveal'}, svgIcon(ICONS.ret,30), h('b',{},'7-Day Easy Returns'), h('span',{},'Changed your mind? No questions, no drama — quick replacements.')))));

  /* testimonials */
  view.append(h('section',{class:'sec'},
    h('div',{class:'sec-head'},
      h('div',{}, h('div',{class:'sec-kicker'},'Word of mouth'), h('h2',{class:'sec-title'},'What Our Customers Say')),
      h('a',{class:'sec-link',href:'#/shop'},'Shop the love →')),
    h('div',{class:'testi-grid'},
      TESTIMONIALS.map(t=> h('figure',{class:'testi reveal'},
        h('div',{class:'t-stars','aria-label':t.stars+' stars'},'★'.repeat(t.stars)),
        h('blockquote',{class:'t-quote'},t.q),
        h('figcaption',{class:'t-name'},t.name,h('small',{},t.place)))))));

  /* newsletter */
  view.append(h('section',{class:'news'},
    h('div',{}, h('h3',{},'First to know, first to save'), h('p',{},'Join 4,000+ subscribers — new arrivals, festive offers and restock alerts. No spam, ever.')),
    h('form',{class:'news-form',onsubmit:(e)=>{
      e.preventDefault();
      const em = e.target.querySelector('input');
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em.value.trim())){ toast('Please enter a valid email','', true); return; }
      em.value=''; toast('Subscribed! 🎉','(Demo list — no emails are actually sent)');
    }}, h('input',{type:'email',placeholder:'Your email address','aria-label':'Email address',maxlength:'80',required:true}), h('button',{class:'btn btn-gold',type:'submit'},'Subscribe'))));
}
function scrollRow(items){
  const inner = h('div',{class:'row-scroll'}, items.filter(Boolean).map(p=>productCard(p)));
  const wrap = h('div',{class:'row-wrap'},
    h('button',{class:'row-btn prev','aria-label':'Scroll left',onclick:()=>inner.scrollBy({left:-inner.clientWidth*.8,behavior:'smooth'})},h('span',{style:{fontSize:'18px'}},'‹')),
    inner,
    h('button',{class:'row-btn next','aria-label':'Scroll right',onclick:()=>inner.scrollBy({left:inner.clientWidth*.8,behavior:'smooth'})},h('span',{style:{fontSize:'18px'}},'›')));
  return wrap;
}

/* ---------- init ---------- */
function initApp(){
  buildAnnounce(); buildNav(); buildFooter(); renderCartUI(); renderWishUI();
  if(CONFIG.whatsapp){
    const fab = $('#whFab');
    fab.href = 'https://wa.me/'+CONFIG.whatsapp.replace(/\D/g,'')+'?text='+encodeURIComponent('Namaste! I would like to order from '+CONFIG.storeName+'.');
    fab.hidden = false;
  }
  window.addEventListener('hashchange', route);
  $('#cartBtn').addEventListener('click', ()=>openDrawer_('cart'));
  $('#burger').addEventListener('click', ()=>openDrawer_('nav'));
  $('#scrim').addEventListener('click', ()=>closeDrawers());
  $$('[data-close-drawer]').forEach(b=>b.addEventListener('click', ()=>closeDrawers()));
  document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeDrawers(); closeMobileSearch(); } });

  const si = $('#searchInput'), sug = $('#searchSug');
  let sugT;
  si.addEventListener('input', ()=>{ clearTimeout(sugT); sugT=setTimeout(()=>renderSug(sug, si.value), 120); });
  si.addEventListener('focus', ()=>{ if(si.value.trim().length>=2) renderSug(sug, si.value); });
  document.addEventListener('click', e=>{ if(!e.target.closest('.search')) sug.hidden=true; });
  $('#searchForm').addEventListener('submit', e=>{
    e.preventDefault();
    const q = si.value.trim(); sug.hidden=true;
    if(q.length>=2) go('/shop?q='+encodeURIComponent(q.slice(0,50)));
  });

  window.addEventListener('scroll', ()=>{ $('#hdr').classList.toggle('scrolled', window.scrollY>8); }, {passive:true});
  route();
}
document.addEventListener('DOMContentLoaded', initApp);
