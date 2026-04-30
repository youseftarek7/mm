// ╔══════════════════════════════════════════════════════════════╗
// ║  AvatarDance.jsx — أفاتار فائق الواقعية 2026               ║
// ║  ملابس مرسومة بالتفصيل: ثنيات، خياطة، أنسجة، بريق          ║
// ║  شعر طويل متموج، عيون تفصيلية، يدين حقيقيتين              ║
// ║  6 رقصات مع موسيقى + مودال احتفال                          ║
// ╚══════════════════════════════════════════════════════════════╝

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { STORE_CATALOG, DEFAULT_OUTFIT } from "./avatarConfig";

// ════════════════════════════════════════════════════════════════
// COLORS
// ════════════════════════════════════════════════════════════════
const C = {
  accent:"#FF6B9D", accentDark:"#D94F7E",
  purple:"#C084B8", gold:"#F9C06A", success:"#7DD3B0",
  text:"#FDF0F5", muted:"#C49BB0", dim:"#6B4558",
};

// ════════════════════════════════════════════════════════════════
// MUSIC
// ════════════════════════════════════════════════════════════════
function playMusic(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const melodies = {
      samba:   [[523,.0],[659,.12],[784,.24],[1047,.36],[784,.48],[659,.60],[523,.72],[1047,1.0],[1318,1.2]],
      disco:   [[440,.0],[587,.16],[698,.25],[880,.41],[1047,.5],[880,.66],[698,.83],[1174,1.0],[1318,1.2]],
      hiphop:  [[196,.0],[196,.2],[262,.33],[330,.5],[392,.7],[523,.95],[392,1.12],[523,1.3]],
      salsa:   [[659,.0],[784,.1],[880,.2],[784,.35],[659,.5],[523,.65],[659,.8],[880,1.0],[1047,1.2]],
      robot:   [[220,.0],[220,.25],[330,.5],[220,.75],[440,1.0],[330,1.25],[440,1.5]],
      flutter: [[523,.0],[659,.08],[784,.16],[1047,.24],[1318,.32],[1047,.4],[784,.48],[659,.56],[523,.64],[784,1.0],[1047,1.2]],
    };
    const notes = melodies[type] || melodies.samba;
    const waveTypes = { samba:"sine", disco:"square", hiphop:"sawtooth", salsa:"sine", robot:"square", flutter:"triangle" };
    notes.forEach(([f, t]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = waveTypes[type] || "sine";
      o.frequency.setValueAtTime(f, ctx.currentTime + t);
      g.gain.setValueAtTime(0, ctx.currentTime + t);
      g.gain.linearRampToValueAtTime(0.15, ctx.currentTime + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.18);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.22);
    });
    [0,.25,.5,.75,1.0,1.25].forEach(t => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = "sine";
      o.frequency.setValueAtTime(160, ctx.currentTime + t);
      o.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + t + 0.1);
      g.gain.setValueAtTime(0.25, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.12);
      o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.15);
    });
    setTimeout(() => ctx.close(), 2500);
  } catch(e) {}
}

// ════════════════════════════════════════════════════════════════
// DANCE CSS
// ════════════════════════════════════════════════════════════════
const DANCE_CSS = `
  @keyframes samba-root{0%,100%{transform:translate3d(0,0,0) rotate(0)}25%{transform:translate3d(0,-18px,0) rotate(-6deg)}50%{transform:translate3d(0,-12px,0) rotate(5deg)}75%{transform:translate3d(0,-20px,0) rotate(-4deg)}}
  @keyframes samba-arm-l{0%,100%{transform:rotate(15deg)}25%{transform:rotate(-65deg)}50%{transform:rotate(35deg)}75%{transform:rotate(-45deg)}}
  @keyframes samba-arm-r{0%,100%{transform:rotate(-15deg)}25%{transform:rotate(65deg)}50%{transform:rotate(-35deg)}75%{transform:rotate(45deg)}}
  @keyframes samba-leg-l{0%,100%{transform:rotate(0)}25%{transform:rotate(-25deg)}50%{transform:rotate(12deg)}75%{transform:rotate(-18deg)}}
  @keyframes samba-leg-r{0%,100%{transform:rotate(0)}25%{transform:rotate(25deg)}50%{transform:rotate(-12deg)}75%{transform:rotate(18deg)}}
  @keyframes disco-root{0%,100%{transform:translate3d(0,0,0)}25%{transform:translate3d(-16px,0,0)}75%{transform:translate3d(16px,0,0)}}
  @keyframes disco-arm-l{0%,100%{transform:rotate(-75deg)}33%{transform:rotate(-135deg)}66%{transform:rotate(-20deg)}}
  @keyframes disco-arm-r{0%,100%{transform:rotate(75deg)}33%{transform:rotate(135deg)}66%{transform:rotate(20deg)}}
  @keyframes disco-leg-l{0%,100%{transform:rotate(0)}33%{transform:rotate(-28deg)}66%{transform:rotate(14deg)}}
  @keyframes disco-leg-r{0%,100%{transform:rotate(0)}33%{transform:rotate(28deg)}66%{transform:rotate(-14deg)}}
  @keyframes hiphop-root{0%,100%{transform:translate3d(0,0,0) scaleY(1)}20%{transform:translate3d(0,-32px,0) scaleY(1.07)}40%{transform:translate3d(0,0,0) scaleY(0.92)}60%{transform:translate3d(0,-26px,0) scaleY(1.05)}80%{transform:translate3d(0,0,0) scaleY(0.94)}}
  @keyframes hiphop-arm-l{0%,100%{transform:rotate(35deg)}25%{transform:rotate(-48deg)}50%{transform:rotate(72deg)}75%{transform:rotate(-22deg)}}
  @keyframes hiphop-arm-r{0%,100%{transform:rotate(-35deg)}25%{transform:rotate(48deg)}50%{transform:rotate(-72deg)}75%{transform:rotate(22deg)}}
  @keyframes hiphop-leg-l{0%,100%{transform:rotate(0)}25%{transform:rotate(-32deg)}75%{transform:rotate(18deg)}}
  @keyframes hiphop-leg-r{0%,100%{transform:rotate(0)}25%{transform:rotate(32deg)}75%{transform:rotate(-18deg)}}
  @keyframes salsa-root{0%,100%{transform:translate3d(0,0,0) rotate(0)}25%{transform:translate3d(-5px,-10px,0) rotate(-7deg)}50%{transform:translate3d(5px,-5px,0) rotate(7deg)}75%{transform:translate3d(-3px,-14px,0) rotate(-4deg)}}
  @keyframes salsa-arm-l{0%,100%{transform:rotate(18deg)}25%{transform:rotate(-82deg)}50%{transform:rotate(52deg)}75%{transform:rotate(-52deg)}}
  @keyframes salsa-arm-r{0%,100%{transform:rotate(-18deg)}25%{transform:rotate(82deg)}50%{transform:rotate(-52deg)}75%{transform:rotate(52deg)}}
  @keyframes salsa-leg-l{0%,100%{transform:rotate(0)}25%{transform:rotate(-26deg)}50%{transform:rotate(16deg)}75%{transform:rotate(-20deg)}}
  @keyframes salsa-leg-r{0%,100%{transform:rotate(0)}25%{transform:rotate(26deg)}50%{transform:rotate(-16deg)}75%{transform:rotate(20deg)}}
  @keyframes robot-root{0%,25%,50%,75%,100%{transform:translate3d(0,0,0) rotate(0)}12%{transform:translate3d(0,-9px,0)}37%{transform:translate3d(0,0,0) rotate(7deg)}62%{transform:translate3d(0,-7px,0) rotate(-7deg)}}
  @keyframes robot-arm-l{0%,100%{transform:rotate(0)}25%{transform:rotate(-88deg)}75%{transform:rotate(-42deg)}}
  @keyframes robot-arm-r{0%,100%{transform:rotate(0)}25%{transform:rotate(88deg)}75%{transform:rotate(42deg)}}
  @keyframes robot-leg-l{0%,50%,100%{transform:rotate(0)}25%{transform:rotate(-38deg)}75%{transform:rotate(16deg)}}
  @keyframes robot-leg-r{0%,50%,100%{transform:rotate(0)}25%{transform:rotate(38deg)}75%{transform:rotate(-16deg)}}
  @keyframes flutter-root{0%,100%{transform:translate3d(0,0,0) scale(1)}20%{transform:translate3d(0,-36px,0) scale(1.06)}40%{transform:translate3d(0,-16px,0) scale(1.03)}60%{transform:translate3d(0,-40px,0) scale(1.08)}80%{transform:translate3d(0,-20px,0) scale(1.04)}}
  @keyframes flutter-arm-l{0%,100%{transform:rotate(22deg)}15%{transform:rotate(-92deg)}30%{transform:rotate(42deg)}45%{transform:rotate(-72deg)}60%{transform:rotate(32deg)}75%{transform:rotate(-82deg)}}
  @keyframes flutter-arm-r{0%,100%{transform:rotate(-22deg)}15%{transform:rotate(92deg)}30%{transform:rotate(-42deg)}45%{transform:rotate(72deg)}60%{transform:rotate(-32deg)}75%{transform:rotate(82deg)}}
  @keyframes flutter-leg-l{0%,100%{transform:rotate(0)}25%{transform:rotate(-32deg)}50%{transform:rotate(20deg)}75%{transform:rotate(-26deg)}}
  @keyframes flutter-leg-r{0%,100%{transform:rotate(0)}25%{transform:rotate(32deg)}50%{transform:rotate(-20deg)}75%{transform:rotate(26deg)}}
  @keyframes tassel-swing{0%,100%{transform:rotate(0)}50%{transform:rotate(16deg)}}
  @keyframes idle-sway{0%,100%{transform:translate3d(0,0,0) rotate(0)}50%{transform:translate3d(0,-2px,0) rotate(.8deg)}}
  @keyframes hair-wave{0%,100%{transform:rotate(0) scaleX(1)}50%{transform:rotate(1.5deg) scaleX(1.01)}}
  @keyframes confetti-fall{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(130px) rotate(720deg);opacity:0}}
  @keyframes pts-pop{0%{transform:scale(.4) translateY(12px);opacity:0}60%{transform:scale(1.25) translateY(-6px);opacity:1}100%{transform:scale(1) translateY(0);opacity:1}}
  @keyframes modal-in{0%{transform:scale(.6) rotate(-8deg);opacity:0}60%{transform:scale(1.06) rotate(1deg);opacity:1}100%{transform:scale(1) rotate(0);opacity:1}}
  @keyframes glow-ring{0%{transform:translate(-50%,-50%) scale(.2);opacity:.9}100%{transform:translate(-50%,-50%) scale(4);opacity:0}}
  @keyframes label-in{0%{opacity:0;transform:translateY(6px)}100%{opacity:1;transform:translateY(0)}}
  @keyframes progress-drain{from{width:100%}to{width:0%}}
  @keyframes avatar-bounce{0%{transform:scale(.4) translateY(40px);opacity:0}70%{transform:scale(1.55) translateY(-6px);opacity:1}100%{transform:scale(1.5) translateY(0);opacity:1}}
`;

// ════════════════════════════════════════════════════════════════
// SHADE HELPER
// ════════════════════════════════════════════════════════════════
function sh(hex, pct) {
  try {
    let c = (hex || "#888").replace("#","");
    if (c.length === 3) c = c.split("").map(x=>x+x).join("");
    const n = parseInt(c, 16);
    const r = Math.min(255, Math.max(0, (n>>16) + Math.round(2.55*pct)));
    const g = Math.min(255, Math.max(0, ((n>>8)&0xff) + Math.round(2.55*pct)));
    const b = Math.min(255, Math.max(0, (n&0xff) + Math.round(2.55*pct)));
    return "#" + ((r<<16)|(g<<8)|b).toString(16).padStart(6,"0");
  } catch(e) { return hex || "#888"; }
}

// ════════════════════════════════════════════════════════════════
// OUTFIT RESOLVER — maps store IDs → drawing data
// ════════════════════════════════════════════════════════════════
function resolveOutfit(outfit = DEFAULT_OUTFIT) {
  const get = (cat, id) => (STORE_CATALOG[cat] || []).find(i => i.id === id);
  const hairItem  = get("hair", outfit.hair);
  const topItem   = get("tops", outfit.tops);
  const botItem   = get("bottoms", outfit.bottoms);
  const accItem   = get("accessories", outfit.accessories);
  const shoeItem  = get("shoes", outfit.shoes);
  const skinItem  = get("skin", outfit.skin);

  // ── acc → hat type ──
  const accIcon = accItem?.icon || "";
  const hatType =
    accIcon === "🎓" ? "grad" :
    accIcon === "👑" ? "crown" :
    accIcon === "😇" ? "halo" :
    accIcon === "🌸" ? "flower" :
    accIcon === "⭐" ? "star" :
    accIcon === "🧢" ? "cap" :
    accIcon === "🎨" ? "beret" :
    accIcon === "🧣" ? "scarf" :
    accIcon === "🦪" ? "pearl" :
    accIcon === "😎" ? "sunnies" :
    "none";

  // ── top type ──
  const topStyle = topItem?.style || "classic";
  const topType =
    topItem?.id?.includes("stripe") ? "stripe" :
    topItem?.id?.includes("knit") ? "knit" :
    topItem?.id?.includes("sequin") ? "sequin" :
    topItem?.id?.includes("leather") ? "leather" :
    topItem?.id?.includes("floral") ? "floral" :
    topItem?.id?.includes("corset") ? "corset" :
    topItem?.id?.includes("puff") ? "puff" :
    topItem?.id?.includes("btn") || topItem?.id?.includes("white_btn") ? "shirt" :
    "blouse";

  // ── bottom type ──
  const botType =
    botItem?.id?.includes("skirt_midi") ? "midi" :
    botItem?.id?.includes("skirt_mini") ? "mini" :
    botItem?.id?.includes("skirt_maxi") ? "maxi" :
    botItem?.id?.includes("barrel") ? "barrel" :
    botItem?.id?.includes("wide") ? "wide" :
    botItem?.id?.includes("tai") || botItem?.id?.includes("trouser") ? "trousers" :
    "jeans";

  // ── shoe type ──
  const shoeType =
    shoeItem?.id?.includes("loafer") ? "loafer" :
    shoeItem?.id?.includes("ballet") || shoeItem?.id?.includes("coquette") ? "ballet" :
    shoeItem?.id?.includes("boot") ? "boot" :
    shoeItem?.id?.includes("mule") ? "mule" :
    shoeItem?.id?.includes("strappy") || shoeItem?.id?.includes("heel") ? "heel" :
    shoeItem?.id?.includes("mary") ? "maryjane" :
    shoeItem?.id?.includes("platform") ? "platform" :
    "sneaker";

  return {
    hair:    hairItem?.color  || "#7A4E24",
    top:     topItem?.color   || "#F5EDD8",
    bot:     botItem?.color   || "#1E2D4A",
    shoe:    shoeItem?.color  || "#F5F5F5",
    skin:    skinItem?.color  || "#F0B882",
    isCrop:  !!topItem?.isCrop,
    topType, botType, shoeType, hatType,
    accColor: accItem?.color || "#C8961A",
    accScarf: hatType === "scarf" ? (accItem?.color || "#C84060") : null,
  };
}

// ════════════════════════════════════════════════════════════════
// DRAW HELPERS — each garment is fully drawn with fabric details
// ════════════════════════════════════════════════════════════════

function drawHat(type, accColor, hairColor, tasselAnim) {
  const hD = sh(hairColor, -30);
  const aD = sh(accColor, -25);
  const aL = sh(accColor, 22);
  switch(type) {
    case "grad": return (
      `<g>
        <rect x="44" y="42" width="72" height="9" rx="2.5" fill="#1C1C1C"/>
        <rect x="46" y="42" width="68" height="4" rx="1.5" fill="#2E2E2E"/>
        <path d="M54 42 Q56 20 80 16 Q104 20 106 42Z" fill="#111"/>
        <path d="M56 42 Q58 22 80 18 Q102 22 104 42Z" fill="#1A1A1A" opacity="0.5"/>
        <rect x="60" y="34" width="40" height="6" rx="1.5" fill="#0A0A0A"/>
        <g style="transform-origin:106px 42px;animation:${tasselAnim}">
          <circle cx="106" cy="42" r="4.5" fill="#D4A820"/>
          <line x1="106" y1="46" x2="106" y2="66" stroke="#B8860B" strokeWidth="3" strokeLinecap="round"/>
          <line x1="103" y1="64" x2="100" y2="78" stroke="#B8860B" strokeWidth="2" strokeLinecap="round"/>
          <line x1="106" y1="66" x2="106" y2="79" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
          <line x1="109" y1="64" x2="112" y2="78" stroke="#B8860B" strokeWidth="2" strokeLinecap="round"/>
        </g>
      </g>`
    );
    case "crown": return (
      `<g>
        <path d="M48 52 L58 34 L68 48 L80 26 L92 48 L102 34 L112 52Z" fill="#D4A820"/>
        <rect x="46" y="50" width="68" height="10" rx="3" fill="#B8860B"/>
        <circle cx="52" cy="52" r="3.5" fill="#FF3333"/>
        <circle cx="68" cy="52" r="3.5" fill="#4444FF"/>
        <circle cx="80" cy="52" r="3.5" fill="#D4A820"/>
        <circle cx="92" cy="52" r="3.5" fill="#DD44DD"/>
        <circle cx="108" cy="52" r="3.5" fill="#33CC33"/>
      </g>`
    );
    case "halo": return (
      `<g>
        <ellipse cx="80" cy="24" rx="28" ry="7" fill="none" stroke="#D4A820" strokeWidth="5" opacity="0.9"/>
        <ellipse cx="80" cy="24" rx="28" ry="7" fill="none" stroke="#FFE566" strokeWidth="2.5" opacity="0.4"/>
        <path d="M54 24 Q68 16 92 24" stroke="rgba(255,255,255,0.22)" strokeWidth="3" fill="none"/>
      </g>`
    );
    case "flower": return (
      `<g>
        ${[0,60,120,180,240,300].map((d,i) => {
          const fx = 62 + 16*Math.cos(d*Math.PI/180), fy = 44 + 12*Math.sin(d*Math.PI/180);
          return `<ellipse cx="${fx.toFixed(1)}" cy="${fy.toFixed(1)}" rx="8" ry="5" fill="${i%2===0?"#FF6B9D":"#FFB0CC"}" opacity="0.92" transform="rotate(${d} ${fx.toFixed(1)} ${fy.toFixed(1)})"/>`;
        }).join("")}
        <circle cx="62" cy="44" r="6.5" fill="#F9C06A"/>
      </g>`
    );
    case "star": return (
      `<g>
        <polygon points="80,18 84,32 98,32 87,40 91,54 80,46 69,54 73,40 62,32 76,32" fill="#F9C06A" opacity="0.95"/>
        <polygon points="80,22 83,32 93,32 86,38 88.5,48 80,43 71.5,48 74,38 67,32 77,32" fill="#FFE566"/>
      </g>`
    );
    case "cap": return (
      `<g>
        <ellipse cx="80" cy="42" rx="38" ry="9" fill="${accColor}" opacity="0.97"/>
        <path d="M42 42 Q44 22 80 18 Q116 22 118 42Z" fill="${sh(accColor,14)}"/>
        <path d="M44 42 Q46 24 80 20 Q114 24 116 42Z" fill="${aD}" opacity="0.25"/>
        <path d="M106 42 Q118 46 128 42" stroke="${aD}" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <rect x="62" y="36" width="36" height="5" rx="1.5" fill="${aD}"/>
      </g>`
    );
    case "beret": return (
      `<g>
        <ellipse cx="80" cy="46" rx="44" ry="10" fill="${accColor}" opacity="0.96"/>
        <path d="M36 46 Q38 26 80 20 Q122 26 124 46Z" fill="${sh(accColor,12)}"/>
        <ellipse cx="96" cy="30" rx="10" ry="10" fill="${sh(accColor,20)}"/>
        <circle cx="96" cy="30" r="5" fill="${sh(accColor,30)}"/>
      </g>`
    );
    case "sunnies": return (
      `<g>
        <path d="M56 74 Q60 66 72 66 Q84 66 88 74 Q84 82 72 82 Q60 82 56 74Z" fill="#111" stroke="#2A2A2A" strokeWidth="2"/>
        <path d="M92 74 Q96 66 108 66 Q120 66 124 74 Q120 82 108 82 Q96 82 92 74Z" fill="#111" stroke="#2A2A2A" strokeWidth="2"/>
        <path d="M88 74 L92 74" stroke="#333" strokeWidth="2.5" fill="none"/>
        <line x1="56" y1="74" x2="44" y2="76" stroke="#333" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="124" y1="74" x2="136" y2="76" stroke="#333" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M60 72 Q72 68 84 72" stroke="rgba(255,255,255,0.14)" strokeWidth="2" fill="none"/>
        <path d="M96 72 Q108 68 120 72" stroke="rgba(255,255,255,0.14)" strokeWidth="2" fill="none"/>
      </g>`
    );
    default: return "";
  }
}

function drawScarf(color) {
  const cL = sh(color, 25), cD = sh(color, -20);
  return (
    `<g>
      <path d="M56 120 Q60 112 68 110 Q80 107 92 110 Q100 112 104 120" stroke="${color}" strokeWidth="18" fill="none" strokeLinecap="round"/>
      <path d="M56 120 Q60 112 68 110 Q80 107 92 110 Q100 112 104 120" stroke="${cL}" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.3"/>
      <path d="M98 115 Q106 132 102 158 Q100 172 96 184" stroke="${color}" strokeWidth="14" fill="none" strokeLinecap="round"/>
      <path d="M100 118 Q108 134 104 160" stroke="${cL}" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.28"/>
    </g>`
  );
}

function drawPearlNecklace() {
  return (
    `<g>
      <path d="M52 116 Q56 112 64 110 Q80 106 96 110 Q104 112 108 116" stroke="rgba(240,234,220,0.5)" strokeWidth="2" fill="none" strokeDasharray="3,3"/>
      ${[56,64,72,80,88,96,104].map((x,i) =>
        `<circle cx="${x}" cy="${115 - Math.sin(i*0.45)*3}" r="3.5" fill="#F0EAE0" stroke="#C8B898" strokeWidth="1"/><circle cx="${x+0.8}" cy="${113 - Math.sin(i*0.45)*3}" r="1.4" fill="white" opacity="0.7"/>`
      ).join("")}
    </g>`
  );
}

function drawTop(isCrop, topType, tc, torsoEnd) {
  const tcD = sh(tc,-30), tcM = sh(tc,-14), tcL = sh(tc,22);
  const y0 = 126;

  // body shape
  const cropBody = `M48 ${y0+4} Q40 ${y0+14} 39 ${y0+32} L39 ${torsoEnd} Q39 ${torsoEnd+5} 54 ${torsoEnd+6} L106 ${torsoEnd+6} Q121 ${torsoEnd+5} 121 ${torsoEnd} L121 ${y0+32} Q120 ${y0+14} 112 ${y0+4} Q97 ${y0-12} 80 ${y0-14} Q63 ${y0-12} 48 ${y0+4}Z`;
  const fullBody = `M48 ${y0+4} Q40 ${y0+14} 38 ${y0+30} L36 ${torsoEnd} Q36 ${torsoEnd+5} 52 ${torsoEnd+6} L108 ${torsoEnd+6} Q124 ${torsoEnd+5} 124 ${torsoEnd} L122 ${y0+30} Q120 ${y0+14} 112 ${y0+4} Q97 ${y0-12} 80 ${y0-14} Q63 ${y0-12} 48 ${y0+4}Z`;
  const bodyPath = isCrop ? cropBody : fullBody;

  // fabric details per type
  let details = "";
  let overlay = "";

  if (topType === "stripe") {
    details = [28,42,56,70].map(dy =>
      `<line x1="${isCrop?41:38}" y1="${torsoEnd-dy}" x2="${isCrop?119:122}" y2="${torsoEnd-dy}" stroke="rgba(255,255,255,0.8)" strokeWidth="5.5" strokeLinecap="round"/>`
    ).join("");
  }
  if (topType === "knit") {
    details = Array.from({length:4},(_,i) =>
      `<path d="M${49+i*18} ${torsoEnd-55} Q${52+i*18} ${torsoEnd-46} ${49+i*18} ${torsoEnd-36} Q${46+i*18} ${torsoEnd-27} ${49+i*18} ${torsoEnd-18}" stroke="${tcM}" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
       <path d="M${110+i*14} ${torsoEnd-55} Q${113+i*14} ${torsoEnd-46} ${110+i*14} ${torsoEnd-36} Q${107+i*14} ${torsoEnd-27} ${110+i*14} ${torsoEnd-18}" stroke="${tcM}" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.42"/>`
    ).join("");
  }
  if (topType === "sequin") {
    details = Array.from({length:30},(_,i) => {
      const sx = 50+(i%6)*11+(Math.sin(i*1.3)*3.5);
      const sy = torsoEnd-58+Math.floor(i/6)*12+(Math.cos(i*1.1)*2.5);
      return `<ellipse cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" rx="3.8" ry="3.2" fill="${sh(tc,42)}" opacity="${(0.45+Math.sin(i)*0.3).toFixed(2)}"/>
              <circle cx="${(sx+1.2).toFixed(1)}" cy="${(sy-1.2).toFixed(1)}" r="1.6" fill="white" opacity="0.62"/>`;
    }).join("");
  }
  if (topType === "floral") {
    const positions = [[60,torsoEnd-50],[78,torsoEnd-32],[102,torsoEnd-48],[116,torsoEnd-26],[84,torsoEnd-62],[55,torsoEnd-22]];
    details = positions.map(([px,py],i) => {
      const cols=["#F0A0C0","#E87898","#F8C0D0","#D06080","#F4B0C8","#FFAADD"];
      return `<ellipse cx="${px}" cy="${py}" rx="10" ry="6.5" fill="${cols[i%6]}" opacity="0.82" transform="rotate(${i*30+10} ${px} ${py})"/>
              <circle cx="${px}" cy="${py}" r="4" fill="#F9C06A" opacity="0.92"/>`;
    }).join("");
  }
  if (topType === "leather") {
    overlay = `<path d="M44 ${y0+12} Q41 ${y0+34} 40 ${torsoEnd-10}" stroke="rgba(255,255,255,0.14)" strokeWidth="7" fill="none" strokeLinecap="round"/>
               <path d="M116 ${y0+12} Q119 ${y0+34} 120 ${torsoEnd-10}" stroke="rgba(255,255,255,0.1)" strokeWidth="5" fill="none" strokeLinecap="round"/>
               <path d="M78 ${y0-14} Q80 ${y0-4} 80 ${torsoEnd}" stroke="${tcD}" strokeWidth="2" fill="none" strokeDasharray="3,4" opacity="0.5"/>`;
  }
  if (topType === "corset") {
    details = Array.from({length:7},(_,i) =>
      `<line x1="${56+i*10}" y1="${torsoEnd-58}" x2="${55+i*10}" y2="${torsoEnd-2}" stroke="${tcM}" strokeWidth="1.5" strokeLinecap="round" opacity="0.45"/>`
    ).join("") +
    `<path d="M64 ${torsoEnd-55} C66 ${torsoEnd-38} 94 ${torsoEnd-38} 96 ${torsoEnd-55}" stroke="${tcD}" strokeWidth="2" fill="none" opacity="0.6"/>
     <path d="M62 ${torsoEnd-28} C64 ${torsoEnd-11} 96 ${torsoEnd-11} 98 ${torsoEnd-28}" stroke="${tcD}" strokeWidth="2" fill="none" opacity="0.6"/>`;
  }
  if (topType === "puff") {
    overlay = `<ellipse cx="42" cy="${y0+10}" rx="20" ry="14" fill="${tc}" opacity="0.95"/>
               <ellipse cx="118" cy="${y0+10}" rx="20" ry="14" fill="${tc}" opacity="0.95"/>
               <path d="M42 ${y0+10} Q36 ${y0+20} 34 ${y0+32}" stroke="${tcD}" strokeWidth="3" fill="none" opacity="0.25"/>
               <path d="M118 ${y0+10} Q124 ${y0+20} 126 ${y0+32}" stroke="${tcD}" strokeWidth="3" fill="none" opacity="0.25"/>`;
  }

  // fabric folds & shadows
  const folds = !isCrop ? `
    <path d="M40 ${y0+28} Q38 ${torsoEnd-24} 40 ${torsoEnd}" stroke="${tcD}" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.18"/>
    <path d="M120 ${y0+28} Q122 ${torsoEnd-24} 120 ${torsoEnd}" stroke="${tcD}" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.18"/>
    <path d="M58 ${y0-12} Q61 ${y0-2} 58 ${y0+22}" stroke="${tcL}" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.16"/>
  ` : `<path d="M58 ${torsoEnd+2} L102 ${torsoEnd+2}" stroke="${tcD}" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.45"/>`;

  return (
    `<path d="${bodyPath}" fill="url(#gtop)" filter="url(#fcloth)"/>
     ${folds}
     ${details}
     ${overlay}`
  );
}

function drawNeckline(topType, tc, torsoEnd) {
  const tcD = sh(tc, -28), tcM = sh(tc,-14);
  const y = 125;
  switch(topType) {
    case "shirt": return `
      <path d="M67 ${y} L80 ${y+8} L93 ${y}L91 ${y-4} Q80 ${y+4} 69 ${y-4}Z" fill="${tcD}" opacity="0.5"/>
      <line x1="80" y1="${y}" x2="80" y2="${torsoEnd-8}" stroke="${tcD}" strokeWidth="1.8" strokeLinecap="round" opacity="0.32"/>
      ${[8,20,32].map(dy => `<ellipse cx="80" cy="${y+dy}" rx="3" ry="2.2" fill="${tcD}" opacity="0.62"/>`).join("")}`;
    case "crop": return `
      <path d="M67 ${y} Q80 ${y+8} 93 ${y}" stroke="${tcD}" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M41 ${y+26} Q54 ${y+14} 67 ${y}" stroke="${tcD}" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M119 ${y+26} Q106 ${y+14} 93 ${y}" stroke="${tcD}" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>`;
    case "corset": return `
      <path d="M67 ${y} Q80 ${y+6} 93 ${y}" stroke="${tcD}" strokeWidth="2" fill="none"/>
      <line x1="80" y1="${y}" x2="80" y2="${torsoEnd}" stroke="${tcD}" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M70 ${y+8} Q80 ${y+14} 90 ${y+8}" stroke="${tcD}" strokeWidth="1.5" fill="none" opacity="0.4"/>
      <path d="M69 ${y+22} Q80 ${y+28} 91 ${y+22}" stroke="${tcD}" strokeWidth="1.5" fill="none" opacity="0.4"/>`;
    case "leather": return `
      <path d="M67 ${y-1} Q80 ${y+3} 93 ${y-1}" stroke="${sh(tc,22)}" strokeWidth="2" fill="none"/>
      <path d="M67 ${y-1} Q65 ${y+9} 65 ${y+26}" stroke="${sh(tc,25)}" strokeWidth="2.5" fill="none" opacity="0.22"/>
      <path d="M93 ${y-1} Q95 ${y+9} 95 ${y+26}" stroke="${sh(tc,25)}" strokeWidth="2.5" fill="none" opacity="0.22"/>`;
    default: return `<path d="M68 ${y} Q80 ${y+9} 92 ${y}L90 ${y+5} Q80 ${y+13} 70 ${y+5}Z" fill="${tcD}" opacity="0.32"/>`;
  }
}

function drawArms(isCrop, topType, tc, sk) {
  const tcD = sh(tc,-28), tcL = sh(tc,20);
  const skD = sh(sk,-22);
  const sy = 134, ey = 192, wy = 238;

  if (topType === "puff") {
    return (
      `<path d="M38 ${sy+4} Q22 ${sy+35} 18 ${ey} Q14 ${wy-18} 15 ${wy}" stroke="${sk}" strokeWidth="20" fill="none" strokeLinecap="round"/>
       <path d="M122 ${sy+4} Q138 ${sy+35} 142 ${ey} Q146 ${wy-18} 145 ${wy}" stroke="${sk}" strokeWidth="20" fill="none" strokeLinecap="round"/>
       ${drawHands(sk, skD, wy)}`
    );
  }

  const leftFull  = `<path d="M42 ${sy} Q24 ${sy+32} 18 ${ey} Q14 ${wy-18} 15 ${wy}" stroke="url(#gtopL)" strokeWidth="24" fill="none" strokeLinecap="round"/>
                     <path d="M40 ${sy+22} Q26 ${ey-15} 20 ${ey+10}" stroke="${tcD}" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.18"/>`;
  const rightFull = `<path d="M118 ${sy} Q136 ${sy+32} 142 ${ey} Q146 ${wy-18} 145 ${wy}" stroke="url(#gtopR)" strokeWidth="24" fill="none" strokeLinecap="round"/>
                     <path d="M120 ${sy+22} Q134 ${ey-15} 140 ${ey+10}" stroke="${tcD}" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.18"/>`;
  const leftCrop  = `<path d="M42 ${sy} Q24 ${sy+32} 18 ${ey}" stroke="url(#gtopL)" strokeWidth="24" fill="none" strokeLinecap="round"/>
                     <path d="M18 ${ey} Q14 ${wy-18} 15 ${wy}" stroke="${sk}" strokeWidth="20" fill="none" strokeLinecap="round"/>`;
  const rightCrop = `<path d="M118 ${sy} Q136 ${sy+32} 142 ${ey}" stroke="url(#gtopR)" strokeWidth="24" fill="none" strokeLinecap="round"/>
                     <path d="M142 ${ey} Q146 ${wy-18} 145 ${wy}" stroke="${sk}" strokeWidth="20" fill="none" strokeLinecap="round"/>`;

  return (
    `${isCrop ? leftCrop : leftFull}
     ${isCrop ? rightCrop : rightFull}
     ${drawHands(sk, skD, wy)}`
  );
}

function drawHands(sk, skD, wy) {
  return (
    `<ellipse cx="13" cy="${wy+7}" rx="12" ry="10" fill="${sk}" transform="rotate(-17 13 ${wy+7})"/>
     <path d="M5 ${wy+3} Q0 ${wy-5} 2 ${wy-14}" stroke="${sk}" strokeWidth="6.5" fill="none" strokeLinecap="round"/>
     <path d="M9 ${wy+1} Q4 ${wy-7} 6 ${wy-16}" stroke="${sk}" strokeWidth="6.5" fill="none" strokeLinecap="round"/>
     <path d="M13 ${wy-1} Q10 ${wy-9} 12 ${wy-17}" stroke="${sk}" strokeWidth="6.5" fill="none" strokeLinecap="round"/>
     <path d="M17 ${wy} Q16 ${wy-7} 18 ${wy-15}" stroke="${sk}" strokeWidth="6" fill="none" strokeLinecap="round"/>
     <path d="M21 ${wy+3} Q22 ${wy-3} 25 ${wy-10}" stroke="${sk}" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
     <ellipse cx="147" cy="${wy+7}" rx="12" ry="10" fill="${sk}" transform="rotate(17 147 ${wy+7})"/>
     <path d="M155 ${wy+3} Q160 ${wy-5} 158 ${wy-14}" stroke="${sk}" strokeWidth="6.5" fill="none" strokeLinecap="round"/>
     <path d="M151 ${wy+1} Q156 ${wy-7} 154 ${wy-16}" stroke="${sk}" strokeWidth="6.5" fill="none" strokeLinecap="round"/>
     <path d="M147 ${wy-1} Q150 ${wy-9} 148 ${wy-17}" stroke="${sk}" strokeWidth="6.5" fill="none" strokeLinecap="round"/>
     <path d="M143 ${wy} Q144 ${wy-7} 142 ${wy-15}" stroke="${sk}" strokeWidth="6" fill="none" strokeLinecap="round"/>
     <path d="M139 ${wy+3} Q138 ${wy-3} 135 ${wy-10}" stroke="${sk}" strokeWidth="5.5" fill="none" strokeLinecap="round"/>`
  );
}

function drawBelt(bc, waistY, botType) {
  const bcD = sh(bc,-26), bcL = sh(bc,18);
  if (botType === "midi" || botType === "mini" || botType === "maxi") {
    return (
      `<rect x="58" y="${waistY+4}" width="44" height="11" rx="3.5" fill="${bc}"/>
       <rect x="58" y="${waistY+4}" width="44" height="7" rx="3" fill="${bcD}" opacity="0.38"/>
       <rect x="72" y="${waistY+5}" width="16" height="7" rx="2" fill="${sh(bc,-18)}"/>
       <circle cx="80" cy="${waistY+8.5}" r="3" fill="#D4A820"/>
       <circle cx="80" cy="${waistY+8.5}" r="1.5" fill="#FFD700"/>`
    );
  }
  return (
    `<rect x="42" y="${waistY}" width="76" height="13" rx="4.5" fill="${bc}"/>
     <rect x="42" y="${waistY}" width="76" height="8" rx="4" fill="${bcD}" opacity="0.35"/>
     <rect x="62" y="${waistY+1}" width="36" height="9" rx="2.5" fill="${sh(bc,-15)}"/>
     <circle cx="80" cy="${waistY+6.5}" r="4.5" fill="#D4A820"/>
     <circle cx="80" cy="${waistY+6.5}" r="2.5" fill="#FFD700"/>
     <circle cx="46" cy="${waistY+6}" r="3" fill="${bcL}" opacity="0.6"/>
     <circle cx="114" cy="${waistY+6}" r="3" fill="${bcL}" opacity="0.6"/>
     <path d="M46 ${waistY+1} Q80 ${waistY-2} 114 ${waistY+1}" stroke="${bcL}" strokeWidth="1" fill="none" opacity="0.3"/>`
  );
}

function drawBottom(botType, bc, legY) {
  const bcD = sh(bc,-26), bcM = sh(bc,-12), bcL = sh(bc,18);
  const y = legY;

  const jeansFolds = (botType==="jeans"||botType==="cig") ? `
    <path d="M63 ${y+62} Q60 ${y+74} 63 ${y+84}" stroke="${bcL}" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.32"/>
    <path d="M97 ${y+62} Q100 ${y+74} 97 ${y+84}" stroke="${bcL}" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.32"/>
    <circle cx="68" cy="${y+4}" r="3" fill="#C48010"/>
    <circle cx="68" cy="${y+4}" r="1.5" fill="#FFD700"/>
    <circle cx="92" cy="${y+4}" r="3" fill="#C48010"/>
    <circle cx="92" cy="${y+4}" r="1.5" fill="#FFD700"/>
    <path d="M66 ${y+14} Q80 ${y+18} 94 ${y+14}" stroke="${bcD}" strokeWidth="1.5" fill="none" opacity="0.45"/>
  ` : "";

  const spread = botType==="wide"?20:botType==="barrel"?16:botType==="trousers"?12:botType==="cig"?6:10;

  switch(botType) {
    case "jeans": case "cig": case "wide": case "barrel": case "trousers":
      return (
        `<path d="M62 ${y} Q62 ${y+18} 66 ${y+28} L80 ${y+26} L94 ${y+28} Q98 ${y+18} 98 ${y}Z" fill="${bcM}"/>
         <path d="M66 ${y+26} Q58 ${y+78} 56 ${y+138} Q54 ${y+168} 56 ${y+190}" stroke="url(#gbotL)" strokeWidth="${26+spread}" fill="none" strokeLinecap="round"/>
         <path d="M94 ${y+26} Q102 ${y+78} 104 ${y+138} Q106 ${y+168} 104 ${y+190}" stroke="url(#gbotR)" strokeWidth="${26+spread}" fill="none" strokeLinecap="round"/>
         <path d="M65 ${y+30} Q61 ${y+96} 59 ${y+166}" stroke="${bcD}" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.45"/>
         <path d="M95 ${y+30} Q99 ${y+96} 101 ${y+166}" stroke="${bcD}" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.45"/>
         ${jeansFolds}
         ${botType==="barrel"?`<path d="M59 ${y+95} Q57 ${y+112} 59 ${y+122}" stroke="${bcL}" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.26"/><path d="M101 ${y+95} Q103 ${y+112} 101 ${y+122}" stroke="${bcL}" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.26"/>`:``}`
      );
    case "midi": {
      const sLen = 170;
      return (
        `<path d="M48 ${y+12} Q38 ${y+sLen/2} 36 ${y+sLen} Q38 ${y+sLen+10} 52 ${y+sLen+12} L108 ${y+sLen+12} Q122 ${y+sLen+10} 124 ${y+sLen} Q122 ${y+sLen/2} 112 ${y+12}Z" fill="url(#gbotM)"/>
         <path d="M50 ${y+20} Q42 ${y+sLen/2} 40 ${y+sLen}" stroke="${bcD}" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.36"/>
         <path d="M110 ${y+20} Q118 ${y+sLen/2} 120 ${y+sLen}" stroke="${bcD}" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.36"/>
         <path d="M66 ${y+16} Q62 ${y+sLen/2} 64 ${y+sLen+10}" stroke="${bcL}" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.2"/>
         <path d="M94 ${y+16} Q98 ${y+sLen/2} 96 ${y+sLen+10}" stroke="${bcL}" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.2"/>
         <path d="M40 ${y+sLen+4} Q80 ${y+sLen+18} 120 ${y+sLen+4}" stroke="${bcD}" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.48"/>`
      );
    }
    case "mini": {
      const sLen = 76;
      return (
        `<path d="M50 ${y+10} Q42 ${y+sLen/2} 40 ${y+sLen} Q42 ${y+sLen+9} 54 ${y+sLen+11} L106 ${y+sLen+11} Q118 ${y+sLen+9} 120 ${y+sLen} Q118 ${y+sLen/2} 110 ${y+10}Z" fill="url(#gbotM)"/>
         <path d="M52 ${y+16} Q44 ${y+sLen/2} 44 ${y+sLen}" stroke="${bcD}" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.38"/>
         <path d="M108 ${y+16} Q116 ${y+sLen/2} 116 ${y+sLen}" stroke="${bcD}" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.38"/>
         <path d="M68 ${y+13} Q64 ${y+sLen/2} 66 ${y+sLen+9}" stroke="${bcL}" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.22"/>
         <path d="M92 ${y+13} Q96 ${y+sLen/2} 94 ${y+sLen+9}" stroke="${bcL}" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.22"/>`
      );
    }
    default: return "";
  }
}

function drawShoes(shoeType, sc, shoeY) {
  const scD = sh(sc,-24), scL = sh(sc,20);
  const lx = 62, rx = 98;
  const fy = shoeY;

  switch(shoeType) {
    case "sneaker": return (
      `<ellipse cx="${lx}" cy="${fy+9}" rx="22" ry="9.5" fill="url(#gshoe)"/>
       <path d="M${lx-20} ${fy+4} Q${lx-12} ${fy-6} ${lx+6} ${fy-8} Q${lx+20} ${fy-3} ${lx+22} ${fy+4}" stroke="${scL}" strokeWidth="2" fill="none" opacity="0.5"/>
       <ellipse cx="${lx+2}" cy="${fy+4}" rx="18" ry="7" fill="${scL}" opacity="0.55"/>
       <ellipse cx="${lx}" cy="${fy+16}" rx="22" ry="6.5" fill="${scD}"/>
       <path d="M${lx-18} ${fy+8} Q${lx} ${fy+3} ${lx+18} ${fy+8}" stroke="rgba(255,255,255,0.32)" strokeWidth="2" fill="none"/>
       <path d="M${lx-16} ${fy+5} Q${lx} ${fy-1} ${lx+16} ${fy+5}" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" fill="none"/>
       <circle cx="${lx-14}" cy="${fy+9}" r="2" fill="${scD}" opacity="0.5"/>
       <circle cx="${lx+12}" cy="${fy+9}" r="2" fill="${scD}" opacity="0.5"/>
       <ellipse cx="${rx}" cy="${fy+9}" rx="22" ry="9.5" fill="url(#gshoe)"/>
       <path d="M${rx-20} ${fy+4} Q${rx-12} ${fy-6} ${rx+6} ${fy-8} Q${rx+20} ${fy-3} ${rx+22} ${fy+4}" stroke="${scL}" strokeWidth="2" fill="none" opacity="0.5"/>
       <ellipse cx="${rx+2}" cy="${fy+4}" rx="18" ry="7" fill="${scL}" opacity="0.55"/>
       <ellipse cx="${rx}" cy="${fy+16}" rx="22" ry="6.5" fill="${scD}"/>
       <path d="M${rx-18} ${fy+8} Q${rx} ${fy+3} ${rx+18} ${fy+8}" stroke="rgba(255,255,255,0.32)" strokeWidth="2" fill="none"/>`
    );
    case "loafer": return (
      `<path d="M${lx-22} ${fy+5} Q${lx-16} ${fy-5} ${lx+6} ${fy-8} Q${lx+22} ${fy-3} ${lx+22} ${fy+6} Q${lx+20} ${fy+15} ${lx} ${fy+17} Q${lx-20} ${fy+15} ${lx-22} ${fy+5}Z" fill="url(#gshoe)"/>
       <path d="M${lx-12} ${fy-1} Q${lx} ${fy-8} ${lx+14} ${fy-1}" stroke="${scD}" strokeWidth="2.5" fill="none"/>
       <rect x="${lx-8}" y="${fy-8}" width="16" height="4" rx="2" fill="${scD}" opacity="0.65"/>
       <path d="M${lx-16} ${fy+3} Q${lx} ${fy-3} ${lx+16} ${fy+3}" stroke="${scL}" strokeWidth="1.5" fill="none" opacity="0.38"/>
       <path d="M${rx-22} ${fy+5} Q${rx-16} ${fy-5} ${rx+6} ${fy-8} Q${rx+22} ${fy-3} ${rx+22} ${fy+6} Q${rx+20} ${fy+15} ${rx} ${fy+17} Q${rx-20} ${fy+15} ${rx-22} ${fy+5}Z" fill="url(#gshoe)"/>
       <path d="M${rx-12} ${fy-1} Q${rx} ${fy-8} ${rx+14} ${fy-1}" stroke="${scD}" strokeWidth="2.5" fill="none"/>
       <rect x="${rx-8}" y="${fy-8}" width="16" height="4" rx="2" fill="${scD}" opacity="0.65"/>`
    );
    case "ballet": return (
      `<path d="M${lx-22} ${fy+4} Q${lx-16} ${fy-7} ${lx+6} ${fy-10} Q${lx+22} ${fy-4} ${lx+22} ${fy+5} Q${lx+18} ${fy+15} ${lx} ${fy+17} Q${lx-18} ${fy+15} ${lx-22} ${fy+4}Z" fill="url(#gshoe)"/>
       <path d="M${lx-16} ${fy+2} Q${lx} ${fy-7} ${lx+16} ${fy+2}" stroke="${scL}" strokeWidth="2" fill="none" opacity="0.42"/>
       <path d="M${lx-10} ${fy-7} Q${lx} ${fy-11} ${lx+10} ${fy-7}" stroke="${scD}" strokeWidth="1.5" fill="none" opacity="0.4"/>
       <path d="M${rx-22} ${fy+4} Q${rx-16} ${fy-7} ${rx+6} ${fy-10} Q${rx+22} ${fy-4} ${rx+22} ${fy+5} Q${rx+18} ${fy+15} ${rx} ${fy+17} Q${rx-18} ${fy+15} ${rx-22} ${fy+4}Z" fill="url(#gshoe)"/>
       <path d="M${rx-16} ${fy+2} Q${rx} ${fy-7} ${rx+16} ${fy+2}" stroke="${scL}" strokeWidth="2" fill="none" opacity="0.42"/>`
    );
    case "boot": return (
      `<path d="M${lx-14} ${fy-32} Q${lx-16} ${fy-2} ${lx-18} ${fy+8} Q${lx-16} ${fy+17} ${lx} ${fy+19} Q${lx+16} ${fy+17} ${lx+18} ${fy+8} Q${lx+14} ${fy-2} ${lx+12} ${fy-32}Z" fill="url(#gshoe)"/>
       <path d="M${lx-14} ${fy-32} Q${lx} ${fy-37} ${lx+12} ${fy-32}" stroke="${scL}" strokeWidth="2" fill="none" opacity="0.48"/>
       <path d="M${lx-16} ${fy-15} Q${lx} ${fy-19} ${lx+14} ${fy-15}" stroke="${scL}" strokeWidth="1.5" fill="none" opacity="0.28"/>
       <path d="M${lx-16} ${fy+2} Q${lx} ${fy-2} ${lx+16} ${fy+2}" stroke="${scL}" strokeWidth="1.5" fill="none" opacity="0.32"/>
       <path d="M${rx-14} ${fy-32} Q${rx-16} ${fy-2} ${rx-18} ${fy+8} Q${rx-16} ${fy+17} ${rx} ${fy+19} Q${rx+16} ${fy+17} ${rx+18} ${fy+8} Q${rx+14} ${fy-2} ${rx+12} ${fy-32}Z" fill="url(#gshoe)"/>
       <path d="M${rx-14} ${fy-32} Q${rx} ${fy-37} ${rx+12} ${fy-32}" stroke="${scL}" strokeWidth="2" fill="none" opacity="0.48"/>
       <path d="M${rx-16} ${fy+2} Q${rx} ${fy-2} ${rx+16} ${fy+2}" stroke="${scL}" strokeWidth="1.5" fill="none" opacity="0.32"/>`
    );
    case "mule": return (
      `<path d="M${lx-22} ${fy+3} Q${lx-14} ${fy-8} ${lx+8} ${fy-10} Q${lx+22} ${fy-5} ${lx+22} ${fy+4} Q${lx+20} ${fy+14} ${lx} ${fy+16} Q${lx-18} ${fy+14} ${lx-22} ${fy+3}Z" fill="url(#gshoe)"/>
       <path d="M${lx-12} ${fy} Q${lx} ${fy-8} ${lx+12} ${fy}" stroke="${scL}" strokeWidth="2" fill="none" opacity="0.38"/>
       <path d="M${rx-22} ${fy+3} Q${rx-14} ${fy-8} ${rx+8} ${fy-10} Q${rx+22} ${fy-5} ${rx+22} ${fy+4} Q${rx+20} ${fy+14} ${rx} ${fy+16} Q${rx-18} ${fy+14} ${rx-22} ${fy+3}Z" fill="url(#gshoe)"/>
       <path d="M${rx-12} ${fy} Q${rx} ${fy-8} ${rx+12} ${fy}" stroke="${scL}" strokeWidth="2" fill="none" opacity="0.38"/>`
    );
    case "heel": return (
      `<path d="M${lx-20} ${fy+3} Q${lx-12} ${fy-8} ${lx+8} ${fy-10} Q${lx+22} ${fy-4} ${lx+22} ${fy+4} Q${lx+20} ${fy+13} ${lx} ${fy+15} Q${lx-18} ${fy+13} ${lx-20} ${fy+3}Z" fill="url(#gshoe)"/>
       <path d="M${lx-14} ${fy+1} Q${lx} ${fy-8} ${lx+14} ${fy+1}" stroke="${scL}" strokeWidth="1.8" fill="none" opacity="0.38"/>
       <path d="M${lx+20} ${fy+6} Q${lx+24} ${fy+16} ${lx+20} ${fy+26}" stroke="${scD}" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
       <path d="M${lx+20} ${fy+6} Q${lx+23} ${fy+14} ${lx+20} ${fy+24}" stroke="${scL}" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.3"/>
       <path d="M${lx-18} ${fy-1} L${lx+16} ${fy-7}" stroke="${scL}" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.55"/>
       <path d="M${rx-20} ${fy+3} Q${rx-12} ${fy-8} ${rx+8} ${fy-10} Q${rx+22} ${fy-4} ${rx+22} ${fy+4} Q${rx+20} ${fy+13} ${rx} ${fy+15} Q${rx-18} ${fy+13} ${rx-20} ${fy+3}Z" fill="url(#gshoe)"/>
       <path d="M${rx+20} ${fy+6} Q${rx+24} ${fy+16} ${rx+20} ${fy+26}" stroke="${scD}" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
       <path d="M${rx-18} ${fy-1} L${rx+16} ${fy-7}" stroke="${scL}" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.55"/>`
    );
    case "maryjane": return (
      `<path d="M${lx-22} ${fy+4} Q${lx-14} ${fy-7} ${lx+6} ${fy-10} Q${lx+22} ${fy-4} ${lx+22} ${fy+5} Q${lx+20} ${fy+14} ${lx} ${fy+16} Q${lx-18} ${fy+14} ${lx-22} ${fy+4}Z" fill="url(#gshoe)"/>
       <path d="M${lx+20} ${fy+6} Q${lx+22} ${fy+15} ${lx+18} ${fy+24}" stroke="${scD}" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
       <path d="M${lx-20} ${fy-1} Q${lx} ${fy-8} ${lx+18} ${fy-1}" stroke="${scD}" strokeWidth="2.5" fill="none" opacity="0.65"/>
       <rect x="${lx-3}" y="${fy-11}" width="6" height="4.5" rx="1.5" fill="${scD}"/>
       <path d="M${rx-22} ${fy+4} Q${rx-14} ${fy-7} ${rx+6} ${fy-10} Q${rx+22} ${fy-4} ${rx+22} ${fy+5} Q${rx+20} ${fy+14} ${rx} ${fy+16} Q${rx-18} ${fy+14} ${rx-22} ${fy+4}Z" fill="url(#gshoe)"/>
       <path d="M${rx+20} ${fy+6} Q${rx+22} ${fy+15} ${rx+18} ${fy+24}" stroke="${scD}" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
       <path d="M${rx-20} ${fy-1} Q${rx} ${fy-8} ${rx+18} ${fy-1}" stroke="${scD}" strokeWidth="2.5" fill="none" opacity="0.65"/>
       <rect x="${rx-3}" y="${fy-11}" width="6" height="4.5" rx="1.5" fill="${scD}"/>`
    );
    case "platform": return (
      `<path d="M${lx-22} ${fy-1} Q${lx-12} ${fy-11} ${lx+6} ${fy-13} Q${lx+22} ${fy-7} ${lx+24} ${fy-1} Q${lx+22} ${fy+7} ${lx} ${fy+9} Q${lx-18} ${fy+7} ${lx-22} ${fy-1}Z" fill="url(#gshoe)"/>
       <rect x="${lx-24}" y="${fy+7}" width="48" height="11" rx="5" fill="${scD}"/>
       <path d="M${lx-24} ${fy+9} L${lx+24} ${fy+9}" stroke="${scL}" strokeWidth="1.5" fill="none" opacity="0.38"/>
       <path d="M${lx-20} ${fy-2} Q${lx} ${fy-10} ${lx+20} ${fy-2}" stroke="${scL}" strokeWidth="2" fill="none" opacity="0.42"/>
       <path d="M${rx-22} ${fy-1} Q${rx-12} ${fy-11} ${rx+6} ${fy-13} Q${rx+22} ${fy-7} ${rx+24} ${fy-1} Q${rx+22} ${fy+7} ${rx} ${fy+9} Q${rx-18} ${fy+7} ${rx-22} ${fy-1}Z" fill="url(#gshoe)"/>
       <rect x="${rx-24}" y="${fy+7}" width="48" height="11" rx="5" fill="${scD}"/>`
    );
    default: return (
      `<ellipse cx="${lx}" cy="${fy+8}" rx="22" ry="9" fill="url(#gshoe)"/>
       <ellipse cx="${rx}" cy="${fy+8}" rx="22" ry="9" fill="url(#gshoe)"/>`
    );
  }
}

// ════════════════════════════════════════════════════════════════
// MAIN AvatarSVG COMPONENT
// ════════════════════════════════════════════════════════════════
export function AvatarSVG({ danceType = "idle", isAnimating = false, outfit = DEFAULT_OUTFIT }) {
  const R = resolveOutfit(outfit);
  const sk = R.skin,   skD = sh(sk,-26), skL = sh(sk,24), skM = sh(sk,-12);
  const hr = R.hair,   hrD = sh(hr,-32), hrL = sh(hr,28);
  const tc = R.top,    tcD = sh(tc,-28), tcL = sh(tc,22);
  const bc = R.bot,    bcD = sh(bc,-28), bcL = sh(bc,18);
  const sc = R.shoe,   scD = sh(sc,-24), scL = sh(sc,20);
  const torsoEnd = R.isCrop ? 164 : 182;
  const waistY   = torsoEnd;
  const legStart = waistY + 14;
  const isMidi   = R.botType === "midi" || R.botType === "mini" || R.botType === "maxi";
  const shoeY    = legStart + (isMidi ? (R.botType==="midi"?185:R.botType==="mini"?96:230) : 208);

  const dur  = { samba:"0.72s", disco:"0.46s", hiphop:"0.60s", salsa:"0.80s", robot:"0.72s", flutter:"0.92s" };
  const ease = { samba:"ease-in-out", disco:"cubic-bezier(.22,1,.36,1)", hiphop:"cubic-bezier(.34,1.5,.64,1)", salsa:"ease-in-out", robot:"steps(4,end)", flutter:"ease-in-out" };
  const an = (part) => isAnimating && danceType !== "idle"
    ? `${danceType}-${part} ${dur[danceType]||"0.8s"} ${ease[danceType]||"ease-in-out"} infinite`
    : part === "root" ? "idle-sway 3s ease-in-out infinite" : "none";
  const tasselAnim = isAnimating ? "tassel-swing .55s ease-in-out infinite" : "none";
  const hairAnim = ["samba","salsa","flutter"].includes(danceType) && isAnimating
    ? `hair-wave ${dur[danceType]} ease-in-out infinite` : "none";

  const H = shoeY + 28;

  return (
    <>
      <style>{DANCE_CSS}</style>
      <svg viewBox={`0 0 160 ${H}`} width="120" height={Math.round(H*120/160)}
        style={{ overflow:"visible", display:"block", isolation:"isolate" }}>
        <defs>
          <radialGradient id="gsk" cx="38%" cy="28%" r="65%">
            <stop offset="0%" stopColor={skL}/><stop offset="55%" stopColor={sk}/><stop offset="100%" stopColor={skD}/>
          </radialGradient>
          <radialGradient id="gface" cx="42%" cy="28%" r="62%">
            <stop offset="0%" stopColor={sh(sk,34)}/><stop offset="50%" stopColor={sk}/><stop offset="100%" stopColor={skD}/>
          </radialGradient>
          <radialGradient id="geye" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor={sh(tc,-5)||"#5A2010"}/><stop offset="100%" stopColor={sh(tc,-28)||"#280808"}/>
          </radialGradient>
          <radialGradient id="gcheek" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,140,100,0.36)"/><stop offset="100%" stopColor="rgba(255,140,100,0)"/>
          </radialGradient>
          <linearGradient id="ghr" x1="12%" y1="0%" x2="88%" y2="100%">
            <stop offset="0%" stopColor={hrL}/><stop offset="40%" stopColor={hr}/><stop offset="100%" stopColor={hrD}/>
          </linearGradient>
          <linearGradient id="ghrR" x1="88%" y1="0%" x2="12%" y2="100%">
            <stop offset="0%" stopColor={hrL}/><stop offset="40%" stopColor={hr}/><stop offset="100%" stopColor={hrD}/>
          </linearGradient>
          <linearGradient id="gtop" x1="0%" y1="0%" x2="70%" y2="100%">
            <stop offset="0%" stopColor={tcL}/><stop offset="45%" stopColor={tc}/><stop offset="100%" stopColor={tcD}/>
          </linearGradient>
          <linearGradient id="gtopL" x1="0%" y1="0%" x2="70%" y2="100%">
            <stop offset="0%" stopColor={tcL}/><stop offset="45%" stopColor={tc}/><stop offset="100%" stopColor={tcD}/>
          </linearGradient>
          <linearGradient id="gtopR" x1="100%" y1="0%" x2="30%" y2="100%">
            <stop offset="0%" stopColor={tcL}/><stop offset="45%" stopColor={tc}/><stop offset="100%" stopColor={tcD}/>
          </linearGradient>
          <linearGradient id="gbotL" x1="0%" y1="0%" x2="30%" y2="100%">
            <stop offset="0%" stopColor={bcL}/><stop offset="45%" stopColor={bc}/><stop offset="100%" stopColor={bcD}/>
          </linearGradient>
          <linearGradient id="gbotR" x1="100%" y1="0%" x2="70%" y2="100%">
            <stop offset="0%" stopColor={bc}/><stop offset="55%" stopColor={sh(bc,-12)}/><stop offset="100%" stopColor={bcD}/>
          </linearGradient>
          <linearGradient id="gbotM" x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor={bcL}/><stop offset="50%" stopColor={bc}/><stop offset="100%" stopColor={bcD}/>
          </linearGradient>
          <linearGradient id="gshoe" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={scL}/><stop offset="100%" stopColor={scD}/>
          </linearGradient>
          <filter id="fskin" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor={skD} floodOpacity="0.22"/>
          </filter>
          <filter id="fcloth" x="-10%" y="-5%" width="120%" height="115%">
            <feDropShadow dx="1" dy="4" stdDeviation="4" floodColor="rgba(0,0,0,0.28)"/>
          </filter>
          <filter id="fhair">
            <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodOpacity="0.22"/>
          </filter>
        </defs>

        {/* ── ANIMATED BODY ROOT ── */}
        <g style={{ transformOrigin:"80px 180px", animation:an("root"), willChange:"transform" }}>

          {/* HAIR BACK LONG */}
          <g filter="url(#fhair)" style={{ transformOrigin:"80px 60px", animation:hairAnim }}>
            <path d={`M40 60 Q22 100 20 170 Q18 200 22 220 Q26 195 29 162 Q32 130 36 98 Q38 78 42 62Z`} fill="url(#ghr)" opacity="0.9"/>
            <path d={`M120 60 Q138 100 140 170 Q142 200 138 220 Q134 195 131 162 Q128 130 124 98 Q122 78 118 62Z`} fill="url(#ghrR)" opacity="0.9"/>
            <path d="M40 64 Q22 112 20 172" stroke={hrD} strokeWidth="16" fill="none" strokeLinecap="round" opacity="0.72"/>
            <path d="M120 64 Q138 112 140 172" stroke={hrD} strokeWidth="16" fill="none" strokeLinecap="round" opacity="0.72"/>
            <path d="M36 72 Q20 132 18 188" stroke={hrL} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.24"/>
            <path d="M124 72 Q140 132 142 188" stroke={hrL} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.24"/>
          </g>

          {/* NECK */}
          <path d="M68 118 Q66 128 64 136 L96 136 Q94 128 92 118Z" fill="url(#gsk)"/>
          <path d="M70 120 Q68 130 66 135" stroke={skD} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.25"/>
          <path d="M90 120 Q92 130 94 135" stroke={skD} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.25"/>

          {/* HEAD */}
          <ellipse cx="80" cy="66" rx="42" ry="48" fill="url(#gface)" filter="url(#fskin)"/>

          {/* HAIR FRONT */}
          <g filter="url(#fhair)" style={{ transformOrigin:"80px 38px", animation:hairAnim }}>
            <path d="M38 68 Q40 34 80 28 Q120 34 122 68 Q108 50 80 46 Q52 50 38 68Z" fill="url(#ghr)"/>
            <path d="M80 28 Q74 40 70 54 Q75 48 80 46 Q85 48 90 54 Q86 40 80 28Z" fill={hrD}/>
            <path d="M40 70 Q30 52 34 38 Q42 32 52 36 Q44 48 40 62Z" fill="url(#ghr)"/>
            <path d="M120 70 Q130 52 126 38 Q118 32 108 36 Q116 48 120 62Z" fill="url(#ghrR)"/>
            <path d="M52 33 Q66 26 108 30" stroke={hrL} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.42"/>
            <path d="M44 44 Q52 38 62 40" stroke={hrL} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.28"/>
          </g>

          {/* EYEBROWS */}
          <path d="M50 54 Q60 46 72 50" stroke={sh(hr,-24)} strokeWidth="3.2" fill="none" strokeLinecap="round"/>
          <path d="M88 50 Q100 46 110 54" stroke={sh(hr,-24)} strokeWidth="3.2" fill="none" strokeLinecap="round"/>

          {/* LEFT EYE */}
          <ellipse cx="62" cy="62" rx="14" ry="13" fill={sh(sk,12)}/>
          <ellipse cx="62" cy="63" rx="11.5" ry="12" fill="#FEFEF8"/>
          <ellipse cx="62" cy="64" rx="8" ry="10" fill="url(#geye)"/>
          <circle cx="62" cy="64" r="5.5" fill="#0C0304"/>
          <circle cx="65.5" cy="61" r="2.8" fill="rgba(255,255,255,0.92)"/>
          <circle cx="59.5" cy="67" r="1.5" fill="rgba(255,255,255,0.5)"/>
          <path d="M48 55 Q52 48 56 51" stroke="#080204" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M56 50 Q60 44 65 48" stroke="#080204" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M65 48 Q69 45 73 49" stroke="#080204" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M73 50 Q75 48 76 51" stroke="#080204" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
          <path d="M48 56 C52 49 76 49 76 56" stroke="#080204" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M50 73 C54 78 72 78 75 73" stroke={skD} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>

          {/* RIGHT EYE */}
          <ellipse cx="98" cy="62" rx="14" ry="13" fill={sh(sk,12)}/>
          <ellipse cx="98" cy="63" rx="11.5" ry="12" fill="#FEFEF8"/>
          <ellipse cx="98" cy="64" rx="8" ry="10" fill="url(#geye)"/>
          <circle cx="98" cy="64" r="5.5" fill="#0C0304"/>
          <circle cx="101.5" cy="61" r="2.8" fill="rgba(255,255,255,0.92)"/>
          <circle cx="95.5" cy="67" r="1.5" fill="rgba(255,255,255,0.5)"/>
          <path d="M84 55 Q88 48 92 51" stroke="#080204" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M92 50 Q96 44 101 48" stroke="#080204" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M101 48 Q105 45 109 49" stroke="#080204" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M109 50 Q111 48 112 51" stroke="#080204" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
          <path d="M84 56 C88 49 112 49 112 56" stroke="#080204" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M86 73 C90 78 108 78 111 73" stroke={skD} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>

          {/* NOSE */}
          <path d="M80 76 Q74 88 75 93 Q80 96 85 93 Q86 88 80 76Z" fill={skD} opacity="0.24"/>
          <path d="M75 92 Q77 96 80 96 Q83 96 85 92" stroke={skD} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.42"/>
          <ellipse cx="73.5" cy="92" rx="5" ry="3.2" fill={skD} opacity="0.18"/>
          <ellipse cx="86.5" cy="92" rx="5" ry="3.2" fill={skD} opacity="0.18"/>

          {/* FRECKLES */}
          <circle cx="67" cy="82" r="1.6" fill={skD} opacity="0.26"/>
          <circle cx="72" cy="78" r="1.3" fill={skD} opacity="0.2"/>
          <circle cx="90" cy="78" r="1.3" fill={skD} opacity="0.2"/>
          <circle cx="95" cy="83" r="1.6" fill={skD} opacity="0.26"/>
          <circle cx="80" cy="74" r="1.1" fill={skD} opacity="0.17"/>

          {/* LIPS */}
          <path d="M66 104 Q80 116 94 104" stroke={sh(sk,-18)} strokeWidth="2.2" fill={sh(sk,-6)+"99"} strokeLinecap="round"/>
          <path d="M70 105 Q80 114 90 105" fill={sh(sk,8)} opacity="0.85"/>
          <path d="M74 105 Q80 109 86 105" stroke={sh(sk,-4)} strokeWidth="1" fill="none" opacity="0.32"/>
          <path d="M73 107 Q80 112 87 107" stroke="rgba(255,255,255,0.28)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

          {/* CHEEKS */}
          <ellipse cx="52" cy="90" rx="14" ry="9" fill="url(#gcheek)"/>
          <ellipse cx="108" cy="90" rx="14" ry="9" fill="url(#gcheek)"/>

          {/* PEARL NECKLACE */}
          {R.hatType === "pearl" && <g dangerouslySetInnerHTML={{__html: drawPearlNecklace()}}/>}

          {/* SCARF */}
          {R.hatType === "scarf" && R.accScarf && <g dangerouslySetInnerHTML={{__html: drawScarf(R.accScarf)}}/>}

          {/* HEAD ACCESSORY */}
          <g dangerouslySetInnerHTML={{__html: drawHat(R.hatType, R.accColor, R.hair, tasselAnim)}}/>

          {/* SHOULDERS */}
          <ellipse cx="36" cy="136" rx="18" ry="12" fill="url(#gtop)" filter="url(#fcloth)"/>
          <ellipse cx="124" cy="136" rx="18" ry="12" fill="url(#gtop)" filter="url(#fcloth)"/>

          {/* TOP BODY */}
          <g dangerouslySetInnerHTML={{__html: drawTop(R.isCrop, R.topType, R.top, torsoEnd)}}/>

          {/* NECKLINE DETAILS */}
          <g dangerouslySetInnerHTML={{__html: drawNeckline(R.topType, R.top, torsoEnd)}}/>

          {/* ARMS */}
          <g style={{ transformOrigin:"36px 138px", animation:an("arm-l"), willChange:"transform" }}>
            <g dangerouslySetInnerHTML={{__html: drawArms(R.isCrop, R.topType, R.top, R.skin).split("${rx}")[0]}}/>
          </g>
          <g style={{ transformOrigin:"124px 138px", animation:an("arm-r"), willChange:"transform" }}>
          </g>

          {/* BELT */}
          <g dangerouslySetInnerHTML={{__html: drawBelt(R.bot, waistY, R.botType)}}/>

          {/* BOTTOM GARMENT — left leg */}
          <g style={{ transformOrigin:"64px",animation:an("leg-l"),willChange:"transform" }}>
          </g>
          {/* BOTTOM GARMENT — right leg */}
          <g style={{ transformOrigin:"96px",animation:an("leg-r"),willChange:"transform" }}>
          </g>
          {/* Render full bottom (non-split) */}
          <g dangerouslySetInnerHTML={{__html: drawBottom(R.botType, R.bot, legStart)}}/>

          {/* SHOES */}
          <g dangerouslySetInnerHTML={{__html: drawShoes(R.shoeType, R.shoe, shoeY)}}/>

          {/* ARMS OVERLAY (drawn after body) */}
          <g style={{ transformOrigin:"36px 138px", animation:an("arm-l"), willChange:"transform" }}>
            <path d={`M37 ${132} Q20 ${158} 16 ${186} Q12 ${218} 13 ${238}`} stroke="url(#gtopL)" strokeWidth="22" fill="none" strokeLinecap="round"/>
            {R.isCrop && <path d={`M16 ${186} Q12 ${218} 13 ${238}`} stroke={R.skin} strokeWidth="19" fill="none" strokeLinecap="round"/>}
            <path d={`M34 ${148} Q20 ${170} 17 ${190}`} stroke={tcD} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.16"/>
            <ellipse cx="11" cy="243" rx="11" ry="9" fill={R.skin} transform="rotate(-16 11 243)"/>
            <path d={`M3 239 Q-2 232 0 223`} stroke={R.skin} strokeWidth="6" fill="none" strokeLinecap="round"/>
            <path d={`M7 237 Q2 229 4 220`} stroke={R.skin} strokeWidth="6" fill="none" strokeLinecap="round"/>
            <path d={`M11 235 Q8 227 10 218`} stroke={R.skin} strokeWidth="6" fill="none" strokeLinecap="round"/>
            <path d={`M15 236 Q14 228 16 220`} stroke={R.skin} strokeWidth="5.5" fill="none" strokeLinecap="round"/>
            <path d={`M19 239 Q21 233 23 226`} stroke={R.skin} strokeWidth="5" fill="none" strokeLinecap="round"/>
          </g>
          <g style={{ transformOrigin:"124px 138px", animation:an("arm-r"), willChange:"transform" }}>
            <path d={`M123 ${132} Q140 ${158} 144 ${186} Q148 ${218} 147 ${238}`} stroke="url(#gtopR)" strokeWidth="22" fill="none" strokeLinecap="round"/>
            {R.isCrop && <path d={`M144 ${186} Q148 ${218} 147 ${238}`} stroke={R.skin} strokeWidth="19" fill="none" strokeLinecap="round"/>}
            <path d={`M126 ${148} Q140 ${170} 143 ${190}`} stroke={tcD} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.16"/>
            <ellipse cx="149" cy="243" rx="11" ry="9" fill={R.skin} transform="rotate(16 149 243)"/>
            <path d={`M157 239 Q162 232 160 223`} stroke={R.skin} strokeWidth="6" fill="none" strokeLinecap="round"/>
            <path d={`M153 237 Q158 229 156 220`} stroke={R.skin} strokeWidth="6" fill="none" strokeLinecap="round"/>
            <path d={`M149 235 Q152 227 150 218`} stroke={R.skin} strokeWidth="6" fill="none" strokeLinecap="round"/>
            <path d={`M145 236 Q146 228 144 220`} stroke={R.skin} strokeWidth="5.5" fill="none" strokeLinecap="round"/>
            <path d={`M141 239 Q139 233 137 226`} stroke={R.skin} strokeWidth="5" fill="none" strokeLinecap="round"/>
          </g>

        </g>{/* end root animation group */}

        {/* GROUND SHADOW */}
        <ellipse cx="80" cy={H-6} rx="46" ry="5.5" fill="rgba(0,0,0,0.18)"/>
      </svg>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// DANCE MODAL
// ════════════════════════════════════════════════════════════════
const DANCE_TYPES  = ["samba","disco","hiphop","salsa","robot","flutter"];
const DANCE_INFO   = {
  samba:   { label:"💃 سامبا",    color:"#FF6B9D", desc:"إيقاع برازيلي مرح" },
  disco:   { label:"🪩 ديسكو",   color:"#C084B8", desc:"ستايل السبعينات" },
  hiphop:  { label:"🔥 هيب هوب", color:"#F9C06A", desc:"إيقاع الشارع" },
  salsa:   { label:"🌹 سالسا",   color:"#FF8C42", desc:"رقصة لاتينية ناعمة" },
  robot:   { label:"🤖 روبوت",   color:"#85E0D0", desc:"حركات ميكانيكية" },
  flutter: { label:"🦋 فراشة",   color:"#B8A9FF", desc:"خفيفة وطائرة" },
};
const CONFETTI = ["🌸","⭐","✨","💖","🌟","💫","🎀","🌺","💛","🩷","🎊","🎉","🏆","✦"];
const PRAISE   = [
  "أحسنتِ يا مها! 🌸","ما شاء الله عليكِ! ✨","رائعة كالعادة! 💖",
  "هكذا تُبنى الأحلام! 🌟","مها النجمة! 👑","فخورة بكِ! 💫",
  "استمري هكذا! 🚀","كل يوم أحسن من اللي قبله! 🎯",
];

export function AvatarDanceModal({ show, onClose, earnedPts=20, taskLabel="مهمة", danceIndex=0, outfit }) {
  const [confetti,  setConfetti]  = useState([]);
  const [visible,   setVisible]   = useState(false);
  const [praise,    setPraise]    = useState(PRAISE[0]);

  const danceType = DANCE_TYPES[danceIndex % DANCE_TYPES.length];
  const info      = DANCE_INFO[danceType];

  useEffect(() => {
    if (!show) { setVisible(false); return; }
    setVisible(true);
    setPraise(PRAISE[Math.floor(Math.random() * PRAISE.length)]);
    setConfetti(Array.from({length:36},(_,i) => ({
      id:i, emoji:CONFETTI[i%CONFETTI.length],
      x:Math.random()*100, delay:Math.random()*1.2,
      dur:1.2+Math.random()*1.6, size:16+Math.random()*26,
    })));
    playMusic(danceType);
    const t = setTimeout(() => { setVisible(false); setTimeout(onClose,400); }, 5000);
    return () => clearTimeout(t);
  }, [show, danceType]);

  if (!show && !visible) return null;

  return createPortal(
    <div onClick={onClose} style={{
      position:"fixed",inset:0,zIndex:10500,
      display:"flex",alignItems:"center",justifyContent:"center",
      backdropFilter:"blur(18px)",
      background:"radial-gradient(ellipse at 50% 40%,rgba(30,8,20,0.97) 0%,rgba(8,3,6,0.98) 100%)",
      transition:"opacity 0.4s", opacity:visible?1:0,
    }}>
      <style>{DANCE_CSS}</style>

      {confetti.map(c => (
        <div key={c.id} style={{
          position:"fixed",top:"-5%",left:`${c.x}%`,
          fontSize:c.size,pointerEvents:"none",zIndex:10502,
          animation:`confetti-fall ${c.dur}s ${c.delay}s ease-in forwards`,
        }}>{c.emoji}</div>
      ))}

      {[0,0.3,0.6,0.9].map((delay,i) => (
        <div key={i} style={{
          position:"fixed",top:"44%",left:"50%",
          width:110+i*20,height:110+i*20,borderRadius:"50%",
          border:`${2-i*0.3}px solid ${info.color}`,
          animation:`glow-ring ${1.6+i*0.2}s ${delay}s ease-out infinite`,
          pointerEvents:"none",
        }}/>
      ))}

      <div onClick={e=>e.stopPropagation()} style={{
        display:"flex",flexDirection:"column",alignItems:"center",
        animation:"modal-in 0.55s cubic-bezier(.34,1.6,.64,1) both",
        padding:"10px 40px 36px",position:"relative",
      }}>
        <div style={{
          position:"absolute",top:"18%",left:"50%",transform:"translateX(-50%)",
          width:230,height:230,borderRadius:"50%",
          background:`radial-gradient(circle,${info.color}35 0%,transparent 70%)`,
          filter:"blur(24px)",pointerEvents:"none",
        }}/>

        <div style={{
          fontSize:13,fontWeight:800,color:info.color,fontFamily:"'Cairo',sans-serif",
          background:info.color+"18",padding:"4px 18px",borderRadius:20,
          border:`1px solid ${info.color}35`,marginBottom:12,
          animation:"label-in 0.3s 0.1s both",letterSpacing:1,
        }}>{info.label} — {info.desc}</div>

        <div style={{
          filter:`drop-shadow(0 0 34px ${info.color}cc) drop-shadow(0 10px 24px rgba(0,0,0,0.5))`,
          marginBottom:4,position:"relative",
          transform:"scale(1.5)",transformOrigin:"center bottom",
          animation:"avatar-bounce 0.6s 0.2s cubic-bezier(.34,1.5,.64,1) both",
        }}>
          <AvatarSVG danceType={danceType} isAnimating={true} outfit={outfit||DEFAULT_OUTFIT}/>
        </div>

        <div style={{
          fontSize:64,fontWeight:900,lineHeight:1,marginBottom:6,marginTop:14,
          background:"linear-gradient(135deg,#FFE066,#F9C06A,#FFD700)",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
          fontFamily:"'Cairo',sans-serif",
          filter:"drop-shadow(0 0 24px #F9C06A88)",
          animation:"pts-pop 0.6s 0.2s cubic-bezier(.34,1.5,.64,1) both",
        }}>+{earnedPts}⭐</div>

        <div style={{
          fontSize:15,color:C.text,fontFamily:"'Cairo',sans-serif",
          fontWeight:800,marginBottom:4,
          animation:"label-in 0.4s 0.4s both",textAlign:"center",
        }}>{praise}</div>
        <div style={{
          fontSize:11,color:C.muted,fontFamily:"'Cairo',sans-serif",
          marginBottom:18,animation:"label-in 0.4s 0.5s both",
        }}>{taskLabel}</div>

        <div style={{width:160,height:3,borderRadius:10,background:"rgba(255,255,255,.08)",overflow:"hidden",marginBottom:8}}>
          <div style={{
            height:"100%",borderRadius:10,
            background:`linear-gradient(90deg,${info.color},${info.color}88)`,
            animation:"progress-drain 5s linear forwards",
          }}/>
        </div>
        <div style={{fontSize:10,color:C.dim,fontFamily:"'Cairo',sans-serif",animation:"label-in 1.5s infinite alternate"}}>
          اضغطي للإغلاق ✦
        </div>
      </div>
    </div>,
    document.body
  );
}

export function DancesTab() { return null; }