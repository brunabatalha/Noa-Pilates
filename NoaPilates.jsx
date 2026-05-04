import { useState, useEffect } from "react";

// ── ADMIN CREDENTIALS ─────────────────────────────────────────────────
const ADMIN_EMAIL = "admin@noapilates.pt";
const ADMIN_PASSWORD = "noa2026";

// ── LOGO ──────────────────────────────────────────────────────────────
const NoaLogo = ({ size = 32, color = "#9a6070" }) => (
  <svg width={size} height={size * 0.55} viewBox="0 0 120 66" fill="none">
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

// ── PALETTE ───────────────────────────────────────────────────────────
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

// ── TRANSLATIONS ─────────────────────────────────────────────────────
const T = {
  en: {
    welcome:"Welcome", signIn:"Sign in", signUp:"Create account", or:"or",
    name:"Full name", username:"Username", email:"Email", phone:"Phone (optional)", password:"Password",
    confirmPassword:"Confirm password",
    haveAccount:"Already have an account? Sign in",
    noAccount:"Don't have an account? Sign up",
    forgotPassword:"Forgot password?",
    resetPassword:"Reset Password",
    enterEmailReset:"Enter your email to receive a reset link",
    sendResetLink:"Send reset link",
    resetLinkSent:"Reset link generated! Check below:",
    resetLinkInstructions:"In a real deployment this would be sent to your email. For now, click the link below to reset your password:",
    copyLink:"Copy link",
    linkCopied:"Link copied!",
    backToLogin:"← Back to login",
    newPassword:"New password",
    confirmNewPassword:"Confirm new password",
    updatePassword:"Update password",
    passwordUpdated:"Password updated! Please sign in.",
    invalidResetToken:"Invalid or expired reset link",
    emailNotFound:"No account found with this email",
    enter:"Enter →", create:"Create account", studioAdmin:"Studio admin ↗",
    backToClient:"← Back to client login",
    classes:"🗓 Classes", package:"📦 Package", profile:"👤 Profile",
    logout:"Logout",
    days:{Monday:"Monday",Tuesday:"Tuesday",Wednesday:"Wednesday",Thursday:"Thursday",Friday:"Friday",Sunday:"Sunday"},
    dayShort:{Monday:"MON",Tuesday:"TUE",Wednesday:"WED",Thursday:"THU",Friday:"FRI",Sunday:"SUN"},
    monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],
    activePackage:"Active Package", autoLogged:"Auto-logged on book",
    sessions:"sessions", book:"Book", cancel:"Cancel", full:"Full", closed:"Closed",
    booked:"✓ Booked", locked:"🔒 Locked", left:"left",
    oneHour:"1h", momBabyDuration:"1h (45min)",
    openUntil:"Open until", at:"at",
    note1:"📌 All regular classes are suitable for all levels.",
    note2:"🌅 Morning classes: cancel by 16:00 the day before.",
    note3:"🌆 Evening classes: cancel at least 24 hours before.",
    note4:"🔒 After deadline, only the studio can change bookings.",
    myPackage:"My Package",
    noPackageTitle:"No package yet",
    noPackageDesc:"Ask the studio to assign a package to your account.",
    sessionsDone:"sessions used", sessionsRemaining:"remaining",
    completed:"Completed", unpaid:"Unpaid", started:"Started",
    pendingPayment:"Pending payment", paid:"Paid", pending:"Pending", done:"✓ Done",
    sessionsLog:"Sessions", availablePackages:"Available Packages",
    contactStudio:"To purchase a package, contact the studio.",
    upcoming:"Upcoming Classes", noClassesBooked:"No classes booked",
    myPackages:"My Packages", noPackagesContact:"No packages — contact the studio",
    myProfile:"My Profile", contactInfo:"Contact info",
    bookingClosed:"Booking closed — deadline passed",
    classFull:"Class is full!", alreadyBooked:"Already booked!",
    cancellationClosed:"Cancellation closed — deadline passed",
    bookingCancelled:"Booking cancelled",
    bookedAnd:"Booked & logged to", paymentMarked:"Payment marked ✓",
    packageRemoved:"Package removed",
    invalidLogin:"Invalid email or password",
    emailExists:"This email is already registered",
    usernameExists:"Username already taken",
    fillAllFields:"Please fill all fields",
    passwordsMatch:"Passwords don't match",
    passwordMinLength:"Password must be at least 4 characters",
    accountCreated:"Account created! Welcome",
    welcomeBack:"Welcome back",
    admin:"ADMIN", exit:"← Exit",
    adminLogin:"Admin Login", adminEmail:"Admin email", adminPassword:"Admin password",
    invalidAdmin:"Invalid admin credentials",
    totalBookings:"Total bookings", activePackages:"Active packages",
    unpaidPackages:"Unpaid packages", totalClients:"Total clients",
    addPackageToClient:"📦 Add Package to Client",
    selectClient:"— Select client —", addPackage:"+ Add package",
    classBookings:"Class Bookings", clientsTab:"Clients",
    open:"🟢 Open", lockedAdmin:"🔴 Locked",
    noBookings:"No bookings", addClient:"+ Add client",
    clientPackages:"Client Packages", noPackagesYet:"No packages yet",
    markPaid:"Mark paid", remove:"Remove",
    chooseType:"Choose type", chooseOption:"Choose option",
    forClient:"For:", back:"← Back", confirmPackage:"Confirm Package",
    alreadyBookedOrFull:"Already booked or full",
    addedTo:"added to", packageAdded:"Package added for",
    allClients:"All Clients", clientDetails:"Client Details",
    joined:"Joined", noClientsYet:"No clients registered yet",
    bookings:"bookings", packages:"packages",
    passwordManagement:"Password Management",
    generateResetLink:"Generate reset link",
    setNewPassword:"Set new password",
    resetLinkGenerated:"Reset link generated! Copy it below:",
    enterNewPassword:"Enter new password",
    passwordSet:"Password updated for",
    confirmSetPassword:"Set Password",
    cancelAction:"Cancel",
  },
  pt: {
    welcome:"Bem-vinda", signIn:"Entrar", signUp:"Criar conta", or:"ou",
    name:"Nome completo", username:"Nome de utilizador", email:"Email", phone:"Telefone (opcional)", password:"Palavra-passe",
    confirmPassword:"Confirmar palavra-passe",
    haveAccount:"Já tens conta? Entrar",
    noAccount:"Não tens conta? Criar",
    forgotPassword:"Esqueceste a palavra-passe?",
    resetPassword:"Redefinir Palavra-passe",
    enterEmailReset:"Insere o teu email para receber um link de redefinição",
    sendResetLink:"Enviar link",
    resetLinkSent:"Link gerado! Consulta abaixo:",
    resetLinkInstructions:"Numa aplicação real este link seria enviado por email. Por agora, clica no link abaixo para redefinir a palavra-passe:",
    copyLink:"Copiar link",
    linkCopied:"Link copiado!",
    backToLogin:"← Voltar ao login",
    newPassword:"Nova palavra-passe",
    confirmNewPassword:"Confirmar nova palavra-passe",
    updatePassword:"Atualizar palavra-passe",
    passwordUpdated:"Palavra-passe atualizada! Faz login.",
    invalidResetToken:"Link inválido ou expirado",
    emailNotFound:"Não existe conta com este email",
    enter:"Entrar →", create:"Criar conta", studioAdmin:"Admin do estúdio ↗",
    backToClient:"← Voltar ao login de cliente",
    classes:"🗓 Aulas", package:"📦 Pacote", profile:"👤 Perfil",
    logout:"Sair",
    days:{Monday:"Segunda",Tuesday:"Terça",Wednesday:"Quarta",Thursday:"Quinta",Friday:"Sexta",Sunday:"Domingo"},
    dayShort:{Monday:"SEG",Tuesday:"TER",Wednesday:"QUA",Thursday:"QUI",Friday:"SEX",Sunday:"DOM"},
    monthNames:["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],
    activePackage:"Pacote Ativo", autoLogged:"Aula registada automaticamente",
    sessions:"sessões", book:"Marcar", cancel:"Cancelar", full:"Cheio", closed:"Fechado",
    booked:"✓ Marcado", locked:"🔒 Bloqueado", left:"livres",
    oneHour:"1h", momBabyDuration:"1h (45min)",
    openUntil:"Aberto até", at:"às",
    note1:"📌 Todas as aulas são adequadas para todos os níveis.",
    note2:"🌅 Aulas da manhã: cancela até às 16h do dia anterior.",
    note3:"🌆 Aulas da tarde/noite: cancelar com 24h de antecedência.",
    note4:"🔒 Após o prazo, só o estúdio pode alterar as marcações.",
    myPackage:"O Meu Pacote",
    noPackageTitle:"Sem pacote",
    noPackageDesc:"Pede ao estúdio para atribuir um pacote à tua conta.",
    sessionsDone:"sessões usadas", sessionsRemaining:"restantes",
    completed:"Concluído", unpaid:"Por pagar", started:"Início",
    pendingPayment:"Pagamento pendente", paid:"Pago", pending:"Pendente", done:"✓ Feito",
    sessionsLog:"Sessões", availablePackages:"Pacotes Disponíveis",
    contactStudio:"Para comprar um pacote, contacta o estúdio.",
    upcoming:"Próximas Aulas", noClassesBooked:"Sem aulas marcadas",
    myPackages:"Os Meus Pacotes", noPackagesContact:"Sem pacotes — contacta o estúdio",
    myProfile:"O Meu Perfil", contactInfo:"Informação de contacto",
    bookingClosed:"Marcação fechada — prazo ultrapassado",
    classFull:"Aula cheia!", alreadyBooked:"Já marcado!",
    cancellationClosed:"Cancelamento fechado — prazo ultrapassado",
    bookingCancelled:"Marcação cancelada",
    bookedAnd:"Marcado e registado em", paymentMarked:"Pagamento registado ✓",
    packageRemoved:"Pacote removido",
    invalidLogin:"Email ou palavra-passe incorretos",
    emailExists:"Este email já está registado",
    usernameExists:"Nome de utilizador já existe",
    fillAllFields:"Preenche todos os campos",
    passwordsMatch:"As palavras-passe não coincidem",
    passwordMinLength:"A palavra-passe deve ter pelo menos 4 caracteres",
    accountCreated:"Conta criada! Bem-vinda",
    welcomeBack:"Bem-vinda de volta",
    admin:"ADMIN", exit:"← Sair",
    adminLogin:"Login Admin", adminEmail:"Email admin", adminPassword:"Palavra-passe admin",
    invalidAdmin:"Credenciais admin incorretas",
    totalBookings:"Total marcações", activePackages:"Pacotes ativos",
    unpaidPackages:"Pacotes por pagar", totalClients:"Total clientes",
    addPackageToClient:"📦 Adicionar Pacote a Cliente",
    selectClient:"— Selecionar cliente —", addPackage:"+ Adicionar pacote",
    classBookings:"Marcações de Aulas", clientsTab:"Clientes",
    open:"🟢 Aberto", lockedAdmin:"🔴 Bloqueado",
    noBookings:"Sem marcações", addClient:"+ Adicionar cliente",
    clientPackages:"Pacotes de Clientes", noPackagesYet:"Sem pacotes ainda",
    markPaid:"Marcar pago", remove:"Remover",
    chooseType:"Escolher tipo", chooseOption:"Escolher opção",
    forClient:"Para:", back:"← Voltar", confirmPackage:"Confirmar Pacote",
    alreadyBookedOrFull:"Já marcado ou sem lugares",
    addedTo:"adicionado a", packageAdded:"Pacote adicionado para",
    allClients:"Todas as Clientes", clientDetails:"Detalhes da Cliente",
    joined:"Registo", noClientsYet:"Ainda sem clientes registadas",
    bookings:"marcações", packages:"pacotes",
    passwordManagement:"Gestão de Palavra-passe",
    generateResetLink:"Gerar link de redefinição",
    setNewPassword:"Definir nova palavra-passe",
    resetLinkGenerated:"Link gerado! Copia abaixo:",
    enterNewPassword:"Insere a nova palavra-passe",
    passwordSet:"Palavra-passe atualizada para",
    confirmSetPassword:"Definir Palavra-passe",
    cancelAction:"Cancelar",
  },
};

// ── SCHEDULE ─────────────────────────────────────────────────────────
const SCHEDULE = {
  Monday:[{time:"10:00",name:"Reformer",tag:null},{time:"11:00",name:"Dynamic Mat",tag:null},{time:"18:00",name:"Reformer",tag:null},{time:"19:00",name:"Reformer",tag:null}],
  Tuesday:[{time:"9:30",name:"Reformer",tag:null},{time:"10:30",name:"Reformer",tag:"Power Flow"},{time:"12:00",name:"Mat",tag:null}],
  Wednesday:[{time:"10:00",name:"Reformer",tag:null},{time:"11:00",name:"Reformer",tag:"Back pain & injury"}],
  Thursday:[{time:"10:00",name:"Reformer",tag:null},{time:"11:15",name:"Mat Pilates",tag:"Mom & Baby"},{time:"17:00",name:"Reformer",tag:null},{time:"18:00",name:"Dynamic Mat",tag:null}],
  Friday:[{time:"9:45",name:"Reformer",tag:null},{time:"11:00",name:"Mat",tag:null},{time:"12:15",name:"Reformer",tag:"Beginner"},{time:"13:30",name:"Reformer",tag:null}],
  Sunday:[{time:"10:00",name:"Reformer",tag:null},{time:"11:00",name:"Dynamic Mat",tag:null}],
};
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Sunday"];
const DAY_IDX = {Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6,Sunday:0};
const MAX_SPOTS = (className) => className === "Reformer" ? 4 : 6;

const CLASS_STYLE = {
  Reformer:{color:C.wine,bg:C.winePale,border:C.borderMid},
  "Dynamic Mat":{color:C.green,bg:C.greenPale,border:C.greenBorder},
  Mat:{color:C.green,bg:C.greenPale,border:C.greenBorder},
  "Mat Pilates":{color:C.green,bg:C.greenPale,border:C.greenBorder},
};
const TAG_STYLE = {
  "Power Flow":{color:C.amber,bg:C.amberPale,border:C.amberBorder},
  "Back pain & injury":{color:C.blue,bg:C.bluePale,border:C.blueBorder},
  "Mom & Baby":{color:"#7a3a60",bg:"#f8edf4",border:"#e8b8d4"},
  "Beginner":{color:C.teal,bg:C.tealPale,border:C.tealBorder},
};

// ── PACKAGES ─────────────────────────────────────────────────────────
const PACKAGES = {
  membership:{label:"Monthly Membership",icon:"📅",color:C.wine,bg:C.winePale,border:C.borderMid,isMonthly:true,
    groups:[
      {name:"Reformer",opts:[{id:"ref_1x",label:"1 class/week",price:115},{id:"ref_2x",label:"2 classes/week",price:220},{id:"ref_3x",label:"3 classes/week",price:320},{id:"ref_ul",label:"Unlimited",price:350}]},
      {name:"Mat",opts:[{id:"mat_1x",label:"1 class/week",price:60},{id:"mat_2x",label:"2 classes/week",price:110},{id:"mat_3x",label:"3 classes/week",price:130}]},
      {name:"Reformer & Mat Combo",opts:[{id:"combo_m",label:"1 Reformer + 1 Mat/week",price:160}]},
    ]},
  reformer:{label:"Reformer Packages",icon:"🛏️",color:"#7a4a2a",bg:"#f5ede5",border:"#d4b898",isMonthly:false,
    opts:[{id:"ref_5",label:"5 Classes Pass",qty:5,price:150,validity:"6 weeks"},{id:"ref_10",label:"10 Classes Pass",qty:10,price:280,validity:"12 weeks"},{id:"ref_drop",label:"Drop-in Class",qty:1,price:35,validity:null}]},
  mat:{label:"Mat Packages",icon:"🏋️",color:C.green,bg:C.greenPale,border:C.greenBorder,isMonthly:false,
    opts:[{id:"mat_5",label:"5 Classes Pass",qty:5,price:75,validity:"6 weeks"},{id:"mat_10",label:"10 Classes Pass",qty:10,price:125,validity:"12 weeks"},{id:"mat_drop",label:"Drop-in Class",qty:1,price:20,validity:null}]},
  combo:{label:"Reformer & Mat Combo",icon:"🔀",color:C.blue,bg:C.bluePale,border:C.blueBorder,isMonthly:false,
    opts:[{id:"combo_5",label:"5 Reformer + 5 Mat",qty:10,price:205,validity:"3 months",note:"Mix & Match"},{id:"combo_10",label:"10 Reformer + 10 Mat",qty:20,price:370,validity:"6 months",note:"Mix & Match"}]},
  visitor:{label:"Visitor's Pass",icon:"🌊",color:C.teal,bg:C.tealPale,border:C.tealBorder,isMonthly:false,
    opts:[{id:"vis_ref",label:"3 Reformer Class Pass",qty:3,price:96,validity:"2 weeks"},{id:"vis_mat",label:"3 Mat Class Pass",qty:3,price:54,validity:"2 weeks"}]},
  private:{label:"Private & Duo",icon:"👤",color:"#9a4a6a",bg:"#f8edf4",border:"#e0b8cc",isMonthly:false,
    opts:[{id:"priv",label:"Private Session",qty:1,price:55,validity:null},{id:"duo",label:"Duo Session",qty:1,price:95,validity:null}]},
  intro:{label:"Intro / Trial",icon:"✨",color:C.amber,bg:C.amberPale,border:C.amberBorder,isMonthly:false,
    opts:[{id:"trial",label:"Trial Class",qty:1,price:20,validity:null,note:"Free with any package"}]},
};

// ── DATE HELPERS ─────────────────────────────────────────────────────
const fmt = d => d.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"2-digit"});

const lisbonNow = () => {
  const parts = new Intl.DateTimeFormat("en-GB",{
    timeZone:"Europe/Lisbon",year:"numeric",month:"2-digit",day:"2-digit",
    hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false,
  }).formatToParts(new Date());
  const p={}; parts.forEach(({type,value})=>p[type]=value);
  return new Date(`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`);
};

// Get the Date for the next occurrence of a weekday (Lisbon time). If today, return today.
const nextOccurrenceOfDay = (dayName) => {
  const now = lisbonNow();
  const target = DAY_IDX[dayName];
  const current = now.getDay();
  let diff = target - current;
  if (diff < 0) diff += 7;
  const d = new Date(now);
  d.setDate(d.getDate()+diff);
  d.setHours(0,0,0,0);
  return d;
};

// Format day label like "Monday, May 5"
const dayLabel = (dayName, lang) => {
  const t = T[lang];
  const d = nextOccurrenceOfDay(dayName);
  return `${t.days[dayName]}, ${t.monthNames[d.getMonth()]} ${d.getDate()}`;
};
const shortDayLabel = (dayName, lang) => {
  const d = nextOccurrenceOfDay(dayName);
  return `${T[lang].dayShort[dayName]} ${d.getDate()}`;
};

const deadline = (dayName, timeStr) => {
  const [h,m] = timeStr.split(":").map(Number);
  const isMorning = h < 14;
  const classDay = nextOccurrenceOfDay(dayName);
  classDay.setHours(h,m,0,0);
  if (isMorning) {
    const d = new Date(classDay);
    d.setDate(d.getDate()-1);
    d.setHours(16,0,0,0);
    return d;
  }
  return new Date(classDay.getTime() - 24*60*60*1000);
};

const isOpen = (dayName, timeStr) => lisbonNow() < deadline(dayName, timeStr);

const deadlineLabel = (dayName, timeStr, lang) => {
  const dl = deadline(dayName, timeStr);
  const [h] = timeStr.split(":").map(Number);
  const isMorning = h < 14;
  const daysEn=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const daysPt=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  const arr = lang==="pt"?daysPt:daysEn;
  const pad = n => String(n).padStart(2,"0");
  const t = T[lang];
  if (isMorning) return `${t.openUntil} ${arr[dl.getDay()]} ${t.at} 16:00`;
  return `${t.openUntil} ${arr[dl.getDay()]} ${pad(dl.getHours())}:${pad(dl.getMinutes())}`;
};

const mkEntry = (catKey,opt) => ({
  id:Date.now()+Math.random(), pkgKey:catKey, optId:opt.id,
  label:opt.label, qty:opt.qty||null, price:opt.price,
  validity:opt.validity||null, note:opt.note||null,
  paid:false, paidDate:null, startDate:fmt(lisbonNow()), sessions:[],
});

// ─────────────────────────────────────────────────────────────────────
export default function NoaPilates() {
  // Auth
  const [users, setUsers] = useState({});  // { email: {name, username, email, phone, password, joinedAt} }
  const [currentUser, setCurrentUser] = useState(null);  // email of logged-in user, or "__admin__"
  const [authMode, setAuthMode] = useState("client"); // "client" | "admin"
  const [authView, setAuthView] = useState("login"); // "login" | "signup" | "forgot" | "reset"
  const [resetTokens, setResetTokens] = useState({}); // { token: { email, expiresAt } }
  const [resetLink, setResetLink] = useState(""); // shown after request
  const [resetTokenInput, setResetTokenInput] = useState("");
  const [lang, setLang] = useState("en");

  // Auth form
  const [fName, setFName] = useState("");
  const [fUsername, setFUsername] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fPassword, setFPassword] = useState("");
  const [fConfirm, setFConfirm] = useState("");

  // App state
  const [tab, setTab] = useState("book");
  const [adminTab, setAdminTab] = useState("schedule"); // "schedule" | "packages" | "clients"
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [bookings, setBookings] = useState({});
  const [clientPkgs, setClientPkgs] = useState({});

  const [showPkgModal, setShowPkgModal] = useState(false);
  const [pkgStep, setPkgStep] = useState(1);
  const [selPkgKey, setSelPkgKey] = useState("reformer");
  const [selOptId, setSelOptId] = useState("ref_10");
  const [selClientForPkg, setSelClientForPkg] = useState("");
  const [viewingClient, setViewingClient] = useState(null); // email
  const [adminResetLink, setAdminResetLink] = useState(""); // link generated by admin
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const [adminNewPassword, setAdminNewPassword] = useState("");

  const [toast, setToast] = useState(null);
  const t = T[lang];
  const isAdmin = currentUser === "__admin__";
  const me = currentUser && !isAdmin ? users[currentUser] : null;

  const fire = (msg,type="ok") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  // Auto-detect reset token in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("reset");
    if (token) {
      setResetTokenInput(token);
      setAuthView("reset");
    }
  }, []);

  // Helpers
  const slotKey = (day,time) => `${day}-${time}`;
  const spotsLeft = (day,time) => {
    const s = SCHEDULE[day]?.find(x=>x.time===time);
    return MAX_SPOTS(s?.name||"") - ((bookings[slotKey(day,time)]||[]).length);
  };
  const isBookedBy = (day,time,email) => (bookings[slotKey(day,time)]||[]).some(b=>b.email===email);
  const myPkgsFor = (email) => clientPkgs[email]||[];
  const activePkgFor = (email) => myPkgsFor(email).find(p=>p.qty?p.sessions.length<p.qty:true);
  const getOpts = key => { const p=PACKAGES[key]; return p.groups?p.groups.flatMap(g=>g.opts):(p.opts||[]); };

  const allClientEmails = () => Object.keys(users);
  const getUserName = email => users[email]?.name || email;

  // Auth actions
  const resetForm = () => {
    setFName(""); setFUsername(""); setFEmail(""); setFPhone(""); setFPassword(""); setFConfirm("");
  };

  const doSignUp = () => {
    if (!fName.trim()||!fUsername.trim()||!fEmail.trim()||!fPassword) { fire(t.fillAllFields,"warn"); return; }
    const email = fEmail.trim().toLowerCase();
    if (users[email]) { fire(t.emailExists,"warn"); return; }
    if (Object.values(users).some(u=>u.username.toLowerCase()===fUsername.trim().toLowerCase())) { fire(t.usernameExists,"warn"); return; }
    if (fPassword.length < 4) { fire(t.passwordMinLength,"warn"); return; }
    if (fPassword !== fConfirm) { fire(t.passwordsMatch,"warn"); return; }
    const newUser = {
      name:fName.trim(), username:fUsername.trim(), email, phone:fPhone.trim(),
      password:fPassword, joinedAt:fmt(lisbonNow()),
    };
    setUsers(prev=>({...prev,[email]:newUser}));
    setCurrentUser(email);
    fire(`${t.accountCreated} ${fName.trim()}!`);
    resetForm();
  };

  const requestPasswordReset = () => {
    const email = fEmail.trim().toLowerCase();
    if (!email) { fire(t.fillAllFields,"warn"); return; }
    if (!users[email]) { fire(t.emailNotFound,"warn"); return; }
    // Generate token
    const token = Math.random().toString(36).substring(2,10) + Date.now().toString(36);
    const expiresAt = Date.now() + 60*60*1000; // 1 hour
    setResetTokens(prev=>({...prev,[token]:{email,expiresAt}}));
    // Build link (in real app sent by email)
    const link = `${window.location.origin}${window.location.pathname}?reset=${token}`;
    setResetLink(link);
    fire(t.resetLinkSent);
  };

  const doResetPassword = () => {
    const token = resetTokenInput.trim();
    const data = resetTokens[token];
    if (!data || data.expiresAt < Date.now()) { fire(t.invalidResetToken,"warn"); return; }
    if (!fPassword) { fire(t.fillAllFields,"warn"); return; }
    if (fPassword.length < 4) { fire(t.passwordMinLength,"warn"); return; }
    if (fPassword !== fConfirm) { fire(t.passwordsMatch,"warn"); return; }
    // Update password
    setUsers(prev=>({...prev,[data.email]:{...prev[data.email],password:fPassword}}));
    // Invalidate token
    setResetTokens(prev=>{ const n={...prev}; delete n[token]; return n; });
    setResetLink("");
    setResetTokenInput("");
    setAuthView("login");
    resetForm();
    fire(t.passwordUpdated);
  };

  const doSignIn = () => {
    const email = fEmail.trim().toLowerCase();
    const u = users[email];
    if (!u || u.password !== fPassword) { fire(t.invalidLogin,"warn"); return; }
    setCurrentUser(email);
    fire(`${t.welcomeBack}, ${u.name}!`);
    resetForm();
  };

  const doAdminLogin = () => {
    if (fEmail.trim().toLowerCase() === ADMIN_EMAIL && fPassword === ADMIN_PASSWORD) {
      setCurrentUser("__admin__");
      fire("Admin logged in ✓");
      resetForm();
    } else {
      fire(t.invalidAdmin,"warn");
    }
  };

  const doLogout = () => { setCurrentUser(null); resetForm(); setAuthMode("client"); setAuthView("login"); };

  // Booking
  const bookClass = (day,slot) => {
    if (!isAdmin && !isOpen(day,slot.time)) { fire(t.bookingClosed,"warn"); return; }
    if (spotsLeft(day,slot.time)<=0) { fire(t.classFull,"warn"); return; }
    if (isBookedBy(day,slot.time,currentUser)) { fire(t.alreadyBooked,"warn"); return; }
    setBookings(prev=>({...prev,[slotKey(day,slot.time)]:[...(prev[slotKey(day,slot.time)]||[]),{email:currentUser,ts:new Date().toISOString()}]}));
    const pkg = activePkgFor(currentUser);
    if (pkg) {
      setClientPkgs(prev=>({...prev,[currentUser]:prev[currentUser].map(p=>p.id===pkg.id?{...p,sessions:[...p.sessions,{id:Date.now(),date:fmt(lisbonNow()),class:slot.name,time:slot.time,day}]}:p)}));
      fire(`${t.bookedAnd} ${PACKAGES[pkg.pkgKey]?.label} ✓`);
    } else {
      fire(`${slot.time} ${slot.name} ${lang==="pt"?"marcado!":"booked!"}`);
    }
  };

  const cancelBooking = (day,time,email=currentUser) => {
    if (!isAdmin && !isOpen(day,time)) { fire(t.cancellationClosed,"warn"); return; }
    setBookings(prev=>({...prev,[slotKey(day,time)]:(prev[slotKey(day,time)]||[]).filter(b=>b.email!==email)}));
    fire(t.bookingCancelled,"warn");
  };

  // Packages
  const addPackage = () => {
    if (!selClientForPkg) { fire("Select a client","warn"); return; }
    const opt = getOpts(selPkgKey).find(o=>o.id===selOptId)||getOpts(selPkgKey)[0];
    setClientPkgs(prev=>({...prev,[selClientForPkg]:[...(prev[selClientForPkg]||[]),mkEntry(selPkgKey,opt)]}));
    setShowPkgModal(false);
    fire(`${t.packageAdded} ${getUserName(selClientForPkg)}!`);
  };

  const markPaid = (email,pkgId) => {
    setClientPkgs(prev=>({...prev,[email]:(prev[email]||[]).map(p=>p.id===pkgId?{...p,paid:true,paidDate:fmt(lisbonNow())}:p)}));
    fire(t.paymentMarked);
  };

  const removePkg = (email,pkgId) => {
    setClientPkgs(prev=>({...prev,[email]:(prev[email]||[]).filter(p=>p.id!==pkgId)}));
    fire(t.packageRemoved,"warn");
  };

  // Admin: generate a reset link for a specific client
  const adminGenerateResetLink = (email) => {
    const token = Math.random().toString(36).substring(2,10) + Date.now().toString(36);
    const expiresAt = Date.now() + 24*60*60*1000; // 24 hours
    setResetTokens(prev=>({...prev,[token]:{email,expiresAt}}));
    const link = `${window.location.origin}${window.location.pathname}?reset=${token}`;
    setAdminResetLink(link);
    fire(t.resetLinkGenerated);
  };

  // Admin: directly set a new password for a client
  const adminSetPassword = (email) => {
    if (!adminNewPassword || adminNewPassword.length < 4) { fire(t.passwordMinLength,"warn"); return; }
    setUsers(prev=>({...prev,[email]:{...prev[email],password:adminNewPassword}}));
    setAdminNewPassword("");
    setShowSetPasswordModal(false);
    fire(`${t.passwordSet} ${getUserName(email)} ✓`);
  };

  const myBookingsList = () => DAYS.flatMap(d=>SCHEDULE[d].filter(s=>currentUser&&isBookedBy(d,s.time,currentUser)).map(s=>({day:d,...s})));

  const isFinished = (e) => e.qty ? e.sessions.length >= e.qty : false;

  // ────────────────────────────────────────────────────────────────
  // SPLASH / AUTH
  // ────────────────────────────────────────────────────────────────
  if (!currentUser) return (
    <div style={S.root}>
      {toast&&<div style={S.toastStyle(toast.type)}>{toast.msg}</div>}
      <div style={S.splash}>
        <div style={S.splashLogo}>
          <NoaLogo size={140} color="#9a6070"/>
          <div style={{fontSize:13,letterSpacing:8,color:"#9a6070",marginTop:6,fontFamily:"Georgia,serif"}}>PILATES</div>
        </div>
        <p style={S.splashSub}>ERICEIRA</p>

        {/* Language */}
        <div style={{display:"flex",gap:8,marginBottom:20}}>
          {["en","pt"].map(l=>(
            <button key={l} onClick={()=>setLang(l)} style={{padding:"6px 16px",borderRadius:18,fontSize:12,fontFamily:"Georgia,serif",cursor:"pointer",background:lang===l?C.wine:"#fff",color:lang===l?"#fff":C.textMid,border:lang===l?"none":`1px solid ${C.border}`}}>
              {l==="en"?"🇬🇧 EN":"🇵🇹 PT"}
            </button>
          ))}
        </div>

        {/* Mode toggle */}
        <div style={{display:"flex",gap:6,marginBottom:14,padding:4,background:C.surfaceAlt,borderRadius:24,border:`1px solid ${C.border}`}}>
          <button onClick={()=>{setAuthMode("client");resetForm();}} style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontFamily:"Georgia,serif",cursor:"pointer",background:authMode==="client"?C.wine:"transparent",color:authMode==="client"?"#fff":C.textMid,border:"none"}}>
            👤 {lang==="pt"?"Cliente":"Client"}
          </button>
          <button onClick={()=>{setAuthMode("admin");resetForm();}} style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontFamily:"Georgia,serif",cursor:"pointer",background:authMode==="admin"?C.wine:"transparent",color:authMode==="admin"?"#fff":C.textMid,border:"none"}}>
            ⚙ Admin
          </button>
        </div>

        <div style={S.splashCard}>
          {authMode==="admin" ? (
            <>
              <h3 style={{margin:"0 0 14px",fontSize:16,color:C.wine,textAlign:"center",fontFamily:"Georgia,serif"}}>{t.adminLogin}</h3>
              <input value={fEmail} onChange={e=>setFEmail(e.target.value)} placeholder={t.adminEmail} style={S.input} type="email"/>
              <input value={fPassword} onChange={e=>setFPassword(e.target.value)} placeholder={t.adminPassword} style={S.input} type="password" onKeyDown={e=>e.key==="Enter"&&doAdminLogin()}/>
              <button onClick={doAdminLogin} style={S.wineBtn}>{t.enter}</button>
            </>
          ) : authView==="login" ? (
            <>
              <h3 style={{margin:"0 0 14px",fontSize:16,color:C.wine,textAlign:"center",fontFamily:"Georgia,serif"}}>{t.signIn}</h3>
              <input value={fEmail} onChange={e=>setFEmail(e.target.value)} placeholder={t.email} style={S.input} type="email"/>
              <input value={fPassword} onChange={e=>setFPassword(e.target.value)} placeholder={t.password} style={S.input} type="password" onKeyDown={e=>e.key==="Enter"&&doSignIn()}/>
              <button onClick={doSignIn} style={S.wineBtn}>{t.enter}</button>
              <button onClick={()=>{setAuthView("forgot");resetForm();setResetLink("");}} style={{...S.linkBtn,color:C.textMid}}>{t.forgotPassword}</button>
              <button onClick={()=>{setAuthView("signup");resetForm();}} style={S.linkBtn}>{t.noAccount}</button>
            </>
          ) : authView==="signup" ? (
            <>
              <h3 style={{margin:"0 0 14px",fontSize:16,color:C.wine,textAlign:"center",fontFamily:"Georgia,serif"}}>{t.signUp}</h3>
              <input value={fName} onChange={e=>setFName(e.target.value)} placeholder={t.name} style={S.input}/>
              <input value={fUsername} onChange={e=>setFUsername(e.target.value)} placeholder={t.username} style={S.input}/>
              <input value={fEmail} onChange={e=>setFEmail(e.target.value)} placeholder={t.email} style={S.input} type="email"/>
              <input value={fPhone} onChange={e=>setFPhone(e.target.value)} placeholder={t.phone} style={S.input} type="tel"/>
              <input value={fPassword} onChange={e=>setFPassword(e.target.value)} placeholder={t.password} style={S.input} type="password"/>
              <input value={fConfirm} onChange={e=>setFConfirm(e.target.value)} placeholder={t.confirmPassword} style={S.input} type="password" onKeyDown={e=>e.key==="Enter"&&doSignUp()}/>
              <button onClick={doSignUp} style={S.wineBtn}>{t.create}</button>
              <button onClick={()=>{setAuthView("login");resetForm();}} style={S.linkBtn}>{t.haveAccount}</button>
            </>
          ) : authView==="forgot" ? (
            <>
              <h3 style={{margin:"0 0 6px",fontSize:16,color:C.wine,textAlign:"center",fontFamily:"Georgia,serif"}}>{t.resetPassword}</h3>
              <p style={{margin:"0 0 12px",fontSize:12,color:C.textLight,textAlign:"center",lineHeight:1.5}}>{t.enterEmailReset}</p>
              <input value={fEmail} onChange={e=>setFEmail(e.target.value)} placeholder={t.email} style={S.input} type="email" onKeyDown={e=>e.key==="Enter"&&requestPasswordReset()}/>
              <button onClick={requestPasswordReset} style={S.wineBtn}>{t.sendResetLink}</button>
              {resetLink && (
                <div style={{marginTop:14,padding:"12px 14px",background:C.greenPale,border:`1px solid ${C.greenBorder}`,borderRadius:9}}>
                  <div style={{fontSize:11,color:C.green,fontWeight:"bold",marginBottom:6}}>✓ {t.resetLinkSent}</div>
                  <div style={{fontSize:11,color:C.textMid,marginBottom:8,lineHeight:1.5}}>{t.resetLinkInstructions}</div>
                  <a href={resetLink} style={{display:"block",fontSize:11,color:C.wine,wordBreak:"break-all",textDecoration:"underline",marginBottom:8}}>{resetLink}</a>
                  <button onClick={()=>{navigator.clipboard?.writeText(resetLink);fire(t.linkCopied);}} style={{...S.outlineBtn,fontSize:11,padding:"5px 12px"}}>{t.copyLink}</button>
                </div>
              )}
              <button onClick={()=>{setAuthView("login");resetForm();setResetLink("");}} style={S.linkBtn}>{t.backToLogin}</button>
            </>
          ) : authView==="reset" ? (
            <>
              <h3 style={{margin:"0 0 12px",fontSize:16,color:C.wine,textAlign:"center",fontFamily:"Georgia,serif"}}>{t.resetPassword}</h3>
              {resetTokens[resetTokenInput] && resetTokens[resetTokenInput].expiresAt > Date.now() ? (
                <>
                  <div style={{fontSize:12,color:C.textMid,textAlign:"center",marginBottom:6}}>{resetTokens[resetTokenInput].email}</div>
                  <input value={fPassword} onChange={e=>setFPassword(e.target.value)} placeholder={t.newPassword} style={S.input} type="password"/>
                  <input value={fConfirm} onChange={e=>setFConfirm(e.target.value)} placeholder={t.confirmNewPassword} style={S.input} type="password" onKeyDown={e=>e.key==="Enter"&&doResetPassword()}/>
                  <button onClick={doResetPassword} style={S.wineBtn}>{t.updatePassword}</button>
                </>
              ) : (
                <div style={{padding:"14px",background:C.redPale,border:`1px solid ${C.redBorder}`,borderRadius:9,fontSize:12,color:C.red,textAlign:"center"}}>
                  ⚠️ {t.invalidResetToken}
                </div>
              )}
              <button onClick={()=>{setAuthView("login");resetForm();setResetTokenInput("");window.history.replaceState({},"",window.location.pathname);}} style={S.linkBtn}>{t.backToLogin}</button>
            </>
          ) : null}
        </div>
      </div>
      <style>{CSS}</style>
    </div>
  );

  // ────────────────────────────────────────────────────────────────
  // ADMIN
  // ────────────────────────────────────────────────────────────────
  if (isAdmin) return (
    <div style={S.root}>
      {toast&&<div style={S.toastStyle(toast.type)}>{toast.msg}</div>}
      <div style={S.header}>
        <div style={S.headerBrand}><NoaLogoBadge size={32}/><div><div style={S.brandName}>NOA PILATES</div><div style={S.brandCity}>{t.admin}</div></div></div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>setLang(l=>l==="en"?"pt":"en")} style={{...S.linkBtn,fontSize:11,margin:0,padding:0}}>{lang==="en"?"🇵🇹":"🇬🇧"}</button>
          <button onClick={doLogout} style={{...S.outlineBtn,fontSize:12}}>{t.exit}</button>
        </div>
      </div>

      {/* Admin nav */}
      <div style={S.nav}>
        {[["schedule",t.classBookings],["packages",t.clientPackages],["clients",t.allClients]].map(([v,lb])=>(
          <button key={v} onClick={()=>setAdminTab(v)} style={{...S.navBtn,borderBottom:adminTab===v?`2px solid ${C.wine}`:"2px solid transparent",color:adminTab===v?C.wine:C.textMid,fontWeight:adminTab===v?"bold":"normal"}}>{lb}</button>
        ))}
      </div>

      <div style={S.page}>
        {/* KPIs */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:24}}>
          {[
            {lb:t.totalClients,val:Object.keys(users).length,c:C.wine},
            {lb:t.totalBookings,val:Object.values(bookings).reduce((a,v)=>a+v.length,0),c:C.blue},
            {lb:t.activePackages,val:Object.values(clientPkgs).flatMap(x=>x).filter(p=>p.qty?p.sessions.length<p.qty:true).length,c:C.teal},
            {lb:t.unpaidPackages,val:Object.values(clientPkgs).flatMap(x=>x).filter(p=>!p.paid).length,c:C.amber},
          ].map((k,i)=>(
            <div key={i} style={{...S.card,padding:"12px 14px",borderTop:`3px solid ${k.c}`}}>
              <div style={{fontSize:22,fontWeight:"bold",color:k.c}}>{k.val}</div>
              <div style={{fontSize:10,color:C.textLight,textTransform:"uppercase",letterSpacing:1,marginTop:3}}>{k.lb}</div>
            </div>
          ))}
        </div>

        {/* SCHEDULE TAB */}
        {adminTab==="schedule" && (
          <div>
            {DAYS.map(day=>(
              <div key={day} style={{marginBottom:18}}>
                <div style={S.adminDayHead}>{dayLabel(day,lang)}</div>
                {SCHEDULE[day].map((slot,i)=>{
                  const att = (bookings[slotKey(day,slot.time)]||[]).map(b=>b.email);
                  const left = spotsLeft(day,slot.time);
                  const open = isOpen(day,slot.time);
                  return (
                    <div key={i} style={{...S.card,marginBottom:7,borderLeft:`4px solid ${att.length>0?C.wine:C.border}`,padding:"11px 14px"}}>
                      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
                        <div style={{display:"flex",gap:10,alignItems:"flex-start",flex:1,minWidth:0}}>
                          <div style={{flexShrink:0}}>
                            <div style={{fontSize:13,fontWeight:"bold",color:C.wine}}>{slot.time}</div>
                            <div style={{fontSize:9,color:open?C.green:C.red,marginTop:2}}>{open?t.open:t.lockedAdmin}</div>
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:13,color:C.text}}>{slot.name}{slot.tag&&<span style={{marginLeft:6,fontSize:11,color:C.textLight}}>✦ {slot.tag}</span>}</div>
                            <div style={{fontSize:10,color:C.textLight,marginTop:2}}>{deadlineLabel(day,slot.time,lang)}</div>
                            {att.length>0 ? (
                              <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6}}>
                                {att.map((email,j)=>(
                                  <span key={j} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:12,fontSize:11,background:C.winePale,color:C.wine,border:`1px solid ${C.borderMid}`}}>
                                    <span onClick={()=>{setViewingClient(email);setAdminTab("clients");}} style={{cursor:"pointer",textDecoration:"underline"}}>{getUserName(email)}</span>
                                    <button onClick={()=>cancelBooking(day,slot.time,email)} style={{background:"none",border:"none",color:C.textLight,cursor:"pointer",fontSize:13,padding:0,lineHeight:1}}>×</button>
                                  </span>
                                ))}
                              </div>
                            ) : <div style={{fontSize:11,color:C.textLight,marginTop:3}}>{t.noBookings}</div>}
                          </div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{fontSize:15,fontWeight:"bold",color:left===0?C.red:C.wine}}>{MAX_SPOTS(slot.name)-left}/{MAX_SPOTS(slot.name)}</div>
                          <div style={{fontSize:9,color:C.textLight,marginBottom:5}}>{lang==="pt"?"marcados":"booked"}</div>
                          <select onChange={e=>{if(e.target.value){const em=e.target.value;if(!isBookedBy(day,slot.time,em)&&spotsLeft(day,slot.time)>0){setBookings(prev=>({...prev,[slotKey(day,slot.time)]:[...(prev[slotKey(day,slot.time)]||[]),{email:em,ts:new Date().toISOString()}]}));fire(`${getUserName(em)} ${t.addedTo} ${slot.time}`);}else fire(t.alreadyBookedOrFull,"warn");e.target.value="";}}} style={{fontSize:10,padding:"3px 6px",borderRadius:8,border:`1px solid ${C.border}`,background:C.surfaceAlt,color:C.textMid,fontFamily:"Georgia,serif",cursor:"pointer",maxWidth:120}}>
                            <option value="">{t.addClient}</option>
                            {allClientEmails().filter(em=>!isBookedBy(day,slot.time,em)).map(em=><option key={em} value={em}>{getUserName(em)}</option>)}
                          </select>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:4,marginTop:7}}>
                        {Array.from({length:MAX_SPOTS(slot.name)}).map((_,j)=>(
                          <div key={j} style={{width:7,height:7,borderRadius:"50%",background:j<att.length?C.wine:C.border}}/>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* PACKAGES TAB */}
        {adminTab==="packages" && (
          <div>
            <div style={{...S.card,padding:"14px 16px",marginBottom:20,borderLeft:`4px solid ${C.wine}`}}>
              <div style={{fontSize:13,fontWeight:"bold",color:C.wine,marginBottom:10}}>{t.addPackageToClient}</div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
                <select value={selClientForPkg} onChange={e=>setSelClientForPkg(e.target.value)} style={{...S.input,width:"auto",flex:1,textAlign:"left",padding:"8px 12px",margin:0}}>
                  <option value="">{t.selectClient}</option>
                  {allClientEmails().map(em=><option key={em} value={em}>{getUserName(em)} ({em})</option>)}
                </select>
                <button onClick={()=>{if(!selClientForPkg){fire(t.selectClient,"warn");return;}setShowPkgModal(true);setPkgStep(1);}} style={{...S.wineBtn,padding:"9px 16px",fontSize:12,marginTop:0}}>
                  {t.addPackage}
                </button>
              </div>
            </div>

            {Object.entries(clientPkgs).filter(([,pkgs])=>pkgs.length>0).length===0
              ? <div style={{...S.card,padding:24,textAlign:"center",color:C.textLight}}>{t.noPackagesYet}</div>
              : Object.entries(clientPkgs).flatMap(([email,pkgs])=>pkgs.map(p=>({...p,clientEmail:email}))).map((p,i)=>{
                  const pkg = PACKAGES[p.pkgKey];
                  const done = p.sessions.length;
                  return (
                    <div key={i} style={{...S.card,marginBottom:9,borderLeft:`4px solid ${pkg?.color||C.wine}`,padding:"11px 14px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
                        <div style={{flex:1}}>
                          <div style={{fontSize:13,color:C.text}}>
                            <b style={{cursor:"pointer",textDecoration:"underline"}} onClick={()=>{setViewingClient(p.clientEmail);setAdminTab("clients");}}>{getUserName(p.clientEmail)}</b> · {pkg?.icon} {p.label}
                          </div>
                          <div style={{fontSize:11,color:C.textLight,marginTop:2}}>{p.startDate}{p.validity?` · ${p.validity}`:""} · {done}{p.qty?`/${p.qty}`:""} {t.sessions}</div>
                          {p.qty&&(
                            <div style={{background:C.border,borderRadius:3,height:4,overflow:"hidden",marginTop:6,maxWidth:180}}>
                              <div style={{width:`${Math.min(100,done/p.qty*100)}%`,height:"100%",background:done>=p.qty?C.green:pkg.color,borderRadius:3}}/>
                            </div>
                          )}
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{fontSize:14,fontWeight:"bold",color:p.paid?C.green:C.amber}}>€{p.price}</div>
                          <div style={{fontSize:11,color:p.paid?C.green:C.amber,marginBottom:6}}>{p.paid?`${t.paid} ${p.paidDate}`:t.pending}</div>
                          <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
                            {!p.paid&&<button onClick={()=>markPaid(p.clientEmail,p.id)} style={{...S.greenBtn,fontSize:11,padding:"4px 10px",marginTop:0}}>{t.markPaid}</button>}
                            <button onClick={()=>removePkg(p.clientEmail,p.id)} style={{...S.outlineBtn,fontSize:11,padding:"4px 9px",color:C.red,borderColor:C.redBorder}}>{t.remove}</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
            }
          </div>
        )}

        {/* CLIENTS TAB */}
        {adminTab==="clients" && (
          <div>
            {viewingClient ? (() => {
              const u = users[viewingClient];
              if (!u) { setViewingClient(null); return null; }
              const userBookings = DAYS.flatMap(d=>SCHEDULE[d].filter(s=>isBookedBy(d,s.time,viewingClient)).map(s=>({day:d,...s})));
              const userPkgs = myPkgsFor(viewingClient);
              return (
                <div>
                  <button onClick={()=>{setViewingClient(null);setAdminResetLink("");}} style={{background:"none",border:"none",color:C.textMid,cursor:"pointer",fontSize:12,fontFamily:"Georgia,serif",marginBottom:14,padding:0}}>← {t.allClients}</button>

                  {/* Profile card */}
                  <div style={{...S.card,padding:"18px 18px",marginBottom:18,display:"flex",alignItems:"center",gap:14}}>
                    <div style={{width:54,height:54,borderRadius:"50%",background:`linear-gradient(135deg,${C.wineLight},${C.wine})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"#fff",fontWeight:"bold",flexShrink:0}}>
                      {u.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:18,color:C.text,fontWeight:"bold"}}>{u.name}</div>
                      <div style={{fontSize:12,color:C.textLight,marginTop:2}}>@{u.username}</div>
                    </div>
                  </div>

                  {/* Contact info */}
                  <div style={S.sectionLabel}>{t.contactInfo}</div>
                  <div style={{...S.card,padding:"14px 16px",marginBottom:18}}>
                    <div style={{display:"grid",gridTemplateColumns:"100px 1fr",gap:8,fontSize:13}}>
                      <div style={{color:C.textLight}}>{t.email}:</div><div style={{color:C.text}}>{u.email}</div>
                      <div style={{color:C.textLight}}>{t.phone}:</div><div style={{color:C.text}}>{u.phone||"—"}</div>
                      <div style={{color:C.textLight}}>{t.joined}:</div><div style={{color:C.text}}>{u.joinedAt}</div>
                    </div>
                  </div>

                  {/* Password management */}
                  <div style={S.sectionLabel}>🔐 {t.passwordManagement}</div>
                  <div style={{...S.card,padding:"14px 16px",marginBottom:18}}>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:adminResetLink?12:0}}>
                      <button onClick={()=>adminGenerateResetLink(u.email)} style={{...S.outlineBtn,fontSize:12,padding:"7px 14px"}}>
                        🔗 {t.generateResetLink}
                      </button>
                      <button onClick={()=>{setShowSetPasswordModal(true);setAdminNewPassword("");setAdminResetLink("");}} style={{...S.outlineBtn,fontSize:12,padding:"7px 14px"}}>
                        🔑 {t.setNewPassword}
                      </button>
                    </div>
                    {adminResetLink && (
                      <div style={{marginTop:10,padding:"12px 14px",background:C.greenPale,border:`1px solid ${C.greenBorder}`,borderRadius:9}}>
                        <div style={{fontSize:11,color:C.green,fontWeight:"bold",marginBottom:5}}>✓ {t.resetLinkGenerated}</div>
                        <div style={{fontSize:11,color:C.textMid,marginBottom:8,lineHeight:1.5}}>
                          {lang==="pt"?"Envia este link à cliente por WhatsApp/SMS. Válido 24h.":"Send this link to the client via WhatsApp/SMS. Valid for 24h."}
                        </div>
                        <div style={{padding:"8px 10px",background:"#fff",borderRadius:6,border:`1px solid ${C.border}`,marginBottom:8}}>
                          <a href={adminResetLink} target="_blank" rel="noreferrer" style={{fontSize:11,color:C.wine,wordBreak:"break-all",textDecoration:"underline"}}>{adminResetLink}</a>
                        </div>
                        <button onClick={()=>{navigator.clipboard?.writeText(adminResetLink);fire(t.linkCopied);}} style={{...S.outlineBtn,fontSize:11,padding:"5px 12px"}}>
                          📋 {t.copyLink}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:18}}>
                    <div style={{...S.card,padding:"12px 14px",borderTop:`3px solid ${C.wine}`}}>
                      <div style={{fontSize:22,fontWeight:"bold",color:C.wine}}>{userBookings.length}</div>
                      <div style={{fontSize:10,color:C.textLight,textTransform:"uppercase",letterSpacing:1,marginTop:3}}>{t.bookings}</div>
                    </div>
                    <div style={{...S.card,padding:"12px 14px",borderTop:`3px solid ${C.blue}`}}>
                      <div style={{fontSize:22,fontWeight:"bold",color:C.blue}}>{userPkgs.length}</div>
                      <div style={{fontSize:10,color:C.textLight,textTransform:"uppercase",letterSpacing:1,marginTop:3}}>{t.packages}</div>
                    </div>
                  </div>

                  {/* Bookings */}
                  <div style={S.sectionLabel}>{t.upcoming}</div>
                  {userBookings.length===0
                    ? <div style={{...S.card,padding:18,textAlign:"center",color:C.textLight,marginBottom:18}}>{t.noClassesBooked}</div>
                    : userBookings.map((s,i)=>(
                        <div key={i} style={{...S.card,marginBottom:7,borderLeft:`4px solid ${C.green}`,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
                          <div style={{width:50,fontSize:13,fontWeight:"bold",color:C.green}}>{s.time}</div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:13,color:C.text}}>{s.name}{s.tag&&<span style={{marginLeft:6,fontSize:11,color:C.textLight}}>✦ {s.tag}</span>}</div>
                            <div style={{fontSize:11,color:C.textLight,marginTop:2}}>{dayLabel(s.day,lang)}</div>
                          </div>
                          <button onClick={()=>cancelBooking(s.day,s.time,viewingClient)} style={S.cancelBtn}>{t.cancel}</button>
                        </div>
                      ))
                  }

                  {/* Packages */}
                  <div style={{...S.sectionLabel,marginTop:18}}>{t.myPackages}</div>
                  {userPkgs.length===0
                    ? <div style={{...S.card,padding:18,textAlign:"center",color:C.textLight}}>{t.noPackagesYet}</div>
                    : userPkgs.map((p,i)=>{
                        const pkg = PACKAGES[p.pkgKey];
                        return (
                          <div key={i} style={{...S.card,marginBottom:8,borderLeft:`4px solid ${pkg.color}`,padding:"11px 14px"}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                              <div>
                                <div style={{fontSize:13,color:C.text}}>{pkg.icon} {p.label}</div>
                                <div style={{fontSize:11,color:C.textLight,marginTop:2}}>{p.sessions.length}{p.qty?`/${p.qty}`:""} {t.sessions} · {t.started} {p.startDate}</div>
                              </div>
                              <div style={{textAlign:"right"}}>
                                <div style={{fontSize:14,fontWeight:"bold",color:p.paid?C.green:C.amber}}>€{p.price}</div>
                                <div style={{fontSize:11,color:p.paid?C.green:C.amber}}>{p.paid?t.paid:t.pending}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  }
                </div>
              );
            })() : (
              <>
                <h2 style={{...S.pageTitle,marginBottom:14}}>{t.allClients}</h2>
                {Object.keys(users).length===0
                  ? <div style={{...S.card,padding:32,textAlign:"center",color:C.textLight}}>{t.noClientsYet}</div>
                  : <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
                      {Object.values(users).map(u=>{
                        const userBookings = DAYS.flatMap(d=>SCHEDULE[d].filter(s=>isBookedBy(d,s.time,u.email)).length>0?[1]:[]).length;
                        const userPkgsCount = myPkgsFor(u.email).length;
                        return (
                          <div key={u.email} onClick={()=>setViewingClient(u.email)} style={{...S.card,padding:"14px 16px",cursor:"pointer",borderLeft:`4px solid ${C.wine}`,transition:"transform .15s"}}
                            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                            onMouseLeave={e=>e.currentTarget.style.transform=""}>
                            <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:10}}>
                              <div style={{width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${C.wineLight},${C.wine})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#fff",fontWeight:"bold",flexShrink:0}}>
                                {u.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                              </div>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{fontSize:14,color:C.text,fontWeight:"bold",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.name}</div>
                                <div style={{fontSize:11,color:C.textLight,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>@{u.username}</div>
                              </div>
                            </div>
                            <div style={{fontSize:11,color:C.textLight,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:3}}>{u.email}</div>
                            {u.phone&&<div style={{fontSize:11,color:C.textLight,marginBottom:8}}>📞 {u.phone}</div>}
                            <div style={{display:"flex",gap:14,marginTop:6,paddingTop:8,borderTop:`1px solid ${C.border}`}}>
                              <div><span style={{fontSize:14,fontWeight:"bold",color:C.wine}}>{userBookings}</span><span style={{fontSize:10,color:C.textLight,marginLeft:4}}>{t.bookings}</span></div>
                              <div><span style={{fontSize:14,fontWeight:"bold",color:C.blue}}>{userPkgsCount}</span><span style={{fontSize:10,color:C.textLight,marginLeft:4}}>{t.packages}</span></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                }
              </>
            )}
          </div>
        )}
      </div>

      {/* Set Password Modal */}
      {showSetPasswordModal && viewingClient && (
        <div style={S.overlay} onClick={()=>setShowSetPasswordModal(false)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <h3 style={{margin:0,fontSize:16,color:C.text}}>🔑 {t.setNewPassword}</h3>
              <button onClick={()=>setShowSetPasswordModal(false)} style={{background:"none",border:"none",fontSize:20,color:C.textLight,cursor:"pointer"}}>×</button>
            </div>
            <p style={{margin:"0 0 14px",fontSize:12,color:C.textLight}}>{t.forClient} <b style={{color:C.wine}}>{getUserName(viewingClient)}</b></p>
            <input
              value={adminNewPassword}
              onChange={e=>setAdminNewPassword(e.target.value)}
              placeholder={t.enterNewPassword}
              type="password"
              style={S.input}
              onKeyDown={e=>e.key==="Enter"&&adminSetPassword(viewingClient)}
              autoFocus
            />
            <div style={{display:"flex",gap:8,marginTop:14}}>
              <button onClick={()=>setShowSetPasswordModal(false)} style={{...S.outlineBtn,flex:1,padding:"10px"}}>{t.cancelAction}</button>
              <button onClick={()=>adminSetPassword(viewingClient)} style={{...S.wineBtn,flex:1,padding:"10px",marginTop:0}}>{t.confirmSetPassword}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Package Modal */}
      {showPkgModal&&(
        <div style={S.overlay} onClick={()=>setShowPkgModal(false)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <h3 style={{margin:0,fontSize:16,color:C.text}}>{pkgStep===1?t.chooseType:t.chooseOption}</h3>
              <button onClick={()=>setShowPkgModal(false)} style={{background:"none",border:"none",fontSize:20,color:C.textLight,cursor:"pointer"}}>×</button>
            </div>
            <p style={{margin:"0 0 16px",fontSize:12,color:C.textLight}}>{t.forClient} <b style={{color:C.wine}}>{getUserName(selClientForPkg)}</b></p>
            {pkgStep===1
              ? <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {Object.entries(PACKAGES).map(([key,pkg])=>(
                    <button key={key} onClick={()=>{setSelPkgKey(key);setSelOptId(getOpts(key)[0]?.id||"");setPkgStep(2);}} style={{padding:"12px 14px",borderRadius:10,textAlign:"left",background:C.surface,border:`1px solid ${C.border}`,cursor:"pointer",fontFamily:"Georgia,serif",display:"flex",alignItems:"center",justifyContent:"space-between"}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=pkg.color;e.currentTarget.style.background=pkg.bg;}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.surface;}}>
                      <span style={{fontSize:14,color:C.text}}><span style={{marginRight:8}}>{pkg.icon}</span>{pkg.label}</span>
                      <span style={{fontSize:12,color:C.textLight}}>→</span>
                    </button>
                  ))}
                </div>
              : <div>
                  <button onClick={()=>setPkgStep(1)} style={{background:"none",border:"none",color:C.textLight,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:12,marginBottom:14,padding:0}}>{t.back}</button>
                  <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:18}}>
                    {PACKAGES[selPkgKey].groups
                      ? PACKAGES[selPkgKey].groups.map(g=>(
                          <div key={g.name}>
                            <div style={{fontSize:11,color:C.textLight,textTransform:"uppercase",letterSpacing:1,marginBottom:6,marginTop:5}}>{g.name}</div>
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
                  <button onClick={addPackage} style={{...S.wineBtn,width:"100%",padding:"12px",borderRadius:12}}>{t.confirmPackage}</button>
                </div>
            }
          </div>
        </div>
      )}
      <style>{CSS}</style>
    </div>
  );

  // ────────────────────────────────────────────────────────────────
  // CLIENT APP
  // ────────────────────────────────────────────────────────────────
  return (
    <div style={S.root}>
      {toast&&<div style={S.toastStyle(toast.type)}>{toast.msg}</div>}
      <div style={S.header}>
        <div style={S.headerBrand}>
          <NoaLogoBadge size={32}/>
          <div><div style={S.brandName}>NOA PILATES</div><div style={S.brandCity}>ERICEIRA</div></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={S.userPill}><span style={S.dot}/>{me?.name}</div>
          <button onClick={()=>setLang(l=>l==="en"?"pt":"en")} style={{...S.linkBtn,fontSize:11,margin:0,padding:0}}>{lang==="en"?"🇵🇹":"🇬🇧"}</button>
          <button onClick={doLogout} style={{...S.linkBtn,fontSize:11,margin:0,padding:0}}>{t.logout}</button>
        </div>
      </div>

      <div style={S.nav}>
        {[["book",t.classes],["packages",t.package],["profile",t.profile]].map(([v,lb])=>(
          <button key={v} onClick={()=>setTab(v)} style={{...S.navBtn,borderBottom:tab===v?`2px solid ${C.wine}`:"2px solid transparent",color:tab===v?C.wine:C.textMid,fontWeight:tab===v?"bold":"normal"}}>{lb}</button>
        ))}
      </div>

      <div style={S.page}>

        {/* BOOK TAB */}
        {tab==="book" && (
          <div>
            {activePkgFor(currentUser)&&(()=>{
              const p=activePkgFor(currentUser); const pkg=PACKAGES[p.pkgKey];
              return (
                <div style={{...S.card,marginBottom:14,borderLeft:`4px solid ${pkg.color}`,padding:"11px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:11,color:C.textLight,textTransform:"uppercase",letterSpacing:1}}>{t.activePackage}</div>
                    <div style={{fontSize:14,color:pkg.color,marginTop:2}}>{pkg.icon} {p.label}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:13,fontWeight:"bold",color:pkg.color}}>{p.sessions.length}{p.qty?`/${p.qty}`:""} {t.sessions}</div>
                    <div style={{fontSize:11,color:C.textLight}}>{t.autoLogged}</div>
                  </div>
                </div>
              );
            })()}

            <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
              {DAYS.map(day=>{
                const hasMine = SCHEDULE[day].some(s=>isBookedBy(day,s.time,currentUser));
                return (
                  <button key={day} onClick={()=>setSelectedDay(day)} style={{flexShrink:0,padding:"8px 12px",borderRadius:18,fontSize:11,fontFamily:"Georgia,serif",cursor:"pointer",background:selectedDay===day?C.wine:"#fff",color:selectedDay===day?"#fff":C.textMid,border:selectedDay===day?"none":`1px solid ${C.border}`,fontWeight:selectedDay===day?"bold":"normal",position:"relative"}}>
                    {shortDayLabel(day,lang)}
                    {hasMine&&<span style={{position:"absolute",top:3,right:3,width:5,height:5,borderRadius:"50%",background:C.green}}/>}
                  </button>
                );
              })}
            </div>

            <div style={{fontSize:15,color:C.wine,fontWeight:"bold",marginBottom:13,letterSpacing:.5}}>
              {dayLabel(selectedDay,lang)}
            </div>

            {SCHEDULE[selectedDay].map((slot,i)=>{
              const left = spotsLeft(selectedDay,slot.time);
              const booked = isBookedBy(selectedDay,slot.time,currentUser);
              const full = left===0&&!booked;
              const open = isOpen(selectedDay,slot.time);
              const locked = !open&&!booked;
              const cs = CLASS_STYLE[slot.name]||CLASS_STYLE.Reformer;
              const ts = slot.tag?(TAG_STYLE[slot.tag]||{}):null;
              return (
                <div key={i} style={{...S.card,marginBottom:9,borderLeft:`4px solid ${booked?C.green:full||locked?C.borderMid:cs.color}`,opacity:(full||locked)&&!booked?.6:1,animation:`fadeUp .28s ease ${i*.07}s both`}}>
                  <div style={{display:"flex",alignItems:"center",gap:11,padding:"12px 15px"}}>
                    <div style={{width:42,flexShrink:0,fontSize:14,fontWeight:"bold",color:booked?C.green:locked?C.textLight:cs.color}}>{slot.time}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
                        <span style={{fontSize:13,color:C.text}}>{slot.name}</span>
                        {slot.tag&&<span style={{...S.pill,background:ts.bg,color:ts.color,border:`1px solid ${ts.border}`}}>✦ {slot.tag}</span>}
                      </div>
                      <div style={{display:"flex",gap:7,marginTop:5,alignItems:"center",flexWrap:"wrap"}}>
                        <span style={{fontSize:11,color:C.textLight}}>⏱ {slot.tag==="Mom & Baby"?t.momBabyDuration:t.oneHour}</span>
                        <span style={{...S.pill,background:booked?C.greenPale:locked||full?C.redPale:left<=2?C.amberPale:C.surfaceAlt,color:booked?C.green:locked||full?C.red:left<=2?C.amber:C.textLight,border:`1px solid ${booked?C.greenBorder:locked||full?C.redBorder:left<=2?C.amberBorder:C.border}`}}>
                          {booked?t.booked:locked?t.closed:full?t.full:`${left} ${t.left}`}
                        </span>
                        {!booked&&open&&!full&&<span style={{fontSize:10,color:C.textLight}}>{deadlineLabel(selectedDay,slot.time,lang)}</span>}
                      </div>
                    </div>
                    <div style={{flexShrink:0}}>
                      {booked
                        ? open
                          ? <button onClick={()=>cancelBooking(selectedDay,slot.time)} style={S.cancelBtn}>{t.cancel}</button>
                          : <span style={{...S.pill,background:C.amberPale,color:C.amber,border:`1px solid ${C.amberBorder}`,padding:"5px 10px"}}>{t.locked}</span>
                        : <button onClick={()=>bookClass(selectedDay,slot)} disabled={full||locked} style={{...S.bookBtn,opacity:full||locked?.4:1,cursor:full||locked?"not-allowed":"pointer"}}>{full?t.full:locked?t.closed:t.book}</button>
                      }
                    </div>
                  </div>
                  <div style={{display:"flex",gap:5,padding:"0 15px 11px",alignItems:"center"}}>
                    {Array.from({length:MAX_SPOTS(slot.name)}).map((_,j)=>(
                      <div key={j} style={{width:7,height:7,borderRadius:"50%",background:j<(MAX_SPOTS(slot.name)-left)?(booked?C.green:C.wine):C.border}}/>
                    ))}
                    <span style={{fontSize:9,color:C.textLight,marginLeft:4}}>{left} {t.left}</span>
                  </div>
                </div>
              );
            })}

            <div style={S.notes}>
              <div style={S.noteItem}>{t.note1}</div>
              <div style={S.noteItem}>{t.note2}</div>
              <div style={S.noteItem}>{t.note3}</div>
              <div style={S.noteItem}>{t.note4}</div>
            </div>
          </div>
        )}

        {/* PACKAGES TAB */}
        {tab==="packages" && (
          <div>
            <h2 style={S.pageTitle}>{t.myPackage}</h2>

            {myPkgsFor(currentUser).length===0
              ? <div style={{...S.card,padding:32,textAlign:"center",marginBottom:18}}>
                  <div style={{fontSize:34,marginBottom:8}}>📦</div>
                  <div style={{fontSize:14,color:C.textMid,marginBottom:6}}>{t.noPackageTitle}</div>
                  <div style={{fontSize:12,color:C.textLight,lineHeight:1.5}}>{t.noPackageDesc}</div>
                </div>
              : myPkgsFor(currentUser).map((p,i)=>{
                  const pkg=PACKAGES[p.pkgKey];
                  const done=p.sessions.length;
                  const finished=isFinished(p);
                  return (
                    <div key={i} style={{...S.card,marginBottom:13,borderLeft:`4px solid ${pkg.color}`,animation:`fadeUp .28s ease ${i*.07}s both`}}>
                      <div style={{padding:"13px 15px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:9}}>
                          <div style={{flex:1}}>
                            <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                              <span style={{...S.pill,background:pkg.bg,color:pkg.color,border:`1px solid ${pkg.border}`}}>{pkg.icon} {pkg.label}</span>
                              {finished&&<span style={{...S.pill,background:C.greenPale,color:C.green,border:`1px solid ${C.greenBorder}`}}>{t.done}</span>}
                              {!p.paid&&<span style={{...S.pill,background:C.amberPale,color:C.amber,border:`1px solid ${C.amberBorder}`}}>{t.unpaid}</span>}
                            </div>
                            <div style={{fontSize:13,color:C.text,marginTop:6}}>{p.label}</div>
                            <div style={{fontSize:11,color:C.textLight,marginTop:2}}>{t.started} {p.startDate}{p.validity?` · ${p.validity}`:""}</div>
                          </div>
                          <div style={{textAlign:"right",flexShrink:0}}>
                            <div style={{fontSize:19,fontWeight:"bold",color:pkg.color}}>€{p.price}</div>
                            <div style={{fontSize:11,color:p.paid?C.green:C.amber}}>{p.paid?`${t.paid} ${p.paidDate}`:t.pendingPayment}</div>
                          </div>
                        </div>
                        {p.qty&&(
                          <div>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                              <span style={{fontSize:12,color:C.textMid}}>{done}/{p.qty} {t.sessionsDone}</span>
                              <span style={{fontSize:12,color:!finished&&p.qty-done<=2?C.red:C.textLight}}>{finished?t.completed:`${p.qty-done} ${t.sessionsRemaining}`}</span>
                            </div>
                            <div style={{background:C.border,borderRadius:4,height:6,overflow:"hidden"}}>
                              <div style={{width:`${Math.min(100,done/p.qty*100)}%`,height:"100%",background:finished?C.green:pkg.color,borderRadius:4}}/>
                            </div>
                          </div>
                        )}
                      </div>
                      {p.sessions.length>0&&(
                        <div style={{borderTop:`1px solid ${C.border}`,padding:"10px 15px"}}>
                          <div style={{fontSize:11,color:C.textLight,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{t.sessionsLog}</div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
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

            <div style={{marginTop:22}}>
              <div style={S.sectionLabel}>{t.availablePackages}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:10}}>
                {Object.entries(PACKAGES).map(([key,pkg])=>(
                  <div key={key} style={{...S.card,borderTop:`3px solid ${pkg.color}`,padding:"12px 14px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                      <span style={{fontSize:15}}>{pkg.icon}</span>
                      <span style={{fontSize:12,color:pkg.color,fontWeight:"bold"}}>{pkg.label}</span>
                    </div>
                    {pkg.groups
                      ? pkg.groups.map(g=>(
                          <div key={g.name} style={{marginBottom:8}}>
                            <div style={{fontSize:11,color:C.textLight,marginBottom:3}}>{g.name}</div>
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
                            {(o.validity||o.note)&&<div style={{fontSize:10,color:C.textLight,marginTop:1}}>{[o.validity,o.note].filter(Boolean).join(" · ")}</div>}
                          </div>
                        ))
                    }
                  </div>
                ))}
              </div>
              <p style={{fontSize:12,color:C.textLight,marginTop:11,textAlign:"center"}}>{t.contactStudio}</p>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {tab==="profile" && (
          <div>
            <h2 style={S.pageTitle}>{t.myProfile}</h2>

            <div style={{...S.card,padding:"18px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:54,height:54,borderRadius:"50%",background:`linear-gradient(135deg,${C.wineLight},${C.wine})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"#fff",fontWeight:"bold",flexShrink:0}}>
                {me.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
              </div>
              <div>
                <div style={{fontSize:17,color:C.text,fontWeight:"bold"}}>{me.name}</div>
                <div style={{fontSize:12,color:C.textLight,marginTop:2}}>@{me.username}</div>
              </div>
            </div>

            <div style={S.sectionLabel}>{t.contactInfo}</div>
            <div style={{...S.card,padding:"14px 16px",marginBottom:18}}>
              <div style={{display:"grid",gridTemplateColumns:"100px 1fr",gap:7,fontSize:13}}>
                <div style={{color:C.textLight}}>{t.email}:</div><div style={{color:C.text}}>{me.email}</div>
                <div style={{color:C.textLight}}>{t.phone}:</div><div style={{color:C.text}}>{me.phone||"—"}</div>
                <div style={{color:C.textLight}}>{t.joined}:</div><div style={{color:C.text}}>{me.joinedAt}</div>
              </div>
            </div>

            <div style={S.sectionLabel}>{t.upcoming}</div>
            {myBookingsList().length===0
              ? <div style={{...S.card,padding:18,textAlign:"center",color:C.textLight,marginBottom:18}}>{t.noClassesBooked}</div>
              : myBookingsList().map((slot,i)=>{
                  const open = isOpen(slot.day,slot.time);
                  return (
                    <div key={i} style={{...S.card,marginBottom:7,borderLeft:`4px solid ${C.green}`,animation:`fadeUp .28s ease ${i*.07}s both`}}>
                      <div style={{display:"flex",alignItems:"center",gap:11,padding:"11px 15px"}}>
                        <div style={{width:42,fontSize:13,fontWeight:"bold",color:C.green,flexShrink:0}}>{slot.time}</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:13,color:C.text}}>{slot.name}</div>
                          <div style={{fontSize:11,color:C.textLight,marginTop:2}}>{dayLabel(slot.day,lang)}</div>
                        </div>
                        {open
                          ? <button onClick={()=>cancelBooking(slot.day,slot.time)} style={S.cancelBtn}>{t.cancel}</button>
                          : <span style={{...S.pill,background:C.amberPale,color:C.amber,border:`1px solid ${C.amberBorder}`,padding:"5px 10px"}}>{t.locked}</span>
                        }
                      </div>
                    </div>
                  );
                })
            }
          </div>
        )}
      </div>

      <style>{CSS}</style>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────
const S = {
  root:{minHeight:"100vh",background:"#f5f0eb",color:"#3d1f28",fontFamily:"Georgia,'Times New Roman',serif"},
  splash:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"40px 24px"},
  splashLogo:{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:6},
  splashSub:{fontSize:11,letterSpacing:5,color:"#b09090",margin:"0 0 22px"},
  splashCard:{background:"#fff",borderRadius:14,padding:"22px 22px 18px",boxShadow:"0 4px 24px rgba(92,45,58,.1)",border:"1px solid #e8d8dc",width:"100%",maxWidth:340,display:"flex",flexDirection:"column",gap:10},
  input:{padding:"10px 14px",borderRadius:9,fontSize:14,border:"1px solid #e0d0d4",background:"#faf7f4",color:"#3d1f28",fontFamily:"Georgia,serif",outline:"none",width:"100%",boxSizing:"border-box"},
  wineBtn:{padding:"11px 22px",borderRadius:24,fontSize:13,background:"linear-gradient(135deg,#5c2d3a,#9a4a5a)",border:"none",color:"#fff",cursor:"pointer",fontFamily:"Georgia,serif",letterSpacing:1,boxShadow:"0 3px 12px rgba(92,45,58,.2)",marginTop:5},
  greenBtn:{padding:"9px 16px",borderRadius:20,fontSize:12,background:"linear-gradient(135deg,#3a6040,#5a8a6a)",border:"none",color:"#fff",cursor:"pointer",fontFamily:"Georgia,serif",marginTop:0},
  outlineBtn:{padding:"7px 13px",borderRadius:18,fontSize:12,background:"none",border:"1px solid #e8d8dc",color:"#7a4a55",cursor:"pointer",fontFamily:"Georgia,serif"},
  linkBtn:{background:"none",border:"none",color:"#9a6070",fontSize:11,cursor:"pointer",fontFamily:"Georgia,serif",textDecoration:"underline",marginTop:4,padding:0},
  header:{background:"#fff",borderBottom:"1px solid #e8d8dc",padding:"12px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 6px rgba(92,45,58,.07)"},
  headerBrand:{display:"flex",alignItems:"center",gap:9},
  brandName:{fontSize:13,fontWeight:"bold",letterSpacing:2,color:"#3d1f28"},
  brandCity:{fontSize:8,letterSpacing:3,color:"#c4a0a8"},
  userPill:{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:18,background:"#f5edef",color:"#5c2d3a",fontSize:11,border:"1px solid #e8d8dc",maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},
  dot:{width:6,height:6,borderRadius:"50%",background:"#4a7a5a",flexShrink:0},
  nav:{background:"#fff",borderBottom:"1px solid #e8d8dc",display:"flex",padding:"0 14px",overflowX:"auto"},
  navBtn:{padding:"11px 13px",fontSize:12,background:"none",border:"none",borderBottom:"2px solid transparent",cursor:"pointer",fontFamily:"Georgia,serif",whiteSpace:"nowrap"},
  page:{maxWidth:680,margin:"0 auto",padding:"18px 13px"},
  pageTitle:{margin:"0 0 14px",fontSize:17,fontWeight:"normal",color:"#3d1f28"},
  card:{background:"#fff",border:"1px solid #e8d8dc",borderRadius:11,boxShadow:"0 1px 4px rgba(92,45,58,.05)",overflow:"hidden"},
  pill:{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 8px",borderRadius:10,fontSize:11},
  bookBtn:{padding:"7px 14px",borderRadius:14,fontSize:12,background:"linear-gradient(135deg,#5c2d3a,#9a4a5a)",border:"none",color:"#fff",cursor:"pointer",fontFamily:"Georgia,serif",whiteSpace:"nowrap"},
  cancelBtn:{padding:"6px 12px",borderRadius:14,fontSize:11,background:"none",border:"1px solid #e8d8dc",color:"#9a4a55",cursor:"pointer",fontFamily:"Georgia,serif",whiteSpace:"nowrap"},
  sectionLabel:{fontSize:10,color:"#b09090",textTransform:"uppercase",letterSpacing:2,marginBottom:8,marginTop:4},
  notes:{marginTop:14,padding:"12px 14px",background:"#fff",borderRadius:10,border:"1px solid #e8d8dc"},
  noteItem:{fontSize:12,color:"#9a7080",marginBottom:4,lineHeight:1.5},
  adminDayHead:{fontSize:11,fontWeight:"bold",color:"#5c2d3a",textTransform:"uppercase",letterSpacing:2,padding:"6px 0 4px",borderBottom:"1px solid #e8d8dc",marginBottom:7},
  overlay:{position:"fixed",inset:0,background:"rgba(61,31,40,.4)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:1000},
  modal:{background:"#fff",borderRadius:"20px 20px 0 0",padding:"22px 20px 32px",width:"100%",maxWidth:480,maxHeight:"88vh",overflowY:"auto",boxShadow:"0 -8px 40px rgba(92,45,58,.18)"},
  toastStyle:type=>({position:"fixed",top:14,left:"50%",transform:"translateX(-50%)",zIndex:9999,padding:"9px 18px",borderRadius:24,whiteSpace:"nowrap",background:type==="warn"?"#f5e8e8":"#edf5f0",border:`1px solid ${type==="warn"?"#d4a0a0":"#b0d4bc"}`,color:type==="warn"?"#8a2828":"#4a7a5a",fontSize:13,boxShadow:"0 4px 20px rgba(92,45,58,.12)",animation:"slideDown .2s ease",fontFamily:"Georgia,serif",maxWidth:"90%",overflow:"hidden",textOverflow:"ellipsis"}),
};

const CSS = `
  @keyframes fadeUp    { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
  @keyframes slideDown { from { opacity:0; transform:translateX(-50%) translateY(-8px) } to { opacity:1; transform:translateX(-50%) translateY(0) } }
  * { box-sizing:border-box; }
  button { transition:opacity .15s; }
  button:hover { opacity:.85; }
  input:focus, select:focus { border-color:#9a4a5a !important; box-shadow:0 0 0 3px rgba(154,74,90,.1) !important; }
  ::-webkit-scrollbar { width:4px; height:4px; }
  ::-webkit-scrollbar-thumb { background:#e0cece; border-radius:4px; }
`;
