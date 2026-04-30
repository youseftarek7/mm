// avatarConfig_updated.js — كتالوج الأزياء 2026

export const STORE_CATALOG = {

  // ══════════════════════════════════════
  // 🎨 البشرة
  // ══════════════════════════════════════
  skin: [
    { id:"skin_tan",    name:"بيج دافئ",    price:0,   owned:true, icon:"🤎", color:"#F0B882", shadow:"#C88848", rarity:"مجاني",  rarityColor:"#60E8B0" },
    { id:"skin_light",  name:"فاتح ناعم",   price:0,   owned:true, icon:"🤍", color:"#FAD8B0", shadow:"#D8A870", rarity:"مجاني",  rarityColor:"#60E8B0" },
    { id:"skin_medium", name:"وسط طبيعي",   price:150, icon:"🫶",  color:"#D4905A", shadow:"#B06030", rarity:"شائع",   rarityColor:"#C090B8" },
    { id:"skin_dark",   name:"داكن جميل",   price:150, icon:"🖤",  color:"#A06030", shadow:"#783010", rarity:"شائع",   rarityColor:"#C090B8" },
    { id:"skin_deep",   name:"ريتش ديب",    price:200, icon:"🌑",  color:"#6A3018", shadow:"#481808", rarity:"نادر",   rarityColor:"#FF8C42" },
    { id:"skin_golden", name:"ذهبي مشمسي",  price:300, icon:"☀️", color:"#D4A050", shadow:"#A87828", rarity:"خاص",    rarityColor:"#B060E8" },
  ],

  // ══════════════════════════════════════
  // 💇 الشعر
  // ══════════════════════════════════════
  hair: [
    { id:"hair_brown",    name:"بني كلاسيك",     price:0,   owned:true, icon:"🤎", color:"#7A4E24", hl:"#B07840", rarity:"مجاني",  rarityColor:"#60E8B0" },
    { id:"hair_black",    name:"أسود لامع",       price:80,  icon:"🖤",  color:"#1A0A06", hl:"#3A2010", rarity:"شائع",   rarityColor:"#C090B8" },
    { id:"hair_honey",    name:"عسلي بليتش",      price:150, owned:true, icon:"🍯", color:"#C88030", hl:"#E8A850", rarity:"شائع",   rarityColor:"#C090B8" },
    { id:"hair_ash",      name:"رمادي آشي",       price:200, icon:"🩶", color:"#8A8A9A", hl:"#B0B0C0", rarity:"شائع",   rarityColor:"#C090B8" },
    { id:"hair_red",      name:"أحمر كيرة",       price:220, icon:"🔴", color:"#8B1A0A", hl:"#B83010", rarity:"نادر",   rarityColor:"#FF8C42" },
    { id:"hair_pink",     name:"روزي باب",        price:300, icon:"🩷", color:"#C84070", hl:"#E86090", rarity:"نادر",   rarityColor:"#FF8C42" },
    { id:"hair_lavender", name:"لافندر دريمي",    price:350, icon:"💜", color:"#8060B8", hl:"#A080D8", rarity:"خاص",    rarityColor:"#B060E8" },
    { id:"hair_silver",   name:"فضي نجمة",        price:500, icon:"🤍", color:"#909090", hl:"#C0C0C0", rarity:"أسطوري", rarityColor:"#F9C06A" },
    { id:"hair_cobalt",   name:"كوبالت بولد",     price:600, icon:"💙", color:"#1A3AB8", hl:"#3060D8", rarity:"أسطوري", rarityColor:"#F9C06A" },
  ],

  // ══════════════════════════════════════
  // 👚 التوبات
  // ══════════════════════════════════════
  tops: [
    {
      id:"top_ribbed_rose", name:"كروب ريب وردي فاتح", price:0, owned:true,
      icon:"👚", color:"#F2B8C8", style:"realistic", type:"ribbed_crop",
      isCrop:true, rarity:"مجاني", rarityColor:"#60E8B0",
      desc:"توب ريب قصير وخصر عالي — زي غرفة القياس الافتراضية",
    },
    {
      id:"top_tie_white", name:"كروب أبيض بربطة", price:0, owned:true,
      icon:"👚", color:"#FAFAFA", style:"realistic", type:"crop_tie",
      isCrop:true, rarity:"مجاني", rarityColor:"#60E8B0",
      desc:"كروب توب أبيض بتفصيلة ربطة",
    },
    {
      id:"top_silk_cream", name:"بلوزة سيلك كريم", price:0, owned:true,
      icon:"🤍", color:"#F5EDD8", style:"old money",
      rarity:"مجاني", rarityColor:"#60E8B0",
      desc:"بلوزة حرير بوتيك — Old Money",
    },
    {
      id:"crop_rib_black", name:"كروب ريب أسود", price:150,
      icon:"🖤", color:"#1A1A1A", isCrop:true, style:"classic",
      rarity:"شائع", rarityColor:"#C090B8",
      desc:"ريب كروب أسود — الكلاسيك المتكرر",
    },
    {
      id:"top_white_btn", name:"قميص أبيض كلاسيك", price:120,
      icon:"👔", color:"#F0F0F0", style:"classic",
      rarity:"شائع", rarityColor:"#C090B8",
      desc:"Oxford Button-Down — تايملس",
    },
    {
      id:"crop_satin", name:"ساتان كروب وردي", price:320,
      icon:"🌸", color:"#E090A0", type:"bralette", isCrop:true, style:"glam",
      rarity:"نادر", rarityColor:"#FF8C42",
      desc:"ساتان برالت — فاخر وجريء",
    },
    {
      id:"crop_corset", name:"كورسيه كروب", price:280,
      icon:"🎀", color:"#8B1A3A", isCrop:true, style:"glam",
      rarity:"نادر", rarityColor:"#FF8C42",
      desc:"كورسيه شيب كروب — SS2026",
    },
    {
      id:"top_fuchsia", name:"فوشيا هوت", price:300,
      icon:"🩷", color:"#CC0066", style:"bold",
      rarity:"خاص", rarityColor:"#B060E8",
      desc:"Hot Fuchsia — لون 2026 الأبرز",
    },
    {
      id:"top_sequin", name:"توب سيكوين ذهب", price:500, gems: 12,
      icon:"✨", color:"#B8860B", type:"sequin", style:"glamoratti",
      rarity:"أسطوري", rarityColor:"#F9C06A",
      desc:"Gold Sequin — 80s Glam Night Out",
    },
  ],

  // ══════════════════════════════════════
  // 👖 البنطلون
  // ══════════════════════════════════════
  bottoms: [
    {
      id:"pants_pink_cargo", name:"كارجو وردي واسع", price:0, owned:true,
      icon:"🩷", color:"#E8A0C0", isWide:true, isCargo:true, style:"realistic",
      rarity:"مجاني", rarityColor:"#60E8B0",
      desc:"وايد كارجو وردي مع جيوب",
    },
    {
      id:"pants_dark_denim", name:"دارك واش جينز", price:0, owned:true,
      icon:"👖", color:"#1E2D4A", style:"classic",
      rarity:"مجاني", rarityColor:"#60E8B0",
      desc:"Dark Wash Straight — ستريت 2026",
    },
    {
      id:"pants_wide_black", name:"وايد ليج أسود", price:0, owned:true,
      icon:"🖤", color:"#1A1A1A", isWide:true, style:"classic",
      rarity:"مجاني", rarityColor:"#60E8B0",
      desc:"Wide Leg Black — فخم وراقي",
    },
    {
      id:"pants_barrel", name:"بارل ليج بيج", price:220,
      icon:"🪣", color:"#B8A88A", isWide:true, style:"trendy",
      rarity:"شائع", rarityColor:"#C090B8",
      desc:"Barrel Leg — ترند لحظة 2026",
    },
    {
      id:"skirt_mini_black", name:"ميني سكيرت أسود", price:180,
      icon:"🖤", color:"#111111", isSkirt:true, isMini:true, style:"chic",
      rarity:"شائع", rarityColor:"#C090B8",
      desc:"Structured Mini — Marc Jacobs SS26",
    },
    {
      id:"skirt_midi_lilac", name:"ميدي ساتان ليلاك", price:350,
      icon:"💜", color:"#9060C0", isSkirt:true, style:"glam",
      rarity:"خاص", rarityColor:"#B060E8",
      desc:"Lilac Satin Midi — Chloé SS26",
    },
    {
      id:"pants_camel_tai", name:"تروزر كاميل", price:280,
      icon:"🐫", color:"#C4946A", style:"old money",
      rarity:"نادر", rarityColor:"#FF8C42",
      desc:"Tailored Camel — Old Money Signature",
    },
    {
      id:"skirt_maxi_floral", name:"ماكسي فلورال", price:380,
      icon:"🌺", color:"#C05878", isSkirt:true, style:"romantic",
      rarity:"خاص", rarityColor:"#B060E8",
      desc:"Maxi Floral — صيف 2026",
    },
    {
      id:"pants_fuchsia", name:"تروزر فوشيا", price:550, gems: 15,
      icon:"🩷", color:"#CC0066", style:"bold",
      rarity:"أسطوري", rarityColor:"#F9C06A",
      desc:"Fuchsia Power Pants — 2026 Color",
    },
  ],

  // ══════════════════════════════════════
  // 👟 الأحذية
  // ══════════════════════════════════════
  shoes: [
    {
      id:"shoes_pink_runner", name:"سنيكر وردي", price:0, owned:true,
      icon:"👟", color:"#F0C0D8", sole:"#F5F5F5", style:"realistic",
      rarity:"مجاني", rarityColor:"#60E8B0",
      desc:"Pink Runner — ناعم وعملي",
    },
    {
      id:"shoes_white_snkr", name:"سنيكر أبيض", price:0, owned:true,
      icon:"👟", color:"#F5F5F5", sole:"#E0E0E0", style:"casual",
      rarity:"مجاني", rarityColor:"#60E8B0",
      desc:"White Classic — النظيف الأبدي",
    },
    {
      id:"shoes_loafer", name:"لوفر جلد بيج", price:220,
      icon:"🥿", color:"#C4946A", sole:"#5A4028", style:"old money",
      rarity:"شائع", rarityColor:"#C090B8",
      desc:"Leather Loafer — Old Money Staple",
    },
    {
      id:"shoes_ballet", name:"باليت فلاتس وردي", price:200,
      icon:"🩰", color:"#F0A0B8", sole:"#E89098", style:"coquette",
      rarity:"شائع", rarityColor:"#C090B8",
      desc:"Ballet Flats — Coquette Must-Have",
    },
    {
      id:"shoes_boot_black", name:"أنكل بوت أسود", price:280,
      icon:"👢", color:"#1A1A1A", sole:"#0A0A0A", style:"chic",
      rarity:"نادر", rarityColor:"#FF8C42",
      desc:"Pointed Ankle Boot — SS26 Sleek",
    },
    {
      id:"shoes_mule", name:"ميول سيلك كريم", price:300,
      icon:"👡", color:"#EDE8D8", sole:"#A89878", style:"old money",
      rarity:"نادر", rarityColor:"#FF8C42",
      desc:"Satin Mule — Quiet Luxury",
    },
    {
      id:"shoes_strappy", name:"ستراب هيل ذهبي", price:400,
      icon:"👠", color:"#D4A820", sole:"#8A6010", style:"glam",
      rarity:"خاص", rarityColor:"#B060E8",
      desc:"Gold Strappy Heel — Night Out",
    },
    {
      id:"shoes_platform", name:"بلاتفورم أبيض", price:450,
      icon:"🫧", color:"#F0F0F0", sole:"#CCCCCC", style:"Y2K",
      rarity:"أسطوري", rarityColor:"#F9C06A",
      desc:"White Platform — Y2K Comeback",
    },
    {
      id:"shoes_coquette", name:"هيل وردي كوكيت", price:600, gems: 18,
      icon:"🎀", color:"#E090A0", sole:"#C06070", style:"coquette",
      rarity:"أسطوري", rarityColor:"#F9C06A",
      desc:"Baby Pink Heel — Coquette Dream",
    },
  ],

  // ══════════════════════════════════════
  // 💎 الإكسسوارات
  // ══════════════════════════════════════
  accessories: [
    { id:"acc_none",   name:"بدون إكسسوار",  price:0,   owned:true, icon:"⭕", id2:"a_none",   rarity:"مجاني",  rarityColor:"#60E8B0" },
    { id:"acc_grad",   name:"قبعة تخرج",     price:0,   owned:true, icon:"🎓", id2:"a_grad",   rarity:"مجاني",  rarityColor:"#60E8B0" },
    { id:"acc_pearl",  name:"عقد لؤلؤ",      price:250, icon:"🦪",  id2:"a_pearl",  rarity:"شائع",   rarityColor:"#C090B8" },
    { id:"acc_flower", name:"زهرة في الشعر", price:200, icon:"🌸",  id2:"a_flower", rarity:"شائع",   rarityColor:"#C090B8" },
    { id:"acc_crown",  name:"تاج ذهبي",      price:450, icon:"👑",  id2:"a_crown",  rarity:"نادر",   rarityColor:"#FF8C42" },
    { id:"acc_halo",   name:"هالة فضية",     price:700, icon:"😇",  id2:"a_halo",   rarity:"أسطوري", rarityColor:"#F9C06A" },
  ],
};

// ══════════════════════════════════════
// DEFAULT OUTFIT
// ══════════════════════════════════════
export const DEFAULT_OUTFIT = {
  skin:        "skin_tan",
  hair:        "hair_honey",
  tops:        "top_ribbed_rose",
  bottoms:     "pants_pink_cargo",
  shoes:       "shoes_pink_runner",
  accessories: "acc_none",
};

export const STORE_DOC = "avatar_store_maha";

// ══════════════════════════════════════
// STYLE COLLECTIONS
// ══════════════════════════════════════
export const STYLE_COLLECTIONS = [
  { id:"all",        label:"🛍️ الكل",        color:"#FF5FA0" },
  { id:"old money",  label:"💰 Old Money",    color:"#D4A050" },
  { id:"realistic",  label:"👗 واقعي",        color:"#E8A0C0" },
  { id:"glamoratti", label:"✨ Glamoratti",   color:"#B060E8" },
  { id:"classic",    label:"🎩 كلاسيك",       color:"#60E8B0" },
  { id:"bold",       label:"🔥 بولد",         color:"#1A5AD4" },
  { id:"coquette",   label:"🎀 Coquette",     color:"#E090A0" },
  { id:"glam",       label:"💎 Glam",         color:"#F9C06A" },
];

// ══════════════════════════════════════
// HELPERS
// ══════════════════════════════════════
export function getDefaultOwned() {
  const owned = new Set();
  Object.values(STORE_CATALOG).forEach(items =>
    items.filter(i => i.owned).forEach(i => owned.add(i.id))
  );
  return owned;
}