// AvatarDance.jsx — شاشة إنجاز مع أفاتار يرقص
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AvatarSVG } from "./AvatarSVG";
import { DEFAULT_OUTFIT } from "./avatarConfig_updated";

// ════════════════════════════════════════
// COLORS
// ════════════════════════════════════════
const C = {
  accent: "#FF6B9D", purple: "#C084B8", gold: "#F9C06A",
  success: "#7DD3B0", text: "#FDF0F5", muted: "#C49BB0", dim: "#6B4558",
};

// ════════════════════════════════════════
// DANCE CSS KEYFRAMES
// ════════════════════════════════════════
const DANCE_CSS = `
  @keyframes d-samba {
    0%,100% { transform: translateY(0) rotate(0deg); }
    25%      { transform: translateY(-18px) rotate(-5deg); }
    50%      { transform: translateY(-10px) rotate(4deg); }
    75%      { transform: translateY(-20px) rotate(-3deg); }
  }
  @keyframes d-disco {
    0%,100% { transform: translateX(0) rotate(0deg); }
    25%      { transform: translateX(-14px) rotate(-8deg); }
    75%      { transform: translateX(14px) rotate(8deg); }
  }
  @keyframes d-hiphop {
    0%,100% { transform: scaleY(1) translateY(0); }
    20%      { transform: scaleY(1.06) translateY(-28px); }
    40%      { transform: scaleY(0.94) translateY(0); }
    60%      { transform: scaleY(1.04) translateY(-22px); }
    80%      { transform: scaleY(0.96) translateY(0); }
  }
  @keyframes d-salsa {
    0%,100% { transform: translateX(0) translateY(0) rotate(0deg); }
    25%      { transform: translateX(-6px) translateY(-12px) rotate(-6deg); }
    50%      { transform: translateX(6px) translateY(-6px) rotate(6deg); }
    75%      { transform: translateX(-4px) translateY(-16px) rotate(-4deg); }
  }
  @keyframes d-robot {
    0%,25%,50%,75%,100% { transform: translateY(0) rotate(0deg); }
    12%                   { transform: translateY(-10px) rotate(0deg); }
    37%                   { transform: translateY(0) rotate(8deg); }
    62%                   { transform: translateY(-8px) rotate(-8deg); }
  }
  @keyframes d-flutter {
    0%,100% { transform: translateY(0) scale(1); }
    20%      { transform: translateY(-36px) scale(1.06); }
    40%      { transform: translateY(-16px) scale(1.03); }
    60%      { transform: translateY(-40px) scale(1.08); }
    80%      { transform: translateY(-20px) scale(1.04); }
  }
  @keyframes modal-pop {
    0%   { transform: scale(0.5) rotate(-8deg); opacity: 0; }
    60%  { transform: scale(1.06) rotate(2deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes pts-bounce {
    0%   { transform: scale(0.3) translateY(16px); opacity: 0; }
    60%  { transform: scale(1.3) translateY(-8px); opacity: 1; }
    100% { transform: scale(1) translateY(0); opacity: 1; }
  }
  @keyframes confetti-fall {
    0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(140px) rotate(720deg); opacity: 0; }
  }
  @keyframes glow-ring {
    0%   { transform: translate(-50%,-50%) scale(0.2); opacity: 0.8; }
    100% { transform: translate(-50%,-50%) scale(3.5); opacity: 0; }
  }
  @keyframes progress-drain {
    from { width: 100%; }
    to   { width: 0%; }
  }
  @keyframes label-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes avatarFloat {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-10px); }
  }
`;

// ════════════════════════════════════════
// DANCE TYPES
// ════════════════════════════════════════
const DANCE_TYPES = ["samba", "disco", "hiphop", "salsa", "robot", "flutter"];

const DANCE_INFO = {
  samba:   { label: "💃 سامبا",    color: "#FF6B9D", desc: "إيقاع برازيلي مرح",     dur: "0.72s", ease: "ease-in-out" },
  disco:   { label: "🪩 ديسكو",   color: "#C084B8", desc: "ستايل السبعينات",        dur: "0.46s", ease: "cubic-bezier(.22,1,.36,1)" },
  hiphop:  { label: "🔥 هيب هوب", color: "#F9C06A", desc: "إيقاع الشارع",          dur: "0.60s", ease: "cubic-bezier(.34,1.5,.64,1)" },
  salsa:   { label: "🌹 سالسا",   color: "#FF8C42", desc: "رقصة لاتينية ناعمة",    dur: "0.80s", ease: "ease-in-out" },
  robot:   { label: "🤖 روبوت",   color: "#85E0D0", desc: "حركات ميكانيكية",       dur: "0.72s", ease: "steps(4,end)" },
  flutter: { label: "🦋 فراشة",   color: "#B8A9FF", desc: "خفيفة وطائرة",          dur: "0.92s", ease: "ease-in-out" },
};

const CONFETTI_EMOJIS = ["🌸","⭐","✨","💖","🌟","💫","🎀","🌺","💛","🩷","🎊","🎉","🏆","✦"];

const PRAISE = [
  "أحسنتِ يا مها! 🌸", "ما شاء الله عليكِ! ✨", "رائعة كالعادة! 💖",
  "هكذا تُبنى الأحلام! 🌟", "مها النجمة! 👑", "فخورة بكِ! 💫",
  "استمري هكذا! 🚀", "كل يوم أحسن من اللي قبله! 🎯",
];

// ════════════════════════════════════════
// AUDIO
// ════════════════════════════════════════
const MELODIES = {
  samba:   [[523,.0],[659,.12],[784,.24],[1047,.36],[784,.48],[659,.60],[523,.72]],
  disco:   [[440,.0],[587,.16],[698,.25],[880,.41],[1047,.5],[880,.66],[698,.83]],
  hiphop:  [[196,.0],[196,.2],[262,.33],[330,.5],[392,.7],[523,.95],[392,1.12]],
  salsa:   [[659,.0],[784,.1],[880,.2],[784,.35],[659,.5],[523,.65],[659,.8]],
  robot:   [[220,.0],[220,.25],[330,.5],[220,.75],[440,1.0],[330,1.25]],
  flutter: [[523,.0],[659,.08],[784,.16],[1047,.24],[1318,.32],[1047,.4],[784,.48]],
};

function playDanceMusic(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = MELODIES[type] || MELODIES.samba;
    notes.forEach(([f, t]) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = type === "robot" ? "square" : type === "hiphop" ? "sawtooth" : "sine";
      o.frequency.setValueAtTime(f, ctx.currentTime + t);
      g.gain.setValueAtTime(0, ctx.currentTime + t);
      g.gain.linearRampToValueAtTime(0.14, ctx.currentTime + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.2);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.25);
    });
    // bass beat
    [0, 0.25, 0.5, 0.75, 1.0].forEach(t => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = "sine"; o.frequency.value = 150;
      o.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + t + 0.1);
      g.gain.setValueAtTime(0.22, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.14);
      o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.18);
    });
    setTimeout(() => ctx.close(), 2500);
  } catch (_) {}
}

// ════════════════════════════════════════
// AVATAR DANCE MODAL
// ════════════════════════════════════════
export function AvatarDanceModal({
  show,
  onClose,
  earnedPts = 20,
  taskLabel = "مهمة",
  danceIndex = 0,
  outfit,
}) {
  const [confetti, setConfetti]   = useState([]);
  const [visible,  setVisible]    = useState(false);
  const [praise,   setPraise]     = useState(PRAISE[0]);
  const timerRef = useRef(null);

  const danceType = DANCE_TYPES[danceIndex % DANCE_TYPES.length];
  const info      = DANCE_INFO[danceType];
  const usedOutfit = outfit || DEFAULT_OUTFIT;

  useEffect(() => {
    if (!show) { setVisible(false); return; }

    setVisible(true);
    setPraise(PRAISE[Math.floor(Math.random() * PRAISE.length)]);
    setConfetti(
      Array.from({ length: 32 }, (_, i) => ({
        id: i,
        emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
        x: Math.random() * 100,
        delay: Math.random() * 1.0,
        dur: 1.2 + Math.random() * 1.4,
        size: 14 + Math.random() * 22,
      }))
    );
    playDanceMusic(danceType);

    timerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 350);
    }, 5000);

    return () => clearTimeout(timerRef.current);
  }, [show, danceType]);

  if (!show && !visible) return null;

  const danceStyle = {
    animation: `d-${danceType} ${info.dur} ${info.ease} infinite`,
    transformOrigin: "bottom center",
    willChange: "transform",
  };

  return createPortal(
    <div
      onClick={() => { clearTimeout(timerRef.current); setVisible(false); setTimeout(onClose, 250); }}
      style={{
        position: "fixed", inset: 0, zIndex: 10500,
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(18px)",
        background: "radial-gradient(ellipse at 50% 40%, rgba(30,8,20,0.97) 0%, rgba(8,3,6,0.98) 100%)",
        transition: "opacity 0.35s",
        opacity: visible ? 1 : 0,
        fontFamily: "'Cairo', sans-serif",
        direction: "rtl",
      }}
    >
      <style>{DANCE_CSS}</style>

      {/* confetti */}
      {confetti.map(c => (
        <div key={c.id} style={{
          position: "fixed", top: "-5%", left: `${c.x}%`,
          fontSize: c.size, pointerEvents: "none", zIndex: 10502,
          animation: `confetti-fall ${c.dur}s ${c.delay}s ease-in forwards`,
        }}>{c.emoji}</div>
      ))}

      {/* glow rings */}
      {[0, 0.3, 0.6].map((delay, i) => (
        <div key={i} style={{
          position: "fixed", top: "44%", left: "50%",
          width: 100 + i * 22, height: 100 + i * 22, borderRadius: "50%",
          border: `${2 - i * 0.4}px solid ${info.color}`,
          animation: `glow-ring ${1.6 + i * 0.2}s ${delay}s ease-out infinite`,
          pointerEvents: "none",
        }} />
      ))}

      {/* main card */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "12px 32px 30px",
          animation: "modal-pop 0.5s cubic-bezier(.34,1.5,.64,1) both",
          position: "relative",
        }}
      >
        {/* glow blob behind avatar */}
        <div style={{
          position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
          width: 200, height: 200, borderRadius: "50%",
          background: info.color, opacity: 0.08, filter: "blur(40px)",
          pointerEvents: "none",
        }} />

        {/* dance type badge */}
        <div style={{
          fontSize: 12, fontWeight: 800, color: info.color,
          background: `${info.color}18`,
          padding: "4px 16px", borderRadius: 20, marginBottom: 10,
          border: `1px solid ${info.color}35`,
          animation: "label-in 0.3s 0.1s both",
          letterSpacing: 0.5,
        }}>{info.label} — {info.desc}</div>

        {/* avatar */}
        <div style={{
          ...danceStyle,
          marginBottom: 6,
          filter: `drop-shadow(0 0 28px ${info.color}cc) drop-shadow(0 10px 20px rgba(0,0,0,0.6))`,
        }}>
          <AvatarSVG outfit={usedOutfit} size={1.45} animating={false} />
        </div>

        {/* XP */}
        <div style={{
          fontSize: 58, fontWeight: 900, lineHeight: 1, marginBottom: 8, marginTop: 10,
          background: "linear-gradient(135deg,#FFE066,#F9C06A,#FFD700)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 20px #F9C06A88)",
          animation: "pts-bounce 0.5s 0.15s cubic-bezier(.34,1.5,.64,1) both",
          opacity: 0, animationFillMode: "forwards",
        }}>+{earnedPts}⭐</div>

        {/* praise */}
        <div style={{
          fontSize: 14, color: C.text, fontWeight: 800,
          marginBottom: 4, animation: "label-in 0.4s 0.35s both",
          opacity: 0, animationFillMode: "forwards", textAlign: "center",
        }}>{praise}</div>

        <div style={{
          fontSize: 11, color: C.muted, marginBottom: 18,
          animation: "label-in 0.4s 0.45s both",
          opacity: 0, animationFillMode: "forwards",
        }}>{taskLabel}</div>

        {/* progress drain bar */}
        <div style={{
          width: 150, height: 3, borderRadius: 10,
          background: "rgba(255,255,255,.08)", overflow: "hidden", marginBottom: 8,
        }}>
          <div style={{
            height: "100%", borderRadius: 10,
            background: `linear-gradient(90deg,${info.color},${info.color}88)`,
            animation: "progress-drain 5s linear forwards",
          }} />
        </div>
        <div style={{ fontSize: 10, color: C.dim, animation: "label-in 1.5s infinite alternate" }}>
          اضغطي للإغلاق ✦
        </div>
      </div>
    </div>,
    document.body
  );
}

// ════════════════════════════════════════
// PLACEHOLDER (used in Tasks.jsx)
// ════════════════════════════════════════
export function DancesTab() { return null; }

export default AvatarDanceModal;