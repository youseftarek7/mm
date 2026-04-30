// ╔══════════════════════════════════════════════════════════════╗
// ║  avatarConfig_updated.js — كتالوج المتجر 2026 المحدث        ║
// ║  ✅ صنفين مجاني من كل قسم (price:0, owned:true)            ║
// ║  ✅ باقي الأصناف مدفوعة ومقفولة                            ║
// ╚══════════════════════════════════════════════════════════════╝

export const STORE_CATALOG = {

  // ══════════════════════════════════════
  // 🎨 البشرة — Skin
  // ══════════════════════════════════════
  skin: [
    // ── مجاني (2 صنف) ──
    { id:"skin_tan",    name:"بيج دافئ",    price:0,   color:"#F0B882", rarity:"مجاني",   rarityColor:"#7DD3B0", owned:true,
      desc:"البشرة الكلاسيكية الدافئة" },
    { id:"skin_light",  name:"فاتح ناعم",   price:0,   color:"#FAD4A8", rarity:"مجاني",   rarityColor:"#7DD3B0", owned:true,
      desc:"بشرة فاتحة ناعمة" },
    // ── مدفوع ──
    { id:"skin_medium", name:"وسط طبيعي",   price:150, color:"#D4905A", rarity:"شائع",    rarityColor:"#C49BB0",
      desc:"بشرة متوسطة طبيعية" },
    { id:"skin_dark",   name:"داكن جميل",   price:180, color:"#A06030", rarity:"شائع",    rarityColor:"#C49BB0",
      desc:"بشرة داكنة جميلة" },
    { id:"skin_deep",   name:"ريتش دييب",   price:200, color:"#6A3018", rarity:"نادر",    rarityColor:"#FF8C42",
      desc:"Deep Rich Skin" },
    { id:"skin_golden", name:"ذهبي مشمسي", price:300, color:"#D4A050", rarity:"خاص",     rarityColor:"#C084B8",
      desc:"Golden Sun-Kissed" },
  ],

  // ══════════════════════════════════════
  // 💇 الشعر — Hair
  // ══════════════════════════════════════
  hair: [
    // ── مجاني (2 صنف) ──
    { id:"hair_brown",    name:"بني كلاسيك",    price:0,   color:"#7A4E24", rarity:"مجاني",   rarityColor:"#7DD3B0", owned:true,
      desc:"شعر طويل بني ناعم كلاسيكي" },
    { id:"hair_black",    name:"أسود لامع",      price:0,   color:"#150806", rarity:"مجاني",   rarityColor:"#7DD3B0", owned:true,
      desc:"أسود فاخر لامع" },
    // ── مدفوع ──
    { id:"hair_honey",    name:"عسلي بليتش",    price:150, color:"#C88030", rarity:"شائع",    rarityColor:"#C49BB0",
      desc:"بليتش عسلي ذهبي 2026" },
    { id:"hair_ash",      name:"رمادي آشي",      price:200, color:"#8A8A9A", rarity:"شائع",    rarityColor:"#C49BB0",
      desc:"Ash Grey — ترند بارد" },
    { id:"hair_red",      name:"Cherry Red",     price:220, color:"#8B1A0A", rarity:"نادر",    rarityColor:"#FF8C42",
      desc:"Cherry Red — الأكتر ترند 2026" },
    { id:"hair_pink",     name:"روزي باب",        price:300, color:"#C84070", rarity:"نادر",    rarityColor:"#FF8C42",
      desc:"Rosy Pink — Boston Style" },
    { id:"hair_lavender", name:"لافندر دريمي",   price:350, color:"#8060B8", rarity:"خاص",     rarityColor:"#C084B8",
      desc:"Lilac 2026 — كشخة بنفسجية" },
    { id:"hair_silver",   name:"فضي نجمة",       price:500, color:"#909090", rarity:"أسطوري",  rarityColor:"#F9C06A",
      desc:"Silver Glam — 80s Icon" },
    { id:"hair_galaxy",   name:"جالاكسي أومبريه",price:800, color:"#2A1060", rarity:"أسطوري",  rarityColor:"#F9C06A",
      desc:"Galaxy Ombré — Fantasy Luxury" },
  ],

  // ══════════════════════════════════════
  // 👗 التوبات — Tops
  //    isCrop:true = كروب توب (يظهر البطن)
  //    noSleeves:true = بدون أكمام
  // ══════════════════════════════════════
  tops: [
    // ── مجاني (2 صنف) ──
    { id:"top_red_crop",  name:"كروب أحمر",     price:0,   color:"#8B1A1A", rarity:"مجاني",   rarityColor:"#7DD3B0", owned:true,
      isCrop:true, style:"crop", desc:"الكروب الكلاسيكي الأحمر — يظهر البطن" },
    { id:"top_silk_cream",name:"بلوزة سيلك",    price:0,   color:"#F5EDD8", rarity:"مجاني",   rarityColor:"#7DD3B0", owned:true,
      style:"old money", desc:"بلوزة سيلك Old Money أصيلة" },
    // ── مدفوع ──
    { id:"crop_rib_black",name:"كروب ريب أسود", price:150, color:"#1A1A1A", rarity:"شائع",    rarityColor:"#C49BB0",
      isCrop:true, style:"crop", desc:"Black Ribbed Crop — الأساسي المتكرر" },
    { id:"top_white_btn", name:"قميص أبيض",     price:120, color:"#F0F0F0", rarity:"شائع",    rarityColor:"#C49BB0",
      style:"classic", desc:"Oxford Button-Down — تايملس" },
    { id:"crop_satin",    name:"ساتان كروب وردي",price:320, color:"#E090A0", rarity:"نادر",    rarityColor:"#FF8C42",
      isCrop:true, noSleeves:true, style:"glam", desc:"Satin Bralette Style — فاخر وجريء" },
    { id:"crop_corset",   name:"كورسيه كروب",   price:280, color:"#8B1A3A", rarity:"نادر",    rarityColor:"#FF8C42",
      isCrop:true, style:"glam", desc:"Corset Crop — SS2026 Runway" },
    { id:"crop_halter",   name:"هولتر كروب",    price:250, color:"#B84A0A", rarity:"نادر",    rarityColor:"#FF8C42",
      isCrop:true, noSleeves:true, style:"summer", desc:"Halter Neck — Beach Glam" },
    { id:"crop_cobalt",   name:"كروب كوبالت",   price:400, color:"#1A5AD4", rarity:"خاص",     rarityColor:"#C084B8",
      isCrop:true, style:"bold", desc:"Electric Cobalt — أقوى لون 2026" },
    { id:"top_fuchsia",   name:"فوشيا هوت",    price:300, color:"#CC0066", rarity:"خاص",     rarityColor:"#C084B8",
      style:"bold", desc:"Hot Fuchsia — لون 2026 الأبرز" },
    { id:"top_sequin",    name:"سيكوين ذهبي",  price:500, color:"#B8860B", rarity:"أسطوري",  rarityColor:"#F9C06A",
      style:"glamoratti", desc:"Gold Sequin — 80s Glam Night Out" },
  ],

  // ══════════════════════════════════════
  // 👖 البنطلون والتنانير — Bottoms
  //    isWide:true = وايد ليج (أعرض)
  //    isSkirt:true = تنورة
  //    isMini:true = ميني
  // ══════════════════════════════════════
  bottoms: [
    // ── مجاني (2 صنف) ──
    { id:"pants_dark_denim", name:"دارك واش جينز",  price:0,   color:"#1E2D4A", rarity:"مجاني",   rarityColor:"#7DD3B0", owned:true,
      style:"classic", desc:"Dark Wash Straight — ستايل ترند 2026" },
    { id:"pants_wide_black", name:"وايد ليج أسود",  price:0,   color:"#1A1A1A", rarity:"مجاني",   rarityColor:"#7DD3B0", owned:true,
      isWide:true, style:"classic", desc:"Wide Leg Black — فخم وواسع" },
    // ── مدفوع ──
    { id:"pants_cigarette",  name:"جينز سيجاريت",  price:180, color:"#2A3A5A", rarity:"شائع",    rarityColor:"#C49BB0",
      style:"chic", desc:"Cigarette Cut — الأنيق الجديد" },
    { id:"pants_barrel",     name:"بارل ليج بيج",   price:220, color:"#B8A88A", rarity:"شائع",    rarityColor:"#C49BB0",
      isWide:true, style:"trendy", desc:"Barrel Leg — ستايل لحظة 2026" },
    { id:"skirt_mini_black", name:"ميني سكيرت",     price:180, color:"#1A1A1A", rarity:"شائع",    rarityColor:"#C49BB0",
      isSkirt:true, isMini:true, style:"chic", desc:"Mini Skirt — Structured Marc Jacobs SS26" },
    { id:"pants_white_denim",name:"وايت سمر جينز",  price:200, color:"#E8E8E0", rarity:"نادر",    rarityColor:"#FF8C42",
      style:"summer", desc:"White Summer Denim — Summer Essential" },
    { id:"skirt_maxi_floral",name:"ماكسي فلورال",   price:350, color:"#C05878", rarity:"خاص",     rarityColor:"#C084B8",
      isSkirt:true, style:"romantic", desc:"Maxi Floral — صيف 2026 الأروع" },
    { id:"pants_fuchsia_tai",name:"تروزر فوشيا",    price:500, color:"#CC0066", rarity:"أسطوري",  rarityColor:"#F9C06A",
      style:"bold", desc:"Fuchsia Tailored — 2026 Power Color" },
  ],

  // ══════════════════════════════════════
  // 💎 الإكسسوارات — Accessories
  // ══════════════════════════════════════
  accessories: [
    // ── مجاني (2 صنف) ──
    { id:"acc_none",    name:"بدون إكسسوار", price:0,   rarity:"مجاني",   rarityColor:"#7DD3B0", owned:true,
      icon:"✨", desc:"لوك نضيف بدون إضافات" },
    { id:"acc_grad",    name:"قبعة تخرج",    price:0,   rarity:"مجاني",   rarityColor:"#7DD3B0", owned:true,
      icon:"🎓", desc:"قبعة التخرج المميزة" },
    // ── مدفوع ──
    { id:"acc_sunglass",name:"نظارة أوفرسايز",price:200,rarity:"شائع",    rarityColor:"#C49BB0",
      icon:"😎", desc:"Oversized Sunnies — It Girl Signature" },
    { id:"acc_pearl",   name:"بيرل نيكليس",  price:250, rarity:"شائع",    rarityColor:"#C49BB0",
      icon:"🦪", desc:"Pearl Necklace — Old Money Essential" },
    { id:"acc_flower",  name:"زهرة في الشعر", price:200, rarity:"شائع",    rarityColor:"#C49BB0",
      icon:"🌸", desc:"Floral Hair Clip — Coquette" },
    { id:"acc_beret",   name:"بيريه فرنساوي", price:300, rarity:"خاص",     rarityColor:"#C084B8",
      icon:"🎨", desc:"Beret — French Girl Chic" },
    { id:"acc_crown",   name:"تاج ذهبي",      price:400, rarity:"نادر",    rarityColor:"#FF8C42",
      icon:"👑", desc:"Gold Crown — Royalty Era" },
    { id:"acc_star",    name:"نجمة هيربين",   price:350, rarity:"خاص",     rarityColor:"#C084B8",
      icon:"⭐", desc:"Star Hair Clip — Y2K Revival" },
    { id:"acc_halo",    name:"هالة فضية",      price:650, rarity:"أسطوري",  rarityColor:"#F9C06A",
      icon:"😇", desc:"Silver Halo — Angel Aesthetic" },
    { id:"acc_cap",     name:"كاب كازويل",    price:220, rarity:"شائع",    rarityColor:"#C49BB0",
      icon:"🧢", desc:"Baseball Cap — Street Chic" },
  ],

  // ══════════════════════════════════════
  // 👟 الأحذية — Shoes
  // ══════════════════════════════════════
  shoes: [
    // ── مجاني (2 صنف) ──
    { id:"shoes_white_snkr",name:"سنيكرز أبيض",   price:0,   color:"#F5F5F5", rarity:"مجاني",   rarityColor:"#7DD3B0", owned:true,
      style:"casual", desc:"White Sneakers — النظيف الأبدي" },
    { id:"shoes_loafer",    name:"لوفر جلد بيج",   price:0,   color:"#C4946A", rarity:"مجاني",   rarityColor:"#7DD3B0", owned:true,
      style:"old money", desc:"Leather Loafer — Old Money Staple" },
    // ── مدفوع ──
    { id:"shoes_ballet",    name:"باليت فلاتس وردي",price:200, color:"#E090A0", rarity:"شائع",    rarityColor:"#C49BB0",
      style:"coquette", desc:"Ballet Flats — Coquette Must-Have" },
    { id:"shoes_boot_black",name:"أنكل بوت أسود",  price:280, color:"#1A1A1A", rarity:"نادر",    rarityColor:"#FF8C42",
      style:"chic", desc:"Pointed Ankle Boot — SS26 Sleek" },
    { id:"shoes_mule",      name:"ميول سيلك كريم",  price:300, color:"#EDE8D8", rarity:"نادر",    rarityColor:"#FF8C42",
      style:"old money", desc:"Satin Mule — Quiet Luxury Elevated" },
    { id:"shoes_strappy",   name:"ستراب هيل ذهبي",  price:400, color:"#B8860B", rarity:"خاص",     rarityColor:"#C084B8",
      style:"glam", desc:"Gold Strappy Heel — 80s Glam Night" },
    { id:"shoes_platform",  name:"بلاتفورم أبيض",   price:450, color:"#F0F0F0", rarity:"أسطوري",  rarityColor:"#F9C06A",
      style:"Y2K", desc:"White Platform — Y2K SS26 Comeback" },
    { id:"shoes_coquette",  name:"بو بيبي هيل وردي",price:600, color:"#E090A0", rarity:"أسطوري",  rarityColor:"#F9C06A",
      style:"coquette", desc:"Baby Pink Heel — Coquette Dream" },
  ],
};

// ══════════════════════════════════════════════════════════════
// الـ Outfit الافتراضي
// ══════════════════════════════════════════════════════════════
export const DEFAULT_OUTFIT = {
  skin:        "skin_tan",
  hair:        "hair_brown",
  tops:        "top_red_crop",
  bottoms:     "pants_dark_denim",
  accessories: "acc_grad",
  shoes:       "shoes_white_snkr",
};

export const STORE_DOC = "avatar_store_maha";

// ══════════════════════════════════════════════════════════════
// مجموعات الستيل للفلتر
// ══════════════════════════════════════════════════════════════
export const STYLE_COLLECTIONS = [
  { id:"all",        label:"🛍️ الكل",         color:"#FF6B9D" },
  { id:"old money",  label:"💰 Old Money",     color:"#D4A050" },
  { id:"crop",       label:"✂️ كروب توب",      color:"#FF6B9D" },
  { id:"glamoratti", label:"✨ Glamoratti",    color:"#C084B8" },
  { id:"classic",    label:"🎩 كلاسيك",        color:"#7DD3B0" },
  { id:"bold",       label:"🔥 بولد 2026",     color:"#1A5AD4" },
  { id:"coquette",   label:"🎀 Coquette",      color:"#E090A0" },
  { id:"glam",       label:"💫 Glam",          color:"#F9C06A" },
];

// ══════════════════════════════════════════════════════════════
// Helper: كل الأصناف المجانية (لتهيئة owned set)
// ══════════════════════════════════════════════════════════════
export function getDefaultOwned() {
  const owned = new Set();
  Object.values(STORE_CATALOG).forEach(items => {
    items.filter(i => i.owned).forEach(i => owned.add(i.id));
  });
  return owned;
}
