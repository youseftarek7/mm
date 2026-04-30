// ╔══════════════════════════════════════════════════════════════╗
// ║  AvatarStore_updated.jsx — متجر الموضة 2026 المحدث          ║
// ║  ✅ صنفين مجاني من كل قسم — الباقي مقفول                   ║
// ║  ✅ معاينة أي آيتم (حتى المقفول) على الأفاتار              ║
// ║  ✅ شراء بالنجوم + قفل بصري واضح                           ║
// ║  ✅ متوافق مع AvatarSVG_improved.jsx                        ║
// ╚══════════════════════════════════════════════════════════════╝

import { useState, useEffect, useCallback } from "react";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { AvatarSVG } from "./AvatarSVG";     // ← AvatarSVG.jsx هو النسخة المحسّنة
import { STORE_CATALOG, DEFAULT_OUTFIT, STORE_DOC, getDefaultOwned } from "./avatarConfig_updated";

// ════ COLORS ════
const C = {
  bg:"#0A0710", surface:"#110C16", card:"#1A1024", cardHov:"#221530",
  border:"rgba(255,182,213,0.09)", borderLt:"rgba(255,182,213,0.22)",
  accent:"#FF6B9D", accentSoft:"rgba(255,107,157,0.13)",
  gold:"#F9C06A",   goldD:"#E8A030",
  purple:"#C084B8", teal:"#7DD3B0", blue:"#60A5E8",
  text:"#FDF0F5",   muted:"#C49BB0", dim:"#6B4558",
  danger:"#FF7E7E", lock:"#F9C06A",
};
const FONT = "'Cairo','Tajawal',sans-serif";

// ════ SHADE HELPER ════
function sh(hex, p) {
  try {
    let c = (hex||"").replace("#","");
    if(c.length===3) c = c.split("").map(x=>x+x).join("");
    const n = parseInt(c,16);
    const r = Math.min(255,Math.max(0,(n>>16)+Math.round(2.55*p)));
    const g = Math.min(255,Math.max(0,((n>>8)&0xff)+Math.round(2.55*p)));
    const b = Math.min(255,Math.max(0,(n&0xff)+Math.round(2.55*p)));
    return "#"+((r<<16)|(g<<8)|b).toString(16).padStart(6,"0");
  } catch(e) { return hex||"#888"; }
}

// ════ CATEGORY TABS ════
const CATEGORIES = [
  { id:"skin",        label:"🎨", labelFull:"البشرة",   accent:"#D4A050" },
  { id:"hair",        label:"💇", labelFull:"الشعر",     accent:C.purple  },
  { id:"tops",        label:"👗", labelFull:"التوب",     accent:C.accent  },
  { id:"bottoms",     label:"👖", labelFull:"البنطلون",  accent:C.blue    },
  { id:"accessories", label:"💎", labelFull:"إكسسوار",  accent:C.gold    },
  { id:"shoes",       label:"👟", labelFull:"الجزمة",    accent:C.teal    },
];

// ════════════════════════════════════════════════════════════════
// GARMENT THUMBNAIL SVGs — mini realistic clothing sketches
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
      <path d="M14 22 Q16 12 30 10 Q44 12 46 22 Q40 16 30 15 Q20 16 14 22Z" fill={`url(#hg${color.slice(1)})`}/>
      <path d="M30 10 Q27 16 25 22 Q27 19 30 18 Q33 19 35 22 Q33 16 30 10Z" fill={d}/>
    </svg>
  );
}

function TopThumb({ item }) {
  const tc = item.color || "#F5EDD8";
  const d = sh(tc,-28), l = sh(tc,22);
  const isCrop = !!item.isCrop;
  const H = isCrop ? 38 : 50;
  return (
    <svg viewBox={`0 0 60 ${H+8}`} width="46" height="46" style={{display:"block"}}>
      <defs>
        <linearGradient id={`tg${tc.slice(1)}`} x1="0%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor={l}/><stop offset="45%" stopColor={tc}/><stop offset="100%" stopColor={d}/>
        </linearGradient>
      </defs>
      <path d={`M10 12 Q8 16 7 24 L7 ${H} Q7 ${H+4} 14 ${H+5} L46 ${H+5} Q53 ${H+4} 53 ${H} L53 24 Q52 16 50 12 Q42 6 30 5 Q18 6 10 12Z`} fill={`url(#tg${tc.slice(1)})`}/>
      <path d={`M10 12 Q3 18 2 28 Q1 35 2 40`} stroke={`url(#tg${tc.slice(1)})`} strokeWidth="10" fill="none" strokeLinecap="round"/>
      <path d={`M50 12 Q57 18 58 28 Q59 35 58 40`} stroke={`url(#tg${tc.slice(1)})`} strokeWidth="10" fill="none" strokeLinecap="round"/>
      <path d={`M24 5 Q30 10 36 5`} stroke={d} strokeWidth="1.5" fill="none"/>
      {isCrop && <line x1="9" y1={H+2} x2="51" y2={H+2} stroke={d} strokeWidth="2" strokeLinecap="round" opacity="0.45"/>}
      <path d="M8 20 Q7 35 8 48" stroke={d} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.15"/>
    </svg>
  );
}

function BottomThumb({ item }) {
  const bc = item.color || "#1E2D4A";
  const d = sh(bc,-26), l = sh(bc,18);
  const isSkirt = !!item.isSkirt;
  const isWide  = !!item.isWide;
  const spr = isWide ? 14 : 6;
  return (
    <svg viewBox="0 0 60 58" width="46" height="46" style={{display:"block"}}>
      <defs>
        <linearGradient id={`btg${bc.slice(1)}`} x1="0%" y1="0%" x2="20%" y2="100%">
          <stop offset="0%" stopColor={l}/><stop offset="45%" stopColor={bc}/><stop offset="100%" stopColor={d}/>
        </linearGradient>
      </defs>
      <rect x="6" y="2" width="48" height="10" rx="3" fill={bc}/>
      <rect x="6" y="2" width="48" height="6"  rx="3" fill={d} opacity="0.35"/>
      <rect x="22" y="3" width="16" height="7" rx="2" fill={sh(bc,-16)}/>
      <circle cx="30" cy="7" r="3" fill="#D4A820"/><circle cx="30" cy="7" r="1.5" fill="#FFD700"/>
      {isSkirt ? (
        <path d="M6 12 Q4 28 2 52 L58 52 Q56 28 54 12Z" fill={`url(#btg${bc.slice(1)})`}/>
      ) : (
        <>
          <path d="M22 12 Q22 18 24 22 L30 20 L36 22 Q38 18 38 12Z" fill={sh(bc,-10)}/>
          <path d={`M24 20 Q20 35 19 50`} stroke={`url(#btg${bc.slice(1)})`} strokeWidth={17+spr} fill="none" strokeLinecap="round"/>
          <path d={`M36 20 Q40 35 41 50`} stroke={`url(#btg${bc.slice(1)})`} strokeWidth={17+spr} fill="none" strokeLinecap="round"/>
        </>
      )}
    </svg>
  );
}

function SkinThumb({ item }) {
  const c = item.color || "#F0B882";
  return (
    <svg viewBox="0 0 60 60" width="46" height="46" style={{display:"block"}}>
      <defs>
        <radialGradient id={`skg${c.slice(1)}`} cx="35%" cy="32%" r="65%">
          <stop offset="0%" stopColor={sh(c,25)}/><stop offset="100%" stopColor={sh(c,-20)}/>
        </radialGradient>
      </defs>
      <circle cx="30" cy="26" r="20" fill={`url(#skg${c.slice(1)})`}/>
      <ellipse cx="30" cy="48" rx="14" ry="7" fill={c} opacity="0.6"/>
    </svg>
  );
}

function AccThumb({ item }) {
  return (
    <div style={{
      width:46, height:46,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:28, lineHeight:1,
    }}>
      {item.icon || "✨"}
    </div>
  );
}

function ShoeThumb({ item }) {
  const ec = item.color || "#F5F5F5";
  const d = sh(ec,-25), l = sh(ec,22);
  return (
    <svg viewBox="0 0 60 36" width="52" height="34" style={{display:"block"}}>
      <defs>
        <radialGradient id={`shg${ec.slice(1)}`} cx="28%" cy="25%" r="75%">
          <stop offset="0%" stopColor={l}/><stop offset="100%" stopColor={d}/>
        </radialGradient>
      </defs>
      <path d="M4 18 Q2 26 6 31 Q12 35 30 34 Q50 34 54 26 Q56 19 52 14 L8 16Z" fill={`url(#shg${ec.slice(1)})`}/>
      <path d="M4 29 Q24 34 54 28" stroke={d} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M10 20 Q30 14 48 20" stroke={sh(ec,-15)} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.45"/>
    </svg>
  );
}

function ItemThumb({ item, cat }) {
  if (cat === "skin")        return <SkinThumb item={item}/>;
  if (cat === "hair")        return <HairThumb color={item.color || "#7A4E24"}/>;
  if (cat === "tops")        return <TopThumb item={item}/>;
  if (cat === "bottoms")     return <BottomThumb item={item}/>;
  if (cat === "accessories") return <AccThumb item={item}/>;
  if (cat === "shoes")       return <ShoeThumb item={item}/>;
  return null;
}

// ════════════════════════════════════════════════════════════════
// ITEM CARD COMPONENT
// ════════════════════════════════════════════════════════════════
function ItemCard({ cat, item, isOwned, isEquipped, isPreviewing, canAfford, onSelect, onBuy, onEquip }) {
  const rStyle = item.rarityColor || "#C49BB0";

  const cardBg = isEquipped
    ? `linear-gradient(135deg, ${C.accentSoft} 0%, rgba(255,107,157,0.04) 100%)`
    : isPreviewing
      ? `rgba(192,132,184,0.08)`
      : C.card;

  const borderColor = isEquipped
    ? "rgba(255,107,157,0.55)"
    : isPreviewing
      ? "rgba(192,132,184,0.45)"
      : C.border;

  return (
    <div onClick={onSelect} style={{
      background: cardBg,
      border: `1.5px solid ${borderColor}`,
      borderRadius: 14,
      padding: "10px 8px",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 5,
      transition: "all .18s",
      position: "relative",
      minHeight: 140,
    }}>
      {/* Equipped badge */}
      {isEquipped && (
        <div style={{
          position:"absolute", top:5, right:7,
          fontSize:9, color:C.accent, fontWeight:800, fontFamily:FONT,
        }}>✓ لابسه</div>
      )}

      {/* Lock overlay for unpurchased items */}
      {!isOwned && !isPreviewing && (
        <div style={{
          position:"absolute", top:5, left:7,
          fontSize:11, color:C.lock,
        }}>🔒</div>
      )}

      {/* Thumbnail */}
      <div style={{ marginTop: isEquipped ? 12 : 0 }}>
        <ItemThumb item={item} cat={cat}/>
      </div>

      {/* Name */}
      <div style={{
        fontSize:11, fontWeight:700, fontFamily:FONT,
        color: C.muted, textAlign:"center", lineHeight:1.3,
        maxWidth:"100%", overflow:"hidden",
        textOverflow:"ellipsis", whiteSpace:"nowrap",
      }}>
        {item.name}
      </div>

      {/* Rarity */}
      <div style={{
        fontSize:9.5, fontWeight:700, fontFamily:FONT,
        color: rStyle,
        background: `${rStyle}22`,
        padding:"2px 7px", borderRadius:8,
      }}>
        {item.rarity}
      </div>

      {/* Action button / status */}
      {isOwned ? (
        isEquipped ? (
          <div style={{fontSize:10,color:C.accent,fontFamily:FONT,fontWeight:700}}>✓ محدد</div>
        ) : (
          <button
            onClick={e => { e.stopPropagation(); onEquip(); }}
            style={{
              width:"100%", padding:"5px 0",
              borderRadius:9, fontSize:11, fontWeight:700,
              fontFamily:FONT, cursor:"pointer", border:"none",
              background:C.teal, color:"#0A2A1A",
              marginTop:2,
            }}
          >ارتداء</button>
        )
      ) : (
        <button
          disabled={!canAfford}
          onClick={e => { e.stopPropagation(); if(canAfford) onBuy(); }}
          style={{
            width:"100%", padding:"5px 0",
            borderRadius:9, fontSize:11, fontWeight:700,
            fontFamily:FONT, cursor: canAfford ? "pointer" : "not-allowed",
            border: "none",
            background: canAfford ? C.accent : "rgba(255,255,255,0.04)",
            color: canAfford ? "#fff" : C.dim,
            marginTop:2, transition:"opacity .15s",
            opacity: canAfford ? 1 : 0.7,
          }}
        >
          {canAfford ? `🔓 ${item.price}⭐` : `🔒 ${item.price}⭐`}
        </button>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// MAIN STORE COMPONENT
// ════════════════════════════════════════════════════════════════
export function AvatarStore({ userId, availStars = 0, onSpendStars }) {
  const [category,    setCategory]    = useState("tops");
  const [equipped,    setEquipped]    = useState(DEFAULT_OUTFIT);
  const [owned,       setOwned]       = useState(() => Array.from(getDefaultOwned()));
  const [preview,     setPreview]     = useState(null); // item being previewed (not yet equipped)
  const [styleFilter, setStyleFilter] = useState("all");
  const [loading,     setLoading]     = useState(true);
  const [fullscreen,  setFullscreen]  = useState(false);

  // ── Load from Firestore ──
  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    (async () => {
      try {
        const snap = await getDoc(doc(db, "avatars", userId));
        if (snap.exists()) {
          const data = snap.data();
          if (data.equipped) setEquipped({ ...DEFAULT_OUTFIT, ...data.equipped });
          if (data.owned)    setOwned([...new Set([...Array.from(getDefaultOwned()), ...data.owned])]);
        }
      } catch(e) { console.error(e); }
      setLoading(false);
    })();
  }, [userId]);

  // ── Save to Firestore ──
  const save = useCallback(async (newEquipped, newOwned) => {
    if (!userId) return;
    try {
      await setDoc(doc(db, "avatars", userId), {
        equipped: newEquipped,
        owned: newOwned,
      }, { merge: true });
    } catch(e) { console.error(e); }
  }, [userId]);

  // ── Helpers ──
  const findItem = id => {
    for (const cat of Object.values(STORE_CATALOG)) {
      const found = cat.find(i => i.id === id);
      if (found) return found;
    }
    return null;
  };

  const items = (STORE_CATALOG[category] || []).filter(item => {
    if (styleFilter === "all") return true;
    return item.style === styleFilter;
  });

  const styles = ["all", ...new Set((STORE_CATALOG[category] || []).map(i => i.style).filter(Boolean))];

  const styleLabel = s => {
    if (s === "all") return "🛍️ الكل";
    const labels = { crop:"✂️ كروب","old money":"💰 Old Money", glamoratti:"✨ Glam",
      classic:"🎩 كلاسيك", bold:"🔥 بولد", coquette:"🎀 Coquette", glam:"💫 Glam",
      chic:"🌟 شيك", summer:"☀️ سمر", romantic:"🌸 رومانسي" };
    return labels[s] || s;
  };

  // Preview outfit (shows locked items on avatar without equipping)
  const previewOutfit = preview
    ? { ...equipped, [category]: preview }
    : equipped;

  // ── Actions ──
  const handleEquip = (cat, itemId) => {
    const newEquipped = { ...equipped, [cat]: itemId };
    setEquipped(newEquipped);
    setPreview(null);
    save(newEquipped, owned);
  };

  const handleBuy = async (cat, item) => {
    if (availStars < item.price) return;
    const newOwned = [...new Set([...owned, item.id])];
    const newEquipped = { ...equipped, [cat]: item.id };
    setOwned(newOwned);
    setEquipped(newEquipped);
    setPreview(null);
    onSpendStars?.(item.price);
    await save(newEquipped, newOwned);
  };

  if (loading) {
    return (
      <div style={{ fontFamily:FONT, color:C.muted, padding:"24px", textAlign:"center" }}>
        جار التحميل...
      </div>
    );
  }

  return (
    <div style={{
      background: C.bg,
      borderRadius: 24,
      padding: "16px 14px",
      direction: "rtl",
      fontFamily: FONT,
      maxWidth: 500,
      margin: "0 auto",
    }}>

      {/* ── STARS HEADER ── */}
      <div style={{
        display:"flex", justifyContent:"space-between", alignItems:"center",
        marginBottom:12,
        padding:"10px 14px",
        background: "rgba(255,107,157,0.06)",
        border: `1px solid rgba(255,107,157,0.18)`,
        borderRadius: 14,
      }}>
        <div style={{ fontSize:15, fontWeight:800, color:C.gold }}>
          ⭐ {availStars.toLocaleString()}
        </div>
        <div style={{ fontSize:11, color:C.muted }}>متجر الموضة 2026 ✨</div>
      </div>

      {/* ── AVATAR PREVIEW ── */}
      <div style={{
        display:"flex", justifyContent:"center", marginBottom:12,
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 18,
        padding: "10px 0 4px",
        position: "relative",
        cursor: "pointer",
      }} onClick={() => setFullscreen(true)}>
        <AvatarSVG outfit={previewOutfit} size={1.1}/>
        <div style={{
          position:"absolute", bottom:6, right:8,
          fontSize:10, color:C.dim, fontFamily:FONT,
        }}>اضغطي للتكبير 🔍</div>
        {preview && (
          <div style={{
            position:"absolute", top:8, left:8,
            fontSize:10, color:C.purple, fontFamily:FONT,
            background:"rgba(192,132,184,0.15)",
            padding:"3px 8px", borderRadius:8,
          }}>جاري المعاينة ✦</div>
        )}
      </div>

      {/* ── CATEGORY TABS ── */}
      <div style={{ display:"flex", gap:5, marginBottom:10, overflowX:"auto", paddingBottom:4 }}>
        {CATEGORIES.map(cat => {
          const active = category === cat.id;
          return (
            <button key={cat.id}
              onClick={() => { setCategory(cat.id); setPreview(null); setStyleFilter("all"); }}
              style={{
                flexShrink:0, padding:"7px 13px", borderRadius:22,
                fontSize:12, fontFamily:FONT, fontWeight:700, cursor:"pointer",
                transition:"all .18s",
                background: active ? `${cat.accent}20` : C.surface,
                border:`1.5px solid ${active ? `${cat.accent}60` : C.border}`,
                color: active ? cat.accent : C.muted,
                boxShadow: active ? `0 0 12px ${cat.accent}22` : "none",
                display:"flex", alignItems:"center", gap:5,
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
        <div style={{ display:"flex", gap:5, marginBottom:12, overflowX:"auto", paddingBottom:4 }}>
          {styles.map(style => {
            const active = styleFilter === style;
            return (
              <button key={style} onClick={() => setStyleFilter(style)} style={{
                flexShrink:0, padding:"5px 11px", borderRadius:20,
                fontSize:10.5, fontFamily:FONT, fontWeight:700, cursor:"pointer",
                transition:"all .15s",
                background: active ? "rgba(255,107,157,.16)" : "rgba(255,255,255,.03)",
                border:`1px solid ${active ? "rgba(255,107,157,.5)" : C.border}`,
                color: active ? C.accent : C.dim,
              }}>{styleLabel(style)}</button>
            );
          })}
        </div>
      )}

      {/* ── FREE ITEMS NOTICE ── */}
      <div style={{
        fontSize:10.5, color:C.teal, fontFamily:FONT,
        marginBottom:10, textAlign:"center",
        background:"rgba(125,211,176,0.06)",
        border:"1px solid rgba(125,211,176,0.18)",
        borderRadius:10, padding:"5px 10px",
      }}>
        🎁 كل قسم فيه صنفين مجاني — الباقي يشترى بالنجوم
      </div>

      {/* ── ITEMS GRID ── */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",
        gap:10,
      }}>
        {items.length === 0 ? (
          <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"30px", color:C.dim, fontSize:13, fontFamily:FONT }}>
            😊 مفيش آيتمز بهذا الفلتر
          </div>
        ) : items.map(item => {
          const isOwned    = owned.includes(item.id);
          const isEquipped = equipped[category] === item.id;
          const isPrev     = preview === item.id;
          const canAfford  = availStars >= item.price;
          return (
            <ItemCard
              key={item.id}
              cat={category}
              item={item}
              isOwned={isOwned}
              isEquipped={isEquipped}
              isPreviewing={isPrev}
              canAfford={canAfford}
              onSelect={() => {
                if (preview === item.id) {
                  setPreview(null);
                } else if (isOwned) {
                  handleEquip(category, item.id);
                } else {
                  setPreview(item.id); // preview locked item on avatar
                }
              }}
              onBuy={() => handleBuy(category, item)}
              onEquip={() => handleEquip(category, item.id)}
            />
          );
        })}
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        marginTop:16, padding:"12px 14px", borderRadius:18,
        background:"linear-gradient(135deg,rgba(255,107,157,.04),rgba(192,132,184,.04))",
        border:`1px solid rgba(255,107,157,.12)`, textAlign:"center",
      }}>
        <div style={{ fontSize:11.5, color:C.muted, fontFamily:FONT, lineHeight:2 }}>
          🌸 كل مهمة تخليكِ أقرب للأوت فيت اللي بتحلمي بيه!<br/>
          <span style={{ color:C.accent, fontWeight:800 }}>أنجزي → اكسبي نجوم → اشتري أحدث ستيلات 2026 ✨</span>
        </div>
      </div>

      {/* ── FULLSCREEN MODAL ── */}
      {fullscreen && (
        <div onClick={() => setFullscreen(false)} style={{
          position:"fixed", inset:0, zIndex:9900,
          background:"rgba(0,0,0,.92)", backdropFilter:"blur(18px)",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background:C.card, borderRadius:26,
            border:`1.5px solid ${C.borderLt}`,
            padding:"24px 28px",
            display:"flex", flexDirection:"column", alignItems:"center",
            boxShadow:"0 20px 60px rgba(0,0,0,.7)", maxWidth:300,
          }}>
            <div style={{ fontSize:13, fontWeight:900, color:C.text, fontFamily:FONT, marginBottom:16 }}>
              👗 لبسك الكامل
            </div>
            <div style={{ transform:"scale(1.35)", transformOrigin:"center bottom", marginBottom:36, marginTop:8 }}>
              <AvatarSVG outfit={previewOutfit} size={1}/>
            </div>
            {/* Outfit labels */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:5, justifyContent:"center", marginBottom:16, maxWidth:240 }}>
              {Object.entries(previewOutfit).map(([cat, itemId]) => {
                const it = findItem(itemId);
                if (!it) return null;
                return (
                  <div key={cat} style={{
                    fontSize:9.5, color:C.muted, fontFamily:FONT,
                    background:C.surface, padding:"3px 11px", borderRadius:20,
                    border:`1px solid ${C.border}`,
                  }}>{it.name}</div>
                );
              })}
            </div>
            <button onClick={() => setFullscreen(false)} style={{
              padding:"9px 26px", borderRadius:20,
              background:C.accent, color:"#fff", border:"none",
              fontFamily:FONT, fontWeight:800, fontSize:13, cursor:"pointer",
            }}>إغلاق ✕</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AvatarStore;
