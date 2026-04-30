// ╔══════════════════════════════════════════════════════════════╗
// ║  AvatarStore.jsx — متجر الموضة 2026 فائق الواقعية           ║
// ║  كل قطعة مرسومة بالتفصيل في المتجر                          ║
// ║  لبس حقيقي: ثنيات، خياطة، أنسجة، تفاصيل                    ║
// ╚══════════════════════════════════════════════════════════════╝

import { useState, useEffect, useCallback } from "react";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { AvatarSVG } from "./AvatarDance";
import { STORE_CATALOG, DEFAULT_OUTFIT, STORE_DOC } from "./avatarConfig";


// ════ COLORS ════
const C = {
  bg:"#0A0710", surface:"#110C16", card:"#1A1024", cardHov:"#221530",
  border:"rgba(255,182,213,0.09)", borderLt:"rgba(255,182,213,0.22)",
  accent:"#FF6B9D", accentSoft:"rgba(255,107,157,0.13)",
  gold:"#F9C06A", goldD:"#E8A030",
  purple:"#C084B8", teal:"#7DD3B0", blue:"#60A5E8",
  text:"#FDF0F5", muted:"#C49BB0", dim:"#6B4558",
  danger:"#FF7E7E",
};
const FONT = "'Cairo','Tajawal',sans-serif";

// ════ SHADE ════
function sh(hex, p) {
  try {
    let c=(hex||"").replace("#","");
    if(c.length===3)c=c.split("").map(x=>x+x).join("");
    const n=parseInt(c,16);
    const r=Math.min(255,Math.max(0,(n>>16)+Math.round(2.55*p)));
    const g=Math.min(255,Math.max(0,((n>>8)&0xff)+Math.round(2.55*p)));
    const b=Math.min(255,Math.max(0,(n&0xff)+Math.round(2.55*p)));
    return "#"+((r<<16)|(g<<8)|b).toString(16).padStart(6,"0");
  }catch(e){return hex||"#888";}
}

// ════ CATEGORIES ════
const CATEGORIES = [
  { id:"hair",        label:"💇", labelFull:"الشعر",    accent:C.purple },
  { id:"tops",        label:"👗", labelFull:"التوبات",   accent:C.accent },
  { id:"bottoms",     label:"👖", labelFull:"البنطلون",  accent:C.blue },
  { id:"accessories", label:"🎩", labelFull:"إكسسوار", accent:C.gold },
  { id:"shoes",       label:"👟", labelFull:"الجزمة",   accent:C.teal },
  { id:"skin",        label:"🎨", labelFull:"البشرة",   accent:"#D4A050" },
];

// ════════════════════════════════════════════════════════════════
// GARMENT THUMBNAIL SVGs — realistic mini clothing sketches
// ════════════════════════════════════════════════════════════════
function HairThumb({ color }) {
  const d = sh(color,-30), l = sh(color,25);
  return (
    <svg viewBox="0 0 60 60" width="46" height="46" style={{display:"block"}}>
      <defs>
        <linearGradient id={`hg${color.slice(1)}`} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor={l}/><stop offset="40%" stopColor={color}/><stop offset="100%" stopColor={d}/>
        </linearGradient>
      </defs>
      <path d="M14 20 Q10 35 9 55" stroke={`url(#hg${color.slice(1)})`} strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.88"/>
      <path d="M46 20 Q50 35 51 55" stroke={`url(#hg${color.slice(1)})`} strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.88"/>
      <path d="M12 20 Q10 30 9 42" stroke={d} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.4"/>
      <path d="M48 20 Q50 30 51 42" stroke={d} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.4"/>
      <path d="M14 22 Q16 12 30 10 Q44 12 46 22 Q40 16 30 15 Q20 16 14 22Z" fill={`url(#hg${color.slice(1)})`}/>
      <path d="M30 10 Q27 16 25 22 Q27 19 30 18 Q33 19 35 22 Q33 16 30 10Z" fill={d}/>
      <path d="M18 11 Q22 9 38 11" stroke={l} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
}

function TopThumb({ item }) {
  const tc = item.color||"#F5EDD8";
  const d = sh(tc,-28), m = sh(tc,-14), l = sh(tc,22);
  const isCrop = !!item.isCrop;
  const tp = item.id?.includes("stripe")?"stripe":item.id?.includes("knit")?"knit":item.id?.includes("sequin")?"sequin":item.id?.includes("leather")?"leather":item.id?.includes("floral")?"floral":item.id?.includes("corset")?"corset":item.id?.includes("puff")?"puff":item.id?.includes("btn")?"shirt":"blouse";
  const H = isCrop ? 40 : 52;

  return (
    <svg viewBox={`0 0 60 ${H+8}`} width="46" height="46" style={{display:"block"}}>
      <defs>
        <linearGradient id={`tg${tc.slice(1)}`} x1="0%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor={l}/><stop offset="45%" stopColor={tc}/><stop offset="100%" stopColor={d}/>
        </linearGradient>
      </defs>
      {/* Body */}
      <path d={`M10 12 Q8 16 7 24 L7 ${H} Q7 ${H+4} 14 ${H+5} L46 ${H+5} Q53 ${H+4} 53 ${H} L53 24 Q52 16 50 12 Q42 6 30 5 Q18 6 10 12Z`} fill={`url(#tg${tc.slice(1)})`}/>
      {/* Left sleeve */}
      {tp==="puff"
        ? <ellipse cx="8" cy="14" rx="9" ry="7" fill={l} opacity="0.94"/>
        : <path d={`M10 12 Q3 18 2 28 Q1 35 2 40`} stroke={`url(#tg${tc.slice(1)})`} strokeWidth="10" fill="none" strokeLinecap="round"/>}
      {/* Right sleeve */}
      {tp==="puff"
        ? <ellipse cx="52" cy="14" rx="9" ry="7" fill={l} opacity="0.94"/>
        : <path d={`M50 12 Q57 18 58 28 Q59 35 58 40`} stroke={`url(#tg${tc.slice(1)})`} strokeWidth="10" fill="none" strokeLinecap="round"/>}
      {/* Neckline */}
      <path d={`M24 5 Q30 10 36 5`} stroke={d} strokeWidth="1.5" fill="none"/>
      {/* Fabric details */}
      {tp==="stripe" && [10,18,26,34].map((dy,i) => <line key={i} x1="8" y1={dy} x2="52" y2={dy} stroke="rgba(255,255,255,0.78)" strokeWidth="3.5" strokeLinecap="round"/>)}
      {tp==="knit" && [0,1,2].map(i => <path key={i} d={`M${16+i*10} 14 Q${18+i*10} 20 ${16+i*10} 26 Q${14+i*10} 32 ${16+i*10} 38`} stroke={m} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.48"/>)}
      {tp==="sequin" && Array.from({length:15},(_,i) => {const sx=14+(i%5)*8, sy=12+Math.floor(i/5)*10; return <g key={i}><ellipse cx={sx} cy={sy} rx="3" ry="2.5" fill={sh(tc,42)} opacity="0.65"/><circle cx={sx+0.8} cy={sy-0.8} r="1.2" fill="white" opacity="0.6"/></g>;})}
      {tp==="leather" && <><path d="M8 18 Q7 30 8 44" stroke="rgba(255,255,255,0.14)" strokeWidth="5" fill="none" strokeLinecap="round"/><path d="M52 18 Q53 30 52 44" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" strokeLinecap="round"/></>}
      {tp==="floral" && [[14,18],[28,12],[44,20],[20,32],[38,34]].map(([x,y],i) => <g key={i}><ellipse cx={x} cy={y} rx="6" ry="4" fill={["#F0A0C0","#E87898","#F8C0D0","#D06080","#F4B0C8"][i%5]} opacity="0.82"/><circle cx={x} cy={y} r="2.5" fill="#F9C06A" opacity="0.9"/></g>)}
      {tp==="corset" && Array.from({length:5},(_,i) => <line key={i} x1={18+i*6} y1="8" x2={17+i*6} y2={H+2} stroke={m} strokeWidth="1.2" strokeLinecap="round" opacity="0.42"/>)}
      {tp==="corset" && <><path d={`M16 ${H-20} C18 ${H-12} 42 ${H-12} 44 ${H-20}`} stroke={d} strokeWidth="1.5" fill="none" opacity="0.5"/><path d={`M15 ${H-8} C17 ${H} 43 ${H} 45 ${H-8}`} stroke={d} strokeWidth="1.5" fill="none" opacity="0.5"/></>}
      {tp==="shirt" && <><line x1="30" y1="8" x2="30" y2={H+2} stroke={d} strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>{[0,1,2].map(i=><ellipse key={i} cx={30} cy={14+i*10} rx="2.2" ry="1.8" fill={d} opacity="0.6"/>)}</>}
      {isCrop && <line x1="9" y1={H+2} x2="51" y2={H+2} stroke={d} strokeWidth="2" strokeLinecap="round" opacity="0.45"/>}
      {/* Side folds */}
      <path d="M8 20 Q7 35 8 48" stroke={d} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.16"/>
    </svg>
  );
}

function BottomThumb({ item }) {
  const bc = item.color||"#1E2D4A";
  const d = sh(bc,-26), m = sh(bc,-12), l = sh(bc,18);
  const bt = item.id?.includes("skirt_midi")?"midi":item.id?.includes("skirt_mini")?"mini":item.id?.includes("barrel")?"barrel":item.id?.includes("wide")?"wide":item.id?.includes("tai")||item.id?.includes("trouser")?"trousers":"jeans";
  const spr = bt==="wide"?14:bt==="barrel"?10:bt==="trousers"?7:bt==="cig"?3:6;

  return (
    <svg viewBox="0 0 60 58" width="46" height="46" style={{display:"block"}}>
      <defs>
        <linearGradient id={`bg${bc.slice(1)}`} x1="0%" y1="0%" x2="20%" y2="100%">
          <stop offset="0%" stopColor={l}/><stop offset="45%" stopColor={bc}/><stop offset="100%" stopColor={d}/>
        </linearGradient>
        <linearGradient id={`bgR${bc.slice(1)}`} x1="100%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor={bc}/><stop offset="55%" stopColor={m}/><stop offset="100%" stopColor={d}/>
        </linearGradient>
      </defs>
      {/* Belt */}
      <rect x="6" y="2" width="48" height="10" rx="3" fill={bc}/>
      <rect x="6" y="2" width="48" height="6" rx="3" fill={d} opacity="0.35"/>
      <rect x="22" y="3" width="16" height="7" rx="2" fill={sh(bc,-16)}/>
      <circle cx="30" cy="7" r="3" fill="#D4A820"/><circle cx="30" cy="7" r="1.5" fill="#FFD700"/>

      {(bt==="jeans"||bt==="cig"||bt==="wide"||bt==="barrel"||bt==="trousers") && <>
        {/* Crotch */}
        <path d={`M22 12 Q22 18 24 22 L30 20 L36 22 Q38 18 38 12Z`} fill={m}/>
        {/* Left leg */}
        <path d={`M24 20 Q20 35 19 50`} stroke={`url(#bg${bc.slice(1)})`} strokeWidth={17+spr} fill="none" strokeLinecap="round"/>
        {/* Right leg */}
        <path d={`M36 20 Q40 35 41 50`} stroke={`url(#bgR${bc.slice(1)})`} strokeWidth={17+spr} fill="none" strokeLinecap="round"/>
        {/* Seams */}
        <path d="M23 22 Q20 36 19 52" stroke={d} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.42"/>
        <path d="M37 22 Q40 36 41 52" stroke={d} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.42"/>
        {(bt==="jeans"||bt==="cig") && <>
          <path d="M21 34 Q19 39 21 44" stroke={l} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.3"/>
          <path d="M39 34 Q41 39 39 44" stroke={l} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.3"/>
          <circle cx="14" cy="13" r="2" fill="#C48010"/><circle cx="14" cy="13" r="1" fill="#FFD700"/>
          <circle cx="46" cy="13" r="2" fill="#C48010"/><circle cx="46" cy="13" r="1" fill="#FFD700"/>
        </>}
        {bt==="barrel" && <>
          <path d="M19 32 Q17 40 19 46" stroke={l} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.25"/>
          <path d="M41 32 Q43 40 41 46" stroke={l} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.25"/>
        </>}
      </>}

      {(bt==="midi"||bt==="mini") && (() => {
        const sLen = bt==="midi"?44:28;
        return <>
          <path d={`M8 14 Q4 ${14+sLen/2} 3 ${14+sLen} Q4 ${14+sLen+7} 10 ${14+sLen+9} L50 ${14+sLen+9} Q56 ${14+sLen+7} 57 ${14+sLen} Q56 ${14+sLen/2} 52 14Z`} fill={`url(#bg${bc.slice(1)})`}/>
          <path d="M10 20 Q6 40 5 56" stroke={d} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.35"/>
          <path d="M50 20 Q54 40 55 56" stroke={d} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.35"/>
          <path d="M20 18 Q18 40 19 57" stroke={l} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.18"/>
          <path d="M40 18 Q42 40 41 57" stroke={l} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.18"/>
          {bt==="midi" && <path d={`M4 ${14+sLen+2} Q30 ${14+sLen+14} 56 ${14+sLen+2}`} stroke={d} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.45"/>}
        </>;
      })()}
    </svg>
  );
}

function ShoeThumb({ item }) {
  const sc = item.color||"#F5F5F5";
  const d = sh(sc,-24), l = sh(sc,20);
  const st = item.id?.includes("loafer")?"loafer":item.id?.includes("ballet")||item.id?.includes("coquette")?"ballet":item.id?.includes("boot")?"boot":item.id?.includes("mule")?"mule":item.id?.includes("strappy")||item.id?.includes("heel")?"heel":item.id?.includes("mary")?"maryjane":item.id?.includes("platform")?"platform":"sneaker";

  return (
    <svg viewBox="0 0 60 40" width="46" height="36" style={{display:"block"}}>
      <defs>
        <linearGradient id={`sg${sc.slice(1)}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={l}/><stop offset="100%" stopColor={d}/>
        </linearGradient>
      </defs>
      {st==="sneaker" && <>
        <ellipse cx="30" cy="22" rx="26" ry="12" fill={`url(#sg${sc.slice(1)})`}/>
        <path d="M6 19 Q14 9 34 7 Q50 6 56 14" stroke={l} strokeWidth="2" fill="none" opacity="0.5"/>
        <ellipse cx="32" cy="17" rx="22" ry="9" fill={l} opacity="0.5"/>
        <ellipse cx="30" cy="30" rx="26" ry="8.5" fill={d}/>
        <path d="M8 22 Q30 16 52 22" stroke="rgba(255,255,255,0.32)" strokeWidth="2" fill="none"/>
        <path d="M10 19 Q30 13 50 19" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" fill="none"/>
        <circle cx="11" cy="22" r="2" fill={d} opacity="0.5"/>
        <circle cx="49" cy="22" r="2" fill={d} opacity="0.5"/>
      </>}
      {st==="loafer" && <>
        <path d="M4 20 Q6 10 20 7 Q38 4 52 12 Q58 16 56 22 Q54 30 30 32 Q6 30 4 20Z" fill={`url(#sg${sc.slice(1)})`}/>
        <path d="M18 8 Q30 4 44 10" stroke={d} strokeWidth="3" fill="none"/>
        <rect x="20" y="5" width="20" height="5" rx="2.5" fill={d} opacity="0.65"/>
        <path d="M8 18 Q30 12 52 18" stroke={l} strokeWidth="1.5" fill="none" opacity="0.38"/>
      </>}
      {st==="ballet" && <>
        <path d="M4 22 Q6 10 22 7 Q40 4 54 13 Q58 18 56 23 Q54 32 30 34 Q6 32 4 22Z" fill={`url(#sg${sc.slice(1)})`}/>
        <path d="M20 8 Q30 4 44 10" stroke={l} strokeWidth="2" fill="none" opacity="0.42"/>
        <path d="M22 6 Q30 3 40 7" stroke={d} strokeWidth="1.5" fill="none" opacity="0.4"/>
      </>}
      {st==="boot" && <>
        <path d="M12 2 Q10 14 8 22 Q6 30 8 36 Q10 40 30 40 Q50 40 52 36 Q54 30 52 22 Q46 10 44 2Z" fill={`url(#sg${sc.slice(1)})`}/>
        <path d="M12 2 Q28 -2 44 2" stroke={l} strokeWidth="2" fill="none" opacity="0.48"/>
        <path d="M10 16 Q30 12 50 16" stroke={l} strokeWidth="1.5" fill="none" opacity="0.28"/>
        <path d="M10 26 Q30 22 50 26" stroke={l} strokeWidth="1.5" fill="none" opacity="0.28"/>
      </>}
      {st==="mule" && <>
        <path d="M4 20 Q6 9 24 6 Q44 3 56 13 Q60 18 56 24 Q54 32 30 34 Q4 32 4 20Z" fill={`url(#sg${sc.slice(1)})`}/>
        <path d="M12 14 Q30 9 50 15" stroke={l} strokeWidth="2" fill="none" opacity="0.38"/>
      </>}
      {st==="heel" && <>
        <path d="M4 20 Q6 9 22 6 Q42 3 56 12 Q60 17 56 22 Q54 30 30 32 Q6 30 4 20Z" fill={`url(#sg${sc.slice(1)})`}/>
        <path d="M54 24 Q58 32 54 38" stroke={d} strokeWidth="7" fill="none" strokeLinecap="round"/>
        <path d="M54 24 Q57 30 54 36" stroke={l} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.3"/>
        <path d="M8 16 Q30 10 50 16" stroke={l} strokeWidth="2" fill="none" opacity="0.38"/>
        <path d="M6 12 L50 6" stroke={l} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5"/>
      </>}
      {st==="maryjane" && <>
        <path d="M4 22 Q6 10 22 7 Q42 4 56 14 Q60 18 56 24 Q54 32 30 34 Q4 32 4 22Z" fill={`url(#sg${sc.slice(1)})`}/>
        <path d="M54 24 Q58 32 54 38" stroke={d} strokeWidth="7" fill="none" strokeLinecap="round"/>
        <path d="M8 18 Q30 12 50 18" stroke={d} strokeWidth="3" fill="none" opacity="0.65"/>
        <rect x="26" y="4" width="8" height="5" rx="2" fill={d}/>
      </>}
      {st==="platform" && <>
        <path d="M4 18 Q6 7 22 4 Q42 1 56 10 Q60 15 58 20 Q56 28 30 30 Q4 28 4 18Z" fill={`url(#sg${sc.slice(1)})`}/>
        <rect x="2" y="28" width="56" height="12" rx="5" fill={d}/>
        <line x1="2" y1="30" x2="58" y2="30" stroke={l} strokeWidth="1.5" opacity="0.38"/>
        <path d="M6 16 Q30 11 54 16" stroke={l} strokeWidth="2" fill="none" opacity="0.4"/>
      </>}
    </svg>
  );
}

function SkinThumb({ color }) {
  const d = sh(color,-24), l = sh(color,22);
  return (
    <svg viewBox="0 0 46 46" width="46" height="46" style={{display:"block"}}>
      <defs>
        <radialGradient id={`skinT${color.slice(1)}`} cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor={l}/><stop offset="55%" stopColor={color}/><stop offset="100%" stopColor={d}/>
        </radialGradient>
      </defs>
      <ellipse cx="23" cy="23" rx="18" ry="20" fill={`url(#skinT${color.slice(1)})`}/>
      <circle cx="16" cy="18" r="4.5" fill="white" opacity="0.9"/>
      <circle cx="30" cy="18" r="4.5" fill="white" opacity="0.9"/>
      <circle cx="16" cy="19" r="3" fill={sh(color,-15)}/>
      <circle cx="30" cy="19" r="3" fill={sh(color,-15)}/>
      <circle cx="16" cy="19" r="1.8" fill="#0C0304"/>
      <circle cx="30" cy="19" r="1.8" fill="#0C0304"/>
      <circle cx="17.2" cy="18" r="0.9" fill="white"/>
      <circle cx="31.2" cy="18" r="0.9" fill="white"/>
      <path d="M14 14 Q18 11 22 13" stroke={sh(color,-30)} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M24 13 Q28 11 32 14" stroke={sh(color,-30)} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M16 28 Q23 34 30 28" stroke={sh(color,-18)} strokeWidth="1.5" fill={sh(color,-5)+"77"} strokeLinecap="round"/>
    </svg>
  );
}

function AccThumb({ item }) {
  const ac = item.color||"#C8961A";
  const d = sh(ac,-25), l = sh(ac,22);
  const at = item.icon==="🎓"?"grad":item.icon==="👑"?"crown":item.icon==="😇"?"halo":item.icon==="🌸"?"flower":item.icon==="⭐"?"star":item.icon==="🧢"?"cap":item.icon==="🎨"?"beret":item.icon==="🧣"?"scarf":item.icon==="🦪"?"pearl":item.icon==="😎"?"sun":"none";

  return (
    <svg viewBox="0 0 50 46" width="46" height="42" style={{display:"block"}}>
      {at==="grad" && <>
        <rect x="8" y="22" width="34" height="6" rx="2" fill="#1C1C1C"/>
        <rect x="9" y="22" width="32" height="3" rx="1.5" fill="#2E2E2E"/>
        <path d="M12 22 Q14 8 25 5 Q36 8 38 22Z" fill="#111"/>
        <circle cx="38" cy="22" r="3.5" fill="#D4A820"/>
        <line x1="38" y1="25" x2="38" y2="38" stroke="#B8860B" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="35.5" y1="36" x2="33" y2="44" stroke="#B8860B" strokeWidth="2" strokeLinecap="round"/>
        <line x1="38" y1="38" x2="38" y2="44" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
        <line x1="40.5" y1="36" x2="43" y2="44" stroke="#B8860B" strokeWidth="2" strokeLinecap="round"/>
      </>}
      {at==="crown" && <>
        <path d="M8 24 L14 12 L20 20 L25 6 L30 20 L36 12 L42 24Z" fill="#D4A820"/>
        <rect x="6" y="22" width="38" height="8" rx="3" fill="#B8860B"/>
        <circle cx="12" cy="24" r="3" fill="#FF3333"/>
        <circle cx="22" cy="24" r="3" fill="#4444FF"/>
        <circle cx="25" cy="24" r="3" fill="#D4A820"/>
        <circle cx="38" cy="24" r="3" fill="#DD44DD"/>
      </>}
      {at==="halo" && <>
        <ellipse cx="25" cy="20" rx="18" ry="6" fill="none" stroke="#D4A820" strokeWidth="4.5" opacity="0.9"/>
        <ellipse cx="25" cy="20" rx="18" ry="6" fill="none" stroke="#FFE566" strokeWidth="2" opacity="0.42"/>
      </>}
      {at==="flower" && <>
        {[0,60,120,180,240,300].map((d2,i)=>{const fx=25+14*Math.cos(d2*Math.PI/180),fy=24+10*Math.sin(d2*Math.PI/180);return <ellipse key={i} cx={fx.toFixed(1)} cy={fy.toFixed(1)} rx="7" ry="4.5" fill={i%2===0?"#FF6B9D":"#FFB0CC"} opacity="0.9" transform={`rotate(${d2} ${fx.toFixed(1)} ${fy.toFixed(1)})`}/>;})}
        <circle cx="25" cy="24" r="5.5" fill="#F9C06A"/>
      </>}
      {at==="star" && <>
        <polygon points="25,8 29,20 42,20 32,27 35.5,40 25,33 14.5,40 18,27 8,20 21,20" fill="#F9C06A" opacity="0.95"/>
        <polygon points="25,12 28,20 37,20 31,26 33.5,36 25,30.5 16.5,36 19,26 13,20 22,20" fill="#FFE566"/>
      </>}
      {at==="cap" && <>
        <ellipse cx="25" cy="26" rx="20" ry="7" fill={ac} opacity="0.96"/>
        <path d="M5 26 Q6 14 25 11 Q44 14 45 26Z" fill={sh(ac,14)}/>
        <path d="M34 26 Q42 28 48 26" stroke={d} strokeWidth="4" fill="none" strokeLinecap="round"/>
        <rect x="16" y="22" width="18" height="3.5" rx="1.5" fill={d}/>
      </>}
      {at==="beret" && <>
        <ellipse cx="25" cy="30" rx="22" ry="8" fill={ac} opacity="0.97"/>
        <path d="M3 30 Q4 16 25 12 Q46 16 47 30Z" fill={sh(ac,12)}/>
        <ellipse cx="34" cy="18" rx="7" ry="7" fill={sh(ac,20)}/>
        <circle cx="34" cy="18" r="3.5" fill={sh(ac,30)}/>
      </>}
      {at==="scarf" && <>
        <path d="M10 20 Q14 13 25 11 Q36 13 40 20" stroke={ac} strokeWidth="14" fill="none" strokeLinecap="round"/>
        <path d="M10 20 Q14 13 25 11 Q36 13 40 20" stroke={l} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.3"/>
        <path d="M36 17 Q42 28 40 42" stroke={ac} strokeWidth="10" fill="none" strokeLinecap="round"/>
      </>}
      {at==="pearl" && <>
        <path d="M8 22 Q14 16 25 14 Q36 16 42 22" stroke="rgba(240,234,220,0.5)" strokeWidth="2" fill="none" strokeDasharray="3,3"/>
        {[10,16,22,28,34,40].map((x,i)=><g key={i}><circle cx={x} cy={22-Math.sin(i*0.5)*2} r="4" fill="#F0EAE0" stroke="#C8B898" strokeWidth="1"/><circle cx={x+0.7} cy={20-Math.sin(i*0.5)*2} r="1.7" fill="white" opacity="0.7"/></g>)}
      </>}
      {at==="sun" && <>
        <path d="M8 22 Q10 16 17 14 Q24 12 30 14 Q36 12 43 22 Q36 32 24 32 Q10 32 8 22Z" fill="none"/>
        <path d="M8 22 Q10 14 17 12 Q23 10 28 13 Q34 10 43 22" stroke="#111" strokeWidth="16" fill="none" strokeLinecap="round"/>
        <path d="M8 22 Q10 14 17 12 Q23 10 28 13 Q34 10 43 22" stroke="#2A2A2A" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M4 22 L8 23" stroke="#333" strokeWidth="3" strokeLinecap="round"/>
        <path d="M46 22 L50 23" stroke="#333" strokeWidth="3" strokeLinecap="round"/>
        <path d="M10 18 Q22 14 26 18" stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none"/>
      </>}
      {at==="none" && <>
        <circle cx="25" cy="24" r="18" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeDasharray="4,4"/>
        <line x1="14" y1="14" x2="36" y2="34" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
        <line x1="36" y1="14" x2="14" y2="34" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
      </>}
    </svg>
  );
}

// ════════════════════════════════════════════════════════════════
// ITEM THUMBNAIL SELECTOR
// ════════════════════════════════════════════════════════════════
function ItemThumb({ cat, item }) {
  switch(cat) {
    case "hair":        return <HairThumb color={item.color||"#7A4E24"}/>;
    case "tops":        return <TopThumb item={item}/>;
    case "bottoms":     return <BottomThumb item={item}/>;
    case "shoes":       return <ShoeThumb item={item}/>;
    case "accessories": return <AccThumb item={item}/>;
    case "skin":        return <SkinThumb color={item.color||"#F0B882"}/>;
    default:            return null;
  }
}

// ════════════════════════════════════════════════════════════════
// FIREBASE
// ════════════════════════════════════════════════════════════════
async function loadStoreData() {
  try {
    const snap = await getDoc(doc(db, "settings", STORE_DOC));
    if (snap.exists()) return snap.data();
  } catch(e) {}
  return {
    owned: ["hair_brown","top_silk_cream","pants_dark_denim","acc_grad","acc_none","shoes_white_snkr","skin_tan"],
    equipped: DEFAULT_OUTFIT,
  };
}
async function saveStoreData(data) {
  try { await setDoc(doc(db, "settings", STORE_DOC), data, { merge: true }); } catch(e) {}
}

function findItem(id) {
  for (const items of Object.values(STORE_CATALOG)) {
    const f = items.find(i => i.id === id);
    if (f) return f;
  }
  return null;
}

// ════════════════════════════════════════════════════════════════
// ITEM CARD
// ════════════════════════════════════════════════════════════════
function ItemCard({ cat, item, isOwned, isEquipped, isPreviewing, canAfford, onSelect }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius:16, padding:"10px 8px 10px",
        textAlign:"center", cursor:"pointer",
        transition:"all .18s cubic-bezier(.4,0,.2,1)",
        position:"relative", overflow:"hidden",
        background: isEquipped   ? `rgba(255,107,157,0.1)`
                  : isPreviewing ? `rgba(249,192,106,0.08)`
                  : hovered      ? C.cardHov
                  : C.card,
        border:`1.5px solid ${
          isEquipped   ? "rgba(255,107,157,0.55)"
        : isPreviewing ? "rgba(249,192,106,0.55)"
        : isOwned      ? "rgba(125,211,176,0.3)"
        : canAfford    ? C.border
        : "rgba(255,126,126,0.1)"}`,
        boxShadow: isEquipped   ? `0 0 18px rgba(255,107,157,0.18), 0 2px 8px rgba(0,0,0,.35)`
                 : isPreviewing ? `0 0 14px rgba(249,192,106,0.22), 0 2px 8px rgba(0,0,0,.3)`
                 : hovered      ? "0 4px 20px rgba(0,0,0,.4)"
                 : "0 2px 8px rgba(0,0,0,.25)",
        opacity: !isOwned && !canAfford ? 0.52 : 1,
        transform: hovered && !isEquipped ? "translateY(-2px)" : "none",
        minHeight: 140,
      }}
    >
      {/* رارتي badge */}
      <div style={{
        position:"absolute", top:6, right:7,
        fontSize:8, fontWeight:800, color:item.rarityColor,
        background:item.rarityColor+"18", padding:"2px 7px", borderRadius:20,
        fontFamily:FONT,
      }}>{item.rarity}</div>

      {/* Equipped badge */}
      {isEquipped && (
        <div style={{
          position:"absolute", top:6, left:7,
          fontSize:8.5, color:C.accent, fontWeight:800, fontFamily:FONT,
          background:"rgba(255,107,157,0.14)", padding:"2px 7px", borderRadius:20,
        }}>✓ لابسة</div>
      )}

      {/* Crop badge */}
      {item.isCrop && !isEquipped && (
        <div style={{
          position:"absolute", top:6, left:7,
          fontSize:7.5, color:C.accent, background:"rgba(255,107,157,0.12)",
          padding:"1px 6px", borderRadius:10, fontFamily:FONT, fontWeight:700,
        }}>CROP</div>
      )}

      {/* THUMBNAIL */}
      <div style={{
        width:50, height:50, margin:"14px auto 8px",
        display:"flex", alignItems:"center", justifyContent:"center",
        filter: isEquipped ? `drop-shadow(0 0 6px ${C.accent}66)` : "none",
        transition:"filter .18s",
      }}>
        <ItemThumb cat={cat} item={item}/>
      </div>

      {/* Name */}
      <div style={{
        fontSize:10.5, fontWeight:800, lineHeight:1.3,
        color: isEquipped ? C.accent : C.text,
        fontFamily:FONT, marginBottom:2,
      }}>{item.name}</div>

      {/* Desc */}
      {item.desc && (
        <div style={{ fontSize:8.5, color:C.dim, fontFamily:FONT, marginBottom:5, lineHeight:1.35 }}>
          {item.desc}
        </div>
      )}

      {/* Price / Status */}
      {item.price === 0 || isOwned ? (
        <div style={{ fontSize:9.5, fontWeight:700, fontFamily:FONT, color:isOwned?C.teal:C.dim }}>
          {isOwned ? "✅ مملوكة" : "مجاني 🎁"}
        </div>
      ) : (
        <div style={{
          fontSize:11.5, fontWeight:900, fontFamily:FONT,
          color: canAfford ? C.gold : C.danger,
        }}>⭐ {item.price.toLocaleString()}</div>
      )}

      {/* Bottom glow line */}
      {(isEquipped || isPreviewing) && (
        <div style={{
          position:"absolute", bottom:0, left:"10%", width:"80%", height:2,
          background: isEquipped
            ? `linear-gradient(90deg,transparent,${C.accent},transparent)`
            : `linear-gradient(90deg,transparent,${C.gold},transparent)`,
          borderRadius:2,
        }}/>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// AVATAR OUTFIT MAPPER (for AvatarSVG)
// ════════════════════════════════════════════════════════════════
function mapForAvatar(equipped) {
  return equipped; // AvatarSVG now reads from STORE_CATALOG directly via resolveOutfit()
}

// ════════════════════════════════════════════════════════════════
// MAIN STORE COMPONENT
// ════════════════════════════════════════════════════════════════
export default function AvatarStore({ totalXP = 0, onEquipChange }) {
  const [category,    setCategory]    = useState("tops");
  const [styleFilter, setStyleFilter] = useState("all");
  const [owned,       setOwned]       = useState([
    "hair_brown","top_silk_cream","pants_dark_denim",
    "acc_grad","acc_none","shoes_white_snkr","skin_tan",
  ]);
  const [equipped,  setEquipped]  = useState(DEFAULT_OUTFIT);
  const [preview,   setPreview]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [buying,    setBuying]    = useState(false);
  const [msg,       setMsg]       = useState(null);
  const [fullscreen,setFullscreen]= useState(false);

  // stars calc
  const spentStars   = owned.reduce((s,id)=>{ const it=findItem(id); return it?s+(it.price||0):s; }, 0);
  const availStars   = Math.max(0, totalXP - spentStars);

  useEffect(() => {
    loadStoreData().then(data => {
      if (data.owned)    setOwned(data.owned);
      if (data.equipped) setEquipped(data.equipped);
      setLoading(false);
    });
  }, []);

  const showMsg = useCallback((text, type="success") => {
    setMsg({text,type});
    setTimeout(()=>setMsg(null), 2800);
  }, []);

  const buy = useCallback(async (item) => {
    if (owned.includes(item.id)) return;
    if (availStars < item.price) {
      showMsg(`تحتاجين ${(item.price-availStars).toLocaleString()} نجمة إضافية! 💪`, "error");
      return;
    }
    setBuying(true);
    const newOwned = [...owned, item.id];
    setOwned(newOwned);
    await saveStoreData({ owned: newOwned, equipped });
    setBuying(false);
    showMsg(`✅ اشتريتِ "${item.name}"! يلا تلبسيها 🌸`);
  }, [owned, equipped, availStars, showMsg]);

  const equip = useCallback(async (item) => {
    const cat = Object.entries(STORE_CATALOG).find(([,items])=>items.find(i=>i.id===item.id))?.[0];
    if (!cat) return;
    const newEq = { ...equipped, [cat]: item.id };
    setEquipped(newEq);
    setPreview(null);
    await saveStoreData({ owned, equipped: newEq });
    onEquipChange?.(newEq);
    const catLabel = CATEGORIES.find(c=>c.id===cat)?.labelFull || cat;
    showMsg(`✨ جميلة! تم تغيير ${catLabel}!`);
  }, [equipped, owned, onEquipChange, showMsg]);

  // Current preview outfit (for avatar display)
  const previewOutfit = preview
    ? { ...equipped, [Object.entries(STORE_CATALOG).find(([,items])=>items.find(i=>i.id===preview.id))?.[0]||"tops"]: preview.id }
    : equipped;

  // Items for grid
  const rawItems = STORE_CATALOG[category] || [];
  const items = styleFilter === "all" ? rawItems : rawItems.filter(i => i.style === styleFilter);
  const styles = ["all", ...new Set(rawItems.filter(i=>i.style).map(i=>i.style))];
  const currentCat = CATEGORIES.find(c => c.id === category);

  const styleLabel = (s) => ({
    all:"🛍️ الكل","old money":"💰 Old Money",crop:"✂️ كروب",glamoratti:"✨ Glam",
    classic:"🎩 كلاسيك",bold:"🔥 بولد",coquette:"🎀 Coquette",summer:"☀️ صيفي",
    chic:"💫 شيك",preppy:"⚓ بريبي",glam:"💎 جلام",romantic:"🌸 رومانسي",
    gorpcore:"🥾 جوربكور","Y2K":"🫧 Y2K",edgy:"🖤 إيدجي",casual:"😌 كازويل",
    trendy:"🔥 ترند",fantasy:"🌌 فانتازيا",
  }[s] || s);

  if (loading) return (
    <div style={{textAlign:"center",padding:60,color:C.muted,fontFamily:FONT}}>
      <div style={{width:32,height:32,borderRadius:"50%",border:`2px solid ${C.border}`,borderTopColor:C.accent,animation:"spin .8s linear infinite",display:"inline-block",marginBottom:12}}/>
      <div style={{fontSize:13}}>جاري تحميل متجر الموضة 2026...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{paddingBottom:12,fontFamily:FONT}}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes msgSlide{0%{opacity:0;transform:translateX(-50%) translateY(-12px)}15%,85%{opacity:1;transform:translateX(-50%) translateY(0)}100%{opacity:0;transform:translateX(-50%) translateY(-12px)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:rgba(255,107,157,.28);border-radius:4px}
      `}</style>

      {/* Toast */}
      {msg && (
        <div style={{
          position:"fixed",top:68,left:"50%",transform:"translateX(-50%)",
          zIndex:9999,padding:"11px 24px",borderRadius:24,
          background:msg.type==="error"
            ?"linear-gradient(135deg,rgba(180,40,40,.97),rgba(220,60,60,.97))"
            :"linear-gradient(135deg,rgba(50,160,110,.97),rgba(80,200,140,.97))",
          color:"#fff",fontFamily:FONT,fontWeight:700,fontSize:13.5,
          boxShadow:"0 6px 28px rgba(0,0,0,.5)",whiteSpace:"nowrap",
          animation:"msgSlide 2.8s ease forwards",
        }}>{msg.text}</div>
      )}

      {/* ── HEADER ── */}
      <div style={{
        marginBottom:14,borderRadius:20,
        background:"linear-gradient(135deg,rgba(249,192,106,.08),rgba(255,107,157,.06),rgba(192,132,184,.07))",
        border:"1.5px solid rgba(249,192,106,.2)",
        padding:"14px 16px",position:"relative",overflow:"hidden",
      }}>
        <div style={{position:"absolute",top:-18,right:-18,fontSize:72,opacity:0.04,pointerEvents:"none"}}>🛍️</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
          <div>
            <div style={{fontSize:16,fontWeight:900,color:C.text}}>🛍️ متجر الموضة 2026</div>
            <div style={{fontSize:10.5,color:C.muted,marginTop:2}}>Old Money • Glamoratti • Crop Tops • 80s Glam ✨</div>
          </div>
          <div style={{
            textAlign:"center",
            background:"linear-gradient(135deg,rgba(249,192,106,.18),rgba(249,192,106,.07))",
            borderRadius:16,padding:"9px 14px",
            border:"1.5px solid rgba(249,192,106,.38)",minWidth:72,
          }}>
            <div style={{
              fontSize:20,fontWeight:900,lineHeight:1,
              background:"linear-gradient(135deg,#FFE066,#F9C06A,#E8A840)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
            }}>⭐{availStars.toLocaleString()}</div>
            <div style={{fontSize:9,color:C.dim,marginTop:3}}>نجمة متاحة</div>
          </div>
        </div>
      </div>

      {/* ── AVATAR PREVIEW ── */}
      <div style={{
        marginBottom:14,borderRadius:20,
        background:C.card,border:`1px solid ${C.border}`,
        padding:"12px 14px",display:"flex",gap:14,alignItems:"flex-start",
        position:"relative",overflow:"hidden",
      }}>
        <div style={{
          position:"absolute",top:"40%",left:70,transform:"translateY(-50%)",
          width:130,height:130,borderRadius:"50%",
          background:"radial-gradient(circle,rgba(255,107,157,.12) 0%,transparent 70%)",
          pointerEvents:"none",
        }}/>

        {/* Avatar with click to fullscreen */}
        <div
          onClick={() => setFullscreen(true)}
          style={{flexShrink:0,cursor:"pointer",position:"relative"}}
        >
          <div style={{
            filter:`drop-shadow(0 0 20px rgba(255,107,157,0.22)) drop-shadow(0 8px 18px rgba(0,0,0,0.4))`,
            transition:"filter .3s",
          }}>
            <AvatarSVG danceType="idle" isAnimating={false} outfit={previewOutfit}/>
          </div>
          {preview && (
            <div style={{
              marginTop:2,fontSize:9,color:C.gold,fontWeight:700,
              background:"rgba(249,192,106,.15)",padding:"2px 9px",
              borderRadius:20,border:"1px solid rgba(249,192,106,.28)",textAlign:"center",
            }}>👁 معاينة</div>
          )}
          <div style={{fontSize:9,color:C.dim,marginTop:2,textAlign:"center",opacity:0.65}}>
            🔍 تكبير
          </div>
        </div>

        {/* outfit info + actions */}
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12,fontWeight:800,color:C.text,marginBottom:8}}>
            {preview ? `👁 معاينة: ${preview.name}` : "✨ لبسك الحالي"}
          </div>

          {/* Outfit tags */}
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:preview?10:0}}>
            {Object.entries(equipped).map(([cat,itemId]) => {
              const it = findItem(itemId);
              const catInfo = CATEGORIES.find(c=>c.id===cat);
              if (!it || !catInfo) return null;
              return (
                <div key={cat} style={{
                  fontSize:9.5,color:C.muted,fontFamily:FONT,
                  background:C.surface,padding:"3px 9px",borderRadius:20,
                  border:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:3,
                }}>
                  <span style={{opacity:0.6}}>{catInfo.label}</span>
                  <span style={{maxWidth:52,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{it.name}</span>
                </div>
              );
            })}
          </div>

          {/* Action buttons when preview */}
          {preview && (
            <div style={{display:"flex",gap:7}}>
              {owned.includes(preview.id) ? (
                <button onClick={() => equip(preview)} style={{
                  flex:1,padding:"9px",borderRadius:13,border:"none",cursor:"pointer",
                  fontFamily:FONT,fontWeight:800,fontSize:12,
                  background:`linear-gradient(135deg,${C.accent},#D94F7E)`,color:"#fff",
                  boxShadow:`0 3px 14px rgba(255,107,157,0.4)`,transition:"all .17s",
                }}>✅ تلبسيها!</button>
              ) : (
                <button
                  onClick={() => buy(preview)}
                  disabled={buying || availStars < preview.price}
                  style={{
                    flex:1,padding:"9px",borderRadius:13,border:"none",
                    cursor: buying?"wait": availStars>=preview.price?"pointer":"not-allowed",
                    fontFamily:FONT,fontWeight:800,fontSize:12,
                    background: availStars>=preview.price
                      ?`linear-gradient(135deg,${C.gold},${C.goldD})`:"rgba(255,255,255,.06)",
                    color: availStars>=preview.price?"#1A0A06":C.dim,
                    boxShadow: availStars>=preview.price?`0 3px 14px rgba(249,192,106,0.4)`:"none",
                    transition:"all .17s",
                  }}
                >
                  {buying?"⏳..."
                    : availStars>=preview.price
                    ? `🛒 ⭐${preview.price.toLocaleString()}`
                    : `+${(preview.price-availStars).toLocaleString()}⭐ كمان`}
                </button>
              )}
              <button onClick={() => setPreview(null)} style={{
                padding:"9px 13px",borderRadius:13,fontFamily:FONT,fontSize:12,
                border:`1px solid ${C.border}`,background:C.surface,color:C.muted,cursor:"pointer",
              }}>✕</button>
            </div>
          )}
        </div>
      </div>

      {/* ── CATEGORY TABS ── */}
      <div style={{display:"flex",gap:5,marginBottom:10,overflowX:"auto",paddingBottom:4}}>
        {CATEGORIES.map(cat => {
          const active = category === cat.id;
          return (
            <button key={cat.id}
              onClick={()=>{ setCategory(cat.id); setPreview(null); setStyleFilter("all"); }}
              style={{
                flexShrink:0,padding:"7px 13px",borderRadius:22,
                fontSize:12,fontFamily:FONT,fontWeight:700,cursor:"pointer",
                transition:"all .18s",
                background: active ? cat.accent+"20" : C.surface,
                border:`1.5px solid ${active ? cat.accent+"60" : C.border}`,
                color: active ? cat.accent : C.muted,
                boxShadow: active ? `0 0 12px ${cat.accent}22` : "none",
                display:"flex",alignItems:"center",gap:5,
              }}
            >
              <span>{cat.label}</span>
              {active && <span>{cat.labelFull}</span>}
            </button>
          );
        })}
      </div>

      {/* ── STYLE FILTER ── */}
      {styles.length > 2 && (
        <div style={{display:"flex",gap:5,marginBottom:12,overflowX:"auto",paddingBottom:4}}>
          {styles.map(style => {
            const active = styleFilter === style;
            return (
              <button key={style} onClick={()=>setStyleFilter(style)} style={{
                flexShrink:0,padding:"5px 11px",borderRadius:20,
                fontSize:10.5,fontFamily:FONT,fontWeight:700,cursor:"pointer",
                transition:"all .15s",
                background: active?"rgba(255,107,157,.16)":"rgba(255,255,255,.03)",
                border:`1px solid ${active?"rgba(255,107,157,.5)":C.border}`,
                color: active ? C.accent : C.dim,
              }}>{styleLabel(style)}</button>
            );
          })}
        </div>
      )}

      {/* ── ITEMS GRID ── */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",
        gap:10,animation:"fadeIn .3s ease",
      }}>
        {items.length === 0
          ? <div style={{gridColumn:"1/-1",textAlign:"center",padding:"30px 20px",color:C.dim,fontSize:13,fontFamily:FONT}}>
              😊 مفيش آيتمز بهذا الفلتر
            </div>
          : items.map(item => {
            const isOwned    = owned.includes(item.id);
            const isEquipped = Object.values(equipped).includes(item.id);
            const isPrev     = preview?.id === item.id;
            const canAfford  = availStars >= item.price;
            return (
              <ItemCard
                key={item.id} cat={category} item={item}
                isOwned={isOwned} isEquipped={isEquipped}
                isPreviewing={isPrev} canAfford={canAfford}
                onSelect={() => setPreview(isPrev ? null : item)}
              />
            );
          })
        }
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        marginTop:16,padding:"12px 14px",borderRadius:18,
        background:"linear-gradient(135deg,rgba(255,107,157,.04),rgba(192,132,184,.04))",
        border:`1px solid rgba(255,107,157,.12)`,textAlign:"center",
      }}>
        <div style={{fontSize:11.5,color:C.muted,fontFamily:FONT,lineHeight:2}}>
          🌸 كل مهمة تخليكِ أقرب للأوت فيت اللي بتحلمي بيه!<br/>
          <span style={{color:C.accent,fontWeight:800}}>أنجزي → اكسبي نجوم → اشتري أحدث ستيلات 2026 ✨</span>
        </div>
      </div>

      {/* ── FULLSCREEN MODAL ── */}
      {fullscreen && (
        <div
          onClick={() => setFullscreen(false)}
          style={{
            position:"fixed",inset:0,zIndex:9900,
            background:"rgba(0,0,0,.9)",backdropFilter:"blur(18px)",
            display:"flex",alignItems:"center",justifyContent:"center",
          }}
        >
          <div
            onClick={e=>e.stopPropagation()}
            style={{
              background:C.card,borderRadius:26,
              border:`1.5px solid ${C.borderLt}`,
              padding:"24px 28px",
              display:"flex",flexDirection:"column",alignItems:"center",
              boxShadow:"0 20px 60px rgba(0,0,0,.7)",maxWidth:300,
            }}
          >
            <div style={{fontSize:13,fontWeight:900,color:C.text,fontFamily:FONT,marginBottom:16}}>
              👗 لبسك الكامل
            </div>
            <div style={{transform:"scale(1.45)",transformOrigin:"center bottom",marginBottom:36,marginTop:8}}>
              <AvatarSVG danceType="idle" isAnimating={false} outfit={previewOutfit}/>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center",marginBottom:16,maxWidth:240}}>
              {Object.entries(previewOutfit).map(([cat,itemId]) => {
                const it = findItem(itemId);
                if (!it) return null;
                return (
                  <div key={cat} style={{
                    fontSize:9.5,color:C.muted,fontFamily:FONT,
                    background:C.surface,padding:"3px 11px",borderRadius:20,
                    border:`1px solid ${C.border}`,
                  }}>{it.name}</div>
                );
              })}
            </div>
            <button
              onClick={() => setFullscreen(false)}
              style={{
                padding:"9px 26px",borderRadius:20,
                background:C.accent,color:"#fff",border:"none",
                fontFamily:FONT,fontWeight:800,fontSize:13,cursor:"pointer",
              }}
            >إغلاق ✕</button>
          </div>
        </div>
      )}
    </div>
  );
}