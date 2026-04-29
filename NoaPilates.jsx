import { useState } from "react";

// ── NOA LOGO SVG ──────────────────────────────────────────────────────
const NoaLogo = ({ size = 32, color = "#9a6070" }) => (
  <svg width={size} height={size * 0.55} viewBox="0 0 120 66" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="28" cy="6" r="6" fill={color}/>
    <path d="M10 52 L10 28 Q10 14 24 14 Q38 14 38 28 L38 52" stroke={color} strokeWidth="9" strokeLinecap="round" fill="none"/>
    <circle cx="67" cy="36" r="20" stroke={color} strokeWidth="9" fill="none"/>
    <path d="M88 52 L88 28 Q88 14 102 14 Q116 14 116 28 L116 52" stroke={color} strokeWidth="9" strokeLinecap="round" fill="none"/>
    <path d="M98 42 Q116 42 116 52" stroke={color} strokeWidth="9" strokeLinecap="round" fill="none"/>
  </svg>
);
const NoaLogoBadge = ({ size = 32 }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", background:"linear-gradient(135deg,#c4a0a8,#9a6070)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
    <svg width={size*.78} height={size*.44} viewBox="0 0 120 66" fill="none">
      <circle cx="28" cy="6" r="6" fill="#fff"/>
      <path d="M10 52 L10 28 Q10 14 24 14 Q38 14 38 28 L38 52" stroke="#fff" strokeWidth="9" strokeLinecap="round" fill="none"/>
      <circle cx="67" cy="36" r="20" stroke="#fff" strokeWidth="9" fill="none"/>
      <path d="M88 52 L88 28 Q88 14 102 14 Q116 14 116 28 L116 52" stroke="#fff" strokeWidth="9" strokeLinecap="round" fill="none"/>
      <path d="M98 42 Q116 42 116 52" stroke="#fff" strokeWidth="9" strokeLinecap="round" fill="none"/>
    </svg>
  </div>
);

// ── TRANSLATIONS ─────────────────────────────────────────────────────
const T = {
  en: {
    // splash
    whatsYourName: "What's your name?",
    enter: "Enter →",
    studioAdmin: "Studio admin ↗",
    // nav
    classes: "🗓 Classes",
    package: "📦 Package",
    profile: "👤 Profile",
    change: "Change",
    // days
    days: { Monday:"Monday",Tuesday:"Tuesday",Wednesday:"Wednesday",Thursday:"Thursday",Friday:"Friday",Sunday:"Sunday" },
    dayShort: { Monday:"MON",Tuesday:"TUE",Wednesday:"WED",Thursday:"THU",Friday:"FRI",Sunday:"SUN" },
    month: "April 2026",
    // booking
    activePackage: "Active Package",
    autoLogged: "Auto-logged on book",
    sessions: "sessions",
    book: "Book",
    cancel: "Cancel",
    full: "Full",
    closed: "Closed",
    booked: t.booked,
    locked: t.locked,
    left: "left",
    oneHour: "1h",
    momBabyDuration: "1h (45min)",
    openUntil: "Open until",
    at: "at",
    // notes
    note1: "{ t.note1 }",
    note2: "{ t.note2 }",
    note3: "{ t.note3 }",
    note4: "{ t.note4 }",
    // packages tab
    myPackage: "My Package",
    noPackageTitle: "No package yet",
    noPackageDesc: "Ask the studio to assign a package to your account.",
    sessionsDone: "{ t.sessionsDone }",
    sessionsRemaining: "remaining",
    completed: "Completed",
    unpaid: "Unpaid",
    started: "Started",
    pendingPayment: "{ t.pendingPayment }",
    paid: "Paid",
    pending: "Pending",
    done: "{ t.done }",
    sessionsLog: "Sessions",
    availablePackages: "Available Packages",
    contactStudio: "To purchase a package, contact the studio.",
    // profile tab
    upcoming: "Upcoming Classes",
    noClassesBooked: "No classes booked",
    myPackages: "My Packages",
    noPackagesContact: "No packages — contact the studio",
    // toasts
    bookingClosed: "Booking closed — deadline passed",
    classFull: "Class is full!",
    alreadyBooked: "Already booked!",
    cancellationClosed: "Cancellation closed — deadline passed",
    bookingCancelled: "Booking cancelled",
    bookedAnd: "Booked & logged to",
    paymentMarked: "Payment marked ✓",
    packageRemoved: "Package removed",
    // admin
    admin: "ADMIN",
    exit: "← Exit",
    totalBookings: "Total bookings",
    activePackages: "Active packages",
    unpaidPackages: "Unpaid packages",
    addPackageToClient: "📦 Add Package to Client",
    selectClient: "— Select client —",
    newClientName: "+ New client name…",
    addPackage: "+ Add package",
    typeClientName: "Type client name and press Enter",
    classBookings: "${t.classBookings}",
    open: "🟢 Open",
    lockedAdmin: "🔴 Locked",
    noBookings: "No bookings",
    addClient: "+ Add client",
    clientPackages: "Client Packages",
    noPackagesYet: "No packages yet",
    markPaid: "Mark paid",
    remove: "Remove",
    chooseType: "Choose type",
    chooseOption: "Choose option",
    for: "For:",
    back: "← Back",
    confirmPackage: "Confirm Package",
    alreadyBookedOrFull: t.alreadyBookedOrFull,
    addedTo: "added to",
    packageAdded: "Package added for",
  },
  pt: {
    whatsYourName: "Qual é o teu nome?",
    enter: "Entrar →",
    studioAdmin: "Admin do estúdio ↗",
    classes: "🗓 Aulas",
    package: "📦 Pacote",
    profile: "👤 Perfil",
    change: "Mudar",
    days: { Monday:"Segunda",Tuesday:"Terça",Wednesday:"Quarta",Thursday:"Quinta",Friday:"Sexta",Sunday:"Domingo" },
    dayShort: { Monday:"SEG",Tuesday:"TER",Wednesday:"QUA",Thursday:"QUI",Friday:"SEX",Sunday:"DOM" },
    month: "Abril 2026",
    activePackage: "Pacote Ativo",
    autoLogged: "Aula registada automaticamente",
    sessions: "sessões",
    book: "Marcar",
    cancel: "Cancelar",
    full: "Cheio",
    closed: "Fechado",
    booked: "✓ Marcado",
    locked: "🔒 Bloqueado",
    left: "livres",
    oneHour: "1h",
    momBabyDuration: "1h (45min)",
    openUntil: "Aberto até",
    at: "às",
    note1: "📌 Todas as aulas são adequadas para todos os níveis.",
    note2: "🌅 Aulas da manhã: cancela até às 16h do dia anterior.",
    note3: "🌆 Aulas da tarde/noite: cancelar com 24h de antecedência.",
    note4: "🔒 Após o prazo, só o estúdio pode alterar as marcações.",
    myPackage: "O Meu Pacote",
    noPackageTitle: "Sem pacote",
    noPackageDesc: "Pede ao estúdio para atribuir um pacote à tua conta.",
    sessionsDone: "sessões usadas",
    sessionsRemaining: "restantes",
    completed: "Concluído",
    unpaid: "Por pagar",
    started: "Início",
    pendingPayment: "Pagamento pendente",
    paid: "Pago",
    pending: "Pendente",
    done: "✓ Feito",
    sessionsLog: "Sessões",
    availablePackages: "Pacotes Disponíveis",
    contactStudio: "Para comprar um pacote, contacta o estúdio.",
    upcoming: "Próximas Aulas",
    noClassesBooked: "Sem aulas marcadas",
    myPackages: "Os Meus Pacotes",
    noPackagesContact: "Sem pacotes — contacta o estúdio",
    bookingClosed: "Marcação fechada — prazo ultrapassado",
    classFull: "Aula cheia!",
    alreadyBooked: "Já marcado!",
    cancellationClosed: "Cancelamento fechado — prazo ultrapassado",
    bookingCancelled: "Marcação cancelada",
    bookedAnd: "Marcado e registado em",
    paymentMarked: "Pagamento registado ✓",
    packageRemoved: "Pacote removido",
    admin: "ADMIN",
    exit: "← Sair",
    totalBookings: "Total de marcações",
    activePackages: "Pacotes ativos",
    unpaidPackages: "Pacotes por pagar",
    addPackageToClient: "📦 Adicionar Pacote a Cliente",
    selectClient: "— Selecionar cliente —",
    newClientName: "+ Nome de novo cliente…",
    addPackage: "+ Adicionar pacote",
    typeClientName: "Escreve o nome do cliente e prime Enter",
    classBookings: "Marcações — Controlo Admin",
    open: "🟢 Aberto",
    lockedAdmin: "🔴 Bloqueado",
    noBookings: "Sem marcações",
    addClient: "+ Adicionar cliente",
    clientPackages: "Pacotes de Clientes",
    noPackagesYet: "Sem pacotes ainda",
    markPaid: "Marcar pago",
    remove: "Remover",
    chooseType: "Escolher tipo",
    chooseOption: "Escolher opção",
    for: "Para:",
    back: "← Voltar",
    confirmPackage: "Confirmar Pacote",
    alreadyBookedOrFull: "Já marcado ou sem lugares",
    addedTo: "adicionado a",
    packageAdded: "Pacote adicionado para",
  },
};

const deadlineLabelI18n = (dayName, timeStr, lang) => {
  const dl = deadline(dayName, timeStr);
  const [h, m] = timeStr.split(":").map(Number);
  const isMorning = h < 14;
  const daysEn = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const daysPt = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  const daysArr = lang === "pt" ? daysPt : daysEn;
  const pad = n => String(n).padStart(2,"0");
  const t = T[lang];
  if (isMorning) {
    return `${t.openUntil} ${daysArr[dl.getDay()]} ${t.at} 16:00`;
  } else {
    return `${t.openUntil} ${daysArr[dl.getDay()]} ${pad(dl.getHours())}:${pad(dl.getMinutes())}`;
  }
};


const C = {
  bg:"#f5f0eb", surface:"#ffffff", surfaceAlt:"#faf7f4",
  border:"#e8d8dc", borderMid:"#ddc0c6",
  text:"#3d1f28", textMid:"#7a4a55", textLight:"#b09090",
  wine:"#5c2d3a", wineLight:"#9a4a5a", winePale:"#f5edef",
  green:"#4a7a5a", greenPale:"#edf5f0", greenBorder:"#b0d4bc",
  amber:"#8a6020", amberPale:"#fdf3e3", amberBorder:"#e8c890",
  red:"#8a2828", redPale:"#f5e8e8", redBorder:"#d4a0a0",
  blue:"#3a5878", bluePale:"#edf2f8", blueBorder:"#b0c4d8",
  teal:"#2a6a68", tealPale:"#e8f4f3", tealBorder:"#a0cccb",
};

// ── SCHEDULE ─────────────────────────────────────────────────────────
// "morning" = before 14:00 → deadline: 16:00 day before (Lisbon)
// "evening" = 14:00 or later → deadline: 24h before (Lisbon)
const SCHEDULE = {
  Monday:    [{ time:"10:00",name:"Reformer",tag:null },{ time:"11:00",name:"Dynamic Mat",tag:null },{ time:"18:00",name:"Reformer",tag:null },{ time:"19:00",name:"Reformer",tag:null }],
  Tuesday:   [{ time:"9:30", name:"Reformer",tag:null },{ time:"10:30",name:"Reformer",tag:"Power Flow" },{ time:"12:00",name:"Mat",tag:null }],
  Wednesday: [{ time:"10:00",name:"Reformer",tag:null },{ time:"11:00",name:"Reformer",tag:"Back pain & injury" }],
  Thursday:  [{ time:"10:00",name:"Reformer",tag:null },{ time:"11:15",name:"Mat Pilates",tag:"Mom & Baby" },{ time:"17:00",name:"Reformer",tag:null },{ time:"18:00",name:"Dynamic Mat",tag:null }],
  Friday:    [{ time:"9:45", name:"Reformer",tag:null },{ time:"11:00",name:"Mat",tag:null },{ time:"12:15",name:"Reformer",tag:"Beginner" },{ time:"13:30",name:"Reformer",tag:null }],
  Sunday:    [{ time:"10:00",name:"Reformer",tag:null },{ time:"11:00",name:"Dynamic Mat",tag:null }],
};
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Sunday"];
const DAY_IDX = { Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6,Sunday:0 }; // JS getDay()
const DAY_SHORT = { Monday:"MON",Tuesday:"TUE",Wednesday:"WED",Thursday:"THU",Friday:"FRI",Sunday:"SUN" };
const MAX_SPOTS = (className) => className === "Reformer" ? 4 : 6;

const CLASS_STYLE = {
  Reformer:     { color:C.wine,  bg:C.winePale,  border:C.borderMid },
  "Dynamic Mat":{ color:C.green, bg:C.greenPale, border:C.greenBorder },
  Mat:          { color:C.green, bg:C.greenPale, border:C.greenBorder },
  "Mat Pilates":{ color:C.green, bg:C.greenPale, border:C.greenBorder },
};
const TAG_STYLE = {
  "Power Flow":         { color:C.amber, bg:C.amberPale, border:C.amberBorder },
  "Back pain & injury": { color:C.blue,  bg:C.bluePale,  border:C.blueBorder },
  "Mom & Baby":         { color:"#7a3a60", bg:"#f8edf4", border:"#e8b8d4" },
  "Beginner":           { color:C.teal,  bg:C.tealPale,  border:C.tealBorder },
};

// ── PACKAGES ──────────────────────────────────────────────────────────
const PACKAGES = {
  membership:{ label:"Monthly Membership", icon:"📅", color:C.wine, bg:C.winePale, border:C.borderMid, isMonthly:true,
    groups:[
      { name:"Reformer", opts:[
        { id:"ref_1x", label:"1 class/week",  price:115 },
        { id:"ref_2x", label:"2 classes/week",price:220 },
        { id:"ref_3x", label:"3 classes/week",price:320 },
        { id:"ref_ul", label:"Unlimited",     price:350 },
      ]},
      { name:"Mat", opts:[
        { id:"mat_1x", label:"1 class/week",  price:60  },
        { id:"mat_2x", label:"2 classes/week",price:110 },
        { id:"mat_3x", label:"3 classes/week",price:130 },
      ]},
      { name:"Reformer & Mat Combo", opts:[
        { id:"combo_m", label:"1 Reformer + 1 Mat/week", price:160 },
      ]},
    ],
  },
  reformer:{ label:"Reformer Packages", icon:"🛏️", color:"#7a4a2a", bg:"#f5ede5", border:"#d4b898", isMonthly:false,
    opts:[
      { id:"ref_5",    label:"5 Classes Pass",  qty:5,  price:150, validity:"6 weeks"  },
      { id:"ref_10",   label:"10 Classes Pass", qty:10, price:280, validity:"12 weeks" },
      { id:"ref_drop", label:"Drop-in Class",   qty:1,  price:35,  validity:null       },
    ],
  },
  mat:{ label:"Mat Packages", icon:"🏋️", color:C.green, bg:C.greenPale, border:C.greenBorder, isMonthly:false,
    opts:[
      { id:"mat_5",    label:"5 Classes Pass",  qty:5,  price:75,  validity:"6 weeks"  },
      { id:"mat_10",   label:"10 Classes Pass", qty:10, price:125, validity:"12 weeks" },
      { id:"mat_drop", label:"Drop-in Class",   qty:1,  price:20,  validity:null       },
    ],
  },
  combo:{ label:"Reformer & Mat Combo", icon:"🔀", color:C.blue, bg:C.bluePale, border:C.blueBorder, isMonthly:false,
    opts:[
      { id:"combo_5",  label:"5 Reformer + 5 Mat",  qty:10, price:205, validity:"3 months", note:"Mix & Match" },
      { id:"combo_10", label:"10 Reformer + 10 Mat", qty:20, price:370, validity:"6 months", note:"Mix & Match" },
    ],
  },
  visitor:{ label:"Visitor's Pass", icon:"🌊", color:C.teal, bg:C.tealPale, border:C.tealBorder, isMonthly:false,
    opts:[
      { id:"vis_ref", label:"3 Reformer Class Pass", qty:3, price:96, validity:"2 weeks" },
      { id:"vis_mat", label:"3 Mat Class Pass",      qty:3, price:54, validity:"2 weeks" },
    ],
  },
  private:{ label:"Private & Duo", icon:"👤", color:"#9a4a6a", bg:"#f8edf4", border:"#e0b8cc", isMonthly:false,
    opts:[
      { id:"priv", label:"Private Session", qty:1, price:55, validity:null },
      { id:"duo",  label:"Duo Session",     qty:1, price:95, validity:null },
    ],
  },
  intro:{ label:"Intro / Trial", icon:"✨", color:C.amber, bg:C.amberPale, border:C.amberBorder, isMonthly:false,
    opts:[
      { id:"trial", label:"Trial Class", qty:1, price:20, validity:null, note:"Free with any package" },
    ],
  },
};

const fmt = d => d.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"2-digit"});

// ── DEADLINE LOGIC (Lisbon time) ──────────────────────────────────────
// Returns the Date object of the booking deadline for a given class slot.
// "day" is one of DAYS (e.g. "Monday"), "time" is "HH:MM".
// The schedule repeats weekly; we find the NEXT occurrence of that weekday.
//
// Rules (Lisbon time, Europe/Lisbon):
//   Morning class (before 14:00) → deadline = previous day at 16:00 Lisbon
//   Evening class  (≥ 14:00)     → deadline = class time − 24 hours (Lisbon)

const lisbonNow = () => {
  // Use Intl to get current Lisbon wall-clock time as a plain Date
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone:"Europe/Lisbon",
    year:"numeric",month:"2-digit",day:"2-digit",
    hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false,
  }).formatToParts(new Date());
  const p = {};
  parts.forEach(({type,value}) => p[type]=value);
  return new Date(`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`);
};

// Next occurrence of a weekday in Lisbon time (returns a plain Date in local coords)
const nextOccurrence = (dayName) => {
  const now = lisbonNow();
  const target = DAY_IDX[dayName];
  const current = now.getDay();
  let diff = target - current;
  if (diff < 0) diff += 7;
  if (diff === 0) diff = 0; // today
  const d = new Date(now);
  d.setDate(d.getDate() + diff);
  d.setSeconds(0, 0);
  return d;
};

// Returns deadline Date for a slot (in Lisbon "plain" time)
const deadline = (dayName, timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  const isMorning = h < 14;
  const classDay = nextOccurrence(dayName);
  classDay.setHours(h, m, 0, 0);

  if (isMorning) {
    // Deadline: day before at 16:00
    const d = new Date(classDay);
    d.setDate(d.getDate() - 1);
    d.setHours(16, 0, 0, 0);
    return d;
  } else {
    // Deadline: 24h before class
    return new Date(classDay.getTime() - 24 * 60 * 60 * 1000);
  }
};

// Is booking/cancellation still open for a client (not admin)?
const isOpen = (dayName, timeStr) => {
  const now = lisbonNow();
  const dl = deadline(dayName, timeStr);
  return now < dl;
};

// Human-readable deadline string
const deadlineLabel = (dayName, timeStr) => {
  const dl = deadline(dayName, timeStr);
  const [h, m] = timeStr.split(":").map(Number);
  const isMorning = h < 14;
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const pad = n => String(n).padStart(2,"0");
  if (isMorning) {
    return `Open until ${days[dl.getDay()]} at 16:00`;
  } else {
    return `Open until ${days[dl.getDay()]} ${pad(dl.getHours())}:${pad(dl.getMinutes())}`;
  }
};

// ─────────────────────────────────────────────────────────────────────
export default function NoaPilates() {
  const [tab, setTab] = useState("book");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [lang, setLang] = useState("en");
  const t = T[lang];
  const [userName, setUserName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [bookings, setBookings] = useState({});           // { "Day-HH:MM": [{name,ts}] }
  const [clientPkgs, setClientPkgs] = useState({});       // { name: [pkg...] }
  const [showPkgModal, setShowPkgModal] = useState(false);
  const [pkgStep, setPkgStep] = useState(1);
  const [selPkgKey, setSelPkgKey] = useState("reformer");
  const [selOptId, setSelOptId] = useState("ref_10");
  const [selClientForPkg, setSelClientForPkg] = useState(""); // admin: which client gets pkg
  const [toast, setToast] = useState(null);
  const isAdmin = userName === "__admin__";

  const fire = (msg, type="ok") => { setToast({msg,type}); setTimeout(()=>setToast(null),3200); };

  const slotKey = (day,time) => `${day}-${time}`;
  const spotsLeft = (day,time) => { const slot = SCHEDULE[day]?.find(s=>s.time===time); return MAX_SPOTS(slot?.name||"") - ((bookings[slotKey(day,time)]||[]).length); };
  const isBooked = (day,time,who=userName) => (bookings[slotKey(day,time)]||[]).some(b=>b.name===who);
  const myPkgs = (who=userName) => clientPkgs[who]||[];
  const activePkg = (who=userName) => myPkgs(who).find(p=>p.qty?p.sessions.length<p.qty:true);
  const getOpts = key => { const p=PACKAGES[key]; return p.groups?p.groups.flatMap(g=>g.opts):(p.opts||[]); };
  const allClients = () => [...new Set([...Object.keys(clientPkgs),...Object.values(bookings).flatMap(v=>v.map(b=>b.name))])].filter(n=>n&&n!=="__admin__");

  // ── BOOK ─────────────────────────────────────────────────────────
  const bookClass = (day, slot) => {
    const open = isOpen(day, slot.time);
    if (!isAdmin && !open) { fire(t.bookingClosed,"warn"); return; }
    if (spotsLeft(day,slot.time)<=0) { fire(t.classFull,"warn"); return; }
    if (isBooked(day,slot.time)) { fire(t.alreadyBooked,"warn"); return; }
    const who = userName;
    setBookings(prev=>({...prev,[slotKey(day,slot.time)]:[...(prev[slotKey(day,slot.time)]||[]),{name:who,ts:new Date().toISOString()}]}));
    const pkg = activePkg(who);
    if (pkg) {
      setClientPkgs(prev=>({...prev,[who]:prev[who].map(p=>p.id===pkg.id?{...p,sessions:[...p.sessions,{id:Date.now(),date:fmt(new Date()),class:slot.name,time:slot.time,day}]}:p)}));
      fire(`${t.bookedAnd} ${PACKAGES[pkg.pkgKey]?.label} ✓`);
    } else {
      fire(`${slot.time} ${slot.name} ${lang==="pt"?"marcado!":"booked!"}`);
    }
  };

  const cancelBooking = (day, time, who=userName) => {
    const open = isOpen(day, time);
    if (!isAdmin && !open) { fire(t.cancellationClosed,"warn"); return; }
    setBookings(prev=>({...prev,[slotKey(day,time)]:(prev[slotKey(day,time)]||[]).filter(b=>b.name!==who)}));
    fire(t.bookingCancelled,"warn");
  };

  // ── PACKAGES (admin only) ─────────────────────────────────────────
  const addPackage = () => {
    const clientName = isAdmin ? selClientForPkg : userName;
    if (!clientName) { fire("Select a client first","warn"); return; }
    const opts = getOpts(selPkgKey);
    const opt = opts.find(o=>o.id===selOptId)||opts[0];
    const entry = { id:Date.now(), pkgKey:selPkgKey, optId:opt.id, label:opt.label, qty:opt.qty||null, price:opt.price, validity:opt.validity||null, note:opt.note||null, paid:false, paidDate:null, startDate:fmt(new Date()), sessions:[] };
    setClientPkgs(prev=>({...prev,[clientName]:[...(prev[clientName]||[]),entry]}));
    setShowPkgModal(false);
    fire(`${t.packageAdded} ${clientName}!`);
  };

  const markPaid = (who, pkgId) => {
    setClientPkgs(prev=>({...prev,[who]:(prev[who]||[]).map(p=>p.id===pkgId?{...p,paid:true,paidDate:fmt(new Date())}:p)}));
    fire(t.paymentMarked);
  };

  const removePkg = (who, pkgId) => {
    setClientPkgs(prev=>({...prev,[who]:(prev[who]||[]).filter(p=>p.id!==pkgId)}));
    fire(t.packageRemoved,"warn");
  };

  const myBookingsList = () => DAYS.flatMap(d=>SCHEDULE[d].filter(s=>isBooked(d,s.time)).map(s=>({day:d,...s})));

  // ── SPLASH ────────────────────────────────────────────────────────
  if (!userName) return (
    <div style={S.root}>
      <div style={S.splash}>
        <div style={S.splashLogo}>
          <NoaLogo size={160} color="#9a6070"/>
          <div style={{fontSize:13,letterSpacing:8,color:"#9a6070",marginTop:6,fontFamily:"Georgia,serif"}}>PILATES</div>
        </div>
        <p style={S.splashSub}>ERICEIRA</p>

        {/* Language selector */}
        <div style={{display:"flex",gap:8,marginBottom:24}}>
          {["en","pt"].map(l=>(
            <button key={l} onClick={()=>setLang(l)} style={{
              padding:"7px 20px", borderRadius:20, fontSize:13,
              fontFamily:"Georgia,serif", cursor:"pointer",
              background: lang===l ? C.wine : "#fff",
              color: lang===l ? "#fff" : C.textMid,
              border: lang===l ? "none" : `1px solid ${C.border}`,
              fontWeight: lang===l ? "bold" : "normal",
            }}>
              {l==="en" ? "🇬🇧 English" : "🇵🇹 Português"}
            </button>
          ))}
        </div>

        <div style={S.splashCard}>
          <p style={{margin:"0 0 14px",fontSize:15,color:C.wine,textAlign:"center"}}>{t.whatsYourName}</p>
          <input value={nameInput} onChange={e=>setNameInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&nameInput.trim()&&setUserName(nameInput.trim())}
            placeholder={lang==="pt"?"O teu nome":"Your name"} style={S.nameInput} autoFocus/>
          <button onClick={()=>nameInput.trim()&&setUserName(nameInput.trim())} style={S.wineBtn}>{t.enter}</button>
        </div>
        <button onClick={()=>setUserName("__admin__")} style={S.ghostLink}>{t.studioAdmin}</button>
      </div>
      <style>{CSS}</style>
    </div>
  );

  // ── ADMIN ─────────────────────────────────────────────────────────
  if (isAdmin) return (
    <div style={S.root}>
      {toast&&<div style={S.toastStyle(toast.type)}>{toast.msg}</div>}
      <div style={S.header}>
        <div style={S.headerBrand}><NoaLogoBadge size={32}/><div><div style={S.brandName}>NOA PILATES</div><div style={S.brandCity}>{t.admin}</div></div></div>
        <button onClick={()=>setUserName("")} style={{...S.outlineBtn,fontSize:12}}>{t.exit}</button>
      </div>

      <div style={S.page}>
        {/* KPIs */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
          {[
            {lb:t.totalBookings,val:Object.values(bookings).reduce((a,v)=>a+v.length,0),c:C.wine},
            {lb:t.activePackages,val:Object.values(clientPkgs).flatMap(x=>x).filter(p=>p.qty?p.sessions.length<p.qty:true).length,c:C.blue},
            {lb:t.unpaidPackages,val:Object.values(clientPkgs).flatMap(x=>x).filter(p=>!p.paid).length,c:C.amber},
          ].map((k,i)=>(
            <div key={i} style={{...S.card,padding:"14px 16px",borderTop:`3px solid ${k.c}`}}>
              <div style={{fontSize:24,fontWeight:"bold",color:k.c}}>{k.val}</div>
              <div style={{fontSize:11,color:C.textLight,textTransform:"uppercase",letterSpacing:1,marginTop:4}}>{k.lb}</div>
            </div>
          ))}
        </div>

        {/* Add package for client */}
        <div style={{...S.card,padding:"14px 16px",marginBottom:24,borderLeft:`4px solid ${C.wine}`}}>
          <div style={{fontSize:13,fontWeight:"bold",color:C.wine,marginBottom:10}}>{ t.addPackageToClient }</div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
            <select value={selClientForPkg} onChange={e=>setSelClientForPkg(e.target.value)} style={{...S.nameInput,width:"auto",flex:1,textAlign:"left",padding:"8px 12px"}}>
              <option value="">{ t.selectClient }</option>
              {allClients().map(n=><option key={n} value={n}>{n}</option>)}
              <option value="__new__">{ t.newClientName }</option>
            </select>
            <button onClick={()=>{if(!selClientForPkg){fire("Select a client","warn");return;}setShowPkgModal(true);setPkgStep(1);}} style={{...S.wineBtn,padding:"9px 18px",fontSize:12}}>{ t.addPackage }
              + Add package
            </button>
          </div>
          {selClientForPkg==="__new__"&&(
            <input placeholder={t.typeClientName} style={{...S.nameInput,marginTop:10,textAlign:"left"}}
              onKeyDown={e=>{if(e.key==="Enter"&&e.target.value.trim()){setSelClientForPkg(e.target.value.trim());}}}/>
          )}
        </div>

        {/* Schedule with override */}
        <div style={S.sectionLabel}>${t.classBookings}</div>
        {DAYS.map(day=>(
          <div key={day} style={{marginBottom:18}}>
            <div style={S.adminDayHead}>{day}</div>
            {SCHEDULE[day].map((slot,i)=>{
              const att = (bookings[slotKey(day,slot.time)]||[]).map(b=>b.name);
              const left = spotsLeft(day,slot.time);
              const open = isOpen(day,slot.time);
              return (
                <div key={i} style={{...S.card,marginBottom:7,borderLeft:`4px solid ${att.length>0?C.wine:C.border}`,padding:"11px 14px"}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
                    <div style={{display:"flex",gap:10,alignItems:"flex-start",flex:1}}>
                      <div style={{flexShrink:0}}>
                        <div style={{fontSize:13,fontWeight:"bold",color:C.wine}}>{slot.time}</div>
                        <div style={{fontSize:10,color:open?C.green:C.red,marginTop:2}}>{open?"🟢 Open":"🔴 Locked"}</div>
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,color:C.text}}>{slot.name}{slot.tag&&<span style={{marginLeft:6,fontSize:11,color:C.textLight}}>✦ {slot.tag}</span>}</div>
                        <div style={{fontSize:11,color:C.textLight,marginTop:2}}>{deadlineLabelI18n(day,slot.time,lang)}</div>
                        {att.length>0
                          ? <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:6}}>
                              {att.map((n,j)=>(
                                <span key={j} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:12,fontSize:12,background:C.winePale,color:C.wine,border:`1px solid ${C.borderMid}`}}>
                                  {n}
                                  <button onClick={()=>cancelBooking(day,slot.time,n)} style={{background:"none",border:"none",color:C.textLight,cursor:"pointer",fontSize:13,padding:0,lineHeight:1}}>×</button>
                                </span>
                              ))}
                            </div>
                          : <div style={{fontSize:11,color:C.textLight,marginTop:4}}>{ t.noBookings }</div>
                        }
                      </div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:16,fontWeight:"bold",color:left===0?C.red:C.wine}}>{MAX_SPOTS(slot.name)-left}/{MAX_SPOTS(slot.name)}</div>
                      <div style={{fontSize:10,color:C.textLight,marginBottom:6}}>booked</div>
                      {/* Admin can always add a booking */}
                      <select onChange={e=>{if(e.target.value){const n=e.target.value;if(!isBooked(day,slot.time,n)&&spotsLeft(day,slot.time)>0){setBookings(prev=>({...prev,[slotKey(day,slot.time)]:[...(prev[slotKey(day,slot.time)]||[]),{name:n,ts:new Date().toISOString()}]}));fire(`${n} ${t.addedTo} ${slot.time}`);}else{fire(t.alreadyBookedOrFull,"warn");}e.target.value="";} }} style={{fontSize:11,padding:"4px 6px",borderRadius:8,border:`1px solid ${C.border}`,background:C.surfaceAlt,color:C.textMid,fontFamily:"Georgia,serif",cursor:"pointer"}}>
                        <option value="">{ t.addClient }</option>
                        {allClients().filter(n=>!isBooked(day,slot.time,n)).map(n=><option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:4,marginTop:8}}>
                    {Array.from({length:MAX_SPOTS(slot.name)}).map((_,j)=>(
                      <div key={j} style={{width:8,height:8,borderRadius:"50%",background:j<att.length?C.wine:C.border}}/>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Client packages */}
        <div style={{...S.sectionLabel,marginTop:8}}>{ t.clientPackages }</div>
        {Object.entries(clientPkgs).filter(([,pkgs])=>pkgs.length>0).length===0
          ? <div style={{...S.card,padding:24,textAlign:"center",color:C.textLight}}>{ t.noPackagesYet }</div>
          : Object.entries(clientPkgs).flatMap(([name,pkgs])=>pkgs.map(p=>({...p,cName:name}))).map((p,i)=>{
              const pkg = PACKAGES[p.pkgKey];
              const done = p.sessions.length;
              return (
                <div key={i} style={{...S.card,marginBottom:9,borderLeft:`4px solid ${pkg?.color||C.wine}`,padding:"11px 14px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,color:C.text}}><b>{p.cName}</b> · {pkg?.icon} {p.label}</div>
                      <div style={{fontSize:11,color:C.textLight,marginTop:2}}>{p.startDate}{p.validity?` · ${p.validity}`:""} · {done}{p.qty?`/${p.qty}`:""} sessions</div>
                      {p.qty&&(
                        <div style={{background:C.border,borderRadius:3,height:4,overflow:"hidden",marginTop:6,maxWidth:200}}>
                          <div style={{width:`${Math.min(100,done/p.qty*100)}%`,height:"100%",background:done>=p.qty?C.green:pkg.color,borderRadius:3}}/>
                        </div>
                      )}
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:15,fontWeight:"bold",color:p.paid?C.green:C.amber}}>€{p.price}</div>
                      <div style={{fontSize:11,color:p.paid?C.green:C.amber,marginBottom:6}}>{p.paid?`Paid ${p.paidDate}`:"Pending"}</div>
                      <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
                        {!p.paid&&<button onClick={()=>markPaid(p.cName,p.id)} style={{...S.greenBtn,fontSize:11,padding:"4px 10px"}}>{ t.markPaid }</button>}
                        <button onClick={()=>removePkg(p.cName,p.id)} style={{...S.outlineBtn,fontSize:11,padding:"4px 9px",color:C.red,borderColor:C.redBorder}}>{ t.remove }</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
        }
      </div>

      {/* Add Package Modal (admin) */}
      {showPkgModal&&(
        <div style={S.overlay} onClick={()=>setShowPkgModal(false)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <h3 style={{margin:0,fontSize:16,color:C.text}}>{pkgStep===1?"Choose type":"Choose option"}</h3>
              <button onClick={()=>setShowPkgModal(false)} style={{background:"none",border:"none",fontSize:20,color:C.textLight,cursor:"pointer"}}>×</button>
            </div>
            <p style={{margin:"0 0 16px",fontSize:12,color:C.textLight}}>{ t.for } <b style={{color:C.wine}}>{selClientForPkg}</b></p>
            {pkgStep===1&&(
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {Object.entries(PACKAGES).map(([key,pkg])=>(
                  <button key={key} onClick={()=>{setSelPkgKey(key);setSelOptId(getOpts(key)[0]?.id||"");setPkgStep(2);}} style={{padding:"12px 14px",borderRadius:10,textAlign:"left",background:C.surface,border:`1px solid ${C.border}`,cursor:"pointer",fontFamily:"Georgia,serif",display:"flex",alignItems:"center",justifyContent:"space-between"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=pkg.color;e.currentTarget.style.background=pkg.bg;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.surface;}}>
                    <span style={{fontSize:14,color:C.text}}><span style={{marginRight:8}}>{pkg.icon}</span>{pkg.label}</span>
                    <span style={{fontSize:12,color:C.textLight}}>→</span>
                  </button>
                ))}
              </div>
            )}
            {pkgStep===2&&(
              <div>
                <button onClick={()=>setPkgStep(1)} style={{background:"none",border:"none",color:C.textLight,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:12,marginBottom:14,padding:0}}>{ t.back }</button>
                <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:18}}>
                  {PACKAGES[selPkgKey].groups
                    ? PACKAGES[selPkgKey].groups.map(g=>(
                        <div key={g.name}>
                          <div style={{fontSize:11,color:C.textLight,textTransform:"uppercase",letterSpacing:1,marginBottom:7,marginTop:6}}>{g.name}</div>
                          {g.opts.map(o=>(
                            <button key={o.id} onClick={()=>setSelOptId(o.id)} style={{width:"100%",padding:"10px 14px",borderRadius:9,textAlign:"left",marginBottom:5,background:selOptId===o.id?PACKAGES[selPkgKey].bg:C.surface,border:`1px solid ${selOptId===o.id?PACKAGES[selPkgKey].border:C.border}`,cursor:"pointer",fontFamily:"Georgia,serif",display:"flex",justifyContent:"space-between"}}>
                              <span style={{fontSize:13,color:selOptId===o.id?PACKAGES[selPkgKey].color:C.text}}>{o.label}</span>
                              <span style={{fontSize:14,fontWeight:"bold",color:selOptId===o.id?PACKAGES[selPkgKey].color:C.textMid}}>€{o.price}</span>
                            </button>
                          ))}
                        </div>
                      ))
                    : getOpts(selPkgKey).map(o=>(
                        <button key={o.id} onClick={()=>setSelOptId(o.id)} style={{padding:"11px 14px",borderRadius:9,textAlign:"left",background:selOptId===o.id?PACKAGES[selPkgKey].bg:C.surface,border:`1px solid ${selOptId===o.id?PACKAGES[selPkgKey].border:C.border}`,cursor:"pointer",fontFamily:"Georgia,serif",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div>
                            <div style={{fontSize:13,color:selOptId===o.id?PACKAGES[selPkgKey].color:C.text}}>{o.label}</div>
                            {(o.validity||o.note)&&<div style={{fontSize:11,color:C.textLight,marginTop:2}}>{[o.validity,o.note].filter(Boolean).join(" · ")}</div>}
                          </div>
                          <span style={{fontSize:15,fontWeight:"bold",color:selOptId===o.id?PACKAGES[selPkgKey].color:C.textMid}}>€{o.price}</span>
                        </button>
                      ))
                  }
                </div>
                <button onClick={addPackage} style={{...S.wineBtn,width:"100%",padding:"12px",borderRadius:12}}>{ t.confirmPackage }</button>
              </div>
            )}
          </div>
        </div>
      )}
      <style>{CSS}</style>
    </div>
  );

  // ── CLIENT APP ────────────────────────────────────────────────────
  return (
    <div style={S.root}>
      {toast&&<div style={S.toastStyle(toast.type)}>{toast.msg}</div>}

      <div style={S.header}>
        <div style={S.headerBrand}>
          <NoaLogoBadge size={32}/>
          <div><div style={S.brandName}>NOA PILATES</div><div style={S.brandCity}>ERICEIRA</div></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={S.userPill}><span style={S.dot}/>{userName}</div>
          <button onClick={()=>setLang(l=>l==="en"?"pt":"en")} style={{...S.ghostLink,fontSize:11,margin:0}}>
            {lang==="en"?"🇵🇹 PT":"🇬🇧 EN"}
          </button>
          <button onClick={()=>setUserName("")} style={{...S.ghostLink,fontSize:11,margin:0}}>{t.change}</button>
        </div>
      </div>

      <div style={S.nav}>
        {[["book",t.classes],["packages",t.package],["profile",t.profile]].map(([v,lb])=>(
          <button key={v} onClick={()=>setTab(v)} style={{...S.navBtn,borderBottom:tab===v?`2px solid ${C.wine}`:"2px solid transparent",color:tab===v?C.wine:C.textMid,fontWeight:tab===v?"bold":"normal"}}>{lb}</button>
        ))}
      </div>

      <div style={S.page}>

        {/* ── BOOK ──────────────────────────────────────────────── */}
        {tab==="book"&&(
          <div>
            {activePkg()&&(()=>{
              const p=activePkg(); const pkg=PACKAGES[p.pkgKey];
              return (
                <div style={{...S.card,marginBottom:16,borderLeft:`4px solid ${pkg.color}`,padding:"11px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:11,color:C.textLight,textTransform:"uppercase",letterSpacing:1}}>{ t.activePackage }</div>
                    <div style={{fontSize:14,color:pkg.color,marginTop:2}}>{pkg.icon} {p.label}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:13,fontWeight:"bold",color:pkg.color}}>{p.sessions.length}{p.qty?`/${p.qty}`:""} sessions</div>
                    <div style={{fontSize:11,color:C.textLight}}>{ t.autoLogged }</div>
                  </div>
                </div>
              );
            })()}

            {/* Day tabs */}
            <div style={{display:"flex",gap:7,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
              {DAYS.map(day=>{
                const hasMine = SCHEDULE[day].some(s=>isBooked(day,s.time));
                return (
                  <button key={day} onClick={()=>setSelectedDay(day)} style={{flexShrink:0,padding:"8px 14px",borderRadius:20,fontSize:12,fontFamily:"Georgia,serif",cursor:"pointer",background:selectedDay===day?C.wine:"#fff",color:selectedDay===day?"#fff":C.textMid,border:selectedDay===day?"none":`1px solid ${C.border}`,fontWeight:selectedDay===day?"bold":"normal",position:"relative"}}>
                    {t.dayShort[day]}
                    {hasMine&&<span style={{position:"absolute",top:3,right:3,width:5,height:5,borderRadius:"50%",background:C.green}}/>}
                  </button>
                );
              })}
            </div>

            <div style={{fontSize:15,color:C.wine,fontWeight:"bold",marginBottom:13,letterSpacing:1}}>
              {t.days[selectedDay]} <span style={{fontSize:12,color:C.textLight,fontWeight:"normal",letterSpacing:0}}>· {t.month}</span>
            </div>

            {SCHEDULE[selectedDay].map((slot,i)=>{
              const left = spotsLeft(selectedDay,slot.time);
              const booked = isBooked(selectedDay,slot.time);
              const full = left===0&&!booked;
              const open = isOpen(selectedDay,slot.time);
              const locked = !open&&!booked; // can't book anymore
              const cs = CLASS_STYLE[slot.name]||CLASS_STYLE.Reformer;
              const ts = slot.tag?(TAG_STYLE[slot.tag]||{}):null;
              return (
                <div key={i} style={{...S.card,marginBottom:10,borderLeft:`4px solid ${booked?C.green:full||locked?C.borderMid:cs.color}`,opacity:(full||locked)&&!booked?.6:1,animation:`fadeUp .28s ease ${i*.07}s both`}}>
                  <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px"}}>
                    <div style={{width:44,flexShrink:0,fontSize:15,fontWeight:"bold",color:booked?C.green:locked?C.textLight:cs.color}}>{slot.time}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                        <span style={{fontSize:14,color:C.text}}>{slot.name}</span>
                        {slot.tag&&<span style={{...S.pill,background:ts.bg,color:ts.color,border:`1px solid ${ts.border}`}}>✦ {slot.tag}</span>}
                      </div>
                      <div style={{display:"flex",gap:8,marginTop:5,alignItems:"center",flexWrap:"wrap"}}>
                        <span style={{fontSize:11,color:C.textLight}}>⏱ {slot.tag==="Mom & Baby" ? t.momBabyDuration : t.oneHour}</span>
                        {/* Status pill */}
                        <span style={{...S.pill,background:booked?C.greenPale:locked?C.redPale:full?C.redPale:left<=2?C.amberPale:C.surfaceAlt,color:booked?C.green:locked?C.red:full?C.red:left<=2?C.amber:C.textLight,border:`1px solid ${booked?C.greenBorder:locked?C.redBorder:full?C.redBorder:left<=2?C.amberBorder:C.border}`}}>
                          {booked?t.booked:locked?t.closed:full?"Full":`${left} ${t.left}`}
                        </span>
                        {/* Deadline hint for open classes not yet booked */}
                        {!booked&&open&&!full&&(
                          <span style={{fontSize:10,color:C.textLight}}>{deadlineLabelI18n(selectedDay,slot.time,lang)}</span>
                        )}
                      </div>
                    </div>
                    <div style={{flexShrink:0}}>
                      {booked
                        ? open
                          ? <button onClick={()=>cancelBooking(selectedDay,slot.time)} style={S.cancelBtn}>{ t.cancel }</button>
                          : <span style={{...S.pill,background:C.amberPale,color:C.amber,border:`1px solid ${C.amberBorder}`,padding:"5px 10px"}}>🔒 Locked</span>
                        : <button onClick={()=>bookClass(selectedDay,slot)} disabled={full||locked} style={{...S.bookBtn,opacity:full||locked?.4:1,cursor:full||locked?"not-allowed":"pointer"}}>{full? t.full : locked ? t.closed : t.book}</button>
                      }
                    </div>
                  </div>
                  {/* Spot dots */}
                  <div style={{display:"flex",gap:5,padding:"0 16px 12px",alignItems:"center"}}>
                    {Array.from({length:MAX_SPOTS(slot.name)}).map((_,j)=>(
                      <div key={j} style={{width:8,height:8,borderRadius:"50%",background:j<(MAX_SPOTS(slot.name)-left)?(booked?C.green:C.wine):C.border}}/>
                    ))}
                    <span style={{fontSize:10,color:C.textLight,marginLeft:4}}>{left} left</span>
                  </div>
                </div>
              );
            })}

            <div style={S.notes}>
              <div style={S.noteItem}>{ t.note1 }</div>
              <div style={S.noteItem}>{ t.note2 }</div>
              <div style={S.noteItem}>{ t.note3 }</div>
              <div style={S.noteItem}>{ t.note4 }</div>
            </div>
          </div>
        )}

        {/* ── PACKAGES ──────────────────────────────────────────── */}
        {tab==="packages"&&(
          <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <h2 style={S.pageTitle}>{ t.myPackage }/h2>
            </div>

            {myPkgs().length===0
              ? <div style={{...S.card,padding:36,textAlign:"center"}}>
                  <div style={{fontSize:36,marginBottom:10}}>📦</div>
                  <div style={{fontSize:14,color:C.textMid,marginBottom:8}}>{ t.noPackageTitle }</div>
                  <div style={{fontSize:13,color:C.textLight,lineHeight:1.6}}>{ t.noPackageDesc }</div>
                </div>
              : myPkgs().map((p,i)=>{
                  const pkg=PACKAGES[p.pkgKey];
                  const done=p.sessions.length;
                  const finished=p.qty?done>=p.qty:false;
                  return (
                    <div key={i} style={{...S.card,marginBottom:14,borderLeft:`4px solid ${pkg.color}`,animation:`fadeUp .28s ease ${i*.07}s both`}}>
                      <div style={{padding:"14px 16px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                          <div>
                            <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
                              <span style={{...S.pill,background:pkg.bg,color:pkg.color,border:`1px solid ${pkg.border}`}}>{pkg.icon} {pkg.label}</span>
                              {finished&&<span style={{...S.pill,background:C.greenPale,color:C.green,border:`1px solid ${C.greenBorder}`}}>{ t.done }</span>}
                              {!p.paid&&<span style={{...S.pill,background:C.amberPale,color:C.amber,border:`1px solid ${C.amberBorder}`}}>{ t.unpaid }</span>}
                            </div>
                            <div style={{fontSize:13,color:C.text,marginTop:6}}>{p.label}</div>
                            <div style={{fontSize:11,color:C.textLight,marginTop:2}}>Started {p.startDate}{p.validity?` · ${p.validity}`:""}</div>
                          </div>
                          <div style={{textAlign:"right",flexShrink:0}}>
                            <div style={{fontSize:20,fontWeight:"bold",color:pkg.color}}>€{p.price}</div>
                            <div style={{fontSize:11,color:p.paid?C.green:C.amber}}>{p.paid?`Paid ${p.paidDate}`:"{ t.pendingPayment }"}</div>
                          </div>
                        </div>
                        {p.qty&&(
                          <div style={{marginBottom:8}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                              <span style={{fontSize:12,color:C.textMid}}>{done}/{p.qty} { t.sessionsDone }</span>
                              <span style={{fontSize:12,color:!finished&&p.qty-done<=2?C.red:C.textLight}}>{finished?"Completed":`${p.qty-done} ${t.sessionsRemaining}`}</span>
                            </div>
                            <div style={{background:C.border,borderRadius:4,height:6,overflow:"hidden"}}>
                              <div style={{width:`${Math.min(100,done/p.qty*100)}%`,height:"100%",background:finished?C.green:pkg.color,borderRadius:4,transition:"width .4s"}}/>
                            </div>
                          </div>
                        )}
                      </div>
                      {p.sessions.length>0&&(
                        <div style={{borderTop:`1px solid ${C.border}`,padding:"10px 16px"}}>
                          <div style={{fontSize:11,color:C.textLight,textTransform:"uppercase",letterSpacing:1,marginBottom:7}}>{ t.sessionsLog }</div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                            {p.sessions.map((s,j)=>(
                              <span key={j} style={{...S.pill,background:C.surfaceAlt,color:C.textMid,border:`1px solid ${C.border}`}}>
                                {j+1}. {s.date} <span style={{opacity:.6}}>({s.class})</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
            }

            {/* Price list for reference */}
            <div style={{marginTop:24}}>
              <div style={S.sectionLabel}>{ t.availablePackages }</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:11}}>
                {Object.entries(PACKAGES).map(([key,pkg])=>(
                  <div key={key} style={{...S.card,borderTop:`3px solid ${pkg.color}`,padding:"13px 15px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:9}}>
                      <span style={{fontSize:16}}>{pkg.icon}</span>
                      <span style={{fontSize:12,color:pkg.color,fontWeight:"bold"}}>{pkg.label}</span>
                    </div>
                    {pkg.groups
                      ? pkg.groups.map(g=>(
                          <div key={g.name} style={{marginBottom:9}}>
                            <div style={{fontSize:11,color:C.textLight,marginBottom:4}}>{g.name}</div>
                            {g.opts.map(o=>(
                              <div key={o.id} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:`1px solid ${C.border}`}}>
                                <span style={{fontSize:12,color:C.text}}>{o.label}</span>
                                <span style={{fontSize:12,fontWeight:"bold",color:pkg.color}}>€{o.price}</span>
                              </div>
                            ))}
                          </div>
                        ))
                      : pkg.opts.map(o=>(
                          <div key={o.id} style={{padding:"4px 0",borderBottom:`1px solid ${C.border}`}}>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                              <span style={{fontSize:12,color:C.text}}>{o.label}</span>
                              <span style={{fontSize:12,fontWeight:"bold",color:pkg.color}}>€{o.price}</span>
                            </div>
                            {(o.validity||o.note)&&<div style={{fontSize:11,color:C.textLight,marginTop:1}}>{[o.validity,o.note].filter(Boolean).join(" · ")}</div>}
                          </div>
                        ))
                    }
                  </div>
                ))}
              </div>
              <p style={{fontSize:12,color:C.textLight,marginTop:12,textAlign:"center"}}>{ t.contactStudio }</p>
            </div>
          </div>
        )}

        {/* ── PROFILE ───────────────────────────────────────────── */}
        {tab==="profile"&&(
          <div>
            <div style={{...S.card,padding:"18px 18px",marginBottom:18,display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:50,height:50,borderRadius:"50%",background:`linear-gradient(135deg,${C.wineLight},${C.wine})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"#fff",fontWeight:"bold",flexShrink:0}}>
                {userName.slice(0,2).toUpperCase()}
              </div>
              <div>
                <div style={{fontSize:17,color:C.text,fontWeight:"bold"}}>{userName}</div>
                <div style={{fontSize:12,color:C.textLight,marginTop:3}}>{myBookingsList().length} upcoming · {myPkgs().length} package{myPkgs().length!==1?"s":""}</div>
              </div>
            </div>

            <div style={S.sectionLabel}>{ t.upcoming }</div>
            {myBookingsList().length===0
              ? <div style={{...S.card,padding:20,textAlign:"center",color:C.textLight,marginBottom:18}}>{ t.noClassesBooked }</div>
              : myBookingsList().map((slot,i)=>{
                  const open = isOpen(slot.day,slot.time);
                  return (
                    <div key={i} style={{...S.card,marginBottom:9,borderLeft:`4px solid ${C.green}`,animation:`fadeUp .28s ease ${i*.07}s both`}}>
                      <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 15px"}}>
                        <div style={{width:44,fontSize:14,fontWeight:"bold",color:C.green,flexShrink:0}}>{slot.time}</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:14,color:C.text}}>{slot.name}</div>
                          <div style={{fontSize:12,color:C.textLight,marginTop:2}}>{slot.day} · {t.month}</div>
                        </div>
                        {open
                          ? <button onClick={()=>cancelBooking(slot.day,slot.time)} style={S.cancelBtn}>{ t.cancel }</button>
                          : <span style={{...S.pill,background:C.amberPale,color:C.amber,border:`1px solid ${C.amberBorder}`,padding:"5px 10px"}}>🔒 Locked</span>
                        }
                      </div>
                    </div>
                  );
                })
            }

            <div style={{...S.sectionLabel,marginTop:18}}>{ t.myPackages }</div>
            {myPkgs().length===0
              ? <div style={{...S.card,padding:18,textAlign:"center",color:C.textLight}}>{ t.noPackagesContact }</div>
              : myPkgs().map((p,i)=>{
                  const pkg=PACKAGES[p.pkgKey];
                  return (
                    <div key={i} style={{...S.card,marginBottom:9,borderLeft:`4px solid ${pkg.color}`,padding:"11px 15px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <div style={{fontSize:13,color:C.text}}>{pkg.icon} {p.label}</div>
                          <div style={{fontSize:11,color:C.textLight,marginTop:2}}>{p.sessions.length}{p.qty?`/${p.qty}`:""} sessions · started {p.startDate}</div>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontSize:14,fontWeight:"bold",color:p.paid?C.green:C.amber}}>€{p.price}</div>
                          <div style={{fontSize:11,color:p.paid?C.green:C.amber}}>{p.paid?"Paid":"Pending"}</div>
                        </div>
                      </div>
                      {p.qty&&(
                        <div style={{background:C.border,borderRadius:3,height:4,overflow:"hidden",marginTop:8}}>
                          <div style={{width:`${Math.min(100,p.sessions.length/p.qty*100)}%`,height:"100%",background:pkg.color,borderRadius:3}}/>
                        </div>
                      )}
                    </div>
                  );
                })
            }
          </div>
        )}
      </div>

      {/* Admin FAB */}
      <button onClick={()=>setUserName("__admin__")} style={S.fab} title="Admin">⚙</button>
      <style>{CSS}</style>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────
const S = {
  root:       { minHeight:"100vh", background:"#f5f0eb", color:"#3d1f28", fontFamily:"Georgia,'Times New Roman',serif" },
  splash:     { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", padding:24 },
  splashLogo: { display:"flex", flexDirection:"column", alignItems:"center", marginBottom:10 },
  splashSub:  { fontSize:11, letterSpacing:5, color:"#b09090", margin:"0 0 26px" },
  splashCard: { background:"#fff", borderRadius:16, padding:"26px 26px", boxShadow:"0 4px 24px rgba(92,45,58,.1)", border:"1px solid #e8d8dc", width:"100%", maxWidth:310, display:"flex", flexDirection:"column", gap:11 },
  nameInput:  { padding:"11px 14px", borderRadius:10, fontSize:15, border:"1px solid #e0d0d4", background:"#faf7f4", color:"#3d1f28", fontFamily:"Georgia,serif", outline:"none", textAlign:"center", width:"100%", boxSizing:"border-box" },
  wineBtn:    { padding:"11px 22px", borderRadius:24, fontSize:13, background:"linear-gradient(135deg,#5c2d3a,#9a4a5a)", border:"none", color:"#fff", cursor:"pointer", fontFamily:"Georgia,serif", letterSpacing:1, boxShadow:"0 3px 12px rgba(92,45,58,.2)" },
  greenBtn:   { padding:"9px 18px", borderRadius:20, fontSize:13, background:"linear-gradient(135deg,#3a6040,#5a8a6a)", border:"none", color:"#fff", cursor:"pointer", fontFamily:"Georgia,serif" },
  outlineBtn: { padding:"8px 14px", borderRadius:20, fontSize:13, background:"none", border:"1px solid #e8d8dc", color:"#7a4a55", cursor:"pointer", fontFamily:"Georgia,serif" },
  ghostLink:  { background:"none", border:"none", color:"#c4a0a8", fontSize:12, cursor:"pointer", fontFamily:"Georgia,serif", textDecoration:"underline", marginTop:14 },
  header:     { background:"#fff", borderBottom:"1px solid #e8d8dc", padding:"13px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 6px rgba(92,45,58,.07)" },
  headerBrand:{ display:"flex", alignItems:"center", gap:10 },
  brandName:  { fontSize:14, fontWeight:"bold", letterSpacing:2, color:"#3d1f28" },
  brandCity:  { fontSize:8, letterSpacing:3, color:"#c4a0a8" },
  userPill:   { display:"flex", alignItems:"center", gap:6, padding:"5px 12px", borderRadius:20, background:"#f5edef", color:"#5c2d3a", fontSize:12, border:"1px solid #e8d8dc" },
  dot:        { width:6, height:6, borderRadius:"50%", background:"#4a7a5a", flexShrink:0 },
  nav:        { background:"#fff", borderBottom:"1px solid #e8d8dc", display:"flex", padding:"0 18px" },
  navBtn:     { padding:"12px 14px", fontSize:13, background:"none", border:"none", borderBottom:"2px solid transparent", cursor:"pointer", fontFamily:"Georgia,serif", whiteSpace:"nowrap" },
  page:       { maxWidth:680, margin:"0 auto", padding:"20px 14px" },
  pageTitle:  { margin:"0 0 4px", fontSize:18, fontWeight:"normal", color:"#3d1f28" },
  card:       { background:"#fff", border:"1px solid #e8d8dc", borderRadius:12, boxShadow:"0 1px 4px rgba(92,45,58,.05)", overflow:"hidden" },
  pill:       { display:"inline-flex", alignItems:"center", gap:4, padding:"2px 9px", borderRadius:10, fontSize:11 },
  bookBtn:    { padding:"8px 16px", borderRadius:16, fontSize:13, background:"linear-gradient(135deg,#5c2d3a,#9a4a5a)", border:"none", color:"#fff", cursor:"pointer", fontFamily:"Georgia,serif", whiteSpace:"nowrap" },
  cancelBtn:  { padding:"7px 13px", borderRadius:16, fontSize:12, background:"none", border:"1px solid #e8d8dc", color:"#9a4a55", cursor:"pointer", fontFamily:"Georgia,serif", whiteSpace:"nowrap" },
  sectionLabel:{ fontSize:11, color:"#b09090", textTransform:"uppercase", letterSpacing:2, marginBottom:9, marginTop:4 },
  notes:      { marginTop:16, padding:"13px 15px", background:"#fff", borderRadius:10, border:"1px solid #e8d8dc" },
  noteItem:   { fontSize:12, color:"#9a7080", marginBottom:5, lineHeight:1.5 },
  adminDayHead:{ fontSize:11, fontWeight:"bold", color:"#5c2d3a", textTransform:"uppercase", letterSpacing:2, padding:"7px 0 5px", borderBottom:"1px solid #e8d8dc", marginBottom:8 },
  overlay:    { position:"fixed", inset:0, background:"rgba(61,31,40,.4)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:1000 },
  modal:      { background:"#fff", borderRadius:"20px 20px 0 0", padding:"22px 20px 32px", width:"100%", maxWidth:480, maxHeight:"88vh", overflowY:"auto", boxShadow:"0 -8px 40px rgba(92,45,58,.18)" },
  fab:        { position:"fixed", bottom:20, right:16, width:38, height:38, borderRadius:"50%", background:"#fff", border:"1px solid #e8d8dc", color:"#c4a0a8", fontSize:17, cursor:"pointer", boxShadow:"0 2px 10px rgba(92,45,58,.12)", display:"flex", alignItems:"center", justifyContent:"center" },
  toastStyle: type => ({ position:"fixed", top:14, left:"50%", transform:"translateX(-50%)", zIndex:9999, padding:"9px 20px", borderRadius:24, whiteSpace:"nowrap", background:type==="warn"?"#f5e8e8":"#edf5f0", border:`1px solid ${type==="warn"?"#d4a0a0":"#b0d4bc"}`, color:type==="warn"?"#8a2828":"#4a7a5a", fontSize:13, boxShadow:"0 4px 20px rgba(92,45,58,.12)", animation:"slideDown .2s ease", fontFamily:"Georgia,serif" }),
};

const CSS = `
  @keyframes fadeUp    { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
  @keyframes slideDown { from { opacity:0; transform:translateX(-50%) translateY(-8px) } to { opacity:1; transform:translateX(-50%) translateY(0) } }
  * { box-sizing:border-box; }
  button { transition:opacity .15s; }
  button:hover { opacity:.85; }
  input:focus { border-color:#9a4a5a !important; box-shadow:0 0 0 3px rgba(154,74,90,.1) !important; }
  ::-webkit-scrollbar { width:4px; height:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:#e0cece; border-radius:4px; }
`;
