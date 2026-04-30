// ╔══════════════════════════════════════════════════════════════╗
// ║  avatarConfig.js — كتالوج الموضة 2026 المحدث               ║
// ║  أحدث ستيلات: Old Money • Glamoratti • Crop Top • 80s Glam ║
// ╚══════════════════════════════════════════════════════════════╝

export const STORE_CATALOG = {

  // ══════════════════════════════════════
  // 💇 الشعر — Hair Styles
  // ══════════════════════════════════════
  hair: [
    { id:"hair_brown",    name:"بني كلاسيك",      price:0,    icon:"🤎", color:"#7A4E24", rarity:"مجاني",    rarityColor:"#7DD3B0", owned:true,
      style:"كلاسيك", desc:"شعر طويل بني ناعم" },
    { id:"hair_black",    name:"أسود لامع",        price:80,   icon:"🖤", color:"#1A0A06", rarity:"شائع",     rarityColor:"#C49BB0",
      style:"كلاسيك", desc:"أسود فاخر لامع" },
    { id:"hair_honey",    name:"عسلي بليتش",       price:150,  icon:"🍯", color:"#C88030", rarity:"شائع",     rarityColor:"#C49BB0",
      style:"ترند", desc:"بليتش عسلي ذهبي 2026" },
    { id:"hair_ash",      name:"رمادي آشي",        price:200,  icon:"🩶", color:"#8A8A9A", rarity:"شائع",     rarityColor:"#C49BB0",
      style:"ترند", desc:"لون آش بارد موضة 2026" },
    { id:"hair_red",      name:"أحمر كيرة",        price:220,  icon:"🔴", color:"#8B1A0A", rarity:"نادر",     rarityColor:"#FF8C42",
      style:"جريء", desc:"Cherry Red — الأكتر ترند في 2026" },
    { id:"hair_choco",    name:"شوكولاتة داكن",    price:180,  icon:"🍫", color:"#4A2010", rarity:"شائع",     rarityColor:"#C49BB0",
      style:"old money", desc:"براون ميلتد أنيق" },
    { id:"hair_pink",     name:"روزي باب",          price:300,  icon:"🩷", color:"#C84070", rarity:"نادر",     rarityColor:"#FF8C42",
      style:"Y2K", desc:"روزي بوسطن ستايل" },
    { id:"hair_lavender", name:"لافندر دريمي",      price:350,  icon:"💜", color:"#8060B8", rarity:"خاص",      rarityColor:"#C084B8",
      style:"ترند", desc:"Lilac 2026 — كشخة بنفسجية" },
    { id:"hair_butter",   name:"بوتر بلوند",        price:280,  icon:"🧈", color:"#E8C860", rarity:"نادر",     rarityColor:"#FF8C42",
      style:"old money", desc:"بلوند زبداوي دافئ" },
    { id:"hair_silver",   name:"فضي نجمة",         price:500,  icon:"🤍", color:"#909090", rarity:"أسطوري",   rarityColor:"#F9C06A",
      style:"glamoratti", desc:"فضي صقيل 80s Glam" },
    { id:"hair_cobalt",   name:"كوبالت بولد",       price:600,  icon:"💙", color:"#1A3AB8", rarity:"أسطوري",   rarityColor:"#F9C06A",
      style:"glamoratti", desc:"أزرق كوبالت — أقوى ترند 2026" },
    { id:"hair_galaxy",   name:"جالاكسي أومبريه",  price:800,  icon:"🌌", color:"#2A1060", rarity:"أسطوري",   rarityColor:"#F9C06A",
      style:"fantasy", desc:"أومبريه كوني فاخر" },
  ],

  // ══════════════════════════════════════
  // 👕 التوبات — Tops
  // ══════════════════════════════════════
  tops: [
    // ── Classics & Old Money ──
    { id:"top_silk_cream",  name:"بلوزة سيلك كريم",   price:0,   icon:"🤍", color:"#F5EDD8", rarity:"مجاني",  rarityColor:"#7DD3B0", owned:true,
      style:"old money", desc:"بلوزة حرير بوتيك — Old Money أصيل" },
    { id:"top_white_btn",   name:"قميص أبيض كلاسيك",  price:120, icon:"👔", color:"#F0F0F0", rarity:"شائع",   rarityColor:"#C49BB0",
      style:"classic", desc:"Oxford Button-Down — تايملس" },
    { id:"top_navy_stripe", name:"ستريبد ناتيكال",     price:160, icon:"⚓", color:"#1A2A5A", rarity:"شائع",   rarityColor:"#C49BB0",
      style:"preppy", desc:"Breton Stripes — ستايل بحري فرنساوي" },
    { id:"top_cream_knit",  name:"كريم نيت بولو",      price:200, icon:"🏌️", color:"#EDE0C8", rarity:"شائع",   rarityColor:"#C49BB0",
      style:"old money", desc:"Polo Knit — Golf Club Aesthetic" },
    { id:"top_camel",       name:"كاميل أوفرسايز",     price:180, icon:"🐫", color:"#C19A6B", rarity:"شائع",   rarityColor:"#C49BB0",
      style:"old money", desc:"Cashmere-like Oversized — رفاهية هادية" },
    { id:"top_forest_knit", name:"كنزة فورست",         price:220, icon:"🌲", color:"#2D5016", rarity:"نادر",   rarityColor:"#FF8C42",
      style:"old money", desc:"Forest Green Knit — أنيق وعملي" },

    // ── Crop Tops ──
    { id:"crop_rib_white",  name:"كروب ريب أبيض",     price:150, icon:"🤍", color:"#EEEEEE", rarity:"شائع",   rarityColor:"#C49BB0", isCrop:true,
      style:"crop", desc:"Ribbed Crop Tank — الكلاسيك المحدث" },
    { id:"crop_rib_black",  name:"كروب ريب أسود",     price:150, icon:"🖤", color:"#1A1A1A", rarity:"شائع",   rarityColor:"#C49BB0", isCrop:true,
      style:"crop", desc:"Black Ribbed Crop — الأساسي المتكرر" },
    { id:"crop_corset",     name:"كورسيه كروب",        price:280, icon:"🎀", color:"#8B1A3A", rarity:"نادر",   rarityColor:"#FF8C42", isCrop:true,
      style:"glam", desc:"Corset Crop Top — SS2026 Runway" },
    { id:"crop_linen",      name:"كروب لينن بيج",      price:200, icon:"🌾", color:"#D4C4A0", rarity:"شائع",   rarityColor:"#C49BB0", isCrop:true,
      style:"old money", desc:"Linen Crop — Summer Old Money" },
    { id:"crop_satin",      name:"ساتان كروب وردي",    price:320, icon:"🌸", color:"#E090A0", rarity:"نادر",   rarityColor:"#FF8C42", isCrop:true,
      style:"glam", desc:"Satin Bralette Style — فاخر وجريء" },
    { id:"crop_halter",     name:"هولتر كروب",         price:250, icon:"🌺", color:"#B84A0A", rarity:"نادر",   rarityColor:"#FF8C42", isCrop:true,
      style:"summer", desc:"Halter Neck Crop — بيتش جلام" },
    { id:"crop_puff",       name:"كروب باف سليف",      price:350, icon:"🎪", color:"#7030A0", rarity:"خاص",    rarityColor:"#C084B8", isCrop:true,
      style:"glamoratti", desc:"Puff Sleeve Crop — 80s Glamoratti" },
    { id:"crop_cobalt",     name:"كروب كوبالت",        price:400, icon:"💙", color:"#1A5AD4", rarity:"خاص",    rarityColor:"#C084B8", isCrop:true,
      style:"bold", desc:"Electric Cobalt — أقوى لون 2026" },

    // ── Statement Tops ──
    { id:"top_sequin",      name:"توب سيكوين ذهب",     price:500, icon:"✨", color:"#B8860B", rarity:"أسطوري", rarityColor:"#F9C06A",
      style:"glamoratti", desc:"Gold Sequin — 80s Glam Night Out" },
    { id:"top_leather",     name:"جاكيت ليذر أسود",    price:550, icon:"🖤", color:"#1A1A1A", rarity:"أسطوري", rarityColor:"#F9C06A",
      style:"edgy", desc:"Leather Jacket — SS26 الأكثر لبساً" },
    { id:"top_floral",      name:"بلوزة فلورال",        price:280, icon:"🌸", color:"#D4588A", rarity:"نادر",   rarityColor:"#FF8C42",
      style:"romantic", desc:"Floral Blouse — Chloé SS26 Inspired" },
    { id:"top_fuchsia",     name:"فوشيا هوت",           price:300, icon:"🩷", color:"#CC0066", rarity:"خاص",    rarityColor:"#C084B8",
      style:"bold", desc:"Hot Fuchsia — لون 2026 الأبرز" },
  ],

  // ══════════════════════════════════════
  // 👖 البنطلون — Bottoms (متنوعة وواقعية)
  // ══════════════════════════════════════
  bottoms: [
    // ── Jeans & Denim ──
    { id:"pants_dark_denim",  name:"دارك واش جينز",     price:0,   icon:"👖", color:"#1E2D4A", rarity:"مجاني",  rarityColor:"#7DD3B0", owned:true,
      style:"classic", desc:"Dark Wash Straight — ستايل ترند 2026" },
    { id:"pants_cigarette",   name:"جينز سيجاريت",       price:180, icon:"🚬", color:"#2A3A5A", rarity:"شائع",   rarityColor:"#C49BB0",
      style:"chic", desc:"Cigarette Cut — الأنيق الجديد بدل الباجي" },
    { id:"pants_wide_black",  name:"وايد ليج أسود",      price:200, icon:"🖤", color:"#1A1A1A", rarity:"شائع",   rarityColor:"#C49BB0",
      style:"classic", desc:"Wide Leg Black — فخم وراقي" },
    { id:"pants_barrel",      name:"بارل ليج بيج",        price:220, icon:"🪣", color:"#B8A88A", rarity:"شائع",   rarityColor:"#C49BB0",
      style:"trendy", desc:"Barrel Leg — ستايل لحظة 2026" },
    { id:"pants_grey_denim",  name:"جينز رمادي مود",     price:160, icon:"🩶", color:"#707080", rarity:"شائع",   rarityColor:"#C49BB0",
      style:"casual", desc:"Grey Denim Straight — كازويل شيك" },
    { id:"pants_white_denim", name:"وايت سمر جينز",      price:200, icon:"🤍", color:"#E8E8E0", rarity:"نادر",   rarityColor:"#FF8C42",
      style:"summer", desc:"White Summer Denim — إيجيبشن رسورت" },

    // ── Trousers & Tailored ──
    { id:"pants_camel_tai",   name:"تروزر كاميل تيلور",  price:280, icon:"🐫", color:"#C4946A", rarity:"نادر",   rarityColor:"#FF8C42",
      style:"old money", desc:"Tailored Camel Trousers — Old Money Signature" },
    { id:"pants_cream_wide",  name:"وايد ليج كريم",       price:250, icon:"🤍", color:"#EDE8D8", rarity:"نادر",   rarityColor:"#FF8C42",
      style:"old money", desc:"Cream Wide Leg — Golf Club Vibes" },
    { id:"pants_plaid",       name:"بلايد تشيكد",         price:320, icon:"🟫", color:"#6A4A20", rarity:"خاص",    rarityColor:"#C084B8",
      style:"preppy", desc:"Plaid Trousers — كلاسيك بريطاني" },
    { id:"pants_linen_beige", name:"لينن بيج سمر",        price:200, icon:"🌾", color:"#D4C4A0", rarity:"شائع",   rarityColor:"#C49BB0",
      style:"summer", desc:"Linen Pants — أنيق وخفيف للصيف" },
    { id:"pants_olive",       name:"زيتي كارجو ستايل",    price:240, icon:"🫒", color:"#4A5A20", rarity:"نادر",   rarityColor:"#FF8C42",
      style:"gorpcore", desc:"Olive Cargo — Gorpcore meets Fashion" },

    // ── Skirts ──
    { id:"skirt_midi_cream",  name:"ميدي تنورة كريم",    price:220, icon:"👗", color:"#EDE8D8", rarity:"شائع",   rarityColor:"#C49BB0",
      style:"old money", desc:"Cream Midi Skirt — روعة كلاسيكية" },
    { id:"skirt_satin_lilac", name:"ساتان تنورة ليلاك",  price:300, icon:"💜", color:"#9070C0", rarity:"خاص",    rarityColor:"#C084B8",
      style:"glam", desc:"Lilac Satin Midi — Chloé SS26 Inspired" },
    { id:"skirt_mini_black",  name:"ميني سكيرت أسود",    price:180, icon:"🖤", color:"#1A1A1A", rarity:"شائع",   rarityColor:"#C49BB0",
      style:"chic", desc:"Structured Mini — Marc Jacobs SS26" },
    { id:"skirt_maxi_floral", name:"ماكسي فلورال",        price:350, icon:"🌺", color:"#C05878", rarity:"خاص",    rarityColor:"#C084B8",
      style:"romantic", desc:"Maxi Floral — صيف 2026 الأروع" },
    { id:"pants_fuchsia_tai", name:"تروزر فوشيا",         price:500, icon:"🩷", color:"#CC0066", rarity:"أسطوري", rarityColor:"#F9C06A",
      style:"bold", desc:"Fuchsia Tailored — 2026 Power Color" },
    { id:"pants_cobalt_tai",  name:"كوبالت سكيني تيلور",  price:600, icon:"💙", color:"#1A5AD4", rarity:"أسطوري", rarityColor:"#F9C06A",
      style:"glamoratti", desc:"Electric Blue Tailored — 2026 Runway" },
  ],

  // ══════════════════════════════════════
  // 🎩 الإكسسوارات — Accessories (رأس + ديكور)
  // ══════════════════════════════════════
  accessories: [
    { id:"acc_none",       name:"بدون إكسسوار",       price:0,   icon:"✨", rarity:"مجاني",  rarityColor:"#7DD3B0", owned:true,
      desc:"لوك نضيف بدون إضافات" },
    { id:"acc_grad",       name:"قبعة تخرج",           price:0,   icon:"🎓", rarity:"مجاني",  rarityColor:"#7DD3B0", owned:true,
      desc:"قبعة التخرج المميزة" },
    { id:"acc_sunglass",   name:"نظارة أوفرسايز",      price:200, icon:"😎", rarity:"شائع",   rarityColor:"#C49BB0",
      desc:"Oversized Sunnies — It Girl Signature" },
    { id:"acc_pearl",      name:"بيرل نيكليس",         price:250, icon:"🦪", rarity:"شائع",   rarityColor:"#C49BB0",
      desc:"Pearl Necklace — Old Money Essential" },
    { id:"acc_scarf_silk", name:"سيلك سكارف",          price:280, icon:"🧣", rarity:"نادر",   rarityColor:"#FF8C42",
      desc:"Silk Scarf — Parisian Chic 2026" },
    { id:"acc_flower",     name:"زهرة في الشعر",        price:200, icon:"🌸", rarity:"شائع",   rarityColor:"#C49BB0",
      desc:"Floral Hair Clip — Coquette Aesthetic" },
    { id:"acc_beret",      name:"بيريه فرنساوي",        price:300, icon:"🎨", rarity:"خاص",    rarityColor:"#C084B8",
      desc:"Beret — French Girl Chic" },
    { id:"acc_crown",      name:"تاج ذهبي",             price:400, icon:"👑", rarity:"نادر",   rarityColor:"#FF8C42",
      desc:"Gold Crown — Royalty Era" },
    { id:"acc_gold_cuff",  name:"باور كاف ذهبي",        price:450, icon:"💛", rarity:"نادر",   rarityColor:"#FF8C42",
      desc:"Gold Cuff Bracelet — 80s Glamoratti" },
    { id:"acc_witch_hat",  name:"قبعة ساحرة",           price:380, icon:"🧙", rarity:"نادر",   rarityColor:"#FF8C42",
      desc:"Witch Hat — Dark Academia" },
    { id:"acc_star",       name:"نجمة هيربين",          price:350, icon:"⭐", rarity:"خاص",    rarityColor:"#C084B8",
      desc:"Star Hair Clip — Y2K Revival" },
    { id:"acc_halo",       name:"هالة فضية",            price:650, icon:"😇", rarity:"أسطوري", rarityColor:"#F9C06A",
      desc:"Silver Halo — Angel Aesthetic" },
    { id:"acc_headband",   name:"هيدباند ساتان",        price:300, icon:"🎀", rarity:"خاص",    rarityColor:"#C084B8",
      desc:"Satin Headband — Old Money Prep" },
    { id:"acc_cap",        name:"كاب كازويل",           price:220, icon:"🧢", rarity:"شائع",   rarityColor:"#C49BB0",
      desc:"Baseball Cap — Street Chic" },
  ],

  // ══════════════════════════════════════
  // 👟 الأحذية — Shoes
  // ══════════════════════════════════════
  shoes: [
    { id:"shoes_white_snkr", name:"سنيكرز أبيض",       price:0,   icon:"👟", color:"#F5F5F5", rarity:"مجاني",  rarityColor:"#7DD3B0", owned:true,
      style:"casual", desc:"White Sneakers — النظيف الأبدي" },
    { id:"shoes_loafer",     name:"لوفر جلد بيج",       price:220, icon:"🥿", color:"#C4946A", rarity:"شائع",   rarityColor:"#C49BB0",
      style:"old money", desc:"Leather Loafer — Old Money Staple" },
    { id:"shoes_ballet",     name:"باليت فلاتس وردي",   price:200, icon:"🩰", color:"#E090A0", rarity:"شائع",   rarityColor:"#C49BB0",
      style:"coquette", desc:"Ballet Flats — Coquette Must-Have" },
    { id:"shoes_boot_black", name:"أنكل بوت أسود",      price:280, icon:"👢", color:"#1A1A1A", rarity:"نادر",   rarityColor:"#FF8C42",
      style:"chic", desc:"Pointed Ankle Boot — SS26 Sleek" },
    { id:"shoes_mule",       name:"ميول سيلك كريم",     price:300, icon:"👡", color:"#EDE8D8", rarity:"نادر",   rarityColor:"#FF8C42",
      style:"old money", desc:"Satin Mule — Quiet Luxury Elevated" },
    { id:"shoes_salomon",    name:"سالومون سبورتي",     price:250, icon:"🥾", color:"#4A3A2A", rarity:"نادر",   rarityColor:"#FF8C42",
      style:"gorpcore", desc:"Salomon Trail — الترند الجديد بدل الأبوي" },
    { id:"shoes_strappy",    name:"ستراب هيل ذهبي",     price:400, icon:"👠", color:"#B8860B", rarity:"خاص",    rarityColor:"#C084B8",
      style:"glam", desc:"Gold Strappy Heel — 80s Glam Night" },
    { id:"shoes_mary_jane",  name:"ماري جين باتنت",     price:350, icon:"🩰", color:"#1A1A1A", rarity:"خاص",    rarityColor:"#C084B8",
      style:"preppy", desc:"Patent Mary Jane — Miu Miu Inspired" },
    { id:"shoes_platform",   name:"بلاتفورم أبيض",      price:450, icon:"🫧", color:"#F0F0F0", rarity:"أسطوري", rarityColor:"#F9C06A",
      style:"Y2K", desc:"White Platform — Y2K SS26 Comeback" },
    { id:"shoes_coquette",   name:"بو بيبي هيل وردي",   price:600, icon:"🎀", color:"#E090A0", rarity:"أسطوري", rarityColor:"#F9C06A",
      style:"coquette", desc:"Baby Pink Heel — Coquette Dream" },
  ],

  // ══════════════════════════════════════
  // 🎨 البشرة — Skin Tones
  // ══════════════════════════════════════
  skin: [
    { id:"skin_tan",    name:"بيج دافئ",          price:0,   icon:"🤎", color:"#F0B882", rarity:"مجاني",  rarityColor:"#7DD3B0", owned:true },
    { id:"skin_light",  name:"فاتح ناعم",          price:150, icon:"🤍", color:"#FAD4A8", rarity:"شائع",   rarityColor:"#C49BB0" },
    { id:"skin_medium", name:"وسط طبيعي",          price:150, icon:"🫶", color:"#D4905A", rarity:"شائع",   rarityColor:"#C49BB0" },
    { id:"skin_dark",   name:"داكن جميل",          price:150, icon:"🖤", color:"#A06030", rarity:"شائع",   rarityColor:"#C49BB0" },
    { id:"skin_deep",   name:"دييب ريتش",          price:200, icon:"🌑", color:"#6A3018", rarity:"نادر",   rarityColor:"#FF8C42" },
    { id:"skin_golden", name:"ذهبي مشمسي",        price:300, icon:"☀️", color:"#D4A050", rarity:"خاص",    rarityColor:"#C084B8" },
    { id:"skin_porcel", name:"بورسيلان برايت",     price:350, icon:"🌟", color:"#FFE8D0", rarity:"خاص",    rarityColor:"#C084B8" },
  ],
};

// ══════════════════════════════════════════════════════════════
// الـ outfit الافتراضي
// ══════════════════════════════════════════════════════════════
export const DEFAULT_OUTFIT = {
  hair:        "hair_brown",
  tops:        "top_silk_cream",
  bottoms:     "pants_dark_denim",
  accessories: "acc_grad",
  shoes:       "shoes_white_snkr",
  skin:        "skin_tan",
};

export const STORE_DOC = "avatar_store_maha";

// مجموعات الستيل للعرض
export const STYLE_COLLECTIONS = [
  { id:"all",        label:"🛍️ الكل",         color:"#FF6B9D" },
  { id:"old money",  label:"💰 Old Money",     color:"#D4A050" },
  { id:"crop",       label:"✂️ كروب توب",      color:"#FF6B9D" },
  { id:"glamoratti", label:"✨ Glamoratti",    color:"#C084B8" },
  { id:"classic",    label:"🎩 كلاسيك",        color:"#7DD3B0" },
  { id:"bold",       label:"🔥 بولد 2026",     color:"#1A5AD4" },
  { id:"coquette",   label:"🎀 Coquette",      color:"#E090A0" },
];