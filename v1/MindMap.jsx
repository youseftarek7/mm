import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { db } from "./firebase";
import {
  collection, addDoc, deleteDoc,
  doc, updateDoc, onSnapshot
} from "firebase/firestore";

// ═══════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════
const C = {
  bg:"#0F0A14", bgDeep:"#09060D", surface:"#1A1220", card:"#201829",
  border:"rgba(255,210,245,0.07)", borderLight:"rgba(255,210,245,0.14)",
  accent:"#F472B6", accentDark:"#DB2777", accentSoft:"rgba(244,114,182,0.13)",
  purple:"#C084FC", purpleSoft:"rgba(192,132,252,0.12)",
  gold:"#FCD34D", success:"#34D399", danger:"#F87171", warning:"#FB923C",
  text:"#FAF5FF", muted:"#A78BB8", dim:"#4B3860",
  pink:"#F9A8D4", teal:"#5EEAD4",
  glassLight:"rgba(255,255,255,0.04)",
  glassBorder:"rgba(255,255,255,0.07)",
};

const SUBJECT_COLORS = [
  { main:"#E879A0", soft:"rgba(232,121,160,0.15)" },
  { main:"#B48EF5", soft:"rgba(180,142,245,0.15)" },
  { main:"#7BE0D4", soft:"rgba(123,224,212,0.15)" },
  { main:"#F4C97A", soft:"rgba(244,201,122,0.15)" },
  { main:"#6EE7B7", soft:"rgba(110,231,183,0.15)" },
  { main:"#F9A8D4", soft:"rgba(249,168,212,0.15)" },
  { main:"#FBB86C", soft:"rgba(251,184,108,0.15)" },
  { main:"#FC8181", soft:"rgba(252,129,129,0.15)" },
];

const CONCEPT_COLORS = ["#E879A0","#B48EF5","#7BE0D4","#F4C97A","#6EE7B7","#FBB86C","#F9A8D4","#FC8181"];
const NODE_ICONS     = ["💡","📌","⭐","🔑","📚","⚡","🎯","🧩","💎","🔥","📝","🌟"];

const CONCEPT_TYPES = [
  { id:"main",    label:"فكرة رئيسية", icon:"💡", color:"#E879A0", grad:"linear-gradient(135deg,#E879A0,#C85F84)", desc:"الفكرة المحورية الكبيرة",            examples:["المتوسط الحسابي","قانون نيوتن","النظرية العامة","التفاضل والتكامل"] },
  { id:"sub",     label:"مفهوم فرعي",  icon:"🔑", color:"#B48EF5", grad:"linear-gradient(135deg,#B48EF5,#8B5CF6)", desc:"مفهوم يتفرع من الفكرة الرئيسية",    examples:["الانحراف المعياري","التسارع","الضغط الجوي","المتغير التابع"] },
  { id:"example", label:"مثال",        icon:"⭐", color:"#F4C97A", grad:"linear-gradient(135deg,#F4C97A,#FBB86C)", desc:"مثال توضيحي أو تطبيق عملي",          examples:["مثال: ١٠ طلاب","مثال: كرة تسقط","تطبيق: مسألة ٣"] },
  { id:"note",    label:"ملاحظة",      icon:"📌", color:"#7BE0D4", grad:"linear-gradient(135deg,#7BE0D4,#6EE7B7)", desc:"معلومة مهمة تريد تذكرها",            examples:["تنبيه: لا تنسي الوحدة","استثناء مهم","الفرق بين س و ص"] },
];

const DIFFICULTY = [
  { id:"easy",   label:"سهل",   color:"#6EE7B7", icon:"🟢" },
  { id:"medium", label:"متوسط", color:"#F4C97A", icon:"🟡" },
  { id:"hard",   label:"صعب",   color:"#FC8181", icon:"🔴" },
];

const TEMPLATES = [
  {
    id:"compare", label:"مقارنة", icon:"⚖️", desc:"قارن بين فكرتين أو أكثر", color:"#B48EF5",
    nodes:[
      { text:"العنصر الأول",  x:-160, y:0,    conceptType:"main",    icon:"💡", color:"#E879A0" },
      { text:"العنصر الثاني", x:160,  y:0,    conceptType:"main",    icon:"💡", color:"#B48EF5" },
      { text:"أوجه الشبه",    x:0,    y:-120, conceptType:"sub",     icon:"🔑", color:"#7BE0D4" },
      { text:"أوجه الاختلاف", x:0,    y:120,  conceptType:"sub",     icon:"🔑", color:"#F4C97A" },
    ],
    links:[{from:0,to:2},{from:0,to:3},{from:1,to:2},{from:1,to:3}],
  },
  {
    id:"problem", label:"حل مشكلة", icon:"🎯", desc:"خطوات حل مشكلة أو مسألة", color:"#E879A0",
    nodes:[
      { text:"المشكلة",    x:0,    y:-150, conceptType:"main",    icon:"🎯", color:"#E879A0" },
      { text:"الأسباب",    x:-140, y:0,   conceptType:"sub",     icon:"🔑", color:"#FC8181" },
      { text:"الحلول",     x:140,  y:0,   conceptType:"sub",     icon:"🔑", color:"#6EE7B7" },
      { text:"النتيجة",    x:0,    y:150, conceptType:"example", icon:"⭐", color:"#F4C97A" },
    ],
    links:[{from:0,to:1},{from:0,to:2},{from:1,to:3},{from:2,to:3}],
  },
  {
    id:"lesson", label:"درس كامل", icon:"📚", desc:"هيكل مثالي لتلخيص درس", color:"#7BE0D4",
    nodes:[
      { text:"الفكرة الرئيسية", x:0,    y:0,   conceptType:"main",    icon:"💡", color:"#E879A0" },
      { text:"مفهوم فرعي ١",    x:-200, y:0,   conceptType:"sub",     icon:"🔑", color:"#B48EF5" },
      { text:"مفهوم فرعي ٢",    x:200,  y:0,   conceptType:"sub",     icon:"🔑", color:"#7BE0D4" },
      { text:"مثال ١",          x:-200, y:130, conceptType:"example", icon:"⭐", color:"#F4C97A" },
      { text:"مثال ٢",          x:200,  y:130, conceptType:"example", icon:"⭐", color:"#F4C97A" },
      { text:"ملاحظة مهمة",     x:0,    y:160, conceptType:"note",    icon:"📌", color:"#7BE0D4" },
    ],
    links:[{from:0,to:1},{from:0,to:2},{from:1,to:3},{from:2,to:4},{from:0,to:5}],
  },
  {
    id:"timeline", label:"تسلسل زمني", icon:"⏱️", desc:"ترتيب الأحداث أو الخطوات", color:"#F4C97A",
    nodes:[
      { text:"الخطوة الأولى",  x:-240, y:0, conceptType:"main",    icon:"1️⃣", color:"#E879A0" },
      { text:"الخطوة الثانية", x:-80,  y:0, conceptType:"sub",     icon:"2️⃣", color:"#B48EF5" },
      { text:"الخطوة الثالثة", x:80,   y:0, conceptType:"sub",     icon:"3️⃣", color:"#7BE0D4" },
      { text:"النتيجة",        x:240,  y:0, conceptType:"example", icon:"✅", color:"#6EE7B7" },
    ],
    links:[{from:0,to:1,label:"ثم"},{from:1,to:2,label:"ثم"},{from:2,to:3,label:"فـ"}],
  },
];

// ═══════════════════════════════════════
// GLOBAL CSS
// ═══════════════════════════════════════
const KEYFRAMES = `
  @keyframes scaleIn{from{transform:scale(0.3);opacity:0}55%{transform:scale(1.09)}to{transform:scale(1);opacity:1}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(44px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideR{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
  @keyframes slideL{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}
  @keyframes glow{0%,100%{box-shadow:0 0 14px rgba(232,121,160,0.38)}50%{box-shadow:0 0 34px rgba(232,121,160,0.78)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  @keyframes pop{0%{transform:scale(.92)}60%{transform:scale(1.06)}100%{transform:scale(1)}}
  @keyframes checkIn{0%{transform:scale(0) rotate(-20deg)}70%{transform:scale(1.2) rotate(6deg)}100%{transform:scale(1) rotate(0)}}
  @keyframes pulseRing{0%{transform:scale(1);opacity:.7}100%{transform:scale(1.6);opacity:0}}

  .mm-enter{animation:scaleIn .32s cubic-bezier(.34,1.56,.64,1) both}
  .mm-fade{animation:fadeUp .2s ease both}
  .mm-slide-up{animation:slideUp .28s cubic-bezier(.4,0,.2,1) both}
  .mm-slide-down{animation:slideDown .2s ease both}
  .mm-slide-r{animation:slideR .24s cubic-bezier(.4,0,.2,1) both}
  .mm-slide-l{animation:slideL .24s cubic-bezier(.4,0,.2,1) both}
  .mm-pop{animation:pop .2s ease both}
  .mm-glow{animation:glow 2.2s ease-in-out infinite}
  .mm-float{animation:float 3s ease-in-out infinite}

  .tap{transition:transform .12s,opacity .12s;cursor:pointer;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent}
  .tap:active{transform:scale(.94)!important;opacity:.85!important}

  /* Desktop hover for icon buttons */
  @media(hover:hover){
    .icon-btn:hover:not(:disabled){background:rgba(255,220,240,0.10)!important;border-color:rgba(255,220,240,0.22)!important;color:#F5EEF8!important;transform:translateY(-1px);}
    .icon-btn-danger:hover:not(:disabled){background:rgba(252,129,129,0.15)!important;color:#FC8181!important;transform:translateY(-1px);}
    .icon-btn-link:hover:not(:disabled){background:rgba(180,142,245,0.18)!important;border-color:rgba(180,142,245,0.5)!important;color:#B48EF5!important;transform:translateY(-1px);}
    .icon-btn-link-active{background:rgba(180,142,245,0.22)!important;border-color:#B48EF5!important;color:#B48EF5!important;}
    .cnode-g:hover .cnode-hover-ring{opacity:1!important;}
    .zoom-btn:hover{background:#362840!important;transform:scale(1.08);}
    .fab-btn:hover{transform:translateX(-50%) translateY(-2px) scale(1.04)!important;box-shadow:0 10px 36px rgba(232,121,160,.65)!important;}
  }

  .mm-input{
    background:rgba(255,255,255,0.04);
    border:1.5px solid rgba(255,220,240,0.13);
    color:#F5EEF8;
    font-family:'Cairo',sans-serif;
    direction:rtl;
    transition:border-color .2s,box-shadow .2s;
    outline:none;
  }
  .mm-input:focus{
    border-color:#E879A0!important;
    box-shadow:0 0 0 3px rgba(232,121,160,0.18)!important;
    background:rgba(232,121,160,0.05)!important;
  }
  .mm-input::placeholder{color:#554860}
  textarea.mm-input{resize:none}
  select.mm-input option{background:#271F2B;color:#F5EEF8}

  .chip{transition:all .15s;cursor:pointer;-webkit-tap-highlight-color:transparent}
  .chip:hover{background:rgba(255,220,240,0.1)!important;color:#F5EEF8!important}
  .chip:active{transform:scale(.95)}

  .type-card{transition:border-color .18s,background .18s,box-shadow .18s,transform .15s;cursor:pointer;-webkit-tap-highlight-color:transparent}
  .type-card:active{transform:scale(.97)}

  /* Link tooltip */
  .link-tooltip{
    position:fixed;
    background:#271F2B;
    border:1px solid rgba(180,142,245,0.4);
    border-radius:10px;
    padding:6px 11px;
    font-size:11px;
    font-family:'Cairo',sans-serif;
    color:#F5EEF8;
    pointer-events:none;
    z-index:999;
    white-space:nowrap;
    box-shadow:0 4px 16px rgba(0,0,0,0.5);
    direction:rtl;
    animation:fadeUp .15s ease both;
  }
  .link-tooltip .arrow-from{color:#E879A0;font-weight:800;}
  .link-tooltip .arrow-to{color:#7BE0D4;font-weight:800;}

  /* Keyboard shortcut badge */
  .kbd{
    display:inline-flex;align-items:center;justify-content:center;
    background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);
    border-radius:5px;padding:1px 5px;font-size:9px;color:#9D8AAA;
    font-family:monospace;letter-spacing:.5px;
  }
`;

// ═══════════════════════════════════════
// STATS VIEW
// ═══════════════════════════════════════
function StatsView({ subjects, lessons, questions }) {
  const totalQ    = questions.length;
  const totalErr  = questions.filter(q=>!q.isCorrect).length;
  const totalMast = questions.filter(q=>(q.correctStreak||0)>=3).length;
  const acc       = totalQ ? Math.round(((totalQ-totalErr)/totalQ)*100) : 0;
  const [open, setOpen] = useState(null);

  return (
    <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:10, paddingBottom:16 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:7 }}>
        {[["🎯",`${acc}%`,"دقة",acc>=80?C.success:acc>=50?C.gold:C.danger],["❌",totalErr,"خطأ",C.danger],["🏆",totalMast,"أتقنته",C.success],["📚",subjects.length,"مادة",C.purple]].map(([ic,vl,lb,cl],i)=>(
          <div key={i} style={{ background:`${cl}14`, border:`1px solid ${cl}33`, borderRadius:14, padding:"11px 6px", textAlign:"center" }}>
            <div style={{ fontSize:18 }}>{ic}</div>
            <div style={{ fontSize:19, fontWeight:900, color:cl, lineHeight:1.2 }}>{vl}</div>
            <div style={{ fontSize:10, color:C.muted }}>{lb}</div>
          </div>
        ))}
      </div>
      {totalQ>0&&(
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"13px 14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:C.muted, marginBottom:9 }}>
            <span>التقدم الإجمالي</span><span style={{ fontWeight:800, color:C.gold }}>{acc}%</span>
          </div>
          <div style={{ height:8, borderRadius:10, background:C.surface, overflow:"hidden", position:"relative" }}>
            <div style={{ position:"absolute", left:0, top:0, height:"100%", width:(totalMast/totalQ*100)+"%", borderRadius:10, background:`linear-gradient(90deg,${C.success},${C.teal})`, transition:"width .8s" }}/>
            <div style={{ position:"absolute", left:0, top:0, height:"100%", width:((totalQ-totalErr)/totalQ*100)+"%", borderRadius:10, background:`linear-gradient(90deg,${C.accent},${C.gold})`, opacity:.4, transition:"width .8s" }}/>
          </div>
        </div>
      )}
      {subjects.map((s,i)=>{
        const color=SUBJECT_COLORS[i%SUBJECT_COLORS.length], subL=lessons.filter(l=>l.subjectId===s.id), subQ=questions.filter(q=>q.subjectId===s.id), err=subQ.filter(q=>!q.isCorrect).length, sAcc=subQ.length?Math.round(((subQ.length-err)/subQ.length)*100):0, isOpen=open===s.id;
        return (
          <div key={s.id} style={{ background:C.card, border:`1px solid ${color.main}33`, borderRadius:14 }}>
            <div onClick={()=>setOpen(isOpen?null:s.id)} style={{ padding:"13px 14px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:9, flex:1, minWidth:0 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:color.soft, display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, flexShrink:0 }}>{s.icon}</div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontWeight:800, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.name}</div>
                  <div style={{ fontSize:10, color:C.muted }}>{subL.length} درس · {subQ.length} سؤال</div>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                <span style={{ fontSize:16, fontWeight:900, color:sAcc>=80?C.success:sAcc>=50?C.gold:C.danger }}>{sAcc}%</span>
                <span style={{ color:C.dim, transform:isOpen?"rotate(180deg)":"none", transition:"transform .2s", display:"block" }}>▾</span>
              </div>
            </div>
            <div style={{ padding:"0 14px 10px" }}>
              <div style={{ height:4, borderRadius:10, background:C.surface, overflow:"hidden" }}><div style={{ height:"100%", width:sAcc+"%", borderRadius:10, background:`linear-gradient(90deg,${color.main},${color.main}88)`, transition:"width .6s" }}/></div>
            </div>
            {isOpen&&(
              <div style={{ padding:"0 14px 12px", display:"flex", flexDirection:"column", gap:5, borderTop:`1px solid ${C.border}`, paddingTop:10 }}>
                {subL.map(l=>{ const lq=questions.filter(q=>q.lessonId===l.id), le=lq.filter(q=>!q.isCorrect).length, lAcc=lq.length?Math.round(((lq.length-le)/lq.length)*100):null; return (
                  <div key={l.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", background:"rgba(255,255,255,.03)", borderRadius:9 }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:le>0?C.danger:lq.length>0?C.success:C.dim, flexShrink:0 }}/>
                    <span style={{ flex:1, fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.name}</span>
                    {lAcc!==null&&<span style={{ fontSize:11, fontWeight:700, color:lAcc>=80?C.success:lAcc>=50?C.gold:C.danger }}>{lAcc}%</span>}
                  </div>
                ); })}
                {subL.length===0&&<div style={{ fontSize:11, color:C.dim, textAlign:"center", padding:8 }}>لا يوجد دروس</div>}
              </div>
            )}
          </div>
        );
      })}
      {subjects.length===0&&<div style={{ textAlign:"center", padding:40, color:C.muted }}><div style={{ fontSize:48, marginBottom:10 }}>📊</div><div>مفيش بيانات لسه</div></div>}
    </div>
  );
}

// ═══════════════════════════════════════
// QUIZ MODE
// ═══════════════════════════════════════
function QuizMode({ concepts, onClose }) {
  const pool=[...concepts.filter(c=>c.text)].sort(()=>Math.random()-.5);
  const [idx,setIdx]=useState(0), [rev,setRev]=useState(false), [score,setScore]=useState({c:0,w:0}), [done,setDone]=useState(false);
  if (!pool.length) return <MobileSheet onClose={onClose} title="اختبار سريع"><div style={{ padding:32, textAlign:"center", color:C.muted }}>مفيش مفاهيم للاختبار</div></MobileSheet>;
  const cur=pool[idx], ti=CONCEPT_TYPES.find(t=>t.id===cur?.conceptType)||CONCEPT_TYPES[0], total=score.c+score.w;
  const next=(correct)=>{ const ns={c:correct?score.c+1:score.c,w:correct?score.w:score.w+1}; if(total+1>=Math.min(pool.length,10)){setScore(ns);setDone(true);return;} setScore(ns);setIdx(i=>i+1);setRev(false); };
  if (done) return (
    <MobileSheet onClose={onClose} title="انتهى الاختبار!">
      <div style={{ padding:24, display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
        <div style={{ fontSize:56 }}>{score.c>score.w?"🏆":"📚"}</div>
        <div style={{ fontSize:13, color:C.muted }}>✅ {score.c} صح &nbsp;·&nbsp; ❌ {score.w} غلط</div>
        <div style={{ height:8, borderRadius:10, background:C.surface, overflow:"hidden", width:"100%" }}><div style={{ height:"100%", width:`${Math.round(score.c/(total||1)*100)}%`, background:`linear-gradient(90deg,${C.success},${C.teal})`, borderRadius:10 }}/></div>
        <div style={{ display:"flex", gap:8, width:"100%" }}>
          <MmBtn onClick={()=>{ setScore({c:0,w:0}); setIdx(0); setRev(false); setDone(false); }}>🔄 من جديد</MmBtn>
          <MmBtn secondary onClick={onClose}>إغلاق</MmBtn>
        </div>
      </div>
    </MobileSheet>
  );
  return (
    <MobileSheet onClose={onClose} title="🎯 اختبار سريع" badge={`${total+1}/${Math.min(pool.length,10)}`}>
      <div style={{ padding:16, display:"flex", flexDirection:"column", gap:13 }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.muted }}>
          <span>✅ {score.c}</span><span>❌ {score.w}</span>
        </div>
        <div style={{ background:`${ti.color}14`, border:`1.5px solid ${ti.color}44`, borderRadius:18, padding:24, textAlign:"center" }}>
          <div style={{ fontSize:36, marginBottom:8 }}>{cur.icon||ti.icon}</div>
          <div style={{ fontSize:11, color:ti.color, fontWeight:700, marginBottom:10 }}>{ti.icon} {ti.label}</div>
          <div style={{ fontSize:18, fontWeight:900, color:C.text }}>{cur.text}</div>
          {rev&&cur.definition&&<div style={{ fontSize:12, color:C.muted, marginTop:12, padding:"10px 14px", background:C.card, borderRadius:12, lineHeight:1.8, textAlign:"right" }}>{cur.definition}</div>}
        </div>
        {!rev
          ? <MmBtn onClick={()=>setRev(true)}>👁 أظهر الإجابة</MmBtn>
          : <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>next(true)} className="tap" style={{ flex:1, padding:"13px", borderRadius:14, fontFamily:"'Cairo',sans-serif", fontWeight:800, fontSize:13, background:"rgba(110,231,183,0.15)", border:`1.5px solid ${C.success}55`, color:C.success }}>✅ عارفاها</button>
              <button onClick={()=>next(false)} className="tap" style={{ flex:1, padding:"13px", borderRadius:14, fontFamily:"'Cairo',sans-serif", fontWeight:800, fontSize:13, background:"rgba(252,129,129,0.15)", border:`1.5px solid ${C.danger}55`, color:C.danger }}>❌ مش عارفاها</button>
            </div>
        }
      </div>
    </MobileSheet>
  );
}

// ═══════════════════════════════════════
// TEMPLATE SVG MINI PREVIEW
// ═══════════════════════════════════════
function TemplateMiniPreview({ template }) {
  const W=220, H=140;
  // normalize node positions to fit in W×H
  const xs=template.nodes.map(n=>n.x), ys=template.nodes.map(n=>n.y);
  const minX=Math.min(...xs)-60, maxX=Math.max(...xs)+60;
  const minY=Math.min(...ys)-40, maxY=Math.max(...ys)+40;
  const rangeX=maxX-minX||1, rangeY=maxY-minY||1;
  const pad=18;
  const nx=x=>pad+(x-minX)/rangeX*(W-pad*2);
  const ny=y=>pad+(y-minY)/rangeY*(H-pad*2);
  const NW=52, NH=30;
  return (
    <svg width={W} height={H} style={{ borderRadius:10, display:"block" }}>
      <rect width={W} height={H} fill="rgba(0,0,0,0.3)" rx={10}/>
      {/* Links */}
      {template.links.map((lk,i)=>{
        const n1=template.nodes[lk.from], n2=template.nodes[lk.to];
        if (!n1||!n2) return null;
        const x1=nx(n1.x), y1=ny(n1.y), x2=nx(n2.x), y2=ny(n2.y);
        const mx=(x1+x2)/2, my=(y1+y2)/2;
        const dx=x2-x1, dy=y2-y1, len=Math.hypot(dx,dy)||1;
        const cpx=mx-(dy*0.25), cpy=my+(dx*0.25);
        return (
          <g key={i}>
            <path d={`M${x1},${y1} Q${cpx},${cpy} ${x2},${y2}`} fill="none"
              stroke={n1.color} strokeWidth={1.5} opacity={0.5}
              markerEnd="url(#mini-arrow)"/>
            <circle cx={x1} cy={y1} r={3} fill={n1.color} opacity={0.7}/>
          </g>
        );
      })}
      {/* Nodes */}
      {template.nodes.map((n,i)=>(
        <g key={i}>
          <rect x={nx(n.x)-NW/2} y={ny(n.y)-NH/2} width={NW} height={NH} rx={8}
            fill={n.color+"22"} stroke={n.color} strokeWidth={1.2} opacity={0.9}/>
          <text x={nx(n.x)} y={ny(n.y)+4} textAnchor="middle"
            fontSize={7} fill="#FAF5FF" fontFamily="Cairo,sans-serif" fontWeight="700">
            {n.text.length>8?n.text.slice(0,8)+"…":n.text}
          </text>
        </g>
      ))}
      <defs>
        <marker id="mini-arrow" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
          <polygon points="0 0, 6 2.5, 0 5" fill="rgba(255,255,255,0.5)"/>
        </marker>
      </defs>
    </svg>
  );
}

// ═══════════════════════════════════════
// TEMPLATE GUIDED FILL
// ═══════════════════════════════════════
function TemplateGuidedFill({ template, onConfirm, onBack }) {
  const [values, setValues] = useState(template.nodes.map(n=>n.text));
  const [step, setStep]     = useState(0); // which node we're filling
  const inputRef = useRef();

  useEffect(()=>{ setTimeout(()=>inputRef.current?.focus(), 150); },[step]);

  const cur   = template.nodes[step];
  const total = template.nodes.length;
  const ti    = CONCEPT_TYPES.find(t=>t.id===cur?.conceptType)||CONCEPT_TYPES[0];
  const progress = ((step)/total)*100;

  const goNext = () => { if(step<total-1) setStep(s=>s+1); else onConfirm(values); };
  const goBack = () => { if(step>0) setStep(s=>s-1); else onBack(); };

  // usage hints per concept type
  const HINTS = {
    main:    "الفكرة الأساسية — اكتب الموضوع الرئيسي بوضوح",
    sub:     "مفهوم فرعي — فكرة تتفرع من المركز",
    example: "مثال حقيقي — طبّق الفكرة على حالة عملية",
    note:    "ملاحظة — معلومة مهمة أو استثناء تريد تذكره",
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      {/* Progress */}
      <div style={{ height:3, background:"rgba(255,255,255,.06)", flexShrink:0 }}>
        <div style={{ height:"100%", width:`${progress}%`, background:`linear-gradient(90deg,${template.color},${C.purple})`, borderRadius:2, transition:"width .4s cubic-bezier(.4,0,.2,1)" }}/>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"16px 18px 8px", display:"flex", flexDirection:"column", gap:14 }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:11, background:`${cur.color}22`, border:`1.5px solid ${cur.color}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{cur.icon}</div>
          <div>
            <div style={{ fontSize:13, fontWeight:900, color:C.text, fontFamily:"'Cairo',sans-serif" }}>
              {ti.icon} {ti.label}
              <span style={{ fontSize:10, color:C.dim, fontWeight:400, marginRight:6 }}>({step+1} من {total})</span>
            </div>
            <div style={{ fontSize:10, color:C.muted }}>{HINTS[cur.conceptType]||""}</div>
          </div>
        </div>

        {/* Mini map — show all nodes, highlight current */}
        <div style={{ background:"rgba(0,0,0,.3)", borderRadius:14, padding:8, border:"1px solid rgba(255,255,255,.06)" }}>
          <div style={{ fontSize:9, color:C.dim, marginBottom:6, textAlign:"center" }}>موقعه في الخريطة</div>
          <div style={{ display:"flex", justifyContent:"center" }}>
            <TemplateMiniPreview template={{
              ...template,
              nodes: template.nodes.map((n,i)=>({
                ...n,
                text: values[i]||n.text,
                color: i===step ? C.accent : n.color,
              }))
            }}/>
          </div>
        </div>

        {/* All nodes list — quick overview */}
        <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
          {template.nodes.map((n,i)=>{
            const done = i<step, active = i===step;
            return (
              <div key={i} onClick={()=>setStep(i)} style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 11px", borderRadius:11, cursor:"pointer",
                background: active?`${template.color}15`:"rgba(255,255,255,.02)",
                border:`1px solid ${active?template.color:done?"rgba(255,255,255,.08)":"rgba(255,255,255,.04)"}`,
                transition:"all .15s" }}>
                <div style={{ width:20, height:20, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, flexShrink:0,
                  background: done?C.success+"33":active?`${template.color}33`:"rgba(255,255,255,.05)",
                  border:`1px solid ${done?C.success:active?template.color:"rgba(255,255,255,.1)"}`,
                  color: done?C.success:active?template.color:C.dim }}>
                  {done?"✓":i+1}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <span style={{ fontSize:10, color:n.color, fontWeight:700 }}>{n.icon} </span>
                  <span style={{ fontSize:11, color:active?C.text:done?C.muted:C.dim, fontWeight:active?700:400 }}>
                    {values[i]&&values[i]!==n.text ? values[i] : n.text}
                  </span>
                </div>
                {active&&<span style={{ fontSize:10, color:template.color }}>← الآن</span>}
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)", fontSize:16, pointerEvents:"none" }}>{cur.icon}</div>
          <input ref={inputRef}
            value={values[step]}
            onChange={e=>setValues(v=>{ const n=[...v]; n[step]=e.target.value; return n; })}
            onKeyDown={e=>{ if(e.key==="Enter") goNext(); if(e.key==="Escape") goBack(); }}
            placeholder={`اكتب ${ti.label}...`}
            className="mm-input"
            style={{ width:"100%", padding:"13px 44px 13px 14px", borderRadius:14, fontSize:14, fontWeight:700, borderColor:cur.color+"88" }}
          />
        </div>

        {/* Context tip */}
        <div style={{ padding:"10px 13px", borderRadius:12, background:`${template.color}0D`, border:`1px solid ${template.color}22`, fontSize:11, color:C.muted, lineHeight:1.7 }}>
          💡 <span style={{ color:template.color, fontWeight:700 }}>مثال: </span>
          {ti.examples?.[step%ti.examples.length]||"اكتب ما يناسبك"}
        </div>
      </div>

      {/* Footer buttons */}
      <div style={{ padding:"12px 18px 32px", display:"flex", gap:8, flexShrink:0, borderTop:`1px solid ${C.border}` }}>
        <button onClick={goBack} className="tap"
          style={{ padding:"12px 16px", borderRadius:13, fontFamily:"'Cairo',sans-serif", fontWeight:700, fontSize:13, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.09)", color:C.muted }}>
          → رجوع
        </button>
        <button onClick={goNext} className="tap"
          style={{ flex:1, padding:"14px", borderRadius:15, fontFamily:"'Cairo',sans-serif", fontWeight:900, fontSize:14,
            background:`linear-gradient(135deg,${template.color},${C.purple})`,
            border:"none", color:"#fff", boxShadow:`0 6px 22px ${template.color}44`,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          {step===total-1 ? <>✦ إضافة الخريطة</> : <>التالي ← <span style={{ fontSize:10, opacity:.7 }}>({step+2}/{total})</span></>}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// TEMPLATES SHEET
// ═══════════════════════════════════════
function TemplatesSheet({ onSelect, onClose }) {
  const [selected, setSelected] = useState(null); // template being previewed
  const [guiding,  setGuiding]  = useState(null); // template in guided fill

  if (guiding) return (
    <MobileSheet onClose={onClose} title={`${guiding.icon} ${guiding.label}`}>
      <TemplateGuidedFill
        template={guiding}
        onConfirm={values=>{
          // merge filled values into template nodes
          const filled = { ...guiding, nodes: guiding.nodes.map((n,i)=>({ ...n, text:values[i]||n.text })) };
          onSelect(filled);
          onClose();
        }}
        onBack={()=>setGuiding(null)}
      />
    </MobileSheet>
  );

  return (
    <MobileSheet onClose={onClose} title="📋 قوالب جاهزة">
      <div style={{ padding:"8px 16px 32px", display:"flex", flexDirection:"column", gap:12 }}>

        <div style={{ fontSize:11, color:C.muted, lineHeight:1.8 }}>
          اختار قالب جاهز — هتملي الأسماء خطوة بخطوة وتضاف للخريطة فوراً
        </div>

        {TEMPLATES.map(t=>{
          const isOpen = selected===t.id;
          return (
            <div key={t.id} style={{ borderRadius:18, overflow:"hidden", border:`1.5px solid ${isOpen?t.color:t.color+"33"}`, background:`${t.color}08`, transition:"border-color .2s" }}>

              {/* Header row — tap to expand */}
              <button onClick={()=>setSelected(isOpen?null:t.id)} className="tap"
                style={{ padding:"14px 16px", display:"flex", alignItems:"center", gap:12, width:"100%", background:"transparent", border:"none", textAlign:"right" }}>
                <div style={{ width:52, height:52, borderRadius:14, background:`${t.color}22`, border:`1.5px solid ${t.color}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{t.icon}</div>
                <div style={{ flex:1, textAlign:"right" }}>
                  <div style={{ fontSize:15, fontWeight:900, color:t.color, marginBottom:3 }}>{t.label}</div>
                  <div style={{ fontSize:11, color:C.muted }}>{t.desc}</div>
                  <div style={{ display:"flex", gap:6, marginTop:5, flexWrap:"wrap" }}>
                    {t.nodes.map((n,i)=>(
                      <span key={i} style={{ padding:"2px 8px", borderRadius:20, fontSize:9, background:`${n.color}15`, border:`1px solid ${n.color}33`, color:n.color, fontWeight:700 }}>{n.icon} {n.text}</span>
                    ))}
                  </div>
                </div>
                <div style={{ color:C.dim, fontSize:16, transform:isOpen?"rotate(90deg)":"none", transition:"transform .2s", flexShrink:0 }}>‹</div>
              </button>

              {/* Expanded — SVG preview + start button */}
              {isOpen&&(
                <div className="mm-slide-down" style={{ borderTop:`1px solid ${t.color}22`, padding:"12px 16px 14px" }}>
                  <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>
                    <TemplateMiniPreview template={t}/>
                  </div>
                  <div style={{ fontSize:10, color:C.dim, textAlign:"center", marginBottom:12 }}>
                    {t.nodes.length} مفهوم · {t.links.length} ربط — هتملي الأسماء خطوة بخطوة
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={()=>{ onSelect(t); onClose(); }} className="tap"
                      style={{ padding:"11px 14px", borderRadius:13, fontFamily:"'Cairo',sans-serif", fontWeight:700, fontSize:12,
                        background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", color:C.muted }}>
                      ⚡ إضافة مباشر
                    </button>
                    <button onClick={()=>setGuiding(t)} className="tap"
                      style={{ flex:1, padding:"12px", borderRadius:13, fontFamily:"'Cairo',sans-serif", fontWeight:800, fontSize:13,
                        background:`linear-gradient(135deg,${t.color},${C.purple})`,
                        border:"none", color:"#fff", boxShadow:`0 4px 16px ${t.color}44`,
                        display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                      ✦ ابدأ وملي الأسماء
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </MobileSheet>
  );
}

// ═══════════════════════════════════════
// NODE PREVIEW
// ═══════════════════════════════════════
function NodePreview({ type, label, icon, definition, difficulty }) {
  const ti=CONCEPT_TYPES.find(t=>t.id===type)||CONCEPT_TYPES[0], di=DIFFICULTY.find(d=>d.id===difficulty), empty=!label;
  return (
    <div style={{ background:`${ti.color}10`, border:`1.5px solid ${ti.color}33`, borderRadius:16, padding:"14px 12px", display:"flex", flexDirection:"column", alignItems:"center", gap:9, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-18, right:-18, width:70, height:70, borderRadius:"50%", background:ti.color, opacity:.08, filter:"blur(20px)", pointerEvents:"none" }}/>
      <div style={{ fontSize:9, color:ti.color, fontWeight:700, letterSpacing:0.5 }}>معاينة مباشرة</div>
      <div style={{ width:148, minHeight:70, background:`${ti.color}14`, border:`1.5px solid ${ti.color}55`, borderRadius:15, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3, padding:"9px 11px", position:"relative", boxShadow:`0 4px 16px rgba(0,0,0,.35)` }}>
        <div style={{ position:"absolute", top:5, right:7, fontSize:9, color:ti.color, fontWeight:700, opacity:.9 }}>{ti.icon}</div>
        {di&&<div style={{ position:"absolute", top:5, left:7, fontSize:9 }}>{di.icon}</div>}
        <div style={{ fontSize:21 }}>{icon}</div>
        <div style={{ fontSize:11, fontWeight:800, color:empty?C.dim:C.text, textAlign:"center", fontStyle:empty?"italic":"normal", maxWidth:124, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", transition:"color .2s" }}>
          {empty ? "معاينة..." : label.length>18 ? label.slice(0,18)+"…" : label}
        </div>
        <div style={{ fontSize:9, color:ti.color, fontWeight:600, opacity:.85 }}>{ti.label}</div>
        {definition&&<div style={{ position:"absolute", bottom:4, right:6, width:5, height:5, borderRadius:"50%", background:C.gold, opacity:.85 }}/>}
      </div>
      {definition&&<div style={{ fontSize:10, color:C.muted, textAlign:"center", lineHeight:1.6, maxWidth:155, padding:"5px 9px", background:"rgba(255,255,255,.03)", borderRadius:8, border:"1px solid rgba(255,255,255,.06)" }}>{definition.length>55?definition.slice(0,55)+"…":definition}</div>}
    </div>
  );
}

// ═══════════════════════════════════════
// STEP INDICATOR
// ═══════════════════════════════════════
function StepIndicator({ current, total, color }) {
  return (
    <div style={{ display:"flex", alignItems:"center" }}>
      {Array.from({length:total}).map((_,i)=>{
        const n=i+1, done=current>n, act=current===n;
        return (
          <div key={n} style={{ display:"flex", alignItems:"center" }}>
            <div style={{ width:act?30:25, height:act?30:25, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:act?13:11, fontWeight:800, fontFamily:"'Cairo',sans-serif", background:done||act?color:"rgba(255,255,255,0.07)", color:done||act?"#fff":C.dim, border:act?`2px solid ${color}`:"none", boxShadow:act?`0 0 0 4px ${color}22, 0 4px 12px ${color}44`:"none", transition:"all .3s" }}>
              {done?<span style={{ display:"inline-block", animation:"checkIn .22s ease both" }}>✓</span>:n}
            </div>
            {i<total-1&&<div style={{ width:26, height:2, background:current>n?color:"rgba(255,255,255,.07)", margin:"0 1px", transition:"background .4s", borderRadius:2 }}/>}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════
// TYPE CARD
// ═══════════════════════════════════════
function TypeCard({ type, selected, onClick }) {
  return (
    <button onClick={onClick} className={`type-card tap${selected?" mm-pop":""}`}
      style={{ padding:"13px 15px", borderRadius:15, width:"100%", border:`1.5px solid ${selected?type.color:"rgba(255,220,240,0.10)"}`, background:selected?`${type.color}14`:"rgba(255,255,255,0.03)", display:"flex", alignItems:"center", gap:12, textAlign:"right", boxShadow:selected?`0 0 0 1px ${type.color}44, 0 6px 18px ${type.color}18`:"0 2px 8px rgba(0,0,0,.2)", position:"relative", overflow:"hidden" }}>
      {selected&&<div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg,${type.color}08,transparent 60%)`, pointerEvents:"none" }}/>}
      <div style={{ width:42, height:42, borderRadius:12, flexShrink:0, fontSize:21, background:selected?`${type.color}22`:"rgba(255,255,255,.05)", border:`1.5px solid ${selected?type.color+"55":"rgba(255,255,255,0.08)"}`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:selected?`0 0 12px ${type.color}44`:"none", transition:"all .2s" }}>{type.icon}</div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:800, color:selected?type.color:C.text, fontFamily:"'Cairo',sans-serif", marginBottom:2, transition:"color .2s" }}>{type.label}</div>
        <div style={{ fontSize:11, color:C.dim, fontFamily:"'Cairo',sans-serif" }}>{type.desc}</div>
      </div>
      <div style={{ width:21, height:21, borderRadius:"50%", flexShrink:0, background:selected?type.color:"rgba(255,255,255,.05)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#fff", transition:"all .2s", boxShadow:selected?`0 0 8px ${type.color}66`:"none" }}>
        {selected&&<span style={{ display:"inline-block", animation:"checkIn .22s ease both" }}>✓</span>}
      </div>
    </button>
  );
}

// ═══════════════════════════════════════
// ADD CONCEPT MODAL — mobile bottom sheet
// ═══════════════════════════════════════
function AddConceptModal({ onAdd, onClose, scopeLabel, parentConcept }) {
  const TOTAL=3, LABELS=["النوع","الاسم","التفاصيل"];
  const [step,setStep]=useState(1), [dir,setDir]=useState("r");
  const [addType,setType]=useState("main"), [addLabel,setLabel]=useState(""), [addDef,setDef]=useState("");
  const [addIcon,setIcon]=useState("💡"), [addDiff,setDiff]=useState("medium"), [saving,setSaving]=useState(false);
  const inputRef=useRef(), ti=CONCEPT_TYPES.find(t=>t.id===addType)||CONCEPT_TYPES[0];
  const sc=dir==="r"?"mm-slide-r":"mm-slide-l";

  useEffect(()=>{ if(step===2) setTimeout(()=>inputRef.current?.focus(),160); },[step]);

  const goNext=()=>{ setDir("r"); setStep(s=>Math.min(s+1,TOTAL)); };
  const goBack=()=>{ setDir("l"); setStep(s=>Math.max(s-1,1)); };
  const selType=id=>{ setType(id); const t=CONCEPT_TYPES.find(t=>t.id===id); if(t) setIcon(t.icon); };

  const submit=async()=>{
    if (!addLabel.trim()||saving) return;
    setSaving(true);
    await onAdd({ addType, addLabel, addDef, addIcon, addShape:"pill", addDiff });
    setSaving(false); onClose();
  };

  const onKey=e=>{
    if (e.key==="Escape") { onClose(); return; }
    if (e.key==="Enter") {
      e.preventDefault();
      if (step===1) goNext();
      else if (step===2&&addLabel.trim()) goNext();
      else if (step===3&&addLabel.trim()) submit();
    }
  };

  return (
    <div onClick={onClose} onKeyDown={onKey}
      style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(6,4,11,0.88)", backdropFilter:"blur(14px)", display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
      <div onClick={e=>e.stopPropagation()} className="mm-slide-up"
        style={{ background:"linear-gradient(170deg,#1E1528,#18121F,#130E1A)", border:"1px solid rgba(255,220,240,0.13)", borderRadius:"24px 24px 0 0", boxShadow:"0 -20px 60px rgba(0,0,0,.85)", display:"flex", flexDirection:"column", maxHeight:"96vh", overflow:"hidden" }}>

        {/* Accent line */}
        <div style={{ height:2, background:`linear-gradient(90deg,transparent 5%,${ti.color} 40%,${ti.color}88 70%,transparent 95%)`, opacity:.8, transition:"background .4s" }}/>
        {/* Handle */}
        <div style={{ display:"flex", justifyContent:"center", padding:"10px 0 2px" }}>
          <div style={{ width:38, height:4, borderRadius:4, background:"rgba(255,255,255,0.16)" }}/>
        </div>

        {/* Header */}
        <div style={{ padding:"10px 18px 12px", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:15, fontWeight:900, color:C.text, fontFamily:"'Cairo',sans-serif", display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ color:ti.color }}>✦</span> مفهوم جديد
              {scopeLabel&&<span style={{ fontSize:10, color:C.dim }}>— {scopeLabel}</span>}
            </div>
            {parentConcept&&<div style={{ fontSize:10, color:ti.color, opacity:.8, marginTop:1 }}>↳ فرع من: <b>{parentConcept.text}</b></div>}
          </div>
          <StepIndicator current={step} total={TOTAL} color={ti.color}/>
          <button onClick={onClose} className="tap" style={{ width:32, height:32, borderRadius:9, background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.09)", color:C.muted, fontSize:15, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>

        {/* Steps */}
        <div style={{ flex:1, overflowY:"auto", padding:"0 18px 28px", WebkitOverflowScrolling:"touch" }}>

          {/* STEP 1 */}
          {step===1&&(
            <div key="s1" className={sc} style={{ display:"flex", flexDirection:"column", gap:9 }}>
              <div style={{ marginBottom:4 }}>
                <div style={{ fontSize:14, fontWeight:900, color:C.text, fontFamily:"'Cairo',sans-serif", marginBottom:2 }}>ما نوع المفهوم؟</div>
                <div style={{ fontSize:11, color:C.dim }}>يحدد اللون والمظهر في الخريطة</div>
              </div>
              {CONCEPT_TYPES.map(t=><TypeCard key={t.id} type={t} selected={addType===t.id} onClick={()=>selType(t.id)}/>)}
              <button onClick={goNext} className="tap"
                style={{ marginTop:6, padding:"14px", borderRadius:16, fontSize:14, fontFamily:"'Cairo',sans-serif", fontWeight:800, background:ti.grad, border:"none", color:"#fff", boxShadow:`0 4px 20px ${ti.color}44`, display:"flex", alignItems:"center", justifyContent:"center", gap:8, width:"100%" }}>
                التالي ←
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step===2&&(
            <div key="s2" className={sc} style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div>
                <div style={{ fontSize:14, fontWeight:900, color:C.text, fontFamily:"'Cairo',sans-serif", marginBottom:2 }}>ما اسم المفهوم؟</div>
                <div style={{ fontSize:11, color:C.dim }}>هيظهر مباشرةً على الخريطة</div>
              </div>
              <NodePreview type={addType} label={addLabel} icon={addIcon} definition={addDef} difficulty={addDiff}/>
              <div style={{ position:"relative" }}>
                <div style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)", fontSize:18, pointerEvents:"none" }}>{addIcon}</div>
                <input ref={inputRef} value={addLabel} onChange={e=>setLabel(e.target.value)}
                  placeholder="اكتب اسم المفهوم... (مثال: المتوسط الحسابي)"
                  className="mm-input"
                  style={{ width:"100%", padding:"13px 44px 13px 38px", borderRadius:14, fontSize:14, fontWeight:700 }}/>
                {addLabel&&<button onClick={()=>setLabel("")} className="tap" style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:C.dim, fontSize:14 }}>✕</button>}
              </div>
              {addLabel&&<div style={{ height:2, borderRadius:2, background:"rgba(255,255,255,.05)", overflow:"hidden", marginTop:-6 }}><div style={{ height:"100%", width:`${Math.min(100,(addLabel.length/30)*100)}%`, background:ti.grad, borderRadius:2, transition:"width .2s" }}/></div>}
              {ti.examples?.length>0&&(
                <div>
                  <div style={{ fontSize:10, color:C.dim, marginBottom:6 }}>اقتراحات:</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {ti.examples.map(ex=><button key={ex} onClick={()=>setLabel(ex)} className="chip" style={{ padding:"5px 12px", borderRadius:20, fontSize:11, fontFamily:"'Cairo',sans-serif", fontWeight:600, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,220,240,.12)", color:C.muted }}>{ex}</button>)}
                  </div>
                </div>
              )}
              <div>
                <div style={{ fontSize:11, color:C.dim, marginBottom:6, display:"flex", justifyContent:"space-between" }}>
                  <span>شرح المفهوم</span>
                  <span style={{ color:addDef.length>160?C.danger:C.dim }}>{addDef.length}/200</span>
                </div>
                <textarea value={addDef} onChange={e=>setDef(e.target.value.slice(0,200))} placeholder="اكتب شرح بسيط يساعدك تفتكر المفهوم (اختياري)" rows={2} className="mm-input" style={{ width:"100%", padding:"11px 14px", borderRadius:14, fontSize:13, lineHeight:1.75 }}/>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={goBack} className="tap" style={{ padding:"12px 16px", borderRadius:13, fontSize:13, fontFamily:"'Cairo',sans-serif", fontWeight:700, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.09)", color:C.muted }}>→ رجوع</button>
                <button onClick={goNext} disabled={!addLabel.trim()} className="tap" style={{ flex:1, padding:"12px", borderRadius:13, fontSize:14, fontFamily:"'Cairo',sans-serif", fontWeight:800, background:addLabel.trim()?ti.grad:"rgba(255,255,255,.06)", border:"none", color:addLabel.trim()?"#fff":C.dim, boxShadow:addLabel.trim()?`0 4px 16px ${ti.color}44`:"none", opacity:addLabel.trim()?1:.5 }}>التالي ←</button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step===3&&(
            <div key="s3" className={sc} style={{ display:"flex", flexDirection:"column", gap:13 }}>
              <div>
                <div style={{ fontSize:14, fontWeight:900, color:C.text, fontFamily:"'Cairo',sans-serif", marginBottom:2 }}>تفاصيل إضافية</div>
                <div style={{ fontSize:11, color:C.dim }}>كل شيء اختياري — يمكن تغييره لاحقاً</div>
              </div>
              <div>
                <div style={{ fontSize:11, color:C.dim, marginBottom:7 }}>مستوى الصعوبة</div>
                <div style={{ display:"flex", gap:7 }}>
                  {DIFFICULTY.map(d=><button key={d.id} onClick={()=>setDiff(d.id)} className="tap" style={{ flex:1, padding:"10px 4px", borderRadius:12, fontFamily:"'Cairo',sans-serif", fontSize:12, border:`1.5px solid ${addDiff===d.id?d.color:"rgba(255,255,255,.08)"}`, background:addDiff===d.id?`${d.color}18`:"rgba(255,255,255,.03)", color:addDiff===d.id?d.color:C.muted, fontWeight:addDiff===d.id?700:500, boxShadow:addDiff===d.id?`0 0 10px ${d.color}33`:"none", transition:"all .18s" }}>{d.icon} {d.label}</button>)}
                </div>
              </div>
              <div>
                <div style={{ fontSize:11, color:C.dim, marginBottom:7 }}>أيقونة</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                  {NODE_ICONS.map(ic=><button key={ic} onClick={()=>setIcon(ic)} className="tap" style={{ width:42, height:42, borderRadius:11, fontSize:18, border:`1.5px solid ${addIcon===ic?ti.color:"rgba(255,255,255,.08)"}`, background:addIcon===ic?`${ti.color}22`:"rgba(255,255,255,.03)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:addIcon===ic?`0 0 10px ${ti.color}44`:"none", transition:"all .15s" }}>{ic}</button>)}
                </div>
              </div>
              <div style={{ display:"flex", gap:8, paddingTop:4 }}>
                <button onClick={goBack} className="tap" style={{ padding:"12px 16px", borderRadius:13, fontSize:13, fontFamily:"'Cairo',sans-serif", fontWeight:700, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.09)", color:C.muted }}>→ رجوع</button>
                <button onClick={submit} disabled={saving||!addLabel.trim()} className="tap"
                  style={{ flex:1, padding:"14px", borderRadius:15, fontSize:14, fontFamily:"'Cairo',sans-serif", fontWeight:900, background:saving||!addLabel.trim()?"rgba(255,255,255,.08)":ti.grad, border:"none", color:"#fff", boxShadow:saving||!addLabel.trim()?"none":`0 6px 22px ${ti.color}55`, opacity:saving||!addLabel.trim()?.6:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  {saving?<><div style={{ width:16, height:16, borderRadius:"50%", border:"2px solid rgba(255,255,255,.3)", borderTopColor:"#fff", animation:"spin .7s linear infinite" }}/> جاري الحفظ...</>:<>{ti.icon} إضافة المفهوم</>}
                </button>
              </div>
              <div style={{ textAlign:"center", fontSize:10, color:C.dim }}>اضغط Enter للإضافة السريعة</div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ height:3, background:"rgba(255,255,255,.05)", flexShrink:0 }}>
          <div style={{ height:"100%", width:`${(step/TOTAL)*100}%`, background:ti.grad, borderRadius:2, transition:"width .4s cubic-bezier(.4,0,.2,1)", boxShadow:`0 0 8px ${ti.color}66` }}/>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// MOBILE BOTTOM SHEET
// ═══════════════════════════════════════
function MobileSheet({ children, onClose, title, badge }) {
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:250, background:"rgba(6,4,11,0.83)", backdropFilter:"blur(10px)", display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
      <div onClick={e=>e.stopPropagation()} className="mm-slide-up"
        style={{ background:"linear-gradient(170deg,#1E1528,#18121F)", border:"1px solid rgba(255,220,240,0.12)", borderRadius:"22px 22px 0 0", boxShadow:"0 -16px 50px rgba(0,0,0,.78)", maxHeight:"88vh", display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ display:"flex", justifyContent:"center", padding:"10px 0 0" }}>
          <div style={{ width:36, height:4, borderRadius:4, background:"rgba(255,255,255,0.15)" }}/>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 18px 10px", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ fontSize:15, fontWeight:900, color:C.text, fontFamily:"'Cairo',sans-serif" }}>{title}</div>
            {badge&&<div style={{ padding:"2px 8px", borderRadius:20, background:C.accentSoft, color:C.accent, fontSize:11, fontWeight:700 }}>{badge}</div>}
          </div>
          <button onClick={onClose} className="tap" style={{ width:32, height:32, borderRadius:9, background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.09)", color:C.muted, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>
        <div style={{ overflowY:"auto", flex:1, WebkitOverflowScrolling:"touch" }}>{children}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// LINK EDIT SHEET
// ═══════════════════════════════════════
function LinkEditSheet({ linkLabel, setLinkLabel, onSave, onDelete, onClose, fromName, toName }) {
  const ref=useRef(); useEffect(()=>{ setTimeout(()=>ref.current?.focus(),130); },[]);
  return (
    <MobileSheet onClose={onClose} title="✏️ تعديل الرابط">
      <div style={{ padding:"8px 18px 36px", display:"flex", flexDirection:"column", gap:12 }}>
        {/* Arrow direction display */}
        {fromName && toName && (
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:"rgba(180,142,245,0.08)", border:"1px solid rgba(180,142,245,0.2)", borderRadius:12 }}>
            <span style={{ fontSize:11, color:C.accent, fontWeight:800, fontFamily:"'Cairo',sans-serif", flex:1, textAlign:"right" }}>{fromName}</span>
            <span style={{ fontSize:14, color:C.purple }}>←</span>
            <span style={{ fontSize:11, color:C.teal, fontWeight:800, fontFamily:"'Cairo',sans-serif", flex:1, textAlign:"left" }}>{toName}</span>
          </div>
        )}
        <div style={{ fontSize:10, color:C.dim, textAlign:"center" }}>السهم يتجه من <span style={{ color:C.accent }}>{fromName}</span> إلى <span style={{ color:C.teal }}>{toName}</span></div>
        <input ref={ref} value={linkLabel} onChange={e=>setLinkLabel(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter") onSave(); }}
          placeholder="اسم العلاقة... (مثال: يؤدي إلى)" className="mm-input"
          style={{ width:"100%", padding:"13px 16px", borderRadius:14, fontSize:14, fontWeight:700 }}/>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={onSave} className="tap" style={{ flex:1, padding:"13px", borderRadius:14, fontFamily:"'Cairo',sans-serif", fontWeight:800, fontSize:14, background:`linear-gradient(135deg,${C.accent},${C.purple})`, border:"none", color:"#fff", boxShadow:"0 4px 16px rgba(232,121,160,0.35)" }}>✓ حفظ</button>
          <button onClick={onDelete} className="tap" style={{ padding:"13px 14px", borderRadius:14, fontFamily:"'Cairo',sans-serif", fontWeight:700, fontSize:13, background:"rgba(252,129,129,0.1)", border:`1.5px solid ${C.danger}44`, color:C.danger }}>🗑 حذف</button>
        </div>
      </div>
    </MobileSheet>
  );
}

// ═══════════════════════════════════════
// NODE ACTION SHEET
// ═══════════════════════════════════════
function NodeActionSheet({ concept, onEdit, onDelete, onLink, onCycleColor, onToggleReview, onDetail, onClose }) {
  const ti=CONCEPT_TYPES.find(t=>t.id===concept.conceptType)||CONCEPT_TYPES[0];
  // collect active tags for display
  const activeTags=(concept.tags||[]).map(id=>NODE_TAGS.find(t=>t.id===id)).filter(Boolean);
  return (
    <MobileSheet onClose={onClose} title={concept.text}>
      <div style={{ padding:"6px 18px 36px", display:"flex", flexDirection:"column", gap:8 }}>
        <div style={{ display:"flex", gap:6, marginBottom:6, flexWrap:"wrap" }}>
          <div style={{ padding:"4px 10px", borderRadius:20, background:`${ti.color}18`, border:`1px solid ${ti.color}44`, fontSize:11, color:ti.color, fontWeight:700 }}>{ti.icon} {ti.label}</div>
          {concept.markedReview&&<div style={{ padding:"4px 10px", borderRadius:20, background:"rgba(244,201,122,0.15)", border:`1px solid ${C.gold}44`, fontSize:11, color:C.gold, fontWeight:700 }}>🔖 مراجعة</div>}
          {concept.definition&&<div style={{ padding:"4px 10px", borderRadius:20, background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", fontSize:11, color:C.muted }}>📝 شرح</div>}
          {activeTags.map(tg=><div key={tg.id} style={{ padding:"4px 10px", borderRadius:20, background:`${tg.color}15`, border:`1px solid ${tg.color}44`, fontSize:11, color:tg.color, fontWeight:700 }}>{tg.icon} {tg.label}</div>)}
          {(concept.notes?.length>0)&&<div style={{ padding:"4px 10px", borderRadius:20, background:"rgba(123,224,212,0.12)", border:"1px solid rgba(123,224,212,0.3)", fontSize:11, color:C.teal, fontWeight:700 }}>📓 ملاحظات</div>}
          {(concept.links?.length>0)&&<div style={{ padding:"4px 10px", borderRadius:20, background:"rgba(180,142,245,0.12)", border:"1px solid rgba(180,142,245,0.3)", fontSize:11, color:C.purple, fontWeight:700 }}>🔗 {concept.links.length} رابط</div>}
        </div>
        {[
          { label:"📋 تفاصيل وملاحظات",                       fn:onDetail,       color:C.teal },
          { label:"✏️ تعديل الاسم",                         fn:onEdit,         color:C.text },
          { label:"🔗 ربط بمفهوم آخر",                      fn:onLink,         color:C.purple },
          { label:"🎨 تغيير اللون",                         fn:onCycleColor,   color:C.muted },
          { label:concept.markedReview?"🔖 إلغاء المراجعة":"🔖 وضع علامة مراجعة", fn:onToggleReview, color:C.gold },
          { label:"🗑 حذف المفهوم",                         fn:onDelete,       color:C.danger, danger:true },
        ].map(({label,fn,color,danger})=>(
          <button key={label} onClick={()=>{ fn(); onClose(); }} className="tap"
            style={{ padding:"14px 16px", borderRadius:14, fontFamily:"'Cairo',sans-serif", fontWeight:700, fontSize:14, textAlign:"right", background:danger?"rgba(252,129,129,0.08)":"rgba(255,255,255,.04)", border:`1px solid ${danger?"rgba(252,129,129,0.2)":"rgba(255,255,255,.08)"}`, color, width:"100%", display:"flex", alignItems:"center", gap:8 }}>
            {label}
          </button>
        ))}
      </div>
    </MobileSheet>
  );
}

// ═══════════════════════════════════════
// NODE DETAIL SHEET — notes, links, tags
// ═══════════════════════════════════════
const NODE_TAGS = [
  { id:"vip",    label:"مهم جداً",   icon:"🔥", color:"#FC8181" },
  { id:"review", label:"للمراجعة",   icon:"🔖", color:"#F4C97A" },
  { id:"done",   label:"تم الفهم",   icon:"✅", color:"#6EE7B7" },
  { id:"confuse",label:"محتاج شرح",  icon:"❓", color:"#B48EF5" },
];

function NodeDetailSheet({ concept, onSave, onClose }) {
  const ti = CONCEPT_TYPES.find(t=>t.id===concept.conceptType)||CONCEPT_TYPES[0];
  const [notes,  setNotes]  = useState(concept.notes  || "");
  const [links,  setLinks]  = useState(concept.links  || []);
  const [tags,   setTags]   = useState(concept.tags   || []);
  const [newUrl, setNewUrl] = useState("");
  const [newUrlLabel, setNewUrlLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [tab,    setTab]    = useState("notes"); // notes | links | tags

  const toggleTag = id => setTags(p => p.includes(id) ? p.filter(t=>t!==id) : [...p,id]);

  const addLink = () => {
    const url = newUrl.trim();
    if (!url) return;
    const label = newUrlLabel.trim() || url;
    setLinks(p=>[...p,{ url, label }]);
    setNewUrl(""); setNewUrlLabel("");
  };

  const removeLink = idx => setLinks(p=>p.filter((_,i)=>i!==idx));

  const handleSave = async () => {
    setSaving(true);
    await onSave({ notes, links, tags });
    setSaving(false);
    onClose();
  };

  const TABS = [
    { id:"notes", label:"📝 ملاحظات" },
    { id:"links", label:"🔗 روابط" },
    { id:"tags",  label:"🏷 تصنيف" },
  ];

  return (
    <MobileSheet onClose={onClose} title={concept.text} badge={ti.icon+" "+ti.label}>
      <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>

        {/* Tab bar */}
        <div style={{ display:"flex", gap:4, padding:"4px 16px 10px", flexShrink:0 }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} className="tap"
              style={{ flex:1, padding:"8px 4px", borderRadius:11, fontSize:12, fontFamily:"'Cairo',sans-serif", fontWeight:700,
                background:tab===t.id?`linear-gradient(135deg,${C.accent},${C.purple})`:"rgba(255,255,255,.04)",
                border:`1px solid ${tab===t.id?"transparent":"rgba(255,255,255,.08)"}`,
                color:tab===t.id?"#fff":C.muted, transition:"all .18s" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ flex:1, overflowY:"auto", WebkitOverflowScrolling:"touch", padding:"0 16px 8px" }}>

          {/* NOTES TAB */}
          {tab==="notes" && (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ fontSize:11, color:C.dim }}>اكتب أي ملاحظات أو شرح تفصيلي للمفهوم ده</div>
              <textarea
                value={notes}
                onChange={e=>setNotes(e.target.value)}
                placeholder={"مثال:\n- القانون ينطبق على...\n- استثناءات مهمة: ...\n- ربطه بـ: ..."}
                rows={9}
                className="mm-input"
                style={{ width:"100%", padding:"13px 14px", borderRadius:14, fontSize:13, lineHeight:1.85, resize:"vertical", minHeight:160 }}
              />
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.dim }}>
                <span>{notes.length} حرف</span>
                {notes.length > 0 && <button onClick={()=>setNotes("")} className="tap" style={{ background:"none", border:"none", color:C.danger, fontSize:11, fontFamily:"'Cairo',sans-serif" }}>مسح</button>}
              </div>
              {/* Quick insert chips */}
              <div>
                <div style={{ fontSize:10, color:C.dim, marginBottom:6 }}>إضافة سريعة:</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {["⚠️ تنبيه: ","💡 فكرة: ","❌ استثناء: ","🔁 مرتبط بـ: ","📌 مهم: "].map(chip=>(
                    <button key={chip} onClick={()=>setNotes(p=>p+(p&&!p.endsWith("\n")?"\n":"")+chip)} className="chip"
                      style={{ padding:"4px 11px", borderRadius:20, fontSize:11, fontFamily:"'Cairo',sans-serif", fontWeight:600,
                        background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,220,240,.12)", color:C.muted }}>
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LINKS TAB */}
          {tab==="links" && (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ fontSize:11, color:C.dim }}>أضف روابط خارجية (يوتيوب، مقالة، ملف...)</div>

              {/* Existing links */}
              {links.length > 0 && (
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {links.map((lk,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 12px", background:"rgba(180,142,245,0.08)", border:"1px solid rgba(180,142,245,0.2)", borderRadius:12 }}>
                      <span style={{ fontSize:16 }}>🔗</span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12, fontWeight:700, color:C.purple, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{lk.label}</div>
                        <div style={{ fontSize:10, color:C.dim, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{lk.url}</div>
                      </div>
                      <button onClick={()=>removeLink(i)} className="tap" style={{ background:"none", border:"none", color:C.danger, fontSize:16, padding:4 }}>✕</button>
                    </div>
                  ))}
                </div>
              )}

              {links.length === 0 && (
                <div style={{ textAlign:"center", padding:"20px 0", color:C.dim, fontSize:12 }}>مفيش روابط لسه</div>
              )}

              {/* Add new link */}
              <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.08)", borderRadius:14, padding:12, display:"flex", flexDirection:"column", gap:8 }}>
                <div style={{ fontSize:11, color:C.muted, fontWeight:700 }}>➕ رابط جديد</div>
                <input
                  value={newUrlLabel} onChange={e=>setNewUrlLabel(e.target.value)}
                  placeholder="اسم الرابط (مثال: شرح يوتيوب)"
                  className="mm-input"
                  style={{ width:"100%", padding:"10px 13px", borderRadius:11, fontSize:13 }}
                />
                <input
                  value={newUrl} onChange={e=>setNewUrl(e.target.value)}
                  onKeyDown={e=>{ if(e.key==="Enter") addLink(); }}
                  placeholder="https://..."
                  className="mm-input"
                  style={{ width:"100%", padding:"10px 13px", borderRadius:11, fontSize:12, direction:"ltr" }}
                />
                <button onClick={addLink} disabled={!newUrl.trim()} className="tap"
                  style={{ padding:"10px", borderRadius:11, fontFamily:"'Cairo',sans-serif", fontWeight:700, fontSize:13,
                    background:newUrl.trim()?`linear-gradient(135deg,${C.purple},${C.accent})`:"rgba(255,255,255,.05)",
                    border:"none", color:newUrl.trim()?"#fff":C.dim, opacity:newUrl.trim()?1:.5 }}>
                  إضافة الرابط
                </button>
              </div>
            </div>
          )}

          {/* TAGS TAB */}
          {tab==="tags" && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ fontSize:11, color:C.dim }}>صنّف المفهوم ده — ممكن تختار أكتر من تصنيف</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {NODE_TAGS.map(tg=>{
                  const active = tags.includes(tg.id);
                  return (
                    <button key={tg.id} onClick={()=>toggleTag(tg.id)} className="tap"
                      style={{ padding:"14px 16px", borderRadius:14, fontFamily:"'Cairo',sans-serif", fontWeight:700, fontSize:14,
                        textAlign:"right", display:"flex", alignItems:"center", gap:10,
                        background:active?`${tg.color}18`:"rgba(255,255,255,.03)",
                        border:`1.5px solid ${active?tg.color:"rgba(255,255,255,.08)"}`,
                        color:active?tg.color:C.muted, transition:"all .18s",
                        boxShadow:active?`0 0 12px ${tg.color}33`:"none" }}>
                      <span style={{ fontSize:20 }}>{tg.icon}</span>
                      <span style={{ flex:1 }}>{tg.label}</span>
                      {active && <span style={{ fontSize:16 }}>✓</span>}
                    </button>
                  );
                })}
              </div>
              {tags.length > 0 && (
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, padding:"6px 0" }}>
                  {tags.map(id=>{ const tg=NODE_TAGS.find(t=>t.id===id); return tg?(
                    <div key={id} style={{ padding:"3px 10px", borderRadius:20, background:`${tg.color}18`, border:`1px solid ${tg.color}44`, fontSize:11, color:tg.color, fontWeight:700 }}>{tg.icon} {tg.label}</div>
                  ):null; })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Save button */}
        <div style={{ padding:"12px 16px 32px", flexShrink:0, borderTop:`1px solid ${C.border}` }}>
          <button onClick={handleSave} disabled={saving} className="tap"
            style={{ width:"100%", padding:"14px", borderRadius:15, fontFamily:"'Cairo',sans-serif", fontWeight:900, fontSize:15,
              background:saving?"rgba(255,255,255,.08)":`linear-gradient(135deg,${C.accent},${C.purple})`,
              border:"none", color:"#fff", boxShadow:saving?"none":"0 6px 22px rgba(232,121,160,.45)",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            {saving
              ? <><div style={{ width:16,height:16,borderRadius:"50%",border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",animation:"spin .7s linear infinite" }}/> جاري الحفظ...</>
              : "💾 حفظ التفاصيل"
            }
          </button>
        </div>
      </div>
    </MobileSheet>
  );
}

// ═══════════════════════════════════════
// SHARED BUTTON
// ═══════════════════════════════════════
function MmBtn({ children, onClick, disabled, secondary }) {
  return (
    <button onClick={onClick} disabled={disabled} className="tap"
      style={{ flex:1, padding:"12px 14px", borderRadius:13, fontSize:13, fontFamily:"'Cairo',sans-serif", fontWeight:700, background:secondary?C.surface:`linear-gradient(135deg,${C.accent},${C.purple})`, border:secondary?`1px solid ${C.border}`:"none", color:secondary?C.muted:"#fff", boxShadow:secondary?"none":"0 4px 16px rgba(232,121,160,0.3)", opacity:disabled?.5:1 }}>
      {children}
    </button>
  );
}

// ═══════════════════════════════════════
// ICON BUTTON (top bar) — improved for desktop
// ═══════════════════════════════════════
function IconBtn({ icon, onClick, disabled, active, danger, title, badge, isLink, isLinkActive }) {
  const cls = `tap icon-btn${danger?" icon-btn-danger":""}${isLink?" icon-btn-link":""}${isLinkActive?" icon-btn-link-active":""}`;
  return (
    <button onClick={onClick} disabled={disabled} title={title} className={cls}
      style={{
        width:34, height:34, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15,
        background: isLinkActive ? "rgba(180,142,245,0.22)" : active?"rgba(232,121,160,0.15)":danger?"rgba(252,129,129,0.08)":"rgba(255,255,255,.05)",
        border:`1px solid ${isLinkActive?C.purple+"77":active?C.accent+"55":danger?"rgba(252,129,129,0.22)":"rgba(255,255,255,.08)"}`,
        color: isLinkActive?C.purple:active?C.accent:danger?C.danger:disabled?C.dim:C.muted,
        opacity:disabled?.35:1, position:"relative", flexShrink:0,
        transition:"background .15s,border-color .15s,color .15s,transform .12s",
      }}>
      {icon}
      {badge&&<div style={{ position:"absolute", top:-4, left:-4, width:15, height:15, borderRadius:"50%", background:C.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, color:"#fff", fontWeight:900 }}>{badge}</div>}
    </button>
  );
}

// ═══════════════════════════════════════
// NODE CARD (SVG foreignObject)
// ═══════════════════════════════════════
function NodeCard({ concept, isSelected, isLinking, isDimmed, isEditing, editText, onEditChange, onEditCommit }) {
  const ti=CONCEPT_TYPES.find(t=>t.id===concept.conceptType)||CONCEPT_TYPES[0];
  const di=DIFFICULTY.find(d=>d.id===concept.difficulty);
  const W=180, H=92;
  const col = concept.color;

  // Visual state
  const borderColor = isLinking ? C.accent : isSelected ? col : `${col}55`;
  const borderW     = isLinking ? 2.5 : isSelected ? 2.5 : 1.5;
  const bgColor     = isSelected ? `${col}1E` : isLinking ? `${C.accent}14` : `${col}0D`;
  const shadowFilter= isSelected
    ? `drop-shadow(0 0 24px ${col}88) drop-shadow(0 6px 18px rgba(0,0,0,0.8))`
    : `drop-shadow(0 4px 14px rgba(0,0,0,0.65))`;

  return (
    <g transform={`translate(${concept.x},${concept.y})`} className="cnode" style={{ cursor:"grab", opacity:isDimmed?.12:1, transition:"opacity .25s" }}>
      {/* Glow ring when selected */}
      {isSelected&&(
        <>
          <ellipse rx={W/2+18} ry={H/2+18} fill={`${col}06`} stroke={col} strokeWidth={1} strokeDasharray="5,4" opacity={0.5}/>
          <ellipse rx={W/2+10} ry={H/2+10} fill="none" stroke={col} strokeWidth={1} opacity={0.25}/>
        </>
      )}
      {isLinking&&<ellipse rx={W/2+15} ry={H/2+15} fill={`${C.accent}08`} stroke={C.accent} strokeWidth={2} strokeDasharray="6,3" opacity={0.85}/>}
      {/* Hover ring via CSS */}
      <ellipse className="cnode-hover-ring" rx={W/2+14} ry={H/2+14} fill="none" stroke={col} strokeWidth={1} strokeDasharray="4,5" opacity={0} style={{ transition:"opacity .2s", pointerEvents:"none" }}/>

      <foreignObject x={-W/2} y={-H/2} width={W} height={H}>
        <div style={{
          width:"100%", height:"100%", boxSizing:"border-box",
          background: isSelected
            ? `linear-gradient(135deg, ${col}22 0%, ${col}0E 100%)`
            : `linear-gradient(145deg, ${col}10 0%, rgba(15,10,20,0.85) 100%)`,
          border:`${borderW}px solid ${borderColor}`,
          borderRadius:20,
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3,
          padding:"10px 13px",
          filter: shadowFilter,
          position:"relative", overflow:"hidden",
          transition:"border-color .2s, background .2s",
          backdropFilter:"blur(2px)",
        }}>
          {/* Subtle shimmer top line */}
          <div style={{ position:"absolute", top:0, left:"15%", right:"15%", height:1, background:`linear-gradient(90deg,transparent,${col}88,transparent)`, opacity: isSelected?0.9:0.4, borderRadius:1 }}/>

          {/* Top-right: concept type badge */}
          <div style={{ position:"absolute", top:6, right:8, fontSize:8, color:ti.color, fontFamily:"'Cairo',sans-serif", fontWeight:800, opacity:0.85, letterSpacing:0.3 }}>{ti.icon}</div>

          {/* Top-left: difficulty + notes indicator */}
          <div style={{ position:"absolute", top:6, left:8, display:"flex", gap:3, alignItems:"center" }}>
            {di&&<span style={{ fontSize:8 }}>{di.icon}</span>}
            {concept.notes?.length>0&&<span style={{ fontSize:8 }}>📓</span>}
          </div>

          {/* Bottom indicators */}
          <div style={{ position:"absolute", bottom:5, left:8, display:"flex", gap:3, alignItems:"center" }}>
            {concept.markedReview&&<span style={{ fontSize:8 }}>🔖</span>}
            {(concept.tags||[]).length>0&&<span style={{ fontSize:8 }}>{NODE_TAGS.find(t=>t.id===concept.tags[0])?.icon||""}</span>}
          </div>
          {concept.definition&&<div style={{ position:"absolute", bottom:6, right:9, width:5, height:5, borderRadius:"50%", background:C.gold, opacity:0.9, boxShadow:`0 0 6px ${C.gold}` }}/>}

          {/* Main icon */}
          <div style={{ fontSize:22, lineHeight:1, filter: isSelected?`drop-shadow(0 0 8px ${col})`:"none", transition:"filter .2s" }}>{concept.icon||ti.icon}</div>

          {/* Label */}
          {isEditing
            ? <input value={editText} onChange={onEditChange}
                onKeyDown={e=>{ if(e.key==="Enter") onEditCommit(); }}
                onBlur={onEditCommit} autoFocus
                style={{ background:"transparent", border:"none", outline:"none", color:C.text, fontFamily:"'Cairo',sans-serif", fontSize:12, textAlign:"center", fontWeight:800, width:"95%" }}/>
            : <div style={{ fontSize:12, fontWeight:800, color:C.text, textAlign:"center", lineHeight:1.4, pointerEvents:"none", userSelect:"none", maxWidth:"100%", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", textShadow: isSelected?`0 0 12px ${col}66`:"none" }}>
                {concept.text.length>22 ? concept.text.slice(0,22)+"…" : concept.text}
              </div>
          }
        </div>
      </foreignObject>
    </g>
  );
}

// ═══════════════════════════════════════
// LINK TOOLTIP (arrow direction hint)
// ═══════════════════════════════════════
function LinkTooltip({ x, y, fromName, toName, label }) {
  return (
    <div className="link-tooltip" style={{ left:x+12, top:y-18 }}>
      <span className="arrow-from">{fromName}</span>
      <span style={{ color:C.purple, margin:"0 5px" }}>← {label ? `"${label}"` : "→"}</span>
      <span className="arrow-to">{toName}</span>
    </div>
  );
}

// ═══════════════════════════════════════
// PRINT HELPER — uses canvas for reliable output
// ═══════════════════════════════════════
function printMap(svgEl) {
  if (!svgEl) return;

  // ── 1. Clone & replace foreignObjects with plain SVG text ──
  const svgClone = svgEl.cloneNode(true);
  svgClone.querySelectorAll("foreignObject").forEach(fo => {
    const fw = parseFloat(fo.getAttribute("width")||172);
    const fh = parseFloat(fo.getAttribute("height")||88);
    const fx = parseFloat(fo.getAttribute("x")||0);
    const fy = parseFloat(fo.getAttribute("y")||0);
    const cx = fx + fw/2, cy = fy + fh/2;

    // grab all text from the node card
    const div = fo.querySelector("div");
    const rawText = div?.innerText?.trim() || div?.textContent?.trim() || "";
    const lines = rawText.split(/[\n·•]/).map(l=>l.trim()).filter(Boolean).slice(0,3);

    // draw a rounded rect background
    const rect = document.createElementNS("http://www.w3.org/2000/svg","rect");
    rect.setAttribute("x", fx); rect.setAttribute("y", fy);
    rect.setAttribute("width", fw); rect.setAttribute("height", fh);
    rect.setAttribute("rx","14"); rect.setAttribute("ry","14");
    rect.setAttribute("fill","rgba(39,31,43,0.95)");
    rect.setAttribute("stroke","rgba(255,220,240,0.25)");
    rect.setAttribute("stroke-width","1.5");

    const g = document.createElementNS("http://www.w3.org/2000/svg","g");
    g.appendChild(rect);

    lines.forEach((line, i) => {
      const txt = document.createElementNS("http://www.w3.org/2000/svg","text");
      const offsetY = lines.length===1 ? 0 : (i - (lines.length-1)/2) * 16;
      txt.setAttribute("x", cx);
      txt.setAttribute("y", cy + offsetY + 5);
      txt.setAttribute("text-anchor","middle");
      txt.setAttribute("font-size", i===0 ? "12" : "10");
      txt.setAttribute("fill", i===0 ? "#F5EEF8" : "#9D8AAA");
      txt.setAttribute("font-family","Cairo,Arial,sans-serif");
      txt.setAttribute("font-weight", i===0 ? "700" : "400");
      txt.textContent = line.length > 24 ? line.slice(0,24)+"…" : line;
      g.appendChild(txt);
    });
    fo.replaceWith(g);
  });

  // ── 2. Compute bounding box & set viewBox ──
  const vb = svgEl.getAttribute("viewBox");
  const W = svgEl.clientWidth  || 900;
  const H = svgEl.clientHeight || 600;
  if (!vb) { svgClone.setAttribute("viewBox",`0 0 ${W} ${H}`); }
  svgClone.setAttribute("width",  W);
  svgClone.setAttribute("height", H);
  svgClone.setAttribute("xmlns","http://www.w3.org/2000/svg");

  // Add background rect
  const bg = document.createElementNS("http://www.w3.org/2000/svg","rect");
  bg.setAttribute("width","100%"); bg.setAttribute("height","100%"); bg.setAttribute("fill","#18111A");
  svgClone.insertBefore(bg, svgClone.firstChild);

  // ── 3. Serialize → Canvas → PNG download ──
  const svgStr = new XMLSerializer().serializeToString(svgClone);
  const svgBlob = new Blob([svgStr], { type:"image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  const canvas = document.createElement("canvas");
  const scale = 2; // retina
  canvas.width  = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0, W, H);
    URL.revokeObjectURL(svgUrl);

    // Download as PNG
    canvas.toBlob(blob => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `خريطة-المفاهيم-${Date.now()}.png`;
      a.click();
      setTimeout(()=>URL.revokeObjectURL(a.href), 3000);
    }, "image/png");
  };
  img.onerror = () => {
    // Fallback: open SVG directly
    URL.revokeObjectURL(svgUrl);
    const fallback = URL.createObjectURL(svgBlob);
    const a = document.createElement("a");
    a.href = fallback;
    a.download = `خريطة-المفاهيم.svg`;
    a.click();
  };
  img.src = svgUrl;
}

// ═══════════════════════════════════════
// CONCEPT MAP — Main
// ═══════════════════════════════════════
function ConceptMap({ subjects, lessons }) {
  const svgRef=useRef();
  const [concepts,setConcepts]=useState([]), [links,setLinks]=useState([]), [loading,setLoading]=useState(true);
  const [filterSubjectId,setFilterSubjectId]=useState("all"), [filterLessonId,setFilterLessonId]=useState("all");
  const [search,setSearch]=useState(""), [filterType,setFilterType]=useState("all");
  const [transform,setTransform]=useState({ x:0, y:0, scale:1 });
  const [bgDragging,setBgDragging]=useState(false), [dragNodeId,setDragNodeId]=useState(null);
  const [linking,setLinking]=useState(null), [editNode,setEditNode]=useState(null);
  const [showAdd,setShowAdd]=useState(false), [editLinkIdx,setEditLinkIdx]=useState(null), [linkLabel,setLinkLabel]=useState("");
  const [history,setHistory]=useState([]), [redoStack,setRedoStack]=useState([]);
  const [selectedConcept,setSelectedConcept]=useState(null);
  const [showQuiz,setShowQuiz]=useState(false), [showTemplates,setShowTemplates]=useState(false);
  const [showFilters,setShowFilters]=useState(false), [showSearch,setShowSearch]=useState(false);
  const [nodeAction,setNodeAction]=useState(null), [newIds,setNewIds]=useState(new Set()), [saving,setSaving]=useState(false);
  const [nodeDetail,setNodeDetail]=useState(null);
  // Link tooltip on hover (desktop)
  const [linkHover,setLinkHover]=useState(null); // { x, y, fromName, toName, label }

  const bgDragRef=useRef(null), transformRef=useRef({ x:0, y:0, scale:1 }), dragNodeIdRef=useRef(null);
  const touchRef=useRef(null), pinchRef=useRef(null);

  const availableLessons=useMemo(()=>filterSubjectId==="all"?lessons:lessons.filter(l=>l.subjectId===filterSubjectId),[filterSubjectId,lessons]);
  const colKey=useMemo(()=>filterSubjectId==="all"?"concepts_all":filterLessonId==="all"?`concepts_sub_${filterSubjectId}`:`concepts_les_${filterLessonId}`,[filterSubjectId,filterLessonId]);

  const undoingRef=useRef(false);
  useEffect(()=>{
    setLoading(true); setConcepts([]); setLinks([]); setSelectedConcept(null);
    const unsub=onSnapshot(collection(db,colKey),snap=>{
      if(undoingRef.current) return;
      const docs=snap.docs.map(d=>({ id:d.id, ...d.data() }));
      setConcepts(docs.filter(d=>d._type==="concept").map(({ _type,...r })=>r));
      setLinks(docs.filter(d=>d._type==="link").map(({ _type,...r })=>r));
      setLoading(false);
    });
    return ()=>unsub();
  },[colKey]);

  useEffect(()=>{
    const el=svgRef.current; if (!el) return;
    const t={ x:el.clientWidth/2, y:el.clientHeight/2, scale:1 };
    setTransform(t); transformRef.current=t;
  },[]);

  const pushHistory=useCallback((c,l)=>{ setHistory(h=>[...h.slice(-29),{concepts:c,links:l}]); setRedoStack([]); },[]);
  const undo=()=>{ if (!history.length) return; const p=history[history.length-1]; setRedoStack(r=>[...r,{concepts,links}]); undoingRef.current=true; setConcepts(p.concepts); setLinks(p.links); setHistory(h=>h.slice(0,-1)); setTimeout(()=>{ undoingRef.current=false; },600); };
  const redo=()=>{ if (!redoStack.length) return; const n=redoStack[redoStack.length-1]; setHistory(h=>[...h,{concepts,links}]); undoingRef.current=true; setConcepts(n.concepts); setLinks(n.links); setRedoStack(r=>r.slice(0,-1)); setTimeout(()=>{ undoingRef.current=false; },600); };

  useEffect(()=>{
    const ok=e=>{
      if ((e.ctrlKey||e.metaKey)&&e.key==="z"){ e.preventDefault(); undo(); }
      if ((e.ctrlKey||e.metaKey)&&e.key==="y"){ e.preventDefault(); redo(); }
      if (e.key==="Escape"){ setLinking(null); setEditNode(null); setEditLinkIdx(null); setSelectedConcept(null); setNodeAction(null); }
      if (e.key==="l"&&selectedConcept&&!editNode&&!showAdd){ setLinking(selectedConcept); setSelectedConcept(null); }
      if ((e.key==="Delete"||e.key==="Backspace")&&selectedConcept&&!editNode&&!showAdd){ e.preventDefault(); delConcept(selectedConcept); }
    };
    window.addEventListener("keydown",ok);
    return ()=>window.removeEventListener("keydown",ok);
  },[concepts,links,history,redoStack,selectedConcept,editNode,showAdd,linking]);

  const fbAdd=async(data,type)=>{ const r=await addDoc(collection(db,colKey),{...data,_type:type}); return r.id; };
  const fbUpdate=async(id,data)=>{ await updateDoc(doc(db,colKey,id),data); };
  const fbDelete=async(id)=>{ await deleteDoc(doc(db,colKey,id)); };

  const addConcept=async({ addType, addLabel, addDef, addIcon, addShape, addDiff })=>{
    if (!addLabel.trim()) return; setSaving(true);
    const el=svgRef.current;
    const cx=el?(el.clientWidth/2-transformRef.current.x)/transformRef.current.scale+(Math.random()-.5)*200:0;
    const cy=el?(el.clientHeight/2-transformRef.current.y)/transformRef.current.scale+(Math.random()-.5)*120:0;
    const ti=CONCEPT_TYPES.find(t=>t.id===addType)||CONCEPT_TYPES[0];
    const nc={ text:addLabel.trim(), x:cx, y:cy, color:ti.color, icon:addIcon, shape:addShape||"pill", conceptType:addType, definition:addDef.trim(), difficulty:addDiff };
    try {
      const id=await fbAdd(nc,"concept");
      if (selectedConcept){ try{ await fbAdd({from:selectedConcept,to:id,label:""},"link"); }catch(_){} }
      setNewIds(p=>new Set([...p,id]));
      setTimeout(()=>setNewIds(p=>{ const n=new Set(p); n.delete(id); return n; }),900);
      pushHistory(concepts,links);
    } catch(e){ console.error(e); }
    setSaving(false);
  };

  const applyTemplate=async(tpl)=>{
    const el=svgRef.current;
    const ox=el?(el.clientWidth/2-transformRef.current.x)/transformRef.current.scale:0;
    const oy=el?(el.clientHeight/2-transformRef.current.y)/transformRef.current.scale:0;
    const ids=[];
    for (const n of tpl.nodes){ const id=await fbAdd({ text:n.text, x:ox+n.x, y:oy+n.y, color:n.color, icon:n.icon, shape:"pill", conceptType:n.conceptType, definition:"", difficulty:"medium" },"concept"); ids.push(id); }
    for (const lk of tpl.links){ if(ids[lk.from]&&ids[lk.to]) await fbAdd({from:ids[lk.from],to:ids[lk.to],label:lk.label||""},"link"); }
    pushHistory(concepts,links);
  };

  const delConcept=async id=>{ pushHistory(concepts,links); const ll=links.filter(l=>l.from===id||l.to===id); try{ await fbDelete(id); for(const lk of ll) if(lk.id) await fbDelete(lk.id); }catch(e){ console.error(e); } if(linking===id)setLinking(null); if(selectedConcept===id)setSelectedConcept(null); if(nodeAction?.id===id)setNodeAction(null); };
  const updateConceptPos=async(id,x,y)=>{ try{ await fbUpdate(id,{x,y}); }catch(e){} };
  const completeLink=async(targetId)=>{
    if (!linking || linking===targetId) { setLinking(null); return; }
    if (!links.find(l=>(l.from===linking&&l.to===targetId)||(l.from===targetId&&l.to===linking))){
      pushHistory(concepts,links);
      try{ await fbAdd({from:linking,to:targetId,label:""},"link"); }catch(e){ console.error(e); }
    }
    setLinking(null);
  };
  const startLink=(e,id)=>{ e.stopPropagation(); setLinking(id); };
  const updateLinkLabel=async(idx,label)=>{ const lk=links[idx]; if(!lk?.id)return; try{ await fbUpdate(lk.id,{label}); }catch(e){} };
  const deleteLink=async idx=>{ const lk=links[idx]; if(!lk?.id)return; try{ await fbDelete(lk.id); }catch(e){} setEditLinkIdx(null); };
  const cycleColor=async id=>{ const c=concepts.find(c=>c.id===id); if(!c)return; const i=(CONCEPT_COLORS.indexOf(c.color)+1)%CONCEPT_COLORS.length; try{ await fbUpdate(id,{color:CONCEPT_COLORS[i]}); }catch(e){} };
  const saveNodeDetails=async(id,{notes,links,tags})=>{ try{ await fbUpdate(id,{notes,links,tags}); }catch(e){ console.error(e); } };
  const toggleReview=async id=>{ const c=concepts.find(c=>c.id===id); if(!c)return; try{ await fbUpdate(id,{markedReview:!c.markedReview}); }catch(e){} };

  const dragStartPosRef=useRef(null);
  const dragPosRef=useRef({});
  const onSvgMD=e=>{ if(e.target.closest(".cnode"))return; setSelectedConcept(null); bgDragRef.current={x:e.clientX-transformRef.current.x,y:e.clientY-transformRef.current.y}; setBgDragging(true); };
  const onSvgMM=e=>{
    if(linking){ const el=svgRef.current; if(el){ const r=el.getBoundingClientRect(),tr=transformRef.current; setMousePos({x:(e.clientX-r.left-tr.x)/tr.scale,y:(e.clientY-r.top-tr.y)/tr.scale}); }}
    if(dragNodeIdRef.current){ const tr=transformRef.current,el=svgRef.current; if(!el)return; const r=el.getBoundingClientRect(); const nx=(e.clientX-r.left-tr.x)/tr.scale, ny=(e.clientY-r.top-tr.y)/tr.scale;
    if(dragStartPosRef.current){const ds=dragStartPosRef.current;if(Math.hypot(nx-ds.x,ny-ds.y)<5)return;}
    dragStartPosRef.current=null; dragPosRef.current={x:nx,y:ny}; setConcepts(p=>p.map(c=>c.id===dragNodeIdRef.current?{...c,x:nx,y:ny}:c)); return; }
    if(bgDragRef.current){ const nx=e.clientX-bgDragRef.current.x,ny=e.clientY-bgDragRef.current.y; transformRef.current={...transformRef.current,x:nx,y:ny}; setTransform(t=>({...t,x:nx,y:ny})); }
  };
  const onSvgMU=()=>{ if(dragNodeIdRef.current){ const id=dragNodeIdRef.current; const pos=dragPosRef.current; if(pos.x!==undefined) updateConceptPos(id,pos.x,pos.y); pushHistory(concepts,links); dragPosRef.current={}; dragStartPosRef.current=null; } setBgDragging(false); setDragNodeId(null); dragNodeIdRef.current=null; bgDragRef.current=null; };
  useEffect(()=>{ transformRef.current=transform; },[transform]);
  useEffect(()=>{ dragNodeIdRef.current=dragNodeId; },[dragNodeId]);

  useEffect(()=>{
    const el=svgRef.current; if(!el)return;
    const onW=e=>{ e.preventDefault(); const d=e.deltaY>0?.88:1.12; setTransform(t=>{ const n={...t,scale:Math.max(.2,Math.min(3,t.scale*d))}; transformRef.current=n; return n; }); };
    const onTS=e=>{ if(e.touches.length===2){ const dx=e.touches[0].clientX-e.touches[1].clientX,dy=e.touches[0].clientY-e.touches[1].clientY; pinchRef.current={dist:Math.hypot(dx,dy),scale:transformRef.current.scale}; return; } const t=e.touches[0]; touchRef.current={x:t.clientX-transformRef.current.x,y:t.clientY-transformRef.current.y}; };
    const onTM=e=>{ e.preventDefault(); if(e.touches.length===2&&pinchRef.current){ const dx=e.touches[0].clientX-e.touches[1].clientX,dy=e.touches[0].clientY-e.touches[1].clientY; const dist=Math.hypot(dx,dy),ns=Math.max(.25,Math.min(3,pinchRef.current.scale*(dist/pinchRef.current.dist))); setTransform(t=>{ const n={...t,scale:ns}; transformRef.current=n; return n; }); return; } if(!touchRef.current)return; const t=e.touches[0]; const nx=t.clientX-touchRef.current.x,ny=t.clientY-touchRef.current.y; transformRef.current={...transformRef.current,x:nx,y:ny}; setTransform(tr=>({...tr,x:nx,y:ny})); };
    const onTE=()=>{ touchRef.current=null; pinchRef.current=null; };
    el.addEventListener("wheel",onW,{passive:false}); el.addEventListener("touchstart",onTS,{passive:true}); el.addEventListener("touchmove",onTM,{passive:false}); el.addEventListener("touchend",onTE,{passive:true});
    return()=>{ el.removeEventListener("wheel",onW); el.removeEventListener("touchstart",onTS); el.removeEventListener("touchmove",onTM); el.removeEventListener("touchend",onTE); };
  },[]);

  const [mousePos,setMousePos]=useState({x:0,y:0});
  const resetView=()=>{ const el=svgRef.current; if(el){ const t={x:el.clientWidth/2,y:el.clientHeight/2,scale:1}; setTransform(t); transformRef.current=t; } };

  const searchLower=search.toLowerCase();
  const filteredConcepts=useMemo(()=>concepts.filter(c=>{ if(filterType!=="all"&&c.conceptType!==filterType)return false; if(searchLower&&!c.text.toLowerCase().includes(searchLower)&&!(c.definition||"").toLowerCase().includes(searchLower))return false; return true; }),[concepts,filterType,searchLower]);
  const matchedIds=new Set(filteredConcepts.map(c=>c.id));
  const isDimmed=id=>{ if(searchLower||filterType!=="all")return !matchedIds.has(id); if(!selectedConcept)return false; const ci=new Set([selectedConcept]); links.forEach(l=>{ if(l.from===selectedConcept)ci.add(l.to); if(l.to===selectedConcept)ci.add(l.from); }); return !ci.has(id); };

  const scopeLabel=useMemo(()=>{ if(filterSubjectId==="all")return "كل المفاهيم"; const s=subjects.find(s=>s.id===filterSubjectId); if(filterLessonId==="all")return s?.name||""; return lessons.find(l=>l.id===filterLessonId)?.name||""; },[filterSubjectId,filterLessonId,subjects,lessons]);
  const selConcept=concepts.find(c=>c.id===selectedConcept), reviewConcepts=concepts.filter(c=>c.markedReview);
  const activeFilters=(filterSubjectId!=="all"?1:0)+(filterLessonId!=="all"?1:0)+(filterType!=="all"?1:0);

  // Get link edit info (from/to names)
  const editLinkInfo = editLinkIdx !== null ? links[editLinkIdx] : null;
  const editLinkFrom = editLinkInfo ? concepts.find(c=>c.id===editLinkInfo.from) : null;
  const editLinkTo   = editLinkInfo ? concepts.find(c=>c.id===editLinkInfo.to)   : null;

  // Start linking from toolbar button
  const startLinkingFromSelected = () => {
    if (selectedConcept) { setLinking(selectedConcept); setSelectedConcept(null); }
  };

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", position:"relative", overflow:"hidden", borderRadius:16, border:`1px solid ${C.border}`, background:"linear-gradient(135deg,#0A0710 0%,#0F0A16 40%,#0C0812 100%)" }}>
      <style>{KEYFRAMES}</style>

      {/* ── TOP BAR ── */}
      <div style={{ position:"absolute", top:0, left:0, right:0, zIndex:20, display:"flex", alignItems:"center", gap:6, padding:"9px 11px", background:"linear-gradient(180deg,rgba(9,6,13,.98) 70%,rgba(9,6,13,0) 100%)", backdropFilter:"blur(8px)" }}>
        {/* Scope pill */}
        <div style={{ flex:1, minWidth:0, overflow:"hidden" }}>
          <div style={{ padding:"5px 10px", borderRadius:9, background:C.card, border:`1px solid ${C.border}`, fontSize:11, color:C.muted, fontFamily:"'Cairo',sans-serif", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:140, display:"inline-block" }}>{scopeLabel}</div>
        </div>
        {/* Actions */}
        <div style={{ display:"flex", gap:5, alignItems:"center", flexShrink:0 }}>
          <IconBtn icon="🔍" active={showSearch} onClick={()=>setShowSearch(p=>!p)} title="بحث (Ctrl+F)"/>
          <IconBtn icon="⚙️" active={activeFilters>0} badge={activeFilters||null} onClick={()=>setShowFilters(true)} title="فلاتر"/>
          <IconBtn icon="↩" disabled={!history.length} onClick={undo} title="تراجع (Ctrl+Z)"/>
          <IconBtn icon="↪" disabled={!redoStack.length} onClick={redo} title="أعد (Ctrl+Y)"/>
          {/* LINK BUTTON — visible always on desktop, highlighted when linking */}
          {concepts.length>1&&(
            <IconBtn
              icon="🔗"
              isLink
              isLinkActive={!!linking}
              onClick={()=>{
                if (linking) { setLinking(null); return; }
                if (selectedConcept) { startLinkingFromSelected(); }
                else {
                  // On mobile: open node action. On desktop: show hint
                  const mobile=window.matchMedia?.("(pointer:coarse)").matches;
                  if (!mobile) {
                    // just arm linking mode – user clicks source node
                    setLinking("__pick_source__");
                  }
                }
              }}
              title={linking ? "إلغاء الربط (Esc)" : selectedConcept ? "اربط هذا المفهوم (L)" : "ربط مفاهيم — اختار المصدر"}
            />
          )}
          {concepts.length>0&&<IconBtn icon="🖨️" onClick={()=>printMap(svgRef.current)} title="طباعة الخريطة"/>}
          {concepts.length>0&&<IconBtn icon="🎯" onClick={()=>setShowQuiz(true)} title="اختبار"/>}
          {reviewConcepts.length>0&&<div style={{ padding:"4px 8px", borderRadius:8, fontSize:10, background:"rgba(180,142,245,0.15)", border:`1px solid ${C.purple}44`, color:C.purple, fontWeight:800, flexShrink:0 }}>🔖{reviewConcepts.length}</div>}
          <IconBtn icon="📋" onClick={()=>setShowTemplates(true)} title="قوالب"/>
          {concepts.length>0&&<IconBtn icon="🗑" danger onClick={async()=>{ if(!window.confirm("مسح كل المفاهيم؟"))return; pushHistory(concepts,links); for(const c of concepts){try{await fbDelete(c.id);}catch(e){}} for(const l of links){try{if(l.id)await fbDelete(l.id);}catch(e){}} setLinking(null);setSelectedConcept(null); }} title="مسح الكل"/>}
        </div>
      </div>

      {/* Search bar */}
      {showSearch&&(
        <div className="mm-slide-down" style={{ position:"absolute", top:50, left:11, right:11, zIndex:19 }}>
          <div style={{ position:"relative" }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث في المفاهيم..." autoFocus
              className="mm-input" style={{ width:"100%", padding:"10px 36px 10px 14px", borderRadius:12, fontSize:13 }}/>
            <button onClick={()=>{ setSearch(""); setShowSearch(false); }} className="tap"
              style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:C.muted, fontSize:14 }}>✕</button>
          </div>
        </div>
      )}

      {/* Linking / selection banner */}
      {linking&&linking!=="__pick_source__"&&(
        <div className="mm-slide-down" style={{ position:"absolute", top:52, left:"50%", transform:"translateX(-50%)", zIndex:25, background:C.card, border:`1px solid ${C.accent}55`, borderRadius:12, padding:"7px 16px", fontSize:12, color:C.accent, fontWeight:700, boxShadow:"0 4px 16px rgba(232,121,160,0.2)", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ color:C.purple }}>من:</span> <span style={{ color:C.text }}>{concepts.find(c=>c.id===linking)?.text||"..."}</span>
          <span style={{ color:C.muted }}>→</span>
          <span style={{ color:C.teal }}>اختار المفهوم الوجهة</span>
          <span style={{ color:C.dim, fontSize:10 }}>(Esc إلغاء)</span>
        </div>
      )}
      {linking==="__pick_source__"&&(
        <div className="mm-slide-down" style={{ position:"absolute", top:52, left:"50%", transform:"translateX(-50%)", zIndex:25, background:C.card, border:`1px solid ${C.purple}55`, borderRadius:12, padding:"7px 16px", fontSize:12, color:C.purple, fontWeight:700, boxShadow:"0 4px 16px rgba(180,142,245,0.2)", whiteSpace:"nowrap" }}>
          🔗 اضغط على المفهوم المصدر (الذي يخرج منه السهم)
        </div>
      )}
      {selectedConcept&&!linking&&(
        <div className="mm-slide-down" style={{ position:"absolute", top:52, left:"50%", transform:"translateX(-50%)", zIndex:20, background:"linear-gradient(135deg,#1E1528,#1A1222)", border:`1.5px solid ${selConcept?.color}55`, borderRadius:16, padding:"10px 12px", boxShadow:`0 8px 32px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.04), 0 0 20px ${selConcept?.color}22`, display:"flex", flexDirection:"column", gap:8, minWidth:220, maxWidth:280 }}>
          {/* Concept label */}
          <div style={{ display:"flex", alignItems:"center", gap:7, padding:"0 2px" }}>
            <div style={{ width:28, height:28, borderRadius:8, background:`${selConcept?.color}22`, border:`1px solid ${selConcept?.color}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{selConcept?.icon}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:800, color:C.text, fontFamily:"'Cairo',sans-serif", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{selConcept?.text}</div>
              <div style={{ fontSize:10, color:selConcept?.color, fontWeight:600 }}>{CONCEPT_TYPES.find(t=>t.id===selConcept?.conceptType)?.label||""}</div>
            </div>
            <button onClick={()=>setSelectedConcept(null)} className="tap" style={{ width:22,height:22,borderRadius:6,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.08)",color:C.dim,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>✕</button>
          </div>
          {/* Divider */}
          <div style={{ height:1, background:"rgba(255,255,255,.06)", margin:"0 -2px" }}/>
          {/* Action buttons grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
            {[
              { icon:"📋", label:"تفاصيل",     color:C.teal,   fn:()=>{ setNodeDetail(selConcept); setSelectedConcept(null); } },
              { icon:"✏️", label:"تعديل الاسم", color:C.text,   fn:()=>{ setEditNode({id:selectedConcept,text:selConcept?.text||""}); setSelectedConcept(null); } },
              { icon:"🔗", label:"ربط",         color:C.purple, fn:startLinkingFromSelected, kbd:"L" },
              { icon:"🎨", label:"تغيير لون",   color:C.muted,  fn:()=>{ cycleColor(selectedConcept); } },
              { icon:"✦",  label:"فرع جديد",    color:C.accent, fn:()=>{ setShowAdd(true); } },
              { icon:"🖨️", label:"PDF",         color:C.gold,   fn:()=>printMap(svgRef.current) },
              { icon:"🔖", label:selConcept?.markedReview?"إلغاء مراجعة":"للمراجعة", color:C.gold, fn:()=>{ toggleReview(selectedConcept); } },
              { icon:"🗑", label:"حذف",         color:C.danger, fn:()=>{ delConcept(selectedConcept); setSelectedConcept(null); }, danger:true },
            ].map(({icon,label,color,fn,kbd,danger})=>(
              <button key={label} onClick={fn} className="tap"
                style={{ padding:"8px 8px", borderRadius:10, fontFamily:"'Cairo',sans-serif", fontWeight:700, fontSize:11,
                  background:danger?"rgba(252,129,129,0.08)":"rgba(255,255,255,.04)",
                  border:`1px solid ${danger?"rgba(252,129,129,0.2)":color==="rgba(255,245,238,1)"||color===C.text?"rgba(255,255,255,.1)":`${color}33`}`,
                  color, display:"flex", alignItems:"center", justifyContent:"center", gap:5, transition:"all .15s" }}>
                <span style={{ fontSize:13 }}>{icon}</span>
                <span>{label}</span>
                {kbd&&<span className="kbd" style={{ marginRight:"auto" }}>{kbd}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Zoom controls */}
      <div style={{ position:"absolute", bottom:72, right:11, zIndex:10, display:"flex", flexDirection:"column", gap:5 }}>
        {[{l:"+",fn:()=>setTransform(t=>({...t,scale:Math.min(3,t.scale*1.2)})),title:"تكبير"},{l:"⟳",fn:resetView,title:"إعادة ضبط العرض"},{l:"−",fn:()=>setTransform(t=>({...t,scale:Math.max(.2,t.scale*.8)})),title:"تصغير"}].map(({l,fn,title})=>(
          <button key={l} onClick={fn} title={title} className="tap zoom-btn"
            style={{ width:36, height:36, borderRadius:10, background:C.card, border:`1px solid ${C.border}`, color:C.text, fontSize:l==="⟳"?12:20, display:"flex", alignItems:"center", justifyContent:"center", transition:"background .15s,transform .12s" }}>{l}</button>
        ))}
        <div style={{ fontSize:9, color:C.dim, background:C.card, padding:"3px 6px", borderRadius:7, border:`1px solid ${C.border}`, textAlign:"center" }}>{Math.round(transform.scale*100)}%</div>
      </div>

      {/* Loading */}
      {loading&&<div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", zIndex:50, background:"rgba(11,8,16,.82)", backdropFilter:"blur(4px)" }}><div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}><div style={{ width:34, height:34, borderRadius:"50%", border:`3px solid ${C.border}`, borderTopColor:C.accent, animation:"spin .7s linear infinite" }}/><div style={{ fontSize:12, color:C.muted }}>جاري التحميل...</div></div></div>}

      {/* SVG Canvas */}
      <svg ref={svgRef} width="100%" height="100%"
        style={{ cursor:linking?"crosshair":dragNodeId?"grabbing":bgDragging?"grabbing":"grab", display:"block", touchAction:"none" }}
        onMouseDown={onSvgMD} onMouseMove={onSvgMM} onMouseUp={onSvgMU} onMouseLeave={onSvgMU}>
        <defs>
          <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="14" cy="14" r="0.8" fill="rgba(255,210,245,0.12)"/>
          </pattern>
          <pattern id="cgrid" x="0" y="0" width="112" height="112" patternUnits="userSpaceOnUse">
            <rect width="112" height="112" fill="url(#dots)"/>
            <circle cx="0"   cy="0"   r="1.4" fill="rgba(255,210,245,0.18)"/>
            <circle cx="112" cy="0"   r="1.4" fill="rgba(255,210,245,0.18)"/>
            <circle cx="0"   cy="112" r="1.4" fill="rgba(255,210,245,0.18)"/>
            <circle cx="112" cy="112" r="1.4" fill="rgba(255,210,245,0.18)"/>
          </pattern>
          <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.5)"/></marker>
          <marker id="arrow-a" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill={C.accent}/></marker>
          <marker id="arrow-p" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill={C.purple}/></marker>
        </defs>
        <rect width="100%" height="100%" fill="url(#cgrid)"/>
        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
          {links.map((lk,idx)=>{
            const c1=concepts.find(c=>c.id===lk.from), c2=concepts.find(c=>c.id===lk.to);
            if (!c1||!c2) return null;
            const dx=c2.x-c1.x, dy=c2.y-c1.y, len=Math.hypot(dx,dy)||1, off=58;
            const x1s=c1.x+(dx/len)*off, y1s=c1.y+(dy/len)*off, x2e=c2.x-(dx/len)*off, y2e=c2.y-(dy/len)*off;
            const mx=(x1s+x2e)/2, my=(y1s+y2e)/2, cv=.28;
            const cpx=mx+(-(y2e-y1s)*cv), cpy=my+((x2e-x1s)*cv);
            const path=`M${x1s},${y1s} Q${cpx},${cpy} ${x2e},${y2e}`;
            const isEd=editLinkIdx===idx, dim1=isDimmed(c1.id), dim2=isDimmed(c2.id);
            const isHL=selectedConcept&&(c1.id===selectedConcept||c2.id===selectedConcept);
            const opacity=(dim1&&dim2)?0.05:isEd||isHL?1:0.62;

            // Small "from" dot at start of arrow (source indicator)
            const fromDotX = x1s + (dx/len)*8;
            const fromDotY = y1s + (dy/len)*8;

            return (
              <g key={idx} opacity={opacity} style={{ transition:"opacity .25s" }}>
                <defs>
                  <linearGradient id={`eg${idx}`} x1={x1s} y1={y1s} x2={x2e} y2={y2e} gradientUnits="userSpaceOnUse">
                    <stop offset="0%"   stopColor={c1.color} stopOpacity={isEd||isHL?1:.75}/>
                    <stop offset="100%" stopColor={c2.color} stopOpacity={isEd||isHL?1:.75}/>
                  </linearGradient>
                </defs>
                {/* Glow layer behind line */}
                {(isEd||isHL)&&<path d={path} fill="none" stroke={`url(#eg${idx})`} strokeWidth={7} opacity={0.18} style={{pointerEvents:"none"}}/>}
                {/* Main line */}
                <path d={path} fill="none" stroke={`url(#eg${idx})`} strokeWidth={isEd||isHL?2.8:2} markerEnd={isEd?"url(#arrow-a)":"url(#arrow)"}/>
                {/* Source dot */}
                <circle cx={x1s} cy={y1s} r={isHL||isEd?5.5:3.5} fill={c1.color} opacity={isHL||isEd?1:.65}/>
                {(isHL||isEd)&&<circle cx={x1s} cy={y1s} r={9} fill={c1.color} opacity={0.1}/>}
                {/* Transparent hit area */}
                <path d={path} fill="none" stroke="transparent" strokeWidth={24} style={{ cursor:"pointer" }}
                  onClick={e=>{ e.stopPropagation(); setLinkLabel(lk.label||""); setEditLinkIdx(isEd?null:idx); }}
                  onMouseEnter={e=>{ const r=svgRef.current?.getBoundingClientRect(); setLinkHover({ x:e.clientX-(r?.left||0), y:e.clientY-(r?.top||0), fromName:c1.text, toName:c2.text, label:lk.label||"" }); }}
                  onMouseLeave={()=>setLinkHover(null)}
                />
                {lk.label
                  ? <g style={{ cursor:"pointer" }} onClick={e=>{ e.stopPropagation(); setLinkLabel(lk.label||""); setEditLinkIdx(isEd?null:idx); }}>
                      <rect x={mx-lk.label.length*3.5-10} y={my-12} width={lk.label.length*7+20} height={24} rx={12} fill={isEd?"rgba(244,114,182,0.15)":C.card} stroke={isEd?C.accent:"rgba(255,255,255,.1)"} strokeWidth={1}/>
                      <text x={mx} y={my+5} textAnchor="middle" fontSize={10} fill={isEd?C.accent:C.muted} fontFamily="'Cairo',sans-serif" fontWeight="600" style={{ pointerEvents:"none" }}>{lk.label}</text>
                    </g>
                  : <circle cx={mx} cy={my} r={5} fill={isEd?C.accent:"rgba(255,255,255,.04)"} stroke={isEd?C.accent:"rgba(255,255,255,.1)"} strokeWidth={1} style={{ cursor:"pointer" }} onClick={e=>{ e.stopPropagation(); setLinkLabel(""); setEditLinkIdx(isEd?null:idx); }}/>
                }
              </g>
            );
          })}
          {/* Live linking line */}
          {linking&&linking!=="__pick_source__"&&(()=>{ const src=concepts.find(c=>c.id===linking); if(!src)return null; return <line x1={src.x} y1={src.y} x2={mousePos.x} y2={mousePos.y} stroke={C.accent} strokeWidth={2} strokeDasharray="8,5" opacity={0.8} markerEnd="url(#arrow-a)" style={{pointerEvents:"none"}}/>; })()}
          {concepts.map(c=>{
            const isSel=selectedConcept===c.id, isLS=linking===c.id, isDim=isDimmed(c.id), isEd=editNode?.id===c.id, isNew=newIds.has(c.id);
            const isPickSource=linking==="__pick_source__";
            return (
              <g key={c.id} className={`cnode-g cnode${isNew?" mm-enter":""}`}
                style={{ cursor: isPickSource?"crosshair" : linking&&linking!=="__pick_source__"?"pointer" : dragNodeId===c.id?"grabbing":"grab", opacity:isDim?.1:1, transition:"opacity .22s" }}
                onMouseDown={e=>{
                  e.stopPropagation();
                  if(linking) return;
                  const tr=transformRef.current,el=svgRef.current;
                  if(el){ const r=el.getBoundingClientRect(); dragStartPosRef.current={x:(e.clientX-r.left-tr.x)/tr.scale,y:(e.clientY-r.top-tr.y)/tr.scale}; }
                  setDragNodeId(c.id); dragNodeIdRef.current=c.id;
                }}
                onClick={e=>{
                  e.stopPropagation();
                  // Pick source mode
                  if (linking==="__pick_source__"){ setLinking(c.id); return; }
                  if (linking){ completeLink(c.id); return; }
                  const mobile=window.matchMedia?.("(pointer:coarse)").matches;
                  if (mobile){ setNodeAction(c); return; }
                  setSelectedConcept(isSel?null:c.id);
                }}>
                <NodeCard concept={c} isSelected={isSel} isLinking={isLS} isDimmed={isDim} isEditing={isEd} editText={editNode?.text||""}
                  onEditChange={ev=>setEditNode(p=>({...p,text:ev.target.value}))}
                  onEditCommit={async()=>{ pushHistory(concepts,links); try{await fbUpdate(c.id,{text:editNode.text});}catch(_){} setEditNode(null); }}/>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Link hover tooltip (desktop) */}
      {linkHover&&<LinkTooltip x={linkHover.x} y={linkHover.y} fromName={linkHover.fromName} toName={linkHover.toName} label={linkHover.label}/>}

      {/* Empty state */}
      {!loading&&concepts.length===0&&(
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14, pointerEvents:"none", padding:24 }}>
          <div className="mm-float" style={{ fontSize:64, filter:"drop-shadow(0 0 38px rgba(232,121,160,.5))" }}>🧠</div>
          <div style={{ fontSize:16, fontWeight:900, color:C.text, textAlign:"center" }}>ابدأ خريطة المفاهيم</div>
          <div style={{ fontSize:12, color:C.muted, textAlign:"center", lineHeight:2 }}>
            {filterSubjectId!=="all"?`مفاهيم خاصة بـ "${scopeLabel}"`:"اختار مادة أو درس وابدأ"}<br/>
            <span style={{ color:C.dim }}>اضغط ✦ لإضافة مفهوم أو 📋 لاختيار قالب</span>
          </div>
          <div style={{ display:"flex", gap:7, pointerEvents:"all", flexWrap:"wrap", justifyContent:"center" }}>
            {CONCEPT_TYPES.map((t,i)=><div key={i} style={{ padding:"6px 13px", borderRadius:11, background:C.card, border:`1.5px solid ${t.color}44`, fontSize:11, color:t.color, fontWeight:700 }}>{t.icon} {t.label}</div>)}
          </div>
        </div>
      )}

      {/* FAB */}
      <button onClick={()=>setShowAdd(true)} className={`tap fab-btn${concepts.length===0?" mm-glow":""}`}
        style={{ position:"absolute", bottom:16, left:"50%", transform:"translateX(-50%)", zIndex:15, padding:"13px 32px", borderRadius:50, fontSize:14, fontFamily:"'Cairo',sans-serif", fontWeight:900, background:`linear-gradient(135deg,${C.accent} 0%,${C.purple} 100%)`, border:"none", color:"#fff", boxShadow:`0 8px 32px rgba(244,114,182,.5), 0 2px 8px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.2)`, whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:8, transition:"transform .18s,box-shadow .18s", letterSpacing:.3 }}>
        <span style={{ fontSize:16 }}>✦</span> مفهوم جديد
      </button>

      {/* Filters sheet */}
      {showFilters&&(
        <MobileSheet onClose={()=>setShowFilters(false)} title="⚙️ فلاتر">
          <div style={{ padding:"8px 18px 36px", display:"flex", flexDirection:"column", gap:13 }}>
            <div>
              <div style={{ fontSize:11, color:C.dim, marginBottom:7 }}>المادة</div>
              <select value={filterSubjectId} onChange={e=>{ setFilterSubjectId(e.target.value); setFilterLessonId("all"); }} className="mm-input" style={{ width:"100%", padding:"12px 14px", borderRadius:12, fontSize:14 }}>
                <option value="all">📚 كل المواد</option>
                {subjects.map(s=><option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
              </select>
            </div>
            {filterSubjectId!=="all"&&(
              <div>
                <div style={{ fontSize:11, color:C.dim, marginBottom:7 }}>الدرس</div>
                <select value={filterLessonId} onChange={e=>setFilterLessonId(e.target.value)} className="mm-input" style={{ width:"100%", padding:"12px 14px", borderRadius:12, fontSize:14 }}>
                  <option value="all">📖 كل الدروس</option>
                  {availableLessons.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
            )}
            <div>
              <div style={{ fontSize:11, color:C.dim, marginBottom:7 }}>نوع المفهوم</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7 }}>
                {[{id:"all",label:"الكل",icon:"🔘",color:C.muted},...CONCEPT_TYPES].map(t=>(
                  <button key={t.id} onClick={()=>setFilterType(t.id)} className="tap"
                    style={{ padding:"10px 10px", borderRadius:12, fontFamily:"'Cairo',sans-serif", fontSize:12, fontWeight:700, border:`1.5px solid ${filterType===t.id?(t.color||C.accent):"rgba(255,255,255,.08)"}`, background:filterType===t.id?`${t.color||C.accent}18`:"rgba(255,255,255,.03)", color:filterType===t.id?(t.color||C.accent):C.muted }}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>
            {activeFilters>0&&<button onClick={()=>{ setFilterSubjectId("all"); setFilterLessonId("all"); setFilterType("all"); setShowFilters(false); }} className="tap" style={{ padding:"12px", borderRadius:13, fontFamily:"'Cairo',sans-serif", fontWeight:700, fontSize:13, background:"rgba(252,129,129,0.1)", border:`1.5px solid ${C.danger}44`, color:C.danger }}>🗑 مسح الفلاتر</button>}
          </div>
        </MobileSheet>
      )}

      {/* Modals */}
      {showAdd&&<AddConceptModal onAdd={addConcept} onClose={()=>setShowAdd(false)} scopeLabel={scopeLabel} parentConcept={selConcept||null}/>}
      {showQuiz&&<QuizMode concepts={concepts} onClose={()=>setShowQuiz(false)}/>}
      {showTemplates&&<TemplatesSheet onSelect={applyTemplate} onClose={()=>setShowTemplates(false)}/>}

      {nodeAction&&(
        <NodeActionSheet concept={nodeAction}
          onEdit={()=>{ setEditNode({id:nodeAction.id,text:nodeAction.text}); setNodeAction(null); }}
          onDelete={()=>{ delConcept(nodeAction.id); setNodeAction(null); }}
          onLink={()=>{ setLinking(nodeAction.id); setSelectedConcept(null); setNodeAction(null); }}
          onCycleColor={()=>{ cycleColor(nodeAction.id); setNodeAction(null); }}
          onToggleReview={()=>{ toggleReview(nodeAction.id); setNodeAction(null); }}
          onDetail={()=>{ setNodeDetail(nodeAction); setNodeAction(null); }}
          onClose={()=>setNodeAction(null)}/>
      )}
      {nodeDetail&&(
        <NodeDetailSheet
          concept={nodeDetail}
          onSave={data=>saveNodeDetails(nodeDetail.id,data)}
          onClose={()=>setNodeDetail(null)}/>
      )}
      {editLinkIdx!==null&&(
        <LinkEditSheet
          linkLabel={linkLabel} setLinkLabel={setLinkLabel}
          fromName={editLinkFrom?.text||""} toName={editLinkTo?.text||""}
          onSave={()=>{ updateLinkLabel(editLinkIdx,linkLabel); setEditLinkIdx(null); }}
          onDelete={()=>deleteLink(editLinkIdx)}
          onClose={()=>setEditLinkIdx(null)}/>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════
export default function MindMap({ subjects, lessons, questions }) {
  const [viewMode, setViewMode] = useState("concepts");
  const totalQ=questions.length, totalErr=questions.filter(q=>!q.isCorrect).length, acc=totalQ?Math.round(((totalQ-totalErr)/totalQ)*100):0;
  const TABS=[{id:"concepts",label:"🧠 مفاهيم"},{id:"stats",label:"📊 إحصائيات"}];

  return (
    <div className="mm-fade" style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 130px)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, flexShrink:0, gap:8 }}>
        <div>
          <h2 style={{ fontSize:16, fontWeight:900, display:"flex", alignItems:"center", gap:7, fontFamily:"'Cairo',sans-serif" }}>🧠 الخريطة الذهنية</h2>
          <div style={{ fontSize:11, color:C.muted, marginTop:1 }}>
            {subjects.length} مادة · {lessons.length} درس
            {totalQ>0&&<span style={{ marginRight:6, color:acc>=80?C.success:acc>=50?C.gold:C.danger }}>· {acc}% دقة</span>}
          </div>
        </div>
        <div style={{ display:"flex", background:C.surface, borderRadius:11, padding:3, gap:2, border:`1px solid ${C.border}` }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setViewMode(t.id)} className="tap"
              style={{ padding:"6px 13px", borderRadius:9, fontSize:12, fontFamily:"'Cairo',sans-serif", fontWeight:700, border:"none", background:viewMode===t.id?`linear-gradient(135deg,${C.accent},${C.purple})`:"transparent", color:viewMode===t.id?"#fff":C.muted, boxShadow:viewMode===t.id?"0 2px 10px rgba(232,121,160,.3)":"none", transition:"all .18s" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {viewMode==="stats"    && <StatsView subjects={subjects} lessons={lessons} questions={questions}/>}
      {viewMode==="concepts" && <ConceptMap subjects={subjects} lessons={lessons}/>}
    </div>
  );
}