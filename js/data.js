/* ============================================================
   NEW MAA LOKHI STORES — catalogue & demo data
   Edit this file to manage products, prices, stock & store info.
   ============================================================ */
'use strict';

/* ---------- STORE CONFIG — replace with your real details ---------- */
const CONFIG = {
  storeName: 'New Maa Lokhi Stores',
  tagline: 'Your trusted neighbourhood store — now serving all of India',
  since: 1998,
  phone: '+91 90000 00000',          // ← replace with your phone number
  whatsapp: '',                       // e.g. '919XXXXXXXXX' (country code + number, no +) → shows a WhatsApp order button
  email: 'care@maalokhistores.example', // ← replace with your email
  address: 'Main Market Road, Near Bus Stand, Your Town, State – 751001',
  hours: 'Open daily · 9:00 AM – 9:00 PM',
  freeShipAbove: 499,
  shipFee: 49,
  expressFee: 99,
  upiId: 'maalokhistores@upi',        // ← your UPI id (shown at checkout)
};

/* ---------- categories ---------- */
const CATEGORIES = [
  { id:'imitation-jewellery', label:'Imitation Jewellery', sub:'Kundan · Pearl · Gold-plated', img:'p1'  },
  { id:'oxidised-jewellery',  label:'Oxidised Jewellery',  sub:'Tribal · Silver-tone',        img:'p6'  },
  { id:'western-jewellery',   label:'Western Jewellery',   sub:'Minimal · Everyday',          img:'p9'  },
  { id:'bangles',             label:'Bangles & Bracelets', sub:'Lac · Oxidised · CZ',         img:'p11' },
  { id:'home-appliances',     label:'Home Appliances',     sub:'Bajaj · Agaro · Prestige',    img:'p13' },
  { id:'kitchen-dining',      label:'Kitchen & Dining',    sub:'Milton · Cello · Borosil',    img:'p18' },
  { id:'watches-clocks',      label:'Watches & Clocks',    sub:'Analog · Digital · Wall',     img:'p24' },
  { id:'cosmetics',           label:'Beauty & Cosmetics',  sub:'Lips · Eyes · Skincare',      img:'p27' },
  { id:'toys',                label:'Toys & Games',        sub:'Soft toys · RC · Blocks',     img:'p30' },
  { id:'stationery',          label:'Stationery & School', sub:'Bags · Books · Pens',         img:'p33' },
  { id:'gifts',               label:'Gifts & Decor',       sub:'Idols · Hampers',             img:'p36' },
];

/* ---------- brands ---------- */
const BRANDS = ['Milton','Cello','Prestige','Borosil','La Opala','Bajaj','Agaro','Lokhi Creations'];

/* ---------- products ---------- */
/* img: file at img/{img}.jpg · off/stock optional · badge: 'hot'|'new'|'deal' */
const PRODUCTS = [
  { id:'p1',  name:'Kundan Bridal Necklace Set with Earrings', cat:'imitation-jewellery', brand:'Lokhi Creations', price:1499, mrp:2999, rating:4.7, reviews:312, img:'p1',  badge:'hot', stock:14,
    hi:['Hand-set kundan stones with pearl drops','Gold-plated brass base, skin-friendly','Includes matching earrings & maang tikka','Comes in a gift-ready velvet box'],
    desc:'A regal two-layer kundan set inspired by Rajasthani bridal craft. The stones are hand-set in gold-plated foil with freshwater-style pearl hangings, finished with a secure screw lock. Perfect for weddings, receptions and festive evenings.' },
  { id:'p2',  name:'Gold-Plated Jhumka Jhumki Earrings', cat:'imitation-jewellery', brand:'Lokhi Creations', price:399, mrp:799, rating:4.5, reviews:528, img:'p2',  badge:'hot', stock:42,
    hi:['Classic dome jhumka with gold plating','Lightweight — comfortable all day','Anti-tarnish micro-coating','Secure push-back closure'],
    desc:'Everyday festive jhumkas with a silky gold finish and delicate bead fringe. Light enough for long functions, shiny enough for the family album.' },
  { id:'p3',  name:'Pearl & Ruby Choker Necklace Set', cat:'imitation-jewellery', brand:'Lokhi Creations', price:899, mrp:1799, rating:4.6, reviews:204, img:'p3', badge:'deal', stock:20,
    hi:['Layered pearl strands with ruby accents','Adjustable dori closure (13–17 in)','Matching studs included','Tarnish-resistant plating'],
    desc:'A graceful choker that layers lustrous pearls with deep ruby-red stones. The adjustable cord fits comfortably and the set arrives boxed with matching studs.' },
  { id:'p4',  name:'Antique Temple Lakshmi Haar Necklace', cat:'imitation-jewellery', brand:'Lokhi Creations', price:1199, mrp:2499, rating:4.8, reviews:167, img:'p4', stock:9,
    hi:['Traditional South-Indian temple design','Antique gold finish with green kemp stones','Icon Lakshmi pendant centrepiece','Favoured for pooja & classical dance'],
    desc:'A temple haar in antique-finish gold with kemp-green stones, crafted in the tradition of Nagercoil jewellers. Worn for poojas, Bharatanatyam performances and weddings.' },
  { id:'p5',  name:'Meenakari Enamel Hanging Earrings', cat:'imitation-jewellery', brand:'Lokhi Creations', price:449, mrp:899, rating:4.4, reviews:96, img:'p5', badge:'new', stock:33,
    hi:['Hand-enamelled meenakari colours','Lightweight aluminium alloy core','Colour-locked lacquer coat','Adds instant festive colour'],
    desc:'Rajasthani meenakari art in vivid enamel — pink, green and gold swirls that catch the light with every turn of the head.' },

  { id:'p6',  name:'Silver-Tone Oxidised Tribal Necklace', cat:'oxidised-jewellery', brand:'Lokhi Creations', price:349, mrp:699, rating:4.5, reviews:433, img:'p6', badge:'hot', stock:38,
    hi:['Tribal boho design, blackened silver tone','Adjustable black cord with 3-inch extender','Pairs with kurtas, sarees & denim','Nickel-safe alloy'],
    desc:'A bold tribal collar with oxidised silver-tone plates and etched detail. The adjustable cord lets you wear it long with kurtas or snug like a choker.' },
  { id:'p7',  name:'Oxidised Silver Jhumkas — Pair', cat:'oxidised-jewellery', brand:'Lokhi Creations', price:249, mrp:499, rating:4.6, reviews:671, img:'p7', badge:'deal', stock:60,
    hi:['Bestselling everyday jhumkas','Oxidised finish never fades to brassy','Feather-light 9 g per pair','Hand-made tiny ghungroo bells'],
    desc:'Our #1 selling jhumkas — oxidised domes strung with tiny ghungroo bells that chime softly as you move. A wardrobe staple at an easy price.' },
  { id:'p8',  name:'Oxidised Adjustable Rings — Set of 6', cat:'oxidised-jewellery', brand:'Lokhi Creations', price:199, mrp:399, rating:4.3, reviews:289, img:'p8', stock:75,
    hi:['Six stackable designs in one box','Open-band — adjusts to any finger','Mix, stack or gift individually','Reusable kraft gift box'],
    desc:'A curation of six oxidised rings — peacock, coin, coil, band, wrap and tribal — all open-band so they fit every finger. Stack them or split them into gifts.' },

  { id:'p9',  name:'Minimal Gold Curb-Chain Bracelet', cat:'western-jewellery', brand:'Lokhi Creations', price:299, mrp:599, rating:4.4, reviews:152, img:'p9', stock:47,
    hi:['Unisex curb chain, 18K gold tone','Stainless steel core — sweat & water friendly','Lobster clasp with 2 cm extender','Wears well alone or stacked'],
    desc:'A clean, unisex curb-chain bracelet in warm gold-tone stainless steel. Built for daily wear — shower, gym and office included.' },
  { id:'p10', name:'Zircon Crystal Stud Earrings — Pair', cat:'western-jewellery', brand:'Lokhi Creations', price:399, mrp:799, rating:4.5, reviews:210, img:'p10', badge:'new', stock:52,
    hi:['Brilliant-cut white zircon crystals','4-prong sterling-style setting','Hypoallergenic posts','Office-to-evening sparkle'],
    desc:'Diamond-look zircon studs with real fire and sparkle, set on hypoallergenic posts. The one pair that goes with everything.' },

  { id:'p11', name:'Golden Lac Bangles — Set of 24', cat:'bangles', brand:'Lokhi Creations', price:399, mrp:799, rating:4.6, reviews:388, img:'p11', badge:'hot', stock:31,
    hi:['Full haath set — sizes 2.4 to 2.10','Rich lacquer gold with kundan dots','Lightweight, crack-resistant','Velvet-lined box included'],
    desc:'A complete 24-piece lac bangle set in bridal gold, sprinkled with tiny kundan dots. Sized to fill both wrists for festivals and functions.' },
  { id:'p12', name:'CZ Crystal Bangle Bracelet — Pair', cat:'bangles', brand:'Lokhi Creations', price:599, mrp:1199, rating:4.4, reviews:128, img:'p12', stock:26,
    hi:['Pavé-set CZ crystals all round','Hinged with hidden clasp + safety latch','Gold-tone rust-free base','Gift boxed'],
    desc:'Crystal pavé bangles that read far above their price. The hinged design slides on easily and locks with a hidden clasp.' },

  { id:'p13', name:'Bajaj Majesty 750W Mixer Grinder (3 Jars)', cat:'home-appliances', brand:'Bajaj', price:2899, mrp:3995, rating:4.4, reviews:926, img:'p13', badge:'hot', stock:18,
    hi:['750 W motor with overload protection','Stainless steel jars: 1.2 L, 0.8 L & chutney','3-speed rotary switch with pulse','2-year product warranty'],
    desc:'The workhorse of the Indian kitchen. A 750 W motor, three stainless jars and a multi-functional blade system that grinds masala, chutney and batter without straining.' },
  { id:'p14', name:'Bajaj 1.7 L Electric Kettle — Steel Body', cat:'home-appliances', brand:'Bajaj', price:949, mrp:1395, rating:4.5, reviews:1102, img:'p14', badge:'deal', stock:40,
    hi:['Boils 1.7 L in about 5 minutes','Stainless steel body, concealed element','Auto cut-off & dry-boil protection','360° swivel base'],
    desc:'Chai-ready in minutes. The concealed element descales easily and the auto cut-off means you can walk away while it boils.' },
  { id:'p15', name:'Agaro Regency 4.2 L Digital Air Fryer', cat:'home-appliances', brand:'Agaro', price:5499, mrp:8495, rating:4.5, reviews:533, img:'p15', badge:'deal', stock:11,
    hi:['4.2 L family basket, 80–200 °C control','Rapid-air tech — 90% less oil','8 preset menus on touch panel','Dishwasher-safe non-stick basket'],
    desc:'Crispy fries, pakoras and tandoori without a swimming pool of oil. The digital panel remembers your favourite presets and the basket washes clean in a rinse.' },
  { id:'p16', name:'Agaro 1600W Steam Iron with Ceramic Soleplate', cat:'home-appliances', brand:'Agaro', price:1049, mrp:1799, rating:4.3, reviews:291, img:'p16', stock:24,
    hi:['1600 W with vertical steam','Non-stick ceramic soleplate glides','Self-clean + anti-drip system','360° swivel cord'],
    desc:'A smooth-gliding ceramic soleplate with burst steam for stubborn creases — and vertical steam mode that freshens sarees and kurtas on the hanger.' },
  { id:'p17', name:'Prestige PIC 16.0+ Induction Cooktop', cat:'home-appliances', brand:'Prestige', price:2349, mrp:2995, rating:4.6, reviews:782, img:'p17', badge:'hot', stock:16,
    hi:['1900 W with push-button power control','Indian-menu presets (dosa, idli, curry)','Auto shut-off & voltage protection','Energy-efficient — no flame'],
    desc:'Cook without LPG. Indian menu presets handle dosa to curry, the anti-magnetic wall blocks stray radiation, and the glass top wipes clean in one pass.' },

  { id:'p18', name:'Milton Thermosteel Flip-Lid Flask — 1 L', cat:'kitchen-dining', brand:'Milton', price:929, mrp:1245, rating:4.7, reviews:2418, img:'p18', badge:'hot', stock:55,
    hi:['Hot 24 hrs · cold 24 hrs','Double-walled 18/8 stainless steel','One-touch flip lid, leak-proof','BPA-free, interior never retains smell'],
    desc:'The flask every household swears by. Double-walled thermosteel keeps chai steaming through a full day of travel, and the flip lid pours one-handed.' },
  { id:'p19', name:'Cello Hot & Cold Vacuum Steel Bottle — 1 L', cat:'kitchen-dining', brand:'Cello', price:749, mrp:1099, rating:4.5, reviews:1934, img:'p19', stock:48,
    hi:['18 hrs hot · 18 hrs cold','Trendy matte finish, scratch-resistant','Screw lid with carry loop','Sweat-free exterior'],
    desc:'A sleek matte-finish steel bottle that carries easily to office, gym or school. Keeps water icy through summer afternoons.' },
  { id:'p20', name:'Prestige Deluxe Aluminium Pressure Cooker — 3 L', cat:'kitchen-dining', brand:'Prestige', price:1549, mrp:2150, rating:4.6, reviews:1673, img:'p20', stock:22,
    hi:['Induction + gas compatible base','Metallic safety plug & gasket release','Anti-bulge base for long life','Ideal for a family of 3–5'],
    desc:'Dal in minutes, rice in a whistle. The anti-bulge induction base stays flat for years and the safety systems are fail-safe redundant.' },
  { id:'p21', name:'Borosil Glass Food Container Set — 3 Pcs', cat:'kitchen-dining', brand:'Borosil', price:749, mrp:1249, rating:4.4, reviews:655, img:'p21', stock:35,
    hi:['Borosilicate glass — oven & microwave safe','Airtight lock-lids, leak-proof','Freezer to oven (-40 °C to 300 °C)','Stain & odour resistant'],
    desc:'Meal prep that looks as good as it stores. Borosilicate glass handles oven heat and freezer cold, and the lids lock liquids in.' },
  { id:'p22', name:'La Opala Diva Dinner Set — 20 Pieces', cat:'kitchen-dining', brand:'La Opala', price:2999, mrp:4200, rating:4.7, reviews:894, img:'p22', badge:'new', stock:13,
    hi:['Opalware — bone-china like whiteness','Chip & scratch resistant','Microwave & dishwasher safe','Serves 6: plates, katoris & side plates'],
    desc:'Feast-worthy opalware with a soft floral border. Lighter than ceramic, whiter than porcelain, and tough enough for daily family dining.' },
  { id:'p23', name:'Milton Insulated Tiffin Box — 3 Containers', cat:'kitchen-dining', brand:'Milton', price:649, mrp:899, rating:4.5, reviews:1208, img:'p23', badge:'deal', stock:44,
    hi:['Keeps food warm 4–5 hours','Three leak-resistant steel containers','Handy shoulder strap','Steam-vent lid releases pressure'],
    desc:'Office-lunch champion: three stacked steel containers inside an insulated jacket, with a strap that hangs from a bike handle.' },

  { id:'p24', name:'Lokhi Classic Gold Analog Watch — Steel Chain', cat:'watches-clocks', brand:'Lokhi Creations', price:799, mrp:1999, rating:4.3, reviews:358, img:'p24', stock:29,
    hi:['Japanese quartz movement','Gold-tone steel link bracelet','30 m everyday water resistance','1-year warranty'],
    desc:'A timeless round-dial watch with a date window and a comfortable link bracelet — the safe, classy gift you can give anyone.' },
  { id:'p25', name:'Minimal Leather Strap Wrist Watch', cat:'watches-clocks', brand:'Lokhi Creations', price:599, mrp:1299, rating:4.4, reviews:267, img:'p25', badge:'new', stock:36,
    hi:['Slim 8 mm case, soft grain leather strap','Mother-of-pearl style dial','Quartz movement, 2-yr battery','Interchangeable pin buckle'],
    desc:'An understated daily watch — slim enough to slip under a cuff and light enough to forget you are wearing it.' },
  { id:'p26', name:'Vintage Decorative Wall Clock — 12 inch', cat:'watches-clocks', brand:'Lokhi Creations', price:449, mrp:899, rating:4.5, reviews:496, img:'p26', badge:'deal', stock:41,
    hi:['Antique-bronze finish frame','Silent sweep movement — no ticking','Easy wall hook mount','Perfect above TV units & pooja rooms'],
    desc:'Old-world charm with a modern silent movement. The bronze frame warms up a bare wall instantly.' },

  { id:'p27', name:'Matte Liquid Lipstick Trio — Indian Shades', cat:'cosmetics', brand:'Lokhi Creations', price:349, mrp:599, rating:4.4, reviews:512, img:'p27', stock:58,
    hi:['3 everyday shades: nudes, rose, brick red','12-hour transfer-resistant matte','Vitamin E + argan oil, non-drying','Paraben-free, cruelty-free'],
    desc:'A power trio of matte liquid lipsticks made for Indian skin tones — from boardroom nude to festive brick red — that will not budge through a working day.' },
  { id:'p28', name:'Herbal Kajal — Deep Black, 12 Hr Stay', cat:'cosmetics', brand:'Lokhi Creations', price:129, mrp:199, rating:4.6, reviews:1803, img:'p28', badge:'hot', stock:120,
    hi:['Enriched with castor & almond oil','Smudge-proof, one-stroke application','Ophthalmologically safe, no lead','Gentle enough for sensitive eyes'],
    desc:'The kajal your grandmother would approve of — cooling herbal oils, intense black pigment, zero smudge by dinner.' },
  { id:'p29', name:'Herbal Face Glow Kit — 4 Steps', cat:'cosmetics', brand:'Lokhi Creations', price:449, mrp:799, rating:4.3, reviews:176, img:'p29', stock:37,
    hi:['Cleanse · scrub · pack · glow cream','Saffron, turmeric & multani mitti','Free of hydroquinone & steroids','Salon-fresh glow at home'],
    desc:'A four-step home facial built on Ayurvedic classics — saffron, turmeric and multani mitti — for that pre-function glow without a parlour visit.' },

  { id:'p30', name:'Soft Teddy Bear — 2 ft, Cream', cat:'toys', brand:'Lokhi Creations', price:499, mrp:999, rating:4.7, reviews:928, img:'p30', badge:'hot', stock:33,
    hi:['Super-soft huggable fur, 60 cm tall','Fiber fill — no loose beads','Lock-stitched eyes, safe for kids','A scarf and gift card included'],
    desc:'A classic cream teddy with a knitted scarf, stuffed just right for hugging. The gift that never misses — birthdays to apologies.' },
  { id:'p31', name:'Remote Control Rock Crawler — 4WD', cat:'toys', brand:'Lokhi Creations', price:999, mrp:1999, rating:4.2, reviews:213, img:'p31', stock:19,
    hi:['2.4 GHz remote, 30 m range','Climbs 45° inclines & stairs','Shockproof body, anti-skid tyres','Rechargeable battery + USB cable'],
    desc:'A proper 4WD crawler that handles gravel, grass and staircases. Comes with a rechargeable battery so the fun does not die with disposables.' },
  { id:'p32', name:'Building Blocks Tub — 250 Pieces', cat:'toys', brand:'Lokhi Creations', price:549, mrp:999, rating:4.5, reviews:644, img:'p32', badge:'deal', stock:46,
    hi:['250 colourful, chunky blocks','Develops motor skills & creativity','Non-toxic ABS, smooth edges','Storage tub with handle'],
    desc:'An open-ended creativity tub — castles, cars, robots, rockets. Compatible with other major brick brands, easy to wash, easy to store.' },

  { id:'p33', name:'Back-to-School Combo — Bag, Bottle & Pouch', cat:'stationery', brand:'Lokhi Creations', price:899, mrp:1599, rating:4.4, reviews:389, img:'p33', badge:'deal', stock:27,
    hi:['Ergonomic padded backpack (18 L)','Zip pockets + name tag window','Matching 650 ml bottle & pencil pouch','Water-resistant polyester'],
    desc:'The whole first-day kit in one box: a padded ergonomic bag, a matching leak-proof bottle and a pencil pouch — at a combo price that parents love.' },
  { id:'p34', name:'Geometry Box + 6-Notebook Bundle', cat:'stationery', brand:'Lokhi Creations', price:199, mrp:349, rating:4.5, reviews:812, img:'p34', stock:88,
    hi:['Metal compass, divider & ruler set','6 single-line notebooks, 172 pages each','Smooth 70 GSM paper','Exam-ready in one buy'],
    desc:'The stationery run, solved — one bundle with the full geometry instruments and a term\'s worth of smooth-page notebooks.' },
  { id:'p35', name:'Gel Pen Pack — 10 Blue + 2 Black', cat:'stationery', brand:'Lokhi Creations', price:149, mrp:249, rating:4.6, reviews:1544, img:'p35', badge:'hot', stock:150,
    hi:['0.5 mm tip, smear-free ink','Rubber grip for long exams','Writes first time, every time','Box of 12'],
    desc:'Exam-season fuel. Smooth-flowing 0.5 mm gel pens with comfortable grips — the pens students keep coming back for.' },

  { id:'p36', name:'Brass Goddess Lakshmi Idol — 6 inch', cat:'gifts', brand:'Lokhi Creations', price:799, mrp:1499, rating:4.8, reviews:231, img:'p36', stock:15,
    hi:['Hand-finished solid brass','Seated Lakshmi on lotus throne','Perfect for pooja room & shop counters','Housewarming & wedding gift favourite'],
    desc:'A hand-finished brass Lakshmi in blessing pose, seated on a lotus. Weighty, detailed and destined for the place of honour in a new home.' },
  { id:'p37', name:'Premium Festive Gift Hamper — Mug & Treats', cat:'gifts', brand:'Lokhi Creations', price:1299, mrp:1999, rating:4.6, reviews:148, img:'p37', badge:'new', stock:21,
    hi:['Ceramic mug, dry fruits & artisan chocolate','Reusable keepsake box with ribbon','Personalised message card (free)','Corporate & festive gifting ready'],
    desc:'A ready-to-gift hamper that looks twice its price — a fine ceramic mug, premium dry fruits and chocolates in a keepsake box with your message handwritten on the card.' },
];

/* ---------- featured collections (home page) ---------- */
const COLLECTIONS = [
  { id:'bridal',  title:'Bridal & Festive Glow', sub:'Kundan, temple & pearl sets for the big days',        items:['p1','p3','p4','p2','p5','p11'] },
  { id:'kitchen', title:'Kitchen Upgrades',      sub:'Trusted brands your mother already recommends',        items:['p18','p13','p17','p15','p22','p20','p19','p21'] },
  { id:'gifting', title:'Gifts Under ₹999',      sub:'Thoughtful picks that look twice the price',           items:['p36','p30','p24','p26','p31','p11','p9'] },
  { id:'school',  title:'Back to School',        sub:'Everything on the list, one combo at a time',          items:['p33','p34','p35','p32','p19'] },
];

/* ---------- home testimonials ---------- */
const TESTIMONIALS = [
  { q:'I ordered a kundan set for my daughter\'s engagement from our village in Mayurbhanj. It arrived in 4 days, packed like a gift. The set looks even better than the photos.', name:'Sipra Mohanty', place:'Mayurbhanj, Odisha', stars:5 },
  { q:'Honest shop. My Milton flask had a lid issue and they replaced it in two days, no questions. I have been buying from Maa Lokhi since our town days.', name:'Rakesh Agarwal', place:'Ranchi, Jharkhand', stars:5 },
  { q:'The oxidised jhumkas are my everyday pair now — and the price! I have recommended this store to my whole hostel.', name:'Ananya Mishra', place:'Guwahati, Assam', stars:5 },
  { q:'Bought the Bajaj mixer and La Opala dinner set together. Genuine products, proper bill, and delivery to my door in the hills. Rare service.', name:'Diki Bhutia', place:'Gangtok, Sikkim', stars:5 },
];

/* ---------- demo coupons ---------- */
const COUPONS = {
  WELCOME10: { label:'10% off (max ₹300)', type:'pct', value:10, cap:300, min:499 },
  LOKHI50:   { label:'₹50 off orders above ₹999', type:'flat', value:50, min:999 },
  FREESHIP:  { label:'Free shipping on any order', type:'ship', value:0, min:0 },
};

/* ---------- deterministic pseudo-random ---------- */
function hashStr(s){ let h=2166136261; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; }
function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }

/* ---------- demo reviews (deterministic per product) ---------- */
const REVIEW_NAMES = ['Priya Sharma','Sunita Devi','Rahul Verma','Ananya Mishra','Kavita Joshi','Md. Imran','Deepa Patra','Arjun Nair','Meena Kumari','Sourav Ghosh','Lakshmi Narayan','Fatima Sheikh','Vikram Singh','Ritu Agarwal','Pooja Mehta','Sanjay Das','Aparna Rao','Neha Gupta','Bikash Roy','Jyoti Kadam'];
const REVIEW_POOLS = {
  jewellery:['Quality is really good, looks exactly like the photo. Wore it for my cousin\'s wedding and everyone asked where I got it.','Received before the expected date. Packing was very nice — came in a box, perfect for gifting.','Using it daily for 2 months, no colour loss at all. Worth the price.','Bought for my mother, she loved it. Lightweight and comfortable.','The finish is premium for this price range. Will order more colours.','Delivered to our village post office in 5 days. Happy with the purchase.'],
  appliances:['Works exactly as described. Using it daily for a month now, no issues.','Genuine product with proper bill and warranty card. Thank you!','Value for money. Compared prices everywhere — this was the best deal.','Easy to use and clean. Family is very happy with it.','Delivery was quick and the packaging was strong. Product quality is genuine.','Bought during the sale. Excellent product at this price point.'],
  watches:['Looks premium on the wrist. Keeps accurate time so far.','Gifted to my brother, he loved it. Good build quality.','Nice watch for daily use. The strap is comfortable.','Received in good condition, well packed. Exactly as shown.'],
  cosmetics:['Genuine product. Shade is exactly as shown in the picture.','Stays on for hours, does not dry the lips. Buying again.','Became my daily kajal — no smudging even in humid weather.','Loved the herbal smell. Gentle on sensitive skin.'],
  toys:['My daughter has not put it down since it arrived. Great gift.','Stitching is strong and the material is soft. Worth buying.','Battery lasts long, remote works from far. Kids love it!','Good quality at this price. Delivered quickly.'],
  stationery:['Complete value pack. Everything needed for school in one buy.','Notebook paper quality is smooth, pens write really well.','Bought for my tuition class students. Affordable and good quality.','Arrived in 3 days. Exactly as described.'],
  gifts:['Packed beautifully, ideal for gifting. Did not need to wrap it again.','Gifted at a housewarming — the hosts were genuinely pleased.','The idol has good weight and fine detailing. Divine presence.','Box looks premium. Personal note card was a lovely touch.'],
};
function poolFor(cat){
  if(cat.includes('jewellery')||cat==='bangles') return REVIEW_POOLS.jewellery;
  if(cat==='home-appliances'||cat==='kitchen-dining') return REVIEW_POOLS.appliances;
  if(cat==='watches-clocks') return REVIEW_POOLS.watches;
  if(cat==='cosmetics') return REVIEW_POOLS.cosmetics;
  if(cat==='toys') return REVIEW_POOLS.toys;
  if(cat==='stationery') return REVIEW_POOLS.stationery;
  return REVIEW_POOLS.gifts;
}
function seededReviews(p){
  const rnd = mulberry32(hashStr(p.id + p.name));
  const pool = poolFor(p.cat);
  const n = Math.min(6, Math.max(3, Math.round(p.reviews/90)+3));
  const out = [];
  for(let i=0;i<n;i++){
    const r = rnd();
    const rating = r<.66?5 : r<.88?4 : r<.96?3 : 2;
    const days = Math.floor(rnd()*150)+2;
    const name = REVIEW_NAMES[(Math.floor(rnd()*REVIEW_NAMES.length)+i)%REVIEW_NAMES.length];
    const text = pool[(Math.floor(rnd()*pool.length)+i)%pool.length];
    out.push({ name, rating, text, days, verified: rnd()>.22 });
  }
  return out;
}

/* ---------- helpers ---------- */
function productById(id){ return PRODUCTS.find(p=>p.id===id); }
function catLabel(id){ const c=CATEGORIES.find(c=>c.id===id); return c?c.label:id; }
function pct(p){ return Math.round((1-p.price/p.mrp)*100); }
function fmt(n){ return '₹' + Number(n).toLocaleString('en-IN'); }
const INDIAN_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jammu & Kashmir','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Puducherry','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Andaman & Nicobar','Chandigarh','Dadra & Nagar Haveli','Ladakh','Lakshadweep','Other'];
