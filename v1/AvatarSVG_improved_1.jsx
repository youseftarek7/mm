// ╔══════════════════════════════════════════════════════════════╗
// ║  AvatarSVG_improved.jsx                                      ║
// ║  أفاتار محسّن — سناب شات ستايل                               ║
// ║  ✅ أرجل أكبر وأكثر واقعية                                  ║
// ║  ✅ كروب توب يظهر البطن                                      ║
// ║  ✅ شعر طويل مفصّل                                          ║
// ║  ✅ وجه تفصيلي مع رموش وشفايف                               ║
// ║  ViewBox: 0 0 200 400                                        ║
// ╚══════════════════════════════════════════════════════════════╝

// USAGE: Replace AvatarSVG import in AvatarDance.jsx and AvatarStore.jsx
// Props: outfit (object), size (number, default 1)

import { STORE_CATALOG, DEFAULT_OUTFIT } from "./avatarConfig";

// ── Color shade helper ────────────────────────────────────────────────────────
function sh(hex = "#888", p = 0) {
  try {
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map(x => x + x).join("");
    const n = parseInt(c, 16);
    const cl = v => Math.min(255, Math.max(0, v));
    const r = cl((n >> 16) + Math.round(2.55 * p));
    const g = cl(((n >> 8) & 0xff) + Math.round(2.55 * p));
    const b = cl((n & 0xff) + Math.round(2.55 * p));
    return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
  } catch { return hex; }
}

// ── Gradient IDs (stable, based on colors) ───────────────────────────────────
let _uid = 0;
const mkId = () => `av${++_uid}`;

export function AvatarSVG({ outfit = DEFAULT_OUTFIT, size = 1, danceType = "idle", isAnimating = false }) {
  const get = (cat, id) => (STORE_CATALOG[cat] || []).find(i => i.id === id) || (STORE_CATALOG[cat] || [])[0];

  const skin = get("skin",        outfit.skin)        || { color: "#F0B882" };
  const hair = get("hair",        outfit.hair)        || { color: "#7A4E24" };
  const top  = get("tops",        outfit.tops)        || { color: "#8B1A1A" };
  const bot  = get("bottoms",     outfit.bottoms)     || { color: "#1E2D4A" };
  const acc  = get("accessories", outfit.accessories) || { id: "acc_none" };
  const shoe = get("shoes",       outfit.shoes)       || { color: "#F5F5F5" };

  const sc  = skin.color || "#F0B882";
  const hc  = hair.color || "#7A4E24";
  const tc  = top.color  || "#8B1A1A";
  const bc  = bot.color  || "#1E2D4A";
  const ec  = shoe.color || "#F5F5F5";

  // Item type flags
  const isCrop    = !!top.isCrop;
  const noSleeve  = isCrop && (top.id?.includes("halter") || top.id?.includes("satin") || !!top.noSleeves);
  const isSkirt   = !!bot.isSkirt || bot.id?.includes("skirt");
  const isMini    = isSkirt && (bot.id?.includes("mini"));
  const isWide    = !!bot.isWide || bot.id?.includes("wide") || bot.id?.includes("barrel");

  // Derived colors
  const sd = sh(sc, -18); // skin dark
  const hd = sh(hc, -30); const hl = sh(hc, 30);
  const td = sh(tc, -28); const tl = sh(tc, 20);
  const bd = sh(bc, -28); const bl = sh(bc, 16);
  const ed = sh(ec, -22); const el = sh(ec, 25);
  const eyeIris = sh(hc, -25);

  // Unique IDs for this render (prevents SVG defs conflicts)
  const u = mkId();

  // ── Dance animation style ──────────────────────────────────────────────────
  const danceStyle = isAnimating ? {
    animation: `${danceType}-root 0.8s ease-in-out infinite`,
    transformOrigin: "center bottom",
  } : {};

  const W = 200, H = 400;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W * size}
      height={H * size}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        {/* Head radial gradient — 3D face look */}
        <radialGradient id={`hd${u}`} cx="34%" cy="30%" r="65%">
          <stop offset="0%"   stopColor={sh(sc, 26)} />
          <stop offset="62%"  stopColor={sc} />
          <stop offset="100%" stopColor={sd} />
        </radialGradient>
        {/* Top linear gradient */}
        <linearGradient id={`tp${u}`} x1="0%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%"   stopColor={tl} />
          <stop offset="45%"  stopColor={tc} />
          <stop offset="100%" stopColor={td} />
        </linearGradient>
        {/* Left leg gradient */}
        <linearGradient id={`bl${u}`} x1="15%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={bl} />
          <stop offset="50%"  stopColor={bc} />
          <stop offset="100%" stopColor={bd} />
        </linearGradient>
        {/* Right leg gradient */}
        <linearGradient id={`br${u}`} x1="85%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={bc} />
          <stop offset="50%"  stopColor={sh(bc, -10)} />
          <stop offset="100%" stopColor={bd} />
        </linearGradient>
        {/* Shoe gradient */}
        <radialGradient id={`sg${u}`} cx="28%" cy="24%" r="76%">
          <stop offset="0%"   stopColor={el} />
          <stop offset="100%" stopColor={ed} />
        </radialGradient>
      </defs>

      {/* ══ Ground shadow ══ */}
      <ellipse cx="100" cy="397" rx="53" ry="7" fill="rgba(0,0,0,0.16)" />

      {/* ══ BACK HAIR (behind everything) ══ */}
      {/* Left strand */}
      <path d="M 51,43 Q 34,70 30,117 Q 26,164 28,213 Q 30,258 37,298 Q 44,332 48,354"
        stroke={hd} strokeWidth="31" fill="none" strokeLinecap="round" opacity="0.88" />
      {/* Right strand */}
      <path d="M 149,43 Q 166,70 170,117 Q 174,164 172,213 Q 170,258 163,298 Q 156,332 152,354"
        stroke={hd} strokeWidth="31" fill="none" strokeLinecap="round" opacity="0.88" />
      {/* Center back strand */}
      <path d="M 100,17 Q 100,60 100,100 Q 99,150 97,200 Q 95,252 94,300 Q 93,334 94,354"
        stroke={hd} strokeWidth="18" fill="none" strokeLinecap="round" opacity="0.48" />

      {/* ══ NECK + TORSO SKIN (always drawn; clothes overlay) ══ */}
      <path d="M 89,132 Q 87,144 87,163 L 113,163 Q 113,144 111,132 Z" fill={sc} />
      <path d="M 64,163 Q 56,183 56,219 Q 56,243 64,257 L 136,257 Q 144,243 144,219 Q 144,183 136,163 Z" fill={sc} />

      {/* ══ ARMS (skin; clothes sleeve overlays later) ══ */}
      <path d="M 66,169 Q 50,191 38,229 Q 30,255 33,276" stroke={sc} strokeWidth="24" fill="none" strokeLinecap="round" />
      <path d="M 33,276 Q 30,296 36,319"                stroke={sc} strokeWidth="22" fill="none" strokeLinecap="round" />
      <path d="M 134,169 Q 150,191 162,229 Q 170,255 167,276" stroke={sc} strokeWidth="24" fill="none" strokeLinecap="round" />
      <path d="M 167,276 Q 170,296 164,319"               stroke={sc} strokeWidth="22" fill="none" strokeLinecap="round" />
      {/* Hands */}
      <ellipse cx="36"  cy="324" rx="13" ry="11" fill={sc} />
      <ellipse cx="164" cy="324" rx="13" ry="11" fill={sc} />
      <path d="M 27,321 Q 36,329 45,321" stroke={sd} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.3" />
      <path d="M 155,321 Q 164,329 173,321" stroke={sd} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.3" />

      {/* ══ BOTTOMS ══ */}
      {isSkirt ? (
        /* ── SKIRT ── */
        <>
          <path d={isMini
            ? "M 60,256 Q 51,276 49,315 L 151,315 Q 149,276 140,256 Z"
            : "M 60,256 Q 50,282 46,331 Q 44,361 46,381 L 154,381 Q 156,361 154,331 Q 150,282 140,256 Z"
          } fill={`url(#bl${u})`} />
          {/* Waistband */}
          <path d="M 60,254 Q 100,245 140,254 L 141,268 Q 100,259 59,268 Z" fill={bd} />
          {/* Floral detail */}
          {bot.id?.includes("floral") && [[70,280],[110,294],[130,270],[85,320]].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={8}  fill={sh(bc, 30)} opacity="0.55" />
              <circle cx={x} cy={y} r={4}  fill="#F9C06A"    opacity="0.7" />
            </g>
          ))}
        </>
      ) : (
        /* ── PANTS (BIGGER LEGS) ── */
        <>
          {/* Waistband + buckle */}
          <rect x="59" y="253" width="82" height="18" rx="5"   fill={bd} />
          <rect x="86" y="255" width="28" height="13" rx="3"   fill={sh(bd, -12)} />
          <circle cx="100" cy="262" r="5"   fill="#D4A820" />
          <circle cx="100" cy="262" r="2.5" fill="#FFD700" />
          <circle cx="65"  cy="256" r="3"   fill="#C48010" />
          <circle cx="135" cy="256" r="3"   fill="#C48010" />

          {/* ══ LEFT LEG (wider = more realistic) ══
              Normal: x 60→93 (37px), Wide: x 57→94 (37px top, 47px bottom) */}
          <path d={isWide
            ? "M 57,270 Q 50,311 47,381 L 94,381 Q 91,311 96,270 Z"
            : "M 60,270 Q 54,311 52,381 L 93,381 Q 91,311 97,270 Z"
          } fill={`url(#bl${u})`} />

          {/* ══ RIGHT LEG (wider = more realistic) ══ */}
          <path d={isWide
            ? "M 106,270 Q 110,311 109,381 L 153,381 Q 150,311 143,270 Z"
            : "M 103,270 Q 110,311 108,381 L 149,381 Q 147,311 140,270 Z"
          } fill={`url(#br${u})`} />

          {/* Seam lines for realism */}
          <path d="M 60,278 Q 55,317 53,374" stroke={bd} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.38" />
          <path d="M 91,278 Q 89,317 87,374" stroke={bd} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.38" />
          <path d="M 109,278 Q 111,317 113,374" stroke={bd} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.38" />
          <path d="M 139,278 Q 145,317 147,374" stroke={bd} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.38" />
          {/* Crotch */}
          <path d="M 97,270 Q 100,283 103,270" fill={sh(bc, -15)} />
          {/* Pocket details */}
          <path d="M 64,291 Q 70,307 76,313" stroke={bl} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.28" />
          <path d="M 136,291 Q 130,307 124,313" stroke={bl} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.28" />
          {/* Denim highlight */}
          <path d="M 62,272 Q 60,309 61,373" stroke={bl} strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.08" />
        </>
      )}

      {/* ══ SHOES ══ */}
      {/* ── Left shoe ── */}
      {shoe.id?.includes("boot") ? (
        <>
          <path d="M 49,374 Q 47,384 51,390 Q 57,394 76,393 Q 93,393 94,386 Q 93,375 91,370 Z" fill={`url(#sg${u})`} />
          <rect x="50" y="361" width="42" height="13" rx="3.5" fill={sh(ec, -14)} />
        </>
      ) : shoe.id?.includes("ballet") || shoe.id?.includes("mule") || shoe.id?.includes("coquette") ? (
        <>
          <path d="M 48,374 Q 46,385 50,390 Q 57,393 75,392 Q 93,392 94,385 Q 92,373 91,369" fill={`url(#sg${u})`} />
          <path d="M 53,373 Q 71,367 91,373" stroke={ed} strokeWidth="3" fill="none" strokeLinecap="round" />
          {shoe.id?.includes("coquette") || shoe.id?.includes("strappy") ? (
            <line x1="51" y1="384" x2="52" y2="396" stroke={sh(ec, -30)} strokeWidth="4.5" strokeLinecap="round" />
          ) : null}
        </>
      ) : shoe.id?.includes("platform") ? (
        <>
          <path d="M 46,370 Q 44,382 48,389 Q 55,394 75,393 Q 93,393 94,386 Q 92,373 91,370 Z" fill={`url(#sg${u})`} />
          <path d="M 46,383 Q 68,388 94,383 L 94,390 Q 68,395 46,390 Z" fill={sh(ec, -32)} />
        </>
      ) : (
        /* Default sneakers */
        <>
          <path d="M 46,372 Q 44,383 48,389 Q 54,393 75,392 Q 93,392 94,385 Q 92,373 90,370 L 49,371 Z" fill={`url(#sg${u})`} />
          <path d="M 47,387 Q 67,392 94,387" stroke={ed} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M 53,376 Q 71,370 90,376" stroke={sh(ec, -18)} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.42" />
          <rect x="71" y="389" width="19" height="4" rx="2" fill={sh(ec, -14)} opacity="0.5" />
        </>
      )}
      {/* ── Right shoe (mirrored) ── */}
      {shoe.id?.includes("boot") ? (
        <>
          <path d="M 109,370 Q 108,375 107,386 Q 108,393 128,393 Q 151,393 153,386 Q 153,380 151,374 Q 150,371 149,371 Z" fill={`url(#sg${u})`} />
          <rect x="108" y="361" width="42" height="13" rx="3.5" fill={sh(ec, -14)} />
        </>
      ) : shoe.id?.includes("ballet") || shoe.id?.includes("mule") || shoe.id?.includes("coquette") ? (
        <>
          <path d="M 109,369 Q 107,373 107,385 Q 108,392 125,392 Q 152,392 154,385 Q 156,378 154,372" fill={`url(#sg${u})`} />
          <path d="M 109,373 Q 130,367 153,373" stroke={ed} strokeWidth="3" fill="none" strokeLinecap="round" />
          {shoe.id?.includes("coquette") || shoe.id?.includes("strappy") ? (
            <line x1="149" y1="384" x2="148" y2="396" stroke={sh(ec, -30)} strokeWidth="4.5" strokeLinecap="round" />
          ) : null}
        </>
      ) : shoe.id?.includes("platform") ? (
        <>
          <path d="M 109,370 Q 108,373 106,386 Q 108,394 125,393 Q 154,393 156,386 Q 156,375 154,370 Z" fill={`url(#sg${u})`} />
          <path d="M 106,383 Q 130,388 156,383 L 156,390 Q 130,395 106,390 Z" fill={sh(ec, -32)} />
        </>
      ) : (
        <>
          <path d="M 110,370 L 151,371 Q 156,373 154,385 Q 153,392 131,392 Q 109,392 108,385 Q 109,373 110,370 Z" fill={`url(#sg${u})`} />
          <path d="M 106,387 Q 130,392 155,387" stroke={ed} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M 110,376 Q 130,370 150,376" stroke={sh(ec, -18)} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.42" />
        </>
      )}

      {/* ══ TOP / SHIRT ══ */}
      {isCrop ? (
        noSleeve ? (
          /* ── HALTER / SPAGHETTI STRAP (arms fully visible) ── */
          <>
            <path d="M 78,165 Q 74,173 74,192 Q 74,207 78,213 L 122,213 Q 126,207 126,192 Q 126,173 122,165 Z" fill={`url(#tp${u})`} />
            {/* Straps */}
            <path d="M 85,165 L 86,151" stroke={tc} strokeWidth="6.5" strokeLinecap="round" />
            <path d="M 115,165 L 114,151" stroke={tc} strokeWidth="6.5" strokeLinecap="round" />
            <path d="M 85,165 Q 100,171 115,165" stroke={td} strokeWidth="2.2" fill="none" />
            {/* ── MIDRIFF SKIN SHOWS HERE (y 213 to y 253) ── */}
            <path d="M 74,213 Q 100,219 126,213" stroke={td} strokeWidth="2.8" fill="none" strokeLinecap="round" />
            {[175, 183, 191, 199, 207].map((y, i) => (
              <path key={i} d={`M 76,${y} Q 100,${y + 1} 124,${y}`} stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" fill="none" />
            ))}
          </>
        ) : (
          /* ── REGULAR CROP TOP (short sleeves) ── */
          <>
            <path d="M 66,165 Q 60,175 60,193 Q 60,209 66,215 L 134,215 Q 140,209 140,193 Q 140,175 134,165 Z" fill={`url(#tp${u})`} />
            {/* Short sleeves */}
            <path d="M 68,167 Q 50,180 39,211 Q 34,226 37,239" stroke={tc} strokeWidth="24" fill="none" strokeLinecap="round" />
            <path d="M 132,167 Q 150,180 161,211 Q 166,226 163,239" stroke={tc} strokeWidth="24" fill="none" strokeLinecap="round" />
            <path d="M 82,165 Q 100,173 118,165" stroke={td} strokeWidth="2.2" fill="none" />
            {/* ── CROP HEM (belly shows below this) ── */}
            <path d="M 60,215 Q 100,221 140,215" stroke={td} strokeWidth="2.8" fill="none" strokeLinecap="round" />
            {/* Ribbed texture */}
            {[177, 186, 195, 204, 210].map((y, i) => (
              <path key={i} d={`M 62,${y} Q 100,${y + 1} 138,${y}`} stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" fill="none" />
            ))}
            {/* Corset detail */}
            {top.id?.includes("corset") && (
              <>
                {[0, 1, 2, 3, 4].map(i => (
                  <line key={i} x1={76 + i * 10} y1="168" x2={75 + i * 10} y2="213" stroke={td} strokeWidth="1.2" strokeLinecap="round" opacity="0.38" />
                ))}
                <path d="M 64,199 C 68,191 132,191 136,199" stroke={td} strokeWidth="1.5" fill="none" opacity="0.45" />
              </>
            )}
          </>
        )
      ) : (
        /* ── FULL-LENGTH TOP ── */
        <>
          <path d="M 64,165 Q 56,185 56,221 Q 56,245 64,257 L 136,257 Q 144,245 144,221 Q 144,185 136,165 Z" fill={`url(#tp${u})`} />
          {/* Long sleeves */}
          <path d="M 66,167 Q 47,189 34,227 Q 26,253 29,276" stroke={tc} strokeWidth="25" fill="none" strokeLinecap="round" />
          <path d="M 134,167 Q 153,189 166,227 Q 174,253 171,276" stroke={tc} strokeWidth="25" fill="none" strokeLinecap="round" />
          <path d="M 82,165 Q 100,175 118,165" stroke={td} strokeWidth="2.2" fill="none" />
          {/* 3D fold highlight */}
          <path d="M 57,194 Q 55,225 57,253" stroke={tl} strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.08" />
          {/* Sequin decoration */}
          {top.id?.includes("sequin") && Array.from({ length: 24 }, (_, i) => {
            const x = 68 + (i % 6) * 12, y = 173 + Math.floor(i / 6) * 18;
            return (
              <g key={i}>
                <ellipse cx={x} cy={y} rx="5" ry="3.5" fill={sh(tc, 55)} opacity="0.72" />
                <circle cx={x + 1} cy={y - 1} r="1.8" fill="white" opacity="0.65" />
              </g>
            );
          })}
          {/* Button detail for shirts */}
          {top.id?.includes("btn") && (
            <>
              <line x1="100" y1="167" x2="100" y2="255" stroke={td} strokeWidth="1.5" opacity="0.22" />
              {[0, 1, 2, 3].map(i => (
                <ellipse key={i} cx="100" cy={179 + i * 18} rx="3" ry="2.5" fill={td} opacity="0.48" />
              ))}
            </>
          )}
        </>
      )}

      {/* ══ HEAD ══ */}
      <ellipse cx="100" cy="76" rx="54" ry="60" fill={`url(#hd${u})`} />
      {/* Jaw softening */}
      <ellipse cx="100" cy="126" rx="26" ry="18" fill={sc} opacity="0.6" />
      {/* Ears */}
      <ellipse cx="48" cy="80" rx="9.5" ry="12" fill={sc} />
      <ellipse cx="48" cy="80" rx="6"   ry="8.5" fill={sd} opacity="0.55" />
      <ellipse cx="152" cy="80" rx="9.5" ry="12" fill={sc} />
      <ellipse cx="152" cy="80" rx="6"   ry="8.5" fill={sd} opacity="0.55" />

      {/* ══ FACE ══ */}
      {/* Eyebrows */}
      <path d="M 68,58 Q 78,50 90,55"  stroke={sh(hc, -20)} strokeWidth="4.2" fill="none" strokeLinecap="round" />
      <path d="M 110,55 Q 122,50 132,58" stroke={sh(hc, -20)} strokeWidth="4.2" fill="none" strokeLinecap="round" />

      {/* ── Left eye ── */}
      <ellipse cx="81" cy="73" rx="12.5" ry="12" fill="white" />
      <ellipse cx="81" cy="73" rx="8"    ry="9"  fill={eyeIris} />
      <circle  cx="81" cy="73" r="5.2"            fill="#0D0603" />
      <circle  cx="84.5" cy="69" r="3"            fill="white" opacity="0.92" />
      {/* Upper lashes */}
      <path d="M 69,65 Q 75,57 81,61 Q 87,57 93,65" stroke="#0D0603" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M 69,65 Q 67,69 68,73"               stroke="#0D0603" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 93,65 Q 95,69 94,73"               stroke="#0D0603" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Lash tips */}
      <path d="M 73,61 Q 71,56 73,53" stroke="#0D0603" strokeWidth="2"   fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M 81,59 Q 80,54 81,51" stroke="#0D0603" strokeWidth="2"   fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M 88,61 Q 90,56 92,53" stroke="#0D0603" strokeWidth="2"   fill="none" strokeLinecap="round" opacity="0.55" />
      {/* Lower liner */}
      <path d="M 69,76 Q 81,81 93,76" stroke={sd} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.42" />

      {/* ── Right eye ── */}
      <ellipse cx="119" cy="73" rx="12.5" ry="12" fill="white" />
      <ellipse cx="119" cy="73" rx="8"    ry="9"  fill={eyeIris} />
      <circle  cx="119" cy="73" r="5.2"            fill="#0D0603" />
      <circle  cx="122.5" cy="69" r="3"            fill="white" opacity="0.92" />
      <path d="M 107,65 Q 113,57 119,61 Q 125,57 131,65" stroke="#0D0603" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M 107,65 Q 105,69 106,73"              stroke="#0D0603" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 131,65 Q 133,69 132,73"              stroke="#0D0603" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 111,61 Q 109,56 111,53" stroke="#0D0603" strokeWidth="2"   fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M 119,59 Q 118,54 119,51" stroke="#0D0603" strokeWidth="2"   fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M 126,61 Q 128,56 130,53" stroke="#0D0603" strokeWidth="2"   fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M 107,76 Q 119,81 131,76" stroke={sd} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.42" />

      {/* Nose */}
      <path d="M 97,88 Q 95,97 97,102 Q 100,106 103,102 Q 105,97 103,88" stroke={sd} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.46" />
      <path d="M 93,102 Q 100,108 107,102" stroke={sd} strokeWidth="2.8" fill="none" strokeLinecap="round" opacity="0.53" />

      {/* Freckles */}
      {[[87,95,2.2],[94,99,1.6],[106,99,1.6],[113,95,2.2]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={sd} opacity="0.26" />
      ))}

      {/* Mouth */}
      <path d="M 87,110 Q 93,102 100,106 Q 107,102 113,110" stroke={sh(sc, -42)} strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M 87,110 Q 100,121 113,110" fill={sh(sc, -20)} opacity="0.52" />
      <path d="M 87,110 Q 100,121 113,110" stroke={sh(sc, -42)} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M 92,114 Q 100,111 108,114" stroke="rgba(255,255,255,0.34)" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Blush */}
      <ellipse cx="67"  cy="94" rx="16" ry="10" fill="rgba(255,140,120,0.18)" />
      <ellipse cx="133" cy="94" rx="16" ry="10" fill="rgba(255,140,120,0.18)" />

      {/* ══ FRONT HAIR (on top of head) ══ */}
      {/* Crown */}
      <path d="M 50,42 Q 56,17 100,15 Q 144,17 150,42 Q 138,24 100,22 Q 62,24 50,42 Z" fill={sh(hc, -12)} opacity="0.97" />
      {/* Left front strand */}
      <path d="M 51,41 Q 36,66 33,108 Q 31,142 36,168" stroke={hc} strokeWidth="26" fill="none" strokeLinecap="round" opacity="0.92" />
      {/* Right front strand */}
      <path d="M 149,41 Q 164,66 167,108 Q 169,142 164,168" stroke={hc} strokeWidth="26" fill="none" strokeLinecap="round" opacity="0.92" />
      {/* Highlight */}
      <path d="M 63,19 Q 100,12 137,20" stroke={hl} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.17" />
      {/* Part line */}
      <path d="M 100,15 Q 101,28 101,48" stroke={hd} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.27" />

      {/* ══ ACCESSORIES ══ */}
      {acc.icon === "🎓" && (
        <g>
          <path d="M 53,27 L 147,27 L 147,38 L 53,38 Z" fill="#1A1A1A" transform="rotate(-3,100,32)" />
          <path d="M 55,25 Q 100,11 145,25 L 143,30 Q 100,17 57,30 Z" fill="#222" />
          <line x1="143" y1="28" x2="154" y2="57" stroke="#D4A820" strokeWidth="3" />
          <ellipse cx="154" cy="62" rx="7" ry="5.5" fill="#D4A820" />
          {[0,1,2].map(i => <line key={i} x1={151 + i*3} y1="65" x2={149 + i*3} y2="79" stroke="#D4A820" strokeWidth="2.5" />)}
        </g>
      )}
      {acc.icon === "👑" && (
        <g>
          <path d="M 62,37 L 68,14 L 80,29 L 100,10 L 120,29 L 132,14 L 138,37 Z" fill="#D4A820" />
          <path d="M 62,37 L 138,37 Q 136,45 64,45 Z" fill="#B8860B" />
          {[["#FF6B6B",79],["#F9C06A",100],["#6BD4FF",121]].map(([c, x]) => <circle key={x} cx={x} cy="37" r="5.5" fill={c} />)}
        </g>
      )}
      {acc.icon === "😎" && (
        <g>
          <rect x="61" y="66" width="33" height="22" rx="9" fill="rgba(8,8,8,0.86)" stroke="#2A2A2A" strokeWidth="1.5" />
          <rect x="106" y="66" width="33" height="22" rx="9" fill="rgba(8,8,8,0.86)" stroke="#2A2A2A" strokeWidth="1.5" />
          <line x1="94" y1="77" x2="106" y2="77" stroke="#1A1A1A" strokeWidth="3" />
          <line x1="43" y1="73" x2="61"  y2="73" stroke="#1A1A1A" strokeWidth="2.5" />
          <line x1="139" y1="73" x2="157" y2="73" stroke="#1A1A1A" strokeWidth="2.5" />
          <path d="M 65,69 Q 73,65 80,69" stroke="rgba(255,255,255,0.28)" strokeWidth="2" fill="none" />
          <path d="M 110,69 Q 118,65 125,69" stroke="rgba(255,255,255,0.28)" strokeWidth="2" fill="none" />
        </g>
      )}
      {acc.icon === "🌸" && (
        <g>
          {[0,60,120,180,240,300].map((a, i) => {
            const rad = a * Math.PI / 180, px = 63 + Math.cos(rad)*9, py = 44 + Math.sin(rad)*9;
            return <ellipse key={i} cx={px} cy={py} rx="7.5" ry="4.5" fill={["#FFB7D5","#FF8FB5","#FF6B9D","#E05080","#FF9EC5","#FFC2D9"][i]} transform={`rotate(${a},${px},${py})`} />;
          })}
          <circle cx="63" cy="44" r="6" fill="#F9C06A" />
        </g>
      )}
      {acc.icon === "🎨" && (
        <g>
          <ellipse cx="100" cy="24" rx="55" ry="24" fill="#8B4513" />
          <ellipse cx="100" cy="18" rx="50" ry="21" fill="#A0522D" />
          <ellipse cx="100" cy="29" rx="33" ry="7"  fill="#7A3A0E" opacity="0.48" />
          <circle cx="100" cy="6" r="11" fill="#8B4513" />
          <circle cx="100" cy="6" r="7"  fill="#9B6033" />
        </g>
      )}
      {acc.icon === "😇" && (
        <g>
          <ellipse cx="100" cy="5" rx="47" ry="13" fill="none" stroke="#F0EEE0" strokeWidth="6.5" opacity="0.9" />
          <ellipse cx="100" cy="5" rx="47" ry="13" fill="none" stroke="#E8E0FF" strokeWidth="3"   opacity="0.38" />
        </g>
      )}
      {acc.icon === "🦪" && Array.from({ length: 13 }, (_, i) => (
        <circle key={i} cx={70 + i*5} cy={154 + Math.sin(i*0.7)*2} r="4.2" fill="#F5F0E8" stroke="#E0D8CC" strokeWidth="0.7" />
      ))}
      {acc.icon === "⭐" && <text x="59" y="54" fontSize="28" transform="rotate(-18,59,47)">⭐</text>}
      {acc.icon === "🧢" && (
        <g>
          <path d="M 49,39 Q 54,17 100,15 Q 146,17 151,39 Z" fill="#1E1E3A" />
          <path d="M 51,41 Q 51,53 52,54 L 148,54 Q 149,53 149,41 Z" fill="#1E1E3A" />
          <path d="M 100,54 Q 65,56 47,59 Q 37,63 41,69 Q 46,71 57,67 Q 80,60 100,60 Z" fill="#15152A" />
          <line x1="100" y1="17" x2="100" y2="54" stroke="rgba(255,255,255,0.09)" strokeWidth="2.2" />
          <rect x="92" y="52" width="16" height="4.5" rx="2" fill="#2A2A4A" />
        </g>
      )}
    </svg>
  );
}

export default AvatarSVG;
