/* Practice board: open the app with ?practice=1. Replaces Firebase with a fake, in-browser database
   saved in this device's storage only. Made-up crew and jobs; nothing reaches the real board.
   ?practice=1&as=crew shows the app the way a tech sees it. */
(function(){
const KEY="cl_practice_db_v1",AS=/[?&]as=crew/.test(location.search)?"crew":"lead";
const clone=o=>o==null?o:JSON.parse(JSON.stringify(o));
let DB={};try{DB=JSON.parse(localStorage.getItem(KEY)||"null")||null;}catch(e){DB=null;}
const iso=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
function seed(){const T=new Date(),add=n=>{const d=new Date(T);d.setDate(d.getDate()+n);return iso(d);},now=Date.now(),day=864e5,D={};
  const crew=[["t1","You (lead)","p-lead","Lead / Foreman",["BICSI Technician","Lift / MEWP"]],["t2","Alex Rivera","p-crew","Technician",["Lift / MEWP"]],["t3","Sam Carter","","Apprentice",[]],["t4","Jordan Lee","","Technician",["Copper certification (Fluke)"]],
    ["t5","Casey Morgan","","Apprentice",["Lift / MEWP"]],["t6","Riley Brooks","","Helper",[]],["t7","Drew Patel","","Technician",[]],["t8","Morgan Diaz","","Apprentice",["Forklift"]]];
  crew.forEach(([id,name,uid,role,skills])=>D["techs/"+id]={name,uid,role,skills,active:true});
  D["team/config"]={ownerUid:"p-lead"};
  D["team/roles"]={roles:{"p-lead":{role:"lead",techId:"t1"},"p-crew":{role:"crew",techId:"t2"}}};
  D["team/crew"]={members:{},stepTools:{pull:"Fish tape, Pull string, Ladder",terminate:"Punch-down tool",label:"Label maker",test:"Fluke"},crewKits:[{name:"Lift pull crew",need:{lift:2,spotter:1,stager:1}}]};
  D["people/p-lead"]={name:"You (lead)"};D["people/p-crew"]={name:"Alex Rivera"};
  const steps=[{id:"s1",name:"Pull"},{id:"s2",name:"Dress"},{id:"s3",name:"Terminate"},{id:"s4",name:"Label"},{id:"s5",name:"Test"}],cables=[],marks={};let k=0;
  [["2.01","BMS",12],["2.01","Cameras",8],["2.01","WAPs",6],["2.02","BMS",10],["2.02","Cameras",8],["2.02","WAPs",6]].forEach(([r,t,n])=>{for(let i=1;i<=n;i++){const id="c"+(++k);cables.push({id,name:r+"-"+(100+k),rack:r,type:t,pull:r+" "+t+" · Row "+(10+Math.ceil(i/4)*2)});
    if(r==="2.01"&&t==="BMS"){marks[id]={s1:{at:now-(3+i%3)*day,by:"p-crew"}};if(i<=8)marks[id].s2={at:now-2*day,by:"p-crew"};if(i<=4)marks[id].s3={at:now-day,by:"p-crew"};}
    if(r==="2.01"&&t==="Cameras"&&i<=4)marks[id]={s1:{at:now-day,by:"p-crew"}};}});
  const ph=[{id:"p1",name:"2.01",cab:"2.01",afterPrev:false},{id:"p2",name:"2.02",cab:"2.02",afterPrev:false}];
  const st0=add(-7),tk=(id,nm,p,r,t,crewIds,extra)=>Object.assign({id,name:nm,phase:p,scope:{rack:r,type:t},after:[],crew:crewIds,crewLog:{[st0]:crewIds}},extra||{});
  D["jobs/j1"]={name:"Practice · Cat6 IDF pulls",kind:"cat6",start:st0,weeks:4,pri:1,conf:"locked",techs:6,site:"Practice site",tools:"Hard hat, Gloves",steps,cables,marks,phases:ph,
    tasks:[tk("k1","2.01 BMS","p1","2.01","BMS",["t2","t3"]),tk("k2","2.01 Cameras","p1","2.01","Cameras",["t4"]),tk("k3","2.01 WAPs","p1","2.01","WAPs",[],{need:{lift:2,spotter:1,stager:1},due:add(3)}),
      tk("k4","2.02 BMS","p2","2.02","BMS",[]),tk("k5","2.02 Cameras","p2","2.02","Cameras",[]),tk("k6","2.02 WAPs","p2","2.02","WAPs",[])],crew:[],crewLog:{}};
  D["jobs/j2"]={name:"Practice · Rack install",kind:"racks",start:add(4),weeks:1,pri:2,conf:"likely",techs:3,site:"Practice site"};
  D["messages/m1"]={text:"📅 GC coordination · Trailer",kind:"meeting",to:[],by:"p-lead",at:now,remindOn:iso(T),remindAt:"09:30",dur:60,done:false};
  D["timeoff/o1"]={techId:"t6",uid:"",type:"PTO",start:add(1),end:add(1),by:"p-lead",at:now};
  D["material/m1"]={item:"Cat6 CMP blue",qty:3,unit:"box",min:5,per:1000};
  return D;}
if(!DB){DB=seed();try{localStorage.setItem(KEY,JSON.stringify(DB));}catch(e){}}
let saveT=null;const save=()=>{clearTimeout(saveT);saveT=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(DB));}catch(e){}},150);};
const subs=[];const notify=()=>{save();setTimeout(()=>subs.slice().forEach(f=>f()),0);};
const SENT=v=>v&&typeof v==="object"&&("__del" in v||"__arrU" in v||"__arrR" in v||"__inc" in v||"__ts" in v);
function apply(cur,v){if(!SENT(v))return clone(v);if("__arrU" in v)return [...new Set([...(Array.isArray(cur)?cur:[]),...v.__arrU])];if("__arrR" in v)return (Array.isArray(cur)?cur:[]).filter(x=>!v.__arrR.includes(x));if("__inc" in v)return (+cur||0)+v.__inc;if("__ts" in v)return Date.now();return v;}
function setPath(o,path,v){const ps=path.split(".");let c=o;for(let i=0;i<ps.length-1;i++){if(typeof c[ps[i]]!=="object"||!c[ps[i]])c[ps[i]]={};c=c[ps[i]];}const last=ps[ps.length-1];if(v&&v.__del)delete c[last];else c[last]=apply(c[last],v);}
function merge(dst,src){Object.keys(src).forEach(k=>{const v=src[k];if(v&&v.__del)delete dst[k];else if(v&&typeof v==="object"&&!Array.isArray(v)&&!SENT(v)){if(typeof dst[k]!=="object"||!dst[k]||Array.isArray(dst[k]))dst[k]={};merge(dst[k],v);}else dst[k]=apply(dst[k],v);});return dst;}
function strip(o){if(o&&typeof o==="object")Object.keys(o).forEach(k=>{if(o[k]&&o[k].__del)delete o[k];else if(SENT(o[k]))o[k]=apply(undefined,o[k]);else strip(o[k]);});return o;}
function snapDoc(path){const d=DB[path];return{id:path.split("/").pop(),exists:!!d,data:()=>clone(d),get:k=>d?d[k]:undefined,metadata:{fromCache:false,hasPendingWrites:false},ref:docRef(path)};}
function docRef(path){return{id:path.split("/").pop(),path,
  get:async()=>snapDoc(path),
  async set(v,o){if(o&&o.merge)DB[path]=merge(DB[path]||{},clone2(v));else DB[path]=strip(clone2(v));notify();},
  async update(v){if(!DB[path])throw Object.assign(new Error("No document"),{code:"not-found"});Object.keys(v).forEach(k=>setPath(DB[path],k,v[k]));notify();},
  async delete(){delete DB[path];notify();},
  onSnapshot(ok){const f=()=>ok(snapDoc(path));subs.push(f);setTimeout(f,0);return()=>{const i=subs.indexOf(f);if(i>=0)subs.splice(i,1);};},
  collection:n=>colRef(path+"/"+n)};}
const clone2=v=>{const walk=x=>{if(SENT(x))return x;if(Array.isArray(x))return x.map(walk);if(x&&typeof x==="object"){const o={};Object.keys(x).forEach(k=>o[k]=walk(x[k]));return o;}return x;};return walk(v);};
let idn=0;const nid=()=>"p"+Date.now().toString(36)+(++idn).toString(36)+Math.random().toString(36).slice(2,6);
function colRef(name,filters,ord,lim){filters=filters||[];const q={
  doc:id=>docRef(name+"/"+(id||nid())),
  add:async v=>{const id=nid();DB[name+"/"+id]=strip(clone2(v));notify();return docRef(name+"/"+id);},
  where:(f,op,v)=>colRef(name,filters.concat([[f,op,v]]),ord,lim),orderBy:(f,dir)=>colRef(name,filters,[f,dir],lim),limit:n=>colRef(name,filters,ord,n),limitToLast:n=>colRef(name,filters,ord,n),startAfter:()=>q,
  get:async()=>snap(),
  onSnapshot(ok){const f=()=>ok(snap());subs.push(f);setTimeout(f,0);return()=>{const i=subs.indexOf(f);if(i>=0)subs.splice(i,1);};}};
  function snap(){let docs=Object.keys(DB).filter(k=>k.startsWith(name+"/")&&k.split("/").length===name.split("/").length+1).map(snapDoc).filter(d=>filters.every(([f,op,v])=>{const x=(d.data()||{})[f];return op==="=="?x===v:op==="!="?x!==v:op===">="?x>=v:op==="<="?x<=v:op===">"?x>v:op==="<"?x<v:op==="in"?v.includes(x):op==="array-contains"?Array.isArray(x)&&x.includes(v):true;}));
    if(ord){const [f,dir]=ord;docs.sort((a,b)=>{const x=(a.data()||{})[f],y=(b.data()||{})[f];return (x>y?1:x<y?-1:0)*(dir==="desc"?-1:1);});}if(lim)docs=docs.slice(0,lim);
    return{docs,size:docs.length,empty:!docs.length,metadata:{fromCache:false,hasPendingWrites:false},forEach:fn=>docs.forEach(fn),docChanges:()=>docs.map(d=>({type:"added",doc:d}))};}
  return q;}
const fs=()=>({collection:n=>colRef(n),doc:p=>docRef(p),enablePersistence:async()=>{},
  batch:()=>{const ops=[];return{set:(r,v,o)=>ops.push(()=>r.set(v,o)),update:(r,v)=>ops.push(()=>r.update(v)),delete:r=>ops.push(()=>r.delete()),commit:async()=>{for(const o of ops)await o();}};},
  runTransaction:async fn=>fn({get:r=>r.get(),set:(r,v,o)=>r.set(v,o),update:(r,v)=>r.update(v),delete:r=>r.delete()})});
fs.FieldValue={delete:()=>({__del:1}),arrayUnion:(...a)=>({__arrU:a}),arrayRemove:(...a)=>({__arrR:a}),serverTimestamp:()=>({__ts:1}),increment:n=>({__inc:n})};
const user=AS==="crew"?{uid:"p-crew",displayName:"Alex Rivera",email:"alex@practice"}:{uid:"p-lead",displayName:"You (lead)",email:"lead@practice"};
user.updateProfile=async()=>{};user.getIdToken=async()=>"practice";
const auth=()=>({currentUser:user,getRedirectResult:async()=>null,onAuthStateChanged:cb=>{setTimeout(()=>cb(user),10);return()=>{};},signOut:async()=>{location.href=location.pathname;},
  signInWithEmailAndPassword:async()=>({user}),createUserWithEmailAndPassword:async()=>({user}),signInWithPopup:async()=>({user}),signInWithRedirect:async()=>{},sendPasswordResetEmail:async()=>{}});
auth.GoogleAuthProvider=function(){};
window.firebase={initializeApp:()=>{},auth,firestore:fs,apps:[1]};
window.FIREBASE_CONFIG=Object.assign({},window.FIREBASE_CONFIG||{},{apiKey:"practice"});
window.CL_PRACTICE={as:AS,reset(){localStorage.removeItem(KEY);location.reload();},exit(){location.href=location.pathname;},switchTo(a){location.href=location.pathname+"?practice=1"+(a==="crew"?"&as=crew":"");}};
const bar=()=>{if(document.getElementById("practiceBar"))return;const b=document.createElement("div");b.id="practiceBar";
  b.innerHTML='<b>🧪 PRACTICE BOARD</b><span>Fake data on this phone only. Your crew can\'t see it.</span><span class="pb-btns"><button type="button" data-a="as">'+(AS==="crew"?"See as lead":"See as a tech")+'</button><button type="button" data-a="reset">Reset</button><button type="button" data-a="exit">Exit</button></span>';
  b.addEventListener("click",e=>{const a=e.target.dataset&&e.target.dataset.a;if(a==="as")CL_PRACTICE.switchTo(AS==="crew"?"lead":"crew");else if(a==="reset"){if(confirm("Start the practice board over with fresh fake data?"))CL_PRACTICE.reset();}else if(a==="exit")CL_PRACTICE.exit();});
  document.body.prepend(b);document.title="🧪 Practice · Crew Lookahead";};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bar);else bar();
})();
