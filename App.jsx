// App.jsx

import MindMapPage from "./MindMap";
import ExamBank from "./ExamBank";
import Tasks from "./Tasks";
import { AVATAR_SRC } from "./avatar";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { db } from "./firebase";
import {
  collection, addDoc, getDocs, deleteDoc,
  doc, updateDoc, query, orderBy
} from "firebase/firestore";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

// ===
// THEME — Sakura 🌸 Japanese Cherry Blossom
// ===
const C = {
  // Backgrounds — deep warm black with pink undertone
  bg:         "#120A0E",
  bgDeep:     "#0C0608",
  surface:    "#1E1115",
  card:       "#24141A",
  cardHover:  "#2C1B22",
  // Borders — sakura pink subtle
  border:     "rgba(255,182,213,0.10)",
  borderLight:"rgba(255,182,213,0.20)",
  // Accent — sakura pink vivid
  accent:     "#FF6B9D",
  accentDark: "#D94F7E",
  accentSoft: "rgba(255,107,157,0.14)",
  // Secondary — deep cherry / plum
  purple:     "#C084B8",
  purpleSoft: "rgba(192,132,184,0.13)",
  // Semantic
  gold:       "#F9C06A",
  goldSoft:   "rgba(249,192,106,0.12)",
  success:    "#7DD3B0",
  successSoft:"rgba(125,211,176,0.12)",
  danger:     "#FF7E7E",
  dangerSoft: "rgba(255,126,126,0.12)",
  warning:    "#FFAD6B",
  warningSoft:"rgba(255,173,107,0.12)",
  // Text
  text:       "#FDF0F5",
  muted:      "#C49BB0",
  dim:        "#6B4558",
  // Extra
  pink:       "#FFB3D1",
  pinkSoft:   "rgba(255,179,209,0.12)",
  teal:       "#85E0D0",
  tealSoft:   "rgba(133,224,208,0.12)",
  // Sakura special
  sakura1:    "#FF8FB3",
  sakura2:    "#FFB3CC",
  sakura3:    "#FFDCE8",
  petal:      "rgba(255,143,179,0.08)",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;900&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{height:100%;-webkit-text-size-adjust:100%}
  body{height:100%;background:${C.bgDeep};color:${C.text};font-family:'Cairo',sans-serif;direction:rtl;overflow:hidden;-webkit-font-smoothing:antialiased}
  #root{height:100%;display:flex;flex-direction:column}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:${C.dim};border-radius:10px}
  input,textarea,select{background:${C.surface};border:1px solid ${C.border};color:${C.text};padding:9px 13px;border-radius:10px;font-family:'Cairo',sans-serif;font-size:14px;outline:none;transition:border-color .15s,box-shadow .15s;width:100%;-webkit-appearance:none}
  input:focus,textarea:focus,select:focus{border-color:${C.accent};box-shadow:0 0 0 3px ${C.accentSoft}}
  input::placeholder,textarea::placeholder{color:${C.dim}}
  button{cursor:pointer;font-family:'Cairo',sans-serif;border:none;transition:all .15s;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
  select option{background:${C.card};color:${C.text}}

  @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes floatEl{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
  @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}

  /* 🌸 Sakura Petal Fall */
  @keyframes petalFall{
    0%{transform:translateY(-20px) translateX(0) rotate(0deg);opacity:0}
    10%{opacity:.7}
    90%{opacity:.4}
    100%{transform:translateY(110vh) translateX(80px) rotate(720deg);opacity:0}
  }
  @keyframes petalSway{
    0%,100%{transform:translateX(0)}
    50%{transform:translateX(30px)}
  }
  /* 🌟 XP Burst */
  @keyframes xpBurst{
    0%{transform:translate(-50%,-50%) scale(0);opacity:1}
    60%{transform:translate(-50%,-80%) scale(1.2);opacity:1}
    100%{transform:translate(-50%,-130%) scale(0.8);opacity:0}
  }
  @keyframes xpRing{
    0%{transform:scale(0);opacity:.8}
    100%{transform:scale(3);opacity:0}
  }
  /* 📊 Weekly recap slide */
  @keyframes recapSlideIn{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
  /* 🎁 Reward pop */
  @keyframes rewardPop{
    0%{transform:scale(0) rotate(-10deg);opacity:0}
    60%{transform:scale(1.15) rotate(3deg);opacity:1}
    80%{transform:scale(.95) rotate(-1deg)}
    100%{transform:scale(1) rotate(0deg);opacity:1}
  }
  @keyframes rewardShine{
    0%{left:-100%}100%{left:150%}
  }
  @keyframes sakuraGlow{
    0%,100%{box-shadow:0 0 20px rgba(255,107,157,.2)}
    50%{box-shadow:0 0 40px rgba(255,107,157,.5),0 0 80px rgba(255,107,157,.15)}
  }

  .fade{animation:fadeUp .22s ease both}
  .float{animation:floatEl 3s ease-in-out infinite}
  .spinner{animation:spin .8s linear infinite;border:2px solid ${C.border};border-top-color:${C.accent};border-radius:50%;display:inline-block;flex-shrink:0}
  .app-wrap{display:flex;height:100%;overflow:hidden}
  .sidebar{width:205px;flex-shrink:0;background:${C.bg};border-left:1px solid ${C.border};display:flex;flex-direction:column;padding:14px 9px 12px;height:100%;overflow-y:auto;gap:1px}
  .main-col{flex:1;min-width:0;display:flex;flex-direction:column;overflow:hidden}
  .page-scroll{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;padding:22px 18px}
  .page-inner{max-width:820px;margin:0 auto}
  .mob-header{display:none;position:fixed;top:0;left:0;right:0;z-index:500;height:50px;background:${C.bg};border-bottom:1px solid ${C.border};align-items:center;justify-content:space-between;padding:0 14px}
  .bot-nav{display:none;position:fixed;bottom:0;left:0;right:0;z-index:500;background:${C.bg};border-top:1px solid ${C.border};justify-content:space-around;align-items:center;height:56px;padding-bottom:env(safe-area-inset-bottom,0px)}
  .sub-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:9px}
  .stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(90px,1fr));gap:8px;margin-bottom:14px}
  .charts-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
  .progress-bar{height:4px;border-radius:10px;background:${C.surface};overflow:hidden}
  .progress-fill{height:100%;border-radius:10px;background:linear-gradient(90deg,${C.accent},${C.purple});transition:width .5s ease}
  .nav-item{display:flex;align-items:center;gap:9px;padding:8px 11px;border-radius:9px;cursor:pointer;font-size:13px;font-weight:500;color:${C.muted};transition:all .12s;border:1px solid transparent}
  .nav-item:hover{background:${C.surface};color:${C.text}}
  .nav-item.active{background:${C.accentSoft};color:${C.accent};border-color:rgba(255,107,157,.25);font-weight:700}
  .kanban-board{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;align-items:start}
  @media(max-width:768px){
    .mob-header{display:flex}
    .bot-nav{display:flex}
    .sidebar{position:fixed!important;top:0;right:0;height:100%!important;z-index:600;width:220px!important;transform:translateX(105%);transition:transform .22s cubic-bezier(.4,0,.2,1);box-shadow:-6px 0 30px rgba(0,0,0,.6)}
    .sidebar.open{transform:translateX(0)}
    .page-scroll{padding:6px 12px!important;padding-top:60px!important;padding-bottom:66px!important}
    .sub-grid{grid-template-columns:repeat(2,1fr)!important}
    .stats-grid{grid-template-columns:repeat(3,1fr)!important}
    .charts-grid{grid-template-columns:1fr!important}
    .kanban-board{grid-template-columns:1fr!important}
  }
  @media(min-width:769px){.mob-only{display:none!important}}
  .bot-nav button span:last-child{white-space:nowrap;overflow:hidden;text-overflow:clip;max-width:42px;}
`;// ===
// API LAYER
// ===
const GROQ_KEY  = import.meta.env.VITE_GROQ_KEY;
const GROQ_URL  = "https://api.groq.com/openai/v1/chat/completions";
const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY;
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const OR_KEY    = import.meta.env.VITE_OR_KEY;
const OR_URL    = "https://openrouter.ai/api/v1/chat/completions";

async function groqChat(messages, maxTokens = 1500) {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_KEY}` },
    body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages, temperature: 0.3, max_tokens: maxTokens })
  });
  const d = await res.json();
  if (d.error) throw new Error(d.error.message);
  return d.choices?.[0]?.message?.content || "";
}

let _lastModel = "gemini";
let _geminiFailed = false;

async function geminiChat(systemPrompt, history, maxTokens = 2000) {
  if (GEMINI_KEY && !_geminiFailed) {
    try {
      const res = await fetch(GEMINI_URL + "?key=" + GEMINI_KEY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: history.map(m => ({ role: m.role === "model" ? "model" : "user", parts: [{ text: m.content }] })),
          generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 }
        })
      });
      const d = await res.json();
      if (d.error) {
        const isQuota = d.error.message?.toLowerCase().includes("quota") || d.error.code === 429;
        if (!isQuota) throw new Error(d.error.message);
        _geminiFailed = true;
      } else {
        _lastModel = "gemini";
        return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
      }
    } catch(e) {
      if (!e.message?.toLowerCase().includes("quota")) throw e;
      _geminiFailed = true;
    }
  }
  _lastModel = "groq";
  return await groqChat([
    { role: "system", content: systemPrompt },
    ...history.map(m => ({ role: m.role === "model" ? "assistant" : "user", content: m.content }))
  ], maxTokens);
}

async function extractQuestionsFromImage(base64, mime, onProgress) {
  onProgress?.("جاري تحليل الصورة...");
  const prompt = `You are an expert Arabic/English exam question extractor. Extract ALL questions from this image.
RULES: Copy every question EXACTLY as written. MCQ: type=mcq, up to 4 choices, correctIndex=0-based if marked else null. Essay: type=essay, choices=[], correctIndex=null.
Output ONLY a JSON array: [{"type":"mcq","question":"..","choices":["A","B","C","D"],"correctIndex":null}]`;
  const res = await fetch(OR_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + OR_KEY, "HTTP-Referer": "https://maha-study.app", "X-Title": "Maha Study" },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-lite-001",
      messages: [{ role: "user", content: [{ type: "image_url", image_url: { url: "data:" + mime + ";base64," + base64 } }, { type: "text", text: prompt }] }],
      temperature: 0.0, max_tokens: 4000
    })
  });
  const d = await res.json();
  if (d.error) throw new Error(d.error.message || JSON.stringify(d.error));
  const raw = d.choices?.[0]?.message?.content || "";
  for (const attempt of [raw.trim(), raw.replace(/```json|```/g,"").trim(), raw.slice(raw.indexOf("["), raw.lastIndexOf("]")+1)]) {
    try {
      const arr = JSON.parse(attempt);
      return (Array.isArray(arr) ? arr : [arr])
        .filter(q => q?.question?.trim())
        .map(q => ({
          type: q.type==="mcq" && Array.isArray(q.choices) && q.choices.filter(c=>c?.trim()).length>=2 ? "mcq" : "essay",
          question: q.question.trim(),
          choices: Array.isArray(q.choices) ? q.choices.filter(c=>c?.trim()).slice(0,4) : [],
          correctIndex: typeof q.correctIndex==="number" ? q.correctIndex : null
        }));
    } catch(_) {}
  }
  throw new Error("فشل تحليل الصورة — جربي تاني");
}

// ===
// HELPERS
// ===
const formatTime = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

function getUnderstandingLevel(q) {
  const cs = q.correctStreak||0, ws = q.wrongStreak||0, ta = q.totalAttempts||0;
  if (ta===0)   return { level:"new",       label:"جديد",           color:C.muted,    icon:"🆕" };
  if (cs>=3)    return { level:"mastered",   label:"أتقنتِه ✨",      color:C.success,  icon:"🏆" };
  if (cs>=1&&ws===0) return { level:"learning", label:"بتتعلمي",       color:C.gold,     icon:"📈" };
  if (ws>=2)    return { level:"struggling", label:"تحتاج مراجعة",   color:C.danger,   icon:"🔴" };
  return         { level:"practicing", label:"بتتمرني",         color:C.accent,   icon:"💪" };
}

// ===
// TOAST SYSTEM
// ===
let _toastFn = null;
const toast = (msg, type="success") => _toastFn?.(msg, type);

function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    _toastFn = (msg, type) => {
      const id = Date.now() + Math.random();
      setToasts(p => [...p, {id, msg, type}]);
      setTimeout(() => setToasts(p => p.filter(t => t.id!==id)), 3000);
    };
    window._toastFn = _toastFn;
    return () => { _toastFn = null; window._toastFn = null; };
  }, []);
  const colors = {
    success: {bg:C.successSoft, border:"rgba(111,207,151,.4)", color:C.success, icon:"✅"},
    error:   {bg:C.dangerSoft,  border:"rgba(235,87,87,.4)",   color:C.danger,  icon:"❌"},
    info:    {bg:C.accentSoft,  border:"rgba(124,106,247,.3)", color:C.accent,  icon:"💡"},
  };
  if (!toasts.length) return null;
  return createPortal(
    <div style={{position:"fixed",top:66,left:"50%",transform:"translateX(-50%)",zIndex:9999,display:"flex",flexDirection:"column",gap:7,alignItems:"center",pointerEvents:"none"}}>
      {toasts.map(t => {
        const s = colors[t.type]||colors.success;
        return <div key={t.id} className="fade" style={{background:s.bg,border:"1px solid "+s.border,color:s.color,padding:"9px 16px",borderRadius:20,fontSize:13,fontWeight:700,fontFamily:"'Cairo',sans-serif",whiteSpace:"nowrap",boxShadow:"0 4px 18px rgba(0,0,0,.3)"}}>
          {s.icon} {t.msg}
        </div>;
      })}
    </div>,
    document.body
  );
}

// ===
// DIALOG SYSTEM (=== alert/confirm)
// ===
let _dialogFn = null;
const showDialog = opts => new Promise(resolve => _dialogFn?.({...opts, resolve}));
const dialog = {
  confirm: (msg, title="تأكيد") => showDialog({type:"confirm", title, msg}),
  alert:   (msg, title="تنبيه") => showDialog({type:"alert",   title, msg}),
};

function DialogContainer() {
  const [d, setD] = useState(null);
  useEffect(() => { 
    _dialogFn = opts => setD(opts); 
    window._dialogFn = _dialogFn;
    return () => { _dialogFn = null; window._dialogFn = null; }; 
  }, []);
  if (!d) return null;
  const close = val => { setD(null); d.resolve(val); };
  const icons = { confirm:"🗑️", alert:"⚠️" };
  const okColor = d.type==="confirm" ? C.danger : C.accent;
  return createPortal(
    <div onClick={()=>close(false)} style={{position:"fixed",inset:0,zIndex:10000,background:"rgba(13,5,11,.88)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div onClick={e=>e.stopPropagation()} className="fade" style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"24px 22px",width:"100%",maxWidth:340,textAlign:"center"}}>
        <div style={{fontSize:34,marginBottom:10}}>{icons[d.type]}</div>
        {d.title&&<div style={{fontSize:15,fontWeight:800,marginBottom:8}}>{d.title}</div>}
        <div style={{fontSize:13,color:C.muted,lineHeight:1.8,marginBottom:20,whiteSpace:"pre-line"}}>{d.msg}</div>
        <div style={{display:"flex",gap:10}}>
          {d.type==="confirm"&&<button onClick={()=>close(false)} style={{flex:1,padding:"10px 0",borderRadius:10,fontFamily:"'Cairo',sans-serif",fontWeight:700,fontSize:13,background:C.surface,border:`1px solid ${C.border}`,color:C.muted}}>إلغاء</button>}
          <button onClick={()=>close(true)} style={{flex:1,padding:"10px 0",borderRadius:10,fontFamily:"'Cairo',sans-serif",fontWeight:700,fontSize:13,background:okColor,border:"none",color:"#fff"}}>
            {d.type==="confirm"?"✅ تأكيد":"حسناً"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ===
// MARKDOWN RENDERER
// ===
function renderMarkdown(text) {
  if (!text) return [];
  const parseBold = str => str.split(/\*\*(.*?)\*\*/g).map((p,i) =>
    i%2===1 ? <strong key={i} style={{color:C.text,fontWeight:800}}>{p}</strong> : p
  );
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <div key={i} style={{height:5}}/>;
    if (/^###\s/.test(line)) return <div key={i} style={{fontSize:13,fontWeight:800,color:C.accent,marginTop:8}}>{parseBold(line.replace(/^###\s/,""))}</div>;
    if (/^##\s/.test(line))  return <div key={i} style={{fontSize:14,fontWeight:900,color:C.accent,marginTop:10,borderBottom:`1px solid rgba(124,106,247,.2)`,paddingBottom:3}}>{parseBold(line.replace(/^##\s/,""))}</div>;
    if (/^\d+\.\s/.test(line)) {
      const num = line.match(/^(\d+)\./)[1];
      return <div key={i} style={{display:"flex",gap:8,marginBottom:3,alignItems:"flex-start"}}>
        <span style={{minWidth:20,height:20,borderRadius:6,background:"rgba(124,106,247,.15)",color:C.accent,fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>{num}</span>
        <span style={{fontSize:13,lineHeight:1.7}}>{parseBold(line.replace(/^\d+\.\s/,""))}</span>
      </div>;
    }
    if (/^[-*•]\s/.test(line)) return <div key={i} style={{display:"flex",gap:8,marginBottom:3,alignItems:"flex-start"}}>
      <span style={{color:C.accent,fontSize:14,flexShrink:0}}>•</span>
      <span style={{fontSize:13,lineHeight:1.7}}>{parseBold(line.replace(/^[-*•]\s/,""))}</span>
    </div>;
    return <div key={i} style={{fontSize:13,lineHeight:1.8}}>{parseBold(line)}</div>;
  });
}

// ===
// UI PRIMITIVES = Linear style
// ===
function Btn({ children, onClick, variant="primary", style={}, disabled=false }) {
  const variants = {
    primary:   {background:C.accent,color:"#fff",boxShadow:`0 0 0 1px ${C.accent}`},
    secondary: {background:C.surface,color:C.text,border:`1px solid ${C.border}`},
    danger:    {background:C.dangerSoft,color:C.danger,border:`1px solid rgba(248,113,113,.2)`},
    success:   {background:C.successSoft,color:C.success,border:`1px solid rgba(74,222,128,.2)`},
    gold:      {background:C.gold,color:"#0A0A0C",boxShadow:`0 0 0 1px ${C.gold}`},
    purple:    {background:C.purpleSoft,color:C.purple,border:`1px solid rgba(167,139,250,.2)`},
    ghost:     {background:"transparent",color:C.muted,border:`1px solid ${C.border}`},
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{fontWeight:600,fontSize:13,borderRadius:7,padding:"7px 14px",display:"inline-flex",alignItems:"center",gap:6,opacity:disabled?.4:1,cursor:disabled?"not-allowed":"pointer",letterSpacing:.1,...variants[variant]||variants.primary,...style}}
      onMouseEnter={e=>{if(!disabled)e.currentTarget.style.opacity=".85";}}
      onMouseLeave={e=>{e.currentTarget.style.opacity=disabled?".4":"1";}}>
      {children}
    </button>
  );
}

function Card({ children, style={}, onClick }) {
  return (
    <div onClick={onClick}
      style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:14,transition:"all .15s",cursor:onClick?"pointer":"default",...style}}
      onMouseEnter={e=>onClick&&Object.assign(e.currentTarget.style,{background:C.cardHover,borderColor:C.borderLight})}
      onMouseLeave={e=>onClick&&Object.assign(e.currentTarget.style,{background:C.card,borderColor:C.border})}>
      {children}
    </div>
  );
}

function Badge({ children, color="accent" }) {
  const m = {
    accent:  [C.accentSoft,  C.accent,  "rgba(124,106,247,.2)"],
    gold:    [C.goldSoft,    C.gold,    "rgba(232,169,75,.2)"],
    success: [C.successSoft, C.success, "rgba(74,222,128,.2)"],
    danger:  [C.dangerSoft,  C.danger,  "rgba(248,113,113,.2)"],
    purple:  [C.purpleSoft,  C.purple,  "rgba(167,139,250,.2)"],
    warning: [C.warningSoft, C.warning, "rgba(251,146,60,.2)"],
    muted:   ["rgba(113,113,122,.08)", C.muted, "rgba(113,113,122,.15)"],
    pink:    [C.pinkSoft, C.pink, "rgba(244,114,182,.2)"],
  };
  const [bg, text, border] = m[color]||m.accent;
  return <span style={{background:bg,color:text,border:`1px solid ${border}`,padding:"2px 8px",borderRadius:5,fontSize:11,fontWeight:600,letterSpacing:.2}}>{children}</span>;
}

function Search({ value, onChange, placeholder }) {
  return (
    <div style={{position:"relative",marginBottom:12}}>
      <span style={{position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",color:C.dim,fontSize:13,pointerEvents:"none"}}>⌕</span>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||"بحث..."} style={{paddingRight:32,fontSize:13}}/>
      {value&&<button onClick={()=>onChange("")} style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",background:"none",color:C.dim,fontSize:13}}>✕</button>}
    </div>
  );
}

function Modal({ show, onClose, title, children, maxWidth=540 }) {
  if (!show) return null;
  return createPortal(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:9000,background:"rgba(0,0,0,.7)",backdropFilter:"blur(4px)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()}
        style={{background:C.card,border:`1px solid ${C.borderLight}`,borderRadius:"12px 12px 0 0",width:"100%",maxWidth,maxHeight:"88vh",display:"flex",flexDirection:"column",animation:"slideUp .18s ease",boxShadow:"0 -8px 40px rgba(0,0,0,.5)"}}>
        {/* Handle */}
        <div style={{display:"flex",justifyContent:"center",padding:"10px 0 6px"}}>
          <div style={{width:32,height:3,borderRadius:3,background:C.dim}}/>
        </div>
        {/* Header */}
        {title&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 16px 12px",flexShrink:0,borderBottom:`1px solid ${C.border}`}}>
          <span style={{fontSize:14,fontWeight:700,color:C.text}}>{title}</span>
          <button onClick={onClose} style={{background:C.surface,border:`1px solid ${C.border}`,color:C.muted,width:28,height:28,borderRadius:6,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>}
        <div style={{overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"14px 16px 24px",flex:1}}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

function FlowerBg() {
  const petals = [
    {left:"8%",  delay:"0s",   dur:"12s",  size:10, opacity:.5},
    {left:"20%", delay:"2s",   dur:"15s",  size:7,  opacity:.35},
    {left:"35%", delay:"5s",   dur:"11s",  size:12, opacity:.45},
    {left:"50%", delay:"1s",   dur:"14s",  size:8,  opacity:.4},
    {left:"65%", delay:"7s",   dur:"13s",  size:9,  opacity:.5},
    {left:"78%", delay:"3s",   dur:"16s",  size:11, opacity:.35},
    {left:"90%", delay:"9s",   dur:"12s",  size:7,  opacity:.4},
    {left:"14%", delay:"4s",   dur:"18s",  size:6,  opacity:.3},
    {left:"42%", delay:"11s",  dur:"14s",  size:10, opacity:.45},
    {left:"72%", delay:"6s",   dur:"17s",  size:8,  opacity:.35},
  ];
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
      {/* subtle dot grid */}
      <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(circle at 1px 1px, rgba(255,107,157,.04) 1px, transparent 0)`,backgroundSize:"28px 28px",backgroundRepeat:"repeat"}}/>
      {/* warm pink ambient orbs */}
      <div style={{position:"absolute",top:"-15%",right:"-8%",width:"55%",height:"65%",borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,157,.06) 0%,transparent 70%)",animation:"floatEl 8s ease-in-out infinite"}}/>
      <div style={{position:"absolute",bottom:"-8%",left:"3%",width:"45%",height:"55%",borderRadius:"50%",background:"radial-gradient(circle,rgba(192,132,184,.05) 0%,transparent 70%)",animation:"floatEl 11s ease-in-out 2s infinite reverse"}}/>
      <div style={{position:"absolute",top:"40%",left:"50%",width:"35%",height:"40%",borderRadius:"50%",background:"radial-gradient(circle,rgba(255,179,209,.04) 0%,transparent 70%)",animation:"floatEl 14s ease-in-out 4s infinite"}}/>
      {/* 🌸 Falling petals */}
      {petals.map((p,i)=>(
        <div key={i} style={{
          position:"absolute",top:"-20px",left:p.left,
          fontSize:p.size,opacity:p.opacity,
          animation:`petalFall ${p.dur} ${p.delay} linear infinite, petalSway ${parseFloat(p.dur)*0.7}s ${p.delay} ease-in-out infinite alternate`,
          userSelect:"none",
        }}>🌸</div>
      ))}
    </div>
  );
}

function NetworkStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on  = () => { setOnline(true);  toast("عاد الاتصال 🌐","success"); };
    const off = () => { setOnline(false); toast("لا يوجد اتصال ❌","error"); };
    window.addEventListener("online",on); window.addEventListener("offline",off);
    return () => { window.removeEventListener("online",on); window.removeEventListener("offline",off); };
  }, []);
  if (online) return null;
  return createPortal(
    <div style={{position:"fixed",bottom:68,left:"50%",transform:"translateX(-50%)",zIndex:8000,background:"rgba(235,87,87,.95)",color:"#fff",padding:"7px 16px",borderRadius:20,fontSize:12,fontWeight:700,fontFamily:"'Cairo',sans-serif",whiteSpace:"nowrap"}}>
      📵 لا يوجد اتصال بالنت
    </div>,
    document.body
  );
}

// ===
// ===
// DASHBOARD — Beautiful feminine design
// ===
function Dashboard({ subjects, questions, onNav }) {
  const wrong      = questions.filter(q => !q.isCorrect);
  const mastered   = questions.filter(q => (q.correctStreak||0)>=3);
  const learned    = questions.filter(q => q.wasWrong && q.isCorrect);
  const struggling = questions.filter(q => !q.isCorrect && (q.wrongStreak||0)>=2);
  const acc        = questions.length ? Math.round(((questions.length-wrong.length)/questions.length)*100) : 0;
  const h          = new Date().getHours();
  const gr         = h<12 ? "صباح النور" : h<17 ? "مساء النور" : "مساء الخير";

  const subErrs = subjects
    .map(s=>({name:s.name.slice(0,10), أخطاء:wrong.filter(q=>q.subjectId===s.id).length}))
    .filter(s=>s.أخطاء>0).sort((a,b)=>b.أخطاء-a.أخطاء);
  const pie = [
    {name:"صح",  value:questions.length-wrong.length, color:C.success},
    {name:"غلط", value:wrong.length,                  color:C.danger},
  ];

  return (
    <div className="fade">
      {/* Hero header */}
      <div style={{marginBottom:22,padding:"20px 20px 16px",borderRadius:16,
        background:`linear-gradient(135deg, rgba(232,121,160,.12) 0%, rgba(180,142,245,.08) 100%)`,
        border:`1px solid rgba(232,121,160,.15)`}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <div style={{fontSize:32}} className="float">🌸</div>
          <div style={{flex:1}}>
            <h1 style={{fontSize:18,fontWeight:900,color:C.text,marginBottom:2}}>{gr} يا مها ✨</h1>
            <p style={{color:C.muted,fontSize:11}}>{new Date().toLocaleDateString("ar-EG",{weekday:"long",day:"numeric",month:"long"})}</p>
          </div>
          <button onClick={()=>{
            const data={date:new Date().toLocaleDateString("ar-EG"),total:questions.length,wrong:wrong.length,mastered:mastered.length,learned:learned.length};
            const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));a.download="maha-study.json";a.click();
            toast("تم التصدير");
          }} style={{background:"rgba(255,255,255,.06)",border:`1px solid ${C.border}`,borderRadius:8,padding:"5px 10px",fontSize:11,color:C.muted,cursor:"pointer"}}>تصدير</button>
        </div>

        {/* Progress bar */}
        {questions.length>0&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,alignItems:"center"}}>
              <span style={{fontSize:11,color:C.muted}}>نسبة الإتقان</span>
              <span style={{fontSize:12,fontWeight:700,color:acc>=70?C.success:acc>=40?C.gold:C.danger}}>{acc}%</span>
            </div>
            <div style={{height:6,borderRadius:10,background:"rgba(255,255,255,.07)",overflow:"hidden"}}>
              <div style={{height:"100%",width:acc+"%",borderRadius:10,background:`linear-gradient(90deg,${C.accent},${C.purple})`,transition:"width .7s ease"}}/>
            </div>
          </div>
        )}
      </div>

      {/* Empty state */}
      {questions.length===0&&(
        <div style={{marginBottom:16,padding:"28px 20px",borderRadius:14,border:`2px dashed rgba(232,121,160,.25)`,textAlign:"center"}}>
          <div style={{fontSize:36,marginBottom:10}}>🌸</div>
          <div style={{fontSize:14,fontWeight:700,marginBottom:6,color:C.text}}>ابدئي بإضافة أسئلتك الغلط</div>
          <div style={{fontSize:12,color:C.muted,marginBottom:16}}>المواد ← درس ← سؤال جديد</div>
          <Btn onClick={()=>onNav("subjects")} variant="primary">ابدئي الآن 🌟</Btn>
        </div>
      )}

      {/* Primary actions */}
      {questions.length>0&&(
        <div style={{display:"flex",gap:9,marginBottom:18,flexWrap:"wrap"}}>
          <button onClick={()=>onNav("study")}
            style={{flex:1,minWidth:120,padding:"13px 16px",borderRadius:12,
              background:`linear-gradient(135deg,${C.accent},${C.accentDark})`,
              border:"none",color:"#fff",fontFamily:"'Cairo',sans-serif",fontWeight:700,fontSize:14,
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,
              boxShadow:`0 4px 20px rgba(232,121,160,.3)`}}>
            {wrong.length>0?`📖 ذاكري الأخطاء (${wrong.length})`:"✨ راجعي المتقن"}
          </button>
          <button onClick={()=>onNav("chatbot")}
            style={{padding:"13px 16px",borderRadius:12,
              background:`linear-gradient(135deg,rgba(180,142,245,.15),rgba(180,142,245,.08))`,
              border:`1px solid rgba(180,142,245,.25)`,
              color:C.purple,fontFamily:"'Cairo',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>
            🤖 اسألي الأستاذ
          </button>
        </div>
      )}

      {/* Alert banners */}
      {struggling.length>0&&(
        <div style={{marginBottom:12,padding:"10px 14px",borderRadius:10,
          background:"rgba(252,129,129,.07)",border:"1px solid rgba(252,129,129,.2)",
          display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:C.danger,flexShrink:0,animation:"pulse 1.5s infinite"}}/>
          <div style={{flex:1}}>
            <span style={{fontSize:12,fontWeight:700,color:C.danger}}>{struggling.length} سؤال يحتاج مراجعة عاجلة</span>
            <span style={{fontSize:11,color:C.muted,marginRight:6}}>غلطتِ فيهم أكثر من مرتين</span>
          </div>
          <button onClick={()=>onNav("errors")}
            style={{background:C.danger,border:"none",color:"#fff",borderRadius:7,padding:"4px 12px",fontSize:11,fontFamily:"'Cairo',sans-serif",fontWeight:700,cursor:"pointer"}}>
            راجعي
          </button>
        </div>
      )}
      {questions.length>0&&wrong.length===0&&(
        <div style={{marginBottom:12,padding:"10px 14px",borderRadius:10,
          background:"rgba(110,231,183,.07)",border:"1px solid rgba(110,231,183,.2)",
          fontSize:12,color:C.success,display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:16}}>🏆</span> أتقنتِ كل الأسئلة! عظيمة يا مها 🌸
        </div>
      )}

      {/* Stats grid */}
      <div className="stats-grid">
        {[
          ["إجمالي",  questions.length, C.accent,  "📝"],
          ["أخطاء",   wrong.length,     C.danger,  "❌"],
          ["أتقنتِه", mastered.length,  C.purple,  "🏆"],
          ["تعلمتِ",  learned.length,   C.success, "💡"],
          ["عاجل",    struggling.length,C.warning, "🔴"],
          ["نجاح",    acc+"%",          C.gold,    "🎯"],
        ].map(([lb,vl,cl,ic],i)=>(
          <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,
            borderRadius:12,padding:"12px 8px",textAlign:"center",
            transition:"all .2s"}}
            onMouseEnter={e=>Object.assign(e.currentTarget.style,{borderColor:C.accent,transform:"translateY(-1px)"})}
            onMouseLeave={e=>Object.assign(e.currentTarget.style,{borderColor:C.border,transform:""})}>
            <div style={{fontSize:18,marginBottom:4}}>{ic}</div>
            <div style={{fontSize:18,fontWeight:900,color:cl,marginBottom:2}}>{vl}</div>
            <div style={{fontSize:10,color:C.muted}}>{lb}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      {questions.length>0&&(
        <div className="charts-grid">
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px 12px"}}>
            <div style={{fontSize:11,fontWeight:600,color:C.muted,marginBottom:10}}>الإجابات</div>
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie data={pie} cx="50%" cy="50%" innerRadius={36} outerRadius={56} dataKey="value" paddingAngle={4}>
                  {pie.map((e,i)=><Cell key={i} fill={e.color}/>)}
                </Pie>
                <Tooltip contentStyle={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}}/>
                <Legend wrapperStyle={{fontSize:10}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px 12px"}}>
            <div style={{fontSize:11,fontWeight:600,color:C.muted,marginBottom:10}}>أخطاء المواد</div>
            {subErrs.length>0?(
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={subErrs}>
                  <XAxis dataKey="name" tick={{fill:C.muted,fontSize:8}}/>
                  <YAxis tick={{fill:C.muted,fontSize:8}}/>
                  <Tooltip contentStyle={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}}/>
                  <Bar dataKey="أخطاء" fill={C.accent} radius={[5,5,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            ):<div style={{textAlign:"center",color:C.dim,padding:30,fontSize:12}}>لا أخطاء 🎉</div>}
          </div>
        </div>
      )}
    </div>
  );
}


// ===
// SUBJECTS
// ===
function Subjects({ subjects, setSubjects, setCurrentSubject, setPage, lessons, setLessons, questions, setQuestions }) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState(""); const [icon, setIcon] = useState("📚");
  const [search, setSearch] = useState(""); const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null); // id of subject being deleted
  const icons = ["📚","🔬","🧮","📖","🌍","⚗️","🎨","💻","🏛️","🩺","⚙️","📐","🧬","📜","🔭","🎭"];

  const add = async () => {
    if (!name.trim()) return; setLoading(true);
    try {
      const r = await addDoc(collection(db,"subjects"),{name:name.trim(),icon,createdAt:new Date()});
      setSubjects(p=>[...p,{id:r.id,name:name.trim(),icon}]);
      setName(""); setIcon("📚"); setShow(false); toast("تمت إضافة المادة 📚");
    } catch(e) { await dialog.alert("خطأ: "+e.message); }
    setLoading(false);
  };

  const del = async id => {
    const subLessons  = lessons.filter(l=>l.subjectId===id);
    const subQs       = questions.filter(q=>q.subjectId===id);
    const msg = `هتحذفي المادة وكل محتواها:\n${subLessons.length} درس · ${subQs.length} سؤال\n\nمش هيرجعوا!`;
    if (!await dialog.confirm(msg,"حذف المادة نهائياً")) return;
    setDeleting(id);
    try {
      // === =======
      for (const q of subQs) await deleteDoc(doc(db,"questions",q.id));
      // === ======
      for (const l of subLessons) await deleteDoc(doc(db,"lessons",l.id));
      // === ======
      await deleteDoc(doc(db,"subjects",id));
      setQuestions(p=>p.filter(q=>q.subjectId!==id));
      setLessons(p=>p.filter(l=>l.subjectId!==id));
      setSubjects(p=>p.filter(s=>s.id!==id));
      toast(`تم حذف المادة و${subLessons.length} درس و${subQs.length} سؤال`,"info");
    } catch(e) { await dialog.alert("خطأ: "+e.message); }
    setDeleting(null);
  };

  const filtered = subjects.filter(s=>s.name.includes(search));

  return (
    <div className="fade">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 style={{fontSize:18,fontWeight:800}}>📚 المواد الدراسية</h2>
        <div style={{display:"flex",gap:8}}>
          <Btn variant="secondary" onClick={()=>setPage("mindmap")} style={{flexShrink:0}}>🗺️ الخريطة</Btn>
          <Btn onClick={()=>setShow(true)}>+ مادة</Btn>
        </div>
      </div>
      <Search value={search} onChange={setSearch} placeholder="ابحثي عن مادة..."/>
      {filtered.length===0
        ?<Card style={{textAlign:"center",padding:46}}><div style={{fontSize:42,marginBottom:8}}>📚</div><div style={{color:C.muted,fontSize:14}}>{search?"لا نتائج":"لا توجد مواد بعد"}</div></Card>
        :<div className="sub-grid">
          {filtered.map(s=>{
            const errCnt  = questions.filter(q=>q.subjectId===s.id&&!q.isCorrect).length;
            const lesCnt  = lessons.filter(l=>l.subjectId===s.id).length;
            return (
              <Card key={s.id} onClick={()=>{setCurrentSubject(s);setPage("lessons");}} style={{textAlign:"center",padding:"13px 9px",cursor:"pointer"}}>
                <div style={{fontSize:30,marginBottom:7}}>{s.icon}</div>
                <h3 style={{fontSize:12,fontWeight:800,marginBottom:6,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</h3>
                <div style={{display:"flex",justifyContent:"center",gap:5,marginBottom:9,flexWrap:"wrap"}}>
                  <span style={{fontSize:10,color:C.muted,background:C.surface,padding:"2px 7px",borderRadius:8}}>{lesCnt} درس</span>
                  {errCnt>0&&<span style={{fontSize:10,color:C.danger,background:C.dangerSoft,padding:"2px 7px",borderRadius:8}}>{errCnt} خطأ</span>}
                </div>
                <button onClick={e=>{e.stopPropagation();del(s.id);}}
                  disabled={deleting===s.id}
                  style={{background:"none",color:C.dim,fontSize:12,fontFamily:"'Cairo',sans-serif",opacity:deleting===s.id?.5:1}}>
                  {deleting===s.id?<span className="spinner" style={{width:12,height:12}}/>:"🗑️"}
                </button>
              </Card>
            );
          })}
        </div>
      }
      <Modal show={show} onClose={()=>setShow(false)} title="🌸 إضافة مادة">
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="اسم المادة..." onKeyDown={e=>e.key==="Enter"&&add()} autoFocus/>
          <div><label style={{fontSize:12,color:C.muted,display:"block",marginBottom:7}}>الأيقونة</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{icons.map(ic=><button key={ic} onClick={()=>setIcon(ic)} style={{width:36,height:36,borderRadius:9,fontSize:18,background:icon===ic?C.accentSoft:C.surface,border:`2px solid ${icon===ic?C.accent:C.border}`}}>{ic}</button>)}</div>
          </div>
          <div style={{display:"flex",gap:9,justifyContent:"flex-end"}}>
            <Btn variant="secondary" onClick={()=>setShow(false)}>إلغاء</Btn>
            <Btn onClick={add} disabled={loading}>{loading?"...":"✅ إضافة"}</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ===
// LESSONS
// ===
function Lessons({ subject, lessons, setLessons, setCurrentLesson, setPage, questions }) {
  const [show,      setShow]      = useState(false);
  const [name,      setName]      = useState("");
  const [loading,   setLoading]   = useState(false);
  const [search,    setSearch]    = useState("");
  const [notesModal,setNotesModal]= useState(null); // {id, name, notes}
  const [notesSaving,setNotesSaving]=useState(false);

  const sLessons = lessons.filter(l=>l.subjectId===subject.id);
  const filtered = sLessons.filter(l=>l.name.includes(search));

  const add = async () => {
    if (!name.trim()) return; setLoading(true);
    try {
      const r = await addDoc(collection(db,"lessons"),{name:name.trim(),subjectId:subject.id,createdAt:new Date()});
      setLessons(p=>[...p,{id:r.id,name:name.trim(),subjectId:subject.id}]);
      setName(""); setShow(false); toast("تمت إضافة الدرس 📖");
    } catch(e) { await dialog.alert("خطأ: "+e.message); }
    setLoading(false);
  };

  const del = async id => {
    if (!await dialog.confirm("حذف الدرس وكل أسئلته؟","حذف الدرس")) return;
    await deleteDoc(doc(db,"lessons",id));
    setLessons(p=>p.filter(l=>l.id!==id));
    toast("تم حذف الدرس","info");
  };

  const saveNotes = async () => {
    if (!notesModal) return;
    setNotesSaving(true);
    try {
      await updateDoc(doc(db,"lessons",notesModal.id),{notes:notesModal.notes||""});
      setLessons(p=>p.map(l=>l.id===notesModal.id?{...l,notes:notesModal.notes||""}:l));
      toast("تم حفظ الملاحظات 📝");
      setNotesModal(null);
    } catch(e) { await dialog.alert("خطأ: "+e.message); }
    setNotesSaving(false);
  };

  return (
    <div className="fade">
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
        <button onClick={()=>setPage("subjects")} style={{background:C.surface,border:`1px solid ${C.border}`,color:C.muted,borderRadius:10,padding:"6px 11px",fontSize:13,fontFamily:"'Cairo',sans-serif",flexShrink:0}}>← رجوع</button>
        <div style={{flex:1,minWidth:0}}>
          <h2 style={{fontSize:15,fontWeight:800,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{subject.icon} {subject.name}</h2>
          <div style={{color:C.muted,fontSize:11}}>{sLessons.length} درس</div>
        </div>
        <Btn onClick={()=>setShow(true)} style={{flexShrink:0}}>+ درس</Btn>
      </div>

      <Search value={search} onChange={setSearch} placeholder="ابحثي عن درس..."/>

      {filtered.length===0
        ?<Card style={{textAlign:"center",padding:46}}><div style={{fontSize:38,marginBottom:8}}>📖</div><div style={{color:C.muted,fontSize:14}}>{search?"لا نتائج":"لا توجد دروس بعد"}</div></Card>
        :<div style={{display:"flex",flexDirection:"column",gap:8}}>
          {filtered.map((l,i)=>{
            const lq=questions.filter(q=>q.lessonId===l.id);
            const lw=lq.filter(q=>!q.isCorrect);
            const hasNotes=!!(l.notes?.trim());
            return (
              <Card key={l.id} style={{cursor:"pointer"}}
                onClick={()=>{setCurrentLesson(l);setPage("questions");}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:9}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0}}>
                    <div style={{width:32,height:32,borderRadius:9,background:C.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:C.accent,fontSize:12,flexShrink:0}}>{i+1}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.name}</div>
                      <div style={{fontSize:11,color:C.muted,marginTop:1,display:"flex",gap:6,alignItems:"center"}}>
                        <span>{lq.length>0?lq.length+" سؤال"+(lw.length?" · "+lw.length+" خطأ":""):"لا أسئلة بعد"}</span>
                        {hasNotes&&<span style={{color:C.gold,fontSize:10}}>📝 مرجع</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:5,flexShrink:0}}>
                    <button onClick={e=>{e.stopPropagation();setNotesModal({id:l.id,name:l.name,notes:l.notes||""});}}
                      style={{width:30,height:30,borderRadius:8,background:hasNotes?C.goldSoft:C.surface,border:`1px solid ${hasNotes?C.gold:C.border}`,color:hasNotes?C.gold:C.dim,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      📝
                    </button>
                    <button
                      onClick={e=>{e.stopPropagation();del(l.id);}}
                      style={{
                        width:26, height:26, borderRadius:7, fontSize:12,
                        background:"transparent", border:"1px solid rgba(252,129,129,0.2)",
                        color:"rgba(252,129,129,0.4)", cursor:"pointer",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        transition:"all .15s",
                      }}
                      onMouseEnter={e=>{e.currentTarget.style.background="rgba(252,129,129,0.15)"; e.currentTarget.style.color="#FC8181"; e.currentTarget.style.borderColor="#FC8181";}}
                      onMouseLeave={e=>{e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(252,129,129,0.4)"; e.currentTarget.style.borderColor="rgba(252,129,129,0.2)";}}
                    >
                      🗑️
                    </button>                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      }

      {/* Modal إضافة درس */}
      <Modal show={show} onClose={()=>setShow(false)} title="📖 درس جديد">
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="اسم الدرس..." onKeyDown={e=>e.key==="Enter"&&add()} autoFocus/>
          <div style={{display:"flex",gap:9,justifyContent:"flex-end"}}>
            <Btn variant="secondary" onClick={()=>setShow(false)}>إلغاء</Btn>
            <Btn onClick={add} disabled={loading}>{loading?"...":"✅ إضافة"}</Btn>
          </div>
        </div>
      </Modal>

      {/* Modal ملاحظات الدرس (مرجع الـ AI) */}
      <Modal show={!!notesModal} onClose={()=>setNotesModal(null)} title={`📝 مرجع AI — ${notesModal?.name||""}`}>
        {notesModal&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{padding:"9px 13px",borderRadius:10,background:C.goldSoft,border:`1px solid rgba(212,168,83,.3)`,fontSize:12,color:C.gold,lineHeight:1.7}}>
              💡 اكتب هنا ملخص الدرس أو النقاط المهمة — الـ AI هيستخدم ده كمرجع لما يشرح أو يختبر في الدرس ده
            </div>
            <textarea
              value={notesModal.notes}
              onChange={e=>setNotesModal(p=>({...p,notes:e.target.value}))}
              rows={8}
              placeholder={`مثال:\n- التكتل الاقتصادي هو تجمع دول لتحقيق مصالح مشتركة\n- الهدف: إزالة الحواجز الجمركية وزيادة التبادل التجاري\n- الفرق بينه وبين المساعدات الدولية: التكتل داخلي بين الأعضاء، والمساعدات من مؤسسات خارجية\n- أمثلة: الاتحاد الأوروبي، مجلس التعاون الخليجي`}
              style={{resize:"vertical",minHeight:160,lineHeight:1.8,fontSize:13}}
            />
            <div style={{fontSize:11,color:C.dim,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span>{notesModal.notes?.length||0} حرف</span>
              <span>الـ AI هيقرأ أول 800 حرف</span>
            </div>
            <div style={{display:"flex",gap:9,justifyContent:"flex-end"}}>
              <Btn variant="secondary" onClick={()=>setNotesModal(null)}>إلغاء</Btn>
              <Btn onClick={saveNotes} disabled={notesSaving} variant="gold">
                {notesSaving?<><span className="spinner" style={{width:13,height:13}}/> جاري الحفظ...</>:"✅ حفظ المرجع"}
              </Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ===
// QUESTION CARD
// ===
function QCard({ q, onDelete }) {
  const [exp, setExp] = useState(false);
  const u = getUnderstandingLevel(q);
  const learned = q.wasWrong && q.isCorrect && (q.correctStreak||0)>=1;
  return (
    <Card style={{borderColor:learned?"rgba(212,168,83,.35)":q.isCorrect?"rgba(111,207,151,.2)":"rgba(235,87,87,.2)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",gap:5,marginBottom:7,alignItems:"center",overflowX:"auto",paddingBottom:2,msOverflowStyle:"none",scrollbarWidth:"none"}}>
            <Badge color={q.type==="mcq"?"accent":"gold"}>{q.type==="mcq"?"MCQ":"مقالي"}</Badge>
            {learned ? <Badge color="gold">💡 تعلمتِ منه</Badge>
              : <Badge color={q.isCorrect?"success":"danger"}>{q.isCorrect?"✅ صح":"❌ خطأ"}</Badge>}
            <span style={{fontSize:11,color:u.color}}>{u.icon} {u.label}</span>
            {q.totalAttempts>0&&<span style={{fontSize:11,color:C.dim}}>{q.totalAttempts} محاولة</span>}
          </div>
          <div style={{fontSize:13,fontWeight:600,lineHeight:1.7,cursor:"pointer"}} onClick={()=>setExp(!exp)}>
            {exp?q.question:(q.question?.slice(0,100)+(q.question?.length>100?"...":""))}
          </div>
        </div>
        <Btn variant="danger" onClick={onDelete} style={{padding:"5px 9px",fontSize:13,flexShrink:0}}>🗑️</Btn>
      </div>
      {exp&&(
        <div className="fade" style={{marginTop:10}}>
          {q.type==="mcq"&&q.choices?.filter(c=>c).length>0&&(
            <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:9}}>
              {q.choices.map((ch,ci)=>ch&&(
                <div key={ci} style={{display:"flex",gap:5,alignItems:"center",padding:"6px 9px",borderRadius:8,
                  background:q.selectedAnswer===ci?C.dangerSoft:q.correctAnswer===ci?C.successSoft:C.surface,
                  border:`1px solid ${q.selectedAnswer===ci?C.danger:q.correctAnswer===ci?C.success:C.border}`}}>
                  <span style={{fontWeight:700,color:q.selectedAnswer===ci?C.danger:q.correctAnswer===ci?C.success:C.muted,fontSize:11}}>{["أ","ب","ج","د"][ci]}</span>
                  <span style={{fontSize:12,flex:1}}>{ch}</span>
                  {q.selectedAnswer===ci&&<span style={{color:C.danger,fontSize:10}}>اخترتِ</span>}
                  {q.correctAnswer===ci&&<span style={{color:C.success,fontSize:10}}>الصحيحة</span>}
                </div>
              ))}
            </div>
          )}
          {q.type==="essay"&&(
            <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:9}}>
              {q.essayAnswer&&<div style={{padding:"7px 11px",borderRadius:8,background:C.dangerSoft,border:`1px solid rgba(235,87,87,.3)`,fontSize:12}}><b style={{color:C.danger}}>❌ إجابتك: </b>{q.essayAnswer}</div>}
              {q.essayCorrect&&<div style={{padding:"7px 11px",borderRadius:8,background:C.successSoft,border:`1px solid rgba(111,207,151,.3)`,fontSize:12}}><b style={{color:C.success}}>✅ الصحيحة: </b>{q.essayCorrect}</div>}
            </div>
          )}
          {q.note&&<div style={{padding:"7px 11px",borderRadius:8,background:C.goldSoft,border:`1px solid rgba(212,168,83,.3)`,fontSize:12}}><b style={{color:C.gold}}>💡 سبب الخطأ: </b>{q.note}</div>}
        </div>
      )}
      <button onClick={()=>setExp(!exp)} style={{background:"none",color:C.dim,fontSize:11,marginTop:7}}>{exp?"▲ إخفاء":"▼ تفاصيل"}</button>
    </Card>
  );
}

// ===
// QUESTIONS PAGE
// ===
function Questions({ lesson, subject, questions, setQuestions, setPage }) {
  const [show, setShow] = useState(false);
  const [showOCR, setShowOCR] = useState(false);
  const [ocrQs, setOcrQs] = useState([]);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrStatus, setOcrStatus] = useState("");
  const [type, setType] = useState("mcq");
  const [qText, setQText] = useState("");
  const [choices, setChoices] = useState(["","","",""]);
  const [selAns, setSelAns] = useState(null); const [corAns, setCorAns] = useState(null);
  const [essAns, setEssAns] = useState(""); const [essCor, setEssCor] = useState("");
  const [note, setNote] = useState(""); const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const imgRef = useRef();

  const lessonQ  = questions.filter(q=>q.lessonId===lesson.id);
  const filtered = lessonQ.filter(q=>q.question?.includes(search)||q.note?.includes(search));

  const makeQData = (isCorrect, extra={}) => ({
    lessonId:lesson.id, subjectId:subject.id, lessonName:lesson.name, subjectName:subject.name,
    wasWrong: !isCorrect, // يتحفظ للأبد
    isCorrect, note:"", correctStreak:0, wrongStreak:0, totalCorrect:0, totalAttempts:0,
    createdAt:new Date(), ...extra
  });

  const handleImg = async file => {
    setOcrLoading(true); setOcrStatus("جاري تحميل محرك القراءة...");
    const reader = new FileReader();
    reader.onload = async e => {
      try {
        const base64 = e.target.result.split(",")[1];
        const results = await extractQuestionsFromImage(base64, file.type, setOcrStatus);
        setOcrQs(results.map(q=>({...q,choices:q.choices?.length>0?q.choices.slice(0,4).concat(Array(4).fill("")).slice(0,4):["","","",""],selAns:null,corAns:q.correctIndex??null,note:"",selected:true})));
        setShowOCR(true);
      } catch(err) { await dialog.alert("خطأ في قراءة الصورة: "+err.message,"خطأ OCR"); }
      setOcrLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const saveOCR = async () => {
    const toSave = ocrQs.filter(q=>q.selected);
    if (!toSave.length) return;
    setLoading(true);
    try {
      const saved = [];
      for (const q of toSave) {
        if (q.type==="mcq"&&(q.selAns===null||q.corAns===null)) continue;
        const isCorrect = q.type==="mcq" ? q.selAns===q.corAns : false;
        const data = makeQData(isCorrect, {type:q.type,question:q.question,note:q.note||"",choices:q.type==="mcq"?q.choices:[],selectedAnswer:q.type==="mcq"?q.selAns:null,correctAnswer:q.type==="mcq"?q.corAns:null,essayAnswer:"",essayCorrect:""});
        const r = await addDoc(collection(db,"questions"),data);
        saved.push({id:r.id,...data});
      }
      setQuestions(p=>[...saved,...p]);
      setShowOCR(false); setOcrQs([]); toast("تم حفظ "+saved.length+" سؤال 📷");
    } catch(e) { await dialog.alert("خطأ: "+e.message); }
    setLoading(false);
  };

  const save = async () => {
    if (!qText.trim()) return toast("اكتبي السؤال!","error");
    if (type==="mcq"&&(selAns===null||corAns===null)) return toast("حددي إجابتك والإجابة الصحيحة","error");
    setLoading(true);
    try {
      const isCorrect = type==="mcq" ? selAns===corAns : false;
      const data = makeQData(isCorrect, {type,question:qText.trim(),note:note.trim(),choices:type==="mcq"?choices:[],selectedAnswer:type==="mcq"?selAns:null,correctAnswer:type==="mcq"?corAns:null,essayAnswer:type==="essay"?essAns.trim():"",essayCorrect:type==="essay"?essCor.trim():""});
      const r = await addDoc(collection(db,"questions"),data);
      setQuestions(p=>[{id:r.id,...data},...p]);
      setQText("");setChoices(["","","",""]);setSelAns(null);setCorAns(null);setEssAns("");setEssCor("");setNote("");setType("mcq");setShow(false);
      toast("تم حفظ السؤال ✅");
    } catch(e) { await dialog.alert("خطأ: "+e.message); }
    setLoading(false);
  };

  const del = async id => {
    if (!await dialog.confirm("حذف السؤال نهائياً؟","حذف السؤال")) return;
    await deleteDoc(doc(db,"questions",id));
    setQuestions(p=>p.filter(q=>q.id!==id));
    toast("تم الحذف","info");
  };

  return (
    <div className="fade">
      {/* Header */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"13px 15px",marginBottom:13}}>
        <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:9}}>
          {setPage&&<button onClick={()=>setPage("lessons")} style={{background:C.surface,border:`1px solid ${C.border}`,color:C.muted,borderRadius:9,padding:"5px 10px",fontSize:13,fontFamily:"'Cairo',sans-serif",flexShrink:0}}>← رجوع</button>}
          <div style={{width:38,height:38,borderRadius:11,background:C.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{subject.icon}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:11,color:C.muted}}>{subject.name}</div>
            <div style={{fontSize:14,fontWeight:800,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{lesson.name}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"4px 10px",fontSize:11,color:C.muted}}>📝 {lessonQ.length} سؤال</span>
          <span style={{background:C.dangerSoft,border:`1px solid rgba(235,87,87,.3)`,borderRadius:8,padding:"4px 10px",fontSize:11,color:C.danger}}>❌ {lessonQ.filter(q=>!q.isCorrect).length} خطأ</span>
          <span style={{background:C.successSoft,border:`1px solid rgba(111,207,151,.3)`,borderRadius:8,padding:"4px 10px",fontSize:11,color:C.success}}>🏆 {lessonQ.filter(q=>(q.correctStreak||0)>=3).length} أتقنتِه</span>
          <input ref={imgRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>e.target.files[0]&&handleImg(e.target.files[0])}/>
          <Btn variant="purple" onClick={()=>imgRef.current.click()} disabled={ocrLoading} style={{fontSize:12,padding:"6px 12px"}}>
            {ocrLoading?<><span className="spinner" style={{width:12,height:12}}/> جاري القراءة...</>:"📷 صورة"}
          </Btn>
          <Btn onClick={()=>setShow(true)} style={{fontSize:12,padding:"6px 14px"}}>+ سؤال</Btn>
        </div>
        {ocrStatus&&<div style={{marginTop:7,fontSize:11,color:C.purple,padding:"5px 9px",background:C.purpleSoft,borderRadius:7}}>⏳ {ocrStatus}</div>}
      </div>

      <Search value={search} onChange={setSearch} placeholder="ابحثي في الأسئلة..."/>
      {filtered.length===0
        ?<Card style={{textAlign:"center",padding:46}}><div style={{fontSize:38,marginBottom:8}}>📝</div><div style={{color:C.muted,fontSize:14}}>{search?"لا نتائج":"لا توجد أسئلة بعد"}</div></Card>
        :<div style={{display:"flex",flexDirection:"column",gap:11}}>{filtered.map(q=><QCard key={q.id} q={q} onDelete={()=>del(q.id)}/>)}</div>
      }

      {/* OCR Modal */}
      <Modal show={showOCR} onClose={()=>setShowOCR(false)} title={`📷 ${ocrQs.length} سؤال`} maxWidth={700}>
        <div style={{display:"flex",flexDirection:"column",gap:13}}>
          <div style={{padding:"9px 13px",borderRadius:9,background:C.successSoft,border:`1px solid rgba(111,207,151,.3)`,fontSize:13,color:C.success}}>✅ راجعي الأسئلة وعدّلي إجاباتك قبل الحفظ</div>
          {ocrQs.map((q,qi)=>(
            <div key={qi} style={{padding:13,borderRadius:11,background:C.surface,border:`1px solid ${q.selected?C.accent:C.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
                <div style={{display:"flex",gap:7,alignItems:"center"}}>
                  <input type="checkbox" checked={q.selected} onChange={e=>{const n=[...ocrQs];n[qi].selected=e.target.checked;setOcrQs(n);}} style={{width:15,height:15,accentColor:C.accent}}/>
                  <Badge color={q.type==="mcq"?"accent":"gold"}>{q.type==="mcq"?"MCQ":"مقالي"}</Badge>
                  <span style={{fontSize:11,color:C.muted}}>س {qi+1}</span>
                </div>
              </div>
              <textarea value={q.question} onChange={e=>{const n=[...ocrQs];n[qi].question=e.target.value;setOcrQs(n);}} rows={2} style={{marginBottom:9,fontSize:12}}/>
              {q.type==="mcq"&&(
                <div>
                  <div style={{fontSize:11,color:C.muted,marginBottom:5}}>✋ إجابتي | ✅ الصحيحة</div>
                  {q.choices.map((ch,ci)=>(
                    <div key={ci} style={{display:"flex",gap:5,marginBottom:5,alignItems:"center"}}>
                      <span style={{color:C.muted,fontSize:11,width:16,flexShrink:0}}>{["أ","ب","ج","د"][ci]}</span>
                      <input value={ch} onChange={e=>{const n=[...ocrQs];n[qi].choices[ci]=e.target.value;setOcrQs(n);}} style={{fontSize:12,padding:"5px 9px",flex:1,background:q.selAns===ci?C.dangerSoft:q.corAns===ci?C.successSoft:C.card,borderColor:q.selAns===ci?C.danger:q.corAns===ci?C.success:C.border}}/>
                      <button onClick={()=>{const n=[...ocrQs];n[qi].selAns=q.selAns===ci?null:ci;setOcrQs(n);}} style={{width:28,height:28,borderRadius:7,background:q.selAns===ci?C.dangerSoft:C.card,border:`1px solid ${q.selAns===ci?C.danger:C.border}`,flexShrink:0}}>✋</button>
                      <button onClick={()=>{const n=[...ocrQs];n[qi].corAns=q.corAns===ci?null:ci;setOcrQs(n);}} style={{width:28,height:28,borderRadius:7,background:q.corAns===ci?C.successSoft:C.card,border:`1px solid ${q.corAns===ci?C.success:C.border}`,flexShrink:0}}>✅</button>
                    </div>
                  ))}
                </div>
              )}
              <input value={q.note} onChange={e=>{const n=[...ocrQs];n[qi].note=e.target.value;setOcrQs(n);}} placeholder="💡 سبب الخطأ (اختياري)..." style={{fontSize:12,padding:"5px 9px",marginTop:7}}/>
            </div>
          ))}
          <div style={{display:"flex",gap:9,justifyContent:"flex-end",borderTop:`1px solid ${C.border}`,paddingTop:13}}>
            <Btn variant="secondary" onClick={()=>setShowOCR(false)}>إلغاء</Btn>
            <Btn onClick={saveOCR} disabled={loading} variant="gold">{loading?"جاري الحفظ...":"✅ حفظ المحدد"}</Btn>
          </div>
        </div>
      </Modal>

      {/* Add Question Modal */}
      <Modal show={show} onClose={()=>setShow(false)} title="➕ سؤال جديد">
        <div style={{display:"flex",flexDirection:"column",gap:13}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[{v:"mcq",l:"🔘 اختيار متعدد",d:"صح/غلط بين الاختيارات"},{v:"essay",l:"✍️ مقالي",d:"إجابة مفتوحة"}].map(t=>(
              <button key={t.v} onClick={()=>setType(t.v)} style={{padding:"9px 11px",borderRadius:11,fontFamily:"'Cairo',sans-serif",textAlign:"right",background:type===t.v?C.accentSoft:C.surface,border:`2px solid ${type===t.v?C.accent:C.border}`}}>
                <div style={{fontWeight:800,fontSize:13,color:type===t.v?C.accent:C.text}}>{t.l}</div>
                <div style={{fontSize:10,color:C.muted,marginTop:1}}>{t.d}</div>
              </button>
            ))}
          </div>
          <textarea value={qText} onChange={e=>setQText(e.target.value)} rows={3} placeholder="نص السؤال..."/>
          {type==="mcq"&&(
            <div>
              <label style={{fontSize:12,color:C.muted,display:"block",marginBottom:7}}>الاختيارات</label>
              {choices.map((ch,i)=>(
                <div key={i} style={{marginBottom:9}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                    <span style={{width:22,height:22,borderRadius:6,background:C.surface,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:C.muted,flexShrink:0,fontWeight:700}}>{["أ","ب","ج","د"][i]}</span>
                    <input value={ch} onChange={e=>{const n=[...choices];n[i]=e.target.value;setChoices(n);}} placeholder={"الاختيار "+["أ","ب","ج","د"][i]+"..."} style={{flex:1,background:selAns===i?C.dangerSoft:corAns===i?C.successSoft:C.surface,borderColor:selAns===i?C.danger:corAns===i?C.success:C.border}}/>
                  </div>
                  <div style={{display:"flex",gap:6,paddingRight:28}}>
                    <button onClick={()=>setSelAns(selAns===i?null:i)} style={{flex:1,padding:"5px",borderRadius:7,fontFamily:"'Cairo',sans-serif",fontSize:11,fontWeight:700,background:selAns===i?C.dangerSoft:C.surface,border:`1px solid ${selAns===i?C.danger:C.border}`,color:selAns===i?C.danger:C.muted}}>✋ {selAns===i?"إجابتي ✓":"إجابتي"}</button>
                    <button onClick={()=>setCorAns(corAns===i?null:i)} style={{flex:1,padding:"5px",borderRadius:7,fontFamily:"'Cairo',sans-serif",fontSize:11,fontWeight:700,background:corAns===i?C.successSoft:C.surface,border:`1px solid ${corAns===i?C.success:C.border}`,color:corAns===i?C.success:C.muted}}>✅ {corAns===i?"الصحيحة ✓":"الصحيحة"}</button>
                  </div>
                </div>
              ))}
              {selAns!==null&&corAns!==null&&(
                <div style={{padding:"9px 13px",borderRadius:9,background:selAns===corAns?C.successSoft:C.dangerSoft,border:`1px solid ${selAns===corAns?"rgba(111,207,151,.4)":"rgba(235,87,87,.4)"}`,fontSize:13,fontWeight:700,color:selAns===corAns?C.success:C.danger,textAlign:"center"}}>
                  {selAns===corAns?"🎉 إجابة صحيحة!":"❌ إجابة خاطئة — هيتسجل كخطأ للمراجعة"}
                </div>
              )}
            </div>
          )}
          {type==="essay"&&(
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              <div><label style={{fontSize:12,color:C.danger,display:"block",marginBottom:5,fontWeight:600}}>✋ إجابتي الخاطئة</label><textarea value={essAns} onChange={e=>setEssAns(e.target.value)} rows={2} placeholder="إجابتك اللي كانت غلط..."/></div>
              <div><label style={{fontSize:12,color:C.success,display:"block",marginBottom:5,fontWeight:600}}>✅ الإجابة الصحيحة</label><textarea value={essCor} onChange={e=>setEssCor(e.target.value)} rows={2} placeholder="الإجابة الصحيحة..."/></div>
            </div>
          )}
          <div><label style={{fontSize:12,color:C.gold,display:"block",marginBottom:5,fontWeight:600}}>💡 سبب الخطأ (اختياري)</label><input value={note} onChange={e=>setNote(e.target.value)} placeholder="مثل: خلطت بين مفهومين..."/></div>
          <div style={{display:"flex",gap:8}}>
            <Btn variant="secondary" onClick={()=>setShow(false)} style={{flex:1,justifyContent:"center"}}>إلغاء</Btn>
            <Btn onClick={save} disabled={loading} style={{flex:2,justifyContent:"center"}}>{loading?<><span className="spinner" style={{width:13,height:13}}/> جاري الحفظ...</>:"✅ حفظ السؤال"}</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ===
// ERRORS REVIEW = ====== === =====
// ===
function ErrorsReview({ questions, subjects, setQuestions }) {
  const [filterSubject, setFilterSubject] = useState("all");
  const [search, setSearch]               = useState("");
  const [openGroups, setOpenGroups]       = useState({});
  const [sortBy, setSortBy]               = useState("worst");

  const allWrong = questions.filter(q=>!q.isCorrect);
  const filtered = allWrong.filter(q=>
    (filterSubject==="all"||q.subjectId===filterSubject) &&
    (!search||q.question?.includes(search)||q.note?.includes(search)||q.lessonName?.includes(search))
  );

  // ===== === ====+===
  const grouped = {};
  filtered.forEach(q=>{
    const key = (q.subjectId||"?")+"|"+(q.lessonId||"?");
    if (!grouped[key]) grouped[key]={subjectName:q.subjectName||"؟",subjectIcon:subjects.find(s=>s.id===q.subjectId)?.icon||"📚",lessonName:q.lessonName||"؟",qs:[]};
    grouped[key].qs.push(q);
  });
  let groups = Object.entries(grouped);
  if (sortBy==="worst")  groups.sort((a,b)=>b[1].qs.length-a[1].qs.length);
  if (sortBy==="alpha")  groups.sort((a,b)=>a[1].subjectName.localeCompare(b[1].subjectName,"ar"));
  if (sortBy==="newest") groups.sort((a,b)=>(b[1].qs[0]?.createdAt?.toDate?.()?.getTime()||0)-(a[1].qs[0]?.createdAt?.toDate?.()?.getTime()||0));

  const markUnderstood = async q=>{
    const upd={isCorrect:true,wasWrong:true,correctStreak:(q.correctStreak||0)+3,wrongStreak:0,totalCorrect:(q.totalCorrect||0)+1,totalAttempts:(q.totalAttempts||0)+1};
    await updateDoc(doc(db,"questions",q.id),upd);
    setQuestions(p=>p.map(x=>x.id===q.id?{...x,...upd}:x));
    toast("✅ تم تسجيله كمفهوم!","success");
  };

  const markGroup = async qs=>{ for(const q of qs) await markUnderstood(q); toast(`✅ أتقنتِ ${qs.length} سؤال في الدرس ده!`); };

  const del = async id=>{ await deleteDoc(doc(db,"questions",id)); setQuestions(p=>p.filter(q=>q.id!==id)); toast("تم الحذف","info"); };

  return (
    <div className="fade">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13,flexWrap:"wrap",gap:8}}>
        <h2 style={{fontSize:18,fontWeight:800}}>❌ مراجعة الأخطاء</h2>
        <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
          <select value={filterSubject} onChange={e=>setFilterSubject(e.target.value)} style={{width:"auto",minWidth:100,fontSize:12,padding:"5px 9px"}}>
            <option value="all">كل المواد ({allWrong.length})</option>
            {subjects.map(s=>{const cnt=allWrong.filter(q=>q.subjectId===s.id).length;return cnt>0?<option key={s.id} value={s.id}>{s.icon} {s.name} ({cnt})</option>:null;})}
          </select>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{width:"auto",fontSize:12,padding:"5px 9px"}}>
            <option value="worst">الأكثر أخطاء</option>
            <option value="newest">الأحدث</option>
            <option value="alpha">أبجدي</option>
          </select>
        </div>
      </div>
      <Search value={search} onChange={setSearch} placeholder="ابحثي في الأخطاء..."/>

      {/* Stats pills */}
      {filtered.length>0&&(
        <div style={{display:"flex",gap:7,marginBottom:13,flexWrap:"wrap"}}>
          {[{l:`${filtered.length} خطأ`,c:C.danger,bg:C.dangerSoft},{l:`${groups.length} درس`,c:C.warning,bg:C.warningSoft},{l:`${questions.filter(q=>(q.correctStreak||0)>=3).length} أتقنتِه 🏆`,c:C.success,bg:C.successSoft}].map((s,i)=>(
            <div key={i} style={{padding:"4px 11px",borderRadius:20,background:s.bg,border:`1px solid ${s.c}33`,fontSize:12,fontWeight:700,color:s.c}}>{s.l}</div>
          ))}
        </div>
      )}

      {filtered.length===0
        ?<Card style={{textAlign:"center",padding:46}}><div style={{fontSize:42,marginBottom:8}}>🎉</div><div style={{fontSize:15,fontWeight:700,color:C.success}}>{search?"لا نتائج":"لا أخطاء — عظيمة يا مها! 🌸"}</div></Card>
        :<div style={{display:"flex",flexDirection:"column",gap:9}}>
          {groups.map(([key,grp])=>{
            const isOpen = openGroups[key]??true;
            const urgent = grp.qs.filter(q=>(q.wrongStreak||0)>=3).length;
            return (
              <div key={key} style={{borderRadius:13,border:`1px solid ${C.border}`,overflow:"hidden",background:C.card}}>
                <div onClick={()=>setOpenGroups(p=>({...p,[key]:!p[key]}))} style={{display:"flex",alignItems:"center",gap:9,padding:"11px 13px",cursor:"pointer",userSelect:"none"}}>
                  <span style={{fontSize:17,flexShrink:0}}>{grp.subjectIcon}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:11,color:C.muted,marginBottom:1}}>{grp.subjectName}</div>
                    <div style={{fontSize:13,fontWeight:800,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{grp.lessonName}</div>
                  </div>
                  <div style={{display:"flex",gap:5,alignItems:"center",flexShrink:0}}>
                    {urgent>0&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:9,background:C.dangerSoft,color:C.danger,border:`1px solid rgba(235,87,87,.3)`,fontWeight:700}}>{urgent} صعب</span>}
                    <span style={{fontSize:11,padding:"2px 8px",borderRadius:9,background:C.surface,color:C.muted,fontWeight:700}}>{grp.qs.length} خطأ</span>
                    <Btn variant="success" onClick={e=>{e.stopPropagation();markGroup(grp.qs);}} style={{fontSize:10,padding:"2px 8px"}}>✅ كلها فهمتِه</Btn>
                    <span style={{color:C.dim,fontSize:13,transition:"transform .2s",transform:isOpen?"rotate(90deg)":"rotate(0deg)"}}>›</span>
                  </div>
                </div>
                {isOpen&&(
                  <div style={{borderTop:`1px solid ${C.border}`,padding:"9px 11px",display:"flex",flexDirection:"column",gap:9}}>
                    {grp.qs.map(q=>(
                      <div key={q.id}>
                        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:4}}>
                          <Btn variant="success" onClick={()=>markUnderstood(q)} style={{fontSize:10,padding:"2px 8px"}}>✅ فهمتِه</Btn>
                        </div>
                        <QCard q={q} onDelete={()=>del(q.id)}/>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      }
    </div>
  );
}

// ===
// QUIZ = MCQ + ===== + Timer
// ===
// ===
// STUDY = ====== ==== (Quiz + Flash Cards ======)
// ===
function Study({ questions, setQuestions, subjects, lessons }) {
  const [mode,         setMode]         = useState(null); // null | "quiz" | "flash"
  const [filterSubject,setFilterSubject]= useState("all");
  const [filterLesson, setFilterLesson] = useState("all");
  const [filterType,   setFilterType]   = useState("wrong");
  const [filterQType,  setFilterQType]  = useState("all");
  const [cnt,          setCnt]          = useState(10);
  const [timerOn,      setTimerOn]      = useState(false);
  const [timerMin,     setTimerMin]     = useState(10);

  // Session state
  const [qs,        setQs]        = useState([]);
  const [cur,       setCur]       = useState(0);
  const [sel,       setSel]       = useState(null);
  const [essayInput,setEssayInput]= useState("");
  const [showAns,   setShowAns]   = useState(false);
  const [flipped,   setFlipped]   = useState(false);
  const [results,   setResults]   = useState([]);
  const [done,      setDone]      = useState(false);
  const [started,   setStarted]   = useState(false);
  const [timeLeft,  setTimeLeft]  = useState(null);
  const [stats,     setStats]     = useState({correct:0,wrong:0});
  const timerRef = useRef();

  const filteredLessons = lessons.filter(l=>filterSubject==="all"||l.subjectId===filterSubject);

  const getPool = () => {
    let pool = questions.filter(q => {
      const okMCQ   = q.type==="mcq" && q.choices?.filter(c=>c).length>=2;
      const okEssay = q.type==="essay";
      if (filterQType==="mcq")   return okMCQ;
      if (filterQType==="essay") return okEssay;
      return okMCQ || okEssay;
    });
    if (filterSubject!=="all") pool=pool.filter(q=>q.subjectId===filterSubject);
    if (filterLesson!=="all")  pool=pool.filter(q=>q.lessonId===filterLesson);
    if (filterType==="wrong")      pool=pool.filter(q=>!q.isCorrect);
    if (filterType==="struggling") pool=pool.filter(q=>!q.isCorrect&&(q.wrongStreak||0)>=2);
    if (filterType==="mastered")   pool=pool.filter(q=>(q.correctStreak||0)>=3||(q.isCorrect&&q.wasWrong));
    if (filterType==="wasWrong")   pool=pool.filter(q=>q.wasWrong===true);
    return pool;
  };
  const pool = getPool();

  useEffect(()=>{
    if (!started||!timerOn||mode!=="quiz") return;
    timerRef.current = setInterval(()=>setTimeLeft(t=>{
      if(t<=1){clearInterval(timerRef.current);setDone(true);return 0;}
      return t-1;
    }),1000);
    return ()=>clearInterval(timerRef.current);
  },[started,timerOn,mode]);

  const start = (m) => {
    clearInterval(timerRef.current);
    const sorted = [...pool].sort((a,b)=>(b.wrongStreak||0)-(a.wrongStreak||0));
    const picked = sorted.slice(0, Math.min(cnt, sorted.length));
    setQs(picked); setCur(0); setSel(null); setEssayInput(""); setShowAns(false);
    setFlipped(false); setResults([]); setDone(false); setStats({correct:0,wrong:0});
    setMode(m); setStarted(true);
    if(m==="quiz"&&timerOn) setTimeLeft(timerMin*60);
  };

  const updateQ = async (q, correct) => {
    const newCorrectStreak = correct ? (q.correctStreak||0)+1 : 0;
    const upd = {
      totalAttempts:  (q.totalAttempts||0)+1,
      totalCorrect:   correct?(q.totalCorrect||0)+1:(q.totalCorrect||0),
      correctStreak:  newCorrectStreak,
      wrongStreak:    correct?0:(q.wrongStreak||0)+1,
      wasWrong:       q.wasWrong || !correct, // يتحفظ لو غلطت مرة واحدة على الأقل
      isCorrect:      correct ? newCorrectStreak >= 3 || q.isCorrect : false,
    };
    try{await updateDoc(doc(db,"questions",q.id),upd);}catch(_){}
    const uq={...q,...upd};
    setQs(prev=>prev.map((x,i)=>i===cur?uq:x));
    if(setQuestions)setQuestions(prev=>prev.map(x=>x.id===q.id?uq:x));
    return uq;
  };

  const next = async (forceCorrect=null) => {
    const q = qs[cur];
    const correct = forceCorrect!==null ? forceCorrect : (q.type==="mcq" ? sel===q.correctAnswer : false);
    const uq = await updateQ(q, correct);
    const nr = [...results, {correct, q:uq, essayAnswer:essayInput}];
    setResults(nr);
    setStats(s=>({correct:s.correct+(correct?1:0), wrong:s.wrong+(correct?0:1)}));
    if(cur+1>=qs.length){clearInterval(timerRef.current);setDone(true);}
    else{setCur(c=>c+1);setSel(null);setEssayInput("");setShowAns(false);setFlipped(false);}
  };

  const reset = () => { setStarted(false); setMode(null); setDone(false); };

  // -- Setup Screen --
  if (!started) return (
    <div className="fade">
      <h2 style={{fontSize:18,fontWeight:800,marginBottom:16}}>📖 المذاكرة</h2>

      {/* Mode selector */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        <button onClick={()=>setMode(m=>m==="quiz"?null:"quiz")}
          style={{padding:"16px 12px",borderRadius:14,fontFamily:"'Cairo',sans-serif",textAlign:"center",
            background:mode==="quiz"?C.accentSoft:C.card,
            border:`2px solid ${mode==="quiz"?C.accent:C.border}`,transition:"all .2s"}}>
          <div style={{fontSize:28,marginBottom:6}}>🧪</div>
          <div style={{fontSize:13,fontWeight:800,color:mode==="quiz"?C.accent:C.text}}>اختبار</div>
          <div style={{fontSize:11,color:C.muted,marginTop:3}}>MCQ تلقائي</div>
        </button>
        <button onClick={()=>setMode(m=>m==="flash"?null:"flash")}
          style={{padding:"16px 12px",borderRadius:14,fontFamily:"'Cairo',sans-serif",textAlign:"center",
            background:mode==="flash"?C.purpleSoft:C.card,
            border:`2px solid ${mode==="flash"?C.purple:C.border}`,transition:"all .2s"}}>
          <div style={{fontSize:28,marginBottom:6}}>🎴</div>
          <div style={{fontSize:13,fontWeight:800,color:mode==="flash"?C.purple:C.text}}>Flash Cards</div>
          <div style={{fontSize:11,color:C.muted,marginTop:3}}>قيّمي نفسك</div>
        </button>
      </div>

      {/* Filters */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:14,marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:700,color:C.muted,marginBottom:10}}>⚙️ الفلاتر</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div>
              <label style={{fontSize:11,color:C.muted,display:"block",marginBottom:4}}>المادة</label>
              <select value={filterSubject} onChange={e=>{setFilterSubject(e.target.value);setFilterLesson("all");}} style={{fontSize:12}}>
                <option value="all">كل المواد</option>
                {subjects.map(s=><option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:11,color:C.muted,display:"block",marginBottom:4}}>الدرس</label>
              <select value={filterLesson} onChange={e=>setFilterLesson(e.target.value)} disabled={filterSubject==="all"} style={{fontSize:12}}>
                <option value="all">كل الدروس</option>
                {filteredLessons.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={{fontSize:11,color:C.muted,display:"block",marginBottom:4}}>نوع الأسئلة</label>
            <div style={{display:"flex",gap:5}}>
              {[{v:"all",l:"📝 الكل"},{v:"mcq",l:"🔘 MCQ"},{v:"essay",l:"✍️ مقالي"}].map(t=>(
                <button key={t.v} onClick={()=>setFilterQType(t.v)} style={{flex:1,padding:"6px 3px",borderRadius:8,fontWeight:700,fontSize:11,background:filterQType===t.v?C.accentSoft:C.surface,border:`2px solid ${filterQType===t.v?C.accent:C.border}`,color:filterQType===t.v?C.accent:C.muted}}>{t.l}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={{fontSize:11,color:C.muted,display:"block",marginBottom:4}}>مصدر</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {[{v:"wrong",l:"❌ أخطائي",c:C.danger},{v:"struggling",l:"🔴 الصعبة",c:C.warning},{v:"mastered",l:"🏆 أتقنته",c:C.purple},{v:"wasWrong",l:"📖 تاريخي",c:C.gold},{v:"all",l:"📚 الكل",c:C.accent}].map(t=>(
                <button key={t.v} onClick={()=>setFilterType(t.v)} style={{flex:"1 1 calc(33% - 4px)",padding:"5px 3px",borderRadius:8,fontWeight:700,fontSize:11,background:filterType===t.v?`${t.c}22`:C.surface,border:`2px solid ${filterType===t.v?t.c:C.border}`,color:filterType===t.v?t.c:C.muted}}>{t.l}</button>
              ))}
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div>
              <label style={{fontSize:11,color:C.muted,display:"block",marginBottom:4}}>عدد الأسئلة: {Math.min(cnt,pool.length)}</label>
              <select value={cnt} onChange={e=>setCnt(+e.target.value)} style={{fontSize:12}}>
                {[5,10,15,20,30].map(n=><option key={n} value={n} disabled={n>pool.length}>{n}</option>)}
              </select>
            </div>
            {mode==="quiz"&&(
              <div style={{display:"flex",alignItems:"flex-end",gap:8,paddingBottom:2}}>
                <button onClick={()=>setTimerOn(o=>!o)} style={{width:34,height:20,borderRadius:10,background:timerOn?C.warning:C.border,border:"none",position:"relative",transition:"all .2s",flexShrink:0}}>
                  <span style={{position:"absolute",top:2,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"all .2s",left:timerOn?16:2}}/>
                </button>
                <span style={{fontSize:11,color:timerOn?C.warning:C.muted,fontWeight:700}}>⏱</span>
                {timerOn&&<select value={timerMin} onChange={e=>setTimerMin(+e.target.value)} style={{fontSize:11,padding:"3px 6px",width:"auto"}}>
                  {[5,10,15,20,30].map(n=><option key={n} value={n}>{n}د</option>)}
                </select>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Start */}
      {pool.length===0
        ?<Card style={{textAlign:"center",padding:36}}><div style={{color:C.muted,fontSize:14}}>لا توجد أسئلة بهذه الفلاتر 🌸</div></Card>
        :<div style={{textAlign:"center"}}>
          <div style={{fontSize:12,color:C.muted,marginBottom:14}}>{pool.length} سؤال متاح</div>
          {mode ? (
            <Btn onClick={()=>start(mode)} variant={mode==="quiz"?"primary":"purple"} style={{fontSize:15,padding:"13px 28px"}}>
              {mode==="quiz"?"🧪 ابدئي الاختبار":"🎴 ابدئي Flash Cards"}
            </Btn>
          ) : (
            <div style={{color:C.muted,fontSize:13}}>اختاري نظام المذاكرة أعلاه أولاً</div>
          )}
        </div>
      }
    </div>
  );

  // -- Results Screen --
  if (done) {
    const mcqR = results.filter(r=>r.q.type==="mcq");
    const score = mcqR.filter(r=>r.correct).length;
    const newMastered = results.filter(r=>r.correct&&(r.q.correctStreak||0)>=3).length;
    return (
      <div className="fade" style={{textAlign:"center",padding:"18px 0"}}>
        <div style={{fontSize:50,marginBottom:10}}>{score===mcqR.length&&mcqR.length>0?"🏆":stats.correct>stats.wrong?"👏":"💪"}</div>
        {mcqR.length>0&&<h2 style={{fontSize:24,fontWeight:900,color:C.accent,marginBottom:4}}>{score} / {mcqR.length}</h2>}
        {mode==="flash"&&<h2 style={{fontSize:24,fontWeight:900,color:C.purple,marginBottom:4}}>{stats.correct} ✅ · {stats.wrong} ❌</h2>}
        {results.filter(r=>r.q.type==="essay").length>0&&<p style={{color:C.muted,fontSize:13}}>+ {results.filter(r=>r.q.type==="essay").length} مقالي</p>}
        {newMastered>0&&<p style={{color:C.success,fontSize:13,marginTop:6}}>🏆 أتقنتِ {newMastered} جديد!</p>}
        <div style={{textAlign:"right",margin:"14px 0",maxHeight:260,overflowY:"auto"}}>
          {results.map((r,i)=>(
            <div key={i} style={{display:"flex",gap:8,alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
              <span style={{fontSize:13,flexShrink:0}}>{r.q.type==="essay"?"✍️":r.correct?"✅":"❌"}</span>
              <span style={{fontSize:12,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.q.question?.slice(0,60)}</span>
              {getUnderstandingLevel(r.q).level==="mastered"&&<Badge color="success">أتقنتِه!</Badge>}
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:9,justifyContent:"center"}}>
          <Btn onClick={()=>start(mode)}>🔄 إعادة</Btn>
          <Btn variant="secondary" onClick={reset}>← رجوع</Btn>
        </div>
      </div>
    );
  }

  // -- Question Screen --
  const q = qs[cur];
  const u = getUnderstandingLevel(q);
  const progress = ((cur+1)/qs.length)*100;

  return (
    <div className="fade">
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={reset} style={{background:C.surface,border:`1px solid ${C.border}`,color:C.muted,borderRadius:8,padding:"4px 9px",fontSize:12,fontFamily:"'Cairo',sans-serif"}}>✕</button>
          <span style={{fontSize:13,fontWeight:700,color:mode==="quiz"?C.accent:C.purple}}>{mode==="quiz"?"🧪 اختبار":"🎴 Flash Cards"}</span>
        </div>
        <div style={{display:"flex",gap:7,alignItems:"center"}}>
          {mode==="quiz"&&timerOn&&timeLeft!==null&&(
            <span style={{fontSize:12,fontWeight:800,color:timeLeft<60?C.danger:timeLeft<180?C.warning:C.success,background:timeLeft<60?C.dangerSoft:timeLeft<180?C.warningSoft:C.successSoft,padding:"3px 9px",borderRadius:9}}>
              ⏱ {formatTime(timeLeft)}
            </span>
          )}
          <span style={{fontSize:11,color:u.color}}>{u.icon}</span>
          <Badge color={mode==="quiz"?"accent":"purple"}>{cur+1}/{qs.length}</Badge>
        </div>
      </div>

      {/* Progress */}
      <div style={{height:4,background:C.surface,borderRadius:10,marginBottom:14,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${progress}%`,background:mode==="quiz"?`linear-gradient(90deg,${C.accent},${C.gold})`:`linear-gradient(90deg,${C.purple},${C.accent})`,transition:"width .4s"}}/>
      </div>

      {q.subjectName&&<div style={{fontSize:11,color:C.dim,marginBottom:7}}>📚 {q.subjectName} — 📖 {q.lessonName}</div>}

      {/* == QUIZ MODE == */}
      {mode==="quiz"&&(
        <>
          <Card style={{marginBottom:12}}>
            <div style={{fontSize:14,fontWeight:600,lineHeight:1.8}}>{q.question}</div>
            {q.note&&<div style={{marginTop:7,fontSize:12,color:C.gold,padding:"4px 9px",background:C.goldSoft,borderRadius:7}}>💡 {q.note}</div>}
          </Card>

          {q.type==="mcq"&&(
            <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:12}}>
              {q.choices.filter(c=>c).map((ch,ci)=>{
                let bg=C.surface,border=C.border,col=C.text;
                if(showAns){if(ci===q.correctAnswer){bg=C.successSoft;border=C.success;col=C.success;}else if(ci===sel&&sel!==q.correctAnswer){bg=C.dangerSoft;border=C.danger;col=C.danger;}}
                else if(sel===ci){bg=C.accentSoft;border=C.accent;col=C.accent;}
                return <button key={ci} onClick={()=>!showAns&&setSel(ci)} style={{padding:"10px 13px",borderRadius:10,textAlign:"right",fontSize:13,fontWeight:600,background:bg,border:`2px solid ${border}`,color:col,transition:"all .2s",width:"100%"}}>
                  <span style={{marginLeft:6,opacity:.5}}>{["أ","ب","ج","د"][ci]}</span>{ch}
                </button>;
              })}
              {!showAns
                ?<Btn onClick={()=>sel!==null&&setShowAns(true)} disabled={sel===null} style={{width:"100%",padding:11,justifyContent:"center"}}>تأكيد</Btn>
                :<Btn onClick={()=>next()} style={{width:"100%",padding:11,justifyContent:"center"}} variant={sel===q.correctAnswer?"success":"danger"}>
                  {sel===q.correctAnswer?"✅ صح! التالي →":"❌ غلط! التالي →"}
                </Btn>
              }
            </div>
          )}

          {q.type==="essay"&&(
            <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:12}}>
              {!showAns?(
                <><textarea value={essayInput} onChange={e=>setEssayInput(e.target.value)} rows={3} placeholder="اكتبي إجابتك..." style={{resize:"none"}}/>
                <Btn onClick={()=>setShowAns(true)} style={{width:"100%",padding:11,justifyContent:"center"}}>👁 اعرضي الإجابة</Btn></>
              ):(
                <>
                  {essayInput&&<div style={{padding:"8px 12px",borderRadius:9,background:C.dangerSoft,fontSize:13}}><b style={{color:C.danger}}>إجابتك: </b>{essayInput}</div>}
                  <div style={{padding:"8px 12px",borderRadius:9,background:C.successSoft,fontSize:13}}><b style={{color:C.success}}>✅ الصحيحة: </b>{q.essayCorrect||"—"}</div>
                  <div style={{display:"flex",gap:8}}>
                    <Btn onClick={()=>next(true)}  variant="success" style={{flex:1,justifyContent:"center",padding:10}}>✅ كنت صح</Btn>
                    <Btn onClick={()=>next(false)} variant="danger"  style={{flex:1,justifyContent:"center",padding:10}}>❌ كنت غلط</Btn>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* == FLASH CARD MODE == */}
      {mode==="flash"&&(
        <>
          <div onClick={()=>setFlipped(f=>!f)}
            style={{minHeight:190,borderRadius:16,padding:"22px 18px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",textAlign:"center",
              background:flipped?C.successSoft:C.card,
              border:`2px solid ${flipped?C.success:C.border}`,
              transition:"all .3s",marginBottom:14,userSelect:"none"}}>
            {!flipped?(
              <>
                <div style={{fontSize:11,color:C.muted,marginBottom:10,padding:"2px 9px",background:C.surface,borderRadius:7}}>السؤال — اضغطي للإجابة 👆</div>
                <div style={{fontSize:15,fontWeight:700,lineHeight:1.9}}>{q.question}</div>
                {q.note&&<div style={{marginTop:10,fontSize:12,color:C.gold,padding:"4px 9px",background:C.goldSoft,borderRadius:7}}>💡 {q.note}</div>}
              </>
            ):(
              <>
                <div style={{fontSize:11,color:C.success,marginBottom:10,padding:"2px 9px",background:C.successSoft,borderRadius:7}}>الإجابة ✅</div>
                <div style={{fontSize:15,fontWeight:800,color:C.success,lineHeight:1.8}}>
                  {q.type==="mcq"&&q.correctAnswer!=null&&q.choices?.[q.correctAnswer]
                    ?`${["أ","ب","ج","د"][q.correctAnswer]}. ${q.choices[q.correctAnswer]}`
                    :q.essayCorrect||"—"}
                </div>
                {q.type==="mcq"&&q.choices?.filter(c=>c).length>0&&(
                  <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:4,width:"100%",textAlign:"right"}}>
                    {q.choices.map((ch,ci)=>ch&&<div key={ci} style={{padding:"5px 9px",borderRadius:7,fontSize:12,background:q.correctAnswer===ci?C.successSoft:C.surface,border:`1px solid ${q.correctAnswer===ci?C.success:C.border}`,color:q.correctAnswer===ci?C.success:C.muted,fontWeight:q.correctAnswer===ci?800:400}}>
                      <span style={{marginLeft:5,opacity:.6}}>{["أ","ب","ج","د"][ci]}</span>{ch}
                    </div>)}
                  </div>
                )}
              </>
            )}
          </div>

          {!flipped
            ?<Btn onClick={()=>setFlipped(true)} style={{width:"100%",padding:12,justifyContent:"center",fontSize:14}}>👁 اعرضي الإجابة</Btn>
            :<div style={{display:"flex",gap:9}}>
              <Btn onClick={()=>next(false)} variant="danger"  style={{flex:1,justifyContent:"center",padding:12,fontSize:14}}>❌ كنت غلط</Btn>
              <Btn onClick={()=>next(true)}  variant="success" style={{flex:1,justifyContent:"center",padding:12,fontSize:14}}>✅ كنت صح</Btn>
            </div>
          }
          <div style={{textAlign:"center",marginTop:8}}>
            <button onClick={()=>{setCur(c=>c+1<qs.length?c+1:c);setFlipped(false);}} style={{background:"none",color:C.dim,fontSize:12,fontFamily:"'Cairo',sans-serif"}}>تخطي ←</button>
          </div>
        </>
      )}
    </div>
  );
}

// ===
// NOTES = == ===== + AI =====
// ===
function Notes({ subjects }) {
  const [notes,    setNotes]    = useState([]);
  const [text,     setText]     = useState("");
  const [subj,     setSubj]     = useState("");
  const [tag,      setTag]      = useState("عام");
  const [search,   setSearch]   = useState("");
  const [filterTag,setFilterTag]= useState("all");
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);
  const [aiLoading,setAiLoading]= useState(null);
  const [summaryModal,setSummaryModal]=useState(null);
  const [editNote, setEditNote] = useState(null);

  const TAGS = ["عام","مهم⭐","قاعدة","تعريف","مثال","خطأ شائع","للمراجعة"];
  const TAG_COLORS = {"مهم⭐":"gold","قاعدة":"purple","تعريف":"accent","مثال":"success","خطأ شائع":"danger","للمراجعة":"warning","عام":"muted"};

  useEffect(()=>{
    getDocs(query(collection(db,"notes"),orderBy("createdAt","desc")))
      .then(s=>{setNotes(s.docs.map(d=>({id:d.id,...d.data()})));setFetching(false);});
  },[]);

  const add = async()=>{
    if(!text.trim())return; setLoading(true);
    const data={text:text.trim(),subject:subj.trim(),tag,createdAt:new Date()};
    const r=await addDoc(collection(db,"notes"),data);
    setNotes(p=>[{id:r.id,...data},...p]); setText(""); setLoading(false);
    toast("تم حفظ الملاحظة 📓");
  };

  const saveEdit = async()=>{
    if(!editNote?.text.trim())return;
    await updateDoc(doc(db,"notes",editNote.id),{text:editNote.text.trim(),subject:editNote.subject,tag:editNote.tag});
    setNotes(p=>p.map(n=>n.id===editNote.id?{...n,...editNote}:n));
    setEditNote(null); toast("تم التعديل ✅");
  };

  const del = async id=>{
    await deleteDoc(doc(db,"notes",id));
    setNotes(p=>p.filter(n=>n.id!==id));
    toast("تم الحذف","info");
  };

  const summarize = async note=>{
    setAiLoading(note.id);
    try{
      const reply = await groqChat([
        {role:"system",content:"أنت مساعد دراسي ذكي. عند تلخيص الملاحظة:\n١. اكتب ملخص في ٢-٣ نقاط واضحة\n٢. استخرج الكلمات المفتاحية\n٣. اقترح سؤال مراجعة واحد عملي\nالرد باللغة العربية فقط وبصيغة Markdown."},
        {role:"user",content:`المادة: ${note.subject||"غير محدد"}\nالتصنيف: ${note.tag}\n\nالملاحظة:\n${note.text}`}
      ],600);
      setSummaryModal({note,reply});
    }catch(e){toast("خطأ في AI: "+e.message,"error");}
    setAiLoading(null);
  };

  const filtered = notes.filter(n=>
    (filterTag==="all"||n.tag===filterTag)&&(!search||(n.text.includes(search)||n.subject?.includes(search)))
  );

  return (
    <div className="fade">
      <h2 style={{fontSize:18,fontWeight:800,marginBottom:15}}>📓 ملاحظاتي</h2>

      <Modal show={!!summaryModal} onClose={()=>setSummaryModal(null)} title="🤖 ملخص ذكي">
        {summaryModal&&<div>
          <div style={{fontSize:11,color:C.muted,marginBottom:9,padding:"5px 9px",background:C.surface,borderRadius:7}}>📚 {summaryModal.note.subject||"بدون مادة"} — <Badge color={TAG_COLORS[summaryModal.note.tag]||"muted"}>{summaryModal.note.tag}</Badge></div>
          <div style={{fontSize:13,lineHeight:1.9}}>{renderMarkdown(summaryModal.reply)}</div>
        </div>}
      </Modal>

      <Modal show={!!editNote} onClose={()=>setEditNote(null)} title="✏️ تعديل الملاحظة">
        {editNote&&<div style={{display:"flex",flexDirection:"column",gap:11}}>
          <div style={{display:"flex",gap:8}}>
            <input value={editNote.subject} onChange={e=>setEditNote(p=>({...p,subject:e.target.value}))} placeholder="المادة..." style={{flex:1}}/>
            <select value={editNote.tag} onChange={e=>setEditNote(p=>({...p,tag:e.target.value}))} style={{width:"auto",minWidth:105}}>{TAGS.map(t=><option key={t} value={t}>{t}</option>)}</select>
          </div>
          <textarea value={editNote.text} onChange={e=>setEditNote(p=>({...p,text:e.target.value}))} rows={5}/>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <Btn variant="secondary" onClick={()=>setEditNote(null)}>إلغاء</Btn>
            <Btn onClick={saveEdit}>✅ حفظ التعديل</Btn>
          </div>
        </div>}
      </Modal>

      <Card style={{marginBottom:15}}>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          <div style={{display:"flex",gap:8}}>
            <input value={subj} onChange={e=>setSubj(e.target.value)} placeholder="المادة (اختياري)..." style={{flex:1}}/>
            <select value={tag} onChange={e=>setTag(e.target.value)} style={{width:"auto",minWidth:115}}>{TAGS.map(t=><option key={t} value={t}>{t}</option>)}</select>
          </div>
          <textarea value={text} onChange={e=>setText(e.target.value)} rows={3} placeholder="اكتبي ملاحظتك..." onKeyDown={e=>e.key==="Enter"&&e.ctrlKey&&add()}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:11,color:C.dim}}>Ctrl+Enter للحفظ</span>
            <Btn onClick={add} disabled={loading||!text.trim()}>{loading?"...":"✅ حفظ"}</Btn>
          </div>
        </div>
      </Card>

      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:11}}>
        <button onClick={()=>setFilterTag("all")} style={{padding:"4px 11px",borderRadius:18,fontSize:11,fontWeight:600,background:filterTag==="all"?C.accentSoft:C.surface,border:`1px solid ${filterTag==="all"?C.accent:C.border}`,color:filterTag==="all"?C.accent:C.muted}}>الكل ({notes.length})</button>
        {TAGS.map(t=>{const cnt=notes.filter(n=>n.tag===t).length;return cnt>0?<button key={t} onClick={()=>setFilterTag(t)} style={{padding:"4px 11px",borderRadius:18,fontSize:11,fontWeight:600,background:filterTag===t?C.accentSoft:C.surface,border:`1px solid ${filterTag===t?C.accent:C.border}`,color:filterTag===t?C.accent:C.muted}}>{t} ({cnt})</button>:null;})}
      </div>
      <Search value={search} onChange={setSearch} placeholder="ابحثي في الملاحظات..."/>

      {fetching?<div style={{textAlign:"center",padding:26}}><span className="spinner" style={{width:26,height:26}}/></div>:(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {filtered.map(n=>(
            <Card key={n.id}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",gap:5,marginBottom:6,flexWrap:"wrap",alignItems:"center"}}>
                    {n.subject&&<Badge color="accent">{n.subject}</Badge>}
                    <Badge color={TAG_COLORS[n.tag]||"muted"}>{n.tag||"عام"}</Badge>
                    <span style={{fontSize:10,color:C.dim,marginRight:"auto"}}>{n.createdAt?.toDate?.()?.toLocaleDateString("ar-EG")||""}</span>
                  </div>
                  <p style={{fontSize:13,lineHeight:1.8,whiteSpace:"pre-wrap"}}>{n.text}</p>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4,flexShrink:0}}>
                  <Btn variant="purple" onClick={()=>summarize(n)} disabled={!!aiLoading} style={{padding:"4px 8px",fontSize:12}}>{aiLoading===n.id?<span className="spinner" style={{width:11,height:11}}/>:"🤖"}</Btn>
                  <Btn variant="secondary" onClick={()=>setEditNote({id:n.id,text:n.text,subject:n.subject||"",tag:n.tag||"عام"})} style={{padding:"4px 8px",fontSize:12}}>✏️</Btn>
                  <Btn variant="danger" onClick={()=>del(n.id)} style={{padding:"4px 8px",fontSize:12}}>🗑️</Btn>
                </div>
              </div>
            </Card>
          ))}
          {filtered.length===0&&<div style={{textAlign:"center",padding:46}}><div style={{fontSize:38,marginBottom:8}}>📓</div><div style={{color:C.muted,fontSize:14}}>{search||filterTag!=="all"?"لا نتائج":"لا ملاحظات بعد!"}</div></div>}
        </div>
      )}
    </div>
  );
}

// ===
// STORY RECAP MODAL — يظهر على الموبايل فقط عند الفتح
// ===
const RECAP_CSS = `
  @keyframes rc-fade{from{opacity:0}to{opacity:1}}
  @keyframes rc-fadeout{from{opacity:1}to{opacity:0}}
  @keyframes rc-wordIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes rc-lineIn{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
  @keyframes rc-glow{0%,100%{opacity:.5}50%{opacity:1}}
  @keyframes rc-scanDown{from{top:-2px}to{top:100%}}
  @keyframes rc-bgPan{0%{background-position:50% 50%}100%{background-position:50% 60%}}
  @keyframes rc-vignIn{from{opacity:0}to{opacity:1}}
  @keyframes rc-barGrow{from{width:0%}to{width:var(--tw)}}
  @keyframes rc-ctaIn{from{opacity:0;transform:translateY(28px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes rc-orb{0%,100%{transform:translate(0px,0px)}33%{transform:translate(10px,-14px)}66%{transform:translate(-8px,8px)}}
  @keyframes rc-grainMove{0%{transform:translate(0,0)}100%{transform:translate(2%,2%)}}

  @keyframes wc-logoFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-8px) scale(1.04)}}
  @keyframes wc-glowPulse{0%,100%{opacity:.3;transform:scale(1)}50%{opacity:.7;transform:scale(1.1)}}
  @keyframes wc-titleSlide{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  @keyframes wc-subtitleFade{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes wc-featIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
  @keyframes wc-btnPulse{0%,100%{box-shadow:0 0 0 0 rgba(232,121,160,.4)}50%{box-shadow:0 0 0 12px rgba(232,121,160,0)}}
  @keyframes wc-particle{0%{transform:translateY(0) rotate(0deg);opacity:.6}100%{transform:translateY(-100vh) rotate(720deg);opacity:0}}
  @keyframes wc-shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
  @keyframes wc-ringExpand{from{transform:scale(0);opacity:.6}to{transform:scale(2.5);opacity:0}}
  @keyframes wc-curtainSplit{from{transform:scaleX(1)}to{transform:scaleX(0)}}

  @keyframes sp-popIn{0%{opacity:0;transform:scale(.5) rotate(-10deg)}70%{transform:scale(1.05) rotate(2deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
  @keyframes sp-glitter{0%,100%{opacity:0;transform:scale(0)}50%{opacity:1;transform:scale(1)}}
  @keyframes sp-confettiFall{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(80px) rotate(360deg);opacity:0}}
  @keyframes sp-textReveal{from{opacity:0;letter-spacing:8px}to{opacity:1;letter-spacing:.5px}}
  @keyframes sp-btnShine{0%{left:-100%}100%{left:200%}}
`;

// ─── Audio Engine — lazy init on first user tap ───────────────
let _audioCtx = null;

function getAudioCtx() {
  if (_audioCtx && _audioCtx.state !== "closed") return _audioCtx;
  try {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return _audioCtx;
  } catch(e) { return null; }
}

function playNote(freq, dur, vol, delay=0, type="sine") {
  const ctx = getAudioCtx(); if (!ctx) return;
  const now = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass"; lpf.frequency.value = 2400;
  osc.type = type; osc.frequency.value = freq;
  env.gain.setValueAtTime(0.0001, now);
  env.gain.linearRampToValueAtTime(vol, now + 0.05);
  env.gain.setValueAtTime(vol, now + dur * 0.55);
  env.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(lpf); lpf.connect(env); env.connect(ctx.destination);
  osc.start(now); osc.stop(now + dur + 0.05);
}

function playOpenChord() {
  const notes = [
    {f:146.83, v:0.09, d:4.5, t:"triangle"},
    {f:174.61, v:0.07, d:4.2, t:"triangle"},
    {f:220.00, v:0.06, d:4.0, t:"sine"},
    {f:293.66, v:0.05, d:3.8, t:"sine"},
    {f:130.81, v:0.11, d:5.0, t:"sine"},
  ];
  notes.forEach((n,i) => playNote(n.f, n.d, n.v, i*0.12, n.t));
}

function playShimmer() {
  playNote(1318, 0.5, 0.03, 0, "sine");
  playNote(1568, 0.4, 0.02, 0.04, "sine");
  playNote(2093, 0.3, 0.015, 0.08, "sine");
}

function playArp() {
  const scale = [293.66, 349.23, 392.0, 466.16, 523.25, 587.33, 698.46, 783.99];
  scale.forEach((f,i) => playNote(f, 0.8, 0.08, i*0.09, "sine"));
}

function playSwell() {
  const chord = [261.63, 329.63, 392.0, 523.25, 659.25];
  chord.forEach((f,i) => playNote(f, 2.2, 0.10-i*0.015, i*0.15, "sine"));
}

// ══ موسيقى مختلفة لكل قصة ══
// كل chapter بيها melody + bass + mood خاص بيها
const CHAPTER_MUSIC = {
  seed:   { melody:[293.66,349.23,261.63,329.63,293.66,246.94,261.63,293.66], bass:73.42,  bpm:55, type:"triangle", vol:0.07 }, // هادي ومبتدئ
  road:   { melody:[349.23,392.0,440.0,392.0,349.23,440.0,523.25,392.0],     bass:87.31,  bpm:62, type:"sine",     vol:0.08 }, // متفائل ومحفز
  ten:    { melody:[220.0,261.63,246.94,220.0,196.0,220.0,246.94,261.63],    bass:65.41,  bpm:50, type:"triangle", vol:0.07 }, // عميق وجدي
  mirror: { melody:[329.63,392.0,349.23,329.63,293.66,349.23,392.0,440.0],   bass:82.41,  bpm:58, type:"sine",     vol:0.08 }, // قوي ومؤثر
  fire:   { melody:[392.0,466.16,523.25,466.16,392.0,523.25,587.33,466.16],  bass:98.0,   bpm:68, type:"sawtooth", vol:0.06 }, // ناري ومتصاعد
  climb:  { melody:[349.23,440.0,392.0,349.23,392.0,466.16,440.0,392.0],     bass:87.31,  bpm:65, type:"sine",     vol:0.07 }, // نشيط ومتصاعد
  half:   { melody:[261.63,293.66,329.63,349.23,392.0,349.23,329.63,293.66], bass:65.41,  bpm:60, type:"triangle", vol:0.08 }, // تأملي متوازن
  roots:  { melody:[220.0,246.94,261.63,293.66,261.63,246.94,220.0,246.94],  bass:55.0,   bpm:52, type:"sine",     vol:0.07 }, // عميق وجذري
  voice:  { melody:[329.63,369.99,392.0,440.0,392.0,369.99,329.63,392.0],    bass:82.41,  bpm:60, type:"triangle", vol:0.08 }, // عاطفي ومؤثر
  crown:  { melody:[392.0,523.25,587.33,659.25,587.33,523.25,659.25,783.99], bass:98.0,   bpm:72, type:"sine",     vol:0.09 }, // انتصاري وملكي
};

let _loopTimer = null;
let _loopRunning = false;
let _currentChapterId = null;

function startMusicLoop(chapterId) {
  if (_loopRunning && _currentChapterId === chapterId) return;
  stopMusicLoop();
  _loopRunning = true;
  _currentChapterId = chapterId;
  const cfg = CHAPTER_MUSIC[chapterId] || CHAPTER_MUSIC.seed;
  const BEAT = 60 / cfg.bpm;
  let mIdx = 0;

  function tick() {
    if (!_loopRunning) return;
    // bass pulse — 2 per cycle
    playNote(cfg.bass,  0.35, cfg.vol*1.6, 0, "sine");
    playNote(cfg.bass,  0.25, cfg.vol*1.2, BEAT*2, "sine");
    // melody — 4 notes per cycle
    for (let i = 0; i < 4; i++) {
      const f = cfg.melody[mIdx % cfg.melody.length]; mIdx++;
      playNote(f,   0.85, cfg.vol, i*BEAT, cfg.type);
      playNote(f*2, 0.6,  cfg.vol*0.3, i*BEAT+0.01, "sine");
    }
    _loopTimer = setTimeout(tick, BEAT*4*1000);
  }
  tick();
}

function stopMusicLoop() {
  _loopRunning = false;
  _currentChapterId = null;
  clearTimeout(_loopTimer);
  _loopTimer = null;
}

// ══ Welcome Screen Music ══ (للشاشة الترحيبية)
function playWelcomeChord() {
  // Em chord — تجريبي وجميل للبداية
  const notes = [
    {f:164.81, v:0.08, d:5.0, t:"triangle"},
    {f:196.0,  v:0.07, d:4.5, t:"triangle"},
    {f:246.94, v:0.06, d:4.2, t:"sine"},
    {f:329.63, v:0.05, d:3.8, t:"sine"},
    {f:82.41,  v:0.12, d:5.5, t:"sine"},
  ];
  notes.forEach((n,i) => playNote(n.f, n.d, n.v, i*0.15, n.t));
}

// ══ Surprise Fanfare ══ (للمفاجآت)
function playSurpriseFanfare() {
  const fanfare = [523.25,659.25,783.99,1046.5,783.99,659.25,523.25];
  fanfare.forEach((f,i) => playNote(f, 0.4, 0.08, i*0.08, "sine"));
  setTimeout(()=>playSwell(), 800);
}

// ─── Cinematic Word Revealer ───────────────────────────────────

// ══════════════════════════════════════════════════════════
// WELCOME SCREEN — أول مرة تفتح التطبيق
// ══════════════════════════════════════════════════════════
function WelcomeScreen({ onDone }) {
  const [phase, setPhase] = useState("curtain"); // curtain | logo | features | cta
  const [featIdx, setFeatIdx] = useState(0);
  const [muted, setMuted] = useState(false);

  const features = [
    { icon:"📚", title:"سجّلي أخطاؤك", sub:"من أي مادة — لحظة بلحظة" },
    { icon:"🤖", title:"الأستاذ الذكي", sub:"يحللك ويشرح بأسلوبك" },
    { icon:"🏆", title:"قصص وإنجازات", sub:"كل خطوة بتفتح فصل جديد" },
    { icon:"🎯", title:"تتبع تقدمك", sub:"شوفي نمط أخطاؤك واحكميه" },
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("logo"), 600);
    const t2 = setTimeout(() => setPhase("features"), 1800);
    const t3 = setTimeout(() => setPhase("cta"), 3200);
    return () => [t1,t2,t3].forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase === "features") {
      let i = 0;
      const tick = () => {
        setFeatIdx(i);
        i++;
        if (i < features.length) setTimeout(tick, 350);
      };
      setTimeout(tick, 100);
    }
  }, [phase]);

  const handleStart = () => {
    playWelcomeChord();
    onDone();
  };

  // Particle config (stable)
  const particles = useRef(Array.from({length:16},(_,i)=>({
    x: (i*6.25)%100, size: 8+Math.random()*12,
    delay: Math.random()*4, dur: 4+Math.random()*5,
    shape: ["🌸","✦","⭐","◆","🌟","💫"][i%6],
    opacity: 0.3+Math.random()*0.4,
  }))).current;

  return createPortal(
    <>
      <style>{RECAP_CSS}</style>
      <div style={{
        position:"fixed", inset:0, zIndex:30000,
        background:"linear-gradient(160deg,#0D0610 0%,#120818 40%,#0A0A14 100%)",
        fontFamily:"'Cairo',sans-serif", direction:"rtl",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        overflow:"hidden",
      }}>
        {/* Ambient orbs */}
        <div style={{position:"absolute",top:"-20%",right:"-15%",width:"60vw",height:"60vw",borderRadius:"50%",
          background:"radial-gradient(circle,rgba(232,121,160,.12),transparent 70%)",
          animation:"rc-orb 10s ease-in-out infinite",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"-20%",left:"-10%",width:"50vw",height:"50vw",borderRadius:"50%",
          background:"radial-gradient(circle,rgba(180,142,245,.08),transparent 70%)",
          animation:"rc-orb 13s ease-in-out 3s infinite reverse",pointerEvents:"none"}}/>

        {/* Curtain split */}
        {phase === "curtain" && (
          <>
            <div style={{position:"absolute",top:0,left:0,right:0,bottom:"50%",background:"#08040E",zIndex:10,
              animation:"wc-curtainSplit .5s .1s cubic-bezier(.7,0,.3,1) both",transformOrigin:"top"}}/>
            <div style={{position:"absolute",top:"50%",left:0,right:0,bottom:0,background:"#08040E",zIndex:10,
              animation:"wc-curtainSplit .5s .1s cubic-bezier(.7,0,.3,1) both",transformOrigin:"bottom"}}/>
          </>
        )}

        {/* Floating particles */}
        {phase !== "curtain" && (
          <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
            {particles.map((p,i)=>(
              <div key={i} style={{
                position:"absolute", bottom:-20, left:p.x+"%",
                fontSize:p.size, opacity:p.opacity,
                animation:`wc-particle ${p.dur}s ${p.delay}s ease-in infinite`,
              }}>{p.shape}</div>
            ))}
          </div>
        )}

        {/* Scan line */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:1,
          background:"linear-gradient(90deg,transparent,rgba(232,121,160,.5),transparent)",
          animation:"rc-scanDown 6s linear infinite",pointerEvents:"none",zIndex:5}}/>

        {/* Main content */}
        <div style={{
          position:"relative", zIndex:6,
          display:"flex", flexDirection:"column", alignItems:"center",
          padding:"0 28px", maxWidth:360, width:"100%", textAlign:"center",
        }}>
          {/* Logo */}
          {(phase === "logo" || phase === "features" || phase === "cta") && (
            <>
              {/* Ring expand effect */}
              <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
                width:80,height:80,borderRadius:"50%",border:"2px solid rgba(232,121,160,.3)",
                animation:"wc-ringExpand 2s ease-out both",pointerEvents:"none"}}/>
              <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
                width:80,height:80,borderRadius:"50%",border:"2px solid rgba(180,142,245,.2)",
                animation:"wc-ringExpand 2s .3s ease-out both",pointerEvents:"none"}}/>

              <div style={{
                width:76,height:76,borderRadius:20,
                background:"linear-gradient(135deg,#E879A0,#B48EF5)",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:36, marginBottom:20,
                animation:"wc-logoFloat 4s ease-in-out infinite, wc-titleSlide .6s ease both",
                boxShadow:"0 0 40px rgba(232,121,160,.4), 0 0 80px rgba(180,142,245,.2)",
              }}>م</div>

              <div style={{
                fontSize:28, fontWeight:900, color:"#F5EEF8", marginBottom:6,
                animation:"wc-titleSlide .7s .1s ease both", opacity:0, animationFillMode:"forwards",
                background:"linear-gradient(135deg,#F5EEF8,#E879A0,#B48EF5)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                backgroundClip:"text",
              }}>مرحباً بكِ في مها ✨</div>

              <div style={{
                fontSize:13, color:"rgba(245,238,248,.5)", lineHeight:1.8, marginBottom:28,
                animation:"wc-subtitleFade .7s .3s ease both", opacity:0, animationFillMode:"forwards",
              }}>
                رفيقتك في رحلة المذاكرة — كل خطأ بداية نجاح
              </div>
            </>
          )}

          {/* Features */}
          {(phase === "features" || phase === "cta") && (
            <div style={{
              display:"flex", flexDirection:"column", gap:9,
              width:"100%", marginBottom:24,
            }}>
              {features.map((f,i) => i <= featIdx ? (
                <div key={i} style={{
                  display:"flex", alignItems:"center", gap:12,
                  padding:"10px 14px", borderRadius:14,
                  background:"rgba(255,255,255,.04)",
                  border:"1px solid rgba(255,255,255,.07)",
                  animation:`wc-featIn .4s ease both`,
                  animationDelay: `${i*0.1}s`,
                }}>
                  <div style={{
                    width:36,height:36,borderRadius:10,flexShrink:0,
                    background:"linear-gradient(135deg,rgba(232,121,160,.15),rgba(180,142,245,.1))",
                    border:"1px solid rgba(232,121,160,.2)",
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,
                  }}>{f.icon}</div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:13,fontWeight:800,color:"#F5EEF8",marginBottom:2}}>{f.title}</div>
                    <div style={{fontSize:11,color:"rgba(245,238,248,.4)"}}>{f.sub}</div>
                  </div>
                </div>
              ) : null)}
            </div>
          )}

          {/* CTA Button */}
          {phase === "cta" && (
            <div style={{animation:"wc-titleSlide .6s .2s ease both",opacity:0,animationFillMode:"forwards",width:"100%"}}>
              <button onClick={handleStart} style={{
                width:"100%", padding:"16px 0", borderRadius:16, border:"none",
                background:"linear-gradient(135deg,#E879A0,#C85F84,#B48EF5)",
                color:"#fff", fontFamily:"'Cairo',sans-serif", fontWeight:900, fontSize:16,
                cursor:"pointer", letterSpacing:.5,
                boxShadow:"0 8px 40px rgba(232,121,160,.5)",
                animation:"wc-btnPulse 2s ease-in-out infinite",
                position:"relative", overflow:"hidden",
              }}>
                <div style={{
                  position:"absolute",top:0,left:"-100%",width:"60%",height:"100%",
                  background:"linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent)",
                  animation:"sp-btnShine 2.5s 1s linear infinite",
                }}/>
                <span style={{position:"relative",zIndex:1}}>هنا نبدأ المشوار 🌸</span>
              </button>
              <div style={{marginTop:12,fontSize:10,color:"rgba(245,238,248,.25)",letterSpacing:.5}}>
                بياناتك محفوظة دايماً ✦ متزامنة على كل أجهزتك
              </div>
            </div>
          )}
        </div>

        {/* Mute button */}
        <button onClick={()=>{setMuted(m=>!m);}} style={{
          position:"absolute",top:16,left:16,zIndex:20,
          width:32,height:32,borderRadius:8,
          background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",
          color:"rgba(255,255,255,.4)",fontSize:14,cursor:"pointer",
          display:"flex",alignItems:"center",justifyContent:"center",
        }}>{muted?"🔇":"🔊"}</button>
      </div>
    </>,
    document.body
  );
}

// ══════════════════════════════════════════════════════════
// SURPRISE MODAL — مفاجآت دورية تظهر بعد فترة
// ══════════════════════════════════════════════════════════
const SURPRISES = [
  {
    id:"motivation_1",
    icon:"🔥", color:"#FB923C",
    title:"أنتِ تعملي العظيم!",
    body:"مها، كل يوم بتفتحي التطبيق ده هو قرار — والقرارات الصغيرة دي هي اللي بتصنع النتائج الكبيرة.",
    cta:"يلا نكمل! 💪",
    type:"motivation",
  },
  {
    id:"tip_1",
    icon:"💡", color:"#F4C97A",
    title:"تكتيك سرعة المراجعة",
    body:"بدل ما تذاكري كل حاجة — ركّزي على الأسئلة اللي غلطتِ فيها أكتر من مرة. دي بتثبت في الذاكرة أسرع بـ٣ مرات.",
    cta:"فاهمة، هجرب!",
    type:"tip",
  },
  {
    id:"challenge_1",
    icon:"🎯", color:"#E879A0",
    title:"تحدي اليوم!",
    body:"أنجزي ٣ مهام دلوقتي وهتلاقي مفاجأة في قسم القصص! كل مهمة بتقربك خطوة.",
    cta:"أنا جاهزة ✦",
    type:"challenge",
  },
  {
    id:"wisdom_1",
    icon:"🌙", color:"#B48EF5",
    title:"حكمة المساء",
    body:"\"الفرق بين اللي بتنجح واللي ما بتنجحش مش الموهبة — هي إن إيه بتعمليه لما مفيش حد شايفك.\"",
    cta:"ده كلام أوي 🌸",
    type:"wisdom",
  },
  {
    id:"streak_1",
    icon:"⚡", color:"#6EE7B7",
    title:"قوة اللحظة!",
    body:"العقل بيبقى أكتر استعداد للاستيعاب بعد حركة جسدية بسيطة. قومي تمشي ٢ دقيقة وبعدين ارجعي — هتذاكري بشكل أحسن.",
    cta:"سأجرب ذلك!",
    type:"tip",
  },
];

function SurpriseModal({ show, onClose }) {
  const [surprise, setSurprise] = useState(null);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (show) {
      // اختار مفاجأة عشوائية مختلفة في كل مرة
      const seen = JSON.parse(localStorage.getItem("maha_seen_surprises") || "[]");
      const unseen = SURPRISES.filter(s => !seen.includes(s.id));
      const pool = unseen.length > 0 ? unseen : SURPRISES;
      const picked = pool[Math.floor(Math.random() * pool.length)];
      setSurprise(picked);
      // Save seen
      const newSeen = [...new Set([...seen, picked.id])];
      if (newSeen.length >= SURPRISES.length) localStorage.removeItem("maha_seen_surprises");
      else localStorage.setItem("maha_seen_surprises", JSON.stringify(newSeen));
      // Confetti
      setConfetti(Array.from({length:20},(_,i)=>({
        x: Math.random()*100, color: ["#E879A0","#B48EF5","#F4C97A","#6EE7B7","#FB923C"][i%5],
        size: 6+Math.random()*8, delay: Math.random()*0.8,
        shape: ["●","■","▲","◆"][i%4],
      })));
      playSurpriseFanfare();
    }
  }, [show]);

  if (!show || !surprise) return null;

  return createPortal(
    <>
      <style>{RECAP_CSS}</style>
      <div onClick={onClose} style={{
        position:"fixed",inset:0,zIndex:25000,
        background:"rgba(5,2,10,.88)",backdropFilter:"blur(12px)",
        display:"flex",alignItems:"center",justifyContent:"center",padding:20,
        animation:"rc-fade .25s ease both",
      }}>
        {/* Confetti */}
        <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
          {confetti.map((c,i)=>(
            <div key={i} style={{
              position:"absolute",top:"-10%",left:c.x+"%",
              color:c.color,fontSize:c.size,
              animation:`sp-confettiFall ${1+Math.random()}s ${c.delay}s ease-in both`,
            }}>{c.shape}</div>
          ))}
        </div>

        <div onClick={e=>e.stopPropagation()} style={{
          background:"linear-gradient(160deg,rgba(30,20,38,.98),rgba(20,12,28,.98))",
          border:`1px solid ${surprise.color}44`,
          borderRadius:24, padding:"28px 24px", maxWidth:340, width:"100%",
          textAlign:"center",
          animation:"sp-popIn .5s cubic-bezier(.34,1.4,.64,1) both",
          boxShadow:`0 0 60px ${surprise.color}22, 0 20px 60px rgba(0,0,0,.6)`,
          position:"relative",overflow:"hidden",
        }}>
          {/* Glow bg */}
          <div style={{position:"absolute",top:"-30%",left:"50%",transform:"translateX(-50%)",
            width:"80%",height:"200px",borderRadius:"50%",
            background:surprise.color,opacity:.06,filter:"blur(40px)",pointerEvents:"none"}}/>

          {/* Shine */}
          <div style={{
            position:"absolute",top:0,left:"-100%",height:"100%",width:"50%",
            background:"linear-gradient(90deg,transparent,rgba(255,255,255,.04),transparent)",
            animation:"sp-btnShine 3s 1s linear infinite",pointerEvents:"none",
          }}/>

          {/* Glitter dots */}
          {[...Array(6)].map((_,i)=>(
            <div key={i} style={{
              position:"absolute",
              top: 10+Math.random()*80+"%",
              left: 5+i*16+"%",
              width:4,height:4,borderRadius:"50%",
              background:surprise.color,
              animation:`sp-glitter ${1+Math.random()}s ${i*0.3}s ease-in-out infinite`,
            }}/>
          ))}

          {/* Badge type */}
          <div style={{
            display:"inline-flex",alignItems:"center",gap:5,
            padding:"3px 12px",borderRadius:20,marginBottom:16,
            background:surprise.color+"18",border:`1px solid ${surprise.color}44`,
            fontSize:10,fontWeight:800,color:surprise.color,letterSpacing:1,
          }}>
            {{motivation:"✦ تحفيز",tip:"💡 نصيحة",challenge:"🎯 تحدي",wisdom:"🌙 حكمة"}[surprise.type] || "✦ مفاجأة"}
          </div>

          {/* Icon */}
          <div style={{fontSize:56,marginBottom:14,
            filter:`drop-shadow(0 0 20px ${surprise.color}88)`,
            animation:"wc-logoFloat 3s ease-in-out infinite"}}>{surprise.icon}</div>

          {/* Title */}
          <div style={{
            fontSize:18,fontWeight:900,color:"#F5EEF8",marginBottom:10,
            animation:"sp-textReveal .6s .2s ease both",opacity:0,animationFillMode:"forwards",
          }}>{surprise.title}</div>

          {/* Body */}
          <div style={{
            fontSize:13,color:"rgba(245,238,248,.65)",lineHeight:1.9,
            marginBottom:22,fontStyle:"italic",
            animation:"wc-subtitleFade .6s .4s ease both",opacity:0,animationFillMode:"forwards",
          }}>{surprise.body}</div>

          {/* CTA */}
          <button onClick={onClose} style={{
            padding:"13px 28px",borderRadius:14,border:"none",
            background:`linear-gradient(135deg,${surprise.color},${surprise.color}BB)`,
            color:"#fff",fontFamily:"'Cairo',sans-serif",fontWeight:900,fontSize:14,
            cursor:"pointer",width:"100%",
            boxShadow:`0 6px 24px ${surprise.color}44`,
            position:"relative",overflow:"hidden",
          }}>
            <div style={{
              position:"absolute",top:0,left:"-100%",width:"60%",height:"100%",
              background:"linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent)",
              animation:"sp-btnShine 2s .5s linear infinite",
            }}/>
            <span style={{position:"relative",zIndex:1}}>{surprise.cta}</span>
          </button>

          <button onClick={onClose} style={{
            marginTop:10,background:"none",border:"none",
            color:"rgba(245,238,248,.25)",fontSize:11,cursor:"pointer",
            fontFamily:"'Cairo',sans-serif",
          }}>لا شكراً</button>
        </div>
      </div>
    </>,
    document.body
  );
}

function CinWords({ text, startDelay=0, size=17, color="#F5EEF8", weight=400, spacing=1.9, onDone, withSound=false }) {
  const words = text.split(" ");
  const [shown, setShown] = useState(0);

  useEffect(() => {
    setShown(0);
    let i = 0;
    const timers = [];
    const show = () => {
      if (i >= words.length) { onDone?.(); return; }
      setShown(i + 1);
      if(withSound) playShimmer();
      i++;
      timers.push(setTimeout(show, 110 + Math.random()*40));
    };
    timers.push(setTimeout(show, startDelay));
    return () => timers.forEach(clearTimeout);
  }, [text]);

  return (
    <div style={{ lineHeight: spacing, minHeight: "1.2em" }}>
      {words.map((w, i) => (
        <span key={i} style={{
          display: "inline-block",
          marginLeft: 5,
          opacity: i < shown ? 1 : 0,
          transform: i < shown ? "translateY(0)" : "translateY(10px)",
          transition: "opacity .25s ease, transform .3s ease",
          fontSize: size,
          color,
          fontWeight: weight,
          fontFamily: "'Cairo', sans-serif",
        }}>{w}</span>
      ))}
    </div>
  );
}

// ─── Single scene renderer ─────────────────────────────────────
// Each STORY_CHAPTER scene → full-screen cinematic moment
const SCENE_PALETTES = {
  dark:    { bg:"#06030C", vignette:"rgba(0,0,0,.92)", textColor:"rgba(245,238,248,.82)", labelColor:"rgba(245,238,248,.28)" },
  warm:    { bg:"#0D0705", vignette:"rgba(8,4,0,.88)",  textColor:"rgba(255,240,210,.88)", labelColor:"rgba(255,220,150,.3)" },
  neutral: { bg:"#070C10", vignette:"rgba(0,5,10,.88)",  textColor:"rgba(210,235,245,.85)", labelColor:"rgba(150,200,230,.28)" },
  intense: { bg:"#0C0505", vignette:"rgba(12,2,2,.9)",  textColor:"rgba(255,220,210,.88)", labelColor:"rgba(255,120,100,.28)" },
  bright:  { bg:"#06090D", vignette:"rgba(2,4,8,.82)",  textColor:"rgba(240,248,255,.92)", labelColor:"rgba(180,220,255,.28)" },
};

function SceneView({ chapter, sceneIdx, onNext, isLast }) {
  const scene   = chapter.scenes[sceneIdx];
  const palette = SCENE_PALETTES[scene.mood] || SCENE_PALETTES.dark;
  const [lineIdx, setLineIdx]   = useState(0);
  const [canTap,  setCanTap]    = useState(false);
  const [key,     setKey]       = useState(0);
  const [showMusicBadge, setShowMusicBadge] = useState(sceneIdx === 0);

  useEffect(() => {
    setLineIdx(0); setCanTap(false); setKey(k=>k+1);
    const t = setTimeout(() => setCanTap(true), 2200);
    // Show music badge briefly when chapter starts (sceneIdx 0)
    if (sceneIdx === 0) {
      setShowMusicBadge(true);
      setTimeout(() => setShowMusicBadge(false), 2500);
    }
    return () => clearTimeout(t);
  }, [sceneIdx, chapter.id]);

  const handleLineDone = () => {
    if (lineIdx < scene.lines.length - 1) {
      setTimeout(() => setLineIdx(l => l+1), 500);
    } else {
      setTimeout(() => setCanTap(true), 400);
    }
  };

  return (
    <div
      onClick={() => { if (canTap) onNext(); }}
      style={{
        position: "absolute", inset: 0,
        background: palette.bg,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        cursor: canTap ? "pointer" : "default",
        userSelect: "none",
        transition: "background 1.2s ease",
      }}
    >
      {/* Grain overlay */}
      <div style={{
        position:"absolute",inset:0,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundSize:"200px 200px",
        animation:"rc-grainMove 8s linear infinite alternate",
        pointerEvents:"none", zIndex:1, opacity:.7,
      }}/>

      {/* Radial vignette */}
      <div style={{
        position:"absolute", inset:0, zIndex:2, pointerEvents:"none",
        background:`radial-gradient(ellipse at 50% 50%, transparent 25%, ${palette.vignette} 100%)`,
        animation:"rc-vignIn 1.2s ease both",
      }}/>

      {/* Chapter ambient glow — أكبر وأوضح */}
      <div style={{
        position:"absolute", top:"-25%", left:"-15%",
        width:"70vw", height:"70vw", borderRadius:"50%",
        background: chapter.color, opacity:.07, filter:"blur(90px)",
        animation:"cin-orbPulse 6s ease-in-out infinite",
        pointerEvents:"none", zIndex:1,
      }}/>
      <div style={{
        position:"absolute", bottom:"-25%", right:"-15%",
        width:"55vw", height:"55vw", borderRadius:"50%",
        background: chapter.color, opacity:.04, filter:"blur(70px)",
        animation:"cin-orbPulse 9s ease-in-out 2s infinite reverse",
        pointerEvents:"none", zIndex:1,
      }}/>

      {/* Scan line */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:"1px",
        background:`linear-gradient(90deg,transparent,${chapter.color}88,transparent)`,
        animation:"rc-scanDown 5s linear infinite",
        pointerEvents:"none", zIndex:3,
      }}/>

      {/* ══ Music badge — يظهر لما يتغير الفصل ══ */}
      {showMusicBadge && (
        <div style={{
          position:"absolute", top:80, right:20, zIndex:10,
          display:"flex", alignItems:"center", gap:7,
          padding:"6px 12px", borderRadius:20,
          background:`${chapter.color}22`,
          border:`1px solid ${chapter.color}55`,
          animation:"rc-fade .4s ease both",
        }}>
          {/* Music bars animation */}
          <div style={{display:"flex",alignItems:"flex-end",gap:2,height:14}}>
            {[1,2,3,4].map(i=>(
              <div key={i} style={{
                width:3,borderRadius:2,background:chapter.color,
                height: `${40 + Math.random()*60}%`,
                animation:`cin-bgPulse .${4+i}s ease-in-out ${i*0.1}s infinite`,
              }}/>
            ))}
          </div>
          <span style={{fontSize:10,color:chapter.color,fontWeight:800,fontFamily:"'Cairo',sans-serif"}}>
            {chapter.title}
          </span>
        </div>
      )}

      {/* ── Main content ── */}
      <div style={{
        position:"relative", zIndex:4,
        width:"100%", maxWidth:340,
        padding:"0 28px",
        display:"flex", flexDirection:"column", gap:20,
        animation:"rc-fade .8s ease both",
      }}>

        {/* Chapter label — بخط ملون */}
        <div style={{
          fontSize:10, fontWeight:800, letterSpacing:3,
          color: chapter.color,
          fontFamily:"'Cairo',sans-serif",
          textTransform:"uppercase",
          display:"flex", alignItems:"center", gap:8,
          paddingBottom:10,
        }}>
          <div style={{flex:1,height:1,background:`linear-gradient(90deg,${chapter.color}66,transparent)`,animation:"cin-lineGlow .8s ease both"}}/>
          {chapter.title} · الفصل {sceneIdx + 1}
          <div style={{flex:1,height:1,background:`linear-gradient(270deg,${chapter.color}66,transparent)`,animation:"cin-lineGlow .8s ease both"}}/>
        </div>

        {/* Lines — reveal one at a time */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {scene.lines.map((line, i) => (
            i <= lineIdx ? (
              <CinWords
                key={key + "-" + i}
                text={line}
                startDelay={i === lineIdx ? 0 : 0}
                size={i===0 ? 22 : 18}
                color={i===0 ? palette.textColor : "rgba(245,238,248,.62)"}
                weight={i===0 ? 700 : 400}
                spacing={1.9}
                onDone={i === lineIdx ? handleLineDone : undefined}
                withSound={i===lineIdx}
              />
            ) : null
          ))}
        </div>

        {/* Scene progress dots — أجمل */}
        <div style={{ display:"flex", gap:6, marginTop:8, alignItems:"center" }}>
          {chapter.scenes.map((_,i)=>(
            <div key={i} style={{
              height: i===sceneIdx ? 4 : 2,
              flex: i===sceneIdx ? 2 : 1,
              borderRadius:4,
              background: i<sceneIdx ? chapter.color : i===sceneIdx ? chapter.color : "rgba(255,255,255,.1)",
              transition:"all .5s cubic-bezier(.4,0,.2,1)",
              boxShadow: i===sceneIdx ? `0 0 8px ${chapter.color}88` : "none",
            }}/>
          ))}
        </div>

        {/* Tap hint */}
        {canTap && (
          <div style={{
            fontSize:10, color:"rgba(255,255,255,.25)",
            fontFamily:"'Cairo',sans-serif",
            fontWeight:600, letterSpacing:1.5,
            animation:"cin-tapHint 1.8s ease-in-out infinite",
            textAlign:"center",
          }}>
            {isLast ? "✦ اضغطي للمتابعة" : "اضغطي للمشهد التالي"}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Timeline screen (after all chapters shown) ────────────────
function TimelineScreen({ chapters, totalDone, onCTA }) {
  const unlocked = chapters.filter(ch => totalDone >= ch.milestone);
  const lastCh   = unlocked[unlocked.length-1];
  const [vis, setVis] = useState(-1);

  useEffect(()=>{
    playArp();
    let i=0;
    const tick=()=>{
      setVis(i); i++;
      if(i<unlocked.length) setTimeout(tick, 230);
      else setTimeout(()=>playSwell(), 400);
    };
    setTimeout(tick,400);
  },[]);

  return(
    <div style={{
      position:"absolute",inset:0,
      background:"#06030C",
      display:"flex",flexDirection:"column",
      padding:"28px 22px 20px",
      overflow:"hidden",
      animation:"rc-fade .7s ease both",
      fontFamily:"'Cairo',sans-serif",
    }}>
      {/* Ambient */}
      {lastCh&&<div style={{position:"absolute",top:"-15%",right:"-10%",width:"55vw",height:"55vw",borderRadius:"50%",background:lastCh.color,opacity:.05,filter:"blur(70px)",pointerEvents:"none"}}/>}

      {/* Grain */}
      <div style={{position:"absolute",inset:0,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,backgroundSize:"200px",animation:"rc-grainMove 8s linear infinite alternate",pointerEvents:"none",opacity:.6}}/>

      <div style={{position:"relative",zIndex:2,display:"flex",flexDirection:"column",height:"100%"}}>
        {/* Header */}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:10,color:"rgba(245,238,248,.28)",letterSpacing:3,fontWeight:700,marginBottom:5}}>رحلتك</div>
          <div style={{fontSize:22,fontWeight:900,color:"#F5EEF8",letterSpacing:.4}}>
            {unlocked.length} فصل مكتمل
          </div>
          {lastCh&&<div style={{
            marginTop:6,height:2,borderRadius:2,
            background:`linear-gradient(90deg,${lastCh.color},${lastCh.color}33,transparent)`,
            animation:"rc-fade .8s .3s ease both",opacity:0,animationFillMode:"forwards",
          }}/>}
        </div>

        {/* Chapter list */}
        <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:0,paddingLeft:4}}>
          {unlocked.map((ch,i)=>{
            const show = i<=vis;
            const isLast = i===unlocked.length-1;
            return(
              <div key={ch.id} style={{
                display:"flex",alignItems:"stretch",gap:0,
                opacity:show?1:0,transform:show?"none":"translateX(20px)",
                transition:"opacity .3s, transform .3s",
              }}>
                {/* Spine */}
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:38,flexShrink:0,paddingTop:3}}>
                  <div style={{
                    width:30,height:30,borderRadius:"50%",
                    border:`1.5px solid ${ch.color}`,
                    background:`radial-gradient(circle,${ch.color}25,transparent)`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:13,flexShrink:0,
                    boxShadow:show?`0 0 14px ${ch.color}44`:"none",
                    transition:"box-shadow .5s",
                  }}>{ch.scenes[ch.scenes.length-1].visual}</div>
                  {!isLast&&<div style={{width:1.5,flex:1,minHeight:20,background:`linear-gradient(180deg,${ch.color}55,${unlocked[i+1]?.color||ch.color}22)`}}/>}
                </div>

                {/* Text */}
                <div style={{flex:1,padding:"2px 0 18px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                    <span style={{fontSize:12,fontWeight:900,color:ch.color}}>{ch.title}</span>
                    <span style={{fontSize:8,padding:"1px 6px",borderRadius:8,
                      background:ch.color+"18",color:ch.color,
                      border:`1px solid ${ch.color}33`,fontWeight:700}}>
                      {ch.milestone} مهمة
                    </span>
                  </div>
                  <div style={{fontSize:10,color:"rgba(245,238,248,.35)",lineHeight:1.7,fontStyle:"italic"}}>
                    "{ch.punchline}"
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        {lastCh&&(
          <div style={{animation:"rc-ctaIn .7s .6s cubic-bezier(.34,1.4,.64,1) both",opacity:0,animationFillMode:"forwards",marginTop:12}}>
            <div style={{
              display:"flex",alignItems:"center",gap:12,
              padding:"13px 16px",borderRadius:16,marginBottom:12,
              background:`linear-gradient(135deg,${lastCh.color}18,${lastCh.color}08)`,
              border:`1px solid ${lastCh.color}44`,
            }}>
              <div style={{fontSize:24,flexShrink:0}}>{lastCh.scenes[lastCh.scenes.length-1].visual}</div>
              <div>
                <div style={{fontSize:10,color:lastCh.color,fontWeight:800,marginBottom:1}}>آخر فصل وصلتِه</div>
                <div style={{fontSize:13,fontWeight:900,color:"#F5EEF8"}}>{lastCh.title}</div>
              </div>
              <div style={{marginRight:"auto",fontSize:15,fontWeight:900,color:lastCh.color}}>+{lastCh.xp}⭐</div>
            </div>

            <button onClick={onCTA} style={{
              width:"100%",padding:"15px 0",borderRadius:14,border:"none",
              background:`linear-gradient(135deg,${lastCh.color},${lastCh.color}AA)`,
              color:"#fff",fontFamily:"'Cairo',sans-serif",fontWeight:900,fontSize:15,
              cursor:"pointer",letterSpacing:.5,
              boxShadow:`0 6px 36px ${lastCh.color}44`,
              position:"relative",overflow:"hidden",
            }}>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,.14),transparent)",pointerEvents:"none"}}/>
              <span style={{position:"relative",zIndex:1}}>هنا نكمل المشوار ✦</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Master Recap Modal ────────────────────────────────────────
function StoryRecapModal({ show, chapters, totalDone, onClose }) {
  const unlocked    = chapters.filter(ch => totalDone >= ch.milestone);
  // Flatten: for each unlocked chapter, all its scenes
  const allScenes   = unlocked.flatMap(ch => ch.scenes.map((_, si) => ({ chapter:ch, sceneIdx:si })));
  const [cursor,    setCursor]    = useState(0);   // index in allScenes
  const [phase,     setPhase]     = useState("scene"); // "scene" | "timeline"
  const [muted,     setMuted]     = useState(false);
  const [animKey,   setAnimKey]   = useState(0);

  useEffect(() => {
    if (!show) { stopMusicLoop(); return; }
    setAnimKey(k => k+1);
    setCursor(0);
    setPhase("scene");
    // music starts on first tap (user gesture) inside handleNext
  }, [show]);

  // cleanup on unmount
  useEffect(() => () => stopMusicLoop(), []);

  const handleNext = () => {
    const curChapter = allScenes[cursor]?.chapter;
    if (cursor === 0) {
      playOpenChord();
      startMusicLoop(curChapter?.id || "seed");
    }
    if (cursor < allScenes.length - 1) {
      const nextChapter = allScenes[cursor+1]?.chapter;
      if (nextChapter && nextChapter.id !== curChapter?.id) {
        stopMusicLoop();
        setTimeout(() => startMusicLoop(nextChapter.id), 500);
      }
      setCursor(c => c+1);
    } else {
      setPhase("timeline");
    }
  };

  const handleMute = () => {
    setMuted(m => {
      const ctx = getAudioCtx();
      if (!ctx) return m;
      m ? ctx.resume() : ctx.suspend();
      return !m;
    });
  };

  if (!show || unlocked.length === 0) return null;

  const cur = allScenes[cursor];
  const isLastScene = cursor === allScenes.length - 1;

  return createPortal(
    <>
      <style>{RECAP_CSS}</style>
      <div style={{
        position:"fixed",inset:0,zIndex:20000,
        fontFamily:"'Cairo',sans-serif",
        animation:"rc-fade .4s ease both",
      }}>
        {/* ── Scene view ── */}
        {phase === "scene" && (
          <SceneView
            key={animKey + "-" + cursor}
            chapter={cur.chapter}
            sceneIdx={cur.sceneIdx}
            onNext={handleNext}
            isLast={isLastScene}
          />
        )}

        {/* ── Timeline view ── */}
        {phase === "timeline" && (
          <TimelineScreen
            chapters={chapters}
            totalDone={totalDone}
            onCTA={() => { stopMusicLoop(); onClose(); }}
          />
        )}

        {/* ── Top bar: chapter counter + mute ── */}
        <div style={{
          position:"absolute",top:0,left:0,right:0,
          padding:"14px 18px",zIndex:10,
          display:"flex",justifyContent:"space-between",alignItems:"center",
          background:"linear-gradient(180deg,rgba(0,0,0,.55),transparent)",
          pointerEvents:"none",
        }}>
          {phase==="scene"&&(
            <div style={{fontSize:10,color:"rgba(255,255,255,.3)",fontWeight:700,letterSpacing:1.5}}>
              {cursor+1} / {allScenes.length}
            </div>
          )}
          <div style={{flex:1}}/>
          <button
            onClick={handleMute}
            style={{
              width:32,height:32,borderRadius:8,
              background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.1)",
              color:"rgba(255,255,255,.45)",fontSize:14,cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",
              pointerEvents:"all",
            }}
          >{muted?"🔇":"🔊"}</button>
        </div>

        {/* ── Progress bar (scene phase only) ── */}
        {phase==="scene"&&(
          <div style={{
            position:"absolute",bottom:0,left:0,right:0,
            height:2,background:"rgba(255,255,255,.06)",
            zIndex:10,pointerEvents:"none",
          }}>
            <div style={{
              height:"100%",
              background: cur.chapter.color,
              "--tw": ((cursor/(allScenes.length-1||1))*100)+"%",
              width: ((cursor/(allScenes.length-1||1))*100)+"%",
              transition:"width .4s ease",
            }}/>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}


// TASK_MILESTONES + XP SYSTEM — نظام القصص السينمائية
// ===

// كل scene فيها: نص الـ voiceover + لون خلفية ambient + حجم الأيقونة + مؤثر بصري
const STORY_CHAPTERS = [
  {
    id:"seed", title:"اللحظة دي", milestone:1,
    color:"#52D9A0", glow:"rgba(82,217,160,.18)",
    gradient:"radial-gradient(ellipse at 50% 80%, rgba(82,217,160,.15) 0%, rgba(5,2,10,1) 70%)",
    scenes:[
      { visual:"🌑", mood:"dark",
        lines:["كل الناس كانوا نايمين.", "إنتِ كنتِ صاحية.", "وعارفة إن في حاجة لازم تتغير."] },
      { visual:"🕯️", mood:"warm",
        lines:["مش محتاجة تفهمي ليه.", "مش محتاجة تحسي بالحماس.", "بس... ابدئي."] },
      { visual:"✦", mood:"bright",
        lines:["عملتِ حاجة واحدة.", "مهمة واحدة.", "وده... كان كل حاجة."] },
    ],
    punchline:"الشجاعة مش غياب الخوف — هي إنك بتعملي وأنتِ خايفة.",
    xp:10,
  },
  {
    id:"road", title:"مش محتاجة تبقي مستعدة", milestone:5,
    color:"#F4C97A", glow:"rgba(244,201,122,.18)",
    gradient:"radial-gradient(ellipse at 30% 50%, rgba(244,201,122,.12) 0%, rgba(5,2,10,1) 65%)",
    scenes:[
      { visual:"🏔️", mood:"dark",
        lines:["في ناس بتستنى الوقت المناسب.", "بتستنى تبقى مستعدة.", "بتستنى الأحوال تتحسن."] },
      { visual:"⌛", mood:"neutral",
        lines:["إنتِ مش من دول.", "إنتِ بتعملي وأنتِ عارفة إن الوقت مش مثالي.", "وده بالظبط إيه بيفرقك."] },
      { visual:"🌅", mood:"bright",
        lines:["٥ مهام.", "٥ مرات قلتِ \"دلوقتي\" بدل \"بكرة\".", "ده مش تعديل في الروتين — ده تعديل في الشخصية."] },
    ],
    punchline:"الناجحين مش أكتر استعداداً — هم أسرع في البدء.",
    xp:50,
  },
  {
    id:"ten", title:"التعب الحقيقي", milestone:10,
    color:"#A78BFA", glow:"rgba(167,139,250,.2)",
    gradient:"radial-gradient(ellipse at 60% 30%, rgba(167,139,250,.15) 0%, rgba(5,2,10,1) 65%)",
    scenes:[
      { visual:"🌧️", mood:"dark",
        lines:["فيه يوم مشتيش فيه تعملي أي حاجة.", "الدنيا كانت تقيلة.", "وإنتِ عملتِ المهمة."] },
      { visual:"🩸", mood:"intense",
        lines:["مش بتتكلمي عن النشاط.", "بتتكلمي عن اللحظة اللي إيدك كانت تقيلة.", "وحركتيها."] },
      { visual:"🏆", mood:"bright",
        lines:["١٠ مهام.", "مش ١٠ أيام سهلة.", "١٠ مرات اخترتِ نفسك وأنتِ ممكن تكوني اخترتِ أي حاجة تانية."] },
    ],
    punchline:"الإرادة مش بتتبني في الأيام السهلة.",
    xp:100, isLetter:true,
  },
  {
    id:"mirror", title:"الصوت اللي جوّاكِ", milestone:20,
    color:"#F472B6", glow:"rgba(244,114,182,.18)",
    gradient:"radial-gradient(ellipse at 80% 20%, rgba(244,114,182,.15) 0%, rgba(5,2,10,1) 65%)",
    scenes:[
      { visual:"🪞", mood:"dark",
        lines:["فيه صوت جوّاكِ بيقولك إنك مش قادرة.", "بيقولك إنك تعبانة.", "بيقولك إن غيرك أحسن منك."] },
      { visual:"⚡", mood:"intense",
        lines:["سمعتِ الصوت ده.", "وعملتِ المهمة.", "وعملتِ التانية. والتالتة."] },
      { visual:"🔥", mood:"bright",
        lines:["٢٠ مهمة يعني ٢٠ مرة الصوت ده خسر.", "إنتِ مش بتسكتيه —", "إنتِ بتضعّفيه."] },
    ],
    punchline:"أقوى حاجة بتعمليها مش هي المهمة — هي إنك بتعمليها رغم الصوت.",
    xp:200,
  },
  {
    id:"fire", title:"جوّاكِ نار", milestone:30,
    color:"#FB923C", glow:"rgba(251,146,60,.2)",
    gradient:"radial-gradient(ellipse at 50% 60%, rgba(251,146,60,.15) 0%, rgba(5,2,10,1) 65%)",
    scenes:[
      { visual:"🌑", mood:"dark",
        lines:["فيه ناس بتشتغل عشان حد تاني يشوفهم.", "بتشتغل عشان الدرجات.", "عشان الشهادة."] },
      { visual:"🔥", mood:"intense",
        lines:["وفيه ناس بتشتغل عشان في جوّاهم حاجة.", "حاجة بتقولهم ان في معنى لما بيعملوه.", "إنتِ عارفة إنتِ منين."] },
      { visual:"✦", mood:"bright",
        lines:["٣٠ مهمة.", "مش الناس اللي شافوا ده هما اللي بيحفزوكِ.", "النار دي جوّاكِ إنتِ."] },
    ],
    punchline:"أي حاجة بتجيكِ من برا ممكن تروح — النار اللي جوّاكِ مش بتطفاش.",
    xp:300,
  },
  {
    id:"climb", title:"بتتسلقي مش بترتاحي", milestone:40,
    color:"#34D399", glow:"rgba(52,211,153,.18)",
    gradient:"radial-gradient(ellipse at 20% 50%, rgba(52,211,153,.15) 0%, rgba(5,2,10,1) 65%)",
    scenes:[
      { visual:"⛰️", mood:"dark",
        lines:["الراحة حلوة.", "الاسترخاء حلو.", "والتوقف عن التعب حلو."] },
      { visual:"🧗", mood:"intense",
        lines:["بس في حاجة أحلى.", "وإنتِ عارفاها دلوقتي.", "الحاجة اللي بتحسيها لما بتنجزي."] },
      { visual:"🌄", mood:"bright",
        lines:["٤٠ مهمة يعني إنك بنيتِ شيء.", "مش في الورق —", "في نفسك."] },
    ],
    punchline:"الإنسان مش بيبقى أحسن بالراحة — بيبقى أحسن بالتحدي.",
    xp:400,
  },
  {
    id:"half", title:"نص الطريق مش نص المشوار", milestone:50,
    color:"#F87171", glow:"rgba(248,113,113,.2)",
    gradient:"radial-gradient(ellipse at 50% 50%, rgba(248,113,113,.15) 0%, rgba(5,2,10,1) 65%)",
    scenes:[
      { visual:"🗺️", mood:"dark",
        lines:["٥٠ مهمة.", "إنتِ مش نفس الشخص اللي بدأ.", "بس برضو مش الشخص اللي هتبقيه."] },
      { visual:"🌊", mood:"intense",
        lines:["في ناس بتوقف هنا.", "بتقول \"أنجزت كتير\" وبترتاح.", "وبتفضل في نفس المكان."] },
      { visual:"🚀", mood:"bright",
        lines:["إنتِ مش هنا عشان توقفي.", "إنتِ هنا عشان تعرفي إنك ممكن.", "والآن إنتِ عارفة."] },
    ],
    punchline:"أخطر لحظة في الرحلة هي لما بتحسي إنك عملتِ كتير — لأن ده بالظبط لما تكملي.",
    xp:500, isLetter:true,
  },
  {
    id:"roots", title:"اللي ما حدش شايفه", milestone:65,
    color:"#4ADE80", glow:"rgba(74,222,128,.18)",
    gradient:"radial-gradient(ellipse at 70% 70%, rgba(74,222,128,.12) 0%, rgba(5,2,10,1) 65%)",
    scenes:[
      { visual:"🌳", mood:"dark",
        lines:["الشجرة الكبيرة ما حدش بيشوف جذورها.", "كل الناس بيشوفوا الأوراق والأفرع.", "اللي برا."] },
      { visual:"🌱", mood:"neutral",
        lines:["الجذور في الأماكن المظلمة.", "في الأيام اللي ماحدش شافك فيها بتشتغلي.", "في اللحظات اللي مكانتيش نفسك — وعملتِ."] },
      { visual:"✦", mood:"bright",
        lines:["٦٥ مهمة من الجذور.", "الناس هتشوف النتيجة.", "إنتِ بتعرفي الثمن."] },
    ],
    punchline:"أهم الأعمال هي اللي ما حدش شايفها غيرك.",
    xp:650,
  },
  {
    id:"voice", title:"الصوت اتغير", milestone:80,
    color:"#E879A0", glow:"rgba(232,121,160,.2)",
    gradient:"radial-gradient(ellipse at 40% 30%, rgba(232,121,160,.15) 0%, rgba(5,2,10,1) 65%)",
    scenes:[
      { visual:"💭", mood:"dark",
        lines:["فاكرة أول يوم؟", "الصوت اللي كان بيقولك \"مش هتعرفي\"؟", "\"صعبة عليكِ\"؟"] },
      { visual:"🔊", mood:"intense",
        lines:["الصوت ده لسه موجود.", "بس دلوقتي فيه صوت تاني.", "أعلى منه."] },
      { visual:"⚡", mood:"bright",
        lines:["٨٠ مهمة غيّرت صوتك الداخلي.", "ده مش تطوير مهارات —", "ده تغيير هوية."] },
    ],
    punchline:"الجزء اللي بتتكلم بيه مع نفسك اتغير — وده أصعب تغيير في الوجود.",
    xp:800,
  },
  {
    id:"crown", title:"إنتِ اللي صنعتِ ده", milestone:100,
    color:"#FBBF24", glow:"rgba(251,191,36,.25)",
    gradient:"radial-gradient(ellipse at 50% 40%, rgba(251,191,36,.2) 0%, rgba(5,2,10,1) 60%)",
    scenes:[
      { visual:"🌑", mood:"dark",
        lines:["كان فيه يوم إنتِ فيه مش عارفة هتكملي ولا لأ.", "كان فيه يوم الموضوع ده كان بعيد.", "وإنتِ عملتِ حاجة."] },
      { visual:"⭐", mood:"intense",
        lines:["١٠٠ مرة قررتِ.", "١٠٠ مرة اخترتِ الصعب.", "١٠٠ مرة قلتِ لنفسك: لأ، مش هوقف."] },
      { visual:"👑", mood:"bright",
        lines:["ده مش رقم.", "ده إنتِ.", "مبروك — صنعتِ حاجة ما تتشالش."] },
    ],
    punchline:"التاج مش بيتوهب — بيتصنع لحظة لحظة. وإنتِ صنعتِ كل لحظة فيه.",
    xp:1000, isLetter:true,
  },
];

const TASK_MILESTONES = STORY_CHAPTERS.map(ch=>({
  at:ch.milestone, msg:ch.punchline,
  gift:ch.scenes[ch.scenes.length-1].visual,
  xp:ch.xp, boxType:"story", storyId:ch.id,
}));

const SURPRISE_BOX = {
  story:{label:"قصة سينمائية",color:"#A78BFA",bg:"rgba(167,139,250,.08)",border:"rgba(167,139,250,.3)",icon:"🎬",items:[]},
  challenge:{label:"تحدي",color:"#E879A0",bg:"rgba(232,121,160,.1)",border:"rgba(232,121,160,.3)",icon:"🎯",items:[]},
  streak:{label:"مواظبة",color:"#FBB86C",bg:"rgba(251,184,108,.1)",border:"rgba(251,184,108,.3)",icon:"🔥",items:[]},
  letter:{label:"رسالة",color:"#A78BFA",bg:"rgba(167,139,250,.1)",border:"rgba(167,139,250,.3)",icon:"🪄",items:[]},
};

// ===
// CINEMATIC STORY MODAL — تجربة سينمائية كاملة
// ===
const STORY_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800;900&display=swap');

  @keyframes cin-bgPulse{0%,100%{opacity:.6}50%{opacity:1}}
  @keyframes cin-wordIn{from{opacity:0;transform:translateY(12px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes cin-lineReveal{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes cin-iconDrop{0%{opacity:0;transform:scale(2.5) rotate(-15deg);filter:blur(8px)}60%{transform:scale(.95) rotate(5deg);filter:blur(0)}100%{opacity:1;transform:scale(1) rotate(0deg);filter:blur(0)}}
  @keyframes cin-iconFloat{0%,100%{transform:translateY(0) rotate(0deg)}25%{transform:translateY(-8px) rotate(3deg)}75%{transform:translateY(-4px) rotate(-3deg)}}
  @keyframes cin-iconDance{
    0%{transform:translateY(0) rotate(0deg) scale(1)}
    10%{transform:translateY(-18px) rotate(-8deg) scale(1.08)}
    20%{transform:translateY(-6px) rotate(6deg) scale(1.04)}
    30%{transform:translateY(-20px) rotate(-4deg) scale(1.1)}
    40%{transform:translateY(-4px) rotate(5deg) scale(1.02)}
    50%{transform:translateY(-16px) rotate(-6deg) scale(1.07)}
    60%{transform:translateY(-2px) rotate(4deg) scale(1.03)}
    70%{transform:translateY(-14px) rotate(-3deg) scale(1.06)}
    80%{transform:translateY(-3px) rotate(3deg) scale(1.01)}
    90%{transform:translateY(-10px) rotate(-2deg) scale(1.04)}
    100%{transform:translateY(0) rotate(0deg) scale(1)}
  }
  @keyframes cin-iconSpin{0%{transform:rotate(0deg) scale(1)}50%{transform:rotate(180deg) scale(1.2)}100%{transform:rotate(360deg) scale(1)}}
  @keyframes cin-iconBounce{0%,100%{transform:translateY(0) scale(1)}30%{transform:translateY(-28px) scale(1.15)}60%{transform:translateY(-8px) scale(1.05)}}
  @keyframes cin-iconWiggle{0%,100%{transform:rotate(0)}20%{transform:rotate(-12deg)}40%{transform:rotate(12deg)}60%{transform:rotate(-8deg)}80%{transform:rotate(8deg)}}
  @keyframes cin-fadeSlide{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
  @keyframes cin-punchIn{0%{opacity:0;transform:scale(.6) rotate(-10deg)}60%{transform:scale(1.12) rotate(3deg)}80%{transform:scale(.96) rotate(-1deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
  @keyframes cin-glowPulse{0%,100%{box-shadow:0 0 0px transparent}50%{box-shadow:0 0 60px var(--story-glow)}}
  @keyframes cin-scanline{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
  @keyframes cin-particleUp{0%{transform:translateY(0) rotate(0deg);opacity:.8}100%{transform:translateY(-150px) rotate(1080deg);opacity:0}}
  @keyframes cin-particleDrift{0%{transform:translateY(0) translateX(0) rotate(0);opacity:.8}50%{transform:translateY(-70px) translateX(20px) rotate(360deg);opacity:.6}100%{transform:translateY(-150px) translateX(-10px) rotate(720deg);opacity:0}}
  @keyframes cin-curtainUp{from{transform:scaleY(1)}to{transform:scaleY(0)}}
  @keyframes cin-tapHint{0%,100%{opacity:.3;transform:scale(1)}50%{opacity:.7;transform:scale(1.08)}}
  @keyframes cin-progressGrow{from{width:0}to{width:var(--target-w)}}
  @keyframes cin-letterTyped{from{opacity:0}to{opacity:1}}
  @keyframes cin-musicChange{0%{opacity:0;transform:scale(1.5)}50%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}
  @keyframes cin-orbPulse{0%,100%{transform:scale(1);opacity:.4}50%{transform:scale(1.15);opacity:.8}}
  @keyframes cin-lineGlow{from{opacity:0;width:0}to{opacity:1;width:100%}}
  @keyframes cin-starBurst{0%{transform:scale(0) rotate(0);opacity:1}100%{transform:scale(2.5) rotate(180deg);opacity:0}}
  @keyframes cin-shimmerBg{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

  .cin-icon-drop { animation: cin-iconDrop .8s cubic-bezier(.22,1,.36,1) both }
  .cin-icon-float { animation: cin-iconFloat 3.5s ease-in-out infinite }
  .cin-icon-dance { animation: cin-iconDance 1.8s ease-in-out infinite }
  .cin-icon-spin  { animation: cin-iconSpin 1.2s cubic-bezier(.4,0,.2,1) both }
  .cin-icon-bounce { animation: cin-iconBounce .9s cubic-bezier(.22,1,.36,1) both, cin-iconFloat 3s 1s ease-in-out infinite }
  .cin-icon-wiggle { animation: cin-iconWiggle .6s ease both, cin-iconFloat 3s .7s ease-in-out infinite }
  .cin-punch { animation: cin-punchIn .6s cubic-bezier(.34,1.4,.64,1) both }
  .cin-fade-slide { animation: cin-fadeSlide .5s ease both }
  .cin-word { display:inline-block; animation: cin-wordIn .4s ease both }
`;

// Word-by-word animated text
function CinLine({ text, delay=0, size=18, color="#F5EEF8", weight=500, style={} }) {
  const words = text.split(" ");
  return (
    <div style={{lineHeight:1.9, marginBottom:4, ...style}}>
      {words.map((w,i)=>(
        <span key={i} className="cin-word"
          style={{animationDelay:`${delay + i*0.06}s`, fontSize:size, color, fontWeight:weight,
            marginLeft:4, fontFamily:"'Cairo',sans-serif"}}>
          {w}
        </span>
      ))}
    </div>
  );
}

// Ambient floating particles
function CinParticles({ color, count=14 }) {
  const pts = useRef(
    Array.from({length:count},(_,idx)=>({
      x: Math.random()*100,
      size: 4+Math.random()*7,
      delay: Math.random()*5,
      dur: 2.5+Math.random()*3.5,
      shape: ["◆","●","▲","✦","·","★","♦","✿"][Math.floor(Math.random()*8)],
      drift: idx%2===0 ? "cin-particleUp" : "cin-particleDrift",
    }))
  ).current;
  return (
    <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
      {pts.map((p,i)=>(
        <div key={i} style={{
          position:"absolute", bottom:-10, left:p.x+"%",
          fontSize:p.size, color, opacity:.7,
          animation:`${p.drift} ${p.dur}s ${p.delay}s ease-in infinite`,
        }}>{p.shape}</div>
      ))}
    </div>
  );
}

// Cinematic vignette overlay
function Vignette() {
  return <div style={{position:"absolute",inset:0,pointerEvents:"none",
    background:"radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.7) 100%)",zIndex:1}}/>;
}

function StoryModal({ show, storyId, milestone, onClose }) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [lineIdx,  setLineIdx]  = useState(0);
  const [phase,    setPhase]    = useState("curtain"); // curtain|scene|punch|letter|done
  const [animKey,  setAnimKey]  = useState(0);
  const [aiLetter, setAiLetter] = useState("");
  const [letLoad,  setLetLoad]  = useState(false);
  const [tapReady, setTapReady] = useState(false);
  const tapRef = useRef();

  const story = STORY_CHAPTERS.find(s=>s.id===storyId);

  useEffect(()=>{
    if(show){
      setSceneIdx(0); setLineIdx(0); setPhase("curtain");
      setAnimKey(k=>k+1); setAiLetter(""); setTapReady(false);
      const t = setTimeout(()=>{
        setPhase("scene"); setTapReady(false);
        if(story) {
          playOpenChord();
          setTimeout(() => startMusicLoop(story.id), 600);
        }
      }, 900);
      return ()=>{ clearTimeout(t); stopMusicLoop(); };
    } else {
      stopMusicLoop();
    }
  },[show, storyId]);

  // Auto-advance lines with a delay, then show tap prompt
  useEffect(()=>{
    if(phase!=="scene") return;
    setTapReady(false);
    const scene = story?.scenes[sceneIdx];
    if(!scene) return;
    const totalLines = scene.lines.length;
    const totalDelay = totalLines * 0.06 * scene.lines[totalLines-1].split(" ").length * 1000 + 600;
    const t = setTimeout(()=>setTapReady(true), Math.min(totalDelay + 400, 3500));
    return ()=>clearTimeout(t);
  },[phase, sceneIdx, animKey]);

  if(!show||!story) return null;

  const scene = story.scenes[sceneIdx];
  const isLastScene = sceneIdx === story.scenes.length-1;
  const chapterNum = STORY_CHAPTERS.findIndex(s=>s.id===storyId)+1;
  const progPct = phase==="punch"||phase==="letter"||phase==="done" ? 100
    : Math.round(((sceneIdx + .8) / story.scenes.length) * 88);

  const moodBg = {
    dark:    "rgba(5,2,10,1)",
    neutral: "rgba(12,8,20,1)",
    intense: "rgba(8,3,15,1)",
    bright:  "rgba(10,6,18,1)",
  };

  const advance = async () => {
    if(phase==="curtain") return;
    if(phase==="scene"){
      if(!isLastScene){
        setSceneIdx(s=>s+1); setAnimKey(k=>k+1); setTapReady(false);
      } else {
        setPhase("punch"); setAnimKey(k=>k+1); setTapReady(false);
        // fetch letter in background if needed
        if(story.isLetter && !aiLetter){
          setLetLoad(true);
          try {
            const res = await fetch("https://api.anthropic.com/v1/messages",{
              method:"POST", headers:{"Content-Type":"application/json"},
              body:JSON.stringify({
                model:"claude-sonnet-4-20250514", max_tokens:700,
                messages:[{role:"user",content:`
أنتِ مها اللي نجحت وبقت اللي كانت عايزاه.
اكتبي رسالة لنفسك اللي كانت في البداية وأنجزت ${milestone} مهمة.
القواعد:
- اللهجة المصرية الحقيقية — مش فصحى ومش كليشيهات
- ابدئي بجملة صادمة مش "يا مها أنتِ قوية"
- قولي حاجة محددة مش عامة — لحظة واحدة، إحساس واحد، حقيقة واحدة
- ٤ أسطر بس. كل سطر جملة واحدة. بدون تشجيع فارغ.
- الهدف: إن اللي تقريها تحس إن حد شايفها فعلاً
- لا تكتبي: "أنتِ أقوى مما تتخيلي" أو "كل خطوة مهمة" أو أي كلام عام
ابدئي بـ "يا مها..."
                `}]
              })
            });
            const d=await res.json();
            setAiLetter(d.content?.[0]?.text || "يا مها، الصح مش دايماً بيحس بالصح.");
          } catch(e){ setAiLetter("يا مها، في لحظات بقيتِ فيها أنتِ — وده كان يكفي."); }
          setLetLoad(false);
        }
        setTimeout(()=>setTapReady(true), 1200);
      }
      return;
    }
    if(phase==="punch"){
      if(story.isLetter){ setPhase("letter"); setAnimKey(k=>k+1); setTapReady(false); setTimeout(()=>setTapReady(true),800); }
      else onClose();
      return;
    }
    if(phase==="letter"){ onClose(); return; }
  };

  return createPortal(
    <>
      <style>{STORY_CSS}</style>
      <div
        onClick={tapReady ? advance : undefined}
        style={{
          position:"fixed", inset:0, zIndex:10500,
          background: moodBg[scene?.mood||"dark"],
          fontFamily:"'Cairo',sans-serif", direction:"rtl",
          display:"flex", flexDirection:"column",
          cursor: tapReady ? "pointer" : "default",
          userSelect:"none", WebkitUserSelect:"none",
          "--story-glow": story.glow,
        }}>

        {/* Ambient background gradient */}
        <div key={"bg-"+sceneIdx} style={{
          position:"absolute", inset:0, pointerEvents:"none",
          background: story.gradient,
          animation:"cin-bgPulse 4s ease-in-out infinite",
          transition:"opacity 1s",
        }}/>

        <Vignette/>
        <CinParticles color={story.color} count={10}/>

        {/* Curtain intro */}
        {phase==="curtain"&&(
          <div style={{position:"absolute",inset:0,zIndex:20,
            background:"#000",
            animation:"cin-curtainUp .8s .1s ease both",
            transformOrigin:"top",
          }}/>
        )}

        {/* ── Top HUD ── */}
        <div style={{position:"relative",zIndex:10,padding:"52px 24px 0",flexShrink:0}}>
          {/* Chapter label */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontSize:10,color:story.color,fontWeight:800,letterSpacing:3,
              textTransform:"uppercase",opacity:.8}}>
              الفصل {chapterNum} من ١٠
            </div>
            <button onClick={e=>{e.stopPropagation();onClose();}}
              style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.1)",
                borderRadius:20,padding:"3px 12px",color:"rgba(255,255,255,.35)",fontSize:11,
                cursor:"pointer",fontFamily:"'Cairo',sans-serif"}}>
              تخطي
            </button>
          </div>

          {/* Progress bar */}
          <div style={{height:2,background:"rgba(255,255,255,.08)",borderRadius:10,overflow:"hidden",marginBottom:0}}>
            <div style={{height:"100%",borderRadius:10,
              background:`linear-gradient(90deg,${story.color}88,${story.color})`,
              width:progPct+"%", transition:"width .8s cubic-bezier(.4,0,.2,1)"}}/>
          </div>
        </div>

        {/* ── SCENE PHASE ── */}
        {phase==="scene"&&(
          <div key={"scene-"+sceneIdx+"-"+animKey}
            style={{flex:1,display:"flex",flexDirection:"column",
              justifyContent:"center",padding:"0 28px 40px",position:"relative",zIndex:5}}>

            {/* Giant visual */}
            <div className={scene.mood==="bright"?"cin-icon-drop cin-icon-dance":scene.mood==="intense"?"cin-icon-drop cin-icon-wiggle":"cin-icon-drop cin-icon-float"} style={{
              fontSize: scene.mood==="bright"?115:scene.mood==="intense"?98:85,
              textAlign:"center", marginBottom:32, lineHeight:1,
              filter:`drop-shadow(0 0 50px ${story.color}77)`,
              display:"block",
            }}>
              {scene.visual}
            </div>

            {/* Lines — word by word */}
            <div style={{textAlign:"center"}}>
              {scene.lines.map((line, li)=>{
                const prevWordsCount = scene.lines.slice(0,li).reduce((s,l)=>s+l.split(" ").length,0);
                return (
                  <CinLine key={li} text={line}
                    delay={prevWordsCount * 0.065}
                    size={li===0&&scene.lines.length===1?22:li===scene.lines.length-1?20:17}
                    color={li===scene.lines.length-1?"#F5EEF8":"rgba(245,238,248,.65)"}
                    weight={li===scene.lines.length-1?700:400}
                  />
                );
              })}
            </div>

            {/* Scene dots */}
            <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:32}}>
              {story.scenes.map((_,i)=>(
                <div key={i} style={{
                  width: i===sceneIdx?24:6, height:4, borderRadius:4,
                  background: i<sceneIdx?story.color+"88":i===sceneIdx?story.color:"rgba(255,255,255,.12)",
                  transition:"all .4s ease",
                }}/>
              ))}
            </div>
          </div>
        )}

        {/* ── PUNCHLINE PHASE ── */}
        {phase==="punch"&&(
          <div key={"punch-"+animKey}
            style={{flex:1,display:"flex",flexDirection:"column",
              justifyContent:"center",alignItems:"center",padding:"0 32px 60px",
              position:"relative",zIndex:5,textAlign:"center"}}>

            {/* XP burst */}
            <div className="cin-punch" style={{
              fontSize:60, marginBottom:20,
              filter:`drop-shadow(0 0 40px ${story.color})`,
              animation:"cin-punchIn .6s cubic-bezier(.34,1.4,.64,1) both, cin-iconDance 1.8s 1s ease-in-out infinite",
              display:"block", textAlign:"center",
            }}>
              {story.scenes[story.scenes.length-1].visual}
            </div>

            <div style={{fontSize:11,color:story.color,fontWeight:800,letterSpacing:3,
              marginBottom:20,opacity:.8,animation:"cin-fadeSlide .4s .1s ease both"}}>
              ✦ اللحظة دي ✦
            </div>

            {/* Punchline — word by word */}
            <div style={{maxWidth:320,animation:"cin-fadeSlide .5s .2s ease both"}}>
              <CinLine text={story.punchline} delay={0.1} size={19} color="#F5EEF8" weight={700}
                style={{lineHeight:2.1,textAlign:"center"}}/>
            </div>

            {/* XP badge */}
            <div className="cin-fade-slide" style={{
              marginTop:28,display:"inline-flex",alignItems:"center",gap:8,
              padding:"10px 24px",borderRadius:30,
              background:`linear-gradient(135deg,${story.color}22,${story.color}11)`,
              border:`1px solid ${story.color}55`,
              animationDelay:".6s",
            }}>
              <span style={{fontSize:18}}>⭐</span>
              <span style={{fontSize:15,fontWeight:900,color:story.color}}>+{story.xp} نجمة</span>
            </div>
          </div>
        )}

        {/* ── LETTER PHASE ── */}
        {phase==="letter"&&(
          <div key={"letter-"+animKey}
            style={{flex:1,display:"flex",flexDirection:"column",
              justifyContent:"center",padding:"0 26px 60px",position:"relative",zIndex:5}}>

            <div style={{fontSize:11,color:"#A78BFA",fontWeight:800,letterSpacing:3,
              textAlign:"center",marginBottom:20,
              animation:"cin-fadeSlide .4s ease both"}}>
              ✦ رسالة من مها المستقبلية ✦
            </div>

            <div style={{
              background:"rgba(167,139,250,.06)",
              border:"1px solid rgba(167,139,250,.2)",
              borderRadius:20, padding:"24px 22px",
              minHeight:160,display:"flex",alignItems:"center",justifyContent:"center",
              animation:"cin-fadeSlide .5s .1s ease both",
              boxShadow:"0 0 60px rgba(167,139,250,.08)",
            }}>
              {letLoad
                ? <div style={{textAlign:"center"}}>
                    <div style={{width:32,height:32,borderRadius:"50%",margin:"0 auto 12px",
                      border:"2px solid rgba(167,139,250,.3)",borderTopColor:"#A78BFA",
                      animation:"spin .8s linear infinite"}}/>
                    <div style={{fontSize:12,color:"rgba(245,238,248,.3)"}}>
                      بتكتب لك...
                    </div>
                  </div>
                : <p style={{
                    fontSize:15, lineHeight:2.3, color:"#F5EEF8",
                    fontStyle:"italic", whiteSpace:"pre-wrap", margin:0,
                    textAlign:"right",
                  }}>{aiLetter}</p>
              }
            </div>
          </div>
        )}

        {/* ── Bottom tap hint ── */}
        {tapReady && phase!=="curtain" && (
          <div style={{
            position:"absolute",bottom:36,left:0,right:0,
            textAlign:"center",zIndex:10,pointerEvents:"none",
          }}>
            <div style={{fontSize:11,color:"rgba(255,255,255,.25)",
              animation:"cin-tapHint 1.8s ease-in-out infinite",letterSpacing:1}}>
              {phase==="letter"?"اضغطي للإنهاء":"اضغطي للمتابعة"}
            </div>
          </div>
        )}

        {/* ── Intro title overlay (first moment of scene 0) ── */}
        {phase==="scene"&&sceneIdx===0&&animKey>0&&(
          <div style={{
            position:"absolute",top:110,left:0,right:0,
            textAlign:"center",zIndex:6,pointerEvents:"none",
          }}>
            <div style={{
              fontSize:13,fontWeight:900,color:story.color,
              letterSpacing:1,opacity:.9,
              animation:"cin-fadeSlide .6s ease both",
            }}>
              {story.title}
            </div>
          </div>
        )}

      </div>
    </>,
    document.body
  );
}


// ✅ Tasks, TaskCard, TaskTimer, RANKS, ACHIEVEMENTS moved to Tasks.jsx

function Chatbot({ questions, subjects, lessons }) {
  const [msgs,      setMsgs]      = useState([]);
  const [input,     setInput]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [aiHistory, setAiHistory] = useState([]);
  const [chatLoaded,setChatLoaded]= useState(false);
  const [explainMode,setExplainMode]=useState("normal");
  const [currentModel,setCurrentModel]=useState("auto");
  const [forceModel,setForceModel]=useState("auto");
  const endRef = useRef();

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  // -- Build Context (fresh every call) --
  const buildContext = () => {
    const wrong    = questions.filter(q=>!q.isCorrect);
    const mastered = questions.filter(q=>(q.correctStreak||0)>=3);
    const learned  = questions.filter(q=>q.wasWrong&&q.isCorrect);
    const everWrong= questions.filter(q=>q.wasWrong);

    // ==== ======
    const bySub = subjects.map(s=>{
      const sw=wrong.filter(q=>q.subjectId===s.id);
      const sm=mastered.filter(q=>q.subjectId===s.id);
      if(!sw.length&&!sm.length)return null;
      return (s.icon||"")+s.name+": "+(sw.length?sw.length+" خطأ حالي":"لا أخطاء حالية")+(sm.length?" | "+sm.length+" أتقنتِه":"");
    }).filter(Boolean);

    // -- ===== ======= ====== --
    // =. ======= ====== === (==== ========= =====)
    const mostWrong = everWrong
      .filter(q=>(q.wrongStreak||0)>=2||(q.totalAttempts||0)>=2)
      .sort((a,b)=>{
        const scoreA = (a.wrongStreak||0)*2 + (a.totalAttempts||0) - (a.totalCorrect||0)*2;
        const scoreB = (b.wrongStreak||0)*2 + (b.totalAttempts||0) - (b.totalCorrect||0)*2;
        return scoreB - scoreA;
      })
      .slice(0,8)
      .map(q=>{
        const attempts  = q.totalAttempts||0;
        const wrongTimes= attempts - (q.totalCorrect||0);
        const streak    = q.wrongStreak||0;
        return "• "+(q.subjectName||"")+"/"+(q.lessonName||"")+
          ": "+(q.question||"").slice(0,60)+
          " [غلط "+wrongTimes+" من "+attempts+" محاولة"+
          (streak>=2?", آخر "+streak+" مرات متتالية":"")+"]"+
          (q.note?" [سبب: "+q.note+"]":"");
      });

    // =. ===== ===== === ===== ===== = === ======== ======
    const lessonPatterns = {};
    everWrong.forEach(q=>{
      const key = (q.subjectName||"")+"__"+(q.lessonName||"");
      if(!lessonPatterns[key]) lessonPatterns[key]={
        subjectName:q.subjectName||"",
        lessonName:q.lessonName||"",
        questions:[],
        totalWrong:0,
        totalAttempts:0
      };
      lessonPatterns[key].questions.push(q);
      lessonPatterns[key].totalWrong   += (q.totalAttempts||1)-(q.totalCorrect||0);
      lessonPatterns[key].totalAttempts+= (q.totalAttempts||1);
    });

    const lessonAnalysis = Object.values(lessonPatterns)
      .filter(l=>l.totalWrong>=2)
      .sort((a,b)=>b.totalWrong-a.totalWrong)
      .slice(0,5)
      .map(l=>{
        const stillWrong = l.questions.filter(q=>!q.isCorrect).length;
        const learned    = l.questions.filter(q=>q.wasWrong&&q.isCorrect).length;
        return "📍 "+l.subjectName+"/"+l.lessonName+
          ": "+l.totalWrong+" غلطة إجمالية في "+l.questions.length+" سؤال"+
          (stillWrong?" | لسه غلط: "+stillWrong:"")+
          (learned?" | تعلمتِ: "+learned:"");
      });

    // =. ======= ==== ===== ==== ========= (======= ======)
    const learnedDetails = learned.slice(0,15).map(q=>{
      const attempts  = q.totalAttempts||0;
      const wrongTimes= attempts-(q.totalCorrect||0);
      return "• "+(q.subjectName||"?")+"/"+( q.lessonName||"?")+
        ": "+(q.question||"").slice(0,70)+
        (q.correctAnswer!=null&&q.choices?.[q.correctAnswer]?" — الإجابة: "+q.choices[q.correctAnswer].slice(0,30):"")+
        (q.essayCorrect?" — الإجابة: "+q.essayCorrect.slice(0,50):"")+
        (wrongTimes>0?" [كانت غلط "+wrongTimes+" مرة قبل ما تتقنيها]":"")+
        (q.note?" [سبب الخطأ: "+q.note+"]":"");
    });

    // =. ======= =======
    const topErrors = wrong
      .sort((a,b)=>(b.wrongStreak||0)-(a.wrongStreak||0))
      .slice(0,10)
      .map(q=>{
        const attempts  = q.totalAttempts||0;
        const wrongTimes= attempts-(q.totalCorrect||0);
        return "• "+(q.subjectName||"")+"/"+(q.lessonName||"")+
          ": "+(q.question||"").slice(0,60)+
          (attempts>0?" ["+wrongTimes+"/"+attempts+" غلط]":"")+
          (q.note?" [سبب: "+q.note+"]":"");
      });

    // ======= ======
    const lessonRefs = lessons
      .filter(l=>l.notes?.trim())
      .map(l=>"📝 "+l.name+" ("+(subjects.find(s=>s.id===l.subjectId)?.name||"")+"): "+l.notes.slice(0,800));

    return "=بيانات مها الكاملة=\n"+
      "إجمالي: "+questions.length+
      " | لسه غلط: "+wrong.length+
      " | أتقنتِه: "+mastered.length+
      " | تعلمتِ من أخطاء: "+learned.length+
      " | وقعتِ فيها يوماً ما: "+everWrong.length+

      "\n\nالمواد:\n"+(bySub.join("\n")||"لا يوجد بعد")+

      (lessonAnalysis.length?
        "\n\n🔥 تحليل الأنماط — الجزئيات الصعبة عليكِ:\n"+lessonAnalysis.join("\n"):"")+

      (mostWrong.length?
        "\n\n⚠️ الأسئلة الأكثر خطأ (الترتيب بعدد المرات):\n"+mostWrong.join("\n"):"")+

      (topErrors.length?
        "\n\nالأخطاء الحالية:\n"+topErrors.join("\n"):
        "\n\nالأخطاء الحالية: لا يوجد")+

      (learnedDetails.length?
        "\n\n✅ الأسئلة اللي تعلمتِها من أخطاء قديمة:\n"+learnedDetails.join("\n"):
        "\n\nمفيش أسئلة تعلمتِها من أخطاء بعد")+

      (lessonRefs.length?
        "\n\n📚 مراجع الدروس:\n"+lessonRefs.join("\n\n"):"");
  };

  const SYSTEM = `# شخصيتك
أنت "أستاذ مها" — مدرس خاص ذكي ودود لطالبة ثانوي اسمها مها.
بتتكلم بالعامية المصرية البسيطة.
أنت مش بس مدرس — أنت صاحب بيساعد مها تفهم وتتفوق.

## قواعد مهمة جداً
- لما تشوف بيانات مها، استخدمها بالظبط.
- "تحليل الأنماط — الجزئيات الصعبة" ده أهم جزء في البيانات — استخدمه دايماً لما تحلل.
- لو سؤال غلطتِ فيه 5 مرات — قولها صراحة "غلطتِ في السؤال ده 5 مرات".
- ربط الأنماط: لو أكثر من سؤال في نفس الجزئية/الدرس فيه أخطاء — اربطهم مع بعض وقول "لاحظت إن في جزئية كذا عندك مشكلة بشكل متكرر".
- الفرق: "لسه غلط" = محتاجة مراجعة عاجلة. "تعلمتِ من أخطاء" = حفظتِها لكن لازم تثبّتيها.
- لو مفيش أخطاء حالية — شوف الأسئلة اللي تعلمتِها وراجع منها.

## ردود على أنواع الأسئلة
- تحليل أخطاء: استخدم "تحليل الأنماط" + "الأسئلة الأكثر خطأ" معاً، اذكر أرقام وأسماء بالظبط
- راجع X: لو في بيانات عن X، راجعها. لو مفيش، قول بصراحة
- اختبار: سؤال واحد، انتظر الإجابة، صحح وشجع

## أسلوبك
- مش بتبدأ بـ "بالطبع" أو "تمام يا مها" في كل رسالة
- بتغير الأسلوب لو طلبت نفس الموضوع تاني (قصة / مثال / مقارنة)
- في الآخر: "فهمتي؟ نكمل ولا نختبر؟"

## تخصصك
عربي (نحو+بلاغة+أدب) | إنجليزي | تاريخ | جغرافيا | إحصاء | فرنساوي`;

  const modeInstructions = {
    simple:  " [اشرح بأبسط طريقة]",
    steps:   " [اشرح خطوة بخطوة مرقمة]",
    story:   " [اشرح في شكل قصة قصيرة]",
    life:    " [اشرح بمثال من الحياة المصرية]",
    compare: " [اشرح بالمقارنة بين المفاهيم]",
  };

  const botMsg = (text, buttons=[]) => setMsgs(prev=>{
    const updated=prev.map((m,i)=>i===prev.length-1?{...m,buttonsDisabled:true}:m);
    return [...updated,{role:"assistant",text,buttons,buttonsDisabled:false}];
  });

  const mainMenu = () => botMsg("تحبي أساعدك في إيه؟ 🌸",[
    {label:"🔍 حللي أخطائي",    action:"analyze"},
    {label:"🧩 أنماط أخطائي",   action:"patterns"},
    {label:"📚 اختاري مادة",    action:"pick_subject"},
    {label:"🎯 اختبريني",       action:"test_me"},
    {label:"📅 خطة مذاكرة",    action:"plan"},
  ]);

  // ===== =====
  useEffect(()=>{
    getDocs(query(collection(db,"chatHistory"),orderBy("createdAt","asc")))
      .then(snap=>{
        const saved=snap.docs.map(d=>({id:d.id,...d.data()}));
        if(saved.length>0){
          setMsgs(saved.map(m=>({role:m.role,text:m.text,buttons:[],buttonsDisabled:true})));
          setAiHistory(saved.slice(-8).map(m=>({role:m.role==="assistant"?"model":"user",content:m.text})));
        } else { mainMenu(); }
        setChatLoaded(true);
      })
      .catch(()=>{mainMenu();setChatLoaded(true);});
  },[]);

  const sendToAI = async (msg, showBubble=false) => {
    if(loading)return;
    setLoading(true);
    if(showBubble){
      setMsgs(prev=>[...prev,{role:"user",text:msg,buttons:[]}]);
      try{await addDoc(collection(db,"chatHistory"),{role:"user",text:msg,createdAt:new Date()});}catch(_){}
    }
    // ====== ====== fresh == == =====
    const modeNote = explainMode!=="normal" ? (modeInstructions[explainMode]||"") : "";
    const fullMsg  = buildContext()+"\n\n"+msg+modeNote;
    const newHistory=[...aiHistory,{role:"user",content:fullMsg}];
    try{
      let reply;
      if(forceModel==="groq"){
        _lastModel="groq";
        reply=await groqChat([{role:"system",content:SYSTEM},...newHistory.map(m=>({role:m.role==="model"?"assistant":"user",content:m.content}))],2000);
      } else {
        reply=await geminiChat(SYSTEM,newHistory,2000);
      }
      setCurrentModel(_lastModel);
      setAiHistory(prev=>[...newHistory,{role:"model",content:reply}].slice(-12));
      botMsg(reply,[{label:"🏠 القائمة الرئيسية",action:"menu"}]);
      try{await addDoc(collection(db,"chatHistory"),{role:"assistant",text:reply,createdAt:new Date()});}catch(_){}
    }catch(e){botMsg("⚠️ "+e.message,[{label:"🔄 حاولي تاني",action:"menu"}]);}
    setLoading(false);
  };

  const sendInput = async()=>{
    const msg=input.trim();
    if(!msg||loading)return;
    setInput("");
    await sendToAI(msg,true);
  };

  const handleAction = async(action,data={})=>{
    if(loading)return;
    const wrong    = questions.filter(q=>!q.isCorrect);
    const everWrong= questions.filter(q=>q.wasWrong);

    switch(action){
      case "menu": mainMenu(); break;

      case "analyze":
        await sendToAI("حللي أخطائي بالتفصيل — قوليلي بالاسم أكتر نقطة ضعف عندي وليه بغلط فيها");
        break;

      case "patterns":{
        const pats={};
        questions.filter(q=>q.wasWrong).forEach(q=>{const k=q.lessonName||q.subjectName||"";if(k)pats[k]=(pats[k]||0)+1;});
        const top=Object.entries(pats).filter(([,v])=>v>=2).sort((a,b)=>b[1]-a[1]).slice(0,5);
        if(!top.length){botMsg("مفيش أنماط واضحة لسه 🌸",[{label:"🏠 رجوع",action:"menu"}]);}
        else{await sendToAI("حللي الأنماط المتكررة في أخطائي — الدروس والمواضيع اللي بتتكرر فيها الأخطاء، وإيه السبب الجذري والحل العملي.");}
        break;
      }

      case "plan":
        await sendToAI("اعمليلي خطة مذاكرة أسبوعية مخصصة بناءً على أخطائي الحقيقية مع أولويات واضحة");
        break;

      case "pick_subject":{
        const subs=subjects.filter(s=>wrong.some(q=>q.subjectId===s.id));
        if(!subs.length){
          if(everWrong.length>0){botMsg("🎉 مفيش أخطاء حالية! تحبي تتدربي على اللي أتقنتِه؟",[{label:"🏆 تدريب على المتقن",action:"test_mastered"},{label:"🏠 رجوع",action:"menu"}]);}
          else{botMsg("سجّلي أسئلة الغلط الأول من صفحة المواد 📚",[{label:"🏠 رجوع",action:"menu"}]);}
          return;
        }
        botMsg("اختاري المادة:",[...subs.map(s=>({label:(s.icon||"📚")+" "+s.name+" ("+wrong.filter(q=>q.subjectId===s.id).length+"❌)",action:"subject",data:{id:s.id,name:s.name,icon:s.icon||"📚"}})),{label:"↩️ رجوع",action:"menu"}]);
        break;
      }

      case "subject":{
        if(!data.id){mainMenu();return;}
        const sw=wrong.filter(q=>q.subjectId===data.id);
        const byL={};sw.forEach(q=>{const k=q.lessonName||"عام";if(!byL[k])byL[k]=[];byL[k].push(q);});
        botMsg((data.icon||"📚")+" "+data.name+" — اختاري درس:",[
          ...Object.entries(byL).sort((a,b)=>b[1].length-a[1].length).map(([l,qs])=>({label:"📖 "+l+" ("+qs.length+"❌)",action:"lesson",data:{lesson:l,subName:data.name,subId:data.id,subIcon:data.icon,qs}})),
          {label:"📚 كل المادة",action:"all_subject",data:{id:data.id,name:data.name,icon:data.icon}},
          {label:"↩️ رجوع",action:"pick_subject"},
        ]);
        break;
      }

      case "lesson":
        botMsg("درس «"+data.lesson+"» — تحبي إيه?",[
          {label:"💡 شرح الأخطاء",action:"explain",data},
          {label:"🧪 اختبار",action:"test_lesson",data},
          {label:"↩️ رجوع",action:"subject",data:{id:data.subId,name:data.subName,icon:data.subIcon}},
        ]);
        break;

      case "explain":{
        const lessonRef = lessons.find(l=>l.name===data.lesson&&l.notes?.trim());
        const refNote = lessonRef ? "\n\n📚 مرجع الدرس:\n"+lessonRef.notes.slice(0,800) : "";
        const errList=data.qs.slice(0,5).map(q=>"- "+q.question.slice(0,60)+(q.note?" [سبب: "+q.note+"]":"")).join("\n");
        await sendToAI("شرحيلي كل خطأ من دول بالتفصيل في درس «"+data.lesson+"» من "+data.subName+":\n"+errList+refNote+"\nلكل خطأ: ليه غلطتِ بالظبط + القاعدة الصح + مثال.");
        break;
      }

      case "test_lesson":{
        const lessonRef2 = lessons.find(l=>l.name===data.lesson&&l.notes?.trim());
        const refNote2 = lessonRef2 ? "\n\n📚 مرجع الدرس:\n"+lessonRef2.notes.slice(0,600) : "";
        const errList=data.qs.slice(0,3).map(q=>"- "+q.question.slice(0,50)).join("\n");
        await sendToAI("اختبريني في درس «"+data.lesson+"» من "+data.subName+" — سؤال واحد بناءً على:\n"+errList+refNote2+"\nانتظري إجابتي.");
        break;
      }

      case "all_subject":{
        const sw2=wrong.filter(q=>q.subjectId===data.id);
        const byL2={};sw2.forEach(q=>{const k=q.lessonName||"عام";if(!byL2[k])byL2[k]=[];byL2[k].push(q.question.slice(0,40));});
        const summary=Object.entries(byL2).sort((a,b)=>b[1].length-a[1].length).slice(0,5).map(([l,qs])=>l+" ("+qs.length+" خطأ): "+qs.slice(0,2).join(" / ")).join("\n");
        await sendToAI("حللي كل أخطائي في "+data.name+" وقوليلي الأنماط:\n"+summary);
        break;
      }

      case "test_me":{
        const subs2=subjects.filter(s=>wrong.some(q=>q.subjectId===s.id));
        if(!subs2.length){
          if(everWrong.length>0){botMsg("🎉 مفيش أخطاء حالية! تحبي تتدربي على المتقن؟",[{label:"🏆 تدريب على المتقن",action:"test_mastered"},{label:"🏠 رجوع",action:"menu"}]);}
          else{botMsg("سجّلي أسئلة الغلط الأول 📚",[{label:"🏠 رجوع",action:"menu"}]);}
          return;
        }
        botMsg("اختبار في إيه؟",[...subs2.map(s=>({label:(s.icon||"📚")+" "+s.name+" ("+wrong.filter(q=>q.subjectId===s.id).length+"❌)",action:"test_subject",data:{id:s.id,name:s.name}})),{label:"↩️ رجوع",action:"menu"}]);
        break;
      }

      case "test_subject":{
        const sw3=wrong.filter(q=>q.subjectId===data.id);
        if(!sw3.length){botMsg("مفيش أخطاء حالية في "+data.name+" 🎉");return;}
        const rnd=sw3[Math.floor(Math.random()*sw3.length)];
        await sendToAI("اختبريني في "+data.name+" — سؤال واحد من درس «"+rnd.lessonName+"» من أخطائي الحقيقية. انتظري إجابتي.");
        break;
      }

      case "test_mastered":{
        const pool=everWrong.filter(q=>q.isCorrect);
        const mastSubs=subjects.filter(s=>pool.some(q=>q.subjectId===s.id));
        if(!mastSubs.length){botMsg("مفيش أسئلة أتقنتِها بعد 🌸",[{label:"🏠 رجوع",action:"menu"}]);return;}
        botMsg("تدريب تثبيت في إيه؟ 🏆",[...mastSubs.map(s=>({label:(s.icon||"📚")+" "+s.name,action:"test_subject_mastered",data:{id:s.id,name:s.name}})),{label:"↩️ رجوع",action:"menu"}]);
        break;
      }

      case "test_subject_mastered":{
        const pool2=everWrong.filter(q=>q.subjectId===data.id&&q.isCorrect);
        if(!pool2.length){botMsg("مفيش في "+data.name);return;}
        const rnd2=pool2[Math.floor(Math.random()*pool2.length)];
        await sendToAI("اختبريني في "+data.name+" — سؤال تثبيت من درس «"+rnd2.lessonName+"» من الأسئلة اللي أتقنتِها بعد ما كانت غلط. سؤال واحد وانتظري إجابتي.");
        break;
      }
    }
  };

  const clearHistory = async()=>{
    if(!await dialog.confirm("هتمسحي كل سجل المحادثة؟","مسح المحادثة"))return;
    try{const snap=await getDocs(collection(db,"chatHistory"));for(const d of snap.docs)await deleteDoc(doc(db,"chatHistory",d.id));}catch(_){}
    setMsgs([]); setAiHistory([]);
    setTimeout(mainMenu,80);
  };

  if(!chatLoaded)return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"50vh",flexDirection:"column",gap:11}}>
      <span className="spinner" style={{width:28,height:28}}/><div style={{color:C.muted,fontSize:13}}>جاري التحميل...</div>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100dvh - 118px)",minHeight:400}}>
      {/* Header */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:13,padding:"9px 13px",marginBottom:7,flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:34,height:34,borderRadius:10,background:`linear-gradient(135deg,${C.accent},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>🎓</div>
            <div>
              <div style={{fontSize:13,fontWeight:800}}>أستاذ مها الذكي</div>
              <div style={{fontSize:10,display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:currentModel==="gemini"?C.success:currentModel==="groq"?C.gold:C.muted}}/>
                <span style={{color:currentModel==="gemini"?C.success:currentModel==="groq"?C.gold:C.muted,fontWeight:700}}>{currentModel==="gemini"?"Gemini ✨":currentModel==="groq"?"Groq ⚡":"جاهز"}</span>
                <span style={{color:C.dim}}>· {aiHistory.length} رسالة</span>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:5,alignItems:"center"}}>
            <select value={forceModel} onChange={e=>setForceModel(e.target.value)} style={{fontSize:10,padding:"3px 6px",borderRadius:7,width:"auto",height:26,color:C.muted}}>
              <option value="auto">🔄 تلقائي</option><option value="gemini">✨ Gemini</option><option value="groq">⚡ Groq</option>
            </select>
            <button onClick={clearHistory} style={{background:C.surface,border:`1px solid ${C.border}`,color:C.muted,borderRadius:7,padding:"3px 8px",fontSize:11,fontFamily:"'Cairo',sans-serif"}}>🗑️</button>
          </div>
        </div>
        {/* Explain Modes */}
        <div style={{display:"flex",gap:4,overflowX:"auto"}}>
          {[{id:"normal",icon:"📚",l:"علمي"},{id:"simple",icon:"🌱",l:"بسيط"},{id:"steps",icon:"📝",l:"خطوات"},{id:"story",icon:"🌟",l:"قصة"},{id:"life",icon:"🏠",l:"مثال"},{id:"compare",icon:"⚖️",l:"مقارنة"}].map(m=>(
            <button key={m.id} onClick={()=>setExplainMode(m.id)} style={{flexShrink:0,padding:"3px 9px",borderRadius:14,fontSize:11,fontFamily:"'Cairo',sans-serif",fontWeight:700,background:explainMode===m.id?C.accentSoft:C.surface,border:`1.5px solid ${explainMode===m.id?C.accent:C.border}`,color:explainMode===m.id?C.accent:C.muted}}>
              {m.icon} {m.l}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",display:"flex",flexDirection:"column",gap:7,marginBottom:7,paddingBottom:4}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",flexDirection:"column",gap:4}}>
            <div style={{display:"flex",justifyContent:m.role==="user"?"flex-start":"flex-end",alignItems:"flex-end",gap:6}}>
              {m.role==="assistant"&&<div style={{width:26,height:26,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>🎓</div>}
              <div style={{maxWidth:"83%",padding:"9px 13px",borderRadius:m.role==="user"?"15px 15px 15px 4px":"15px 15px 4px 15px",background:m.role==="user"?C.accentSoft:C.card,border:`1px solid ${m.role==="user"?"rgba(124,106,247,.3)":C.border}`}}>
                {m.role==="user"?<div style={{fontSize:13,lineHeight:1.8}}>{m.text}</div>:<div style={{fontSize:13}}>{renderMarkdown(m.text)}</div>}
              </div>
              {m.role==="user"&&<div style={{width:26,height:26,borderRadius:"50%",background:C.goldSoft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>🌸</div>}
            </div>
            {m.buttons?.length>0&&!m.buttonsDisabled&&(
              <div style={{display:"flex",flexWrap:"wrap",gap:5,paddingRight:33}}>
                {m.buttons.map((btn,bi)=>(
                  <button key={bi} onClick={()=>handleAction(btn.action,btn.data||{})}
                    style={{padding:"6px 13px",borderRadius:18,fontSize:12,fontFamily:"'Cairo',sans-serif",fontWeight:700,background:C.surface,border:`1.5px solid ${C.border}`,color:C.text,transition:"all .15s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.color=C.accent;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.text;}}>
                    {btn.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading&&(
          <div style={{display:"flex",justifyContent:"flex-end",alignItems:"flex-end",gap:6}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>🎓</div>
            <div style={{padding:"10px 14px",borderRadius:"15px 15px 4px 15px",background:C.surface,border:`1px solid ${C.border}`}}>
              {[0,.3,.6].map((d,i)=><span key={i} style={{animation:"pulse 1.2s infinite "+d+"s",marginLeft:2,color:C.accent,fontSize:15}}>●</span>)}
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      {/* Input */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:13,padding:"9px 11px",flexShrink:0}}>
        <div style={{display:"flex",gap:7,alignItems:"flex-end"}}>
          <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendInput();}}} placeholder="أو اكتبي سؤالك مباشرة..." rows={2} style={{resize:"none",border:"none",background:"transparent",padding:"3px 0",flex:1,fontSize:14}}/>
          <button onClick={sendInput} disabled={loading||!input.trim()} style={{width:38,height:38,borderRadius:11,border:"none",fontSize:17,flexShrink:0,background:input.trim()?`linear-gradient(135deg,${C.accent},${C.accentDark})`:"rgba(255,255,255,.05)",opacity:loading||!input.trim()?.4:1}}>✈️</button>
        </div>
      </div>
    </div>
  );
}

// ===
// 🌟 FEATURE 1 — XP BURST (إشعار إنجاز بأنيميشن لما تكسبي نقاط)
// ===
let _xpBurstFn = null;
const showXpBurst = (amount, label) => _xpBurstFn?.(amount, label);

function XpBurstSystem() {
  const [bursts, setBursts] = useState([]);
  useEffect(() => {
    _xpBurstFn = (amount, label) => {
      const id = Date.now() + Math.random();
      const x = 30 + Math.random() * 40; // % from left
      setBursts(p => [...p, {id, amount, label, x}]);
      setTimeout(() => setBursts(p => p.filter(b => b.id !== id)), 2000);
    };
    return () => { _xpBurstFn = null; };
  }, []);
  if (!bursts.length) return null;
  return createPortal(
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9998}}>
      {bursts.map(b => (
        <div key={b.id} style={{
          position:"absolute",
          left: b.x+"%",
          top:"40%",
          transform:"translate(-50%,-50%)",
          textAlign:"center",
          animation:"xpBurst 1.8s ease forwards",
        }}>
          {/* Ring */}
          <div style={{
            position:"absolute",top:"50%",left:"50%",
            width:60,height:60,borderRadius:"50%",
            border:`2px solid ${C.gold}`,
            transform:"translate(-50%,-50%)",
            animation:"xpRing 1s ease forwards",
          }}/>
          <div style={{fontSize:36,fontWeight:900,color:C.gold,textShadow:`0 0 20px ${C.gold}88`,fontFamily:"'Cairo',sans-serif"}}>
            +{b.amount}⭐
          </div>
          <div style={{fontSize:12,color:C.accent,fontWeight:700,fontFamily:"'Cairo',sans-serif",marginTop:2}}>
            {b.label}
          </div>
        </div>
      ))}
    </div>,
    document.body
  );
}

// ===
// 🎁 FEATURE 2 — REWARD POP (مكافأة مفاجأة بأنيميشن بعد كل إنجاز)
// ===
let _rewardPopFn = null;
const showRewardPop = (opts) => _rewardPopFn?.(opts);

const REWARD_MESSAGES = [
  {icon:"🌸", title:"زهرة تفتحت!", desc:"كل خطوة بتعمليها بتزهر جوّاكِ"},
  {icon:"⭐", title:"نجمة جديدة!", desc:"الكون بيحتفل بيكِ دلوقتي"},
  {icon:"🦋", title:"تحوّلتِ!", desc:"اللي عملتيه ده مش بسيط"},
  {icon:"🌙", title:"حتى الليل بيشوفك!", desc:"إنتِ بتبني حاجة في الهدوء"},
  {icon:"💎", title:"أنتِ الجوهرة!", desc:"مفيش تعب بيضيع أبداً"},
  {icon:"🔥", title:"اشتعلتِ!", desc:"الطاقة دي جوّاكِ مش هتطفاش"},
];

function RewardPopSystem() {
  const [pop, setPop] = useState(null);
  useEffect(() => {
    _rewardPopFn = (opts) => {
      const msg = REWARD_MESSAGES[Math.floor(Math.random() * REWARD_MESSAGES.length)];
      setPop({...msg, ...opts});
      setTimeout(() => setPop(null), 3500);
    };
    return () => { _rewardPopFn = null; };
  }, []);
  if (!pop) return null;
  return createPortal(
    <div onClick={() => setPop(null)} style={{
      position:"fixed",inset:0,zIndex:9990,
      display:"flex",alignItems:"center",justifyContent:"center",
      background:"rgba(12,6,8,.6)",backdropFilter:"blur(6px)",
      cursor:"pointer",
    }}>
      <div style={{
        background:`linear-gradient(135deg,${C.card},${C.surface})`,
        border:`1.5px solid ${C.accent}44`,
        borderRadius:28,padding:"32px 28px",
        maxWidth:300,width:"90%",textAlign:"center",
        animation:"rewardPop .5s cubic-bezier(.34,1.4,.64,1) both",
        position:"relative",overflow:"hidden",
        boxShadow:`0 0 60px ${C.accent}22, 0 20px 60px rgba(0,0,0,.5)`,
      }}>
        {/* Shine sweep */}
        <div style={{
          position:"absolute",top:0,bottom:0,width:"40%",
          background:"linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent)",
          animation:"rewardShine 2s .3s linear infinite",
        }}/>
        {/* Top line */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,
          background:`linear-gradient(90deg,transparent,${C.accent},transparent)`}}/>
        <div style={{fontSize:56,marginBottom:12,animation:"floatEl 3s ease-in-out infinite"}}>{pop.icon}</div>
        <div style={{fontSize:18,fontWeight:900,color:C.text,marginBottom:8}}>{pop.title}</div>
        <div style={{fontSize:13,color:C.muted,lineHeight:1.7,marginBottom:16}}>{pop.desc}</div>
        <div style={{fontSize:10,color:C.dim}}>اضغطي للمتابعة</div>
      </div>
    </div>,
    document.body
  );
}

// ===
// 📊 FEATURE 3 — WEEKLY RECAP (ملخص أسبوعي سينمائي)
// ===
function WeeklyRecapModal({ show, onClose, stats }) {
  if (!show) return null;
  const { done, xp, streak, topSubject, rank } = stats;
  const grade = done >= 20 ? "أسبوع أسطوري 👑" : done >= 10 ? "أسبوع ممتاز 🌟" : done >= 5 ? "أسبوع جيد ⭐" : "بدايتك الحلوة 🌱";
  return createPortal(
    <div onClick={onClose} style={{
      position:"fixed",inset:0,zIndex:9995,
      background:"rgba(8,4,6,.92)",backdropFilter:"blur(12px)",
      display:"flex",alignItems:"flex-end",justifyContent:"center",
      fontFamily:"'Cairo',sans-serif",
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:"100%",maxWidth:480,
        background:`linear-gradient(180deg,${C.card} 0%,${C.bg} 100%)`,
        border:`1px solid ${C.borderLight}`,
        borderRadius:"24px 24px 0 0",
        padding:"28px 22px 36px",
        animation:"recapSlideIn .4s cubic-bezier(.4,0,.2,1) both",
        position:"relative",overflow:"hidden",
      }}>
        {/* Top glow line */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,
          background:`linear-gradient(90deg,transparent,${C.accent},${C.purple},transparent)`,
          animation:"shimmer 2s linear infinite",backgroundSize:"200% 100%"}}/>
        {/* Handle */}
        <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
          <div style={{width:36,height:4,borderRadius:4,background:C.dim}}/>
        </div>
        {/* Title */}
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:13,color:C.accent,fontWeight:700,letterSpacing:2,marginBottom:6}}>✦ ملخص الأسبوع ✦</div>
          <div style={{fontSize:22,fontWeight:900,color:C.text}}>{grade}</div>
        </div>
        {/* Big stats */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          {[
            {icon:"✅", val:done,     label:"مهمة منجزة", color:C.success},
            {icon:"⭐", val:xp,      label:"نجمة كُسبت",  color:C.gold},
            {icon:"🔥", val:streak,  label:"أيام متواصلة",color:C.warning},
            {icon:"💫", val:rank,    label:"مرتبتك",      color:C.accent, isText:true},
          ].map((s,i)=>(
            <div key={i} style={{
              background:`${s.color}12`,border:`1px solid ${s.color}30`,
              borderRadius:16,padding:"14px 12px",textAlign:"center",
            }}>
              <div style={{fontSize:22}}>{s.icon}</div>
              <div style={{fontSize:s.isText?14:20,fontWeight:900,color:s.color,margin:"4px 0"}}>{s.val}</div>
              <div style={{fontSize:10,color:C.muted}}>{s.label}</div>
            </div>
          ))}
        </div>
        {topSubject && (
          <div style={{
            padding:"12px 16px",borderRadius:14,marginBottom:16,
            background:`linear-gradient(135deg,${C.accentSoft},${C.purpleSoft})`,
            border:`1px solid ${C.borderLight}`,
            display:"flex",alignItems:"center",gap:10,
          }}>
            <span style={{fontSize:20}}>📚</span>
            <div>
              <div style={{fontSize:11,color:C.muted}}>المادة الأكثر نشاطاً</div>
              <div style={{fontSize:13,fontWeight:800,color:C.text}}>{topSubject}</div>
            </div>
          </div>
        )}
        {/* Motivational line */}
        <div style={{
          textAlign:"center",fontSize:12,color:C.muted,
          fontStyle:"italic",lineHeight:1.8,marginBottom:20,
        }}>
          {done > 0 ? `أنجزتِ ${done} مهمة الأسبوع ده — كل مهمة كانت اختيار 🌸` : "الأسبوع الجاي هيكون الأحسن 🌱"}
        </div>
        <button onClick={onClose} style={{
          width:"100%",padding:"13px 0",borderRadius:14,
          background:`linear-gradient(135deg,${C.accent},${C.accentDark})`,
          border:"none",color:"#fff",fontSize:14,fontWeight:900,
          boxShadow:`0 4px 20px ${C.accent}44`,cursor:"pointer",
        }}>يلا نكمل! 🌸</button>
      </div>
    </div>,
    document.body
  );
}

// ===
// MAIN APP
// ===
export default function App() {
  const [page,           setPage]           = useState("dashboard");
  const [subjects,       setSubjects]       = useState([]);
  const [lessons,        setLessons]        = useState([]);
  const [questions,      setQuestions]      = useState([]);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [currentLesson,  setCurrentLesson]  = useState(null);
  const [sideOpen,       setSideOpen]       = useState(false);
  const [appLoading,     setAppLoading]     = useState(true);
  const [appError,       setAppError]       = useState(null);
  const [showRecap,      setShowRecap]      = useState(false);
  const [recapDoneCnt,   setRecapDoneCnt]   = useState(0);
  const [showWelcome,    setShowWelcome]    = useState(false);
  const [showSurprise,   setShowSurprise]   = useState(false);
  const [showWeekly,     setShowWeekly]     = useState(false);
  const [weeklyStats,    setWeeklyStats]    = useState({done:0,xp:0,streak:0,topSubject:"",rank:"مبتدئة"});

  const go = id => { setPage(id); setSideOpen(false); };

  // navigation ===== ===== == ======
  const goToLesson = (lesson) => {
    const sub = subjects.find(s => s.id === lesson.subjectId);
    if (!sub) return;
    setCurrentSubject(sub);
    setCurrentLesson(lesson);
    setPage("questions");
    setSideOpen(false);
  };

  const goToSubject = (subject) => {
    setCurrentSubject(subject);
    setPage("lessons");
    setSideOpen(false);
  };

  // goto event (== dashboard reminder)
  useEffect(()=>{
    const h = e => go(e.detail);
    window.addEventListener("goto",h);
    return ()=>window.removeEventListener("goto",h);
  },[]);

  // Load data + wasWrong migration
  useEffect(()=>{
    // ══ Welcome Screen — أول مرة فقط ══
    const isFirstVisit = !localStorage.getItem("maha_welcomed");
    if (isFirstVisit) {
      setShowWelcome(true);
    }

    // ===== == Cache =====
    try{
      const cs=localStorage.getItem("maha_subjects");
      const cl=localStorage.getItem("maha_lessons");
      const cq=localStorage.getItem("maha_questions");
      if(cs)setSubjects(JSON.parse(cs));
      if(cl)setLessons(JSON.parse(cl));
      if(cq){setQuestions(JSON.parse(cq));setAppLoading(false);}
    }catch(_){}

    // === == Firebase
    Promise.all([
      getDocs(collection(db,"subjects")),
      getDocs(collection(db,"lessons")),
      getDocs(query(collection(db,"questions"),orderBy("createdAt","desc")))
    ]).then(async([s,l,q])=>{
      const subArr=s.docs.map(d=>({id:d.id,...d.data()}));
      const lesArr=l.docs.map(d=>({id:d.id,...d.data()}));
      let qArr=q.docs.map(d=>({id:d.id,...d.data()}));

      // Migration: == ==== ==== ===== wasWrong
      const toMigrate=qArr.filter(q=>
        q.wasWrong===undefined&&(!q.isCorrect||(q.correctStreak||0)>=3||(q.totalAttempts||0)>0||(q.wrongStreak||0)>0)
      );
      if(toMigrate.length>0){
        const mig=new Set(toMigrate.map(q=>q.id));
        qArr=qArr.map(q=>mig.has(q.id)?{...q,wasWrong:true}:q);
        toMigrate.forEach(async q=>{try{await updateDoc(doc(db,"questions",q.id),{wasWrong:true});}catch(_){}});
      }

      setSubjects(subArr); setLessons(lesArr); setQuestions(qArr);
      try{localStorage.setItem("maha_subjects",JSON.stringify(subArr));localStorage.setItem("maha_lessons",JSON.stringify(lesArr));localStorage.setItem("maha_questions",JSON.stringify(qArr));}catch(_){}
      setAppLoading(false);
      if (!isFirstVisit) toast("أهلاً مها! 🌸","info");

      // ══ Weekly Recap — يظهر مرة في الأسبوع ══
      try {
        const lastWeekly = parseInt(localStorage.getItem("maha_last_weekly") || "0");
        const now = Date.now();
        const WEEK = 7 * 24 * 60 * 60 * 1000;
        if (!isFirstVisit && now - lastWeekly > WEEK) {
          const today2 = new Date(); today2.setHours(0,0,0,0);
          const weekStart2 = new Date(today2);
          weekStart2.setDate(today2.getDate() - 7);
          const tasksSnap2 = await getDocs(collection(db,"tasks")).catch(()=>null);
          const allTasks = tasksSnap2 ? tasksSnap2.docs.map(d=>({...d.data()})) : [];
          const weekDone2 = allTasks.filter(t=>{
            const s = t.status || (t.doneAt?"done":"todo");
            if(s!=="done") return false;
            const d = t.doneAt?.toDate?.() ?? (t.doneAt ? new Date(t.doneAt) : null);
            return d && d >= weekStart2;
          });
          const weekXP = weekDone2.reduce((s,t)=>s+({high:30,medium:20,low:10}[t.priority]||20),0);
          const subCounts = {};
          weekDone2.forEach(t=>{ if(t.subject) subCounts[t.subject]=(subCounts[t.subject]||0)+1; });
          const topSub = Object.entries(subCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] || "";
          setWeeklyStats({done:weekDone2.length, xp:weekXP, streak:Math.min(7,weekDone2.length), topSubject:topSub, rank:getRank(weekXP).label});
          setTimeout(()=>setShowWeekly(true), 2000);
          localStorage.setItem("maha_last_weekly", String(now));
        }
      } catch(_){}

      // ══ Story Recap — disabled (removed) ══

      // ══ Surprise Modal — يظهر بعد فترة (مش أول زيارة) ══
      if (!isFirstVisit) {
        try {
          const lastSurprise = parseInt(localStorage.getItem("maha_last_surprise") || "0");
          const now = Date.now();
          const THREE_HOURS = 3 * 60 * 60 * 1000;
          if (now - lastSurprise > THREE_HOURS) {
            // تأخير عشوائي بين 45 ثانية و 3 دقايق
            const delay = 45000 + Math.random() * 135000;
            setTimeout(() => {
              setShowSurprise(true);
              localStorage.setItem("maha_last_surprise", String(Date.now()));
            }, delay);
          }
        } catch(_) {}
      }
    }).catch(()=>{setAppLoading(false);if(!localStorage.getItem("maha_questions"))setAppError("خطأ في تحميل البيانات — تأكدي من الاتصال بالنت");});
  },[]);

  const NAV=[
    {id:"dashboard", icon:"🏠", label:"الرئيسية"},
    {id:"subjects",  icon:"📚", label:"المواد"},
    {id:"errors",    icon:"❌", label:"الأخطاء"},
    {id:"chatbot",   icon:"🤖", label:"المساعد"},
    {id:"study",     icon:"📖", label:"مذاكرة",  more:true},
    {id:"tasks",     icon:"📋", label:"المهام",   more:true},
    {id:"notes",     icon:"📓", label:"ملاحظات",  more:true},
    {id:"mindmap",   icon:"🗺️", label:"الخريطة",  more:true},
    { id: "exambank", icon: "📋", label: "نماذج" },
  ];
  const BOT_NAV = NAV.filter(n=>!n.more);

  const subjectActive = page==="lessons"||page==="questions";
  const pageTitle = page==="lessons"?"الدروس":page==="questions"?"الأسئلة":NAV.find(n=>n.id===page)?.label||"مها";

  const renderPage = () => {
    if(appError)return(
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",flexDirection:"column",gap:15,padding:20,textAlign:"center"}}>
        <div style={{fontSize:46}}>😕</div><div style={{fontSize:16,fontWeight:800,color:C.danger}}>{appError}</div>
        <Btn onClick={()=>window.location.reload()}>🔄 إعادة المحاولة</Btn>
      </div>
    );
    if(appLoading)return(
      <div style={{padding:18}}>
        <div style={{height:52,background:C.bg,borderBottom:`1px solid ${C.border}`,position:"fixed",top:0,left:0,right:0,zIndex:500}}/>
        <div style={{marginTop:62,display:"flex",flexDirection:"column",gap:11}}>
          {[1,2,3,4].map(i=>(
            <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:13,padding:15,animation:`pulse 1.5s infinite ${i*.15}s`}}>
              <div style={{height:11,background:C.surface,borderRadius:5,marginBottom:9,width:"58%"}}/>
              <div style={{height:9,background:C.surface,borderRadius:5,width:"38%"}}/>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:18,color:C.muted,fontSize:12}}>جاري تحميل بياناتك...</div>
      </div>
    );
    if(page==="lessons"&&currentSubject)return<Lessons subject={currentSubject} lessons={lessons} setLessons={setLessons} setCurrentLesson={setCurrentLesson} setPage={setPage} questions={questions}/>;
    if(page==="questions"&&currentLesson)return<Questions lesson={currentLesson} subject={currentSubject} questions={questions} setQuestions={setQuestions} setPage={setPage}/>;
    switch(page){
      case "dashboard":   return <Dashboard subjects={subjects} questions={questions} onNav={go}/>;
      case "subjects":    return <Subjects  subjects={subjects} setSubjects={setSubjects} setCurrentSubject={setCurrentSubject} setPage={setPage} lessons={lessons} setLessons={setLessons} questions={questions} setQuestions={setQuestions}/>;
      case "errors":      return <ErrorsReview questions={questions} subjects={subjects} setQuestions={setQuestions}/>;
      case "study":       return <Study questions={questions} setQuestions={setQuestions} subjects={subjects} lessons={lessons}/>;
      case "tasks":       return <Tasks subjects={subjects} avatarSrc={AVATAR_SRC}/>;
      case "notes":       return <Notes subjects={subjects}/>;
      case "chatbot":     return <Chatbot questions={questions} subjects={subjects} lessons={lessons}/>;
      case "mindmap":     return <MindMapPage subjects={subjects} lessons={lessons} questions={questions} setCurrentSubject={setCurrentSubject} setCurrentLesson={setCurrentLesson} setPage={setPage}/>;
      case "exambank": return <ExamBank />;   // ← أضيفي السطر ده

      default:            return <Dashboard subjects={subjects} questions={questions} onNav={go}/>;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <FlowerBg/>
      <ToastContainer/>
      <DialogContainer/>
      <NetworkStatus/>
      <XpBurstSystem/>
      <RewardPopSystem/>
      <WeeklyRecapModal
        show={showWeekly}
        onClose={()=>setShowWeekly(false)}
        stats={weeklyStats}
      />

      {/* Welcome Screen — أول مرة */}
      {showWelcome && (
        <WelcomeScreen onDone={()=>{
          setShowWelcome(false);
          localStorage.setItem("maha_welcomed","1");
          toast("أهلاً وسهلاً يا مها! 🌸","info");
        }}/>
      )}

      {/* Surprise Modal — مفاجآت دورية */}
      <SurpriseModal
        show={showSurprise}
        onClose={()=>setShowSurprise(false)}
      />

      {/* StoryRecapModal disabled */}

      {/* Mobile Header — Sakura */}
      <div className="mob-header" style={{background:`linear-gradient(180deg,${C.bg},${C.bg}EE)`,backdropFilter:"blur(12px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <div style={{width:26,height:26,borderRadius:8,
            background:`linear-gradient(135deg,${C.accent},${C.accentDark})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:12,fontWeight:900,color:"#fff",
            boxShadow:`0 2px 8px ${C.accent}55`}}>🌸</div>
          <span style={{fontWeight:800,fontSize:13,color:C.text,letterSpacing:.3}}>مها</span>
        </div>
        <span style={{fontSize:12,fontWeight:600,color:C.muted}}>{pageTitle}</span>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <button onClick={()=>setShowWeekly(true)}
            style={{width:30,height:30,borderRadius:7,background:C.accentSoft,
              border:`1px solid ${C.accent}33`,color:C.accent,fontSize:13,
              display:"flex",alignItems:"center",justifyContent:"center"}}>📊</button>
          <button onClick={()=>setSideOpen(o=>!o)}
            style={{width:32,height:32,borderRadius:7,background:C.surface,
              border:`1px solid ${C.border}`,color:C.text,fontSize:15,
              display:"flex",alignItems:"center",justifyContent:"center"}}>☰</button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sideOpen&&<div onClick={()=>setSideOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:550}}/>}

      <div className="app-wrap">
        <div className={"sidebar"+(sideOpen?" open":"")}>
          {/* Logo — Sakura */}
          <div style={{display:"flex",alignItems:"center",gap:9,padding:"6px 10px 16px",
            borderBottom:`1px solid ${C.border}`,marginBottom:8}}>
            <div style={{width:32,height:32,borderRadius:10,
              background:`linear-gradient(135deg,${C.accent},${C.accentDark})`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:16,flexShrink:0,
              boxShadow:`0 4px 14px ${C.accent}44`}}>🌸</div>
            <div>
              <div style={{fontSize:14,fontWeight:900,color:C.text,letterSpacing:.3}}>مها</div>
              <div style={{fontSize:9,color:C.accent,fontWeight:600,letterSpacing:1}}>SAKURA ✦</div>
            </div>
          </div>

          {/* Nav items — Linear style */}
          {NAV.map(n=>{
            const active=page===n.id||(subjectActive&&n.id==="subjects");
            return(
              <div key={n.id} onClick={()=>go(n.id)}
                className={"nav-item"+(active?" active":"")}>
                <span style={{fontSize:14,flexShrink:0,opacity:active?1:.7}}>{n.icon}</span>
                <span style={{flex:1}}>{n.label}</span>
              </div>
            );
          })}

          {/* Stats — minimal */}
          <div style={{marginTop:"auto",padding:"12px 10px 4px",borderTop:`1px solid ${C.border}`}}>
            {[
              ["❌",questions.filter(q=>!q.isCorrect).length,"خطأ",C.danger],
              ["✓",questions.filter(q=>q.wasWrong&&q.isCorrect).length,"تعلمتِ",C.success],
              ["📚",subjects.length,"مادة",C.muted],
            ].map(([ic,val,lb,cl],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0"}}>
                <span style={{fontSize:11,color:C.muted}}>{ic} {lb}</span>
                <span style={{fontSize:11,fontWeight:700,color:cl}}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="main-col">
          <div className="page-scroll">
            <div className="page-inner fade" key={page}>
              {renderPage()}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav — Sakura */}
      <div className="bot-nav" style={{background:`${C.bg}F5`,backdropFilter:"blur(16px)",borderTop:`1px solid ${C.border}`}}>
        {BOT_NAV.map(n=>{
          const active=page===n.id||(subjectActive&&n.id==="subjects");
          return(
            <button key={n.id} onClick={()=>go(n.id)}
              style={{background:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"3px 6px",minWidth:46,
                color:active?C.accent:C.dim,transition:"all .15s",position:"relative"}}>
              {active&&<div style={{position:"absolute",top:-8,left:"50%",transform:"translateX(-50%)",
                width:28,height:3,borderRadius:3,
                background:`linear-gradient(90deg,${C.accent},${C.purple})`,
                boxShadow:`0 0 8px ${C.accent}88`}}/>}
              <span style={{fontSize:19,transition:"transform .15s",transform:active?"scale(1.15)":"scale(1)"}}>{n.icon}</span>
              <span style={{fontSize:9,fontWeight:active?800:400}}>{n.label}</span>
            </button>
          );
        })}
        <button onClick={()=>setSideOpen(o=>!o)}
          style={{background:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"3px 6px",minWidth:46,
            color:sideOpen?C.accent:C.dim}}>
          <span style={{fontSize:19}}>☰</span>
          <span style={{fontSize:9}}>المزيد</span>
        </button>
      </div>
    </>
  );
}