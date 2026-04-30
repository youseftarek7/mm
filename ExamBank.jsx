// ExamBank.jsx — بنك النماذج الاسترشادية 📋
// يُضاف في App.jsx: import ExamBank from "./ExamBank";
// ويُضاف في NAV:    { id:"exambank", icon:"\uD83D\uDCCB", label:"نماذج", more:true }
// ويُضاف في switch: case "exambank": return <ExamBank />;

import { useState, useEffect } from "react";

const C = {
  bg:          "#120A0E",
  bgDeep:      "#0C0608",
  surface:     "#1E1115",
  card:        "#24141A",
  cardHover:   "#2C1B22",
  border:      "rgba(255,182,213,0.10)",
  borderLight: "rgba(255,182,213,0.20)",
  accent:      "#FF6B9D",
  accentDark:  "#D94F7E",
  accentSoft:  "rgba(255,107,157,0.14)",
  purple:      "#C084B8",
  purpleSoft:  "rgba(192,132,184,0.13)",
  gold:        "#F9C06A",
  goldSoft:    "rgba(249,192,106,0.12)",
  success:     "#7DD3B0",
  successSoft: "rgba(125,211,176,0.12)",
  danger:      "#FF7E7E",
  dangerSoft:  "rgba(255,126,126,0.12)",
  text:        "#FDF0F5",
  muted:       "#C49BB0",
  dim:         "#6B4558",
};

const drivePreview = (url) =>
  url.replace("/view?usp=drive_link", "/preview").replace("/view?usp=sharing", "/preview");

const SUBJECTS = [
  {
    id: "arabic",
    name: "اللغة العربية",
    icon: "📖",
    color: "#FF6B9D",
    colorSoft: "rgba(255,107,157,0.14)",
    models: [
      { id:"ar_s1",  label:"ورقة ١ — ثانوية", tag:"ثانوية", url: drivePreview("https://drive.google.com/file/d/1wlNmHvCDMmz_Alus3athv2Aq42GzJdl0/view?usp=drive_link") },
      { id:"ar_s2",  label:"ورقة ٢ — ثانوية", tag:"ثانوية", url: drivePreview("https://drive.google.com/file/d/1bxbM9CkbnYz38-PDSyRIG6dENM1jfcIM/view?usp=drive_link") },
      { id:"ar_m3",  label:"نموذج ٣",          tag:"نموذج",  url: drivePreview("https://drive.google.com/file/d/1FjK_K9ImqLUFzjyvBgVyKz7gyWohIqoy/view?usp=drive_link") },
      { id:"ar_m4",  label:"نموذج ٤",          tag:"نموذج",  url: drivePreview("https://drive.google.com/file/d/1ialYIpoUd18ARbuGbTjxjgeloEuEA7Zj/view?usp=drive_link") },
      { id:"ar_m5",  label:"نموذج ٥",          tag:"نموذج",  url: drivePreview("https://drive.google.com/file/d/1F9s4i4RvZF9br51rMzjlNl03tWCUPJvZ/view?usp=drive_link") },
      { id:"ar_m6",  label:"نموذج ٦",          tag:"نموذج",  url: drivePreview("https://drive.google.com/file/d/1ZpGeVeKcT9Iuh23EBiz5Y9KHb944x8Mc/view?usp=drive_link") },
      { id:"ar_m7",  label:"نموذج ٧",          tag:"نموذج",  url: drivePreview("https://drive.google.com/file/d/1SOXyczTtXa-h0SPixet-IrFLLgwLIC8Q/view?usp=drive_link") },
      { id:"ar_m8",  label:"نموذج ٨",          tag:"نموذج",  url: drivePreview("https://drive.google.com/file/d/1e3cXP6BTbhY0MPFQ2uob9E9G0PqIIhRd/view?usp=drive_link") },
      { id:"ar_m9",  label:"نموذج ٩",          tag:"نموذج",  url: drivePreview("https://drive.google.com/file/d/1wi9mHsAAwfCCl7jUeEZQLaINRkZk5nKY/view?usp=drive_link") },
    ],
  },
  {
    id: "history",
    name: "التاريخ",
    icon: "🏛️",
    color: "#F9C06A",
    colorSoft: "rgba(249,192,106,0.12)",
    models: [
      { id:"hi_s1",  label:"ورقة ١ — ثانوية", tag:"ثانوية", url: drivePreview("https://drive.google.com/file/d/1hEo0TxbXdSeW7FOFsmOSvsIhto2vuqU5/view?usp=drive_link") },
      { id:"hi_s2",  label:"ورقة ٢ — ثانوية", tag:"ثانوية", url: drivePreview("https://drive.google.com/file/d/1gZuJEaeOl-3vTfxJLZs6zSYnFcPsCB6s/view?usp=drive_link") },
      { id:"hi_m3",  label:"نموذج ٣",          tag:"نموذج",  url: drivePreview("https://drive.google.com/file/d/1jTYRV-aUbzRkBhtGiai4LsN9XMMGsarj/view?usp=drive_link") },
      { id:"hi_m4",  label:"نموذج ٤",          tag:"نموذج",  url: drivePreview("https://drive.google.com/file/d/1itC--yiZ1QtdMp1GQ3DKfiec7w6uy4bK/view?usp=drive_link") },
      { id:"hi_m5",  label:"نموذج ٥",          tag:"نموذج",  url: drivePreview("https://drive.google.com/file/d/107m-MVSKEHGE6PhueFUrj_RjmR9VBvHI/view?usp=drive_link") },
      { id:"hi_m6",  label:"نموذج ٦",          tag:"نموذج",  url: drivePreview("https://drive.google.com/file/d/1VLBoJx4S7qdc90OAUcB_r4VU0tDmebq4/view?usp=drive_link") },
      { id:"hi_m7",  label:"نموذج ٧",          tag:"نموذج",  url: drivePreview("https://drive.google.com/file/d/1U8AlD7PmXqVrzMyHlcdbxhgM7c7eGmhf/view?usp=drive_link") },
      { id:"hi_m8",  label:"نموذج ٨",          tag:"نموذج",  url: drivePreview("https://drive.google.com/file/d/1n4H5XMGbtBqEigEEf4-xNrPxWBmiAfjy/view?usp=drive_link") },
      { id:"hi_m9",  label:"نموذج ٩",          tag:"نموذج",  url: drivePreview("https://drive.google.com/file/d/1M73jJDhaByz-l1GF2GebcC9gavC-E6Fi/view?usp=drive_link") },
      { id:"hi_m10", label:"نموذج ١٠",         tag:"نموذج",  url: drivePreview("https://drive.google.com/file/d/1W993ql1yeq51hzjWbyj6yNny3IXuSU_C/view?usp=drive_link") },
    ],
  },
  {
    id: "geography",
    name: "الجغرافيا",
    icon: "🌍",
    color: "#7DD3B0",
    colorSoft: "rgba(125,211,176,0.12)",
    models: [
      { id:"ge_s1",  label:"ورقة ١ — ثانوية", tag:"ثانوية", url: drivePreview("https://drive.google.com/file/d/1bSpPQEdMVJriP2CizrCO7CKveuz0Akem/view?usp=drive_link") },
      { id:"ge_s2",  label:"ورقة ٢ — ثانوية", tag:"ثانوية", url: drivePreview("https://drive.google.com/file/d/1ZQMtAFHgHAKM9is4_Gpw0BMNXclGLq76/view?usp=drive_link") },
    ],
  },
  {
    id: "english",
    name: "اللغة الإنجليزية",
    icon: "🇬🇧",
    color: "#60B8FF",
    colorSoft: "rgba(96,184,255,0.12)",
    models: [
      { id:"en_s1",  label:"ورقة ١ — ثانوية", tag:"ثانوية", url: drivePreview("https://drive.google.com/file/d/1KrBycjMejuRC-M1-zOKYlx1pCA3klCk7/view?usp=drive_link") },
      { id:"en_s2",  label:"ورقة ٢ — ثانوية", tag:"ثانوية", url: drivePreview("https://drive.google.com/file/d/11Wsz4AbSynYVSelGEk_6IPB6h9aTd682/view?usp=drive_link") },
      { id:"en_m3",  label:"نموذج ٣",          tag:"نموذج",  url: drivePreview("https://drive.google.com/file/d/1WEfKdUaES8nYk5HUOFd2_pT-p4ghReB6/view?usp=drive_link") },
      { id:"en_m4",  label:"نموذج ٤",          tag:"نموذج",  url: drivePreview("https://drive.google.com/file/d/1tZ7eb7SGcz3GVl8P7V6pC0COGIweOF-1/view?usp=drive_link") },
      { id:"en_m5",  label:"نموذج ٥",          tag:"نموذج",  url: drivePreview("https://drive.google.com/file/d/1dp846mmO8WOiYl7bpcamf1zLvGBq--IB/view?usp=drive_link") },
      { id:"en_m6",  label:"نموذج ٦",          tag:"نموذج",  url: drivePreview("https://drive.google.com/file/d/1hxFib5LfSDIbNILwbFjXg_EwMcGM6lTZ/view?usp=drive_link") },
    ],
  },
  {
    id: "french",
    name: "اللغة الفرنسية",
    icon: "🇫🇷",
    color: "#FF9A6C",
    colorSoft: "rgba(255,154,108,0.12)",
    models: [
      { id:"fr_s1",  label:"ورقة ١ — ثانوية", tag:"ثانوية", url: drivePreview("https://drive.google.com/file/d/14nRZtPEErZxt_5F-ntOsX4feEG3M8GDp/view?usp=drive_link") },
      { id:"fr_s2",  label:"ورقة ٢ — ثانوية", tag:"ثانوية", url: drivePreview("https://drive.google.com/file/d/16tFs9ongA4_kRq5OJJ6zn8FhPA2GZXJe/view?usp=drive_link") },
      { id:"fr_m3",  label:"نموذج ٣",          tag:"نموذج",  url: drivePreview("https://drive.google.com/file/d/1s6ZOjxp0kHPA0XfJ03d4DObgpauOX2zk/view?usp=drive_link") },
      { id:"fr_m4",  label:"نموذج ٤",          tag:"نموذج",  url: drivePreview("https://drive.google.com/file/d/1jd11Xrf2U4lgfEmJics0VDGQYWKfW-8G/view?usp=drive_link") },
      { id:"fr_m5",  label:"نموذج ٥",          tag:"نموذج",  url: drivePreview("https://drive.google.com/file/d/1spc2fBZrCohC1wtTJrhNRM8uH-fG-Lyu/view?usp=drive_link") },
      { id:"fr_m6",  label:"نموذج ٦",          tag:"نموذج",  url: drivePreview("https://drive.google.com/file/d/1AASRABdrQjIvAqH-0uybHGiYbCuwqe4d/view?usp=drive_link") },
    ],
  },
];

const STORAGE_KEY = "maha_exambank_checks";
const loadChecks  = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}"); } catch { return {}; } };
const saveChecks  = (c) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); } catch {} };

// ===
// PDF VIEWER MODAL
// ===
function PdfModal({ url, title, onClose }) {
  if (!url) return null;
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, zIndex:99999,
      background:"rgba(8,4,6,.95)", backdropFilter:"blur(6px)",
      display:"flex", flexDirection:"column",
      fontFamily:"'Cairo',sans-serif",
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"10px 16px", background:"#1E1115",
        borderBottom:"1px solid rgba(255,182,213,0.12)", flexShrink:0,
      }}>
        <span style={{fontSize:13, fontWeight:700, color:"#FDF0F5"}}>{title}</span>
        <button onClick={onClose} style={{
          background:"rgba(255,126,126,0.12)", border:"1px solid rgba(255,126,126,0.2)",
          color:"#FF7E7E", borderRadius:7, padding:"5px 12px",
          fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Cairo',sans-serif",
        }}>✕ إغلاق</button>
      </div>
      <div onClick={e=>e.stopPropagation()} style={{flex:1, overflow:"hidden"}}>
        <iframe src={url} style={{width:"100%", height:"100%", border:"none"}}
          allow="autoplay" title={title}/>
      </div>
    </div>
  );
}

// ===
// MAIN COMPONENT
// ===
export default function ExamBank() {
  const [checks, setChecks]               = useState(loadChecks);
  const [activeSubject, setActiveSubject] = useState(null);
  const [filterDone, setFilterDone]       = useState("all");
  const [pdfModal, setPdfModal]           = useState(null);

  useEffect(() => { saveChecks(checks); }, [checks]);

  const toggleCheck = (modelId) =>
    setChecks(prev => {
      const u = { ...prev };
      u[modelId] ? delete u[modelId] : (u[modelId] = new Date().toISOString());
      return u;
    });

  const resetSubject = (subjectId) => {
    const sub = SUBJECTS.find(s => s.id === subjectId);
    if (!sub) return;
    setChecks(prev => {
      const u = { ...prev };
      sub.models.forEach(m => delete u[m.id]);
      return u;
    });
  };

  const totalModels = SUBJECTS.reduce((a,s) => a + s.models.length, 0);
  const doneModels  = Object.keys(checks).length;
  const pct         = totalModels ? Math.round((doneModels / totalModels) * 100) : 0;
  const subject     = activeSubject ? SUBJECTS.find(s => s.id === activeSubject) : null;

  return (
    <div className="fade" style={{fontFamily:"'Cairo',sans-serif", direction:"rtl"}}>

      {pdfModal && <PdfModal url={pdfModal.url} title={pdfModal.title} onClose={()=>setPdfModal(null)}/>}

      {/* Header */}
      <div style={{
        marginBottom:20, padding:"18px 20px 16px", borderRadius:16,
        background:"linear-gradient(135deg,rgba(255,107,157,.10),rgba(192,132,184,.07))",
        border:"1px solid rgba(255,107,157,.18)",
      }}>
        <div style={{display:"flex", alignItems:"center", gap:11, marginBottom:14}}>
          {activeSubject && (
            <button onClick={()=>{ setActiveSubject(null); setFilterDone("all"); }}
              style={{background:C.surface, border:`1px solid ${C.border}`, color:C.muted,
                borderRadius:8, padding:"5px 10px", fontSize:12, cursor:"pointer", fontFamily:"'Cairo',sans-serif"}}>
              ← رجوع
            </button>
          )}
          <div style={{fontSize:28}} className="float">📋</div>
          <div style={{flex:1}}>
            <h1 style={{fontSize:17, fontWeight:900, color:C.text, marginBottom:2}}>
              {subject ? `${subject.icon} ${subject.name}` : "بنك النماذج الاسترشادية"}
            </h1>
            <p style={{color:C.muted, fontSize:11}}>
              {subject
                ? `${subject.models.filter(m=>checks[m.id]).length} من ${subject.models.length} نموذج مكتمل`
                : `${doneModels} من ${totalModels} نموذج — الثانوية العامة ٢٠٢٥`}
            </p>
          </div>
          {!activeSubject && (
            <div style={{
              width:46, height:46, borderRadius:"50%",
              background:`conic-gradient(${C.accent} ${pct*3.6}deg, ${C.surface} 0deg)`,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <div style={{
                width:34, height:34, borderRadius:"50%", background:C.card,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:10, fontWeight:800, color:C.accent,
              }}>{pct}%</div>
            </div>
          )}
        </div>
        {!activeSubject && (
          <div style={{height:6, borderRadius:10, background:"rgba(255,255,255,.07)", overflow:"hidden"}}>
            <div style={{height:"100%", width:pct+"%", borderRadius:10,
              background:`linear-gradient(90deg,${C.accent},${C.purple})`, transition:"width .6s ease"}}/>
          </div>
        )}
      </div>

      {/* Overview */}
      {!activeSubject && (
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))", gap:10}}>
          {SUBJECTS.map(sub => {
            const total   = sub.models.length;
            const done    = sub.models.filter(m=>checks[m.id]).length;
            const p       = total ? Math.round((done/total)*100) : 0;
            const allDone = done === total;
            return (
              <div key={sub.id} onClick={()=>setActiveSubject(sub.id)}
                style={{
                  background: allDone ? `linear-gradient(135deg,${sub.colorSoft},rgba(125,211,176,.08))` : C.card,
                  border:`1px solid ${allDone ? sub.color+"44" : C.border}`,
                  borderRadius:12, padding:"14px 13px", cursor:"pointer",
                  transition:"all .15s", position:"relative", overflow:"hidden",
                }}
                onMouseEnter={e=>Object.assign(e.currentTarget.style,{background:C.cardHover,borderColor:sub.color+"44",transform:"translateY(-1px)"})}
                onMouseLeave={e=>Object.assign(e.currentTarget.style,{
                  background:allDone?`linear-gradient(135deg,${sub.colorSoft},rgba(125,211,176,.08))`:C.card,
                  borderColor:allDone?sub.color+"44":C.border, transform:"translateY(0)",
                })}
              >
                {allDone && (
                  <div style={{position:"absolute",top:8,left:8,background:C.success,
                    color:"#0A0A0C",fontSize:8,fontWeight:800,padding:"1px 5px",borderRadius:4}}>✓ مكتمل</div>
                )}
                <div style={{fontSize:24, marginBottom:8}}>{sub.icon}</div>
                <div style={{fontSize:12, fontWeight:800, color:C.text, marginBottom:4, lineHeight:1.4}}>{sub.name}</div>
                <div style={{fontSize:11, color:C.muted, marginBottom:10}}>{done}/{total} نموذج</div>
                <div style={{height:4, borderRadius:4, background:"rgba(255,255,255,.07)", overflow:"hidden"}}>
                  <div style={{height:"100%", width:p+"%", borderRadius:4,
                    background:`linear-gradient(90deg,${sub.color},${sub.color}AA)`, transition:"width .5s ease"}}/>
                </div>
                <div style={{fontSize:10, color:sub.color, fontWeight:700, marginTop:4}}>{p}%</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subject View */}
      {subject && (
        <div>
          <div style={{display:"flex", gap:7, marginBottom:14, flexWrap:"wrap"}}>
            {[{key:"all",label:"الكل",icon:"📋"},{key:"pending",label:"لم تُذاكر",icon:"⏳"},{key:"done",label:"مكتمل",icon:"✅"}].map(f=>(
              <button key={f.key} onClick={()=>setFilterDone(f.key)} style={{
                background:filterDone===f.key?subject.colorSoft:C.surface,
                border:`1px solid ${filterDone===f.key?subject.color+"55":C.border}`,
                color:filterDone===f.key?subject.color:C.muted,
                borderRadius:8, padding:"6px 13px", fontSize:12, fontWeight:700,
                cursor:"pointer", fontFamily:"'Cairo',sans-serif", transition:"all .15s",
              }}>{f.icon} {f.label}</button>
            ))}
            <button onClick={()=>{ if(window.confirm(`هتمسحي كل علامات "${subject.name}"؟`)) resetSubject(subject.id); }}
              style={{marginRight:"auto",background:C.dangerSoft,border:"1px solid rgba(255,126,126,.2)",
                color:C.danger,borderRadius:8,padding:"6px 13px",fontSize:12,fontWeight:700,
                cursor:"pointer",fontFamily:"'Cairo',sans-serif"}}>🗑️ مسح الكل</button>
          </div>

          <div style={{display:"flex", flexDirection:"column", gap:8}}>
            {subject.models
              .filter(m => filterDone==="done" ? !!checks[m.id] : filterDone==="pending" ? !checks[m.id] : true)
              .map((model, idx) => {
                const isDone   = !!checks[model.id];
                const doneDate = checks[model.id]
                  ? new Date(checks[model.id]).toLocaleDateString("ar-EG",{day:"numeric",month:"short"})
                  : null;
                return (
                  <div key={model.id} style={{
                    background:isDone?`linear-gradient(90deg,${subject.colorSoft},${C.card})`:C.card,
                    border:`1px solid ${isDone?subject.color+"40":C.border}`,
                    borderRadius:11, padding:"12px 14px",
                    display:"flex", alignItems:"center", gap:12, transition:"all .15s",
                    animation:"fadeUp .2s ease both", animationDelay:idx*0.04+"s",
                  }}>
                    {/* Checkbox */}
                    <button onClick={()=>toggleCheck(model.id)} style={{
                      width:26, height:26, borderRadius:7, flexShrink:0,
                      border:`2px solid ${isDone?subject.color:C.dim}`,
                      background:isDone?`linear-gradient(135deg,${subject.color},${subject.color}BB)`:"transparent",
                      color:"#fff", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center",
                      cursor:"pointer", transition:"all .2s",
                      boxShadow:isDone?`0 0 8px ${subject.color}55`:"none",
                    }}>{isDone?"✓":""}</button>

                    {/* Info */}
                    <div style={{flex:1, minWidth:0}}>
                      <div style={{fontSize:13, fontWeight:700,
                        color:isDone?C.muted:C.text,
                        textDecoration:isDone?"line-through":"none",
                        textDecorationColor:C.dim, marginBottom:2}}>{model.label}</div>
                      {isDone && doneDate
                        ? <div style={{fontSize:10,color:subject.color,fontWeight:600}}>✅ خلصتِ في {doneDate}</div>
                        : <div style={{fontSize:10,color:C.dim}}>لم تُذاكر بعد</div>}
                    </div>

                    {/* Badge */}
                    <span style={{
                      background:model.tag==="ثانوية"?C.goldSoft:subject.colorSoft,
                      color:model.tag==="ثانوية"?C.gold:subject.color,
                      border:`1px solid ${model.tag==="ثانوية"?"rgba(249,192,106,.25)":subject.color+"30"}`,
                      padding:"2px 8px", borderRadius:5, fontSize:10, fontWeight:700, flexShrink:0,
                    }}>{model.tag}</span>

                    {/* زرار فتح PDF جوا الموقع */}
                    <button
                      onClick={()=>setPdfModal({url:model.url, title:`${subject.name} — ${model.label}`})}
                      style={{
                        background:subject.colorSoft, border:`1px solid ${subject.color}40`,
                        color:subject.color, borderRadius:7, padding:"5px 11px",
                        fontSize:11, fontWeight:700, cursor:"pointer",
                        fontFamily:"'Cairo',sans-serif", flexShrink:0,
                      }}>📄 افتح</button>
                  </div>
                );
              })}
          </div>

          {/* رسالة تشجيعية */}
          {subject.models.every(m=>checks[m.id]) && (
            <div style={{
              marginTop:20, padding:"18px 20px", borderRadius:14, textAlign:"center",
              background:"linear-gradient(135deg,rgba(125,211,176,.10),rgba(249,192,106,.08))",
              border:"1px solid rgba(125,211,176,.3)", animation:"fadeUp .3s ease",
            }}>
              <div style={{fontSize:32, marginBottom:8}}>🎉</div>
              <div style={{fontSize:15, fontWeight:900, color:C.success, marginBottom:4}}>
                أنهيتِ كل نماذج {subject.name}!
              </div>
              <div style={{fontSize:12, color:C.muted}}>عظيم يا مها 🌸 جاهزة للامتحان ✨</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}