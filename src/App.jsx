import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════
   CONFIG
═══════════════════════════════════════════ */
const PROJECT_NAME = "LOKI WORKOUT";
const START_DATE = "2025-03-09";
const GOAL_WEIGHT = 70;
const START_WEIGHT = 60;

/* ═══════════════════════════════════════════
   DIET DATA — WITH FREE RICE
═══════════════════════════════════════════ */
const MEALS_DATA = [
  { id: "breakfast", time: "7:00 AM", name: "Breakfast", icon: "🌅",
    note: "Start strong — protein + slow carbs to fuel the whole morning",
    items: [
      { id: "b1", food: "Boiled / Omelette Eggs", qty: "3 eggs", protein: 18, cal: 210, tag: "nv" },
      { id: "b2", food: "Wheat Chapati", qty: "3 rotis", protein: 9, cal: 225, tag: "v" },
      { id: "b3", food: "Full Cream Milk", qty: "300ml", protein: 10, cal: 180, tag: "v" },
      { id: "b4", food: "Banana", qty: "1 medium", protein: 1, cal: 90, tag: "v" },
    ]
  },
  { id: "midmorn", time: "10:30 AM", name: "Mid Morning", icon: "⚡",
    note: "Slow digesting — keeps you full + fuelled for gym",
    items: [
      { id: "m1", food: "Oats (cooked in water)", qty: "65g dry", protein: 8, cal: 244, tag: "v" },
      { id: "m2", food: "Roasted Peanuts", qty: "70g", protein: 16, cal: 399, tag: "v" },
    ]
  },
  { id: "lunch", time: "1:30 PM", name: "Lunch", icon: "🍽️",
    note: "Biggest meal — max protein + rice as main carb source",
    items: [
      { id: "l1", food: "Grilled / Boiled Chicken Breast", qty: "150g", protein: 47, cal: 248, tag: "nv" },
      { id: "l2", food: "Soya Chunks (stir fried)", qty: "40g dry", protein: 21, cal: 138, tag: "v" },
      { id: "l3", food: "Cooked White Rice", qty: "150g cooked", protein: 3, cal: 195, tag: "v", free: true },
      { id: "l4", food: "Wheat Chapati", qty: "2 rotis", protein: 6, cal: 150, tag: "v" },
    ]
  },
  { id: "evening", time: "5:00 PM", name: "Evening Snack", icon: "🥤",
    note: "Light protein hit — keep muscle synthesis going",
    items: [
      { id: "e1", food: "Boiled Eggs", qty: "2 eggs", protein: 12, cal: 140, tag: "nv" },
      { id: "e2", food: "Curd (Dahi)", qty: "65g", protein: 2, cal: 39, tag: "v" },
    ]
  },
  { id: "dinner", time: "8:30 PM", name: "Dinner", icon: "🌙",
    note: "Slow protein + rice carbs for overnight muscle recovery",
    items: [
      { id: "d1", food: "Chana / Moong Dal (cooked)", qty: "80g dry", protein: 7, cal: 272, tag: "v" },
      { id: "d2", food: "Cooked White Rice", qty: "100g cooked", protein: 2, cal: 130, tag: "v", free: true },
      { id: "d3", food: "Wheat Chapati", qty: "1 roti", protein: 3, cal: 75, tag: "v" },
      { id: "d4", food: "Stir-Fried Veggies (spinach/cabbage)", qty: "1 cup", protein: 3, cal: 60, tag: "v" },
      { id: "d5", food: "Cooking Oil", qty: "1.5 tbsp", protein: 0, cal: 180, tag: "v" },
    ]
  },
];

const TOTAL_PROTEIN = MEALS_DATA.reduce((s,m)=>s+m.items.reduce((ss,i)=>ss+i.protein,0),0);
const TOTAL_CAL = MEALS_DATA.reduce((s,m)=>s+m.items.reduce((ss,i)=>ss+i.cal,0),0);

/* ═══════════════════════════════════════════
   GROCERY — RICE FREE
═══════════════════════════════════════════ */
const GROCERY = [
  { item: "Eggs", qty: "150 eggs (5/day × 30)", cost: 1050, tag: "nv", note: "₹7/egg — egg stall" },
  { item: "Chicken Breast", qty: "4.5 kg (150g/day)", cost: 810, tag: "nv", note: "₹180/kg — butcher" },
  { item: "Soya Chunks", qty: "1.2 kg (40g/day)", cost: 96, tag: "v", note: "₹80/kg — cheapest protein" },
  { item: "Full Cream Milk", qty: "9 L (300ml/day)", cost: 270, tag: "v", note: "₹30/L Amul/local dairy" },
  { item: "Curd (Dahi)", qty: "2 kg (65g/day)", cost: 120, tag: "v", note: "₹60/kg — local dairy" },
  { item: "Oats", qty: "2 kg (65g/day)", cost: 160, tag: "v", note: "Local brand, not Quaker" },
  { item: "Roasted Peanuts", qty: "2.1 kg (70g/day)", cost: 252, tag: "v", note: "₹120/kg — kirana store" },
  { item: "Wheat Atta", qty: "7 kg (6 rotis/day)", cost: 210, tag: "v", note: "₹30/kg bulk" },
  { item: "Bananas", qty: "30 pieces (1/day)", cost: 150, tag: "v", note: "₹5/piece from mandi" },
  { item: "White Rice", qty: "FREE ✅ — use at lunch + dinner", cost: 0, tag: "v", note: "You already have it!", free: true },
  { item: "Chana / Moong Dal", qty: "2.4 kg (80g/day)", cost: 192, tag: "v", note: "₹80/kg — kirana" },
  { item: "Mixed Vegetables", qty: "Monthly supply", cost: 200, tag: "v", note: "Spinach, cabbage — sabzi mandi" },
  { item: "Cooking Oil", qty: "1 litre", cost: 120, tag: "v", note: "Sunflower oil — 1.5 tbsp/day only" },
  { item: "Salt, Spices, Garlic", qty: "Monthly supply", cost: 80, tag: "v", note: "Low salt — key for jawline!" },
];

const WATER_SCHEDULE = [
  { time: "Wake Up", amount: "500ml", icon: "🌅", tip: "Before anything. Flushes toxins, kickstarts metabolism.", color: "#38bdf8" },
  { time: "Before Breakfast", amount: "250ml", icon: "🥛", tip: "30 min before eating. Aids digestion.", color: "#38bdf8" },
  { time: "Mid Morning", amount: "500ml", icon: "⚡", tip: "Sip with oats. Keeps energy steady.", color: "#38bdf8" },
  { time: "Before Workout", amount: "500ml", icon: "💪", tip: "45 min before gym. Prevents cramps, keeps strength up.", color: "#a78bfa" },
  { time: "During Workout", amount: "500ml", icon: "🏋️", tip: "Sip between every set. Never let yourself feel thirsty.", color: "#f97316" },
  { time: "Post Workout", amount: "500ml", icon: "🔥", tip: "Immediately after. Starts muscle recovery.", color: "#4ade80" },
  { time: "With Lunch", amount: "250ml", icon: "🍽️", tip: "Sip during meal. Aids nutrient absorption.", color: "#38bdf8" },
  { time: "Afternoon", amount: "250ml", icon: "🕑", tip: "Prevents afternoon crash.", color: "#38bdf8" },
  { time: "Evening", amount: "250ml", icon: "🌇", tip: "With evening snack. Keeps protein synthesis active.", color: "#38bdf8" },
  { time: "With Dinner", amount: "250ml", icon: "🌙", tip: "During dinner. Aids overnight digestion.", color: "#38bdf8" },
];

const PRE_WORKOUT = {
  eat: [
    { food: "2 Wheat Chapatis", reason: "Slow carbs = sustained energy throughout workout", icon: "🫓" },
    { food: "2 Boiled Eggs", reason: "Fast protein to protect muscle during training", icon: "🥚" },
    { food: "1 Banana", reason: "Quick glucose = instant energy boost, no stomach discomfort", icon: "🍌" },
  ],
  avoid: [
    { food: "Heavy rice + dal combo", reason: "Makes you heavy and sleepy — save rice for post-workout" },
    { food: "Full milk (300ml)", reason: "Hard to digest, can cause nausea mid-lifts" },
    { food: "Oily food", reason: "Makes you sluggish mid-session" },
    { food: "Empty stomach", reason: "Zero fuel = weak lifts + muscle breakdown + dizziness" },
  ],
  postEat: [
    { food: "3 Boiled Eggs", reason: "Fast protein for immediate muscle repair", icon: "🥚" },
    { food: "Rice + Dal (small bowl)", reason: "Rice is the PERFECT post-workout carb — replenishes glycogen fast", icon: "🍚" },
    { food: "500ml Water", reason: "Replace sweat loss, restart recovery", icon: "💧" },
  ],
};

const WORKOUT_DAYS = [
  { id:"d1", label:"Chest + Triceps", icon:"💪", color:"#f97316", short:"CHEST",
    exercises:[{id:"c1",name:"Push Ups (warm up)",sets:"3",reps:"15–20"},{id:"c2",name:"Barbell Bench Press",sets:"4",reps:"8–10",star:true},{id:"c3",name:"Incline Dumbbell Press",sets:"3",reps:"10–12"},{id:"c4",name:"Cable Fly / Pec Deck",sets:"3",reps:"12–15"},{id:"c5",name:"Tricep Pushdown (rope)",sets:"3",reps:"12–15"},{id:"c6",name:"Skull Crushers",sets:"3",reps:"10–12"}]},
  { id:"d2", label:"Back + Biceps", icon:"🏋️", color:"#38bdf8", short:"BACK",
    exercises:[{id:"bk1",name:"Pull Ups / Lat Pulldown",sets:"4",reps:"8–10",star:true},{id:"bk2",name:"Barbell Bent-Over Row",sets:"4",reps:"8–10",star:true},{id:"bk3",name:"Seated Cable Row",sets:"3",reps:"10–12"},{id:"bk4",name:"Single Arm DB Row",sets:"3",reps:"10 each"},{id:"bk5",name:"Barbell Bicep Curl",sets:"3",reps:"10–12"},{id:"bk6",name:"Hammer Curl",sets:"3",reps:"12–15"}]},
  { id:"d3", label:"REST / Walk", icon:"😴", color:"#22c55e", short:"REST", rest:true },
  { id:"d4", label:"Shoulders + Abs", icon:"🔥", color:"#a78bfa", short:"SHOULDER",
    exercises:[{id:"s1",name:"Overhead Press (BB/DB)",sets:"4",reps:"8–10",star:true},{id:"s2",name:"Lateral Raises",sets:"4",reps:"15–20"},{id:"s3",name:"Front Raises",sets:"3",reps:"12–15"},{id:"s4",name:"Rear Delt Fly",sets:"3",reps:"12–15"},{id:"s5",name:"Plank",sets:"3",reps:"45–60 sec"},{id:"s6",name:"Hanging Leg Raise",sets:"3",reps:"15–20"}]},
  { id:"d5", label:"Legs", icon:"🦵", color:"#facc15", short:"LEGS",
    exercises:[{id:"lg1",name:"Barbell Squat",sets:"4",reps:"8–10",star:true},{id:"lg2",name:"Leg Press",sets:"4",reps:"10–12"},{id:"lg3",name:"Romanian Deadlift",sets:"3",reps:"10–12"},{id:"lg4",name:"Leg Curl",sets:"3",reps:"12–15"},{id:"lg5",name:"Leg Extension",sets:"3",reps:"12–15"},{id:"lg6",name:"Calf Raises",sets:"4",reps:"15–20"}]},
  { id:"d6", label:"Full Body", icon:"⚡", color:"#fb7185", short:"FULL",
    exercises:[{id:"f1",name:"Deadlift",sets:"4",reps:"5–6",star:true},{id:"f2",name:"Weighted Dips",sets:"3",reps:"10–12"},{id:"f3",name:"Chin Ups",sets:"3",reps:"8–10"},{id:"f4",name:"Dumbbell Shrugs",sets:"3",reps:"15–20"},{id:"f5",name:"Face Pulls",sets:"3",reps:"15–20"},{id:"f6",name:"V-ups / Crunches",sets:"3",reps:"20"}]},
  { id:"d7", label:"FULL REST", icon:"🛌", color:"#555", short:"REST", rest:true },
];

const TAG={nv:{bg:"#f9731618",text:"#fb923c",border:"#f9731640",label:"🍗"},v:{bg:"#22c55e18",text:"#4ade80",border:"#22c55e40",label:"🌿"}};
const today=()=>new Date().toISOString().slice(0,10);
const fmtDate=(d)=>{const dt=new Date(d+"T00:00:00");return dt.toLocaleDateString("en-IN",{day:"numeric",month:"short"});};
function daysSinceStart(){return Math.max(0,Math.floor((new Date()-new Date(START_DATE))/(1000*60*60*24)));}
function weekNumber(){return Math.floor(daysSinceStart()/7)+1;}
async function load(key){try{const v=localStorage.getItem(key);return v?JSON.parse(v):null;}catch{return null;}}
async function save(key,val){try{localStorage.setItem(key,JSON.stringify(val));}catch{}}

function Ring({pct,color,size=56,stroke=5,children}){
  const r=(size-stroke*2)/2,circ=2*Math.PI*r,offset=circ-Math.min(pct/100,1)*circ;
  return(<div style={{position:"relative",width:size,height:size,flexShrink:0}}><svg width={size} height={size} style={{transform:"rotate(-90deg)"}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e1e1e" strokeWidth={stroke}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{transition:"stroke-dashoffset .5s"}}/></svg><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>{children}</div></div>);
}
function CB({checked,onToggle,color="#4ade80"}){
  return(<div onClick={onToggle} style={{width:22,height:22,borderRadius:6,border:`2px solid ${checked?color:"#2a2a2a"}`,background:checked?color+"22":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all .15s",flexShrink:0}}>{checked&&<span style={{color,fontSize:13,fontWeight:900}}>✓</span>}</div>);
}

/* ───── DASHBOARD ───── */
function Dashboard({mealChecked,workoutChecked,weights,workoutDay,waterChecked,setTab}){
  const t=today(),ci=mealChecked[t]||{},allItems=MEALS_DATA.flatMap(m=>m.items);
  const eatenP=allItems.filter(i=>ci[i.id]).reduce((s,i)=>s+i.protein,0);
  const eatenCal=allItems.filter(i=>ci[i.id]).reduce((s,i)=>s+i.cal,0);
  const mealsCompleted=MEALS_DATA.filter(m=>m.items.every(i=>ci[i.id])).length;
  const todayWO=workoutChecked[t]||{},wDay=WORKOUT_DAYS[workoutDay%7],exList=wDay.rest?[]:(wDay.exercises||[]);
  const woDone=exList.filter(e=>todayWO[e.id]).length,woPct=exList.length?(woDone/exList.length)*100:0;
  const wCh=waterChecked[t]||{},totalWater=WATER_SCHEDULE.filter((_,i)=>wCh[i]).reduce((s,w)=>s+parseInt(w.amount),0);
  const latest=weights.length?weights[weights.length-1].w:START_WEIGHT;
  const wPct=Math.min(((latest-START_WEIGHT)/(GOAL_WEIGHT-START_WEIGHT))*100,100);
  const streak=(()=>{let s=0,d=new Date();for(let i=0;i<60;i++){const dk=d.toISOString().slice(0,10);if(MEALS_DATA.filter(m=>m.items.every(x=>(mealChecked[dk]||{})[x.id])).length>=3)s++;else if(i>0)break;d.setDate(d.getDate()-1);}return s;})();
  return(
    <div>
      <div style={{background:"linear-gradient(135deg,#facc1520,#f9731614,transparent)",border:"1px solid #facc1530",borderRadius:20,padding:"16px 20px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,color:"#facc15",letterSpacing:3,lineHeight:1}}>⚡ {PROJECT_NAME}</div>
          <div style={{color:"#444",fontSize:10,marginTop:3}}>Started 9 Mar 2025 · Week {weekNumber()} · Day {daysSinceStart()}</div>
          <div style={{color:"#333",fontSize:9,marginTop:1}}>LEAN MUSCLE · PURE GAINS · ZERO EXCESS FAT</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,color:"#fff",letterSpacing:2,lineHeight:1}}>{latest}<span style={{fontSize:15,color:"#4ade80"}}> kg</span></div>
          <div style={{color:"#4ade80",fontSize:11,fontWeight:700}}>{wPct.toFixed(0)}% to 70kg</div>
        </div>
      </div>
      <div style={{background:"#111",borderRadius:14,padding:"12px 16px",marginBottom:14,border:"1px solid #1e1e1e"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{color:"#333",fontSize:10}}>60 kg</span><span style={{color:"#facc15",fontSize:11,fontWeight:700}}>{(GOAL_WEIGHT-latest).toFixed(1)} kg to go</span><span style={{color:"#4ade80",fontSize:10}}>70 kg 🎯</span></div>
        <div style={{background:"#1a1a1a",borderRadius:6,height:8,overflow:"hidden"}}><div style={{background:"linear-gradient(90deg,#4ade80,#facc15)",width:`${Math.max(wPct,2)}%`,height:"100%",borderRadius:6,transition:"width .6s"}}/></div>
        <div onClick={()=>setTab("weight")} style={{textAlign:"center",color:"#4ade80",fontSize:11,fontWeight:700,marginTop:7,cursor:"pointer"}}>+ Log today's weight →</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:14}}>
        {[{label:"Protein",val:`${eatenP}g`,pct:(eatenP/TOTAL_PROTEIN)*100,color:"#a78bfa",sub:`/${TOTAL_PROTEIN}g`,t:"meals"},{label:"Calories",val:eatenCal,pct:(eatenCal/TOTAL_CAL)*100,color:"#facc15",sub:`/${TOTAL_CAL}`,t:"meals"},{label:"Water",val:`${(totalWater/1000).toFixed(1)}L`,pct:(totalWater/3750)*100,color:"#38bdf8",sub:"/3.75L",t:"water"},{label:"Streak",val:`${streak}d`,pct:Math.min(streak*10,100),color:"#f97316",sub:"days",t:null}].map(({label,val,pct,color,sub,t:tb})=>(
          <div key={label} onClick={()=>tb&&setTab(tb)} style={{background:"#111",borderRadius:14,padding:"12px 6px",border:"1px solid #1e1e1e",textAlign:"center",cursor:tb?"pointer":"default"}}>
            <div style={{color:"#222",fontSize:8,textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>{label}</div>
            <Ring pct={pct} color={color} size={44} stroke={4}><span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:10,color}}>{typeof val==="number"?val.toLocaleString():val}</span></Ring>
            <div style={{color:"#222",fontSize:9,marginTop:4}}>{sub}</div>
          </div>
        ))}
      </div>
      <div onClick={()=>setTab("workout")} style={{background:"#111",borderRadius:16,padding:"13px 16px",marginBottom:14,border:`1px solid ${wDay.color}33`,cursor:"pointer"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <span style={{fontSize:24}}>{wDay.icon}</span>
            <div><div style={{fontFamily:"'Bebas Neue',sans-serif",color:wDay.color,fontSize:16,letterSpacing:1}}>TODAY: {wDay.label.toUpperCase()}</div><div style={{color:"#333",fontSize:10}}>{wDay.rest?"Recovery — walk only":`${woDone}/${exList.length} done`}</div></div>
          </div>
          {!wDay.rest&&<Ring pct={woPct} color={wDay.color} size={44} stroke={4}><span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:10,color:wDay.color}}>{Math.round(woPct)}%</span></Ring>}
        </div>
        {!wDay.rest&&<div style={{marginTop:8,background:"#1a1a1a",borderRadius:4,height:5}}><div style={{background:wDay.color,width:`${woPct}%`,height:"100%",borderRadius:4,transition:"width .4s"}}/></div>}
      </div>
      <div style={{background:"#111",borderRadius:14,padding:"12px 16px",marginBottom:14,border:"1px solid #1e1e1e"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{fontFamily:"'Bebas Neue',sans-serif",color:"#fff",fontSize:14,letterSpacing:1}}>TODAY'S MEALS</div><div style={{color:"#a78bfa",fontSize:11,fontWeight:700,cursor:"pointer"}} onClick={()=>setTab("meals")}>{mealsCompleted}/5 done →</div></div>
        <div style={{display:"flex",gap:8}}>{MEALS_DATA.map(m=>{const done=m.items.every(i=>ci[i.id]),partial=!done&&m.items.some(i=>ci[i.id]);return(<div key={m.id} onClick={()=>setTab("meals")} style={{flex:1,textAlign:"center",cursor:"pointer"}}><div style={{fontSize:20,marginBottom:5,filter:done?"none":partial?"none":"grayscale(1) opacity(0.25)"}}>{m.icon}</div><div style={{width:"100%",height:4,borderRadius:2,background:done?"#a78bfa":partial?"#a78bfa55":"#1e1e1e"}}/></div>);})}</div>
      </div>
      <div onClick={()=>setTab("water")} style={{background:"#111",borderRadius:14,padding:"12px 16px",border:"1px solid #38bdf822",cursor:"pointer"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontFamily:"'Bebas Neue',sans-serif",color:"#38bdf8",fontSize:14,letterSpacing:1}}>💧 WATER TODAY</div><div style={{color:"#222",fontSize:10,marginTop:1}}>{totalWater}ml / 3750ml</div></div><Ring pct={(totalWater/3750)*100} color="#38bdf8" size={44} stroke={4}><span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:10,color:"#38bdf8"}}>{Math.round((totalWater/3750)*100)}%</span></Ring></div>
        <div style={{marginTop:8,background:"#1a1a1a",borderRadius:4,height:4}}><div style={{background:"#38bdf8",width:`${Math.min((totalWater/3750)*100,100)}%`,height:"100%",borderRadius:4}}/></div>
      </div>
    </div>
  );
}

/* ───── MEAL TRACKER ───── */
function MealTracker({mealChecked,setMealChecked}){
  const t=today(),checked=mealChecked[t]||{},[openMeal,setOpenMeal]=useState("breakfast");
  const toggle=async(id)=>{const u={...checked,[id]:!checked[id]};setMealChecked({...mealChecked,[t]:u});await save(`meals:${t}`,u);};
  const allItems=MEALS_DATA.flatMap(m=>m.items);
  const eatenP=allItems.filter(i=>checked[i.id]).reduce((s,i)=>s+i.protein,0);
  const eatenCal=allItems.filter(i=>checked[i.id]).reduce((s,i)=>s+i.cal,0);
  return(
    <div>
      <div style={{background:"#111",borderRadius:16,padding:"14px 18px",marginBottom:14,border:"1px solid #1e1e1e"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{color:"#444",fontSize:11}}>{fmtDate(t)}</span><span style={{color:"#333",fontSize:11}}>{MEALS_DATA.filter(m=>m.items.every(i=>checked[i.id])).length}/5 meals</span></div>
        {[{l:"Protein",c:eatenP,tot:TOTAL_PROTEIN,col:"#a78bfa",u:"g"},{l:"Calories",c:eatenCal,tot:TOTAL_CAL,col:"#facc15",u:""}].map(({l,c,tot,col,u})=>(
          <div key={l} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{color:"#444",fontSize:11}}>{l}</span><span style={{color:col,fontSize:11,fontWeight:700}}>{c}{u} / {tot}{u}</span></div><div style={{background:"#1e1e1e",borderRadius:4,height:6}}><div style={{background:col,width:`${Math.min((c/tot)*100,100)}%`,height:"100%",borderRadius:4,transition:"width .3s"}}/></div></div>
        ))}
        <div style={{marginTop:8,background:"#22c55e10",border:"1px solid #22c55e30",borderRadius:8,padding:"6px 10px",display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:16}}>🍚</span><span style={{color:"#4ade80",fontSize:11,fontWeight:700}}>Rice is FREE ✅ — eat freely at lunch + dinner!</span></div>
      </div>
      {MEALS_DATA.map(meal=>{
        const p=meal.items.reduce((s,i)=>s+i.protein,0),c=meal.items.reduce((s,i)=>s+i.cal,0);
        const done=meal.items.every(i=>checked[i.id]),open=openMeal===meal.id,cc=meal.items.filter(i=>checked[i.id]).length;
        return(
          <div key={meal.id} style={{background:"#111",border:`1px solid ${done?"#a78bfa44":open?"#252525":"#1a1a1a"}`,borderRadius:16,marginBottom:10,overflow:"hidden"}}>
            <div onClick={()=>setOpenMeal(open?null:meal.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",cursor:"pointer",background:done?"#a78bfa08":open?"#161616":"transparent"}}>
              <div style={{position:"relative"}}><span style={{fontSize:22}}>{meal.icon}</span>{done&&<span style={{position:"absolute",top:-4,right:-4,fontSize:10}}>✅</span>}</div>
              <div style={{flex:1}}><div style={{fontFamily:"'Bebas Neue',sans-serif",color:done?"#a78bfa":"#fff",fontSize:15,letterSpacing:1}}>{meal.name}</div><div style={{color:"#3a3a3a",fontSize:10}}>{meal.time} · {cc}/{meal.items.length}</div></div>
              <span style={{background:"#a78bfa22",color:"#a78bfa",borderRadius:8,padding:"2px 7px",fontSize:10,fontWeight:700}}>{p}g P</span>
              <span style={{background:"#facc1522",color:"#facc15",borderRadius:8,padding:"2px 7px",fontSize:10,fontWeight:700}}>{c}cal</span>
              <span style={{color:"#333",fontSize:16,transform:open?"rotate(90deg)":"rotate(0)",display:"inline-block",transition:"transform .2s"}}>›</span>
            </div>
            {open&&(
              <div style={{padding:"0 16px 14px"}}>
                <div style={{color:"#2a2a2a",fontSize:11,margin:"0 0 10px",padding:"5px 10px",background:"#0d0d0d",borderRadius:8}}>{meal.note}</div>
                {meal.items.map(item=>(
                  <div key={item.id} onClick={()=>toggle(item.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:"1px solid #1a1a1a",cursor:"pointer"}}>
                    <CB checked={!!checked[item.id]} onToggle={()=>toggle(item.id)}/>
                    <div style={{flex:1,opacity:checked[item.id]?0.4:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                        <span style={{color:"#ddd",fontSize:13,fontWeight:600,textDecoration:checked[item.id]?"line-through":"none"}}>{item.food}</span>
                        <span style={{background:TAG[item.tag].bg,color:TAG[item.tag].text,border:`1px solid ${TAG[item.tag].border}`,borderRadius:20,padding:"1px 5px",fontSize:9,fontWeight:700}}>{TAG[item.tag].label}</span>
                        {item.free&&<span style={{background:"#22c55e15",color:"#4ade80",border:"1px solid #22c55e30",borderRadius:20,padding:"1px 5px",fontSize:9,fontWeight:700}}>FREE ✅</span>}
                      </div>
                      <div style={{color:"#333",fontSize:11,marginTop:1}}>{item.qty}</div>
                    </div>
                    <div style={{textAlign:"right",opacity:checked[item.id]?0.4:1}}><div style={{color:"#a78bfa",fontSize:12,fontWeight:700}}>{item.protein}g</div><div style={{color:"#facc15",fontSize:10}}>{item.cal}cal</div></div>
                  </div>
                ))}
                <div onClick={async()=>{const all=meal.items.every(i=>checked[i.id]);const u={...checked};meal.items.forEach(i=>{u[i.id]=!all;});setMealChecked({...mealChecked,[t]:u});await save(`meals:${t}`,u);}} style={{marginTop:10,textAlign:"center",color:"#a78bfa",fontSize:12,fontWeight:700,padding:"8px",background:"#a78bfa11",borderRadius:8,cursor:"pointer"}}>{meal.items.every(i=>checked[i.id])?"↩ Unmark all":"✓ Mark whole meal done"}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ───── GROCERY ───── */
function GroceryTab(){
  const total=GROCERY.reduce((s,g)=>s+g.cost,0);
  const nvT=GROCERY.filter(g=>g.tag==="nv").reduce((s,g)=>s+g.cost,0);
  const vT=GROCERY.filter(g=>g.tag==="v"&&!g.free).reduce((s,g)=>s+g.cost,0);
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
        {[{l:"🍗 Non-Veg",v:`₹${nvT}`,c:"#f97316"},{l:"🌿 Veg Items",v:`₹${vT}`,c:"#22c55e"},{l:"🍚 Rice",v:"FREE ✅",c:"#4ade80"}].map(({l,v,c})=>(
          <div key={l} style={{background:"#111",borderRadius:12,padding:"12px 8px",border:`1px solid ${c}33`,textAlign:"center"}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:c,letterSpacing:1}}>{v}</div><div style={{color:"#333",fontSize:10,marginTop:2}}>{l}</div></div>
        ))}
      </div>
      <div style={{background:"linear-gradient(135deg,#22c55e18,transparent)",border:"2px solid #22c55e44",borderRadius:14,padding:"14px 16px",marginBottom:14,display:"flex",gap:12,alignItems:"center"}}>
        <span style={{fontSize:30}}>🍚</span>
        <div><div style={{fontFamily:"'Bebas Neue',sans-serif",color:"#4ade80",fontSize:16,letterSpacing:1}}>RICE IS FREE — USE IT FULLY!</div><div style={{color:"#555",fontSize:12,marginTop:3,lineHeight:1.6}}>150g cooked at lunch + 100g cooked at dinner. Replaces sweet potato — saves ₹90/month extra.</div></div>
      </div>
      {GROCERY.map((g,i)=>(
        <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:g.free?"#22c55e08":i%2===0?"#111":"#0d0d0d",borderRadius:10,marginBottom:6,border:g.free?"1px solid #22c55e33":"1px solid #1a1a1a"}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
              <span style={{color:g.free?"#4ade80":"#ddd",fontWeight:700,fontSize:13}}>{g.item}</span>
              <span style={{background:TAG[g.tag].bg,color:TAG[g.tag].text,border:`1px solid ${TAG[g.tag].border}`,borderRadius:20,padding:"1px 5px",fontSize:9,fontWeight:700}}>{TAG[g.tag].label}</span>
              {g.free&&<span style={{background:"#22c55e15",color:"#4ade80",border:"1px solid #22c55e30",borderRadius:20,padding:"1px 5px",fontSize:9,fontWeight:700}}>FREE ✅</span>}
            </div>
            <div style={{color:"#222",fontSize:10}}>{g.qty} · {g.note}</div>
          </div>
          <div style={{color:g.free?"#4ade80":"#facc15",fontWeight:800,fontSize:15,flexShrink:0}}>{g.free?"₹0":g.cost>0?`₹${g.cost}`:""}</div>
        </div>
      ))}
      <div style={{background:"linear-gradient(135deg,#4ade8022,#facc1512)",border:"2px solid #4ade8055",borderRadius:14,padding:"15px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
        <div><div style={{fontFamily:"'Bebas Neue',sans-serif",color:"#fff",fontSize:18,letterSpacing:1}}>TOTAL / MONTH</div><div style={{color:"#4ade80",fontSize:11,marginTop:2}}>✅ ₹{4000-total} under budget</div></div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,color:"#4ade80",letterSpacing:1}}>₹{total}</div>
      </div>
      <div style={{background:"#111",borderRadius:12,padding:14,marginTop:10,border:"1px solid #1e1e1e"}}>
        <div style={{color:"#facc15",fontWeight:700,fontSize:12,marginBottom:8}}>💡 Shopping Tips</div>
        {["Eggs: local egg stall ₹7/egg — not supermarket ₹9","Chicken: butcher in 500g+ — cheaper per kg","Sabzi mandi Saturday/Sunday — 30% cheaper veggies","Cook rice once a day in bulk — use at both meals","Extra budget saved = buy more eggs or dal"].map((tip,i)=><div key={i} style={{color:"#444",fontSize:12,padding:"5px 0",borderBottom:"1px solid #1a1a1a"}}>• {tip}</div>)}
      </div>
    </div>
  );
}

/* ───── WORKOUT ───── */
function WorkoutTracker({workoutChecked,setWorkoutChecked,workoutDay,setWorkoutDay}){
  const t=today(),checked=workoutChecked[t]||{},wDay=WORKOUT_DAYS[workoutDay%7];
  const exList=wDay.rest?[]:(wDay.exercises||[]),doneCnt=exList.filter(e=>checked[e.id]).length,pct=exList.length?(doneCnt/exList.length)*100:100;
  const toggle=async(id)=>{const u={...checked,[id]:!checked[id]};setWorkoutChecked({...workoutChecked,[t]:u});await save(`workout:${t}`,u);};
  const changeDay=async(dir)=>{const nd=((workoutDay+dir)%7+7)%7;setWorkoutDay(nd);await save("workoutDay",nd);};
  return(
    <div>
      <div style={{background:"#111",borderRadius:16,padding:"14px",marginBottom:14,border:`1px solid ${wDay.color}33`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <button onClick={()=>changeDay(-1)} style={{background:"#1a1a1a",border:"1px solid #2a2a2a",color:"#888",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:18}}>‹</button>
          <div style={{textAlign:"center"}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:wDay.color,letterSpacing:2}}>{wDay.label.toUpperCase()}</div><div style={{color:"#444",fontSize:11}}>Day {workoutDay+1} · Week {weekNumber()}</div></div>
          <button onClick={()=>changeDay(1)} style={{background:"#1a1a1a",border:"1px solid #2a2a2a",color:"#888",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:18}}>›</button>
        </div>
        <div style={{display:"flex",gap:5,justifyContent:"center"}}>{WORKOUT_DAYS.map((d,i)=>(<div key={i} onClick={async()=>{setWorkoutDay(i);await save("workoutDay",i);}} style={{width:32,height:32,borderRadius:8,border:`1px solid ${i===workoutDay?d.color:"#1e1e1e"}`,background:i===workoutDay?d.color+"22":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:14}}>{d.icon}</div>))}</div>
        <div style={{textAlign:"center",color:"#1e1e1e",fontSize:9,letterSpacing:1,marginTop:8}}>6-DAY PPL SPLIT · 1 FULL REST</div>
      </div>
      {wDay.rest?(
        <div>
          <div style={{background:"#111",borderRadius:16,padding:"20px",border:"1px solid #22c55e33",textAlign:"center",marginBottom:12}}>
            <div style={{fontSize:44,marginBottom:10}}>😴</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:"#22c55e",letterSpacing:2,marginBottom:6}}>REST DAY</div>
            <div style={{color:"#22c55e",fontSize:13,fontWeight:700,marginBottom:4}}>Muscles grow on rest days — NOT in the gym.</div>
            <div style={{color:"#444",fontSize:12,lineHeight:1.7}}>You broke muscle fibres in training. Today your body repairs and grows them bigger. It needs the same food to do that job.</div>
          </div>

          {/* DIET ON REST DAY — SAME */}
          <div style={{background:"linear-gradient(135deg,#22c55e15,transparent)",border:"2px solid #22c55e44",borderRadius:14,padding:"14px 16px",marginBottom:10}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",color:"#22c55e",fontSize:17,letterSpacing:1,marginBottom:12}}>✅ DIET — SAME AS GYM DAYS</div>
            {[
              {icon:"🌅",meal:"Breakfast",t:"7:00 AM",note:"3 eggs + 3 chapati + 300ml milk + banana"},
              {icon:"⚡",meal:"Mid Morning",t:"10:30 AM",note:"Oats + peanuts — keep eating, don't skip"},
              {icon:"🍽️",meal:"Lunch",t:"1:30 PM",note:"Chicken + soya + rice + 2 chapati — full meal"},
              {icon:"🥤",meal:"Evening",t:"5:00 PM",note:"2 eggs + curd — muscle is still repairing now"},
              {icon:"🌙",meal:"Dinner",t:"8:30 PM",note:"Dal + rice + chapati + veggies — overnight growth fuel"},
            ].map(({icon,meal,t,note})=>(
              <div key={meal} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid #1a1a1a",alignItems:"center"}}>
                <span style={{fontSize:18,flexShrink:0}}>{icon}</span>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#ddd",fontWeight:700,fontSize:13}}>{meal}</span><span style={{color:"#444",fontSize:11}}>{t}</span></div>
                  <div style={{color:"#444",fontSize:11,marginTop:1}}>{note}</div>
                </div>
              </div>
            ))}
            <div style={{marginTop:10,background:"#22c55e11",borderRadius:8,padding:"8px 10px",color:"#4ade80",fontSize:12,fontWeight:700,textAlign:"center"}}>Same protein (160g) · Same calories · Same 5 meals</div>
          </div>

          {/* OPTIONAL CUT */}
          <div style={{background:"#111",borderRadius:14,padding:"13px 15px",marginBottom:10,border:"1px solid #facc1522"}}>
            <div style={{color:"#facc15",fontWeight:700,fontSize:13,marginBottom:8}}>⚡ OPTIONAL: Cut ~200 Cal on Rest Day</div>
            <div style={{color:"#555",fontSize:12,lineHeight:1.7,marginBottom:8}}>You're not burning gym calories today, so you can drop <span style={{color:"#facc15",fontWeight:700}}>200 cal max</span>. Skip one of these:</div>
            {[["Skip 30g peanuts","-170 cal","Still keep oats"],["Skip 1 egg","-70 cal","Still eat 4 eggs total"],["Skip 0.5 tbsp oil","-60 cal","Use slightly less oil in cooking"]].map(([a,c,n])=>(
              <div key={a} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #1a1a1a"}}>
                <span style={{color:"#aaa",fontSize:12}}>{a} <span style={{color:"#2a2a2a",fontSize:11}}>· {n}</span></span>
                <span style={{color:"#facc15",fontSize:12,fontWeight:700}}>{c}</span>
              </div>
            ))}
            <div style={{marginTop:8,color:"#333",fontSize:11}}>⚠️ Never cut more than 200 cal. Bigger cut = muscle loss.</div>
          </div>

          {/* Rest day rules */}
          <div style={{background:"#111",borderRadius:14,padding:"13px 15px",border:"1px solid #1e1e1e"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",color:"#fff",fontSize:15,letterSpacing:1,marginBottom:10}}>REST DAY CHECKLIST</div>
            {[{icon:"🥗",text:"All 5 meals — no skipping",c:"#22c55e"},{icon:"💧",text:"3.75L water — same as gym days",c:"#38bdf8"},{icon:"🚶",text:"20–30 min light walk only",c:"#a78bfa"},{icon:"😴",text:"8 hrs sleep minimum",c:"#facc15"},{icon:"🚫",text:"No running, no HIIT — ruins recovery",c:"#f87171"}].map(({icon,text,c})=>(
              <div key={text} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid #1a1a1a",alignItems:"center"}}>
                <span style={{fontSize:18}}>{icon}</span>
                <span style={{color:c==="#f87171"?"#f87171":"#aaa",fontSize:13,fontWeight:c==="#22c55e"||c==="#38bdf8"?700:400}}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      ):(
        <div>
          <div style={{background:"#111",borderRadius:14,padding:"12px 16px",marginBottom:12,border:"1px solid #1e1e1e"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{color:"#888",fontSize:12}}>Session Progress</span><span style={{fontFamily:"'Bebas Neue',sans-serif",color:wDay.color,fontSize:22,letterSpacing:1}}>{doneCnt}/{exList.length}</span></div>
            <div style={{background:"#1a1a1a",borderRadius:6,height:8}}><div style={{background:`linear-gradient(90deg,${wDay.color},${wDay.color}77)`,width:`${pct}%`,height:"100%",borderRadius:6,transition:"width .4s"}}/></div>
            {pct===100&&<div style={{marginTop:10,textAlign:"center",color:wDay.color,fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:1}}>🎉 DONE! LOKI IS BUILT DIFFERENT!</div>}
          </div>
          {exList.map(ex=>(<div key={ex.id} onClick={()=>toggle(ex.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",background:"#111",borderRadius:14,marginBottom:8,border:`1px solid ${checked[ex.id]?wDay.color+"44":"#1a1a1a"}`,cursor:"pointer",transition:"border-color .2s"}}><CB checked={!!checked[ex.id]} onToggle={()=>toggle(ex.id)} color={wDay.color}/><div style={{flex:1,opacity:checked[ex.id]?0.35:1}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:"#ddd",fontSize:14,fontWeight:600,textDecoration:checked[ex.id]?"line-through":"none"}}>{ex.name}</span>{ex.star&&<span style={{fontSize:11}}>⭐</span>}</div></div><div style={{background:wDay.color+"22",color:wDay.color,borderRadius:8,padding:"4px 10px",fontSize:12,fontWeight:700,flexShrink:0}}>{ex.sets}×{ex.reps}</div></div>))}
          <div onClick={async()=>{const all=exList.every(e=>checked[e.id]);const u={...checked};exList.forEach(e=>{u[e.id]=!all;});setWorkoutChecked({...workoutChecked,[t]:u});await save(`workout:${t}`,u);}} style={{marginTop:4,textAlign:"center",color:wDay.color,fontSize:13,fontWeight:700,padding:"12px",background:wDay.color+"11",borderRadius:12,cursor:"pointer",border:`1px solid ${wDay.color}33`}}>{exList.every(e=>checked[e.id])?"↩ Reset":"✓ Mark All Done"}</div>
        </div>
      )}
    </div>
  );
}

/* ───── WATER TAB ───── */
function WaterTab({waterChecked,setWaterChecked}){
  const t=today(),checked=waterChecked[t]||{},[showPre,setShowPre]=useState(false);
  const toggle=async(i)=>{const u={...checked,[i]:!checked[i]};setWaterChecked({...waterChecked,[t]:u});await save(`water:${t}`,u);};
  const totalMl=WATER_SCHEDULE.filter((_,i)=>checked[i]).reduce((s,w)=>s+parseInt(w.amount),0);
  return(
    <div>
      <div style={{background:"linear-gradient(135deg,#38bdf820,transparent)",border:"1px solid #38bdf833",borderRadius:18,padding:"18px",marginBottom:14,textAlign:"center"}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:50,color:"#38bdf8",letterSpacing:2,lineHeight:1}}>{(totalMl/1000).toFixed(2)}<span style={{fontSize:22}}> L</span></div>
        <div style={{color:"#333",fontSize:11,marginBottom:12}}>Target: <span style={{color:"#38bdf8",fontWeight:700}}>3.75 L / day</span></div>
        <div style={{background:"#1a1a1a",borderRadius:6,height:10,overflow:"hidden"}}><div style={{background:"linear-gradient(90deg,#38bdf8,#7dd3fc)",width:`${Math.min((totalMl/3750)*100,100)}%`,height:"100%",borderRadius:6,transition:"width .5s"}}/></div>
        <div style={{color:"#38bdf8",fontSize:12,fontWeight:700,marginTop:8}}>{totalMl>=3750?"💧 FULLY HYDRATED!":` ${3750-totalMl}ml remaining`}</div>
      </div>
      <div style={{background:"#111",borderRadius:16,border:`1px solid ${showPre?"#a78bfa44":"#1e1e1e"}`,marginBottom:14,overflow:"hidden"}}>
        <div onClick={()=>setShowPre(!showPre)} style={{padding:"13px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",color:"#a78bfa",fontSize:15,letterSpacing:1}}>🍽️ PRE & POST WORKOUT MEAL</div>
          <span style={{color:"#444",fontSize:18,transform:showPre?"rotate(90deg)":"rotate(0)",display:"inline-block",transition:"transform .2s"}}>›</span>
        </div>
        {showPre&&(
          <div style={{padding:"0 16px 16px"}}>
            <div style={{background:"#0d0d0d",borderRadius:12,padding:"12px",marginBottom:10,border:"1px solid #a78bfa22"}}>
              <div style={{color:"#a78bfa",fontWeight:700,fontSize:12,marginBottom:6}}>⏰ EAT 60–90 MIN BEFORE GYM</div>
              {PRE_WORKOUT.eat.map((e,i)=>(<div key={i} style={{display:"flex",gap:10,marginBottom:8,paddingBottom:8,borderBottom:"1px solid #1a1a1a"}}><span style={{fontSize:18}}>{e.icon}</span><div><div style={{color:"#ddd",fontWeight:700,fontSize:13}}>{e.food}</div><div style={{color:"#333",fontSize:11,marginTop:2}}>{e.reason}</div></div></div>))}
            </div>
            <div style={{background:"#0d0d0d",borderRadius:12,padding:"12px",marginBottom:10,border:"1px solid #f8717122"}}>
              <div style={{color:"#f87171",fontWeight:700,fontSize:12,marginBottom:6}}>❌ AVOID BEFORE GYM</div>
              {PRE_WORKOUT.avoid.map((e,i)=>(<div key={i} style={{marginBottom:6,paddingBottom:6,borderBottom:"1px solid #1a1a1a"}}><span style={{color:"#f87171",fontWeight:700,fontSize:12}}>✗ {e.food}: </span><span style={{color:"#333",fontSize:11}}>{e.reason}</span></div>))}
            </div>
            <div style={{background:"#0d0d0d",borderRadius:12,padding:"12px",border:"1px solid #4ade8022"}}>
              <div style={{color:"#4ade80",fontWeight:700,fontSize:12,marginBottom:6}}>🔥 POST WORKOUT — WITHIN 45 MIN</div>
              {PRE_WORKOUT.postEat.map((e,i)=>(<div key={i} style={{display:"flex",gap:10,marginBottom:8,paddingBottom:8,borderBottom:"1px solid #1a1a1a"}}><span style={{fontSize:18}}>{e.icon}</span><div><div style={{color:"#ddd",fontWeight:700,fontSize:13}}>{e.food}</div><div style={{color:"#333",fontSize:11,marginTop:2}}>{e.reason}</div></div></div>))}
            </div>
          </div>
        )}
      </div>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",color:"#fff",fontSize:16,letterSpacing:2,marginBottom:10}}>💧 CHECKPOINTS</div>
      {WATER_SCHEDULE.map((w,i)=>(<div key={i} onClick={()=>toggle(i)} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",background:"#111",borderRadius:14,marginBottom:8,border:`1px solid ${checked[i]?w.color+"44":"#1a1a1a"}`,cursor:"pointer"}}><CB checked={!!checked[i]} onToggle={()=>toggle(i)} color={w.color}/><span style={{fontSize:18,opacity:checked[i]?0.3:1}}>{w.icon}</span><div style={{flex:1,opacity:checked[i]?0.35:1}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#ddd",fontSize:13,fontWeight:600,textDecoration:checked[i]?"line-through":"none"}}>{w.time}</span><span style={{fontFamily:"'Bebas Neue',sans-serif",color:w.color,fontSize:15,letterSpacing:1}}>{w.amount}</span></div><div style={{color:"#222",fontSize:11,marginTop:2}}>{w.tip}</div></div></div>))}
    </div>
  );
}

/* ───── WEIGHT TRACKER ───── */
function WeightTracker({weights,setWeights}){
  const [input,setInput]=useState(""),[err,setErr]=useState("");
  const logWeight=async()=>{const w=parseFloat(input);if(isNaN(w)||w<40||w>120){setErr("Enter 40–120 kg");return;}setErr("");const t=today();const u=[...weights.filter(x=>x.date!==t),{date:t,w}].sort((a,b)=>a.date.localeCompare(b.date));setWeights(u);await save("weights",u);setInput("");};
  const latest=weights.length?weights[weights.length-1].w:START_WEIGHT;
  const pct=Math.min(Math.max(((latest-START_WEIGHT)/(GOAL_WEIGHT-START_WEIGHT))*100,0),100);
  return(
    <div>
      <div style={{background:"#111",borderRadius:18,padding:"18px",marginBottom:14,border:"1px solid #4ade8033"}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",color:"#4ade80",fontSize:18,letterSpacing:2,marginBottom:12}}>LOG TODAY'S WEIGHT</div>
        <div style={{display:"flex",gap:10}}><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&logWeight()} placeholder="e.g. 61.5" type="number" step="0.1" style={{flex:1,background:"#0d0d0d",border:"1px solid #2a2a2a",borderRadius:10,padding:"12px 14px",color:"#fff",fontSize:22,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:1,outline:"none"}}/><button onClick={logWeight} style={{background:"#4ade80",color:"#000",border:"none",borderRadius:10,padding:"12px 20px",fontWeight:900,fontSize:15,cursor:"pointer"}}>LOG</button></div>
        {err&&<div style={{color:"#f87171",fontSize:12,marginTop:8}}>{err}</div>}
      </div>
      <div style={{background:"linear-gradient(135deg,#4ade8018,#facc1510)",border:"1px solid #4ade8030",borderRadius:16,padding:"18px",marginBottom:14,textAlign:"center"}}>
        <div style={{display:"flex",justifyContent:"space-around",marginBottom:14}}>{[{l:"Start",v:"60 kg",c:"#555"},{l:"Current",v:`${latest} kg`,c:"#4ade80"},{l:"Goal",v:"70 kg",c:"#facc15"}].map(({l,v,c})=>(<div key={l}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,color:c,letterSpacing:1}}>{v}</div><div style={{color:"#333",fontSize:10,textTransform:"uppercase"}}>{l}</div></div>))}</div>
        <div style={{background:"#1a1a1a",borderRadius:8,height:10,overflow:"hidden"}}><div style={{background:"linear-gradient(90deg,#4ade80,#facc15)",width:`${Math.max(pct,2)}%`,height:"100%",borderRadius:8,transition:"width .5s"}}/></div>
        <div style={{color:"#4ade80",fontSize:13,fontWeight:700,marginTop:8}}>{pct>=100?"🎯 70KG! LOKI COMPLETE!":`${pct.toFixed(1)}% · ${(GOAL_WEIGHT-latest).toFixed(1)} kg to go`}</div>
        <div style={{color:"#222",fontSize:10,marginTop:3}}>Day {daysSinceStart()} · Week {weekNumber()}</div>
      </div>
      {weights.length>=2&&(<div style={{background:"#111",borderRadius:14,padding:"14px 16px",marginBottom:14,border:"1px solid #1e1e1e"}}><div style={{fontFamily:"'Bebas Neue',sans-serif",color:"#fff",fontSize:15,letterSpacing:1,marginBottom:10}}>CHART</div><FullChart weights={weights}/></div>)}
      <div style={{background:"#111",borderRadius:14,padding:"14px 16px",border:"1px solid #1e1e1e"}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",color:"#fff",fontSize:15,letterSpacing:1,marginBottom:10}}>HISTORY</div>
        {weights.length===0&&<div style={{color:"#333",fontSize:13,textAlign:"center",padding:"16px 0"}}>No entries yet!</div>}
        {[...weights].reverse().map(w=>{const prev=weights[weights.findIndex(x=>x.date===w.date)-1],diff=prev?+(w.w-prev.w).toFixed(1):null;return(<div key={w.date} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #1a1a1a"}}><div><div style={{color:"#ddd",fontWeight:700,fontSize:14}}>{w.w} kg</div><div style={{color:"#333",fontSize:11}}>{fmtDate(w.date)}</div></div><div style={{display:"flex",alignItems:"center",gap:10}}>{diff!==null&&<span style={{color:diff>0?"#4ade80":diff<0?"#f87171":"#555",fontSize:13,fontWeight:700}}>{diff>0?"+":""}{diff} kg</span>}<button onClick={async()=>{const u=weights.filter(x=>x.date!==w.date);setWeights(u);await save("weights",u);}} style={{background:"#1a1a1a",border:"1px solid #2a2a2a",color:"#555",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:11}}>×</button></div></div>);})}
      </div>
    </div>
  );
}
function FullChart({weights}){
  const data=weights.slice(-30);if(data.length<2)return null;
  const vals=data.map(w=>w.w),minV=Math.min(...vals)-0.5,maxV=Math.max(Math.max(...vals)+0.5,70.5),H=90,W=310,goalY=H-((70-minV)/(maxV-minV))*H;
  const pts=data.map((w,i)=>`${(i/(data.length-1))*W},${H-((w.w-minV)/(maxV-minV))*H}`).join(" ");
  const area=`M0,${H} `+data.map((w,i)=>`L${(i/(data.length-1))*W},${H-((w.w-minV)/(maxV-minV))*H}`).join(" ")+` L${W},${H} Z`;
  return(<svg viewBox={`-20 0 ${W+30} ${H+22}`} style={{width:"100%"}}><defs><linearGradient id="wg" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#4ade80" stopOpacity="0.3"/><stop offset="100%" stopColor="#4ade80" stopOpacity="0"/></linearGradient></defs><line x1={0} y1={goalY} x2={W} y2={goalY} stroke="#facc15" strokeWidth="1" strokeDasharray="4,4" opacity="0.5"/><text x={W+2} y={goalY+4} fontSize="9" fill="#facc15">70kg</text><path d={area} fill="url(#wg)"/><polyline points={pts} fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinejoin="round"/>{data.map((w,i)=>{const x=(i/(data.length-1))*W,y=H-((w.w-minV)/(maxV-minV))*H;return<circle key={i} cx={x} cy={y} r={i===data.length-1?4:2.5} fill="#4ade80"/>;})}{data.map((w,i)=>{if(i===0||i===data.length-1||i===Math.floor(data.length/2))return<text key={i} x={(i/(data.length-1))*W} y={H+16} textAnchor="middle" fontSize="8" fill="#555">{fmtDate(w.date)}</text>;return null;})}</svg>);
}

/* ───── TIPS: LEAN MUSCLE + JAWLINE + PROGRESS ───── */
function TipsTab({mealChecked,workoutChecked,weights}){
  const [sec,setSec]=useState("lean");
  const days=Array.from({length:14},(_,i)=>{const d=new Date();d.setDate(d.getDate()-13+i);return d.toISOString().slice(0,10);});
  const stats=days.map(date=>{const mc=mealChecked[date]||{},wc=workoutChecked[date]||{};const mc5=MEALS_DATA.filter(m=>m.items.every(i=>mc[i.id])).length;const ex=WORKOUT_DAYS.flatMap(d=>d.exercises||[]).filter(e=>wc[e.id]).length;return{date,mc5,ex,score:Math.round((mc5/5)*50+(Math.min(ex,6)/6)*50)};});
  const avgScore=Math.round(stats.reduce((s,x)=>s+x.score,0)/stats.length);
  const latest=weights.length?weights[weights.length-1].w:START_WEIGHT;

  const SECTIONS=[{id:"lean",icon:"💎",title:"PURE MUSCLE",color:"#4ade80"},{id:"jaw",icon:"🗿",title:"JAWLINE",color:"#facc15"},{id:"prog",icon:"📈",title:"PROGRESS",color:"#a78bfa"},{id:"road",icon:"🗺️",title:"ROADMAP",color:"#f97316"}];

  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        {SECTIONS.map(s=>(<div key={s.id} onClick={()=>setSec(s.id)} style={{background:"#111",borderRadius:14,padding:"12px 14px",border:`1px solid ${sec===s.id?s.color+"55":"#1e1e1e"}`,cursor:"pointer",display:"flex",alignItems:"center",gap:8,transition:"border-color .2s"}}><span style={{fontSize:20}}>{s.icon}</span><span style={{fontFamily:"'Bebas Neue',sans-serif",color:sec===s.id?s.color:"#444",fontSize:13,letterSpacing:1}}>{s.title}</span></div>))}
      </div>

      {sec==="lean"&&(
        <div>
          <div style={{background:"linear-gradient(135deg,#4ade8018,transparent)",border:"1px solid #4ade8033",borderRadius:16,padding:"16px",marginBottom:12}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",color:"#4ade80",fontSize:20,letterSpacing:2,marginBottom:6}}>LEAN BULK — PURE MUSCLE</div>
            <div style={{color:"#555",fontSize:12,lineHeight:1.7}}>At 60kg / 5'7" your body fat is naturally low. Calorie surplus is <span style={{color:"#4ade80",fontWeight:700}}>only +500 cal</span> — builds muscle WITHOUT visible fat. Dirty bulk = fat face + belly. This plan keeps you shredded while growing.</div>
          </div>
          <div style={{background:"#111",borderRadius:14,padding:"14px 16px",marginBottom:10,border:"1px solid #1e1e1e"}}>
            <div style={{color:"#4ade80",fontWeight:700,fontSize:13,marginBottom:10}}>✅ Rules for Pure Muscle Gains</div>
            {[["Small surplus (+500 cal only)","~0.5–0.8 kg/month. Almost 100% muscle. Not dirty bulk 1kg/month which is 50% fat."],["160g protein daily","More protein = more muscle synthesised per calorie. Less fat stored."],["Only 1.5 tbsp oil/day","Minimum dietary fat. Oil only for cooking — never extra."],["Low sodium (less salt)","High salt = water retention = puffy face + bloated body. Less salt = leaner look."],["No junk, no sugar","1 samosa = 300 empty calories, zero protein. Ruins the lean bulk."],["20 min walk on rest days","Burns 150 cal, keeps you from getting too soft. No running — that burns too much."],["Don't eat less on rest days","Drop only 200 cal max. Bigger cut = muscle loss overnight."]].map(([t,d])=>(<div key={t} style={{marginBottom:10,paddingBottom:10,borderBottom:"1px solid #1a1a1a"}}><div style={{color:"#4ade80",fontWeight:700,fontSize:12,marginBottom:3}}>▸ {t}</div><div style={{color:"#444",fontSize:12,lineHeight:1.6}}>{d}</div></div>))}
          </div>
          <div style={{background:"#111",borderRadius:14,padding:"14px 16px",border:"1px solid #f8717122"}}>
            <div style={{color:"#f87171",fontWeight:700,fontSize:13,marginBottom:8}}>❌ What Causes Fat Gain</div>
            {["Eating way over TDEE — even clean food","Too much oil or fried food","Milk tea with sugar 3–4 times/day","Late night eating after 10 PM","Skipping gym while eating full bulk calories"].map((t,i)=><div key={i} style={{color:"#555",fontSize:12,padding:"5px 0",borderBottom:"1px solid #1a1a1a"}}>• {t}</div>)}
          </div>
        </div>
      )}

      {sec==="jaw"&&(
        <div>
          <div style={{background:"linear-gradient(135deg,#facc1518,transparent)",border:"1px solid #facc1533",borderRadius:16,padding:"16px",marginBottom:12}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",color:"#facc15",fontSize:20,letterSpacing:2,marginBottom:4}}>🗿 JAWLINE GUIDE</div>
            <div style={{color:"#555",fontSize:12,lineHeight:1.7}}>Face fat = body fat %. Lean bulk keeps body fat low = face naturally sharpens. These habits speed it up massively.</div>
          </div>
          {[
            {title:"🧂 Low Salt",color:"#38bdf8",tips:[["Cut salt by 50%","High sodium = water retention = puffy cheeks. Minimum salt in all cooking."],["No pickles, papad, packets","Hidden sodium. Even 1 packet namkeen = face puff for 24 hrs."],["Lemon juice instead","Adds flavour zero sodium. Perfect on dal + veggies."]]},
            {title:"💧 Hydration",color:"#38bdf8",tips:[["3.75L water daily","More water = LESS retention = thinner face. Counter-intuitive but proven."],["No sugary drinks, soda","Causes facial bloating within hours."],["Green tea (no sugar)","Reduces water retention and morning puffiness."]]},
            {title:"🏋️ Jaw Exercises",color:"#facc15",tips:[["Mewing (tongue posture)","Tongue flat on roof of mouth at ALL times. Reshapes jawline over months. Google it — it works."],["Chew hard food daily","Raw carrots, cucumber, apples every day. Works masseter muscles = sharper jaw definition."],["Jaw clench (3×20 reps)","Gently clench jaw 1 sec, release. 3 sets of 20 daily. Builds jaw muscle."],["Chin tucks (3×15 reps)","Pull chin straight back (hold 5 sec). Fixes forward head posture AND sharpens jawline."]]},
            {title:"😴 Sleep & Lifestyle",color:"#a78bfa",tips:[["Sleep on your back","Side sleeping = facial asymmetry + puffiness long term."],["8 hrs sleep","Cortisol from bad sleep = face water retention = puffy look."],["Zero alcohol","Single biggest jawline killer. Puffs face massively."],["Reduce sugar","Sugar = glycation = face looks soft and undefined."]]},
            {title:"📅 Timeline",color:"#4ade80",tips:[["Month 1–2","Less puffiness from low salt + hydration. Bloating gone."],["Month 3–4","Jaw muscles from mewing + chewing become visible."],["Month 5–6","With lean bulk keeping fat low — face fat visibly reduced."],["12 months","Significant definition. Strong jawline + leaner face."]]},
          ].map(s=>(<div key={s.title} style={{background:"#111",borderRadius:14,padding:"13px 15px",marginBottom:10,border:`1px solid ${s.color}22`}}><div style={{color:s.color,fontWeight:700,fontSize:14,marginBottom:10}}>{s.title}</div>{s.tips.map(([t,d])=>(<div key={t} style={{marginBottom:8,paddingBottom:8,borderBottom:"1px solid #1a1a1a"}}><div style={{color:"#ccc",fontWeight:600,fontSize:12,marginBottom:2}}>{t}</div><div style={{color:"#444",fontSize:12,lineHeight:1.6}}>{d}</div></div>))}</div>))}
        </div>
      )}

      {sec==="prog"&&(
        <div>
          <div style={{background:"linear-gradient(135deg,#a78bfa18,transparent)",border:"1px solid #a78bfa33",borderRadius:18,padding:"18px",marginBottom:14,textAlign:"center"}}>
            <div style={{color:"#333",fontSize:10,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>14-Day Consistency Score</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:64,color:avgScore>=70?"#4ade80":avgScore>=40?"#facc15":"#f87171",letterSpacing:2,lineHeight:1}}>{avgScore}<span style={{fontSize:24}}>/100</span></div>
            <div style={{color:"#555",fontSize:12,marginTop:5}}>{avgScore>=80?"🔥 Elite! Loki unstoppable!":avgScore>=60?"💪 Good — stay consistent":avgScore>=40?"⚠️ Inconsistent — fix meals + gym":"❌ Needs serious work"}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
            {[{l:"Meal Days",v:`${stats.filter(s=>s.mc5>=3).length}/14`,c:"#a78bfa"},{l:"Gym Days",v:`${stats.filter(s=>s.ex>0).length}/14`,c:"#f97316"},{l:"Gained",v:`+${(latest-START_WEIGHT).toFixed(1)}kg`,c:"#4ade80"}].map(({l,v,c})=>(<div key={l} style={{background:"#111",borderRadius:12,padding:"12px 8px",border:"1px solid #1e1e1e",textAlign:"center"}}><div style={{color:"#222",fontSize:9,textTransform:"uppercase",marginBottom:4}}>{l}</div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:c}}>{v}</div></div>))}
          </div>
          <div style={{background:"#111",borderRadius:14,padding:"13px 15px",border:"1px solid #1e1e1e"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",color:"#fff",fontSize:15,letterSpacing:1,marginBottom:12}}>14-DAY HEATMAP</div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {stats.map(s=>{const col=s.score>=80?"#4ade80":s.score>=50?"#facc15":s.score>=20?"#f97316":"#1e1e1e";return(<div key={s.date} style={{flex:"1 1 calc(14% - 5px)",minWidth:32}}><div style={{height:32,borderRadius:8,background:col+"33",border:`1px solid ${col}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:col,fontFamily:"'Bebas Neue',sans-serif"}}>{s.score||""}</div><div style={{color:"#1e1e1e",fontSize:8,textAlign:"center",marginTop:3}}>{fmtDate(s.date).split(" ")[0]}</div></div>);})}
            </div>
          </div>
        </div>
      )}

      {sec==="road"&&(
        <div>
          <div style={{background:"#111",borderRadius:16,padding:"14px 16px",border:"1px solid #1e1e1e"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",color:"#fff",fontSize:16,letterSpacing:1,marginBottom:12}}>5-MONTH ROADMAP · 60→70 KG</div>
            {[{m:"Month 1",g:"+1.5–2 kg",to:"~62 kg",c:"#38bdf8",n:"Muscle memory fires 🔥"},{m:"Month 2",g:"+1.5–2 kg",to:"~64 kg",c:"#a78bfa",n:"Rapid rebuild phase"},{m:"Month 3",g:"+1.5–2 kg",to:"~66 kg",c:"#facc15",n:"Real hypertrophy"},{m:"Month 4",g:"+1–1.5 kg",to:"~67.5 kg",c:"#f97316",n:"Grind phase"},{m:"Month 5",g:"+1–1.5 kg",to:"~69 kg",c:"#4ade80",n:"Final push 💪"}].map((r,i)=>{const reached=latest>=(60+i*2);return(<div key={r.m} style={{display:"flex",gap:10,alignItems:"center",marginBottom:10,padding:"10px 12px",background:reached?"#0d0d0d":"transparent",borderRadius:10,border:reached?`1px solid ${r.c}33`:"1px solid transparent"}}><div style={{width:8,height:8,borderRadius:"50%",background:reached?r.c:"#1e1e1e",flexShrink:0}}/><div style={{flex:1}}><span style={{color:reached?r.c:"#2a2a2a",fontWeight:700,fontSize:13}}>{r.m}</span><span style={{color:"#1e1e1e",fontSize:11,marginLeft:8}}>{r.n}</span></div><div style={{textAlign:"right"}}><div style={{color:reached?r.c:"#1e1e1e",fontWeight:700,fontSize:13}}>{r.g}</div><div style={{color:"#1e1e1e",fontSize:10}}>{r.to}</div></div></div>);})}
          </div>
          <div style={{background:"#111",borderRadius:14,padding:"14px 16px",marginTop:10,border:"1px solid #f8717122"}}>
            <div style={{color:"#f87171",fontWeight:700,fontSize:12,marginBottom:10}}>⚠️ What Kills The Goal</div>
            {[["Skipping 3 meals/week","= 1800 cal lost = near zero gains that week"],["Less than 7 hrs sleep","GH drops. Muscle recovery stops."],["Training less than 5 days","Won't gain 10kg. 6 days needed."],["High stress","Cortisol breaks down muscle actively."]].map(([t,d])=>(<div key={t} style={{marginBottom:8,paddingBottom:8,borderBottom:"1px solid #1a1a1a"}}><span style={{color:"#f87171",fontWeight:700,fontSize:12}}>✗ {t}: </span><span style={{color:"#333",fontSize:11}}>{d}</span></div>))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ───── APP ───── */
export default function App(){
  const [tab,setTab]=useState("home");
  const [mealChecked,setMealChecked]=useState({});
  const [workoutChecked,setWorkoutChecked]=useState({});
  const [waterChecked,setWaterChecked]=useState({});
  const [weights,setWeights]=useState([]);
  const [workoutDay,setWorkoutDay]=useState(0);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{(async()=>{
    const t=today();
    const mc={};const md=await load(`meals:${t}`);if(md)mc[t]=md;
    for(let i=1;i<=30;i++){const d=new Date();d.setDate(d.getDate()-i);const dk=d.toISOString().slice(0,10);const v=await load(`meals:${dk}`);if(v)mc[dk]=v;}
    setMealChecked(mc);
    const wc={};const wd=await load(`workout:${t}`);if(wd)wc[t]=wd;setWorkoutChecked(wc);
    const wday=await load("workoutDay");if(wday!==null)setWorkoutDay(wday);
    const wts=await load("weights");if(wts)setWeights(wts);
    const watr={};const watd=await load(`water:${t}`);if(watd)watr[t]=watd;setWaterChecked(watr);
    setLoading(false);
  })();},[]);

  const TABS=[{id:"home",icon:"⚡",label:"Home"},{id:"meals",icon:"🍽️",label:"Meals"},{id:"grocery",icon:"🛒",label:"Grocery"},{id:"workout",icon:"🏋️",label:"Gym"},{id:"water",icon:"💧",label:"Water"},{id:"weight",icon:"⚖️",label:"Weight"},{id:"tips",icon:"💎",label:"Tips"}];
  const ACCENT={home:"#facc15",meals:"#a78bfa",grocery:"#4ade80",workout:"#f97316",water:"#38bdf8",weight:"#4ade80",tips:"#facc15"};
  const accent=ACCENT[tab];
  const LABELS={home:"DASHBOARD",meals:"MEAL TRACKER",grocery:"GROCERY LIST",workout:"GYM TRACKER",water:"WATER + PRE-WORKOUT",weight:"WEIGHT LOG",tips:"LEAN MUSCLE + JAWLINE"};

  if(loading)return(<div style={{minHeight:"100vh",background:"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:"#facc15",letterSpacing:4}}>⚡ LOKI WORKOUT</div><div style={{width:40,height:40,border:"3px solid #1e1e1e",borderTop:"3px solid #facc15",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/></div>);

  return(
    <div style={{minHeight:"100vh",background:"#0a0a0a",fontFamily:"'DM Sans',sans-serif",paddingBottom:72}}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"/>
      <div style={{background:`linear-gradient(180deg,${accent}12 0%,transparent 100%)`,padding:"15px 18px 10px",borderBottom:"1px solid #0d0d0d",position:"sticky",top:0,zIndex:50,backdropFilter:"blur(14px)",transition:"background .3s"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:"#fff",letterSpacing:3,lineHeight:1}}>⚡ {PROJECT_NAME}</div><div style={{color:"#1e1e1e",fontSize:9,letterSpacing:1.5,marginTop:2}}>{LABELS[tab]}</div></div>
          <div style={{textAlign:"right"}}><div style={{color:"#1a1a1a",fontSize:9}}>{new Date().toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"})}</div><div style={{color:accent,fontSize:9,fontWeight:700,marginTop:2}}>WEEK {weekNumber()} · DAY {daysSinceStart()}</div></div>
        </div>
      </div>
      <div style={{maxWidth:520,margin:"0 auto",padding:"14px 14px 0"}}>
        {tab==="home"    &&<Dashboard mealChecked={mealChecked} workoutChecked={workoutChecked} weights={weights} workoutDay={workoutDay} waterChecked={waterChecked} setTab={setTab}/>}
        {tab==="meals"   &&<MealTracker mealChecked={mealChecked} setMealChecked={setMealChecked}/>}
        {tab==="grocery" &&<GroceryTab/>}
        {tab==="workout" &&<WorkoutTracker workoutChecked={workoutChecked} setWorkoutChecked={setWorkoutChecked} workoutDay={workoutDay} setWorkoutDay={setWorkoutDay}/>}
        {tab==="water"   &&<WaterTab waterChecked={waterChecked} setWaterChecked={setWaterChecked}/>}
        {tab==="weight"  &&<WeightTracker weights={weights} setWeights={setWeights}/>}
        {tab==="tips"    &&<TipsTab mealChecked={mealChecked} workoutChecked={workoutChecked} weights={weights}/>}
      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(6,6,6,0.97)",borderTop:"1px solid #0d0d0d",display:"flex",padding:"5px 0 8px",zIndex:100,backdropFilter:"blur(14px)"}}>
        {TABS.map(t=>{const active=tab===t.id,col=ACCENT[t.id];return(<button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,background:"transparent",border:"none",cursor:"pointer",padding:"4px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}><span style={{fontSize:15,filter:active?"none":"grayscale(1) opacity(0.18)"}}>{t.icon}</span><span style={{fontSize:7,fontWeight:700,color:active?col:"#1a1a1a",letterSpacing:0.3,textTransform:"uppercase"}}>{t.label}</span><div style={{width:active?14:0,height:2,background:col,borderRadius:2,transition:"width .2s"}}/></button>);})}
      </div>
    </div>
  );
}
