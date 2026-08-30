/* ============================================================
   NEW MAA LOKHI STORES — views: shop, product, checkout, etc.
   ============================================================ */
'use strict';

/* ============================ SHOP ============================ */
const PER_PAGE = 12;
function shopParams(params){
  return {
    cat: (params.get('cat')||'').split(',').filter(Boolean),
    brand: (params.get('brand')||'').split(',').filter(Boolean),
    min: parseInt(params.get('min'),10)||0,
    max: parseInt(params.get('max'),10)||0,
    rating: parseFloat(params.get('rating'))||0,
    sort: params.get('sort')||'popular',
    q: (params.get('q')||'').slice(0,50),
    page: parseInt(params.get('page'),10)||1,
  };
}
function shopUrl(sp){
  const u = new URLSearchParams();
  if(sp.cat.length) u.set('cat', sp.cat.join(','));
  if(sp.brand.length) u.set('brand', sp.brand.join(','));
  if(sp.min) u.set('min', sp.min);
  if(sp.max) u.set('max', sp.max);
  if(sp.rating) u.set('rating', sp.rating);
  if(sp.sort&&sp.sort!=='popular') u.set('sort', sp.sort);
  if(sp.q) u.set('q', sp.q);
  if(sp.page>1) u.set('page', sp.page);
  const qs = u.toString();
  return '#/shop'+(qs?'?'+qs:'');
}
function toggleIn(arr, v){ const i=arr.indexOf(v); if(i>=0)arr.splice(i,1); else arr.push(v); return arr; }
function closeFilters(){ const f=$('#shopFilters'); if(f) f.classList.remove('open'); }

function renderShop(view, parts, params){
  const sp = shopParams(params);
  view.textContent='';

  /* filter + sort */
  let list = PRODUCTS.filter(p=>
    (!sp.cat.length || sp.cat.includes(p.cat)) &&
    (!sp.brand.length || sp.brand.includes(p.brand)) &&
    (!sp.min || p.price>=sp.min) &&
    (!sp.max || p.price<=sp.max) &&
    (!sp.rating || p.rating>=sp.rating) &&
    (!sp.q || (p.name+' '+p.brand+' '+catLabel(p.cat)).toLowerCase().includes(sp.q.toLowerCase()))
  );
  const sorters = {
    popular:  (a,b)=>b.reviews-a.reviews,
    rating:   (a,b)=>b.rating-a.rating || b.reviews-a.reviews,
    'price-asc':  (a,b)=>a.price-b.price,
    'price-desc': (a,b)=>b.price-a.price,
    discount: (a,b)=>pct(b)-pct(a),
    newest:   (a,b)=>(b.badge==='new'?1:0)-(a.badge==='new'?1:0) || b.id.localeCompare(a.id),
  };
  list.sort(sorters[sp.sort]||sorters.popular);

  const pages = Math.max(1, Math.ceil(list.length/PER_PAGE));
  if(sp.page>pages) sp.page = pages;
  const slice = list.slice((sp.page-1)*PER_PAGE, sp.page*PER_PAGE);

  const heading = sp.q ? 'Results for “'+sp.q+'”' : sp.cat.length===1 ? catLabel(sp.cat[0]) : 'All Products';
  const sub = sp.cat.length===1 ? CATEGORIES.find(c=>c.id===sp.cat[0]).sub : 'Fresh stock across every aisle of the store.';

  view.append(h('div',{class:'page-wrap'},
    h('nav',{class:'crumbs','aria-label':'Breadcrumb'},
      h('a',{href:'#/'},'Home'),h('span',{class:'sep'},'›'),h('span',{},heading)),
    h('div',{class:'sec-head',style:{marginBottom:'20px'}},
      h('div',{}, h('div',{class:'sec-kicker'},'Shop'), h('h1',{class:'sec-title'},heading), h('p',{class:'sec-sub'},sub)))));

  /* ---- filter rail ---- */
  const filters = h('aside',{class:'filters',id:'shopFilters','aria-label':'Filters'});
  const setCats = c => { sp.cat = c; sp.page=1; go(shopUrl(sp).slice(1)); };
  const setBrands = b => { sp.brand = b; sp.page=1; go(shopUrl(sp).slice(1)); };

  filters.append(h('div',{class:'f-group'},
    h('div',{class:'f-title'},'Category'),
    CATEGORIES.map(c=> h('label',{class:'check'},
      h('input',{type:'checkbox',checked:sp.cat.includes(c.id),onchange:()=>setCats(toggleIn(sp.cat,c.id).slice())}),
      c.label, h('span',{class:'n'}, PRODUCTS.filter(p=>p.cat===c.id).length)))));

  filters.append(h('div',{class:'f-group'},
    h('div',{class:'f-title'},'Brand'),
    BRANDS.map(b=> h('label',{class:'check'},
      h('input',{type:'checkbox',checked:sp.brand.includes(b),onchange:()=>setBrands(toggleIn(sp.brand,b).slice())}),
      b, h('span',{class:'n'}, PRODUCTS.filter(p=>p.brand===b).length)))));

  const priceForm = h('form',{class:'price-inputs',onsubmit:(e)=>{
    e.preventDefault();
    sp.min = parseInt(e.target.min.value,10)||0; sp.max = parseInt(e.target.max.value,10)||0; sp.page=1;
    go(shopUrl(sp).slice(1)); closeFilters();
  }},
    h('input',{type:'number',name:'min',placeholder:'Min ₹',min:'0',max:'99999',value:sp.min||'',inputmode:'numeric','aria-label':'Minimum price'}),
    h('span',{},'—'),
    h('input',{type:'number',name:'max',placeholder:'Max ₹',min:'0',max:'99999',value:sp.max||'',inputmode:'numeric','aria-label':'Maximum price'}),
    h('button',{class:'btn btn-ghost btn-sm',type:'submit'},'Go'));
  filters.append(h('div',{class:'f-group'},
    h('div',{class:'f-title'},'Price'),
    [[0,499,'Under ₹500'],[500,999,'₹500 – ₹999'],[1000,2500,'₹1,000 – ₹2,500'],[2500,0,'₹2,500 & above']].map(([mn,mx,lbl])=>
      h('label',{class:'check'},
        h('input',{type:'radio',name:'priceband',checked:(sp.min===mn&&sp.max===mx&&!(mn===0&&mx===0&&!sp.min&&!sp.max))||false,
          onchange:()=>{ sp.min=mn; sp.max=mx; sp.page=1; go(shopUrl(sp).slice(1)); }}), lbl)),
    priceForm));

  filters.append(h('div',{class:'f-group'},
    h('div',{class:'f-title'},'Customer Rating'),
    [4.5,4,3.5].map(r=> h('label',{class:'check'},
      h('input',{type:'radio',name:'rateband',checked:sp.rating===r, onchange:()=>{ sp.rating=r; sp.page=1; go(shopUrl(sp).slice(1)); }}),
      r+'★ & above'))));

  const hasFilters = sp.cat.length||sp.brand.length||sp.min||sp.max||sp.rating||sp.q;
  if(hasFilters) filters.append(h('button',{class:'btn btn-ghost btn-sm f-clear',onclick:()=>go('/shop')},'✕ Clear all filters'));

  /* ---- toolbar ---- */
  const sortSel = h('select',{'aria-label':'Sort products',onchange:(e)=>{ sp.sort=e.target.value; sp.page=1; go(shopUrl(sp).slice(1)); }},
    [['popular','Most popular'],['newest','Newest first'],['rating','Highest rated'],['price-asc','Price: low → high'],['price-desc','Price: high → low'],['discount','Biggest discount']]
      .map(([v,l])=>h('option',{value:v,selected:sp.sort===v},l)));

  const chips = [];
  const chipRem = (label, fn) => chips.push(h('span',{class:'chip-x'}, label, h('button',{'aria-label':'Remove filter '+label,onclick:fn},'✕')));
  sp.cat.forEach(c=>chipRem(catLabel(c), ()=>setCats([sp.cat.filter(x=>x!==c)][0])));
  sp.brand.forEach(b=>chipRem(b, ()=>setBrands(sp.brand.filter(x=>x!==b))));
  if(sp.min||sp.max) chipRem((sp.min?fmt(sp.min):'₹0')+' – '+(sp.max?fmt(sp.max):'∞'), ()=>{ sp.min=0; sp.max=0; sp.page=1; go(shopUrl(sp).slice(1)); });
  if(sp.rating) chipRem(sp.rating+'★ & above', ()=>{ sp.rating=0; sp.page=1; go(shopUrl(sp).slice(1)); });
  if(sp.q) chipRem('“'+sp.q+'”', ()=>go('/shop'));

  const layout = h('div',{class:'shop-layout'},
    filters,
    h('div',{},
      h('div',{class:'toolbar'},
        h('span',{class:'res-count'},h('b',{},list.length.toLocaleString('en-IN')),' product'+(list.length===1?'':'s')),
        h('div',{class:'sort-wrap'},'Sort', sortSel)),
      chips.length?h('div',{class:'active-chips'},chips):null,
      slice.length
        ? h('div',{class:'grid-prod'}, slice.map(p=>productCard(p)))
        : emptyState('Nothing matched','Try widening the price range or clearing a filter or two.','#/shop','Browse everything'),
      pages>1?h('div',{class:'pagination'},
        h('button',{class:'page-btn',disabled:sp.page===1?'':null,onclick:()=>{sp.page--;go(shopUrl(sp).slice(1));}},'‹ Prev'),
        pageBtns(sp.page,pages).map(i=>h('button',{class:'page-btn'+(i===sp.page?' on':''),onclick:()=>{sp.page=i;go(shopUrl(sp).slice(1));}},i)),
        h('button',{class:'page-btn',disabled:sp.page===pages?'':null,onclick:()=>{sp.page++;go(shopUrl(sp).slice(1));}},'Next ›')):null));

  view.append(layout);
  view.append(h('button',{class:'fab-filters',onclick:()=>{
    const f=$('#shopFilters'); f.classList.add('open');
    const s=$('#scrim'); s.hidden=false; requestAnimationFrame(()=>s.classList.add('show'));
  }}, '☰ Filters'));
}
function pageBtns(cur,total){
  const out=[]; const start=Math.max(1,Math.min(cur-2,total-4));
  for(let i=start;i<=Math.min(total,start+4);i++) out.push(i);
  return out;
}
$('#scrim') && $('#scrim').addEventListener('click', closeFilters);

/* ============================ PRODUCT ============================ */
function getUserReviews(id){ return store.get('nmls_rev_'+id, []); }
function allReviews(p){ return [...getUserReviews(p.id), ...seededReviews(p)].map((r,i)=>({...r, key:p.id+'-'+i})); }
function ratingDist(p){
  const r=p.rating, n=p.reviews;
  const w5=Math.max(.35,(r-3.4)/1.6), w4=.28, w3=Math.max(.03,.6-w5*.5), w2=.05, w1=Math.max(.01,.08-(r-4)*.5);
  const s=w5+w4+w3+w2+w1;
  return [5,4,3,2,1].map(st=>({star:st,count:Math.round(n*({5:w5,4:w4,3:w3,2:w2,1:w1}[st])/s)}));
}
function deliverEstimate(pin){
  const first=pin[0], sum=pin.split('').reduce((a,c)=>a+ +c,0);
  if(sum%9===0 || first==='7'||first==='8') return {ok:true,days:'5–8 days',via:'India Post · remote route'};
  if(first==='1'||first==='11') return {ok:true,days:'2–4 days',via:'Express partner'};
  return {ok:true,days:'3–6 days',via:'Delhivery / BlueDart'};
}
const GAL_VIEWS = [
  {label:'Full view',  scale:1,    ox:'50% 50%'},
  {label:'Detail',    scale:1.75, ox:'28% 32%'},
  {label:'Close-up',  scale:1.75, ox:'72% 62%'},
  {label:'Styled',    scale:2.1,  ox:'50% 78%'},
];
function renderProduct(view, parts){
  const p = productById(parts[1]);
  if(!p){ renderNotFound(view); return; }
  view.textContent='';
  document.title = p.name + ' — ' + CONFIG.storeName;

  const crumbs = h('nav',{class:'crumbs','aria-label':'Breadcrumb'},
    h('a',{href:'#/'},'Home'),h('span',{class:'sep'},'›'),
    h('a',{href:'#/shop?cat='+p.cat},catLabel(p.cat)),h('span',{class:'sep'},'›'),
    h('span',{},p.name));

  /* gallery */
  const mainImg = prodImg(p,'',p.name); mainImg.loading='eager';
  let curView = 0, zoomed=false;
  const applyView=()=>{ const v=GAL_VIEWS[curView]; mainImg.style.transformOrigin=v.ox; mainImg.style.transform='scale('+v.scale+')'; };
  applyView();
  const galMain = h('div',{class:'gal-main',role:'button',tabindex:'0','aria-label':'Product image — click to zoom',
    onclick:()=>{ zoomed=!zoomed; applyZoom(); },
    onmousemove:(e)=>{ if(!zoomed)return; const r=galMain.getBoundingClientRect(); mainImg.style.transformOrigin=((e.clientX-r.left)/r.width*100)+'% '+((e.clientY-r.top)/r.height*100)+'%'; }},
    mainImg,
    h('span',{class:'gal-view'},GAL_VIEWS[0].label),
    h('span',{class:'gal-hint'},'Hover · click to zoom'));
  const viewTag = galMain.querySelector('.gal-view');
  function applyZoom(){ const v=GAL_VIEWS[curView]; mainImg.style.transform='scale('+(zoomed?v.scale*1.45:v.scale)+')'; galMain.classList.toggle('zoomed',zoomed); }
  const thumbs = h('div',{class:'gal-thumbs'}, GAL_VIEWS.map((v,i)=>
    h('button',{class:'thumb'+(i===0?' on':''),'aria-label':v.label,onclick:()=>{
      curView=i; zoomed=false; applyView(); viewTag.textContent=v.label;
      $$('.thumb',thumbs).forEach((t,j)=>t.classList.toggle('on',j===i));
    }}, (()=>{ const im=prodImg(p,'',v.label); im.style.transformOrigin=v.ox; im.style.transform='scale('+v.scale+')'; return im; })())));

  /* info */
  const off = pct(p);
  const qty = { n:1 };
  const qtyWrap = h('span',{class:'qty-lg'},
    h('button',{'aria-label':'Decrease quantity',onclick:()=>{ qty.n=Math.max(1,qty.n-1); qn.textContent=qty.n; }},'−'),
    h('span',{},(qn=>qn)(h('span',{},'1'))),
    h('button',{'aria-label':'Increase quantity',onclick:()=>{ qty.n=Math.min(Math.min(10,p.stock||10),qty.n+1); qn.textContent=qty.n; }},'+'));
  const qn = qtyWrap.children[1];
  const pinInput = h('input',{type:'text',inputmode:'numeric',maxlength:'6',placeholder:'Enter 6-digit pincode','aria-label':'Delivery pincode'});
  const pinRes = h('div',{class:'pin-res'});
  const pinForm = h('form',{class:'pin-check',onsubmit:(e)=>{
    e.preventDefault();
    const v = pinInput.value.trim();
    pinRes.textContent=''; pinRes.className='pin-res';
    if(!/^[1-9]\d{5}$/.test(v)){ pinRes.classList.add('no'); pinRes.append(svgIcon(ICONS.pin,15),' Please enter a valid 6-digit pincode'); return; }
    const est = deliverEstimate(v);
    pinRes.classList.add('ok'); pinRes.append(svgIcon(ICONS.truck,16), h('span',{}, 'Deliverable to '+v+' · arrives in ', h('b',{},est.days),' · ',est.via,' · COD available'));
  }}, pinInput, h('button',{class:'btn btn-ghost btn-sm',type:'submit'},'Check'));

  const info = h('div',{class:'pinfo'},
    h('span',{class:'p-brand'},p.brand),
    h('h1',{class:'p-title'},p.name),
    h('div',{class:'p-rate'},
      h('span',{class:'pill'},p.rating,' ★'),
      h('span',{},p.reviews.toLocaleString('en-IN')+' verified reviews'),
      h('span',{},'·'), h('span',{}, (p.stock<=15?'Only '+p.stock+' left in stock':'In stock'))),
    h('div',{class:'p-price'},
      h('span',{class:'pp-now'},fmt(p.price)),
      h('span',{class:'pp-mrp'},fmt(p.mrp)),
      h('span',{class:'pp-off'},off+'% OFF'),
      h('span',{class:'pp-tax'},'Inclusive of all taxes')),
    h('div',{class:'offers'},
      h('div',{class:'offer'},svgIcon(ICONS.truck,17), h('span',{},'Free delivery on orders above ',h('b',{},fmt(CONFIG.freeShipAbove)),' · COD everywhere in India')),
      h('div',{class:'offer'},svgIcon(ICONS.tag,17), h('span',{},'Extra 10% off with code ',h('b',{},'WELCOME10'),' at checkout')),
      h('div',{class:'offer'},svgIcon(ICONS.ret,17), h('span',{},'7-day easy returns & replacement guarantee'))),
    h('div',{class:'buy-row'},
      qtyWrap,
      h('button',{class:'btn btn-primary',onclick:()=>addToCart(p.id,qty.n,false)},'Add to Cart'),
      h('button',{class:'btn btn-gold',onclick:()=>{ addToCart(p.id,qty.n,false); go('/checkout'); }},'Buy Now')),
    h('button',{class:'btn btn-ghost btn-sm',style:{marginTop:'4px'},onclick:()=>toggleWish(p.id)}, wishlistHas(p.id)?'♥ Saved to wishlist':'♡ Save to wishlist'),
    pinForm, pinRes);

  /* tabs content */
  const revs = allReviews(p);
  const dist = ratingDist(p);
  const revList = h('div',{id:'revList'});
  let shown = 4;
  function paintRevs(){
    revList.textContent='';
    revs.slice(0,shown).forEach(r=>{
      revList.append(h('div',{class:'rev-item'},
        h('div',{class:'rev-head'},
          h('span',{class:'rev-av'},r.name.trim()[0].toUpperCase()),
          h('div',{}, h('div',{class:'rev-name'},r.name, r.verified?h('span',{class:'vtag'},'✓ Verified'):null),
            h('div',{class:'rev-date'},agoDays(r.days), ' · ', h('span',{class:'stars',style:{fontSize:'11px'}},h('span',{'aria-hidden':'true'},'★★★★★'),h('span',{class:'stars-fill',style:{width:r.rating/5*100+'%'}},'★★★★★'))))),
        h('p',{class:'rev-text'},r.text)));
    });
    if(revs.length>shown) revList.append(h('button',{class:'btn btn-ghost btn-sm',style:{marginTop:'14px'},onclick:()=>{shown+=4;paintRevs();}},'Show '+Math.min(4,revs.length-shown)+' more reviews'));
  }
  paintRevs();

  const ratingPick = h('div',{class:'rate-pick','aria-label':'Your rating'});
  let picked = 5;
  [1,2,3,4,5].forEach(i=>{
    ratingPick.append(h('button',{type:'button',class:i<=5&&i===1?'on':'','aria-label':i+' star',onclick:()=>{
      picked=i; $$('button',ratingPick).forEach((b,j)=>b.classList.toggle('on',j<i));
    }},'★'));
  });
  $$('button',ratingPick).forEach(b=>b.classList.add('on'));

  const revForm = h('form',{class:'rev-form-card',onsubmit:(e)=>{
    e.preventDefault();
    const name = e.target.elements.rname.value.trim().slice(0,40);
    const text = e.target.elements.rtext.value.trim().slice(0,500);
    if(name.length<2 || text.length<10){ toast('Please add your name and a few words about the product','',true); return; }
    const last = store.get('nmls_revtime_'+p.id, 0);
    if(Date.now()-last < 60000){ toast('Easy! One review per minute per product','',true); return; }
    const mine = getUserReviews(p.id);
    mine.unshift({ name, rating:picked, text, days:0, verified:true });
    store.set('nmls_rev_'+p.id, mine.slice(0,20));
    store.set('nmls_revtime_'+p.id, Date.now());
    toast('Thank you! Your review is live 🌟');
    renderProduct(view, ['product',p.id]); // refresh
  }},
    h('div',{class:'f-title',style:{marginBottom:'14px'}},'Write a review'),
    h('div',{class:'field'}, h('label',{class:'label'},'Your rating'), ratingPick),
    h('div',{class:'field'}, h('label',{class:'label'},'Your name'), h('input',{class:'input',name:'rname',maxlength:'40',placeholder:'e.g. Priya S.',required:true})),
    h('div',{class:'field'}, h('label',{class:'label'},'Your review'), h('textarea',{class:'input',name:'rtext',maxlength:'500',placeholder:'How is the quality? Would you recommend it?',required:true})),
    h('button',{class:'btn btn-primary btn-sm',type:'submit'},'Submit review'));

  const related = PRODUCTS.filter(x=>x.cat===p.cat&&x.id!==p.id)
    .concat(PRODUCTS.filter(x=>x.cat!==p.cat&&x.brand===p.brand&&x.id!==p.id))
    .slice(0,8);

  view.append(crumbs,
    h('article',{class:'pdp'},
      h('div',{class:'gallery'}, galMain, thumbs),
      info,
      h('div',{class:'p-tabs'},
        h('div',{}, h('div',{class:'sec-kicker'},'Details'), h('h2',{class:'sec-title',style:{fontSize:'26px'}},'About this product'),
          h('p',{class:'desc'},p.desc)),
        h('div',{}, h('div',{class:'sec-kicker'},'Highlights'), h('h2',{class:'sec-title',style:{fontSize:'26px'}},'Why customers love it'),
          h('ul',{class:'hl'}, p.hi.map(x=>h('li',{},x)))),
        h('div',{}, h('div',{class:'sec-kicker'},'Specifications'), h('h2',{class:'sec-title',style:{fontSize:'26px'}},'Product details'),
          h('table',{class:'specs'},
            h('tr',{},h('td',{},'Brand'),h('td',{},p.brand)),
            h('tr',{},h('td',{},'Category'),h('td',{},catLabel(p.cat))),
            h('tr',{},h('td',{},'M.R.P.'),h('td',{},fmt(p.mrp))),
            h('tr',{},h('td',{},'You pay'),h('td',{},fmt(p.price)+' ('+off+'% off)')),
            h('tr',{},h('td',{},'In the box'),h('td',{},'1 × '+p.name+(p.cat.includes('jewellery')?' with storage pouch':''))),
            h('tr',{},h('td',{},'Seller'),h('td',{},CONFIG.storeName+' · since '+CONFIG.since)),
            h('tr',{},h('td',{},'Ships to'),h('td',{},'All India — 19,500+ pincodes, COD available')))),
        h('div',{id:'reviews'},
          h('div',{class:'sec-kicker'},'Reviews'), h('h2',{class:'sec-title',style:{fontSize:'26px'}},p.reviews.toLocaleString('en-IN')+' customer reviews'),
          h('div',{class:'rev-wrap'},
            h('div',{class:'rev-sum'},
              h('div',{class:'rev-big'},p.rating,h('small',{},' / 5')),
              h('div',{},starRow(p.rating,null,{compact:true})),
              h('div',{class:'rev-total'},'Based on '+p.reviews.toLocaleString('en-IN')+' verified purchases'),
              h('div',{class:'bars'}, dist.map(d=>
                h('div',{class:'bar-row'}, h('span',{},d.star+'★'), h('div',{class:'bar'},h('div',{class:'bar-fill',style:{width:Math.round(d.count/p.reviews*100)+'%'}})), h('span',{},d.count.toLocaleString('en-IN'))))),
              h('div',{style:{fontSize:'11.5px',color:'var(--ink-3)',marginTop:'12px'}},'Demo reviews for showcase')),
            h('div',{}, revList, revForm))),
        related.length?h('div',{}, h('div',{class:'sec-kicker'},'You may also like'), h('h2',{class:'sec-title',style:{fontSize:'26px'}},'Pairs well with'),
          h('div',{class:'grid-prod',style:{marginTop:'18px'}}, related.slice(0,4).map(x=>productCard(x)))):null)),
    jsonLd(p));
  initReveal(view);
}
function agoDays(d){
  if(d===0) return 'Today';
  if(d<7) return d+' day'+(d===1?'':'s')+' ago';
  if(d<30) return Math.round(d/7)+' week'+(Math.round(d/7)===1?'':'s')+' ago';
  return Math.round(d/30)+' month'+(Math.round(d/30)===1?'':'s')+' ago';
}
function jsonLd(p){
  return h('script',{type:'application/ld+json'}, JSON.stringify({
    '@context':'https://schema.org','@type':'Product','name':p.name,'brand':{'@type':'Brand','name':p.brand},
    'description':p.desc,'image':'img/'+p.img+'.jpg',
    'offers':{'@type':'Offer','priceCurrency':'INR','price':p.price,'availability':'https://schema.org/InStock'},
    'aggregateRating':{'@type':'AggregateRating','ratingValue':p.rating,'reviewCount':p.reviews}
  }));
}

/* ============================ CHECKOUT ============================ */
const co = { step:1, addr:{}, delivery:'standard', payment:'upi', placed:null };
const PAY_LABEL = { upi:'UPI', card:'Card', netbanking:'NetBanking', cod:'Cash on Delivery' };

function renderCheckout(view){
  if(co.placed){ renderSuccess(view); return; }
  if(state.cart.size===0){
    view.textContent='';
    view.append(h('div',{class:'page-wrap'}, emptyState('Your cart is empty','Add something lovely before checking out.','#/shop','Browse products')));
    return;
  }
  view.textContent='';
  const totals = cartTotals();
  const steps = ['Address','Delivery','Payment'];
  const stepBar = h('div',{class:'steps'}, steps.map((s,i)=>{
    const n=i+1;
    return h('span',{class:'step'+(n===co.step?' on':n<co.step?' done':'')},
      h('span',{class:'step-dot'}, n<co.step?'✓':n),
      h('span',{class:'lbl'},s), i<2?h('span',{class:'step-arrow'},'—'):null);
  }).flat());

  const card = h('div',{class:'co-card'});
  if(co.step===1) stepAddress(card);
  if(co.step===2) stepDelivery(card);
  if(co.step===3) stepPayment(card);

  view.append(
    h('div',{class:'page-wrap'},
      h('nav',{class:'crumbs','aria-label':'Breadcrumb'}, h('a',{href:'#/'},'Home'),h('span',{class:'sep'},'›'),h('a',{href:'#/shop'},'Shop'),h('span',{class:'sep'},'›'),h('span',{},'Checkout')),
      h('h1',{class:'sec-title',style:{margin:'0 0 16px'}},'Secure Checkout')),
    h('div',{class:'co-grid'},
      h('div',{}, stepBar, card,
        h('div',{class:'note-strip'}, svgIcon(ICONS.shield,16), h('span',{},'This is a ',h('b',{},'demo checkout'),' — no real payment is processed and no card data is stored. Connect Razorpay/PayU later (see the deployment guide).'))),
      summaryBox(totals)));
}
function summaryBox(totals){
  const items = h('div',{class:'sum-items'});
  for(const [id,q] of state.cart){ const p=productById(id); if(!p)continue;
    items.append(h('div',{class:'sum-item'},
      prodImg(p,''), h('span',{}, p.name.slice(0,34)+(p.name.length>34?'…':''), h('span',{class:'q'},' × '+q)),
      h('span',{class:'p'},fmt(p.price*q)))); }
  const c = state.coupon && COUPONS[state.coupon.code];
  const applied = c && totals.codeOk;
  const couponInput = h('input',{type:'text',placeholder:'Coupon code','aria-label':'Coupon code',maxlength:'12'});
  const couponRow = applied
    ? h('div',{class:'coupon-applied'}, h('span',{},'✓ ',state.coupon.code,' applied — ',c.label), h('button',{onclick:()=>{ state.coupon=null; store.del('nmls_coupon'); route(); }},'Remove'))
    : h('div',{class:'coupon-row'}, couponInput, h('button',{class:'btn btn-ghost btn-sm',onclick:()=>{
        const code = couponInput.value.trim().toUpperCase();
        if(!COUPONS[code]){ toast('Invalid coupon','',true); return; }
        state.coupon = {code}; store.set('nmls_coupon', state.coupon); toast('Coupon '+code+' applied 🎉'); route();
      }},'Apply'));

  return h('aside',{class:'sum-box'},
    h('h2',{style:{fontFamily:'var(--serif)',fontSize:'22px',color:'var(--maroon-2)',margin:'0 0 14px'}},'Order Summary'),
    items, couponRow,
    h('div',{class:'sum-row'}, h('span',{},'Subtotal'), h('span',{},fmt(totals.sub))),
    applied&&totals.discount>0?h('div',{class:'sum-row'}, h('span',{},'Coupon discount'), h('span',{class:'cut'},'− '+fmt(totals.discount))):null,
    h('div',{class:'sum-row'}, h('span',{},'Delivery'), totals.ship===0?h('span',{class:'free'},'FREE'):h('span',{},fmt(totals.ship))),
    h('div',{class:'sum-row total'}, h('span',{},'Total'), h('b',{},fmt(totals.total))),
    h('div',{style:{fontSize:'12px',color:'var(--ink-3)',marginTop:'8px'}},'Try: WELCOME10 · LOKHI50 · FREESHIP'));
}

/* --- step 1: address --- */
function fieldErr(input, msg){
  const err = input.closest('.field')?.querySelector('.err-msg') || input.parentElement.querySelector('.err-msg');
  input.classList.add('bad');
  if(err){ err.textContent = msg; err.classList.add('show'); }
}
function clearErrs(form){ $$('.err-msg',form).forEach(e=>e.classList.remove('show')); $$('.input',form).forEach(i=>i.classList.remove('bad')); }
function stepAddress(card){
  const a = co.addr;
  const form = h('form',{onsubmit:(e)=>{
    e.preventDefault(); clearErrs(form);
    const f = e.target; let ok = true;
    const need = (inp, valid, msg)=>{ if(!valid){ fieldErr(inp, msg); ok=false; } };
    const el=n=>f.elements[n];
    const name=el('fn').value.trim(), phone=el('ph').value.replace(/\s/g,''), email=el('em').value.trim(),
          pin=el('pn').value.trim(), line=el('ad').value.trim(), city=el('ct').value.trim(), st=el('st').value;
    need(el('fn'), name.length>=2 && name.length<=60 && /^[a-zA-Z .'.]+$/.test(name), 'Enter your full name (letters only)');
    need(el('ph'), /^[6-9]\d{9}$/.test(phone), 'Enter a valid 10-digit Indian mobile');
    need(el('em'), /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email), 'Enter a valid email for order updates');
    need(el('pn'), /^[1-9]\d{5}$/.test(pin), 'Enter a valid 6-digit pincode');
    need(el('ad'), line.length>=8 && line.length<=160, 'Enter your complete address (house, street, landmark)');
    need(el('ct'), city.length>=2 && city.length<=40, 'Enter your town / city');
    need(el('st'), !!st, 'Select your state');
    if(!ok){ toast('Please fix the highlighted fields','',true); return; }
    Object.assign(co.addr, { name, phone, email, pin, line, city, st });
    co.step = 2; route();
  }},
    h('h2',{class:'co-title'},'Where should we deliver?'),
    h('div',{class:'form-grid'},
      h('div',{class:'field'}, h('label',{class:'label'},'Full name'), h('input',{class:'input',name:'fn',maxlength:'60',autocomplete:'name',value:a.name||'',placeholder:'Recipient name'}), h('div',{class:'err-msg'})),
      h('div',{class:'field'}, h('label',{class:'label'},'Mobile number'), h('input',{class:'input',name:'ph',maxlength:'10',inputmode:'numeric',autocomplete:'tel',value:a.phone||'',placeholder:'10-digit mobile'}), h('div',{class:'err-msg'}))),
    h('div',{class:'field'}, h('label',{class:'label'},'Email'), h('input',{class:'input',name:'em',maxlength:'80',type:'email',autocomplete:'email',value:a.email||'',placeholder:'For order updates'}), h('div',{class:'err-msg'})),
    h('div',{class:'field'}, h('label',{class:'label'},'Pincode'), h('input',{class:'input',name:'pn',maxlength:'6',inputmode:'numeric',autocomplete:'postal-code',value:a.pin||'',placeholder:'6-digit pincode'}), h('div',{class:'err-msg'})),
    h('div',{class:'field'}, h('label',{class:'label'},'Address (house no., street, landmark)'), h('textarea',{class:'input',name:'ad',maxlength:'160',autocomplete:'street-address',placeholder:'Flat / House no., Street, Area, Landmark'}, a.line||''), h('div',{class:'err-msg'})),
    h('div',{class:'form-grid'},
      h('div',{class:'field'}, h('label',{class:'label'},'Town / City'), h('input',{class:'input',name:'ct',maxlength:'40',value:a.city||'',placeholder:'Town or city'}), h('div',{class:'err-msg'})),
      h('div',{class:'field'}, h('label',{class:'label'},'State'), h('select',{class:'input',name:'st'}, h('option',{value:''},'Select state'), INDIAN_STATES.map(s=>h('option',{value:s,selected:a.st===s},s))), h('div',{class:'err-msg'}))),
    h('div',{style:{display:'flex',gap:'12px',marginTop:'6px'}},
      h('button',{class:'btn btn-primary',type:'submit'},'Continue to Delivery →'),
      h('a',{class:'btn btn-ghost',href:'#/shop'},'Keep shopping')));
  card.append(form);
}

/* --- step 2: delivery --- */
function stepDelivery(card){
  const est = deliverEstimate(co.addr.pin);
  const opts = [
    { id:'standard', t:'Standard Delivery', d:est.days+' · '+est.via, price: cartSubtotal()>=CONFIG.freeShipAbove?0:CONFIG.shipFee },
    { id:'express',  t:'Express Delivery',  d:'1–3 days · priority partner (metro & major towns)', price:CONFIG.expressFee },
    { id:'post',     t:'India Post Registered', d:'4–9 days · reaches the remotest pincodes, very reliable', price:0 },
  ];
  card.append(
    h('h2',{class:'co-title'},'How fast do you need it?'),
    ...opts.map(o=> h('label',{class:'dlv-opt'+(co.delivery===o.id?' on':'')},
      h('input',{type:'radio',name:'dlv',checked:co.delivery===o.id,onchange:()=>{co.delivery=o.id;route();}}),
      h('span',{}, h('b',{},o.t), h('small',{},o.d)),
      h('span',{class:'dlv-price'}, o.price===0?'FREE':fmt(o.price))),
    h('div',{class:'note-strip'}, svgIcon(ICONS.pin,16), h('span',{},'Delivering to: ', h('b',{},co.addr.name),' · ',co.addr.line.slice(0,40),'…, ',co.addr.city,' — ',co.addr.pin, ' ', h('a',{href:'#',onclick:(e)=>{e.preventDefault();co.step=1;route();}},'(edit)')))),
    h('div',{style:{display:'flex',gap:'12px',marginTop:'18px'}},
      h('button',{class:'btn btn-primary',onclick:()=>{co.step=3;route();}},'Continue to Payment →'),
      h('button',{class:'btn btn-ghost',onclick:()=>{co.step=1;route();}},'← Back')));
}

/* --- step 3: payment --- */
function stepPayment(card){
  const wrap = h('div',{id:'payExtra'});
  const methods = [
    { id:'upi', t:'UPI — GPay / PhonePe / Paytm', d:'Pay by UPI app · instant confirmation' },
    { id:'card', t:'Credit / Debit Card', d:'Visa, Mastercard, RuPay — demo only, nothing is charged' },
    { id:'netbanking', t:'NetBanking', d:'All major Indian banks' },
    { id:'cod', t:'Cash on Delivery', d:'Pay in cash when your order arrives · no extra fee' },
  ];
  function paintExtra(){
    wrap.textContent='';
    if(co.payment==='upi') wrap.append(h('div',{class:'pay-extra'},
      h('div',{class:'field',style:{margin:'0'}}, h('label',{class:'label'},'Your UPI id'), h('input',{class:'input',id:'upiId',maxlength:'40',placeholder:'name@okbank'}),
      h('div',{class:'err-msg'})),
      h('div',{style:{fontSize:'12.5px',color:'var(--ink-3)'}},'Demo: scan-and-pay instructions would appear here in production. Store UPI: ',h('b',{},CONFIG.upiId))));
    if(co.payment==='card'){
      const num = h('input',{class:'input',id:'ccNum',maxlength:'19',inputmode:'numeric',placeholder:'1234 5678 9012 3456'});
      num.addEventListener('input',()=>{ num.value = num.value.replace(/\D/g,'').slice(0,16).replace(/(\d{4})(?=\d)/g,'$1 '); });
      const exp = h('input',{class:'input',id:'ccExp',maxlength:'5',placeholder:'MM/YY'});
      exp.addEventListener('input',()=>{ let v=exp.value.replace(/\D/g,'').slice(0,4); exp.value = v.length>2? v.slice(0,2)+'/'+v.slice(2):v; });
      wrap.append(h('div',{class:'pay-extra'},
        h('div',{class:'field',style:{margin:'0 0 14px'}}, h('label',{class:'label'},'Card number'), num, h('div',{class:'err-msg'})),
        h('div',{class:'form-grid'},
          h('div',{class:'field',style:{margin:'0'}}, h('label',{class:'label'},'Expiry'), exp, h('div',{class:'err-msg'})),
          h('div',{class:'field',style:{margin:'0'}}, h('label',{class:'label'},'CVV'), h('input',{class:'input',id:'ccCvv',maxlength:'3',inputmode:'numeric',type:'password',placeholder:'•••'}), h('div',{class:'err-msg'})))));
    }
    if(co.payment==='netbanking') wrap.append(h('div',{class:'pay-extra'},
      h('div',{class:'field',style:{margin:'0'}}, h('label',{class:'label'},'Choose bank'),
      h('select',{class:'input',id:'nbBank'}, ['State Bank of India','HDFC Bank','ICICI Bank','Axis Bank','Punjab National Bank','Bank of Baroda','Union Bank','Canara Bank'].map(b=>h('option',{},b))))));
    if(co.payment==='cod') wrap.append(h('div',{class:'pay-extra',style:{fontSize:'13.5px',color:'var(--ink-2)'}},
      h('b',{},'Pay ',fmt(cartTotals().total),' in cash'),' when your parcel arrives. Please keep exact change ready if possible. Our delivery partner will call before arriving.'));
  }
  paintExtra();
  card.append(
    h('h2',{class:'co-title'},'Choose your payment method'),
    ...methods.map(m=> h('label',{class:'pay-opt'+(co.payment===m.id?' on':'')},
      h('input',{type:'radio',name:'pay',checked:co.payment===m.id,onchange:(e)=>{co.payment=m.id;$$('.pay-opt',card).forEach(x=>x.classList.remove('on'));e.currentTarget.closest('.pay-opt').classList.add('on');paintExtra();}}),
      h('span',{}, h('b',{},m.t), h('small',{},m.d)))),
    wrap,
    h('div',{style:{display:'flex',gap:'12px',marginTop:'18px',flexWrap:'wrap'}},
      h('button',{class:'btn btn-primary',onclick:placeOrder}, h('span',{html:'🔒'}),' Place Order · '+fmt(cartTotals().total)),
      h('button',{class:'btn btn-ghost',onclick:()=>{co.step=2;route();}},'← Back')));
}
function placeOrder(){
  if(co.payment==='upi'){
    const upi = $('#upiId');
    if(!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upi.value.trim())){ fieldErr(upi,'Enter a valid UPI id e.g. name@okhdfcbank'); return; }
  }
  if(co.payment==='card'){
    const num=$('#ccNum'), exp=$('#ccExp'), cvv=$('#ccCvv');
    if(!/^\d{4} \d{4} \d{4} \d{4}$/.test(num.value)){ fieldErr(num,'Enter the 16-digit card number'); return; }
    const m = exp.value.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
    if(!m || +(20+m[2])<(new Date().getFullYear()) || (+(20+m[2])===new Date().getFullYear() && +m[1]<new Date().getMonth()+1)){ fieldErr(exp,'Expiry must be a future MM/YY'); return; }
    if(!/^\d{3}$/.test(cvv.value)){ fieldErr(cvv,'3-digit CVV'); return; }
  }
  if(co.payment==='netbanking' && !$('#nbBank').value){ toast('Please choose your bank','',true); return; }

  const totals = cartTotals();
  const oid = 'NLS-'+Date.now().toString(36).toUpperCase().slice(-4)+Math.floor(Math.random()*90+10);
  const order = {
    id: oid, at: Date.now(), status:'Processing',
    items: [...state.cart].map(([id,q])=>{ const p=productById(id); return {id, qty:q, name:p.name, price:p.price, img:p.img}; }),
    totals, addr: co.addr, payment: PAY_LABEL[co.payment], delivery: co.delivery,
    etaDays: co.delivery==='express'?'1–3':co.delivery==='post'?'4–9':'3–6',
  };
  const orders = state.orders; orders.unshift(order); store.set('nmls_orders', orders.slice(0,30));
  state.cart.clear(); saveCart(); state.coupon=null; store.del('nmls_coupon'); renderCartUI();
  co.placed = order; route();
  if(CONFIG.whatsapp){
    const wa = $('#whFab');
    wa.href = 'https://wa.me/'+CONFIG.whatsapp.replace(/\D/g,'')+'?text='+encodeURIComponent('Namaste! I just placed order '+oid+' ('+fmt(totals.total)+') on your website.');
  }
}
function renderSuccess(view){
  const o = co.placed;
  view.textContent='';
  const eta = new Date(Date.now() + (o.delivery==='express'?2:5)*864e5).toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'});
  view.append(h('div',{class:'page-wrap'},
    h('div',{class:'success'},
      h('div',{class:'tick'}, svgIcon(ICONS.check,40)),
      h('h1',{class:'sec-title'},'Thank you, ', o.addr.name.split(' ')[0], '!'),
      h('div',{class:'oid'},'Order ',o.id),
      h('p',{class:'success-note'},'Your order is confirmed and being packed with care. A confirmation (demo) would be sent to ',h('b',{},o.addr.email),'. Expected delivery: ',h('b',{},eta),'.')),
    h('div',{class:'co-grid'},
      h('div',{class:'co-card'},
        h('div',{class:'oc-items'}, o.items.map(it=>h('img',{src:'img/'+it.img+'.jpg',alt:it.name,loading:'lazy',onerror:imgFallback(productById(it.id))}))),
        h('div',{class:'oc-meta'},
          h('span',{},'Payment: ',h('b',{},o.payment)),
          h('span',{},'Delivery: ',h('b',{},o.delivery==='express'?'Express':o.delivery==='post'?'India Post':'Standard')),
          h('span',{},'Total: ',h('b',{},fmt(o.totals.total))),
          h('span',{},'To: ',o.addr.city,', ',o.addr.st,' — ',o.addr.pin))),
      h('div',{class:'co-card',style:{textAlign:'center'}},
        h('p',{style:{margin:'0 0 16px',fontSize:'14px',color:'var(--ink-2)'}},'What next?'),
        h('div',{style:{display:'grid',gap:'10px'}},
          h('a',{class:'btn btn-primary',href:'#/orders'},'View / Track Order'),
          h('a',{class:'btn btn-gold',href:'#/shop'},'Continue Shopping'),
          h('button',{class:'btn btn-ghost',onclick:()=>{ co.placed=null; co.step=1; co.addr={}; route(); }},'Done'))))));
}

/* ============================ ORDERS / WISHLIST / ABOUT ============================ */
function renderOrders(view){
  view.textContent='';
  const orders = state.orders;
  view.append(h('div',{class:'page-wrap'},
    h('nav',{class:'crumbs'}, h('a',{href:'#/'},'Home'),h('span',{class:'sep'},'›'),h('span',{},'Orders')),
    h('h1',{class:'sec-title',style:{margin:'0 0 6px'}},'Your Orders'),
    h('p',{class:'sec-sub',style:{margin:'0 0 22px'}},'Orders you place in this browser appear here (demo tracking).')));
  if(!orders.length){
    view.append(h('div',{class:'page-wrap'}, emptyState('No orders yet','When you place an order it will show up here with live status.','#/shop','Start shopping')));
    return;
  }
  const list = h('div',{class:'page-wrap'});
  orders.forEach(o=>{
    const days = Math.floor((Date.now()-o.at)/864e5);
    list.append(h('div',{class:'order-card'},
      h('div',{class:'oc-head'},
        h('span',{}, h('span',{class:'oid-s'},o.id), h('span',{style:{color:'var(--ink-3)',fontSize:'12.5px',marginLeft:'10px'}}, new Date(o.at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}))),
        h('span',{class:'status'+(days>7?' delivered':'')}, days>7?'Delivered':'Processing')),
      h('div',{class:'oc-items'}, o.items.map(it=>h('a',{href:'#/product/'+it.id,title:it.name}, h('img',{src:'img/'+it.img+'.jpg',alt:it.name,loading:'lazy',onerror:imgFallback(it)})))),
      h('div',{class:'oc-meta'},
        h('span',{},'ETA: ',o.etaDays,' days from order'),
        h('span',{},'Payment: ',o.payment),
        h('span',{},'Total: ',h('b',{},fmt(o.totals.total))),
        h('span',{},'Ship to: ',o.addr.city,', ',o.addr.st,' — ',o.addr.pin))));
  });
  view.append(list);
}
function renderWishlist(view){
  view.textContent='';
  const items = [...state.wishlist].map(productById).filter(Boolean);
  view.append(h('div',{class:'page-wrap'},
    h('nav',{class:'crumbs'}, h('a',{href:'#/'},'Home'),h('span',{class:'sep'},'›'),h('span',{},'Wishlist')),
    h('h1',{class:'sec-title',style:{margin:'0 0 6px'}},'Your Wishlist'),
    h('p',{class:'sec-sub',style:{margin:'0 0 22px'}},items.length?items.length+' saved item'+(items.length===1?'':'s'):'Tap the ♥ on any product to save it here — it stays even after you close the browser.')));
  if(!items.length){ view.append(h('div',{class:'page-wrap'}, emptyState('Nothing saved yet','Start a wishlist — it makes gift planning much easier.','#/shop','Find something lovely'))); return; }
  view.append(h('div',{class:'page-wrap'}, h('div',{class:'grid-prod'}, items.map(p=>productCard(p)))));
}
function renderAbout(view){
  view.textContent='';
  view.append(h('div',{class:'page-wrap'},
    h('nav',{class:'crumbs'}, h('a',{href:'#/'},'Home'),h('span',{class:'sep'},'›'),h('span',{},'About')),
    h('div',{class:'about-grid'},
      h('div',{},
        h('div',{class:'sec-kicker'},'Our story'),
        h('h1',{class:'sec-title'},'A counter your family has trusted since ',CONFIG.since),
        h('p',{class:'desc',style:{marginBottom:'14px'}},CONFIG.storeName,' began as a small glass-counter shop — one shelf of bangles, one of flasks, and a lot of goodwill. Three decades later, the counter is still busy, but now we pack the same trust into parcels that travel to every corner of India.'),
        h('p',{class:'desc',style:{marginBottom:'22px'}},'We stock what families actually ask for: imitation and oxidised jewellery for festivals and weddings, kitchen essentials from brands like Milton, Prestige and La Opala, appliances from Bajaj and Agaro, school supplies, toys, cosmetics and gifts. If your town is hard to reach, that is our speciality — we ship via Delhivery, BlueDart and India Post right up to the last mile.'),
        h('div',{class:'stats',style:{marginBottom:'26px'}},
          h('div',{class:'stat reveal'},h('b',{},'27K+'),h('span',{},'Orders delivered')),
          h('div',{class:'stat reveal'},h('b',{},'19.5K'),h('span',{},'Pincodes served')),
          h('div',{class:'stat reveal'},h('b',{},'4.8★'),h('span',{},'Customer rating')),
          h('div',{class:'stat reveal'},h('b',{},'27 yrs'),h('span',{},'In business'))),
        h('a',{class:'btn btn-primary',href:'#/shop'},'Browse the store')),
      h('figure',{class:'map-ph reveal',style:{margin:'0'}},
        h('div',{style:{aspectRatio:'4/3',background:'linear-gradient(135deg,#f4edde,#eadfc6)',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'inherit'}},
          h('div',{style:{textAlign:'center',color:'var(--ink-2)'}},
            svgIcon(ICONS.pin,44), h('div',{style:{fontFamily:'var(--serif)',fontSize:'19px',marginTop:'8px',color:'var(--maroon-2)'}},CONFIG.storeName),
            h('div',{style:{fontSize:'13px'}},CONFIG.address)))))));
}
function renderContact(view){
  view.textContent='';
  const form = h('form',{class:'co-card',onsubmit:(e)=>{
    e.preventDefault();
    const msg = e.target.elements.msg.value.trim().slice(0,500), nm = e.target.elements.nm.value.trim().slice(0,40);
    if(msg.length<10||nm.length<2){ toast('Please fill your name and message','',true); return; }
    const inbox = store.get('nmls_inbox', []); inbox.unshift({nm,msg,at:Date.now()}); store.set('nmls_inbox', inbox.slice(0,20));
    e.target.reset(); toast('Message received!','We usually reply within a day. (Demo — messages stay in this browser)');
  }},
    h('h2',{class:'co-title'},'Write to us'),
    h('div',{class:'field'}, h('label',{class:'label'},'Your name'), h('input',{class:'input',name:'nm',maxlength:'40',required:true,placeholder:'Name'})),
    h('div',{class:'field'}, h('label',{class:'label'},'Message'), h('textarea',{class:'input',name:'msg',maxlength:'500',required:true,placeholder:'How can we help?'})),
    h('button',{class:'btn btn-primary',type:'submit'},'Send message'));
  view.append(h('div',{class:'page-wrap'},
    h('nav',{class:'crumbs'}, h('a',{href:'#/'},'Home'),h('span',{class:'sep'},'›'),h('span',{},'Contact')),
    h('h1',{class:'sec-title',style:{margin:'0 0 6px'}},'Contact & Store Visit'),
    h('p',{class:'sec-sub',style:{margin:'0 0 24px'}},'Call, message or walk in — we answer like a neighbourhood shop, not a call centre.'),
    h('div',{class:'contact-grid'},
      h('div',{class:'co-card'},
        h('div',{class:'offers'},
          h('div',{class:'offer'}, svgIcon(ICONS.pin,17), h('span',{},h('b',{},'Store: '),CONFIG.address)),
          h('div',{class:'offer'}, svgIcon(ICONS.cash,17), h('span',{},h('b',{},'Phone: '),CONFIG.phone)),
          h('div',{class:'offer'}, svgIcon(ICONS.shield,17), h('span',{},h('b',{},'Email: '),CONFIG.email)),
          h('div',{class:'offer'}, svgIcon(ICONS.truck,17), h('span',{},h('b',{},'Hours: '),CONFIG.hours))),
        h('div',{class:'note-strip'}, svgIcon(ICONS.box,16), h('span',{},'Bulk or corporate gifting? Ask for our wholesale counter rates on hampers and dinner sets.'))),
      form)));
}
function renderNotFound(view){
  view.textContent='';
  view.append(h('div',{class:'page-wrap'}, emptyState('Page not found','That aisle does not exist in our store — yet.','#/shop','Back to shopping')));
}

/* ---------- register routes ---------- */
registerRoutes({
  home: renderHome,
  shop: renderShop,
  product: renderProduct,
  checkout: renderCheckout,
  orders: renderOrders,
  wishlist: renderWishlist,
  about: renderAbout,
  contact: renderContact,
  notfound: renderNotFound,
});
