// ╔══════════════════════════════════════════════════════════════╗
// ║  AvatarSVG.jsx — أفاتار فائق الواقعية 2026 Pro Edition     ║
// ║  ✅ جسم واقعي بنسب صحيحة (رقبة، كتف، خصر، ورك)           ║
// ║  ✅ وجه تفصيلي: رموش، عيون ثلاثية الأبعاد، شفايف          ║
// ║  ✅ شعر طويل بطبقات ولمعان                                 ║
// ║  ✅ ملابس واقعية: ثنيات، تدرج، خياطة، أقمشة               ║
// ║  ✅ جزم تفصيلية لكل نوع                                    ║
// ║  ✅ إكسسوارات مرسومة بدقة                                  ║
// ╚══════════════════════════════════════════════════════════════╝

import { STORE_CATALOG, DEFAULT_OUTFIT } from "./avatarConfig_updated";

function sh(hex = "#888", p = 0) {
  try {
    let c = (hex || "#888").replace("#", "");
    if (c.length === 3) c = c.split("").map(x => x + x).join("");
    const n = parseInt(c, 16);
    const cl = v => Math.min(255, Math.max(0, v));
    const r = cl((n >> 16) + Math.round(2.55 * p));
    const g = cl(((n >> 8) & 0xff) + Math.round(2.55 * p));
    const b = cl((n & 0xff) + Math.round(2.55 * p));
    return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
  } catch { return hex || "#888"; }
}

let _uid = 0;
const mkId = () => `a${++_uid}`;

export function AvatarSVG({ outfit = DEFAULT_OUTFIT, size = 1, danceType = "idle", isAnimating = false }) {
  const get = (cat, id) =>
    (STORE_CATALOG[cat] || []).find(i => i.id === id) ||
    (STORE_CATALOG[cat] || [])[0] || {};

  const skinItem = get("skin",        outfit.skin);
  const hairItem = get("hair",        outfit.hair);
  const topItem  = get("tops",        outfit.tops);
  const botItem  = get("bottoms",     outfit.bottoms);
  const accItem  = get("accessories", outfit.accessories);
  const shoeItem = get("shoes",       outfit.shoes);

  const SK = skinItem.color || "#F0B882";
  const HR = hairItem.color || "#7A4E24";
  const TP = topItem.color  || "#F5EDD8";
  const BT = botItem.color  || "#1E2D4A";
  const SH = shoeItem.color || "#F5F5F5";

  const isCrop     = !!topItem.isCrop;
  const noSleeve   = !!topItem.noSleeves;
  const isSkirt    = !!botItem.isSkirt;
  const isMini     = isSkirt && !!botItem.isMini;
  const isWide     = !!botItem.isWide;
  const isBoots    = shoeItem.id?.includes("boot");
  const isBallet   = shoeItem.id?.includes("ballet") || shoeItem.id?.includes("mule");
  const isPlatform = shoeItem.id?.includes("platform");
  const isHeels    = shoeItem.id?.includes("strappy") || shoeItem.id?.includes("coquette") || shoeItem.id?.includes("heel");

  const skD = sh(SK,-22); const skL = sh(SK,22);
  const hrD = sh(HR,-35); const hrL = sh(HR,32);
  const tpD = sh(TP,-30); const tpL = sh(TP,22);
  const btD = sh(BT,-28); const btL = sh(BT,18);
  const shD = sh(SH,-26); const shL = sh(SH,28);

  const u = mkId();

  return (
    <svg
      viewBox="0 0 200 430"
      width={200 * size}
      height={430 * size}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <radialGradient id={`sk${u}`} cx="38%" cy="28%" r="68%">
          <stop offset="0%" stopColor={skL}/><stop offset="55%" stopColor={SK}/><stop offset="100%" stopColor={skD}/>
        </radialGradient>
        <radialGradient id={`skf${u}`} cx="36%" cy="30%" r="66%">
          <stop offset="0%" stopColor={sh(SK,30)}/><stop offset="50%" stopColor={SK}/><stop offset="100%" stopColor={skD}/>
        </radialGradient>
        <linearGradient id={`hr${u}`} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor={hrL}/><stop offset="40%" stopColor={HR}/><stop offset="100%" stopColor={hrD}/>
        </linearGradient>
        <linearGradient id={`hrb${u}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={hrD}/><stop offset="100%" stopColor={sh(hrD,-20)}/>
        </linearGradient>
        <linearGradient id={`tp${u}`} x1="12%" y1="0%" x2="88%" y2="100%">
          <stop offset="0%" stopColor={tpL}/><stop offset="45%" stopColor={TP}/><stop offset="100%" stopColor={tpD}/>
        </linearGradient>
        <linearGradient id={`tps${u}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={tpL}/><stop offset="100%" stopColor={tpD}/>
        </linearGradient>
        <linearGradient id={`btL${u}`} x1="18%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={btL}/><stop offset="50%" stopColor={BT}/><stop offset="100%" stopColor={btD}/>
        </linearGradient>
        <linearGradient id={`btR${u}`} x1="82%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={BT}/><stop offset="50%" stopColor={sh(BT,-12)}/><stop offset="100%" stopColor={btD}/>
        </linearGradient>
        <linearGradient id={`btS${u}`} x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor={btL}/><stop offset="50%" stopColor={BT}/><stop offset="100%" stopColor={btD}/>
        </linearGradient>
        <radialGradient id={`sh${u}`} cx="30%" cy="26%" r="74%">
          <stop offset="0%" stopColor={shL}/><stop offset="60%" stopColor={SH}/><stop offset="100%" stopColor={shD}/>
        </radialGradient>
        <linearGradient id={`arm${u}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={skL}/><stop offset="60%" stopColor={SK}/><stop offset="100%" stopColor={skD}/>
        </linearGradient>
        <radialGradient id={`eye${u}`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor={sh(HR,-10)}/><stop offset="100%" stopColor={sh(HR,-50)}/>
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="100" cy="426" rx="52" ry="6" fill="rgba(0,0,0,0.18)"/>

      {/* ═══ BACK HAIR ═══ */}
      <path d="M 54,46 Q 42,80 38,128 Q 34,178 36,228 Q 38,270 44,308 Q 50,342 54,366"
        stroke={`url(#hrb${u})`} strokeWidth="34" fill="none" strokeLinecap="round" opacity="0.9"/>
      <path d="M 146,46 Q 158,80 162,128 Q 166,178 164,228 Q 162,270 156,308 Q 150,342 146,366"
        stroke={`url(#hrb${u})`} strokeWidth="34" fill="none" strokeLinecap="round" opacity="0.9"/>
      <path d="M 100,18 Q 100,70 98,120 Q 96,170 95,220 Q 94,268 95,310 Q 96,344 97,366"
        stroke={hrD} strokeWidth="20" fill="none" strokeLinecap="round" opacity="0.42"/>
      <path d="M 50,60 Q 40,100 38,160 Q 37,210 40,258"
        stroke={hrL} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.14"/>
      <path d="M 150,60 Q 160,100 162,160 Q 163,210 160,258"
        stroke={hrL} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.14"/>

      {/* ═══ TORSO SKIN BASE ═══ */}
      <path d="M 68,142 Q 62,158 60,178 Q 58,200 62,222 Q 66,240 72,255 L 128,255 Q 134,240 138,222 Q 142,200 140,178 Q 138,158 132,142 Q 116,138 100,137 Q 84,138 68,142 Z"
        fill={`url(#sk${u})`}/>
      {/* Neck */}
      <path d="M 88,118 Q 85,128 85,145 Q 92,148 100,148 Q 108,148 115,145 Q 115,128 112,118 Z"
        fill={SK}/>
      <path d="M 90,120 Q 88,132 88,145" stroke={skD} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.22"/>
      <path d="M 110,120 Q 112,132 112,145" stroke={skD} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.22"/>
      {/* Collarbone */}
      <path d="M 76,145 Q 88,138 100,140 Q 112,138 124,145" stroke={skD} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.32"/>

      {/* ═══ ARMS (skin) ═══ */}
      <path d="M 68,148 Q 54,170 42,208 Q 34,236 36,262"
        stroke={`url(#arm${u})`} strokeWidth="25" fill="none" strokeLinecap="round"/>
      <path d="M 36,262 Q 32,288 35,316"
        stroke={SK} strokeWidth="22" fill="none" strokeLinecap="round"/>
      <ellipse cx="35" cy="322" rx="14" ry="11" fill={SK}/>
      <path d="M 25,318 Q 35,328 45,318" stroke={skD} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.35"/>
      <path d="M 132,148 Q 146,170 158,208 Q 166,236 164,262"
        stroke={`url(#arm${u})`} strokeWidth="25" fill="none" strokeLinecap="round"/>
      <path d="M 164,262 Q 168,288 165,316"
        stroke={SK} strokeWidth="22" fill="none" strokeLinecap="round"/>
      <ellipse cx="165" cy="322" rx="14" ry="11" fill={SK}/>
      <path d="M 155,318 Q 165,328 175,318" stroke={skD} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.35"/>

      {/* ═══ BOTTOMS ═══ */}
      {isSkirt ? (
        <>
          {/* Waistband */}
          <path d="M 60,254 Q 100,246 140,254 L 142,270 Q 100,262 58,270 Z" fill={btD}/>
          <path d="M 62,256 Q 100,249 138,256" stroke={btL} strokeWidth="2" fill="none" opacity="0.3"/>
          {isMini ? (
            <>
              <path d="M 58,268 Q 50,292 48,326 L 152,326 Q 150,292 142,268 Z" fill={`url(#btS${u})`}/>
              <path d="M 48,322 Q 100,328 152,322" stroke={btD} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M 68,275 Q 65,296 66,320" stroke={btL} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.12"/>
              <path d="M 100,272 Q 100,296 100,320" stroke={btL} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.1"/>
              <path d="M 132,275 Q 135,296 134,320" stroke={btL} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.12"/>
            </>
          ) : (
            <>
              <path d="M 58,268 Q 48,302 44,348 Q 42,374 44,392 L 156,392 Q 158,374 156,348 Q 152,302 142,268 Z"
                fill={`url(#btS${u})`}/>
              <path d="M 70,275 Q 64,318 62,384" stroke={btL} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.1"/>
              <path d="M 100,272 Q 100,318 100,384" stroke={btL} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.08"/>
              <path d="M 130,275 Q 136,318 138,384" stroke={btL} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.1"/>
              <path d="M 44,389 Q 100,396 156,389" stroke={btD} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              {botItem.id?.includes("floral") && [[72,296],[112,310],[88,346],[130,330],[68,374]].map(([x,y],i)=>(
                <g key={i}>
                  <circle cx={x} cy={y} r={9} fill={sh(BT,35)} opacity="0.5"/>
                  <circle cx={x} cy={y} r={4.5} fill="#F9C06A" opacity="0.7"/>
                </g>
              ))}
            </>
          )}
        </>
      ) : (
        <>
          {/* Waistband + belt */}
          <rect x="59" y="253" width="82" height="19" rx="5.5" fill={btD}/>
          <rect x="61" y="255" width="78" height="7" rx="2.5" fill={sh(btD,10)} opacity="0.4"/>
          <rect x="87" y="255" width="26" height="14" rx="3.5" fill={sh(btD,-15)}/>
          <rect x="89" y="257" width="22" height="10" rx="2.5" fill={sh(btD,-8)}/>
          <circle cx="100" cy="262" r="5" fill="#D4A820"/>
          <circle cx="100" cy="262" r="2.8" fill="#FFD700"/>
          <circle cx="100" cy="262" r="1.2" fill="#FFF8CC" opacity="0.7"/>
          <rect x="65" y="253" width="6" height="14" rx="2" fill={sh(btD,-20)} opacity="0.5"/>
          <rect x="129" y="253" width="6" height="14" rx="2" fill={sh(btD,-20)} opacity="0.5"/>
          {/* Left leg */}
          <path d={isWide
            ? "M 56,270 Q 50,320 47,392 L 96,392 Q 93,320 98,270 Z"
            : "M 60,270 Q 54,322 52,392 L 94,392 Q 92,322 98,270 Z"}
            fill={`url(#btL${u})`}/>
          {/* Right leg */}
          <path d={isWide
            ? "M 102,270 Q 108,320 107,392 L 156,392 Q 153,320 144,270 Z"
            : "M 102,270 Q 108,322 107,392 L 148,392 Q 147,322 140,270 Z"}
            fill={`url(#btR${u})`}/>
          {/* Crotch */}
          <path d="M 98,270 Q 100,285 102,270" fill={sh(BT,-18)}/>
          {/* Seams */}
          <path d="M 61,278 Q 56,324 54,384" stroke={btD} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.3"/>
          <path d="M 92,278 Q 90,322 88,384" stroke={btD} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.3"/>
          <path d="M 108,278 Q 110,322 112,384" stroke={btD} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.3"/>
          <path d="M 138,278 Q 143,324 145,384" stroke={btD} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.3"/>
          {/* Denim highlights */}
          <path d="M 63,274 Q 61,320 62,382" stroke={btL} strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.07"/>
          <path d="M 137,274 Q 138,320 138,382" stroke={btL} strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.07"/>
          {/* Pockets */}
          <path d="M 65,294 Q 72,314 78,320" stroke={btL} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.25"/>
          <path d="M 133,294 Q 126,314 120,320" stroke={btL} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.25"/>
          {/* Knee creases */}
          <path d="M 55,338 Q 72,342 90,338" stroke={btD} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.28"/>
          <path d="M 109,338 Q 128,342 145,338" stroke={btD} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.28"/>
        </>
      )}

      {/* ═══ SHOES ═══ */}
      {isBoots ? (
        <>
          {/* LEFT BOOT */}
          <rect x="48" y="365" width="46" height="17" rx="4" fill={sh(SH,-18)}/>
          <path d="M 46,381 Q 44,394 50,398 Q 60,402 80,401 Q 95,401 97,393 Q 96,381 94,378 Z" fill={`url(#sh${u})`}/>
          <path d="M 46,396 Q 68,402 97,396 L 97,400 Q 68,406 46,400 Z" fill={shD}/>
          <path d="M 50,373 Q 70,370 93,373" stroke={shL} strokeWidth="1.5" fill="none" opacity="0.3"/>
          <path d="M 50,382 Q 60,378 72,382" stroke={shL} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.3"/>
          {/* RIGHT BOOT */}
          <rect x="106" y="365" width="46" height="17" rx="4" fill={sh(SH,-18)}/>
          <path d="M 103,378 Q 103,381 104,393 Q 106,401 122,401 Q 142,401 150,398 Q 156,394 154,381 Q 153,378 153,378 Z" fill={`url(#sh${u})`}/>
          <path d="M 103,396 Q 130,402 154,396 L 154,400 Q 130,406 103,400 Z" fill={shD}/>
          <path d="M 107,373 Q 128,370 151,373" stroke={shL} strokeWidth="1.5" fill="none" opacity="0.3"/>
          <path d="M 128,382 Q 138,378 148,382" stroke={shL} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.3"/>
        </>
      ) : isPlatform ? (
        <>
          {/* LEFT PLATFORM */}
          <path d="M 44,374 Q 42,387 47,393 Q 56,398 78,397 Q 95,397 97,389 Q 95,376 93,372 L 46,373 Z" fill={`url(#sh${u})`}/>
          <path d="M 44,390 Q 68,396 97,390 L 97,400 Q 68,406 44,400 Z" fill={shD}/>
          <path d="M 48,378 Q 68,372 92,378" stroke={shL} strokeWidth="2.5" fill="none" opacity="0.4"/>
          {[0,1,2].map(i=>(<line key={i} x1={55+i*10} y1={374} x2={55+i*10} y2={382} stroke={shD} strokeWidth="1.5" opacity="0.5"/>))}
          {/* RIGHT PLATFORM */}
          <path d="M 103,372 L 156,373 Q 158,376 156,389 Q 154,397 128,397 Q 105,396 103,389 Q 104,377 103,372 Z" fill={`url(#sh${u})`}/>
          <path d="M 103,390 Q 130,396 156,390 L 156,400 Q 130,406 103,400 Z" fill={shD}/>
          <path d="M 108,378 Q 130,372 153,378" stroke={shL} strokeWidth="2.5" fill="none" opacity="0.4"/>
          {[0,1,2].map(i=>(<line key={i} x1={115+i*10} y1={374} x2={115+i*10} y2={382} stroke={shD} strokeWidth="1.5" opacity="0.5"/>))}
        </>
      ) : isBallet ? (
        <>
          {/* LEFT BALLET */}
          <path d="M 46,376 Q 44,387 50,393 Q 60,396 78,395 Q 95,395 96,387 Q 94,376 92,372 Z" fill={`url(#sh${u})`}/>
          <path d="M 50,376 Q 68,370 91,376" stroke={shD} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M 56,374 Q 68,369 82,374" stroke={sh(SH,-30)} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7"/>
          <path d="M 46,390 Q 68,395 96,390" stroke={shD} strokeWidth="2" fill="none" strokeLinecap="round"/>
          {shoeItem.id?.includes("ballet") && (
            <>
              <path d="M 65,368 Q 62,362 65,360 Q 68,362 67,368" fill={SH} stroke={shD} strokeWidth="1"/>
              <path d="M 69,368 Q 72,362 69,360 Q 66,362 67,368" fill={SH} stroke={shD} strokeWidth="1"/>
              <circle cx="67" cy="368" r="2.5" fill={shD}/>
            </>
          )}
          {shoeItem.id?.includes("mule") && (
            <path d="M 92,388 Q 96,394 94,400" stroke={shD} strokeWidth="5" fill="none" strokeLinecap="round"/>
          )}
          {/* RIGHT BALLET */}
          <path d="M 104,372 Q 105,376 104,387 Q 106,395 125,395 Q 152,395 154,387 Q 156,378 154,372 Z" fill={`url(#sh${u})`}/>
          <path d="M 109,376 Q 130,370 153,376" stroke={shD} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M 118,374 Q 130,369 144,374" stroke={sh(SH,-30)} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7"/>
          <path d="M 104,390 Q 130,395 154,390" stroke={shD} strokeWidth="2" fill="none" strokeLinecap="round"/>
          {shoeItem.id?.includes("ballet") && (
            <>
              <path d="M 128,368 Q 125,362 128,360 Q 131,362 130,368" fill={SH} stroke={shD} strokeWidth="1"/>
              <path d="M 132,368 Q 135,362 132,360 Q 129,362 130,368" fill={SH} stroke={shD} strokeWidth="1"/>
              <circle cx="130" cy="368" r="2.5" fill={shD}/>
            </>
          )}
          {shoeItem.id?.includes("mule") && (
            <path d="M 104,388 Q 100,394 102,400" stroke={shD} strokeWidth="5" fill="none" strokeLinecap="round"/>
          )}
        </>
      ) : isHeels ? (
        <>
          {/* LEFT HEEL */}
          <path d="M 48,374 Q 46,386 51,392 Q 60,395 78,394 Q 94,394 95,386 Q 93,374 91,370 Z" fill={`url(#sh${u})`}/>
          <path d="M 91,388 Q 96,396 93,408" stroke={shD} strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M 91,388 Q 96,396 93,408" stroke={shL} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.3"/>
          <path d="M 50,380 Q 68,374 90,380" stroke={shD} strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M 52,387 Q 68,381 88,387" stroke={sh(SH,-20)} strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M 52,376 Q 62,370 76,375" stroke={shL} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.38"/>
          {/* RIGHT HEEL */}
          <path d="M 105,370 Q 107,374 105,386 Q 107,394 125,394 Q 152,394 154,386 Q 154,378 153,374 Z" fill={`url(#sh${u})`}/>
          <path d="M 105,388 Q 100,396 103,408" stroke={shD} strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M 105,388 Q 100,396 103,408" stroke={shL} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.3"/>
          <path d="M 110,380 Q 130,374 152,380" stroke={shD} strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M 112,387 Q 130,381 150,387" stroke={sh(SH,-20)} strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M 112,376 Q 124,370 140,375" stroke={shL} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.38"/>
        </>
      ) : (
        <>
          {/* LEFT SNEAKER */}
          <path d="M 43,388 Q 44,396 50,400 Q 62,403 80,402 Q 95,402 97,394 L 97,388 Z" fill={sh(SH,-35)}/>
          <path d="M 44,374 Q 42,386 46,392 Q 55,397 78,396 Q 95,396 97,387 Q 95,374 92,370 L 47,371 Z" fill={`url(#sh${u})`}/>
          <path d="M 47,376 Q 62,370 78,375" stroke={shL} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.4"/>
          <path d="M 48,380 Q 68,375 91,380" stroke={sh(SH,-22)} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5"/>
          <path d="M 44,390 Q 68,396 97,390" stroke={shD} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
          <rect x="60" y="370" width="28" height="8" rx="3" fill={sh(SH,-15)} opacity="0.5"/>
          {[0,1,2].map(i=>(<path key={i} d={`M ${62+i*8},371 Q ${66+i*8},375 ${62+i*8},379`} stroke={shL} strokeWidth="1.5" fill="none" opacity="0.5"/>))}
          <path d="M 91,371 Q 96,381 94,391" stroke={shD} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.4"/>
          {/* RIGHT SNEAKER */}
          <path d="M 103,388 L 154,388 Q 154,394 150,400 Q 140,403 122,402 Q 105,402 103,394 Z" fill={sh(SH,-35)}/>
          <path d="M 103,370 L 156,371 Q 158,374 156,387 Q 154,396 129,396 Q 105,396 103,387 Q 104,375 103,370 Z" fill={`url(#sh${u})`}/>
          <path d="M 122,375 Q 138,370 155,375" stroke={shL} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.4"/>
          <path d="M 109,380 Q 130,375 152,380" stroke={sh(SH,-22)} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5"/>
          <path d="M 103,390 Q 130,396 156,390" stroke={shD} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
          <rect x="112" y="370" width="28" height="8" rx="3" fill={sh(SH,-15)} opacity="0.5"/>
          {[0,1,2].map(i=>(<path key={i} d={`M ${114+i*8},371 Q ${118+i*8},375 ${114+i*8},379`} stroke={shL} strokeWidth="1.5" fill="none" opacity="0.5"/>))}
          <path d="M 105,371 Q 102,381 104,391" stroke={shD} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.4"/>
        </>
      )}

      {/* ═══ TOP / SHIRT ═══ */}
      {isCrop ? (
        noSleeve ? (
          <>
            <path d="M 80,148 Q 76,158 75,178 Q 74,196 77,212 L 123,212 Q 126,196 125,178 Q 124,158 120,148 Z"
              fill={`url(#tp${u})`}/>
            <path d="M 86,148 Q 85,138 86,132" stroke={TP} strokeWidth="7" fill="none" strokeLinecap="round"/>
            <path d="M 114,148 Q 115,138 114,132" stroke={TP} strokeWidth="7" fill="none" strokeLinecap="round"/>
            <path d="M 86,148 Q 100,155 114,148" stroke={tpD} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M 75,212 Q 100,218 125,212" stroke={tpD} strokeWidth="3" fill="none" strokeLinecap="round"/>
            {[162,172,182,196,207].map((y,i)=>(
              <path key={i} d={`M 77,${y} Q 100,${y+1.5} 123,${y}`} stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" fill="none"/>
            ))}
          </>
        ) : (
          <>
            <path d="M 65,148 Q 59,162 58,182 Q 57,200 61,214 L 139,214 Q 143,200 142,182 Q 141,162 135,148 Q 118,143 100,143 Q 82,143 65,148 Z"
              fill={`url(#tp${u})`}/>
            <path d="M 66,152 Q 50,170 38,206 Q 32,226 35,246"
              stroke={`url(#tps${u})`} strokeWidth="25" fill="none" strokeLinecap="round"/>
            <path d="M 68,158 Q 54,174 44,208" stroke={tpD} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.18"/>
            <path d="M 134,152 Q 150,170 162,206 Q 168,226 165,246"
              stroke={`url(#tps${u})`} strokeWidth="25" fill="none" strokeLinecap="round"/>
            <path d="M 132,158 Q 146,174 156,208" stroke={tpD} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.18"/>
            <path d="M 83,148 Q 100,156 117,148" stroke={tpD} strokeWidth="2.5" fill="none"/>
            <path d="M 61,214 Q 100,220 139,214" stroke={tpD} strokeWidth="3" fill="none" strokeLinecap="round"/>
            {[160,170,180,192,205].map((y,i)=>(
              <path key={i} d={`M 63,${y} Q 100,${y+2} 137,${y}`} stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" fill="none"/>
            ))}
            {topItem.id?.includes("corset") && (
              <>
                {[0,1,2,3,4].map(i=>(
                  <line key={i} x1={76+i*11} y1="151" x2={75+i*11} y2="212" stroke={tpD} strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
                ))}
                <path d="M 64,200 Q 100,194 136,200" stroke={tpD} strokeWidth="2" fill="none" opacity="0.45"/>
              </>
            )}
            <path d="M 30,244 Q 35,248 40,244" stroke={tpD} strokeWidth="5" fill="none" strokeLinecap="round"/>
            <path d="M 160,244 Q 165,248 170,244" stroke={tpD} strokeWidth="5" fill="none" strokeLinecap="round"/>
          </>
        )
      ) : (
        <>
          <path d="M 63,148 Q 56,165 55,190 Q 54,215 58,236 Q 62,252 68,258 L 132,258 Q 138,252 142,236 Q 146,215 145,190 Q 144,165 137,148 Q 118,143 100,142 Q 82,143 63,148 Z"
            fill={`url(#tp${u})`}/>
          {/* LEFT LONG SLEEVE */}
          <path d="M 65,152 Q 47,174 33,214 Q 25,242 28,270"
            stroke={`url(#tps${u})`} strokeWidth="26" fill="none" strokeLinecap="round"/>
          <path d="M 67,158 Q 50,178 37,216 Q 31,240 33,265"
            stroke={tpD} strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.15"/>
          <path d="M 62,156 Q 45,178 32,216"
            stroke={tpL} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.1"/>
          {/* RIGHT LONG SLEEVE */}
          <path d="M 135,152 Q 153,174 167,214 Q 175,242 172,270"
            stroke={`url(#tps${u})`} strokeWidth="26" fill="none" strokeLinecap="round"/>
          <path d="M 133,158 Q 150,178 163,216 Q 169,240 167,265"
            stroke={tpD} strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.15"/>
          <path d="M 138,156 Q 155,178 168,216"
            stroke={tpL} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.1"/>
          <path d="M 80,148 Q 100,157 120,148" stroke={tpD} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M 57,178 Q 55,214 57,248" stroke={tpL} strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.07"/>
          <path d="M 58,220 Q 100,214 142,220" stroke={tpD} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.3"/>
          <path d="M 24,268 Q 28,274 33,268" stroke={tpD} strokeWidth="6" fill="none" strokeLinecap="round"/>
          <path d="M 167,268 Q 172,274 176,268" stroke={tpD} strokeWidth="6" fill="none" strokeLinecap="round"/>
          {topItem.id?.includes("btn") && (
            <>
              <line x1="100" y1="152" x2="100" y2="256" stroke={tpD} strokeWidth="1.5" opacity="0.22"/>
              {[0,1,2,3,4].map(i=>(
                <ellipse key={i} cx="100" cy={164+i*20} rx="3.5" ry="2.8" fill={tpD} opacity="0.45"/>
              ))}
            </>
          )}
          {topItem.id?.includes("sequin") && Array.from({length:30},(_,i)=>{
            const x = 68+(i%6)*12, y = 158+Math.floor(i/6)*18;
            return (
              <g key={i}>
                <ellipse cx={x} cy={y} rx="5.5" ry="3.8" fill={sh(TP,55)} opacity="0.68"/>
                <circle cx={x+1} cy={y-1.5} r="2" fill="white" opacity="0.6"/>
              </g>
            );
          })}
          {topItem.id?.includes("stripe") && [158,170,182,194,206,218,232,246].map((y,i)=>(
            <path key={i} d={`M 57,${y} Q 100,${y+1} 143,${y}`}
              stroke={tpL} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.35"/>
          ))}
        </>
      )}

      {/* ═══ HEAD ═══ */}
      <path d="M 100,16 Q 142,16 154,44 Q 160,58 158,80 Q 156,104 148,116 Q 138,130 124,136 Q 112,142 100,142 Q 88,142 76,136 Q 62,130 52,116 Q 44,104 42,80 Q 40,58 46,44 Q 58,16 100,16 Z"
        fill={`url(#skf${u})`}/>
      <ellipse cx="52"  cy="84" rx="10" ry="16" fill={SK} opacity="0.38"/>
      <ellipse cx="148" cy="84" rx="10" ry="16" fill={SK} opacity="0.38"/>
      <ellipse cx="100" cy="134" rx="22" ry="12" fill={SK} opacity="0.5"/>
      {/* Ears */}
      <ellipse cx="44"  cy="82" rx="10.5" ry="13.5" fill={SK}/>
      <ellipse cx="44"  cy="82" rx="6.5"  ry="9"    fill={skD} opacity="0.5"/>
      <path d="M 38,76 Q 40,82 38,88" stroke={skD} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.35"/>
      <ellipse cx="156" cy="82" rx="10.5" ry="13.5" fill={SK}/>
      <ellipse cx="156" cy="82" rx="6.5"  ry="9"    fill={skD} opacity="0.5"/>
      <path d="M 162,76 Q 160,82 162,88" stroke={skD} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.35"/>

      {/* ═══ FACE ═══ */}
      {/* Eyebrows */}
      <path d="M 63,61 Q 72,52 85,56" stroke={hrD} strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M 63,61 Q 72,52 85,56" stroke={sh(hrD,-10)} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
      <path d="M 115,56 Q 128,52 137,61" stroke={hrD} strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M 115,56 Q 128,52 137,61" stroke={sh(hrD,-10)} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>

      {/* LEFT EYE */}
      <ellipse cx="78" cy="78" rx="14" ry="12.5" fill="white"/>
      <ellipse cx="78" cy="78" rx="14" ry="12.5" fill="rgba(210,225,255,0.15)"/>
      <ellipse cx="78" cy="79" rx="9" ry="10" fill={`url(#eye${u})`}/>
      <ellipse cx="78" cy="79" rx="9" ry="10" fill="none" stroke={sh(HR,-60)} strokeWidth="1.5" opacity="0.5"/>
      <circle cx="78" cy="79" r="5.5" fill="#080402"/>
      <circle cx="81.5" cy="74.5" r="3.5" fill="white" opacity="0.95"/>
      <circle cx="75" cy="83" r="1.8" fill="white" opacity="0.45"/>
      <path d="M 65,70 Q 72,61 78,64 Q 84,61 91,70" stroke="#0D0603" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M 65,70 Q 63,74 64,78" stroke="#0D0603" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      <path d="M 91,70 Q 93,74 92,78" stroke="#0D0603" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      <path d="M 68,66 Q 65,60 67,57" stroke="#0D0603" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M 74,63 Q 73,57 74,54" stroke="#0D0603" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M 80,62 Q 80,56 81,53" stroke="#0D0603" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M 86,64 Q 88,58 90,56" stroke="#0D0603" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M 65,83 Q 78,89 91,83" stroke={skD} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.4"/>
      <ellipse cx="78" cy="70" rx="13" ry="5" fill="rgba(100,60,80,0.14)"/>
      <path d="M 68,84 Q 78,87 88,84" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none"/>

      {/* RIGHT EYE */}
      <ellipse cx="122" cy="78" rx="14" ry="12.5" fill="white"/>
      <ellipse cx="122" cy="78" rx="14" ry="12.5" fill="rgba(210,225,255,0.15)"/>
      <ellipse cx="122" cy="79" rx="9" ry="10" fill={`url(#eye${u})`}/>
      <ellipse cx="122" cy="79" rx="9" ry="10" fill="none" stroke={sh(HR,-60)} strokeWidth="1.5" opacity="0.5"/>
      <circle cx="122" cy="79" r="5.5" fill="#080402"/>
      <circle cx="125.5" cy="74.5" r="3.5" fill="white" opacity="0.95"/>
      <circle cx="119" cy="83" r="1.8" fill="white" opacity="0.45"/>
      <path d="M 109,70 Q 116,61 122,64 Q 128,61 135,70" stroke="#0D0603" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M 109,70 Q 107,74 108,78" stroke="#0D0603" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      <path d="M 135,70 Q 137,74 136,78" stroke="#0D0603" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      <path d="M 112,66 Q 109,60 111,57" stroke="#0D0603" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M 118,63 Q 117,57 118,54" stroke="#0D0603" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M 124,62 Q 124,56 125,53" stroke="#0D0603" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M 130,64 Q 132,58 134,56" stroke="#0D0603" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M 109,83 Q 122,89 135,83" stroke={skD} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.4"/>
      <ellipse cx="122" cy="70" rx="13" ry="5" fill="rgba(100,60,80,0.14)"/>
      <path d="M 112,84 Q 122,87 132,84" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none"/>

      {/* NOSE */}
      <path d="M 97,90 Q 95,100 97,107 Q 100,112 103,107 Q 105,100 103,90"
        stroke={skD} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.4"/>
      <ellipse cx="100" cy="108" rx="7" ry="5" fill={sh(SK,-8)} opacity="0.45"/>
      <path d="M 91,108 Q 96,113 100,111 Q 104,113 109,108" stroke={skD} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55"/>
      <ellipse cx="94"  cy="108" rx="3.5" ry="2.5" fill={skD} opacity="0.3"/>
      <ellipse cx="106" cy="108" rx="3.5" ry="2.5" fill={skD} opacity="0.3"/>
      <circle cx="100" cy="105" r="2.5" fill="rgba(255,255,255,0.18)"/>

      {/* MOUTH */}
      <path d="M 85,118 Q 90,113 96,116 Q 100,118 104,116 Q 110,113 115,118"
        fill={sh(SK,-32)} stroke={sh(SK,-42)} strokeWidth="1.5"/>
      <path d="M 85,118 Q 100,130 115,118" fill={sh(SK,-16)} stroke={sh(SK,-35)} strokeWidth="1.5"/>
      <path d="M 86,118 Q 100,115 114,118" stroke={sh(SK,-50)} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M 91,124 Q 100,121 109,124" stroke="rgba(255,255,255,0.38)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="85.5" cy="118" r="2" fill={sh(SK,-25)} opacity="0.6"/>
      <circle cx="114.5" cy="118" r="2" fill={sh(SK,-25)} opacity="0.6"/>

      {/* BLUSH */}
      <ellipse cx="62"  cy="96" rx="18" ry="10" fill="rgba(255,120,100,0.14)"/>
      <ellipse cx="138" cy="96" rx="18" ry="10" fill="rgba(255,120,100,0.14)"/>

      {/* Face shading */}
      <ellipse cx="50"  cy="70" rx="12" ry="20" fill={skD} opacity="0.12"/>
      <ellipse cx="150" cy="70" rx="12" ry="20" fill={skD} opacity="0.12"/>
      <path d="M 80,138 Q 100,143 120,138" stroke={skD} strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.2"/>
      <ellipse cx="100" cy="38" rx="30" ry="14" fill="rgba(255,255,255,0.08)"/>

      {/* ═══ FRONT HAIR ═══ */}
      <path d="M 50,44 Q 56,18 100,15 Q 144,18 150,44 Q 136,26 100,24 Q 64,26 50,44 Z"
        fill={sh(HR,-14)} opacity="0.97"/>
      <path d="M 51,43 Q 36,68 33,112 Q 31,148 36,178"
        stroke={`url(#hr${u})`} strokeWidth="28" fill="none" strokeLinecap="round" opacity="0.93"/>
      <path d="M 53,48 Q 40,72 38,114 Q 37,146 40,172"
        stroke={hrL} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.2"/>
      <path d="M 149,43 Q 164,68 167,112 Q 169,148 164,178"
        stroke={`url(#hr${u})`} strokeWidth="28" fill="none" strokeLinecap="round" opacity="0.93"/>
      <path d="M 147,48 Q 160,72 162,114 Q 163,146 160,172"
        stroke={hrL} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.2"/>
      <path d="M 100,15 Q 100.5,30 101,52" stroke={hrD} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.3"/>
      <path d="M 66,18 Q 100,13 134,19" stroke={hrL} strokeWidth="4.5" fill="none" strokeLinecap="round" opacity="0.2"/>
      {/* Flyaways */}
      <path d="M 52,28 Q 46,22 44,16" stroke={HR} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.3"/>
      <path d="M 148,28 Q 154,22 156,16" stroke={HR} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.3"/>

      {/* ═══ ACCESSORIES ═══ */}
      {accItem.icon === "🎓" && (
        <g>
          <path d="M 52,36 Q 100,26 148,36 L 148,46 Q 100,36 52,46 Z" fill="#111"/>
          <rect x="50" y="26" width="100" height="10" rx="2" fill="#1A1A1A" transform="rotate(-2,100,31)"/>
          <line x1="144" y1="30" x2="156" y2="62" stroke="#D4A820" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="156" cy="65" r="7" fill="#D4A820"/>
          <circle cx="156" cy="65" r="4" fill="#FFD700"/>
          {[-5,-2,1,4].map((dx,i)=>(
            <line key={i} x1={153+dx} y1="71" x2={151+dx} y2="88" stroke="#B8860B" strokeWidth="2" strokeLinecap="round"/>
          ))}
        </g>
      )}
      {accItem.icon === "👑" && (
        <g>
          <path d="M 58,42 L 66,16 L 80,32 L 100,8 L 120,32 L 134,16 L 142,42 Z" fill="#D4A820"/>
          <path d="M 58,42 Q 100,38 142,42 L 140,52 Q 100,48 60,52 Z" fill="#B8860B"/>
          {[["#FF5555",68],["#55AAFF",100],["#FF55FF",132]].map(([c,x])=>(
            <g key={x}>
              <ellipse cx={x} cy={46} rx="6" ry="5" fill={c}/>
              <ellipse cx={x-1.5} cy={44} rx="2.5" ry="2" fill="white" opacity="0.5"/>
            </g>
          ))}
          <path d="M 62,44 Q 100,41 138,44" stroke="#FFD700" strokeWidth="2" fill="none" opacity="0.4"/>
        </g>
      )}
      {accItem.icon === "😎" && (
        <g>
          <rect x="58" y="70" width="36" height="24" rx="10" fill="rgba(8,8,12,0.88)" stroke="#333" strokeWidth="1.5"/>
          <rect x="60" y="72" width="32" height="20" rx="8.5" fill="rgba(20,20,30,0.7)"/>
          <rect x="106" y="70" width="36" height="24" rx="10" fill="rgba(8,8,12,0.88)" stroke="#333" strokeWidth="1.5"/>
          <rect x="108" y="72" width="32" height="20" rx="8.5" fill="rgba(20,20,30,0.7)"/>
          <path d="M 94,82 Q 100,79 106,82" stroke="#2A2A2A" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
          <line x1="44" y1="78" x2="58"  y2="78" stroke="#2A2A2A" strokeWidth="3" strokeLinecap="round"/>
          <line x1="142" y1="78" x2="156" y2="78" stroke="#2A2A2A" strokeWidth="3" strokeLinecap="round"/>
          <path d="M 62,73 Q 70,70 76,73" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M 110,73 Q 118,70 124,73" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        </g>
      )}
      {accItem.icon === "🌸" && (
        <g>
          {[0,60,120,180,240,300].map((a,i)=>{
            const rad=a*Math.PI/180, px=58+Math.cos(rad)*10, py=44+Math.sin(rad)*10;
            return(<ellipse key={i} cx={px} cy={py} rx="8" ry="5" fill={["#FFB7D5","#FF8FB5","#FF6B9D","#E05080","#FF9EC5","#FFC2D9"][i]} transform={`rotate(${a},${px},${py})`}/>);
          })}
          <circle cx="58" cy="44" r="6.5" fill="#F9C06A"/>
          <circle cx="58" cy="44" r="3"   fill="#FFE566" opacity="0.7"/>
        </g>
      )}
      {accItem.icon === "🎨" && (
        <g>
          <ellipse cx="100" cy="28" rx="56" ry="26" fill={accItem.color||"#8B4513"}/>
          <ellipse cx="100" cy="22" rx="50" ry="22" fill={sh(accItem.color||"#8B4513",14)}/>
          <ellipse cx="100" cy="32" rx="36" ry="8"  fill={sh(accItem.color||"#8B4513",-20)} opacity="0.45"/>
          <circle cx="100" cy="5" r="12" fill={accItem.color||"#8B4513"}/>
          <circle cx="100" cy="5" r="8"  fill={sh(accItem.color||"#8B4513",12)}/>
          <path d="M 60,16 Q 100,10 140,17" stroke={sh(accItem.color||"#8B4513",30)} strokeWidth="4" fill="none" opacity="0.25" strokeLinecap="round"/>
        </g>
      )}
      {accItem.icon === "😇" && (
        <g>
          <ellipse cx="100" cy="6" rx="50" ry="14" fill="none" stroke="#F8F0CC" strokeWidth="7" opacity="0.9"/>
          <ellipse cx="100" cy="6" rx="50" ry="14" fill="none" stroke="#FFE566" strokeWidth="3" opacity="0.5"/>
          <ellipse cx="100" cy="6" rx="50" ry="14" fill="none" stroke="white"   strokeWidth="1.5" opacity="0.3"/>
        </g>
      )}
      {accItem.icon === "🦪" && (
        <g>
          {Array.from({length:15},(_,i)=>{
            const angle=-40+(i*80/14), rad=angle*Math.PI/180;
            const px=100+Math.sin(rad)*42, py=148+Math.cos(rad)*10;
            return(
              <g key={i}>
                <circle cx={px} cy={py} r="4.8" fill="#F5F0E8" stroke="#DDD5C4" strokeWidth="0.8"/>
                <ellipse cx={px-1.2} cy={py-1.5} rx="2" ry="1.5" fill="white" opacity="0.6"/>
              </g>
            );
          })}
        </g>
      )}
      {accItem.icon === "⭐" && (
        <g>
          <polygon points="58,42 61,52 71,52 63,58 66,68 58,62 50,68 53,58 45,52 55,52" fill="#F9C06A"/>
          <polygon points="58,45 60.5,52 68,52 62,56.5 64,64 58,60 52,64 54,56.5 48,52 55.5,52" fill="#FFE566"/>
          <circle cx="58" cy="54" r="4" fill="white" opacity="0.4"/>
        </g>
      )}
      {accItem.icon === "🧢" && (
        <g>
          <path d="M 48,42 Q 52,18 100,15 Q 148,18 152,42 Z" fill={sh(accItem.color||"#1E2050",12)}/>
          <path d="M 50,44 Q 51,57 52,58 L 148,58 Q 149,57 150,44 Z" fill={accItem.color||"#1E2050"}/>
          <path d="M 100,58 Q 62,60 44,64 Q 34,68 38,76 Q 44,78 56,72 Q 78,63 100,63 Z" fill={sh(accItem.color||"#1E2050",-18)}/>
          <line x1="100" y1="17" x2="100" y2="58" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5"/>
          <rect x="93" y="55" width="14" height="5" rx="2.5" fill={sh(accItem.color||"#1E2050",-25)}/>
          <path d="M 58,20 Q 100,14 142,21" stroke={sh(accItem.color||"#1E2050",35)} strokeWidth="4" fill="none" opacity="0.2" strokeLinecap="round"/>
        </g>
      )}

    </svg>
  );
}

export default AvatarSVG;