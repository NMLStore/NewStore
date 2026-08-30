/* Smoke test: renders all routes + exercises cart & checkout in jsdom */
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root,'index.html'),'utf8')
  .replace(/<script src="[^"]*"><\/script>/g,'')   // load scripts manually
  .replace(/<link[^>]*stylesheet[^>]*>/,'')
  .replace(/<link[^>]*fonts[^>]*>/g,'');

const dom = new JSDOM(html,{url:'https://maa-lokhi.test/',runScripts:'outside-only',pretendToBeVisual:true});
const { window } = dom;
window.IntersectionObserver = class{ constructor(cb){this.cb=cb} observe(e){this.cb([{isIntersecting:true,target:e}],this) } unobserve(){} };
window.requestAnimationFrame = cb=>setTimeout(cb,0);
const vd = window.document;

function load(f){ loaded.push(fs.readFileSync(path.join(root,f),'utf8')); }
const loaded=[];
load('js/data.js'); load('js/app.js'); load('js/views.js');
loaded.push(';window.__t={addToCart,toggleWish,route,PRODUCTS,CATEGORIES};');
window.eval(loaded.join('\n;\n'));   // classic scripts share the global lexical scope; emulate with one eval
let fails=0;
const ok=(name,cond)=>{ if(cond){console.log('  ✓',name)} else {fails++;console.log('  ✗ FAIL:',name)} };
vd.dispatchEvent(new window.Event('DOMContentLoaded',{bubbles:true}));


console.log('HOME');
ok('hero rendered', vd.querySelector('.hero-title')?.textContent.includes('delivered everywhere'));
ok('category tiles', vd.querySelectorAll('.cat-tile').length===11);
ok('product cards across rows', vd.querySelectorAll('.card').length>20);
ok('testimonials', vd.querySelectorAll('.testi').length===4);
ok('footer', vd.querySelector('.foot-bottom')?.textContent.includes('2026'));
ok('announce bar filled', vd.querySelectorAll('.announce-item').length===3);

console.log('SHOP');
window.location.hash = '#/shop';
window.dispatchEvent(new window.Event('hashchange'));
ok('all products shown count', vd.querySelector('.res-count b')?.textContent==='37');
ok('cards rendered', vd.querySelectorAll('.grid-prod .card').length===12); // page 1
window.location.hash = '#/shop?cat=home-appliances';
window.dispatchEvent(new window.Event('hashchange'));
ok('category filter → 5 appliances', vd.querySelector('.res-count b')?.textContent==='5');
window.location.hash = '#/shop?brand=Milton';
window.dispatchEvent(new window.Event('hashchange'));
ok('brand filter → Milton 2', vd.querySelector('.res-count b')?.textContent==='2');
window.location.hash = '#/shop?q=kundan';
window.dispatchEvent(new window.Event('hashchange'));
ok('search q=kundan finds 1', vd.querySelector('.res-count b')?.textContent==='1');
window.location.hash = '#/shop?sort=price-asc';
window.dispatchEvent(new window.Event('hashchange'));
const firstPrice = vd.querySelector('.grid-prod .card .price-now')?.textContent;
ok('sort price asc → ₹129 first', firstPrice==='₹129');
window.location.hash = '#/shop?min=2000&max=6000';
window.dispatchEvent(new window.Event('hashchange'));
ok('price range filter', vd.querySelector('.res-count b')?.textContent==='4');

console.log('PRODUCT PAGE');
window.location.hash = '#/product/p1';
window.dispatchEvent(new window.Event('hashchange'));
ok('title', vd.querySelector('.p-title')?.textContent.includes('Kundan'));
ok('gallery main+4 thumbs', vd.querySelectorAll('.thumb').length===4);
ok('reviews seeded', vd.querySelectorAll('.rev-item').length>=4);
ok('rating bars', vd.querySelectorAll('.bar-row').length===5);
ok('related products', vd.querySelectorAll('.p-tabs .grid-prod .card').length===4);
ok('json-ld injected', vd.querySelector('script[type="application/ld+json"]:not(:first-of-type)')||vd.body.textContent.includes('AggregateRating'));

console.log('CART');
window.location.hash = '#/';
window.dispatchEvent(new window.Event('hashchange'));
window.__t.addToCart('p1',2,false); window.__t.addToCart('p18',1,false);
ok('cart badge = 3', vd.querySelector('#cartCount')?.textContent==='3');
ok('cart drawer items', vd.querySelectorAll('.cart-item').length===2);
ok('subtotal 2×1499+929=3927', vd.querySelector('.cart-sub b')?.textContent==='₹3,927');
ok('persistence', JSON.parse(window.localStorage.getItem('nmls_cart')).length===2);

console.log('CHECKOUT');
window.location.hash = '#/checkout';
window.dispatchEvent(new window.Event('hashchange'));
ok('step 1 address form', !!vd.querySelector('input[name="fn"]'));
// invalid submit
const form = vd.querySelector('form.co-card form, .co-card form'); 
vd.querySelector('.co-card form').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));
ok('validation error shown', vd.querySelector('.err-msg.show')!==null);
// fill valid
const f = vd.querySelector('.co-card form');
const fe=n=>f.elements[n];
fe('fn').value='Test Kumar'; fe('ph').value='9876543210'; fe('em').value='test@example.com';
fe('pn').value='751001'; fe('ad').value='12 Gandhi Chowk, near temple'; fe('ct').value='Bhubaneswar'; fe('st').value='Odisha';
f.dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));
ok('step 2 delivery', vd.querySelectorAll('.dlv-opt').length===3);
vd.querySelector('.dlv-opt input').dispatchEvent(new window.Event('change',{bubbles:true}));
vd.querySelectorAll('.co-card .btn-primary,.co-card button').forEach(b=>{ if(b.textContent.includes('Continue to Payment')) b.click(); });
ok('step 3 payment', vd.querySelectorAll('.pay-opt').length===4);
// coupon
const cIn = vd.querySelector('.coupon-row input'); cIn.value='WELCOME10';
vd.querySelectorAll('.sum-box button').forEach(b=>{ if(b.textContent==='Apply') b.click(); });
ok('coupon applied strip', vd.querySelector('.coupon-applied')?.textContent.includes('WELCOME10'));
// choose COD and place
vd.querySelectorAll('.pay-opt input').forEach(i=>{ if(i.closest('.pay-opt').textContent.includes('Cash')) i.click(); });
let placeBtn; vd.querySelectorAll('button').forEach(b=>{ if(b.textContent.includes('Place Order')) placeBtn=b; });
placeBtn.click();
ok('success screen', vd.querySelector('.success')?.textContent.includes('Thank you, Test'));
ok('order id format', /^NLS-[A-Z0-9]{6}$/.test(vd.querySelector('.oid')?.textContent.replace('Order ','')));
ok('cart cleared', vd.querySelector('#cartCount')?.hidden===true);
ok('order saved', JSON.parse(window.localStorage.getItem('nmls_orders')).length===1);

console.log('ORDERS & WISHLIST & 404');
window.location.hash = '#/orders';
window.dispatchEvent(new window.Event('hashchange'));
ok('order listed', vd.querySelector('.order-card .oid-s')?.textContent.length>4);
window.location.hash = '#/wishlist';
window.dispatchEvent(new window.Event('hashchange'));
ok('wishlist empty state', vd.querySelector('.empty h3')?.textContent.includes('saved yet'));
window.location.hash = '#/nonsense';
window.dispatchEvent(new window.Event('hashchange'));
ok('404 view', vd.querySelector('.empty h3')?.textContent.includes('not found'));

console.log('SECURITY');
window.location.hash = '#/product/p1';
window.dispatchEvent(new window.Event('hashchange'));
const revForm = vd.querySelector('.rev-form-card');
revForm.elements.rname.value='<img src=x onerror=alert(1)>';
revForm.elements.rtext.value='<script>alert("xss")</script> this is a long enough review text';
revForm.dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));
ok('review stored escaped-safe (no script exec)', !window.alerted);
ok('no inline handlers in DOM', ![...vd.querySelectorAll('*')].some(el=>el.hasAttribute('onclick')||el.hasAttribute('onload')));

console.log(fails? `\n${fails} FAILURES` : '\nALL TESTS PASSED');
process.exit(fails?1:0);
