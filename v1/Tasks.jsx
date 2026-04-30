// Tasks.jsx — بيستخدم AvatarDance.jsx
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { db } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy, limit } from "firebase/firestore";
import { AvatarDanceModal, DancesTab } from "./AvatarDance";
import AvatarStore from "./AvatarStore_updated";
import { DEFAULT_OUTFIT } from "./avatarConfig";

const C = {
  bg:"#120A0E",bgDeep:"#0C0608",surface:"#1E1115",card:"#24141A",cardHover:"#2C1B22",
  border:"rgba(255,182,213,0.10)",borderLight:"rgba(255,182,213,0.20)",
  accent:"#FF6B9D",accentDark:"#D94F7E",accentSoft:"rgba(255,107,157,0.14)",
  purple:"#C084B8",gold:"#F9C06A",success:"#7DD3B0",successSoft:"rgba(125,211,176,0.12)",
  danger:"#FF7E7E",dangerSoft:"rgba(255,126,126,0.12)",warning:"#FFAD6B",
  text:"#FDF0F5",muted:"#C49BB0",dim:"#6B4558",teal:"#85E0D0",
};
const toast=(msg,type="success")=>window._toastFn?.(msg,type);
const dialog={confirm:(msg,title="تأكيد")=>new Promise(r=>window._dialogFn?.({type:"confirm",title,msg,resolve:r}))};

function Btn({children,onClick,variant="primary",style={},disabled=false}){
  const v={primary:{background:C.accent,color:"#fff"},secondary:{background:C.surface,color:C.text,border:`1px solid ${C.border}`},
    danger:{background:C.dangerSoft,color:C.danger,border:"1px solid rgba(248,113,113,.2)"},
    success:{background:C.successSoft,color:C.success,border:"1px solid rgba(74,222,128,.2)"},
    ghost:{background:"transparent",color:C.muted,border:`1px solid ${C.border}`}};
  return(<button onClick={onClick} disabled={disabled} style={{fontWeight:600,fontSize:13,borderRadius:7,padding:"7px 14px",
    display:"inline-flex",alignItems:"center",gap:6,opacity:disabled?.4:1,cursor:disabled?"not-allowed":"pointer",
    fontFamily:"'Cairo',sans-serif",...(v[variant]||v.primary),...style}}>{children}</button>);
}

function Modal({show,onClose,title,children,maxWidth=540}){
  if(!show)return null;
  return createPortal(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:9000,background:"rgba(0,0,0,.75)",
      backdropFilter:"blur(4px)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.card,border:`1px solid ${C.borderLight}`,
        borderRadius:"14px 14px 0 0",width:"100%",maxWidth,maxHeight:"88vh",display:"flex",flexDirection:"column",
        animation:"slideUp .18s ease",boxShadow:"0 -8px 40px rgba(0,0,0,.5)"}}>
        <div style={{display:"flex",justifyContent:"center",padding:"10px 0 6px"}}>
          <div style={{width:32,height:3,borderRadius:3,background:C.dim}}/></div>
        {title&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
          padding:"0 16px 12px",flexShrink:0,borderBottom:`1px solid ${C.border}`}}>
          <span style={{fontSize:14,fontWeight:700,color:C.text}}>{title}</span>
          <button onClick={onClose} style={{background:C.surface,border:`1px solid ${C.border}`,color:C.muted,
            width:28,height:28,borderRadius:6,fontSize:13,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button></div>}
        <div style={{overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"14px 16px 24px",flex:1}}>{children}</div>
      </div>
    </div>,document.body);
}

function TaskTimer({taskName,onClose}){
  const[seconds,setSeconds]=useState(25*60);const[running,setRunning]=useState(false);const[mode,setMode]=useState("work");
  const timerRef=useRef();
  const MODES={work:{label:"مذاكرة 25د",secs:25*60,color:C.accent},break:{label:"راحة 5د",secs:5*60,color:C.success},long:{label:"راحة طويلة",secs:15*60,color:C.purple}};
  useEffect(()=>{if(running){timerRef.current=setInterval(()=>{setSeconds(s=>{if(s<=1){clearInterval(timerRef.current);setRunning(false);toast("انتهى الوقت! 🎉");return 0;}return s-1;});},1000);}else clearInterval(timerRef.current);return()=>clearInterval(timerRef.current);},[running]);
  const col=MODES[mode].color;const pct=(MODES[mode].secs-seconds)/MODES[mode].secs*100;const r=52;const circ=2*Math.PI*r;
  return(<div style={{textAlign:"center",padding:"4px 0 8px"}}>
    <div style={{fontSize:12,color:C.muted,marginBottom:12,fontWeight:600}}>{taskName}</div>
    <div style={{display:"flex",gap:5,justifyContent:"center",marginBottom:18}}>
      {Object.entries(MODES).map(([k,v])=>(<button key={k} onClick={()=>{setMode(k);setSeconds(MODES[k].secs);setRunning(false);}}
        style={{padding:"4px 10px",borderRadius:20,fontSize:11,fontFamily:"'Cairo',sans-serif",fontWeight:600,cursor:"pointer",
          background:mode===k?v.color+"22":"transparent",border:"1px solid "+(mode===k?v.color:C.border),color:mode===k?v.color:C.muted}}>{v.label}</button>))}
    </div>
    <div style={{position:"relative",display:"inline-block",marginBottom:18}}>
      <svg width={130} height={130}>
        <circle cx={65} cy={65} r={r} fill="none" stroke={C.surface} strokeWidth={7}/>
        <circle cx={65} cy={65} r={r} fill="none" stroke={col} strokeWidth={7} strokeDasharray={circ}
          strokeDashoffset={circ*(1-pct/100)} strokeLinecap="round" transform="rotate(-90 65 65)" style={{transition:"stroke-dashoffset .5s,stroke .3s"}}/>
      </svg>
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center"}}>
        <div style={{fontSize:22,fontWeight:900,color:C.text}}>{String(Math.floor(seconds/60)).padStart(2,"0")}:{String(seconds%60).padStart(2,"0")}</div>
      </div>
    </div>
    <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:12}}>
      <button onClick={()=>setRunning(r=>!r)} style={{width:46,height:46,borderRadius:"50%",background:col,border:"none",cursor:"pointer",
        fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px "+col+"55"}}>{running?"⏸":"▶"}</button>
      <button onClick={()=>{setSeconds(MODES[mode].secs);setRunning(false);}} style={{width:38,height:38,borderRadius:"50%",background:C.surface,
        border:"1px solid "+C.border,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>↺</button>
    </div>
    <button onClick={onClose} style={{fontSize:11,color:C.muted,background:"none",border:"none",cursor:"pointer",fontFamily:"'Cairo',sans-serif"}}>إغلاق</button>
  </div>);
}

const RANKS=[{min:0,label:"مبتدئة",icon:"🌱",color:"#6EE7B7"},{min:50,label:"نشيطة",icon:"⭐",color:"#F4C97A"},
  {min:150,label:"متميزة",icon:"🌟",color:"#E879A0"},{min:300,label:"متفوقة",icon:"💫",color:"#B48EF5"},{min:600,label:"أسطورة",icon:"👑",color:"#FC8181"}];
function getRank(xp){return[...RANKS].reverse().find(r=>xp>=r.min)||RANKS[0];}

const ACHIEVEMENTS=[
  {id:"first",icon:"🌱",title:"البداية",desc:"أول مهمة!",check:(t)=>t>=1},
  {id:"five",icon:"✨",title:"البداية الحلوة",desc:"٥ مهام",check:(t)=>t>=5},
  {id:"ten",icon:"🌟",title:"العشرة",desc:"١٠ مهام",check:(t)=>t>=10},
  {id:"twenty5",icon:"🏅",title:"ربع المية",desc:"٢٥ مهمة",check:(t)=>t>=25},
  {id:"fifty",icon:"🎯",title:"نص الطريق",desc:"٥٠ مهمة",check:(t)=>t>=50},
  {id:"century",icon:"💯",title:"الملكة",desc:"١٠٠ مهمة",check:(t)=>t>=100},
  {id:"streak3",icon:"🦁",title:"أسد المهام",desc:"٣ عاجلة",check:(t,xp,high)=>high>=3},
  {id:"highkill",icon:"⚔️",title:"قاتلة الصعب",desc:"١٠ عاجلة",check:(t,xp,high)=>high>=10},
  {id:"speed",icon:"🚀",title:"صاروخ النهار",desc:"٥ في يوم",check:(t,xp,h,today)=>today>=5},
  {id:"today7",icon:"💥",title:"يوم أسطوري",desc:"٧ في يوم",check:(t,xp,h,today)=>today>=7},
  {id:"xp100",icon:"🌸",title:"أول خطوة",desc:"١٠٠ نجمة",check:(t,xp)=>xp>=100},
  {id:"xp300",icon:"🔮",title:"ساحرة النجوم",desc:"٣٠٠ نجمة",check:(t,xp)=>xp>=300},
  {id:"xp500",icon:"💎",title:"كنز النجوم",desc:"٥٠٠ نجمة",check:(t,xp)=>xp>=500},
  {id:"xp1000",icon:"👑",title:"تاج النجوم",desc:"١٠٠٠ نجمة",check:(t,xp)=>xp>=1000},
  {id:"seven5",icon:"🌈",title:"على الطريق",desc:"٧٥ مهمة",check:(t)=>t>=75},
];
const TASK_MILESTONES=[5,10,20,30,40,50,65,80,100];

const TaskCard=({t,col,PRI,expandedId,setExpandedId,toggleSub,moveTask,setTimerTask,setEditTask,del,today})=>{
  const p=PRI[t.priority]||PRI.medium;
  const isOverdue=t.dueDate&&new Date(t.dueDate)<today&&col.id!=="done";
  const isExpanded=expandedId===t.id;
  const subsTotal=(t.subtasks||[]).length;const subsDone=(t.subtasks||[]).filter(s=>s.done).length;
  const subPct=subsTotal?Math.round(subsDone/subsTotal*100):0;
  const earnXP=p.pts+subsTotal*5;const isDone=col.id==="done";const isDoing=col.id==="doing";
  return(<div style={{background:isDone?"rgba(255,255,255,.02)":isDoing?"rgba(180,142,245,.05)":C.card,borderRadius:16,
    border:`1px solid ${isOverdue?"rgba(252,129,129,.4)":isDoing?"rgba(180,142,245,.2)":isExpanded?p.color+"33":C.border}`,
    overflow:"hidden",transition:"border-color .2s",opacity:isDone?.65:1,willChange:"transform"}}>
    <div onClick={()=>setExpandedId(isExpanded?null:t.id)} style={{padding:"13px 14px 11px",cursor:"pointer",userSelect:"none"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
          <span style={{fontSize:10,padding:"3px 10px",borderRadius:20,background:p.bg,color:p.color,fontWeight:700}}>{p.icon} {p.label}</span>
          {isDoing&&<span style={{fontSize:10,padding:"3px 9px",borderRadius:20,background:"rgba(180,142,245,.12)",color:C.purple,fontWeight:700}}>⚡ جاري</span>}
          {isOverdue&&<span style={{fontSize:10,color:C.danger,fontWeight:700}}>⏰ متأخرة</span>}
          {t.subject&&<span style={{fontSize:10,color:C.muted,background:C.surface,padding:"2px 8px",borderRadius:20,border:`1px solid ${C.border}`}}>{t.subject}</span>}
        </div>
        {!isDone?<span style={{fontSize:10,color:C.gold,fontWeight:700,background:"rgba(244,201,122,.1)",padding:"2px 8px",borderRadius:20,flexShrink:0}}>+{earnXP}⭐</span>
          :<span style={{fontSize:14,color:C.success}}>✓</span>}
      </div>
      <div style={{fontSize:14,fontWeight:600,lineHeight:1.6,color:isDone?C.muted:C.text,textDecoration:isDone?"line-through":"none",marginBottom:subsTotal>0?8:0}}>{t.text}</div>
      {subsTotal>0&&(<>
        <div style={{height:3,borderRadius:10,background:"rgba(255,255,255,.06)",overflow:"hidden",marginBottom:4}}>
          <div style={{height:"100%",width:subPct+"%",borderRadius:10,
            background:subPct===100?`linear-gradient(90deg,${C.success},${C.teal})`:`linear-gradient(90deg,${p.color},${C.gold})`,transition:"width .4s ease"}}/></div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:10,color:subsDone===subsTotal?C.success:C.muted}}>☑ {subsDone}/{subsTotal} مهام فرعية</span>
          <span style={{fontSize:11,color:C.dim}}>{isExpanded?"▲":"▼"}</span></div></>)}
      {subsTotal===0&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        {t.dueDate&&!isOverdue&&<span style={{fontSize:10,color:C.dim}}>📅 {new Date(t.dueDate).toLocaleDateString("ar-EG",{day:"numeric",month:"short"})}</span>}
        {t.note&&<span style={{fontSize:10,color:C.purple}}>💬 ملاحظة</span>}
        <span style={{fontSize:11,color:C.dim,marginRight:"auto"}}>{isExpanded?"▲":"▼"}</span></div>}
    </div>
    {isExpanded&&<div style={{borderTop:`1px solid ${C.border}`,padding:"12px 14px",background:"rgba(0,0,0,.12)"}}>
      {t.note&&<div style={{marginBottom:10,padding:"8px 12px",borderRadius:10,background:"rgba(180,142,245,.07)",
        border:"1px solid rgba(180,142,245,.15)",fontSize:12,color:C.purple,lineHeight:1.7}}>💬 {t.note}</div>}
      {subsTotal>0&&<div style={{marginBottom:12}}>
        <div style={{fontSize:11,color:C.muted,marginBottom:8,fontWeight:600,display:"flex",justifyContent:"space-between"}}>
          <span>المهام الفرعية</span><span style={{color:C.gold}}>+5⭐ لكل واحدة</span></div>
        {(t.subtasks||[]).map((s,si)=>(<div key={si} onClick={()=>toggleSub(t,si)}
          style={{display:"flex",gap:10,alignItems:"center",padding:"8px 0",cursor:"pointer",borderBottom:`1px solid ${C.border}`}}>
          <div style={{width:18,height:18,borderRadius:6,flexShrink:0,border:`1.5px solid ${s.done?C.success:C.dim}`,
            background:s.done?C.success:"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:10,transition:"all .18s"}}>{s.done?"✓":""}</div>
          <span style={{fontSize:12,color:s.done?C.muted:C.text,textDecoration:s.done?"line-through":"none",flex:1}}>{s.text}</span>
          {!s.done&&<span style={{fontSize:10,color:C.gold}}>+5⭐</span>}</div>))}</div>}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
        {col.id==="doing"&&<button onClick={()=>setTimerTask(t)} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 12px",borderRadius:20,fontSize:11,fontFamily:"'Cairo',sans-serif",fontWeight:700,cursor:"pointer",background:"rgba(232,121,160,.1)",border:"1px solid rgba(232,121,160,.25)",color:C.accent}}>⏱ تايمر</button>}
        {col.id!=="todo"&&<button onClick={()=>moveTask(t,"todo")} style={{padding:"6px 12px",borderRadius:20,fontSize:11,fontFamily:"'Cairo',sans-serif",cursor:"pointer",fontWeight:600,background:"rgba(255,255,255,.04)",border:`1px solid ${C.border}`,color:C.muted}}>← للقائمة</button>}
        {col.id!=="doing"&&<button onClick={()=>moveTask(t,"doing")} style={{padding:"6px 12px",borderRadius:20,fontSize:11,fontFamily:"'Cairo',sans-serif",cursor:"pointer",fontWeight:600,background:"rgba(251,184,108,.08)",border:"1px solid rgba(251,184,108,.2)",color:C.warning}}>⚡ جاري</button>}
        {col.id!=="done"&&<button onClick={()=>moveTask(t,"done")} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 14px",borderRadius:20,fontSize:11,fontFamily:"'Cairo',sans-serif",cursor:"pointer",fontWeight:700,background:"linear-gradient(135deg,rgba(110,231,183,.15),rgba(110,231,183,.06))",border:"1px solid rgba(110,231,183,.3)",color:C.success}}>✅ أنجزتِ (+{p.pts}⭐)</button>}
        <div style={{marginRight:"auto",display:"flex",gap:5}}>
          <button onClick={()=>setEditTask({...t})} style={{width:28,height:28,borderRadius:8,background:"rgba(180,142,245,.1)",border:"1px solid rgba(180,142,245,.2)",color:C.purple,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✎</button>
          <button onClick={()=>del(t.id)} style={{width:28,height:28,borderRadius:8,background:C.dangerSoft,border:"1px solid rgba(252,129,129,.15)",color:C.danger,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
      </div>
    </div>}
  </div>);
};

export default function Tasks({subjects}){
  const[tasks,setTasks]=useState([]);const[fetching,setFetching]=useState(true);
  const[filterSubj,setFilterSubj]=useState("all");const[filterPri,setFilterPri]=useState("all");
  const[sortBy,setSortBy]=useState("created");const[showAdd,setShowAdd]=useState(false);
  const[expandedId,setExpandedId]=useState(null);const[timerTask,setTimerTask]=useState(null);
  const[editTask,setEditTask]=useState(null);const[activeTab,setActiveTab]=useState("board");
  const[newText,setNewText]=useState("");const[newSubj,setNewSubj]=useState("");
  const[newPri,setNewPri]=useState("medium");const[newDate,setNewDate]=useState("");
  const[newNote,setNewNote]=useState("");const[newSubs,setNewSubs]=useState("");
  const[danceState,setDanceState]=useState({show:false,pts:0,label:"",danceIdx:0});
  const[outfit,setOutfit]=useState(DEFAULT_OUTFIT);
  const danceCountRef=useRef(0);

  const PRI=useMemo(()=>({
    high:{label:"عاجل",color:C.danger,bg:"rgba(252,129,129,.13)",icon:"🔴",pts:30},
    medium:{label:"متوسط",color:C.warning,bg:"rgba(251,184,108,.13)",icon:"🟡",pts:20},
    low:{label:"عادي",color:C.success,bg:"rgba(110,231,183,.13)",icon:"🟢",pts:10},
  }),[]);
  const COLS=useMemo(()=>[
    {id:"todo",label:"قائمة المهام",icon:"📋",color:C.accent,glow:"rgba(232,121,160,.06)"},
    {id:"doing",label:"جاري الآن",icon:"⚡",color:C.warning,glow:"rgba(251,184,108,.06)"},
    {id:"done",label:"تم الإنجاز",icon:"✅",color:C.success,glow:"rgba(110,231,183,.06)"},
  ],[]);

  useEffect(()=>{
    let cancelled=false;
    getDocs(query(collection(db,"tasks"),orderBy("createdAt","desc"),limit(200)))
      .then(s=>{if(cancelled)return;setTasks(s.docs.map(d=>{const data=d.data();return{id:d.id,...data,doneAt:data.doneAt?.toDate?.()??data.doneAt??null};}));setFetching(false);})
      .catch(()=>{if(!cancelled)setFetching(false);});
    return()=>{cancelled=true;};
  },[]);

  const getStatus=useCallback(t=>t.status||(t.done?"done":"todo"),[]);
  const computed=useMemo(()=>{
    const todayStr=new Date().toDateString();const today2=new Date();today2.setHours(0,0,0,0);
    const weekStart=new Date(today2);weekStart.setDate(today2.getDate()-today2.getDay());weekStart.setHours(0,0,0,0);
    const parse=v=>{if(!v)return null;if(typeof v.toDate==="function")return v.toDate();return new Date(v);};
    const done=tasks.filter(t=>getStatus(t)==="done");
    return{doneTasks:done,totalDone:done.length,
      todayDone:done.filter(t=>{const d=parse(t.doneAt);return d&&d.toDateString()===todayStr;}).length,
      weekDone:done.filter(t=>{const d=parse(t.doneAt);return d&&d>=weekStart;}).length,
      highDone:done.filter(t=>t.priority==="high").length,
      totalXP:done.reduce((s,t)=>s+(PRI[t.priority]?.pts||20)+(t.subtasks||[]).filter(x=>x.done).length*5,0),
      datedDone:tasks.filter(t=>t.dueDate).length};
  },[tasks,getStatus,PRI]);
  const{totalDone,todayDone,weekDone,highDone,totalXP,datedDone}=computed;
  const today=useMemo(()=>{const d=new Date();d.setHours(0,0,0,0);return d;},[]);
  const rank=useMemo(()=>getRank(totalXP),[totalXP]);
  const nextRank=useMemo(()=>RANKS.find(r=>r.min>totalXP),[totalXP]);
  const rankPct=useMemo(()=>nextRank?Math.min(100,Math.round(((totalXP-rank.min)/(nextRank.min-rank.min))*100)):100,[totalXP,rank,nextRank]);
  const nextM=useMemo(()=>TASK_MILESTONES.find(m=>m>totalDone),[totalDone]);
  const prevM=useMemo(()=>[...TASK_MILESTONES].reverse().find(m=>m<=totalDone)||0,[totalDone]);
  const pEnd=nextM||(prevM+10);
  const milestonePct=Math.min(100,Math.round(((totalDone-prevM)/(pEnd-prevM))*100));
  const stats=useMemo(()=>({todo:tasks.filter(t=>getStatus(t)==="todo").length,doing:tasks.filter(t=>getStatus(t)==="doing").length,done:totalDone}),[tasks,getStatus,totalDone]);
  const unlockedIds=useMemo(()=>ACHIEVEMENTS.filter(a=>a.check(totalDone,totalXP,highDone,todayDone,datedDone)).map(a=>a.id),[totalDone,totalXP,highDone,todayDone,datedDone]);

  const add=useCallback(async()=>{
    if(!newText.trim())return;
    const subs=newSubs.trim()?newSubs.split("\n").filter(s=>s.trim()).map(s=>({text:s.trim(),done:false})):[];
    const data={text:newText.trim(),subject:newSubj,priority:newPri,dueDate:newDate,note:newNote.trim(),subtasks:subs,status:"todo",done:false,createdAt:new Date()};
    try{const r=await addDoc(collection(db,"tasks"),data);setTasks(p=>[{id:r.id,...data},...p]);
      setNewText("");setNewSubj("");setNewPri("medium");setNewDate("");setNewNote("");setNewSubs("");setShowAdd(false);toast("تمت الإضافة ✨");}
    catch(e){toast("خطأ: "+e.message,"error");}
  },[newText,newSubj,newPri,newDate,newNote,newSubs]);

  const moveTask=useCallback(async(t,newStatus)=>{
    const doneAt=newStatus==="done"?new Date():null;const upd={status:newStatus,done:newStatus==="done",doneAt};
    try{await updateDoc(doc(db,"tasks",t.id),upd);}catch(e){toast("خطأ: "+e.message,"error");return;}
    const updated=tasks.map(x=>x.id===t.id?{...x,...upd}:x);setTasks(updated);
    if(newStatus==="done"){
      const earnedPts=(PRI[t.priority]?.pts||20)+(t.subtasks||[]).filter(s=>s.done).length*5;
      const danceIdx=danceCountRef.current++;
      setDanceState({show:true,pts:earnedPts,label:PRI[t.priority]?.label||"متوسط",danceIdx});
      const newDoneCount=updated.filter(x=>getStatus(x)==="done").length;
      if(TASK_MILESTONES.includes(newDoneCount))toast(`🎊 وصلتِ ${newDoneCount} مهمة! مبروك! 👑`,"info");}
  },[tasks,PRI,getStatus]);

  const toggleSub=useCallback(async(t,si)=>{
    const subs=(t.subtasks||[]).map((s,i)=>i===si?{...s,done:!s.done}:s);
    try{await updateDoc(doc(db,"tasks",t.id),{subtasks:subs});setTasks(p=>p.map(x=>x.id===t.id?{...x,subtasks:subs}:x));
      if(!t.subtasks[si].done)toast("☑ +5 نجوم للمهمة الفرعية");}
    catch(e){toast("خطأ: "+e.message,"error");}
  },[tasks]);

  const saveEdit=useCallback(async()=>{
    if(!editTask?.text.trim())return;
    const upd={text:editTask.text,subject:editTask.subject||"",priority:editTask.priority||"medium",dueDate:editTask.dueDate||"",note:editTask.note||"",subtasks:editTask.subtasks||[]};
    try{await updateDoc(doc(db,"tasks",editTask.id),upd);setTasks(p=>p.map(t=>t.id===editTask.id?{...t,...upd}:t));setEditTask(null);toast("تم التعديل ✅");}
    catch(e){toast("خطأ: "+e.message,"error");}
  },[editTask]);

  const del=useCallback(async id=>{
    const ok=await dialog.confirm("تحذفي المهمة دي؟");if(!ok)return;
    try{await deleteDoc(doc(db,"tasks",id));setTasks(p=>p.filter(t=>t.id!==id));toast("تم الحذف","info");}
    catch(e){toast("خطأ: "+e.message,"error");}
  },[]);

  const getColTasks=useCallback(colId=>{
    let pool=tasks.filter(t=>getStatus(t)===colId);
    if(filterSubj!=="all")pool=pool.filter(t=>t.subject===filterSubj);
    if(filterPri!=="all")pool=pool.filter(t=>t.priority===filterPri);
    if(sortBy==="priority")pool=[...pool].sort((a,b)=>({"high":0,"medium":1,"low":2}[a.priority]||1)-({"high":0,"medium":1,"low":2}[b.priority]||1));
    if(sortBy==="date")pool=[...pool].sort((a,b)=>(a.dueDate||"9")>(b.dueDate||"9")?1:-1);
    return pool.slice(0,20);
  },[tasks,getStatus,filterSubj,filterPri,sortBy]);

  return(<div style={{position:"relative"}}>
    <style>{`@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes floatEl{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>

    <AvatarDanceModal show={danceState.show} onClose={()=>setDanceState(s=>({...s,show:false}))} earnedPts={danceState.pts} taskLabel={danceState.label} danceIndex={danceState.danceIdx} outfit={outfit}/>

    <Modal show={!!editTask} onClose={()=>setEditTask(null)} title="✎ تعديل المهمة">
      {editTask&&<div style={{display:"flex",flexDirection:"column",gap:11}}>
        <input value={editTask.text} onChange={e=>setEditTask(p=>({...p,text:e.target.value}))} autoFocus style={{background:C.surface,border:`1px solid ${C.border}`,color:C.text,padding:"9px 13px",borderRadius:10,fontFamily:"'Cairo',sans-serif",fontSize:14}}/>
        <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
          <select value={editTask.subject||""} onChange={e=>setEditTask(p=>({...p,subject:e.target.value}))} style={{flex:1,fontSize:12,background:C.surface,border:`1px solid ${C.border}`,color:C.text,padding:"7px 10px",borderRadius:10,fontFamily:"'Cairo',sans-serif"}}>
            <option value="">بدون مادة</option>{subjects.map(s=><option key={s.id} value={s.name}>{s.icon} {s.name}</option>)}</select>
          <select value={editTask.priority||"medium"} onChange={e=>setEditTask(p=>({...p,priority:e.target.value}))} style={{width:"auto",fontSize:12,background:C.surface,border:`1px solid ${C.border}`,color:C.text,padding:"7px 10px",borderRadius:10,fontFamily:"'Cairo',sans-serif"}}>
            {Object.entries(PRI).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}</select></div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn variant="secondary" onClick={()=>setEditTask(null)}>إلغاء</Btn><Btn onClick={saveEdit}>💾 حفظ</Btn></div>
      </div>}
    </Modal>
    <Modal show={!!timerTask} onClose={()=>setTimerTask(null)} title="⏱ تايمر مذاكرة">
      {timerTask&&<TaskTimer taskName={timerTask.text} onClose={()=>setTimerTask(null)}/>}
    </Modal>

    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <div><h2 style={{fontSize:20,fontWeight:900,color:C.text,marginBottom:3,fontFamily:"'Cairo',sans-serif"}}>المهام</h2>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {[{v:stats.todo,label:"قائمة",color:C.accent},{v:stats.doing,label:"جاري",color:C.warning},{v:stats.done,label:"منجزة",color:C.success},{v:weekDone,label:"الأسبوع",color:C.purple}]
            .map((s,i)=>(<span key={i} style={{fontSize:11,color:s.color,fontWeight:700,background:s.color+"18",padding:"2px 9px",borderRadius:20,border:"1px solid "+s.color+"25",fontFamily:"'Cairo',sans-serif"}}>{s.v} {s.label}</span>))}</div></div>
      <button onClick={()=>setShowAdd(o=>!o)} style={{padding:"10px 18px",borderRadius:12,fontSize:13,fontFamily:"'Cairo',sans-serif",fontWeight:700,cursor:"pointer",border:"none",color:"#fff",
        background:showAdd?"rgba(252,129,129,.75)":"linear-gradient(135deg,"+C.accent+","+C.accentDark+")",transition:"all .2s",boxShadow:showAdd?"none":"0 4px 14px rgba(232,121,160,.3)"}}>
        {showAdd?"✕ إلغاء":"✦ مهمة جديدة"}</button></div>

    <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
      {[{icon:"✅",label:"الإجمالي",val:totalDone,color:C.success,bg:"rgba(110,231,183,.08)",border:"rgba(110,231,183,.18)"},
        {icon:"📅",label:"الأسبوع",val:weekDone,color:C.accent,bg:"rgba(232,121,160,.08)",border:"rgba(232,121,160,.18)"},
        {icon:"🔥",label:"اليوم",val:todayDone,color:C.warning,bg:"rgba(251,184,108,.08)",border:"rgba(251,184,108,.18)"},
        {icon:"⭐",label:"النجوم",val:totalXP,color:C.purple,bg:"rgba(180,142,245,.08)",border:"rgba(180,142,245,.18)"},
        {icon:"🔴",label:"عاجل",val:tasks.filter(t=>getStatus(t)==="todo"&&t.priority==="high").length,color:C.danger,bg:"rgba(252,129,129,.08)",border:"rgba(252,129,129,.18)"}]
        .map((s,i)=>(<div key={i} style={{flex:1,minWidth:56,background:s.bg,border:"1px solid "+s.border,borderRadius:12,padding:"10px 6px",textAlign:"center"}}>
          <div style={{fontSize:15,fontWeight:900,color:s.color,lineHeight:1,marginBottom:3,fontFamily:"'Cairo',sans-serif"}}>{s.val}</div>
          <div style={{fontSize:9,color:C.muted,lineHeight:1.3,fontFamily:"'Cairo',sans-serif"}}>{s.label}</div></div>))}</div>

    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"13px 15px",marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:10}}>
        <div style={{width:46,height:46,borderRadius:12,flexShrink:0,background:"rgba(180,142,245,.12)",border:"1.5px solid "+rank.color+"44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{rank.icon}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:5}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:14,fontWeight:800,color:rank.color,fontFamily:"'Cairo',sans-serif"}}>{rank.label}</span>
              {nextRank&&<span style={{fontSize:10,color:C.dim,fontFamily:"'Cairo',sans-serif"}}>← {nextRank.label} {nextRank.icon}</span>}</div>
            <span style={{fontSize:12,fontWeight:700,color:C.gold,fontFamily:"'Cairo',sans-serif"}}>⭐ {totalXP}</span></div>
          <div style={{height:5,borderRadius:10,background:"rgba(255,255,255,.06)",overflow:"hidden"}}>
            <div style={{height:"100%",width:rankPct+"%",borderRadius:10,background:"linear-gradient(90deg,"+rank.color+","+C.gold+")",transition:"width .8s ease"}}/></div></div></div>
      <div style={{borderTop:`1px solid ${C.border}`,paddingTop:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <span style={{fontSize:12,fontWeight:600,color:C.text,fontFamily:"'Cairo',sans-serif"}}>🔥 الهدف اليومي</span>
          <span style={{fontSize:11,color:todayDone>=5?C.success:C.muted,fontWeight:todayDone>=5?700:400,fontFamily:"'Cairo',sans-serif"}}>{todayDone} / ٥ مهام {todayDone>=5?"🎉":""}</span></div>
        <div style={{height:4,borderRadius:10,background:"rgba(255,255,255,.06)",overflow:"hidden"}}>
          <div style={{height:"100%",width:Math.min(100,todayDone/5*100)+"%",borderRadius:10,background:`linear-gradient(90deg,${C.accent},${C.purple})`,transition:"width .6s"}}/></div>
        {todayDone>=5&&<div style={{fontSize:10,color:C.success,marginTop:5,fontWeight:700,textAlign:"center",fontFamily:"'Cairo',sans-serif"}}>🏆 أتممتِ هدف اليوم!</div>}</div></div>

    {nextM&&<div style={{marginBottom:14,borderRadius:14,overflow:"hidden",cursor:"pointer",background:"linear-gradient(135deg,rgba(180,142,245,.12),rgba(244,201,122,.06))",border:"1px solid rgba(180,142,245,.25)"}} onClick={()=>setActiveTab("rewards")}>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px"}}>
        <div style={{fontSize:28,flexShrink:0}}>🎯</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:11,color:C.purple,fontWeight:700,marginBottom:2,fontFamily:"'Cairo',sans-serif"}}>المايلستون القادم</div>
          <div style={{fontSize:10,color:"rgba(245,238,248,.5)",lineHeight:1.6,fontFamily:"'Cairo',sans-serif"}}>{nextM-totalDone===1?"مهمة واحدة بس!":`${nextM-totalDone} مهام متبقية للمايلستون ${nextM}`}</div></div>
        <div style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
          <div style={{fontSize:10,color:C.purple,fontWeight:800,fontFamily:"'Cairo',sans-serif"}}>{milestonePct}%</div>
          <div style={{width:50,height:3,borderRadius:10,background:"rgba(255,255,255,.08)",overflow:"hidden"}}>
            <div style={{height:"100%",width:milestonePct+"%",borderRadius:10,background:C.purple,transition:"width .6s"}}/></div></div></div></div>}

    <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,marginBottom:14}}>
      {[{id:"board",label:"📋 المهام"},{id:"rewards",label:`⭐ النجوم (${unlockedIds.length}/${ACHIEVEMENTS.length})`},{id:"store",label:"🛍️ المتجر"}]
        .map(tab=>(<button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{flex:1,padding:"9px 0",fontSize:11,fontFamily:"'Cairo',sans-serif",fontWeight:700,cursor:"pointer",border:"none",background:"transparent",color:activeTab===tab.id?C.accent:C.muted,borderBottom:activeTab===tab.id?"2px solid "+C.accent:"2px solid transparent",transition:"all .18s",marginBottom:-1}}>{tab.label}</button>))}</div>

    {activeTab==="board"&&<div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:2}}>
      {[{v:"all",l:"الكل",c:C.accent},{v:"high",l:"🔴 عاجل",c:C.danger},{v:"medium",l:"🟡 متوسط",c:C.warning},{v:"low",l:"🟢 عادي",c:C.success}]
        .map(f=>(<button key={f.v} onClick={()=>setFilterPri(filterPri===f.v?"all":f.v)} style={{flexShrink:0,padding:"5px 14px",borderRadius:20,fontSize:11,fontFamily:"'Cairo',sans-serif",fontWeight:700,cursor:"pointer",background:filterPri===f.v?f.c+"22":C.surface,border:"1px solid "+(filterPri===f.v?f.c+"55":C.border),color:filterPri===f.v?f.c:C.muted,transition:"all .15s"}}>{f.l}</button>))}
      <select value={filterSubj} onChange={e=>setFilterSubj(e.target.value)} style={{flexShrink:0,fontSize:11,padding:"4px 10px",width:"auto",borderRadius:20,background:C.surface,border:"1px solid "+C.border,color:C.muted,fontFamily:"'Cairo',sans-serif",height:30}}>
        <option value="all">📚 كل المواد</option>{subjects.map(s=><option key={s.id} value={s.name}>{s.icon} {s.name}</option>)}</select>
      <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{flexShrink:0,fontSize:11,padding:"4px 10px",width:"auto",borderRadius:20,background:C.surface,border:"1px solid "+C.border,color:C.muted,fontFamily:"'Cairo',sans-serif",height:30}}>
        <option value="created">الأحدث</option><option value="priority">الأهم</option><option value="date">التاريخ</option></select></div>}

    {showAdd&&<div style={{marginBottom:16,padding:"16px 15px",borderRadius:18,background:C.card,border:"1.5px solid rgba(232,121,160,.35)",boxShadow:"0 8px 32px rgba(232,121,160,.08)"}}>
      <div style={{marginBottom:12}}>
        <div style={{fontSize:11,color:C.muted,marginBottom:8,fontWeight:600,fontFamily:"'Cairo',sans-serif"}}>اختاري الأولوية</div>
        <div style={{display:"flex",gap:8}}>{Object.entries(PRI).map(([k,v])=>(<button key={k} onClick={()=>setNewPri(k)} style={{flex:1,padding:"11px 6px",borderRadius:12,border:"none",cursor:"pointer",fontFamily:"'Cairo',sans-serif",transition:"all .18s",background:newPri===k?v.bg:"rgba(255,255,255,.03)",outline:"1.5px solid "+(newPri===k?v.color+"88":C.border)}}>
          <div style={{fontSize:20,marginBottom:4}}>{v.icon}</div><div style={{fontSize:12,fontWeight:700,color:newPri===k?v.color:C.muted}}>{v.label}</div><div style={{fontSize:10,color:newPri===k?C.gold:C.dim}}>+{v.pts}⭐</div></button>))}</div></div>
      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        <input value={newText} onChange={e=>setNewText(e.target.value)} placeholder="✦ اكتبي المهمة هنا..." autoFocus style={{background:C.surface,border:`1px solid ${C.border}`,color:C.text,padding:"9px 13px",borderRadius:10,fontFamily:"'Cairo',sans-serif",fontSize:14}} onKeyDown={e=>e.key==="Enter"&&e.ctrlKey&&add()}/>
        <div style={{display:"flex",gap:7}}>
          <select value={newSubj} onChange={e=>setNewSubj(e.target.value)} style={{flex:1,fontSize:12,background:C.surface,border:`1px solid ${C.border}`,color:C.text,padding:"7px 10px",borderRadius:10,fontFamily:"'Cairo',sans-serif"}}>
            <option value="">📚 بدون مادة</option>{subjects.map(s=><option key={s.id} value={s.name}>{s.icon} {s.name}</option>)}</select>
          <input type="date" value={newDate} onChange={e=>setNewDate(e.target.value)} style={{width:"auto",fontSize:12,padding:"7px 9px",background:C.surface,border:`1px solid ${C.border}`,color:C.text,borderRadius:10,fontFamily:"'Cairo',sans-serif"}}/></div>
        <textarea value={newNote} onChange={e=>setNewNote(e.target.value)} rows={2} placeholder="💬 ملاحظة اختيارية..." style={{background:C.surface,border:`1px solid ${C.border}`,color:C.text,padding:"9px 13px",borderRadius:10,fontFamily:"'Cairo',sans-serif",fontSize:12,resize:"none"}}/>
        <textarea value={newSubs} onChange={e=>setNewSubs(e.target.value)} rows={3} placeholder={"قراءة الملخص\nحل الأسئلة\nمراجعة الدرس"} style={{background:C.surface,border:`1px solid ${C.border}`,color:C.text,padding:"9px 13px",borderRadius:10,fontFamily:"'Cairo',sans-serif",fontSize:12,resize:"none",width:"100%"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 13px",borderRadius:11,background:"rgba(244,201,122,.07)",border:"1px solid rgba(244,201,122,.18)"}}>
          <span style={{fontSize:11,color:C.gold,fontWeight:700,fontFamily:"'Cairo',sans-serif"}}>⭐ ستكسبين {(PRI[newPri]?.pts||20)+(newSubs.trim()?newSubs.split("\n").filter(s=>s.trim()).length*5:0)} نجمة</span>
          <div style={{display:"flex",gap:7}}><Btn variant="secondary" onClick={()=>setShowAdd(false)}>إلغاء</Btn><Btn onClick={add} disabled={!newText.trim()}>إضافة ✦</Btn></div></div></div></div>}

    {fetching?<div style={{textAlign:"center",padding:50}}>
      <div style={{width:28,height:28,borderRadius:"50%",border:`2px solid ${C.border}`,borderTopColor:C.accent,animation:"spin .8s linear infinite",display:"inline-block"}}/>
      <div style={{fontSize:12,color:C.muted,marginTop:12,fontFamily:"'Cairo',sans-serif"}}>جاري تحميل المهام...</div></div>

    :activeTab==="store"?<AvatarStore totalXP={totalXP} onEquipChange={setOutfit}/>

    :activeTab==="board"?<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,alignItems:"start"}} className="kanban-board">
      {COLS.map(col=>{const colTasks=getColTasks(col.id);return(<div key={col.id} style={{borderRadius:16,overflow:"hidden",border:"1px solid "+C.border,background:C.bg,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"11px 14px",background:col.glow,borderBottom:"1px solid "+C.border,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:7,height:7,borderRadius:"50%",background:col.color}}/><span style={{fontSize:12,fontWeight:700,color:col.color,fontFamily:"'Cairo',sans-serif"}}>{col.label}</span></div>
          <span style={{fontSize:11,fontWeight:800,color:col.color,background:col.color+"15",padding:"2px 9px",borderRadius:20,border:"1px solid "+col.color+"25",fontFamily:"'Cairo',sans-serif"}}>{colTasks.length}</span></div>
        <div style={{padding:"10px 9px",display:"flex",flexDirection:"column",gap:8,flex:1}}>
          {colTasks.length===0&&<div style={{textAlign:"center",padding:"28px 0",color:C.dim,fontSize:12,border:"2px dashed "+C.border,borderRadius:12,margin:"4px 0",fontFamily:"'Cairo',sans-serif"}}>
            <div style={{fontSize:22,marginBottom:6,opacity:.35}}>{col.id==="todo"?"📋":col.id==="doing"?"⚡":"✅"}</div>لا توجد مهام</div>}
          {colTasks.map(t=>(<TaskCard key={t.id} t={t} col={col} PRI={PRI} expandedId={expandedId} setExpandedId={setExpandedId} toggleSub={toggleSub} moveTask={moveTask} setTimerTask={setTimerTask} setEditTask={setEditTask} del={del} today={today}/>))}
        </div>
      </div>);})}</div>

    :<div style={{paddingBottom:8}}>

      {/* ══ بطاقة المرتبة الحالية ══ */}
      <div style={{marginBottom:12,borderRadius:18,background:`linear-gradient(135deg,${rank.color}18,${rank.color}08)`,border:`1.5px solid ${rank.color}40`,padding:"16px 16px 14px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,fontSize:80,opacity:.07,pointerEvents:"none"}}>{rank.icon}</div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
          <div style={{fontSize:44,filter:`drop-shadow(0 0 12px ${rank.color}88)`}}>{rank.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:rank.color,fontWeight:700,fontFamily:"'Cairo',sans-serif",marginBottom:2}}>مرتبتك الحالية</div>
            <div style={{fontSize:22,fontWeight:900,color:C.text,fontFamily:"'Cairo',sans-serif",lineHeight:1}}>{rank.label}</div>
            <div style={{fontSize:11,color:C.muted,fontFamily:"'Cairo',sans-serif",marginTop:3}}>
              {totalXP} نجمة مجموع {nextRank?`· ${nextRank.min-totalXP} للمرتبة الجاية`:` · وصلتِ للقمة! 👑`}
            </div>
          </div>
          <div style={{textAlign:"center",background:C.card,borderRadius:12,padding:"8px 12px",border:`1px solid ${C.border}`}}>
            <div style={{fontSize:22,fontWeight:900,color:C.gold,fontFamily:"'Cairo',sans-serif"}}>{totalXP}</div>
            <div style={{fontSize:9,color:C.dim,fontFamily:"'Cairo',sans-serif"}}>نجمة</div>
          </div>
        </div>
        {nextRank&&<>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{fontSize:10,color:C.muted,fontFamily:"'Cairo',sans-serif"}}>{rank.icon} {rank.label}</span>
            <span style={{fontSize:10,color:rank.color,fontWeight:700,fontFamily:"'Cairo',sans-serif"}}>{rankPct}%</span>
            <span style={{fontSize:10,color:C.muted,fontFamily:"'Cairo',sans-serif"}}>{nextRank.icon} {nextRank.label}</span>
          </div>
          <div style={{height:8,borderRadius:10,background:C.surface,overflow:"hidden"}}>
            <div style={{height:"100%",width:rankPct+"%",borderRadius:10,background:`linear-gradient(90deg,${rank.color},${rank.color}bb)`,transition:"width 1s ease",boxShadow:`0 0 8px ${rank.color}66`}}/>
          </div>
        </>}
      </div>

      {/* ══ إحصائيات سريعة ══ */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:12}}>
        {[
          {val:totalDone,label:"مهمة منجزة",icon:"✅",color:C.success},
          {val:todayDone,label:"اليوم",icon:"☀️",color:C.gold},
          {val:weekDone,label:"الأسبوع",icon:"📅",color:C.purple},
          {val:highDone,label:"عاجلة",icon:"🔴",color:C.danger},
        ].map((s,i)=>(<div key={i} style={{textAlign:"center",padding:"10px 4px",borderRadius:14,background:C.card,border:`1px solid ${C.border}`}}>
          <div style={{fontSize:18,marginBottom:2}}>{s.icon}</div>
          <div style={{fontSize:18,fontWeight:900,color:s.color,fontFamily:"'Cairo',sans-serif",lineHeight:1}}>{s.val}</div>
          <div style={{fontSize:9,color:C.dim,fontFamily:"'Cairo',sans-serif",marginTop:2}}>{s.label}</div>
        </div>))}
      </div>

      {/* ══ تحدي اليوم ══ */}
      <div style={{marginBottom:12,borderRadius:16,background:"linear-gradient(135deg,rgba(249,192,106,.1),rgba(249,192,106,.04))",border:"1.5px solid rgba(249,192,106,.3)",padding:"14px 15px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div style={{fontSize:13,fontWeight:800,color:C.gold,fontFamily:"'Cairo',sans-serif"}}>🔥 تحديات اليوم</div>
          <div style={{fontSize:11,color:C.muted,fontFamily:"'Cairo',sans-serif",background:C.surface,padding:"2px 10px",borderRadius:20,border:`1px solid ${C.border}`}}>
            {todayDone >= 7 ? "✅ أنجزتِ الكل!" : todayDone >= 5 ? "🌟 كمان تحدي!" : "💪 يلا بيكِ!"}
          </div>
        </div>
        {[
          {target:1,label:"أنجزي مهمة واحدة",reward:"+10⭐",icon:"🌱"},
          {target:3,label:"أنجزي ٣ مهام",reward:"+25⭐ بونص",icon:"⚡"},
          {target:5,label:"يوم مذاكرة رهيب (٥ مهام)",reward:"+50⭐ بونص",icon:"🔥"},
          {target:7,label:"يوم أسطوري (٧ مهام)",reward:"+100⭐ بونص",icon:"👑"},
        ].map(ch=>{const done=todayDone>=ch.target;const pct=Math.min(100,Math.round(todayDone/ch.target*100));
        return(<div key={ch.target} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:20,flexShrink:0,opacity:done?1:.45}}>{done?"✅":ch.icon}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:11,color:done?C.success:C.text,fontWeight:done?700:500,fontFamily:"'Cairo',sans-serif",textDecoration:done?"line-through":"none"}}>{ch.label}</span>
              <span style={{fontSize:10,color:C.gold,fontWeight:700,flexShrink:0,fontFamily:"'Cairo',sans-serif"}}>{ch.reward}</span>
            </div>
            <div style={{height:4,borderRadius:10,background:C.surface,overflow:"hidden"}}>
              <div style={{height:"100%",width:pct+"%",borderRadius:10,background:done?"#7DD3B0":"linear-gradient(90deg,#F9C06A,#FFD700)",transition:"width .6s ease"}}/>
            </div>
          </div>
          <div style={{fontSize:10,color:done?C.success:C.muted,flexShrink:0,fontFamily:"'Cairo',sans-serif"}}>{todayDone}/{ch.target}</div>
        </div>);})}
      </div>

      {/* ══ مسار المراتب ══ */}
      <div style={{marginBottom:12,borderRadius:16,background:"linear-gradient(135deg,rgba(180,142,245,.09),rgba(244,201,122,.04))",border:"1px solid rgba(180,142,245,.2)",overflow:"hidden"}}>
        <div style={{padding:"11px 15px 10px",borderBottom:"1px solid rgba(180,142,245,.12)"}}><div style={{fontSize:12,fontWeight:800,color:C.text,fontFamily:"'Cairo',sans-serif"}}>🗺 مسار المراتب</div></div>
        <div style={{padding:"12px 12px"}}>
          <div style={{display:"flex",gap:4,marginBottom:10}}>
            {RANKS.map((r,i)=>{const unlocked=totalXP>=r.min;const isCurrent=rank.min===r.min;return(<div key={i} style={{flex:1,textAlign:"center",padding:"9px 3px",borderRadius:12,background:isCurrent?r.color+"18":unlocked?"rgba(110,231,183,.05)":C.card,border:`1.5px solid ${isCurrent?r.color:unlocked?"rgba(110,231,183,.2)":C.border}`,opacity:unlocked?1:.35,transition:"all .3s",boxShadow:isCurrent?`0 0 14px ${r.color}33`:"none"}}>
              <div style={{fontSize:18,marginBottom:2}}>{r.icon}</div>
              <div style={{fontSize:9,fontWeight:700,color:isCurrent?r.color:unlocked?C.success:C.dim,fontFamily:"'Cairo',sans-serif"}}>{r.label}</div>
              {isCurrent&&<div style={{fontSize:7,color:r.color,fontWeight:700,marginTop:1,fontFamily:"'Cairo',sans-serif"}}>◀ أنتِ</div>}
            </div>);})}
          </div>
          <div style={{height:5,borderRadius:10,background:C.surface,overflow:"hidden"}}>
            <div style={{height:"100%",width:Math.min(100,Math.round(totalXP/RANKS[RANKS.length-1].min*100))+"%",background:`linear-gradient(90deg,${C.accent},${C.purple},${C.gold})`,transition:"width .8s ease",borderRadius:10}}/>
          </div>
        </div>
      </div>

      {/* ══ الإنجازات ══ */}
      <div style={{marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontSize:13,fontWeight:800,color:C.text,fontFamily:"'Cairo',sans-serif"}}>🏅 الإنجازات</div>
          <div style={{fontSize:11,color:C.gold,fontWeight:700,fontFamily:"'Cairo',sans-serif",background:"rgba(249,192,106,.1)",padding:"3px 12px",borderRadius:20,border:"1px solid rgba(249,192,106,.25)"}}>
            {unlockedIds.length}/{ACHIEVEMENTS.length} مفتوح
          </div>
        </div>

        {/* إنجازات مفتوحة أولاً */}
        {unlockedIds.length > 0 && <div style={{marginBottom:8}}>
          <div style={{fontSize:10,color:C.success,fontWeight:700,fontFamily:"'Cairo',sans-serif",marginBottom:6,padding:"3px 10px",background:"rgba(125,211,176,.08)",borderRadius:20,display:"inline-block",border:"1px solid rgba(125,211,176,.2)"}}>✅ مفتوحة ({unlockedIds.length})</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))",gap:7}}>
            {ACHIEVEMENTS.filter(a=>unlockedIds.includes(a.id)).map(a=>(<div key={a.id} style={{padding:"12px 7px",borderRadius:14,textAlign:"center",border:"1px solid rgba(110,231,183,.4)",background:"rgba(110,231,183,.08)",boxShadow:"0 0 14px rgba(110,231,183,.1)",animation:"fadeUp .3s ease"}}>
              <div style={{fontSize:26,marginBottom:4,filter:"drop-shadow(0 0 6px currentColor)"}}>{a.icon}</div>
              <div style={{fontSize:10,fontWeight:800,color:C.text,marginBottom:2,fontFamily:"'Cairo',sans-serif"}}>{a.title}</div>
              <div style={{fontSize:8,color:C.muted,lineHeight:1.4,fontFamily:"'Cairo',sans-serif"}}>{a.desc}</div>
            </div>))}
          </div>
        </div>}

        {/* إنجازات مقفلة */}
        {ACHIEVEMENTS.filter(a=>!unlockedIds.includes(a.id)).length > 0 && <div>
          <div style={{fontSize:10,color:C.dim,fontWeight:700,fontFamily:"'Cairo',sans-serif",marginBottom:6,padding:"3px 10px",background:C.surface,borderRadius:20,display:"inline-block",border:`1px solid ${C.border}`}}>
            🔒 لسه ({ACHIEVEMENTS.filter(a=>!unlockedIds.includes(a.id)).length})
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))",gap:7}}>
            {ACHIEVEMENTS.filter(a=>!unlockedIds.includes(a.id)).map(a=>(<div key={a.id} style={{padding:"12px 7px",borderRadius:14,textAlign:"center",border:`1px solid ${C.border}`,background:C.card,opacity:.55}}>
              <div style={{fontSize:26,marginBottom:4,filter:"grayscale(1) opacity(.3)"}}>{a.icon}</div>
              <div style={{fontSize:10,fontWeight:700,color:C.muted,marginBottom:2,fontFamily:"'Cairo',sans-serif"}}>{a.title}</div>
              <div style={{fontSize:8,color:C.dim,lineHeight:1.4,fontFamily:"'Cairo',sans-serif"}}>{a.desc}</div>
            </div>))}
          </div>
        </div>}
      </div>
    </div>}
  </div>);
}