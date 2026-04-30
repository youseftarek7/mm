import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/* ══════════════════════════════════════════════════════════════
   MAHA AVATAR STORE — Snapchat Bitmoji Style
   Realistic 3D-looking avatar + Premium store UI
   ══════════════════════════════════════════════════════════════ */

const STORE_CATALOG = {
  tops: [
    { id: "top_white_tie", name: "كروب ريب وردي فاتح", price: 0, owned: true, equipped: true,
      color: "#F9C8D8", shadow: "#E8A0B8", stripe: null, type: "crop_rib",
      tag: "مجاني", tagColor: "#4ADE80", desc: "توب ريب قصير وخصر عالي — زي غرفة القياس" },
    { id: "top_white_btn", name: "كروب أبيض ساطع", price: 0, owned: true,
      color: "#F5F5F5", shadow: "#D8D8D8", type: "crop_basic",
      tag: "مجاني", tagColor: "#4ADE80", desc: "كروب توب بسيط أبيض ناصع" },
    { id: "top_black_crop", name: "كروب ريب أسود", price: 120,
      color: "#1A1A2E", shadow: "#0D0D1A", type: "crop_rib",
      tag: "شائع", tagColor: "#94A3B8", desc: "كروب ريب أسود — أساسي اليومين دول" },
    { id: "top_pink_satin", name: "ساتان بالغ الروعة", price: 350,
      color: "#F472B6", shadow: "#DB2777", type: "bralette",
      tag: "نادر", tagColor: "#FB923C", desc: "ساتان وردي ناعم — بريق في كل مكان" },
    { id: "top_corset_wine", name: "كورسيه كلاسيك", price: 480,
      color: "#881337", shadow: "#4C0519", type: "corset",
      tag: "نادر", tagColor: "#FB923C", desc: "كورسيه بيرجندي — glamour أصيل" },
    { id: "top_cream_silk", name: "بلوزة سيلك كريم", price: 290,
      color: "#FEF3C7", shadow: "#D97706", type: "blouse",
      tag: "شائع", tagColor: "#94A3B8", desc: "حرير كريمي ناعم — Old Money بشكل" },
    { id: "top_sequin_gold", name: "سيكوين ذهبي ✨", price: 700,
      color: "#D97706", shadow: "#92400E", type: "sequin",
      tag: "أسطوري", tagColor: "#FBBF24", desc: "ألف نجمة على جسمك — حفلة أحلام" },
    { id: "top_cobalt", name: "كروب كوبالت", price: 400,
      color: "#1D4ED8", shadow: "#1E3A8A", type: "crop_basic",
      tag: "خاص", tagColor: "#A78BFA", desc: "أزرق كوبالت — Electric 2026" },
  ],
  bottoms: [
    { id: "bot_pink_cargo", name: "كارجو وايد وردي", price: 0, owned: true, equipped: true,
      color: "#FBCFE8", shadow: "#EC4899", type: "cargo",
      tag: "مجاني", tagColor: "#4ADE80", desc: "كارجو واسع وردي — جيوب + بنطلون مريح" },
    { id: "bot_dark_denim", name: "جينز دارك ستريت", price: 180,
      color: "#1E3A5F", shadow: "#0F1F3D", type: "jeans",
      tag: "شائع", tagColor: "#94A3B8", desc: "جينز داكن ضيق — الأساسي الأنيق" },
    { id: "bot_white_wide", name: "وايد ليج أبيض", price: 220,
      color: "#F1F5F9", shadow: "#CBD5E1", type: "wide_leg",
      tag: "شائع", tagColor: "#94A3B8", desc: "وايد ليج أبيض — Summer clean" },
    { id: "bot_black_mini", name: "ميني سكيرت أسود", price: 200,
      color: "#0F172A", shadow: "#020617", type: "mini_skirt",
      tag: "شائع", tagColor: "#94A3B8", desc: "ميني سكيرت أسود — تايملس كلاسيك" },
    { id: "bot_lilac_midi", name: "ميدي ليلاك ساتان", price: 380,
      color: "#7C3AED", shadow: "#4C1D95", type: "midi_skirt",
      tag: "نادر", tagColor: "#FB923C", desc: "ميدي ساتان بنفسجي — رقي بلا حدود" },
    { id: "bot_camel_tai", name: "تيلور كاميل فاخر", price: 320,
      color: "#B45309", shadow: "#78350F", type: "trousers",
      tag: "شائع", tagColor: "#94A3B8", desc: "تروزر كاميل — Old Money Signature" },
    { id: "bot_fuchsia_pwr", name: "فوشيا Power 2026", price: 600,
      color: "#BE185D", shadow: "#831843", type: "trousers",
      tag: "أسطوري", tagColor: "#FBBF24", desc: "Power Color 2026 — لا أحد يمرّ بك" },
  ],
  shoes: [
    { id: "shoe_pink_runner", name: "سنيكر وردي ناعم", price: 0, owned: true, equipped: true,
      color: "#FBCFE8", shadow: "#F9A8D4", sole: "#FFF", type: "sneaker",
      tag: "مجاني", tagColor: "#4ADE80", desc: "سنيكر وردي خفيف — كل يوم" },
    { id: "shoe_white_classic", name: "سنيكر أبيض كلاسيك", price: 200,
      color: "#F8FAFC", shadow: "#E2E8F0", sole: "#E2E8F0", type: "sneaker",
      tag: "شائع", tagColor: "#94A3B8", desc: "أبيض نظيف — never gets old" },
    { id: "shoe_gold_heel", name: "كعب ذهبي ستراب", price: 550,
      color: "#D97706", shadow: "#92400E", sole: "#78350F", type: "heel",
      tag: "أسطوري", tagColor: "#FBBF24", desc: "ذهب من كعب للرأس — ليلة لا تُنسى" },
    { id: "shoe_black_boot", name: "أنكل بوت أسود", price: 340,
      color: "#0F172A", shadow: "#020617", sole: "#1E293B", type: "boot",
      tag: "نادر", tagColor: "#FB923C", desc: "بوت أسود حاد — موضة الموسم" },
    { id: "shoe_ballet_pink", name: "باليت فلات وردي", price: 240,
      color: "#FDA4AF", shadow: "#FB7185", sole: "#FCA5A5", type: "ballet",
      tag: "شائع", tagColor: "#94A3B8", desc: "Coquette Must-Have" },
    { id: "shoe_tan_loafer", name: "لوفر جلد تان", price: 280,
      color: "#D97706", shadow: "#92400E", sole: "#451A03", type: "loafer",
      tag: "شائع", tagColor: "#94A3B8", desc: "Old Money لوفر — كل outfit" },
    { id: "shoe_platform", name: "بلاتفورم أبيض Y2K", price: 450,
      color: "#F1F5F9", shadow: "#94A3B8", sole: "#64748B", type: "platform",
      tag: "خاص", tagColor: "#A78BFA", desc: "Y2K Comeback 2026 — bold!" },
  ],
  hair: [
    { id: "hair_brown_wavy", name: "بني متموج طويل", price: 0, owned: true, equipped: true,
      color: "#92400E", mid: "#B45309", high: "#D97706",
      tag: "مجاني", tagColor: "#4ADE80" },
    { id: "hair_black_sleek", name: "أسود ناعم لامع", price: 120,
      color: "#0F172A", mid: "#1E293B", high: "#334155",
      tag: "شائع", tagColor: "#94A3B8" },
    { id: "hair_honey_blond", name: "هاني بلوند", price: 200,
      color: "#B45309", mid: "#D97706", high: "#F59E0B",
      tag: "شائع", tagColor: "#94A3B8" },
    { id: "hair_cherry_red", name: "أحمر كيرة", price: 300,
      color: "#881337", mid: "#9F1239", high: "#E11D48",
      tag: "نادر", tagColor: "#FB923C" },
    { id: "hair_pink_dream", name: "وردي Dreamy", price: 360,
      color: "#BE185D", mid: "#DB2777", high: "#F472B6",
      tag: "نادر", tagColor: "#FB923C" },
    { id: "hair_lavender", name: "لافندر ✨", price: 420,
      color: "#5B21B6", mid: "#7C3AED", high: "#A78BFA",
      tag: "خاص", tagColor: "#A78BFA" },
    { id: "hair_silver", name: "فضي نجمة", price: 600,
      color: "#475569", mid: "#64748B", high: "#94A3B8",
      tag: "أسطوري", tagColor: "#FBBF24" },
  ],
  accessories: [
    { id: "acc_none", name: "بدون", price: 0, owned: true, equipped: true, icon: "—", tag: "مجاني", tagColor: "#4ADE80" },
    { id: "acc_grad", name: "قبعة تخرج", price: 0, owned: true, icon: "🎓", tag: "مجاني", tagColor: "#4ADE80" },
    { id: "acc_pearl", name: "عقد لؤلؤ", price: 220, icon: "🦪", tag: "شائع", tagColor: "#94A3B8" },
    { id: "acc_sunnies", name: "نظارة أوفرسايز", price: 230, icon: "🕶", tag: "شائع", tagColor: "#94A3B8" },
    { id: "acc_crown", name: "تاج ذهبي 👑", price: 480, icon: "👑", tag: "نادر", tagColor: "#FB923C" },
    { id: "acc_halo", name: "هالة ملاك", price: 750, icon: "😇", tag: "أسطوري", tagColor: "#FBBF24" },
    { id: "acc_star", name: "كليب نجمة", price: 290, icon: "⭐", tag: "خاص", tagColor: "#A78BFA" },
    { id: "acc_flower", name: "زهرة شعر", price: 180, icon: "🌸", tag: "شائع", tagColor: "#94A3B8" },
  ],
  skin: [
    { id: "skin_tan", name: "بيج دافئ", price: 0, owned: true, equipped: true, color: "#FDBA74", shadow: "#F97316", tag: "مجاني", tagColor: "#4ADE80" },
    { id: "skin_light", name: "فاتح بورسيلان", price: 0, owned: true, color: "#FDE68A", shadow: "#F59E0B", tag: "مجاني", tagColor: "#4ADE80" },
    { id: "skin_medium", name: "ميديوم ذهبي", price: 150, color: "#F97316", shadow: "#C2410C", tag: "شائع", tagColor: "#94A3B8" },
    { id: "skin_deep", name: "ديب ريتش", price: 200, color: "#92400E", shadow: "#451A03", tag: "نادر", tagColor: "#FB923C" },
  ],
};

// ─── Shade helper ──────────────────────────────────────────────
const sh = (hex = "#888", pct = 0) => {
  try {
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map(x => x + x).join("");
    const n = parseInt(c, 16);
    const clamp = v => Math.min(255, Math.max(0, v));
    const r = clamp((n >> 16) + Math.round(2.55 * pct));
    const g = clamp(((n >> 8) & 0xff) + Math.round(2.55 * pct));
    const b = clamp((n & 0xff) + Math.round(2.55 * pct));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  } catch { return hex; }
};

/* ══════════════════════════════════════════════════════════════
   SNAPCHAT BITMOJI-STYLE AVATAR — Realistic + Charming
   Key: round face, big eyes, soft skin, detailed clothes
   ══════════════════════════════════════════════════════════════ */
function BitmojiAvatar({ outfit, bounce = false }) {
  const topItem = STORE_CATALOG.tops.find(i => i.id === outfit.tops) || STORE_CATALOG.tops[0];
  const botItem = STORE_CATALOG.bottoms.find(i => i.id === outfit.bottoms) || STORE_CATALOG.bottoms[0];
  const shoeItem = STORE_CATALOG.shoes.find(i => i.id === outfit.shoes) || STORE_CATALOG.shoes[0];
  const hairItem = STORE_CATALOG.hair.find(i => i.id === outfit.hair) || STORE_CATALOG.hair[0];
  const skinItem = STORE_CATALOG.skin.find(i => i.id === outfit.skin) || STORE_CATALOG.skin[0];
  const accItem = STORE_CATALOG.accessories.find(i => i.id === outfit.accessories) || STORE_CATALOG.accessories[0];

  const sk = skinItem.color;
  const skS = skinItem.shadow;
  const hr = hairItem.color;
  const hrM = hairItem.mid;
  const hrH = hairItem.high;

  return (
    <svg viewBox="0 0 320 580" width="220" height="400"
      style={{
        filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.5))",
        animation: bounce ? "avatar-bounce 2.2s ease-in-out infinite" : "none",
        display: "block",
      }}>
      <defs>
        {/* Skin */}
        <radialGradient id="gSkinFace" cx="42%" cy="32%" r="62%">
          <stop offset="0%" stopColor={sh(sk, 22)} />
          <stop offset="55%" stopColor={sk} />
          <stop offset="100%" stopColor={skS} />
        </radialGradient>
        <radialGradient id="gSkinBody" cx="30%" cy="25%" r="70%">
          <stop offset="0%" stopColor={sh(sk, 12)} />
          <stop offset="100%" stopColor={sh(skS, -10)} />
        </radialGradient>
        {/* Hair */}
        <linearGradient id="gHair" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor={hrH} />
          <stop offset="45%" stopColor={hrM} />
          <stop offset="100%" stopColor={sh(hr, -30)} />
        </linearGradient>
        <linearGradient id="gHairR" x1="85%" y1="0%" x2="15%" y2="100%">
          <stop offset="0%" stopColor={hrH} />
          <stop offset="45%" stopColor={hrM} />
          <stop offset="100%" stopColor={sh(hr, -30)} />
        </linearGradient>
        {/* Top */}
        <linearGradient id="gTop" x1="8%" y1="0%" x2="92%" y2="100%">
          <stop offset="0%" stopColor={sh(topItem.color, 22)} />
          <stop offset="55%" stopColor={topItem.color} />
          <stop offset="100%" stopColor={topItem.shadow} />
        </linearGradient>
        <linearGradient id="gTopShd" x1="0%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={sh(topItem.color, -5)} />
          <stop offset="100%" stopColor={sh(topItem.shadow, -20)} />
        </linearGradient>
        {/* Bottom */}
        <linearGradient id="gBot" x1="8%" y1="0%" x2="92%" y2="100%">
          <stop offset="0%" stopColor={sh(botItem.color, 20)} />
          <stop offset="55%" stopColor={botItem.color} />
          <stop offset="100%" stopColor={botItem.shadow} />
        </linearGradient>
        <linearGradient id="gBotL" x1="0%" y1="0%" x2="35%" y2="100%">
          <stop offset="0%" stopColor={sh(botItem.color, 15)} />
          <stop offset="100%" stopColor={botItem.shadow} />
        </linearGradient>
        <linearGradient id="gBotR" x1="100%" y1="0%" x2="65%" y2="100%">
          <stop offset="0%" stopColor={botItem.color} />
          <stop offset="100%" stopColor={sh(botItem.shadow, -15)} />
        </linearGradient>
        {/* Shoe */}
        <linearGradient id="gShoe" x1="5%" y1="0%" x2="95%" y2="100%">
          <stop offset="0%" stopColor={sh(shoeItem.color, 25)} />
          <stop offset="100%" stopColor={shoeItem.shadow} />
        </linearGradient>
        {/* Specular */}
        <linearGradient id="gSpec" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.40)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        {/* Eye */}
        <radialGradient id="gEye" cx="33%" cy="28%" r="66%">
          <stop offset="0%" stopColor="#4B8CC8" />
          <stop offset="60%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </radialGradient>
        <filter id="fSkin" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor={skS} floodOpacity="0.35" />
        </filter>
        <filter id="fCloth" x="-12%" y="-8%" width="124%" height="124%">
          <feDropShadow dx="1" dy="5" stdDeviation="6" floodColor="rgba(0,0,0,0.45)" />
        </filter>
        <filter id="fHair" x="-15%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="rgba(0,0,0,0.4)" />
        </filter>
        <filter id="fEye">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>

      {/* ── HAIR BACK ── */}
      <g filter="url(#fHair)">
        {/* Long flowing left */}
        <path d="M88 112 Q58 148 50 210 Q42 265 46 320 Q50 365 56 410 Q60 440 66 465"
          stroke="url(#gHair)" strokeWidth="28" fill="none" strokeLinecap="round" />
        <path d="M92 112 Q64 152 58 215 Q52 268 56 325"
          stroke={sh(hr, -18)} strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.6" />
        {/* Long flowing right */}
        <path d="M232 112 Q262 148 270 210 Q278 265 274 320 Q270 365 264 410 Q260 440 254 465"
          stroke="url(#gHairR)" strokeWidth="28" fill="none" strokeLinecap="round" />
        <path d="M228 112 Q256 152 262 215 Q268 268 264 325"
          stroke={sh(hr, -18)} strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.6" />
        {/* Back volume */}
        <path d="M140 95 Q118 138 116 225 Q114 285 118 355"
          stroke={sh(hr, -12)} strokeWidth="20" fill="none" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* ── NECK ── */}
      <path d="M126 182 Q124 198 122 214 L198 214 Q196 198 194 182Z"
        fill="url(#gSkinBody)" />
      <path d="M128 186 Q126 200 124 212" stroke={skS} strokeWidth="2" fill="none" opacity="0.3" />
      <path d="M192 186 Q194 200 196 212" stroke={skS} strokeWidth="2" fill="none" opacity="0.3" />

      {/* ── BODY + CLOTHES ── */}
      {renderTopCloth(topItem)}
      {renderArms(topItem)}
      {renderBottomCloth(botItem)}
      {renderShoesPair(shoeItem)}

      {/* ── HEAD — Bitmoji style: big round, cute ── */}
      <g filter="url(#fSkin)">
        {/* Head oval - wider at cheeks */}
        <ellipse cx="160" cy="108" rx="72" ry="82" fill="url(#gSkinFace)" />
        {/* Cheek puff left */}
        <ellipse cx="96" cy="120" rx="18" ry="15" fill={sh(sk, 8)} opacity="0.5" />
        {/* Cheek puff right */}
        <ellipse cx="224" cy="120" rx="18" ry="15" fill={sh(sk, 8)} opacity="0.5" />
        {/* Chin shape */}
        <ellipse cx="160" cy="175" rx="44" ry="18" fill={sh(sk, -6)} opacity="0.3" />
      </g>

      {/* ── HAIR FRONT ── */}
      <g filter="url(#fHair)">
        {/* Main hair cap */}
        <path d="M88 110 Q94 52 160 44 Q226 52 232 110 Q210 86 160 82 Q110 86 88 110Z"
          fill="url(#gHair)" />
        {/* Top volume */}
        <path d="M90 112 Q72 130 76 162 Q82 140 94 124Z"
          fill="url(#gHair)" opacity="0.9" />
        <path d="M230 112 Q248 130 244 162 Q238 140 226 124Z"
          fill="url(#gHairR)" opacity="0.9" />
        {/* Hairline */}
        <path d="M90 113 Q94 66 160 58 Q226 66 230 113 Q210 80 160 76 Q110 80 90 113Z"
          fill={sh(hr, -10)} opacity="0.65" />
        {/* Highlight strand */}
        <path d="M116 58 Q142 50 172 58" stroke={hrH} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.55" />
        <path d="M126 54 Q160 46 194 54" stroke="rgba(255,255,255,0.22)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* Bangs/side volumes */}
        <path d="M88 113 Q70 130 74 158 Q78 138 88 122Z" fill={hrM} opacity="0.8" />
        <path d="M232 113 Q250 130 246 158 Q242 138 232 122Z" fill={hrM} opacity="0.8" />
      </g>

      {/* ── FACIAL FEATURES ── */}
      {/* Eyebrows — slightly arched, thick */}
      <path d="M110 80 Q124 70 140 74" stroke={sh(hr, -40)} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M180 74 Q196 70 210 80" stroke={sh(hr, -40)} strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* ── EYES — Big Bitmoji eyes ── */}
      <g filter="url(#fEye)">
        {/* Left eye white */}
        <ellipse cx="122" cy="106" rx="18" ry="17" fill="#FEFFFE" />
        {/* Left iris */}
        <ellipse cx="122" cy="108" rx="13" ry="14" fill="url(#gEye)" />
        {/* Left pupil */}
        <circle cx="122" cy="109" r="8.5" fill="#060A14" />
        {/* Catchlight big */}
        <circle cx="126" cy="104" r="4.5" fill="rgba(255,255,255,0.95)" />
        {/* Catchlight small */}
        <circle cx="118" cy="113" r="2" fill="rgba(255,255,255,0.55)" />
        {/* Eyelash top */}
        <path d="M104 94 Q112 86 122 88 Q132 86 140 94" stroke="#0A0612" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* Eyelash bottom */}
        <path d="M106 120 Q114 125 122 126 Q130 125 138 120" stroke={skS} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.4" />

        {/* Right eye white */}
        <ellipse cx="198" cy="106" rx="18" ry="17" fill="#FEFFFE" />
        {/* Right iris */}
        <ellipse cx="198" cy="108" rx="13" ry="14" fill="url(#gEye)" />
        {/* Right pupil */}
        <circle cx="198" cy="109" r="8.5" fill="#060A14" />
        {/* Catchlight big */}
        <circle cx="202" cy="104" r="4.5" fill="rgba(255,255,255,0.95)" />
        {/* Catchlight small */}
        <circle cx="194" cy="113" r="2" fill="rgba(255,255,255,0.55)" />
        {/* Eyelash top */}
        <path d="M180 94 Q188 86 198 88 Q208 86 216 94" stroke="#0A0612" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M182 120 Q190 125 198 126 Q206 125 214 120" stroke={skS} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.4" />
      </g>

      {/* Nose — small button */}
      <path d="M160 128 Q152 142 155 150 Q160 154 165 150 Q168 142 160 128Z" fill={skS} opacity="0.22" />
      <path d="M155 150 Q157 153 160 154 Q163 153 165 150" stroke={skS} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.5" />
      <ellipse cx="153" cy="149" rx="7" ry="4" fill={skS} opacity="0.18" />
      <ellipse cx="167" cy="149" rx="7" ry="4" fill={skS} opacity="0.18" />

      {/* Lips — full, glossy */}
      <path d="M130 164 Q144 155 160 154 Q176 155 190 164 Q180 174 160 176 Q140 174 130 164Z"
        fill={sh(sk, -14)} />
      <path d="M134 163 Q147 157 160 156 Q173 157 186 163"
        fill="none" stroke="rgba(180,60,80,0.5)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M140 159 Q160 155 180 159" stroke="rgba(255,200,210,0.45)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M134 168 Q147 174 160 175 Q173 174 186 168" fill="none" stroke={sh(sk, -20)} strokeWidth="1.8" strokeLinecap="round" opacity="0.45" />

      {/* Cheek blush */}
      <ellipse cx="96" cy="128" rx="20" ry="13" fill="rgba(255,130,100,0.28)" />
      <ellipse cx="224" cy="128" rx="20" ry="13" fill="rgba(255,130,100,0.28)" />

      {/* Ear */}
      <ellipse cx="90" cy="112" rx="10" ry="16" fill="url(#gSkinFace)" />
      <ellipse cx="230" cy="112" rx="10" ry="16" fill="url(#gSkinFace)" />

      {/* ── ACCESSORY ── */}
      {renderAccessory(accItem)}

    </svg>
  );

  /* ── TOP CLOTHING ── */
  function renderTopCloth(item) {
    const tc = item.color;
    const ta = item.shadow;
    const isCrop = ["crop_rib", "crop_basic", "bralette", "corset"].includes(item.type);
    const bodyEnd = isCrop ? 310 : 350;

    const shoulders = (
      <g filter="url(#fCloth)">
        <ellipse cx="100" cy="236" rx="26" ry="17" fill="url(#gTop)" />
        <ellipse cx="220" cy="236" rx="26" ry="17" fill="url(#gTop)" />
      </g>
    );

    let body;
    switch (item.type) {
      case "crop_rib":
        body = (
          <g filter="url(#fCloth)">
            <path d="M106 222 Q92 238 88 262 L88 308 Q112 322 160 324 Q208 322 232 308 L232 262 Q228 238 214 222 Q190 208 160 206 Q130 208 106 222Z"
              fill="url(#gTop)" />
            {[240, 254, 268, 282, 296].map(y => (
              <path key={y} d={`M90 ${y} Q160 ${y + 2} 230 ${y}`} stroke={ta} strokeWidth="2" fill="none" opacity="0.28" />
            ))}
            <path d="M108 224 Q125 218 144 221" stroke="rgba(255,255,255,0.38)" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M88 308 Q114 322 160 325 Q206 322 232 308" stroke={ta} strokeWidth="3" fill="none" opacity="0.7" />
          </g>
        );
        break;
      case "bralette":
        body = (
          <g filter="url(#fCloth)">
            <path d="M110 222 Q98 238 96 262 L96 308 Q118 320 160 322 Q202 320 224 308 L224 262 Q222 238 210 222 Q188 208 160 206 Q132 208 110 222Z"
              fill="url(#gTop)" />
            <path d="M110 224 Q126 216 144 220" stroke="rgba(255,255,255,0.5)" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M176 220 Q194 216 210 224" stroke="rgba(255,255,255,0.35)" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M98 305 Q118 318 160 320 Q202 318 222 305" stroke={ta} strokeWidth="2.5" fill="none" opacity="0.7" />
            <circle cx="160" cy="224" r="7" fill={sh(tc, 22)} />
          </g>
        );
        break;
      case "corset":
        body = (
          <g filter="url(#fCloth)">
            <path d="M104 222 Q90 240 86 266 L86 314 Q110 326 160 328 Q210 326 234 314 L234 266 Q230 240 216 222 Q190 206 160 204 Q130 206 104 222Z"
              fill="url(#gTop)" />
            {[114, 130, 148, 168, 186, 202].map((x, i) => (
              <line key={i} x1={x} y1={226} x2={x + (i < 3 ? -3 : 3)} y2={312}
                stroke={sh(ta, -20)} strokeWidth="2" opacity="0.38" />
            ))}
            <path d="M118 224 Q138 215 160 217 Q182 215 202 224" stroke={sh(tc, 25)} strokeWidth="3" fill="none" />
            <path d="M106 272 Q132 280 160 282 Q188 280 214 272" stroke={sh(tc, 15)} strokeWidth="2" fill="none" opacity="0.55" />
            <line x1="160" y1="220" x2="160" y2="326" stroke={sh(ta, -30)} strokeWidth="3" opacity="0.5" />
          </g>
        );
        break;
      case "sequin":
        body = (
          <g filter="url(#fCloth)">
            <path d="M102 222 Q88 240 84 266 L84 318 Q108 332 160 334 Q212 332 236 318 L236 266 Q232 240 218 222 Q192 206 160 204 Q128 206 102 222Z"
              fill="url(#gTop)" />
            {Array.from({ length: 50 }, (_, i) => {
              const x = 95 + (i % 9) * 16 + Math.sin(i * 0.9) * 5;
              const y = 226 + Math.floor(i / 9) * 14 + Math.cos(i * 1.2) * 4;
              return <ellipse key={i} cx={x} cy={y} rx="5.5" ry="4.5"
                fill={i % 3 === 0 ? sh(tc, 45) : i % 3 === 1 ? "rgba(255,255,255,0.75)" : sh(tc, 22)}
                opacity={0.45 + Math.abs(Math.sin(i)) * 0.4} />;
            })}
          </g>
        );
        break;
      case "blouse":
        body = (
          <g filter="url(#fCloth)">
            <path d="M100 222 Q86 240 82 268 L82 322 Q108 336 160 338 Q212 336 238 322 L238 268 Q234 240 220 222 Q192 204 160 202 Q128 204 100 222Z"
              fill="url(#gTop)" />
            <path d="M90 248 Q86 278 88 310" stroke={ta} strokeWidth="4" fill="none" opacity="0.22" />
            <path d="M230 248 Q234 278 232 310" stroke={ta} strokeWidth="4" fill="none" opacity="0.22" />
            <path d="M124 222 Q138 214 160 216 Q182 214 196 222" fill={sh(tc, -14)} opacity="0.6" />
            <line x1="160" y1="220" x2="160" y2="332" stroke={ta} strokeWidth="2" opacity="0.3" />
            {[246, 268, 290, 312].map(y => (
              <circle key={y} cx={160} cy={y} r="4.5" fill={ta} opacity="0.75" />
            ))}
            <path d="M104 224 Q122 218 138 220" stroke="rgba(255,255,255,0.45)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </g>
        );
        break;
      default:
        body = (
          <g filter="url(#fCloth)">
            <path d="M106 222 Q92 240 88 266 L88 312 Q112 326 160 328 Q208 326 232 312 L232 266 Q228 240 214 222 Q190 206 160 204 Q130 206 106 222Z"
              fill="url(#gTop)" />
            <path d="M108 224 Q126 218 144 220" stroke="rgba(255,255,255,0.32)" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M90 310 Q114 324 160 326 Q206 324 230 310" stroke={ta} strokeWidth="3" fill="none" opacity="0.65" />
          </g>
        );
    }
    return <>{shoulders}{body}</>;
  }

  /* ── ARMS ── */
  function renderArms(item) {
    const tc = item.color;
    const ta = item.shadow;
    const longSleeve = item.type === "blouse";

    if (longSleeve) {
      return (
        <g filter="url(#fCloth)">
          <path d="M90 238 Q66 270 54 310 Q46 340 46 362" stroke="url(#gTop)" strokeWidth="34" fill="none" strokeLinecap="round" />
          <path d="M56 318 Q48 346 46 368" stroke={ta} strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.25" />
          <ellipse cx="46" cy="372" rx="16" ry="14" fill="url(#gSkinBody)" transform="rotate(-14 46 372)" />
          <path d="M230 238 Q254 270 266 310 Q274 340 274 362" stroke="url(#gTop)" strokeWidth="34" fill="none" strokeLinecap="round" />
          <path d="M264 318 Q272 346 274 368" stroke={ta} strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.25" />
          <ellipse cx="274" cy="372" rx="16" ry="14" fill="url(#gSkinBody)" transform="rotate(14 274 372)" />
        </g>
      );
    }
    return (
      <g>
        {/* Left arm + shoulder cap */}
        <path d="M88 236 Q64 264 52 308 Q44 340 44 368"
          stroke="url(#gSkinBody)" strokeWidth="32" fill="none" strokeLinecap="round" />
        <path d="M88 236 Q78 252 74 266"
          stroke="url(#gTop)" strokeWidth="28" fill="none" strokeLinecap="round" />
        <path d="M68 270 Q56 305 50 340"
          stroke={sh(sk, -18)} strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.3" />
        {/* Left hand */}
        <ellipse cx="44" cy="374" rx="15" ry="13" fill="url(#gSkinBody)" transform="rotate(-14 44 374)" />
        <path d="M32 369 Q28 358 30 348" stroke="url(#gSkinBody)" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M37 367 Q33 356 35 345" stroke="url(#gSkinBody)" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M43 366 Q40 354 42 343" stroke="url(#gSkinBody)" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M49 367 Q48 356 50 346" stroke="url(#gSkinBody)" strokeWidth="7.5" fill="none" strokeLinecap="round" />
        <path d="M55 370 Q56 360 58 352" stroke="url(#gSkinBody)" strokeWidth="7" fill="none" strokeLinecap="round" />
        {/* Right arm */}
        <path d="M232 236 Q256 264 268 308 Q276 340 276 368"
          stroke="url(#gSkinBody)" strokeWidth="32" fill="none" strokeLinecap="round" />
        <path d="M232 236 Q242 252 246 266"
          stroke="url(#gTop)" strokeWidth="28" fill="none" strokeLinecap="round" />
        <path d="M252 270 Q264 305 270 340"
          stroke={sh(sk, -18)} strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.3" />
        <ellipse cx="276" cy="374" rx="15" ry="13" fill="url(#gSkinBody)" transform="rotate(14 276 374)" />
        <path d="M288 369 Q292 358 290 348" stroke="url(#gSkinBody)" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M283 367 Q287 356 285 345" stroke="url(#gSkinBody)" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M277 366 Q280 354 278 343" stroke="url(#gSkinBody)" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M271 367 Q272 356 270 346" stroke="url(#gSkinBody)" strokeWidth="7.5" fill="none" strokeLinecap="round" />
        <path d="M265 370 Q264 360 262 352" stroke="url(#gSkinBody)" strokeWidth="7" fill="none" strokeLinecap="round" />
      </g>
    );
  }

  /* ── BOTTOM ── */
  function renderBottomCloth(item) {
    const bc = item.color;
    const ba = item.shadow;
    const waist = 322;
    const isSkirt = item.type.includes("skirt");
    const isWide = item.type === "wide_leg" || item.type === "cargo" || item.type === "trousers";
    const isCargo = item.type === "cargo";
    const legBot = 510;
    const legW = isWide ? 44 : 32;
    const spread = isWide ? 28 : 18;

    if (isSkirt) {
      const isMini = item.type === "mini_skirt";
      const sLen = isMini ? 120 : 200;
      const skinVisible = isMini;
      return (
        <g filter="url(#fCloth)">
          <rect x="106" y={waist} width="108" height="18" rx="7" fill={sh(bc, 22)} />
          <path d={`M98 ${waist + 16} Q82 ${waist + sLen / 2} 80 ${waist + sLen} Q108 ${waist + sLen + 18} 160 ${waist + sLen + 20} Q212 ${waist + sLen + 18} 240 ${waist + sLen} Q238 ${waist + sLen / 2} 222 ${waist + 16}Z`}
            fill="url(#gBot)" />
          <path d={`M104 ${waist + 22} Q90 ${waist + sLen / 2} 92 ${waist + sLen}`} stroke={sh(bc, -20)} strokeWidth="2.5" fill="none" opacity="0.3" />
          <path d={`M216 ${waist + 22} Q230 ${waist + sLen / 2} 228 ${waist + sLen}`} stroke={sh(bc, -20)} strokeWidth="2.5" fill="none" opacity="0.3" />
          <path d={`M82 ${waist + sLen + 2} Q108 ${waist + sLen + 20} 160 ${waist + sLen + 22} Q212 ${waist + sLen + 20} 238 ${waist + sLen + 2}`}
            stroke={ba} strokeWidth="3" fill="none" opacity="0.7" />
          {skinVisible && (
            <>
              <path d={`M110 ${waist + sLen + 10} Q100 ${legBot} 95 ${legBot + 10}`}
                stroke="url(#gSkinBody)" strokeWidth="38" fill="none" strokeLinecap="round" />
              <path d={`M210 ${waist + sLen + 10} Q220 ${legBot} 225 ${legBot + 10}`}
                stroke="url(#gSkinBody)" strokeWidth="38" fill="none" strokeLinecap="round" />
            </>
          )}
        </g>
      );
    }

    return (
      <g filter="url(#fCloth)">
        {/* Waistband */}
        <rect x="96" y={waist} width="128" height="20" rx="8" fill={sh(bc, 22)} />
        <rect x="96" y={waist} width="128" height="12" rx="7" fill={sh(bc, 32)} opacity="0.45" />
        {/* Belt buckle */}
        <rect x="130" y={waist + 2} width="60" height="12" rx="4" fill={sh(bc, -12)} opacity="0.7" />
        <circle cx="160" cy={waist + 8} r="6.5" fill={sh(bc, -35)} />
        <circle cx="160" cy={waist + 8} r="3.5" fill={sh(bc, 18)} opacity="0.8" />

        {/* Hip panel */}
        <path d={`M98 ${waist + 18} Q102 ${waist + 40} 118 ${waist + 56} L160 ${waist + 53} L202 ${waist + 56} Q218 ${waist + 40} 222 ${waist + 18}Z`}
          fill={sh(bc, 12)} />

        {/* Left leg */}
        <path d={`M118 ${waist + 54} Q${118 - spread} ${waist + 145} ${115 - spread} ${legBot - 14} Q${114 - spread} ${legBot + 4} ${113 - spread} ${legBot + 14}`}
          stroke="url(#gBotL)" strokeWidth={legW * 2} fill="none" strokeLinecap="round" />
        {/* Left seam */}
        <path d={`M115 ${waist + 66} Q${108 - spread / 2} ${waist + 160} ${108 - spread / 2} ${legBot}`}
          stroke={sh(bc, -28)} strokeWidth="2.5" fill="none" opacity="0.35" />

        {/* Right leg */}
        <path d={`M202 ${waist + 54} Q${202 + spread} ${waist + 145} ${205 + spread} ${legBot - 14} Q${206 + spread} ${legBot + 4} ${207 + spread} ${legBot + 14}`}
          stroke="url(#gBotR)" strokeWidth={legW * 2} fill="none" strokeLinecap="round" />
        <path d={`M205 ${waist + 66} Q${212 + spread / 2} ${waist + 160} ${212 + spread / 2} ${legBot}`}
          stroke={sh(bc, -28)} strokeWidth="2.5" fill="none" opacity="0.35" />

        {/* Crotch */}
        <path d={`M122 ${waist + 56} Q160 ${waist + 74} 198 ${waist + 56}`}
          stroke={sh(bc, -35)} strokeWidth="2.5" fill="none" opacity="0.5" />

        {/* Cargo pockets */}
        {isCargo && (
          <>
            <rect x={80 - spread} y={waist + 90} width="32" height="44" rx="6" fill={sh(bc, -10)} opacity="0.88" />
            <path d={`M${80 - spread} ${waist + 108} L${112 - spread} ${waist + 108}`} stroke={ba} strokeWidth="2.2" />
            <circle cx={96 - spread} cy={waist + 105} r="4.5" fill={sh(bc, -35)} />
            <rect x={208 + spread} y={waist + 90} width="32" height="44" rx="6" fill={sh(bc, -10)} opacity="0.88" />
            <path d={`M${208 + spread} ${waist + 108} L${240 + spread} ${waist + 108}`} stroke={ba} strokeWidth="2.2" />
            <circle cx={224 + spread} cy={waist + 105} r="4.5" fill={sh(bc, -35)} />
          </>
        )}

        {/* Leg hem */}
        <path d={`M${88 - spread * 2} ${legBot + 2} L${136 - spread} ${legBot + 16}`}
          stroke={ba} strokeWidth="3.5" fill="none" opacity="0.65" />
        <path d={`M${232 + spread * 2} ${legBot + 2} L${184 + spread} ${legBot + 16}`}
          stroke={ba} strokeWidth="3.5" fill="none" opacity="0.65" />

        {/* Specular */}
        <path d={`M${102 - spread} ${waist + 68} Q${95 - spread} ${waist + 158} ${98 - spread} ${waist + 248}`}
          stroke="rgba(255,255,255,0.13)" strokeWidth="14" fill="none" strokeLinecap="round" />
      </g>
    );
  }

  /* ── SHOES ── */
  function renderShoesPair(item) {
    const sc = item.color;
    const sa = item.shadow;
    const sol = item.sole || "#E0E0E0";
    const lx = 112, rx = 208;
    const sy = 526;

    const one = (cx, flip) => {
      const f = flip ? 1 : -1;
      switch (item.type) {
        case "sneaker":
        case "platform": {
          const platH = item.type === "platform" ? 18 : 9;
          return (
            <g key={cx}>
              <path d={`M${cx - 32} ${sy + 5} Q${cx - 26} ${sy - 18} ${cx + 10} ${sy - 22} Q${cx + 36} ${sy - 14} ${cx + 38} ${sy + 5} Q${cx + 34} ${sy + 18} ${cx} ${sy + 20} Q${cx - 30} ${sy + 18} ${cx - 32} ${sy + 5}Z`}
                fill="url(#gShoe)" />
              <rect x={cx - 34} y={sy + 16} width={72} height={platH} rx={platH / 2} fill={sol} />
              <path d={`M${cx - 14} ${sy - 18} Q${cx} ${sy - 10} ${cx + 14} ${sy - 18}`}
                fill={sh(sc, 18)} opacity="0.75" />
              {[sy - 12, sy - 5, sy + 2].map((y, i) => (
                <path key={i} d={`M${cx - 12} ${y} L${cx + 12} ${y}`}
                  stroke="rgba(255,255,255,0.5)" strokeWidth="2.2" />
              ))}
              <ellipse cx={cx + 18} cy={sy + 4} rx="11" ry="7" fill={sa} opacity="0.7" />
              <path d={`M${cx - 26} ${sy - 10} Q${cx - 16} ${sy - 20} ${cx} ${sy - 20}`}
                stroke="rgba(255,255,255,0.42)" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          );
        }
        case "heel":
        case "mule":
          return (
            <g key={cx}>
              <path d={`M${cx - 30} ${sy + 4} Q${cx - 22} ${sy - 16} ${cx + 10} ${sy - 20} Q${cx + 36} ${sy - 12} ${cx + 38} ${sy + 4} Q${cx + 34} ${sy + 16} ${cx} ${sy + 18} Q${cx - 28} ${sy + 16} ${cx - 30} ${sy + 4}Z`}
                fill="url(#gShoe)" />
              <path d={`M${cx + 28} ${sy + 12} Q${cx + 33} ${sy + 26} ${cx + 30} ${sy + 42}`}
                stroke={sa} strokeWidth="9" fill="none" strokeLinecap="round" />
              <path d={`M${cx - 22} ${sy - 4} L${cx + 24} ${sy - 12}`}
                stroke={sa} strokeWidth="5.5" fill="none" strokeLinecap="round" opacity="0.85" />
              <path d={`M${cx - 24} ${sy - 8} Q${cx - 12} ${sy - 18} ${cx + 4} ${sy - 17}`}
                stroke="rgba(255,255,255,0.48)" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          );
        case "boot":
          return (
            <g key={cx}>
              <path d={`M${cx - 22} ${sy - 60} Q${cx - 24} ${sy - 22} ${cx - 28} ${sy + 12} Q${cx - 26} ${sy + 22} ${cx} ${sy + 24} Q${cx + 26} ${sy + 22} ${cx + 28} ${sy + 12} Q${cx + 24} ${sy - 22} ${cx + 22} ${sy - 60}Z`}
                fill="url(#gShoe)" />
              <path d={`M${cx - 22} ${sy - 60} Q${cx} ${sy - 68} ${cx + 22} ${sy - 60}`}
                stroke={sh(sc, 20)} strokeWidth="3.5" fill="none" opacity="0.8" />
              <rect x={cx - 32} y={sy + 20} width={66} height={12} rx={6} fill={sh(sa, -22)} />
              <path d={`M${cx - 18} ${sy - 52} Q${cx - 10} ${sy - 58} ${cx + 4} ${sy - 56}`}
                stroke="rgba(255,255,255,0.38)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <line x1={cx + 18} y1={sy - 58} x2={cx + 18} y2={sy + 8}
                stroke={sh(sc, -42)} strokeWidth="2.5" opacity="0.55" strokeDasharray="3.5,3" />
            </g>
          );
        case "ballet":
          return (
            <g key={cx}>
              <path d={`M${cx - 32} ${sy + 4} Q${cx - 24} ${sy - 16} ${cx + 8} ${sy - 20} Q${cx + 34} ${sy - 12} ${cx + 36} ${sy + 4} Q${cx + 32} ${sy + 16} ${cx} ${sy + 18} Q${cx - 30} ${sy + 16} ${cx - 32} ${sy + 4}Z`}
                fill="url(#gShoe)" />
              <rect x={cx - 34} y={sy + 14} width={70} height={9} rx={4.5} fill={sa} />
              <path d={`M${cx - 14} ${sy - 14} Q${cx - 22} ${sy - 6} ${cx - 28} ${sy + 4}`}
                stroke={sh(sc, -18)} strokeWidth="4.5" fill="none" strokeLinecap="round" opacity="0.85" />
              <path d={`M${cx + 14} ${sy - 14} Q${cx + 22} ${sy - 6} ${cx + 28} ${sy + 4}`}
                stroke={sh(sc, -18)} strokeWidth="4.5" fill="none" strokeLinecap="round" opacity="0.85" />
              <path d={`M${cx - 22} ${sy - 8} Q${cx} ${sy - 19} ${cx + 22} ${sy - 8}`}
                stroke="rgba(255,255,255,0.42)" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          );
        case "loafer":
        default:
          return (
            <g key={cx}>
              <path d={`M${cx - 30} ${sy + 5} Q${cx - 24} ${sy - 14} ${cx + 8} ${sy - 18} Q${cx + 34} ${sy - 11} ${cx + 36} ${sy + 5} Q${cx + 32} ${sy + 17} ${cx} ${sy + 19} Q${cx - 28} ${sy + 17} ${cx - 30} ${sy + 5}Z`}
                fill="url(#gShoe)" />
              <rect x={cx - 32} y={sy + 15} width={68} height={11} rx={5.5} fill={sh(sol, -20)} />
              <path d={`M${cx - 16} ${sy - 2} Q${cx} ${sy - 14} ${cx + 16} ${sy - 2}`}
                stroke={sa} strokeWidth="3.5" fill="none" />
              <rect x={cx - 10} y={sy - 16} width="20" height="7" rx="3.5" fill={sa} opacity="0.85" />
              <path d={`M${cx - 24} ${sy - 8} Q${cx - 12} ${sy - 16} ${cx} ${sy - 16}`}
                stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          );
      }
    };

    return (
      <g filter="url(#fSkin)">
        {one(lx, false)}
        {one(rx, true)}
      </g>
    );
  }

  /* ── ACCESSORIES ── */
  function renderAccessory(acc) {
    if (!acc || acc.id === "acc_none") return null;
    switch (acc.id) {
      case "acc_grad":
        return (
          <g>
            <rect x="88" y="52" width="144" height="14" rx="4" fill="#111" />
            <path d="M100 52 Q106 20 160 14 Q214 20 220 52Z" fill="#1A1A1A" />
            <rect x="110" y="38" width="100" height="9" rx="2.5" fill="#0A0A0A" />
            <circle cx="220" cy="52" r="7" fill="#D4A820" />
            <line x1="220" y1="59" x2="220" y2="85" stroke="#B8860B" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="216" y1="82" x2="211" y2="100" stroke="#B8860B" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="220" y1="85" x2="220" y2="101" stroke="#FFD700" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="224" y1="82" x2="229" y2="100" stroke="#B8860B" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        );
      case "acc_crown":
        return (
          <g>
            <path d="M90 70 L108 46 L126 66 L160 36 L194 66 L212 46 L230 70Z" fill="#D4A820" />
            <rect x="86" y="68" width="148" height="16" rx="6" fill="#B8860B" />
            {[96, 122, 160, 198, 224].map((cx, i) => (
              <circle key={i} cx={cx} cy={75} r="6.5" fill={["#FF3333", "#4444FF", "#D4A820", "#DD44DD", "#33CC33"][i]} />
            ))}
          </g>
        );
      case "acc_halo":
        return (
          <g>
            <ellipse cx="160" cy="28" rx="58" ry="13" fill="none" stroke="#D4A820" strokeWidth="8" opacity="0.94" />
            <ellipse cx="160" cy="28" rx="58" ry="13" fill="none" stroke="#FFE566" strokeWidth="4" opacity="0.42" />
            <path d="M104 28 Q130 18 186 28" stroke="rgba(255,255,255,0.26)" strokeWidth="5" fill="none" />
          </g>
        );
      case "acc_pearl":
        return (
          <g>
            {[118, 132, 146, 160, 174, 188, 202].map((cx, i) => (
              <g key={i}>
                <circle cx={cx} cy={205 - Math.sin(i * 0.44) * 5} r="7" fill="#F5EAE0" stroke="#C8B898" strokeWidth="1.5" />
                <circle cx={cx + 1.5} cy={202 - Math.sin(i * 0.44) * 5} r="2.8" fill="white" opacity="0.75" />
              </g>
            ))}
          </g>
        );
      case "acc_sunnies":
        return (
          <g>
            <path d="M98 106 Q106 92 128 92 Q150 92 154 106 Q150 120 128 120 Q106 120 98 106Z" fill="#0A0A0A" stroke="#222" strokeWidth="2.5" />
            <path d="M166 106 Q174 92 192 92 Q214 92 222 106 Q214 120 192 120 Q174 120 166 106Z" fill="#0A0A0A" stroke="#222" strokeWidth="2.5" />
            <path d="M154 106 L166 106" stroke="#222" strokeWidth="3.5" />
            <line x1="98" y1="106" x2="80" y2="108" stroke="#222" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="222" y1="106" x2="240" y2="108" stroke="#222" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M102 102 Q128 96 150 102" stroke="rgba(255,255,255,0.16)" strokeWidth="3" fill="none" />
            <path d="M170 102 Q192 96 218 102" stroke="rgba(255,255,255,0.13)" strokeWidth="2.5" fill="none" />
          </g>
        );
      case "acc_flower":
        return (
          <g>
            {[0, 60, 120, 180, 240, 300].map((d, i) => {
              const fx = 214 + 22 * Math.cos(d * Math.PI / 180);
              const fy = 72 + 18 * Math.sin(d * Math.PI / 180);
              return <ellipse key={i} cx={fx} cy={fy} rx="13" ry="8"
                fill={i % 2 === 0 ? "#FF6B9D" : "#FFB0CC"} opacity="0.92"
                transform={`rotate(${d} ${fx} ${fy})`} />;
            })}
            <circle cx="214" cy="72" r="10" fill="#F9C06A" />
          </g>
        );
      case "acc_star":
        return (
          <g>
            <polygon points="214,44 219,60 236,60 223,70 228,86 214,76 200,86 205,70 192,60 209,60"
              fill="#F9C06A" opacity="0.97" />
            <polygon points="214,48 218,58 230,58 221,65 224,77 214,70 204,77 207,65 198,58 210,58"
              fill="#FFE566" />
          </g>
        );
      default:
        return null;
    }
  }
}

/* ══════════════════════════════════════════════════════════════
   SNAPCHAT-STYLE STORE UI
   ══════════════════════════════════════════════════════════════ */
export default function AvatarStore3D({ totalXP = 930, onEquipChange }) {
  const [outfit, setOutfit] = useState({
    tops: "top_white_tie",
    bottoms: "bot_pink_cargo",
    shoes: "shoe_pink_runner",
    hair: "hair_brown_wavy",
    accessories: "acc_none",
    skin: "skin_tan",
  });
  const [coins, setCoins] = useState(totalXP);
  const [gems, setGems] = useState(26);
  const [owned, setOwned] = useState(() => {
    const s = new Set();
    Object.values(STORE_CATALOG).forEach(cat => cat.forEach(i => { if (i.owned) s.add(i.id); }));
    return s;
  });
  const [activeTab, setActiveTab] = useState("tops");
  const [bounce, setBounce] = useState(false);
  const [filterStyle, setFilterStyle] = useState("الكل");
  const [buyModal, setBuyModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [previewId, setPreviewId] = useState(null);

  const TABS = [
    { id: "tops", label: "TOPS", sub: "توبات", icon: "👗" },
    { id: "bottoms", label: "BOTTOMS", sub: "بنطلون", icon: "👖" },
    { id: "shoes", label: "SHOES", sub: "أحذية", icon: "👟" },
    { id: "hair", label: "HAIR", sub: "شعر", icon: "💇" },
    { id: "accessories", label: "ACC", sub: "اكسسوار", icon: "💎" },
  ];

  const STYLES = ["الكل", "مجاني", "Old Money", "Y2K", "كروب"];

  const displayOutfit = previewId
    ? { ...outfit, [activeTab]: previewId }
    : outfit;

  const items = STORE_CATALOG[activeTab] || [];
  const filtered = filterStyle === "الكل" ? items
    : filterStyle === "مجاني" ? items.filter(i => i.price === 0)
    : items;

  const triggerToast = (msg, color = "#4ADE80") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  const handleItem = (item) => {
    if (owned.has(item.id)) {
      setOutfit(p => { const n = { ...p, [activeTab]: item.id }; onEquipChange?.(n); return n; });
      setBounce(true);
      setTimeout(() => setBounce(false), 2400);
    } else {
      setBuyModal(item);
    }
  };

  const confirmBuy = (item) => {
    if (coins < item.price) return;
    setCoins(c => c - item.price);
    const next = new Set([...owned, item.id]);
    setOwned(next);
    const newOutfit = { ...outfit, [activeTab]: item.id };
    setOutfit(newOutfit);
    onEquipChange?.(newOutfit);
    setBuyModal(null);
    setBounce(true);
    setTimeout(() => setBounce(false), 2400);
    triggerToast(`✨ اشتريتِ ${item.name}!`);
  };

  const equippedItem = items.find(i => i.id === outfit[activeTab]);

  return (
    <div style={{
      fontFamily: "'Cairo', sans-serif", direction: "rtl",
      background: "#0E0612",
      minHeight: "100vh", color: "#F8F0FF",
      position: "relative", overflow: "hidden",
    }}>

      <style>{`
        @keyframes avatar-bounce{0%,100%{transform:translateY(0)}40%{transform:translateY(-18px) scale(1.04)}70%{transform:translateY(-6px)}}
        @keyframes toast-in{from{opacity:0;transform:translateX(-50%) translateY(-12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        @keyframes modal-pop{from{transform:scale(.55) rotate(-6deg);opacity:0}65%{transform:scale(1.04) rotate(1deg)}to{transform:scale(1) rotate(0);opacity:1}}
        @keyframes item-in{from{opacity:0;transform:scale(.85) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes glow-pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,95,160,0.4)}50%{box-shadow:0 0 0 8px rgba(255,95,160,0)}}
        @keyframes shine{0%{left:-120%}100%{left:150%}}
        @keyframes bg-float{0%,100%{transform:translate(0,0)}50%{transform:translate(12px,-18px)}}

        .item-card{
          transition: transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .2s;
          cursor: pointer;
          user-select: none;
        }
        .item-card:hover{ transform: translateY(-5px) scale(1.03) !important; }
        .item-card:active{ transform: scale(.95) !important; }
        .tab-pill{ transition: all .2s cubic-bezier(.4,0,.2,1); cursor: pointer; }
        .tab-pill:active{ transform: scale(.94); }
        ::-webkit-scrollbar{ width: 3px; height: 3px; }
        ::-webkit-scrollbar-thumb{ background: rgba(255,95,160,0.3); border-radius: 10px; }
        ::-webkit-scrollbar-track{ background: transparent; }
      `}</style>

      {/* Ambient blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-15%", right: "-10%", width: "55vw", height: "55vw", borderRadius: "50%", background: "radial-gradient(circle,rgba(255,95,160,.09),transparent 70%)", animation: "bg-float 9s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "45vw", height: "45vw", borderRadius: "50%", background: "radial-gradient(circle,rgba(120,60,232,.07),transparent 70%)", animation: "bg-float 12s ease-in-out 3s infinite reverse" }} />
      </div>

      {/* Toast */}
      {toast && createPortal(
        <div style={{ position: "fixed", top: 72, left: "50%", zIndex: 99999, animation: "toast-in .3s ease both", pointerEvents: "none", fontFamily: "'Cairo',sans-serif", background: toast.color + "22", border: `1px solid ${toast.color}55`, padding: "9px 22px", borderRadius: 40, fontSize: 13, fontWeight: 700, color: toast.color, boxShadow: `0 4px 24px ${toast.color}33`, whiteSpace: "nowrap" }}>
          {toast.msg}
        </div>,
        document.body
      )}

      {/* Buy Modal */}
      {buyModal && createPortal(
        <div onClick={() => setBuyModal(null)} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,.88)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "linear-gradient(160deg,#1E0E2E,#160824)", border: "1px solid rgba(255,95,160,.25)", borderRadius: 28, padding: "32px 24px", maxWidth: 340, width: "100%", textAlign: "center", animation: "modal-pop .4s cubic-bezier(.34,1.5,.64,1) both", boxShadow: "0 0 80px rgba(255,95,160,.15), 0 30px 60px rgba(0,0,0,.7)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${buyModal.tagColor},transparent)` }} />
            <div style={{ fontSize: 58, marginBottom: 14, filter: `drop-shadow(0 0 20px ${buyModal.tagColor}88)` }}>
              {buyModal.icon || "👗"}
            </div>
            <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 5 }}>{buyModal.name}</div>
            <div style={{ fontSize: 11, color: "rgba(255,240,255,.5)", marginBottom: 14 }}>{buyModal.desc}</div>
            <div style={{ display: "inline-block", padding: "3px 14px", borderRadius: 20, marginBottom: 22, background: buyModal.tagColor + "20", border: `1px solid ${buyModal.tagColor}44`, fontSize: 11, fontWeight: 700, color: buyModal.tagColor }}>
              ✦ {buyModal.tag}
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#FBBF24", marginBottom: 22 }}>
              ⭐ {buyModal.price.toLocaleString()}
            </div>
            <div style={{ fontSize: 12, marginBottom: 22, padding: "9px 14px", borderRadius: 14, background: coins >= buyModal.price ? "rgba(74,222,128,.1)" : "rgba(255,126,126,.1)", color: coins >= buyModal.price ? "#4ADE80" : "#FF7E7E", border: `1px solid ${coins >= buyModal.price ? "#4ADE80" : "#FF7E7E"}33` }}>
              {coins >= buyModal.price ? `✅ رصيدك ${coins} ⭐ — يكفي!` : `❌ رصيدك ${coins} ⭐ — ناقص ${buyModal.price - coins}`}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setBuyModal(null)} style={{ flex: 1, padding: "12px", borderRadius: 14, fontFamily: "'Cairo',sans-serif", fontWeight: 700, fontSize: 13, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,240,255,.5)", cursor: "pointer" }}>
                إلغاء
              </button>
              <button onClick={() => confirmBuy(buyModal)} disabled={coins < buyModal.price} style={{ flex: 2, padding: "12px", borderRadius: 14, fontFamily: "'Cairo',sans-serif", fontWeight: 800, fontSize: 14, cursor: coins >= buyModal.price ? "pointer" : "not-allowed", background: coins >= buyModal.price ? "linear-gradient(135deg,#FF5FA0,#9333EA)" : "rgba(255,255,255,.06)", border: "none", color: "#fff", opacity: coins < buyModal.price ? .45 : 1, boxShadow: coins >= buyModal.price ? "0 4px 20px rgba(255,95,160,.5)" : "none" }}>
                ✨ اشتري دلوقتي
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MAIN LAYOUT */}
      <div style={{ display: "flex", height: "100vh", overflow: "hidden", position: "relative", zIndex: 1 }}>

        {/* ═══ LEFT: AVATAR PANEL ═══ */}
        <div style={{ width: 280, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 12px", borderRight: "1px solid rgba(255,160,210,.08)", background: "linear-gradient(180deg,rgba(26,8,40,.7) 0%,rgba(14,6,18,.9) 100%)", position: "relative" }}>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 8, width: "100%", marginBottom: 14 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 7, background: "rgba(120,60,232,.18)", border: "1px solid rgba(120,60,232,.35)", borderRadius: 22, padding: "7px 12px" }}>
              <span style={{ fontSize: 16 }}>💎</span>
              <span style={{ fontSize: 16, fontWeight: 900, color: "#A78BFA" }}>{gems}</span>
            </div>
            <div style={{ flex: 1.4, display: "flex", alignItems: "center", gap: 7, background: "rgba(251,191,36,.16)", border: "1px solid rgba(251,191,36,.32)", borderRadius: 22, padding: "7px 14px" }}>
              <span style={{ fontSize: 16 }}>⭐</span>
              <span style={{ fontSize: 16, fontWeight: 900, color: "#FBBF24" }}>{coins.toLocaleString()}</span>
            </div>
          </div>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 8, width: "100%" }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#F8F0FF" }}>غرفة القياس · متجر مها</div>
            <div style={{ fontSize: 10, color: "rgba(255,200,240,.45)", marginTop: 2 }}>لبس واقعي · مكافآت من مهامك ⭐</div>
          </div>

          {/* Platform glow */}
          <div style={{ position: "absolute", bottom: 160, left: "50%", transform: "translateX(-50%)", width: 210, height: 28, borderRadius: "50%", background: "linear-gradient(90deg,rgba(255,95,160,.35),rgba(120,60,232,.35),rgba(255,95,160,.35))", filter: "blur(14px)", animation: "bg-float 4s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: 155, left: "50%", transform: "translateX(-50%)", width: 200, height: 26, borderRadius: "50%", background: "linear-gradient(90deg,#FF5FA055,#9333EA55,#FF5FA055)", filter: "blur(4px)" }} />

          {/* Avatar */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <BitmojiAvatar outfit={displayOutfit} bounce={bounce} />
          </div>

          {/* Current item footer */}
          <div style={{ width: "100%", background: "rgba(255,95,160,.1)", border: "1px solid rgba(255,95,160,.2)", borderRadius: 14, padding: "10px 13px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>{equippedItem?.icon || "👗"}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, color: "rgba(255,200,240,.5)" }}>اللبس الحالي</div>
              <div style={{ fontSize: 12, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {equippedItem?.name || "—"}
              </div>
            </div>
            <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 10, background: (equippedItem?.tagColor || "#4ADE80") + "20", border: `1px solid ${equippedItem?.tagColor || "#4ADE80"}35`, color: equippedItem?.tagColor || "#4ADE80", fontWeight: 700, flexShrink: 0 }}>
              ✓ مرتدية
            </span>
          </div>
        </div>

        {/* ═══ RIGHT: STORE PANEL ═══ */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Category tabs — Snapchat style */}
          <div style={{ display: "flex", gap: 3, padding: "12px 14px 0", flexShrink: 0, overflowX: "auto", borderBottom: "1px solid rgba(255,160,210,.08)" }}>
            {TABS.map(t => {
              const active = activeTab === t.id;
              return (
                <button key={t.id} onClick={() => { setActiveTab(t.id); setPreviewId(null); setFilterStyle("الكل"); }}
                  className="tab-pill"
                  style={{ flexShrink: 0, padding: "9px 16px", borderRadius: "12px 12px 0 0", fontFamily: "'Cairo',sans-serif", fontWeight: 700, fontSize: 11, border: "none", cursor: "pointer", marginBottom: -1, position: "relative", overflow: "hidden",
                    background: active ? "rgba(255,95,160,.15)" : "transparent",
                    color: active ? "#FF5FA0" : "rgba(255,200,240,.45)",
                    borderBottom: active ? "2.5px solid #FF5FA0" : "2.5px solid transparent",
                  }}>
                  <span style={{ fontSize: 14, display: "block", marginBottom: 2 }}>{t.icon}</span>
                  <span style={{ fontSize: 9, display: "block", opacity: .7 }}>{t.label}</span>
                  <span style={{ fontSize: 10 }}>{t.sub}</span>
                </button>
              );
            })}
          </div>

          {/* Style filters */}
          <div style={{ display: "flex", gap: 6, padding: "10px 14px 6px", overflowX: "auto", flexShrink: 0 }}>
            {STYLES.map(s => (
              <button key={s} onClick={() => setFilterStyle(s)}
                style={{ flexShrink: 0, padding: "5px 14px", borderRadius: 20, fontSize: 11, fontFamily: "'Cairo',sans-serif", fontWeight: 600, cursor: "pointer", transition: "all .16s",
                  background: filterStyle === s ? "rgba(255,95,160,.18)" : "rgba(255,255,255,.04)",
                  border: `1px solid ${filterStyle === s ? "rgba(255,95,160,.5)" : "rgba(255,160,210,.1)"}`,
                  color: filterStyle === s ? "#FF5FA0" : "rgba(255,200,240,.45)",
                }}>
                {s}
              </button>
            ))}
          </div>

          {/* Items grid — Snapchat-style vertical cards */}
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px 24px" }}>
            {filtered.map((item, idx) => {
              const isOwned = owned.has(item.id);
              const isEquipped = outfit[activeTab] === item.id;
              const isPrev = previewId === item.id;

              return (
                <div key={item.id} className="item-card"
                  style={{
                    marginBottom: 14, borderRadius: 20, overflow: "hidden",
                    background: isEquipped ? "linear-gradient(135deg,rgba(255,95,160,.14),rgba(147,51,234,.08))" : "rgba(255,255,255,.04)",
                    border: `1.5px solid ${isEquipped ? "rgba(255,95,160,.45)" : isPrev ? "rgba(147,51,234,.35)" : "rgba(255,160,210,.09)"}`,
                    boxShadow: isEquipped ? "0 0 24px rgba(255,95,160,.18)" : "none",
                    animation: `item-in .22s ${idx * 0.04}s ease both`,
                    position: "relative",
                  }}
                  onMouseEnter={() => setPreviewId(item.id)}
                  onMouseLeave={() => setPreviewId(null)}
                  onClick={() => handleItem(item)}
                >
                  {/* Legendary shimmer */}
                  {item.tag === "أسطوري" && (
                    <div style={{ position: "absolute", top: 0, left: "-120%", height: "100%", width: "55%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,.07),transparent)", animation: "shine 2.8s 1.2s linear infinite", pointerEvents: "none", zIndex: 2 }} />
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                    {/* Color swatch panel */}
                    <div style={{ width: 106, height: 116, flexShrink: 0, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                      background: item.color ? `radial-gradient(ellipse at 35% 35%, ${item.color}50 0%, ${item.color}18 55%, transparent 80%)` : "rgba(255,255,255,.03)" }}>
                      {item.color && (
                        <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(45deg,${item.color}08 0px,${item.color}08 1px,transparent 1px,transparent 10px)` }} />
                      )}
                      {/* Cloth 3D shape preview */}
                      <div style={{ position: "relative", zIndex: 1 }}>
                        {item.color ? (
                          <svg width="64" height="64" viewBox="0 0 64 64">
                            <defs>
                              <radialGradient id={`cg${idx}`} cx="30%" cy="25%" r="65%">
                                <stop offset="0%" stopColor={sh(item.color, 28)} />
                                <stop offset="55%" stopColor={item.color} />
                                <stop offset="100%" stopColor={item.shadow || sh(item.color, -25)} />
                              </radialGradient>
                            </defs>
                            {activeTab === "shoes" ? (
                              <>
                                <path d="M8 36 Q10 24 28 20 Q46 18 52 28 Q54 36 50 44 Q42 50 28 50 Q14 48 8 36Z" fill={`url(#cg${idx})`} />
                                <ellipse cx="30" cy="46" rx="24" ry="8" fill={item.sole || sh(item.color, -20)} opacity="0.9" />
                                <path d="M10 32 Q22 26 38 26" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                              </>
                            ) : activeTab === "bottoms" ? (
                              <>
                                <path d="M20 14 Q18 30 16 48 Q22 52 28 48 L32 30 L36 48 Q42 52 48 48 Q46 30 44 14Z" fill={`url(#cg${idx})`} />
                                <rect x="19" y="12" width="26" height="8" rx="4" fill={sh(item.color, 20)} />
                                <path d="M18 18 Q32 22 46 18" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
                              </>
                            ) : activeTab === "hair" ? (
                              <>
                                <path d="M32 8 Q18 12 14 28 Q18 24 32 22 Q46 24 50 28 Q46 12 32 8Z" fill={`url(#cg${idx})`} />
                                <path d="M14 28 Q10 46 14 56" stroke={item.color} strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.9" />
                                <path d="M50 28 Q54 46 50 56" stroke={item.color} strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.9" />
                                <path d="M18 14 Q32 8 46 14" stroke={item.high} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.65" />
                              </>
                            ) : (
                              <>
                                <path d="M18 22 Q14 30 14 44 L14 54 Q22 58 32 58 Q42 58 50 54 L50 44 Q50 30 46 22 Q40 14 32 14 Q24 14 18 22Z" fill={`url(#cg${idx})`} />
                                <path d="M20 24 Q26 20 34 22" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                                <path d="M16 50 Q24 56 32 57 Q40 56 48 50" stroke={item.shadow} strokeWidth="2" fill="none" opacity="0.65" />
                              </>
                            )}
                          </svg>
                        ) : (
                          <div style={{ fontSize: 36 }}>{item.icon}</div>
                        )}
                      </div>
                      {/* Color circle */}
                      {item.color && (
                        <div style={{ position: "absolute", bottom: 8, right: 8, width: 18, height: 18, borderRadius: "50%", background: item.color, border: "2px solid rgba(255,255,255,.35)", boxShadow: `0 0 10px ${item.color}99` }} />
                      )}
                    </div>

                    {/* Info panel */}
                    <div style={{ flex: 1, padding: "13px 14px" }}>
                      <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4, lineHeight: 1.3 }}>{item.name}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,200,240,.48)", marginBottom: 10, lineHeight: 1.6 }}>{item.desc}</div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: item.tagColor + "18", border: `1px solid ${item.tagColor}33`, color: item.tagColor, fontWeight: 700 }}>
                          {item.tag}
                        </span>
                        {isOwned ? (
                          <span style={{ fontSize: 12, fontWeight: 700, color: isEquipped ? "#FF5FA0" : "#4ADE80", display: "flex", alignItems: "center", gap: 5 }}>
                            {isEquipped
                              ? <><span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ADE80", display: "inline-block" }} /> مرتدية</>
                              : "👗 البسي"}
                          </span>
                        ) : (
                          <span style={{ fontSize: 13, fontWeight: 800, color: "#FBBF24" }}>⭐ {item.price.toLocaleString()}</span>
                        )}
                      </div>
                    </div>

                    {/* Equipped check */}
                    {isEquipped && (
                      <div style={{ position: "absolute", top: 10, left: 10, width: 26, height: 26, borderRadius: "50%", background: "#FF5FA0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 900, boxShadow: "0 0 12px rgba(255,95,160,.6)", animation: "glow-pulse 2s ease-in-out infinite" }}>✓</div>
                    )}
                    {isOwned && !isEquipped && (
                      <div style={{ position: "absolute", top: 10, right: 10, padding: "3px 8px", borderRadius: 10, background: "rgba(74,222,128,.15)", border: "1px solid rgba(74,222,128,.3)", fontSize: 9, color: "#4ADE80", fontWeight: 700 }}>ملكيتك</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}