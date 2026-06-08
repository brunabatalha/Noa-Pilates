import { useState, useEffect } from "react";
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile as fbUpdateProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

// ── PERSISTENCE HELPERS ──────────────────────────────────────────────
// Wrapper around localStorage that gracefully handles SSR and disabled storage
const STORAGE_KEY = "noa_pilates_v1";
const loadState = () => {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
};
const saveState = (state) => {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
};
// Use stored value if it exists, otherwise the fallback
const persisted = loadState() || {};
const useP = (key, fallback) => useState(() => persisted[key] !== undefined ? persisted[key] : fallback);


// ── ADMIN CREDENTIALS ─────────────────────────────────────────────────
// The admin account is set up on first use (registered the first time someone
// tries to access the admin area). After that, it can only be modified from
// inside the admin panel (Admin Settings).
// NOTE: with no backend, admin credentials reset when the browser storage clears.
// When we wire up Firebase, this becomes properly persistent.

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
const LIGHT_C = {
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

const DARK_C = {
  bg:"#1a0f14", surface:"#2a1820", surfaceAlt:"#221318",
  border:"#3d2330", borderMid:"#4a2c3a",
  text:"#f0e0e5", textMid:"#c8a0b0", textLight:"#7a5a65",
  wine:"#d49aaa", wineLight:"#b87890", winePale:"#3d2330",
  green:"#7ab088", greenPale:"#1f3528", greenBorder:"#3d6048",
  amber:"#e0b870", amberPale:"#3a2a18", amberBorder:"#5a4020",
  red:"#e08080", redPale:"#3a1818", redBorder:"#5a2a2a",
  blue:"#90b0d0", bluePale:"#1a2530", blueBorder:"#384858",
  teal:"#80c0bc", tealPale:"#1a3030", tealBorder:"#385858",
};

// Default to light; component will override via state
let C = LIGHT_C;

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
    // Credit validation
    noCreditTitle:"No credit available",
    noCreditDesc:"To book this class please contact the studio to purchase a package.",
    noCreditForType:"No credit for this class type — contact the studio.",
    pkgNotPaid:"Your package is not paid yet — contact the studio.",
    pkgExpired:"Package expired",
    pkgWeeklyLimit:"Weekly limit reached for this package",
    pkgNoSessionsLeft:"No classes left in your package",
    creditReturned:"Credit returned to your package",
    expiresOn:"Expires",
    classesLeft:"left",
    weekUsed:"used this week",
    contactToBook:"📞 Contact studio to book",
    purchasePackage:"Buy a package",
    monthlyPlan:"Monthly plan",
    expiresIn:"Expires in",
    daysShort:"d",
    weekResetsOn:"Resets",
    // Admin tabs & features
    manageSchedule:"Manage Schedule",
    managePackages:"Manage Packages",
    adminSettings:"Admin Settings",
    addClass:"+ Add class",
    editClass:"Edit class",
    deleteClass:"Delete",
    saveChanges:"Save",
    classTime:"Time (e.g. 10:00)",
    className:"Class name",
    classTag:"Tag (optional)",
    extraCredits:"+ Extra credits",
    extendValidity:"Extend validity",
    grantBonus:"🎁 Grant bonus",
    bonusType:"Type",
    bonusQty:"Number of classes",
    bonusValidity:"Validity (days)",
    creditsAdded:"Credits added",
    daysAdded:"Days added",
    bonusGranted:"Bonus granted",
    unmarkPaid:"Unmark paid",
    expiryFromPayment:"Expiry from payment",
    notPaidYet:"Not paid yet",
    paidOn:"Paid",
    daysRemaining:"days remaining",
    expired:"EXPIRED",
    editProfile:"Edit Profile",
    currentPassword:"Current password",
    newPasswordOpt:"New password (leave empty to keep)",
    confirmNewPasswordOpt:"Confirm new password",
    saveProfile:"Save",
    profileUpdated:"Profile updated",
    classesBooked:"Classes booked",
    sessionsLogTitle:"Class history",
    // Waitlist
    joinWaitlist:"Join waitlist",
    onWaitlist:"On waitlist",
    leaveWaitlist:"Leave waitlist",
    waitlistPosition:"Position",
    spotAvailable:"🎉 A spot is available!",
    confirmIn:"Confirm within",
    offerExpired:"Offer expired — sign up again if you want",
    confirmSpot:"Confirm spot",
    declineSpot:"Decline",
    waitlistFull:"Class is full — join the waitlist?",
    waitlistFor:"Waitlist for",
    nobodyWaiting:"Nobody on waitlist",
    // No-show
    markNoShow:"Mark as no-show",
    noShow:"NO-SHOW",
    unmarkNoShow:"Remove no-show",
    noShowHistory:"No-show history",
    noShowsCount:"no-shows",
    confirmNoShowQ:"Mark this booking as no-show? The client's credit will stay consumed.",
    // Notes
    privateNotes:"Private notes",
    notesPlaceholder:"Health info, restrictions, preferences (visible only to admin)",
    saveNotes:"Save notes",
    healthFlag:"⚠️ Has notes",
    // Birthday
    birthday:"Birthday",
    bdayOptional:"Birthday (optional, day/month only)",
    day:"Day",
    month:"Month",
    bdayToday:"🎂 Birthday today!",
    upcomingBdays:"Upcoming birthdays",
    happyBirthday:"Happy Birthday",
    // Instructors
    instructors:"Instructors",
    manageInstructors:"Manage Instructors",
    addInstructor:"+ Add",
    instructor:"Instructor",
    noInstructor:"No instructor",
    selectInstructor:"Select",
    instructorName:"Instructor name",
    // Freeze
    freeze:"❄️ Freeze",
    freezeMembership:"Freeze package",
    freezeDays:"Days to freeze",
    freezeReason:"Reason (optional)",
    freezeReasonPlaceholder:"e.g. holidays, illness",
    frozenStatus:"FROZEN",
    unfreeze:"☀️ Unfreeze",
    frozenUntil:"Frozen until",
    daysShortLabel:"d",
    darkMode:"Dark mode",
    lightMode:"Light mode",
    thisWeek:"This week",
    nextWeek:"Next week",
    inWeeks:"In",
    weekN:"week",
    weeksN:"weeks",
    bookRecurring:"🔁 Book recurring",
    recurringTitle:"Book multiple weeks",
    recurringDesc:"Book this class for the upcoming weeks all at once.",
    recurringWeeksLabel:"Number of upcoming weeks (1-4)",
    bookAll:"Book all",
    recurringResult:"Booked",
    recurringSkipped:"skipped (no spots / no credit)",
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
    // Credit validation
    noCreditTitle:"Sem crédito disponível",
    noCreditDesc:"Para marcar esta aula, contacta o estúdio para comprar um pacote.",
    noCreditForType:"Sem crédito para este tipo de aula — contacta o estúdio.",
    pkgNotPaid:"O teu pacote ainda não está pago — contacta o estúdio.",
    pkgExpired:"Pacote expirado",
    pkgWeeklyLimit:"Limite semanal deste pacote atingido",
    pkgNoSessionsLeft:"Sem aulas restantes no teu pacote",
    creditReturned:"Crédito devolvido ao pacote",
    expiresOn:"Expira",
    classesLeft:"restantes",
    weekUsed:"usadas esta semana",
    contactToBook:"📞 Contacta o estúdio para marcar",
    purchasePackage:"Comprar pacote",
    monthlyPlan:"Plano mensal",
    expiresIn:"Expira em",
    daysShort:"d",
    weekResetsOn:"Reinicia",
    // Admin tabs & features
    manageSchedule:"Gerir Horário",
    managePackages:"Gerir Pacotes",
    adminSettings:"Definições Admin",
    addClass:"+ Adicionar aula",
    editClass:"Editar aula",
    deleteClass:"Apagar",
    saveChanges:"Guardar",
    classTime:"Hora (ex: 10:00)",
    className:"Nome da aula",
    classTag:"Etiqueta (opcional)",
    extraCredits:"+ Créditos extra",
    extendValidity:"Estender validade",
    grantBonus:"🎁 Atribuir bónus",
    bonusType:"Tipo",
    bonusQty:"Número de aulas",
    bonusValidity:"Validade (dias)",
    creditsAdded:"Créditos adicionados",
    daysAdded:"Dias adicionados",
    bonusGranted:"Bónus atribuído",
    unmarkPaid:"Remover pagamento",
    expiryFromPayment:"Validade desde pagamento",
    notPaidYet:"Ainda não pago",
    paidOn:"Pago",
    daysRemaining:"dias restantes",
    expired:"EXPIRADO",
    editProfile:"Editar Perfil",
    currentPassword:"Palavra-passe atual",
    newPasswordOpt:"Nova palavra-passe (deixa vazio para manter)",
    confirmNewPasswordOpt:"Confirmar nova palavra-passe",
    saveProfile:"Guardar",
    profileUpdated:"Perfil atualizado",
    classesBooked:"Aulas marcadas",
    sessionsLogTitle:"Histórico de aulas",
    // Waitlist
    joinWaitlist:"Entrar na lista de espera",
    onWaitlist:"Na lista de espera",
    leaveWaitlist:"Sair da lista",
    waitlistPosition:"Posição",
    spotAvailable:"🎉 Há um lugar disponível!",
    confirmIn:"Confirma dentro de",
    offerExpired:"Tempo expirado — podes voltar a inscrever-te",
    confirmSpot:"Confirmar lugar",
    declineSpot:"Recusar",
    waitlistFull:"A aula está cheia — entrar na lista de espera?",
    waitlistFor:"Lista de espera para",
    nobodyWaiting:"Lista vazia",
    // No-show
    markNoShow:"Marcar como falta",
    noShow:"FALTA",
    unmarkNoShow:"Remover falta",
    noShowHistory:"Histórico de faltas",
    noShowsCount:"faltas",
    confirmNoShowQ:"Marcar esta aula como falta? O crédito da cliente permanece consumido.",
    // Notes
    privateNotes:"Notas privadas",
    notesPlaceholder:"Saúde, restrições, preferências (visível só ao admin)",
    saveNotes:"Guardar notas",
    healthFlag:"⚠️ Tem notas",
    // Birthday
    birthday:"Aniversário",
    bdayOptional:"Aniversário (opcional, só dia/mês)",
    day:"Dia",
    month:"Mês",
    bdayToday:"🎂 Aniversário hoje!",
    upcomingBdays:"Aniversários próximos",
    happyBirthday:"Parabéns",
    // Instructors
    instructors:"Instrutoras",
    manageInstructors:"Gerir Instrutoras",
    addInstructor:"+ Adicionar",
    instructor:"Instrutora",
    noInstructor:"Sem instrutora",
    selectInstructor:"Selecionar",
    instructorName:"Nome da instrutora",
    // Freeze
    freeze:"❄️ Pausar",
    freezeMembership:"Pausar pacote",
    freezeDays:"Dias a pausar",
    freezeReason:"Motivo (opcional)",
    freezeReasonPlaceholder:"ex: férias, doença",
    frozenStatus:"PAUSADO",
    unfreeze:"☀️ Despausar",
    frozenUntil:"Pausado até",
    daysShortLabel:"d",
    darkMode:"Modo escuro",
    lightMode:"Modo claro",
    thisWeek:"Esta semana",
    nextWeek:"Próxima semana",
    inWeeks:"Daqui a",
    weekN:"semana",
    weeksN:"semanas",
    bookRecurring:"🔁 Marcar várias",
    recurringTitle:"Marcar várias semanas",
    recurringDesc:"Marca esta aula para as próximas semanas de uma vez.",
    recurringWeeksLabel:"Número de semanas seguintes (1-4)",
    bookAll:"Marcar todas",
    recurringResult:"Marcadas",
    recurringSkipped:"saltadas (sem lugar / crédito)",
  },
};

// ── SCHEDULE (default; admin can edit at runtime) ────────────────────
const DEFAULT_SCHEDULE = {
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

// ── PACKAGES (default; admin can edit prices at runtime) ─────────────
const DEFAULT_PACKAGES = {
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

// Get the Date for a weekday N weeks from now (0 = next occurrence, 1 = +1 week).
const dateForDayInWeek = (dayName, weekOffset = 0) => {
  const base = nextOccurrenceOfDay(dayName);
  const d = new Date(base);
  d.setDate(d.getDate() + (weekOffset * 7));
  return d;
};

// ISO date string YYYY-MM-DD
const isoDate = (d) => {
  const dt = d instanceof Date ? d : new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth()+1).padStart(2,"0");
  const day = String(dt.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
};

// Format day label like "Monday, May 5"
const dayLabel = (dayName, lang, weekOffset = 0) => {
  const t = T[lang];
  const d = dateForDayInWeek(dayName, weekOffset);
  return `${t.days[dayName]}, ${t.monthNames[d.getMonth()]} ${d.getDate()}`;
};
const shortDayLabel = (dayName, lang, weekOffset = 0) => {
  const d = dateForDayInWeek(dayName, weekOffset);
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

const mkEntry = (catKey,opt) => {
  const now = lisbonNow();
  return {
    id:Date.now()+Math.random(), pkgKey:catKey, optId:opt.id,
    label:opt.label, qty:opt.qty||null, price:opt.price,
    validity:opt.validity||null, note:opt.note||null,
    paid:false, paidDate:null, startDate:fmt(now),
    purchaseTs: now.getTime(),  // timestamp for validity calculations
    sessions:[],
  };
};

// Stable lookup of which package keys are monthly (does NOT change when admin edits prices)
const PKG_IS_MONTHLY = {
  membership: true,
  reformer: false,
  mat: false,
  combo: false,
  visitor: false,
  private: false,
  intro: false,
};

// ── CREDIT VALIDATION HELPERS ────────────────────────────────────────
// Categorize a class name to a "type" used to match packages
// "reformer" or "mat" — reformer-tagged classes are reformer; everything mat-named is mat
const classTypeOf = (className) => {
  if (!className) return "other";
  if (className === "Reformer") return "reformer";
  if (className === "Mat" || className === "Dynamic Mat" || className === "Mat Pilates") return "mat";
  return "other";
};

// Parse a validity string like "6 weeks", "12 weeks", "3 months", "6 months", "2 weeks"
// Returns number of days, or null if no validity (drop-in / private — short term, treat as 30 days fallback)
const validityToDays = (v) => {
  if (!v) return null;
  const m = v.match(/(\d+)\s*(week|weeks|month|months)/i);
  if (!m) return null;
  const n = parseInt(m[1],10);
  if (m[2].toLowerCase().startsWith("week")) return n*7;
  return n*30;
};

// Returns the expiry timestamp of a package, or null if no expiry applies
// IMPORTANT: validity counts from the PAYMENT date, not the purchase date.
// If the package isn't paid yet, the package has no credits available (handled elsewhere).
const pkgExpiryTs = (p) => {
  // Use paidTs as the start of the validity window. Fall back to purchaseTs
  // for legacy packages that were created before this feature existed.
  const start = p.paidTs || p.purchaseTs || null;
  if (!start) return null;
  // Allow admin to extend validity manually (extraDays added on top)
  const extraDays = p.extraValidityDays || 0;
  // Monthly memberships → 30 days from payment
  const isMonthly = PKG_IS_MONTHLY[p.pkgKey];
  if (isMonthly) return start + (30 + extraDays)*24*60*60*1000;
  // Class packages → use validity string
  const days = validityToDays(p.validity);
  if (days == null) {
    // No fixed validity (drop-in / private / trial). Still respect extra days if any.
    if (extraDays > 0) return start + extraDays*24*60*60*1000;
    return null;
  }
  return start + (days + extraDays)*24*60*60*1000;
};

// Is the package within its validity window?
const pkgIsValid = (p) => {
  const exp = pkgExpiryTs(p);
  if (exp == null) return true; // drop-ins never expire
  return lisbonNow().getTime() < exp;
};

// Days remaining until expiry (for display)
const pkgDaysLeft = (p) => {
  const exp = pkgExpiryTs(p);
  if (exp == null) return null;
  const ms = exp - lisbonNow().getTime();
  if (ms <= 0) return 0;
  return Math.ceil(ms / (24*60*60*1000));
};

// Sessions left for a package (qty - used). For mix&match combos returns total sessions left.
// Includes any extraSessions granted by admin (for memberships without qty, this is the only counter).
const pkgSessionsLeft = (p) => {
  const used = p.sessions?.length || 0;
  if (p.qty != null) {
    return p.qty - used;
  }
  // No qty (membership) — extraSessions is an add-on bucket the admin can grant
  if (p.extraSessions != null) return p.extraSessions - used;
  return Infinity;
};

// For Combo Mix & Match: how many sessions of a specific type are left
// Combo packages: half of qty is reformer, half is mat (5+5 or 10+10)
const comboTypeLeft = (p, type) => {
  if (p.pkgKey !== "combo") return null;
  const half = p.qty / 2;
  const usedOfType = (p.sessions || []).filter(s => classTypeOf(s.class) === type).length;
  return half - usedOfType;
};

// What types of classes does this package allow?
// Returns an array of types: ["reformer"], ["mat"], ["reformer","mat"], or [] (private/duo/trial)
const pkgAllowedTypes = (p) => {
  const key = p.pkgKey;
  if (key === "reformer") return ["reformer"];
  if (key === "mat") return ["mat"];
  if (key === "combo") return ["reformer","mat"];
  if (key === "visitor") {
    // Two visitor passes: 3 Reformer (vis_ref) or 3 Mat (vis_mat)
    if (p.optId === "vis_ref") return ["reformer"];
    if (p.optId === "vis_mat") return ["mat"];
    return [];
  }
  if (key === "membership") {
    // Memberships: identify by optId
    if (p.optId?.startsWith("ref_")) return ["reformer"];
    if (p.optId?.startsWith("mat_")) return ["mat"];
    if (p.optId?.startsWith("combo_")) return ["reformer","mat"];
    return [];
  }
  // private, intro — not for group classes
  return [];
};

// For monthly memberships: how many classes per week does this plan allow?
const membershipWeeklyAllowance = (p) => {
  if (p.pkgKey !== "membership") return null;
  const id = p.optId || "";
  if (id === "ref_ul") return Infinity; // unlimited
  if (id === "ref_1x" || id === "mat_1x") return 1;
  if (id === "ref_2x" || id === "mat_2x") return 2;
  if (id === "ref_3x" || id === "mat_3x") return 3;
  if (id === "combo_m") return 2; // 1 reformer + 1 mat = 2 total per week
  return null;
};

// Get the start of the week (Monday 00:00 Lisbon) containing the given Date
const startOfWeekMonday = (d) => {
  const dt = new Date(d);
  dt.setHours(0,0,0,0);
  const day = dt.getDay(); // 0=Sun..6=Sat
  const diff = (day === 0 ? -6 : 1 - day); // shift to Monday
  dt.setDate(dt.getDate() + diff);
  return dt;
};

// For a membership package: count how many of its sessions fall in the same week as `targetDate` (a Date object)
const membershipUsedInWeekOf = (p, targetDate) => {
  const weekStart = startOfWeekMonday(targetDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  return (p.sessions || []).filter(s => {
    if (!s.bookedTs) return false;
    return s.bookedTs >= weekStart.getTime() && s.bookedTs < weekEnd.getTime();
  }).length;
};

// For combo membership specifically — count usage by type within the target week
const membershipUsedInWeekOfByType = (p, targetDate, type) => {
  const weekStart = startOfWeekMonday(targetDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  return (p.sessions || []).filter(s => {
    if (!s.bookedTs) return false;
    if (classTypeOf(s.class) !== type) return false;
    return s.bookedTs >= weekStart.getTime() && s.bookedTs < weekEnd.getTime();
  }).length;
};

// Find the best usable package for a given client booking a given class on a given target date.
// Returns { pkg, reason } where pkg is the package object to use (mutated by caller) or null,
// and reason is a string indicating why nothing is usable (for the UI message).
//
// Rules in order of preference:
//   1. Package must be PAID
//   2. Package must allow the class type
//   3. Package must be within validity
//   4. Must have sessions left (or weekly allowance not yet hit, for memberships)
//   5. Prefer non-membership packs (consume class packages first), then memberships
//      (this keeps class-pass credits from being wasted while memberships renew anyway)
const findUsablePackage = (pkgs, className, targetDate) => {
  if (!pkgs || pkgs.length === 0) return { pkg:null, reason:"none" };
  const type = classTypeOf(className);
  if (type === "other") return { pkg:null, reason:"none" };

  // Filter to packages that match TYPE (regardless of paid/valid/etc, for diagnostic)
  const typeMatching = pkgs.filter(p => pkgAllowedTypes(p).includes(type));
  if (typeMatching.length === 0) return { pkg:null, reason:"wrongType" };

  // Of those, the ones that are PAID
  const paid = typeMatching.filter(p => p.paid);
  if (paid.length === 0) return { pkg:null, reason:"notPaid" };

  // Of paid, the ones VALID (not expired)
  const valid = paid.filter(pkgIsValid);
  if (valid.length === 0) return { pkg:null, reason:"expired" };

  // Of valid, those that have credit available to use right now
  const usable = valid.filter(p => {
    // Memberships: weekly allowance check
    if (p.pkgKey === "membership") {
      const allowance = membershipWeeklyAllowance(p);
      if (allowance === Infinity) return true;
      // For combo membership, check the per-type counter
      if (p.optId === "combo_m") {
        return membershipUsedInWeekOfByType(p, targetDate, type) < 1;
      }
      return membershipUsedInWeekOf(p, targetDate) < allowance;
    }
    // Combo Mix & Match: check the per-type half
    if (p.pkgKey === "combo") {
      const left = comboTypeLeft(p, type);
      return left > 0;
    }
    // Standard packs (reformer, mat, visitor, private, intro)
    return pkgSessionsLeft(p) > 0;
  });

  if (usable.length === 0) {
    // No usable package — could be exhausted pack or weekly limit on membership
    const anyMembership = valid.some(p => p.pkgKey === "membership");
    return { pkg:null, reason: anyMembership ? "weekLimit" : "noSessionsLeft" };
  }

  // Preference: consume non-memberships first (their credits are finite)
  // Within each group, prefer the one expiring soonest
  const sortByExpiry = (a,b) => {
    const ea = pkgExpiryTs(a) ?? Infinity;
    const eb = pkgExpiryTs(b) ?? Infinity;
    return ea - eb;
  };
  const nonMember = usable.filter(p => p.pkgKey !== "membership").sort(sortByExpiry);
  const member = usable.filter(p => p.pkgKey === "membership").sort(sortByExpiry);
  return { pkg: (nonMember[0] || member[0]), reason:"ok" };
};

// ─────────────────────────────────────────────────────────────────────
export default function NoaPilates() {
  // Auth — users now comes from Firestore (live subscription) instead of localStorage
  const [users, setUsers] = useState({});  // { email: {name, username, phone, joinedAt, uid, role, ...} }
  const [resetTokens, setResetTokens] = useP("resetTokens", {});
  const [adminAccount, setAdminAccount] = useP("adminAccount", null);

  // Auth — session-only
  const [currentUser, setCurrentUser] = useState(null);  // email of logged-in user, or "__admin__"
  const [authMode, setAuthMode] = useState("client"); // "client" | "admin"
  const [authView, setAuthView] = useState("login"); // "login" | "signup" | "forgot" | "reset"
  const [resetLink, setResetLink] = useState(""); // shown after request
  const [resetTokenInput, setResetTokenInput] = useState("");
  const [lang, setLang] = useP("lang", "en");
  const [darkMode, setDarkMode] = useP("darkMode", false);

  // Apply theme: mutate C so all inline styles using C.* pick up the right palette.
  Object.assign(C, darkMode ? DARK_C : LIGHT_C);

  // Apply theme to <body> via data-theme attribute, picked up by CSS rules.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // ── FIREBASE AUTH STATE LISTENER ──────────────────────────────────
  // Fires whenever Firebase auth state changes (login, logout, page reload).
  // Keeps our local `currentUser` in sync with Firebase Auth.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        // No one signed in
        setCurrentUser(null);
        return;
      }
      // Someone is signed in — fetch their profile from Firestore
      try {
        const snap = await getDoc(doc(db, "users", fbUser.uid));
        if (snap.exists()) {
          const profile = snap.data();
          // Cache profile in local users map keyed by email so existing UI continues to work
          setUsers(prev => ({...prev, [profile.email]: { ...profile, uid: fbUser.uid }}));
          // Admin uses the magic sentinel value "__admin__", clients use their email
          if (profile.role === "admin") {
            setCurrentUser("__admin__");
            // Make sure adminAccount is set so the existing isAdmin logic works
            if (!adminAccount || adminAccount.email !== profile.email) {
              setAdminAccount({ email: profile.email, uid: fbUser.uid });
            }
          } else {
            setCurrentUser(profile.email);
          }
        } else {
          // Auth user exists but no Firestore profile — shouldn't happen in normal flow
          // Sign them out to keep state consistent
          await fbSignOut(auth);
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── FIRESTORE LIVE: USERS ──────────────────────────────────────────
  // Subscribe to the entire /users collection (admin sees all; clients see all
  // for now — Phase 3 will scope this down with proper rules).
  // Only attached once the user is signed in (rules require auth).
  useEffect(() => {
    if (!currentUser) {
      setUsers({});
      return;
    }
    const unsub = onSnapshot(
      collection(db, "users"),
      (snap) => {
        const next = {};
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          if (data?.email) next[data.email] = { ...data, uid: docSnap.id };
        });
        setUsers(next);
      },
      (err) => {
        console.error("users listener error:", err);
      }
    );
    return () => unsub();
  }, [currentUser]);

  // ── FIRESTORE LIVE: CLIENT PACKAGES ────────────────────────────────
  // Subscribe to all client packages. Documents have an `email` field that
  // we group by, so the existing UI keyed by email continues to work.
  useEffect(() => {
    if (!currentUser) {
      setClientPkgs({});
      return;
    }
    const unsub = onSnapshot(
      collection(db, "clientPackages"),
      (snap) => {
        const grouped = {};
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          const email = data?.email;
          if (!email) return;
          if (!grouped[email]) grouped[email] = [];
          // Store the firestoreId so we can update/delete later, while keeping `id` for UI compatibility
          grouped[email].push({ ...data, id: docSnap.id, firestoreId: docSnap.id });
        });
        setClientPkgs(grouped);
      },
      (err) => {
        console.error("clientPackages listener error:", err);
      }
    );
    return () => unsub();
  }, [currentUser]);

  // ── FIRESTORE LIVE: BOOKINGS ───────────────────────────────────────
  // Subscribe to all bookings. Documents have `classKey` ("YYYY-MM-DD|HH:MM")
  // and we group by that into the slotKey-indexed object the UI already expects.
  useEffect(() => {
    if (!currentUser) {
      setBookings({});
      return;
    }
    const unsub = onSnapshot(
      collection(db, "bookings"),
      (snap) => {
        const grouped = {};
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          const k = data?.classKey;
          if (!k) return;
          if (!grouped[k]) grouped[k] = [];
          // Keep the firestoreId so we can delete later when cancelling
          grouped[k].push({ ...data, firestoreId: docSnap.id });
        });
        // Sort each slot's bookings by timestamp so ordering is stable
        Object.keys(grouped).forEach(k => {
          grouped[k].sort((a, b) => (a.ts || "").localeCompare(b.ts || ""));
        });
        setBookings(grouped);
      },
      (err) => {
        console.error("bookings listener error:", err);
      }
    );
    return () => unsub();
  }, [currentUser]);

  // ── FIRESTORE LIVE: WAITLIST ───────────────────────────────────────
  // Subscribe to the entire waitlist collection. Documents have `classKey`,
  // `email`, `joinedTs`, `notified`, `notifiedTs`. We group by classKey and
  // sort by joinedTs so the queue order stays stable across devices.
  useEffect(() => {
    if (!currentUser) {
      setWaitlist({});
      return;
    }
    const unsub = onSnapshot(
      collection(db, "waitlist"),
      (snap) => {
        const grouped = {};
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          const k = data?.classKey;
          if (!k) return;
          if (!grouped[k]) grouped[k] = [];
          grouped[k].push({ ...data, ts: data.joinedTs, firestoreId: docSnap.id });
        });
        // Sort by joinedTs so the first person to join is always first in the queue
        Object.keys(grouped).forEach(k => {
          grouped[k].sort((a, b) => (a.joinedTs || 0) - (b.joinedTs || 0));
        });
        setWaitlist(grouped);
      },
      (err) => {
        console.error("waitlist listener error:", err);
      }
    );
    return () => unsub();
  }, [currentUser]);

  // Auth form
  const [fName, setFName] = useState("");
  const [fUsername, setFUsername] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fPassword, setFPassword] = useState("");
  const [fConfirm, setFConfirm] = useState("");
  const [fBdayDay, setFBdayDay] = useState("");
  const [fBdayMonth, setFBdayMonth] = useState("");

  // App state
  const [tab, setTab] = useState("book");
  const [adminTab, setAdminTab] = useState("schedule");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, max 3 (4 weeks ahead)

  // PERSISTED data
  // bookings now from Firestore — live subscription
  const [bookings, setBookings] = useState({});  // { [slotKey]: [ {email, ts, classDate, ...} ] }
  // clientPkgs now from Firestore — live subscription
  const [clientPkgs, setClientPkgs] = useState({});  // { email: [ {id, pkgKey, qty, sessions, paid, ...} ] }
  const [PACKAGES, setPackages] = useP("packages_config", DEFAULT_PACKAGES);
  const [SCHEDULE, setSchedule] = useP("schedule_config", DEFAULT_SCHEDULE);

  // Lote 1 — new persisted state
  // waitlist now from Firestore — live subscription
  const [waitlist, setWaitlist] = useState({});           // { slotKey: [ {email, ts, notified, firestoreId} ] }
  const [noShows, setNoShows] = useP("noShows", {});               // { "email|slotKey": { date, note } }
  const [clientNotes, setClientNotes] = useP("clientNotes", {});  // { email: "free text" }
  // Lote 2 — instructors
  const [instructors, setInstructors] = useP("instructors", ["Noa"]);
  // Lote 2 — freezes (paused packages)
  const [freezes, setFreezes] = useP("freezes", {}); // { pkgId: { startTs, endTs, days, reason } }

  // Admin/UI states (NOT persisted)
  const [showAdminSettings, setShowAdminSettings] = useState(false);

  // Bonus / extra credits modals (admin)
  const [showExtraCreditsModal, setShowExtraCreditsModal] = useState(null);
  const [extraCreditsAmount, setExtraCreditsAmount] = useState("");
  const [showExtendValidityModal, setShowExtendValidityModal] = useState(null);
  const [extendDaysAmount, setExtendDaysAmount] = useState("");
  const [showBonusPkgModal, setShowBonusPkgModal] = useState(false);
  const [bonusType, setBonusType] = useState("reformer");
  const [bonusQty, setBonusQty] = useState("");
  const [bonusValidityDays, setBonusValidityDays] = useState("30");

  // Lote 1 — modal/UI state for new features
  const [showNotesModal, setShowNotesModal] = useState(false);     // edit notes for viewingClient
  const [notesDraft, setNotesDraft] = useState("");
  const [showNoShowConfirm, setShowNoShowConfirm] = useState(null); // { email, slotKey, day, time }
  const [pendingWaitlistOffer, setPendingWaitlistOffer] = useState(null); // { day, time } when client should confirm

  // Schedule editing
  const [showScheduleEditor, setShowScheduleEditor] = useState(null);
  const [scheduleEditDay, setScheduleEditDay] = useState("Monday");
  const [scheduleEditTime, setScheduleEditTime] = useState("");
  const [scheduleEditName, setScheduleEditName] = useState("Reformer");
  const [scheduleEditTag, setScheduleEditTag] = useState("");
  const [scheduleEditInstructor, setScheduleEditInstructor] = useState("");

  // Instructors modal
  const [showInstructorsModal, setShowInstructorsModal] = useState(false);
  const [newInstructorName, setNewInstructorName] = useState("");

  // Freeze modal
  const [showFreezeModal, setShowFreezeModal] = useState(null); // pkgId or null
  const [freezeDays, setFreezeDays] = useState("");
  const [freezeReason, setFreezeReason] = useState("");

  // Recurring booking modal
  const [showRecurringModal, setShowRecurringModal] = useState(null); // {day, slot} or null
  const [recurringWeeks, setRecurringWeeks] = useState(2);

  // Edit profile modal (client)
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [epName, setEpName] = useState("");
  const [epPhone, setEpPhone] = useState("");
  const [epBdayDay, setEpBdayDay] = useState("");
  const [epBdayMonth, setEpBdayMonth] = useState("");
  const [epCurrentPwd, setEpCurrentPwd] = useState("");
  const [epNewPwd, setEpNewPwd] = useState("");
  const [epConfirmPwd, setEpConfirmPwd] = useState("");

  const [showPkgModal, setShowPkgModal] = useState(false);
  const [pkgStep, setPkgStep] = useState(1);
  const [selPkgKey, setSelPkgKey] = useState("reformer");
  const [selOptId, setSelOptId] = useState("ref_10");
  const [selClientForPkg, setSelClientForPkg] = useState("");
  const [viewingClient, setViewingClient] = useState(null);
  const [adminResetLink, setAdminResetLink] = useState("");
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const [adminNewPassword, setAdminNewPassword] = useState("");

  // Auto-save persisted state whenever it changes.
  // users, clientPkgs, bookings and waitlist now live in Firestore — no longer persisted here.
  useEffect(() => {
    saveState({
      resetTokens, adminAccount, lang,
      packages_config: PACKAGES, schedule_config: SCHEDULE,
      noShows, clientNotes,
      instructors, freezes,
    });
  }, [resetTokens, adminAccount, lang, PACKAGES, SCHEDULE, noShows, clientNotes, instructors, freezes]);

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
  // slotKey identifies a class instance by its CALENDAR DATE.
  // If dateOverride is null, defaults to next occurrence of `day`.
  // Format: `YYYY-MM-DD|HH:MM`
  const slotKey = (day, time, dateOverride = null) => {
    const d = dateOverride instanceof Date ? dateOverride : nextOccurrenceOfDay(day);
    return `${isoDate(d)}|${time}`;
  };
  const spotsLeft = (day,time,dateOverride=null) => {
    const s = SCHEDULE[day]?.find(x=>x.time===time);
    return MAX_SPOTS(s?.name||"") - ((bookings[slotKey(day,time,dateOverride)]||[]).length);
  };
  const isBookedBy = (day,time,email,dateOverride=null) => (bookings[slotKey(day,time,dateOverride)]||[]).some(b=>b.email===email);
  const myPkgsFor = (email) => clientPkgs[email]||[];
  const activePkgFor = (email) => myPkgsFor(email).find(p=>p.qty?p.sessions.length<p.qty:true);
  const getOpts = key => { const p=PACKAGES[key]; return p.groups?p.groups.flatMap(g=>g.opts):(p.opts||[]); };

  const allClientEmails = () => Object.keys(users);
  const getUserName = email => users[email]?.name || email;

  // Auth actions
  const resetForm = () => {
    setFName(""); setFUsername(""); setFEmail(""); setFPhone(""); setFPassword(""); setFConfirm("");
    setFBdayDay(""); setFBdayMonth("");
  };

  const doSignUp = async () => {
    if (!fName.trim()||!fUsername.trim()||!fEmail.trim()||!fPassword) { fire(t.fillAllFields,"warn"); return; }
    const email = fEmail.trim().toLowerCase();
    // Username check still uses local cache (Firestore-side username uniqueness comes in Phase 2)
    if (Object.values(users).some(u=>u.username.toLowerCase()===fUsername.trim().toLowerCase())) { fire(t.usernameExists,"warn"); return; }
    if (fPassword.length < 6) { fire(lang==="pt"?"Palavra-passe precisa de pelo menos 6 caracteres":"Password needs at least 6 characters","warn"); return; }
    if (fPassword !== fConfirm) { fire(t.passwordsMatch,"warn"); return; }

    try {
      // Create the Firebase Auth account first
      const cred = await createUserWithEmailAndPassword(auth, email, fPassword);
      // Save the additional profile info in Firestore (under /users/{uid})
      const profile = {
        name: fName.trim(),
        username: fUsername.trim(),
        email,
        phone: fPhone.trim(),
        joinedAt: fmt(lisbonNow()),
        bdayDay: fBdayDay ? parseInt(fBdayDay,10) : null,
        bdayMonth: fBdayMonth ? parseInt(fBdayMonth,10) : null,
        role: "client",
      };
      await setDoc(doc(db, "users", cred.user.uid), profile);

      // Also keep a copy in local `users` map keyed by email so the existing UI continues to work
      // (Phase 2 will replace this with live Firestore queries.)
      setUsers(prev => ({...prev, [email]: { ...profile, uid: cred.user.uid }}));
      // currentUser will be set automatically by the onAuthStateChanged listener
      fire(`${t.accountCreated} ${fName.trim()}!`);
      resetForm();
    } catch (err) {
      const code = err?.code || "";
      if (code === "auth/email-already-in-use") fire(t.emailExists, "warn");
      else if (code === "auth/invalid-email") fire(lang==="pt"?"Email inválido":"Invalid email", "warn");
      else if (code === "auth/weak-password") fire(lang==="pt"?"Palavra-passe muito fraca":"Password too weak", "warn");
      else fire(lang==="pt"?`Erro: ${err?.message || code}`:`Error: ${err?.message || code}`, "warn");
    }
  };

  // Now uses Firebase: sends a real email with a reset link.
  const requestPasswordReset = async () => {
    const email = fEmail.trim().toLowerCase();
    if (!email) { fire(t.fillAllFields,"warn"); return; }
    try {
      await sendPasswordResetEmail(auth, email);
      // For privacy, always show the same success message even if the email doesn't exist
      fire(lang==="pt"?"Email de recuperação enviado ✓ Verifica a caixa de entrada (e o spam).":"Reset email sent ✓ Check your inbox (and spam folder).", "success");
      setAuthView("login");
      resetForm();
    } catch (err) {
      const code = err?.code || "";
      if (code === "auth/invalid-email") fire(lang==="pt"?"Email inválido":"Invalid email","warn");
      else if (code === "auth/user-not-found") {
        // Don't reveal that an email isn't registered — privacy best practice
        fire(lang==="pt"?"Email de recuperação enviado ✓ Verifica a caixa de entrada (e o spam).":"Reset email sent ✓ Check your inbox.","success");
        setAuthView("login");
        resetForm();
      }
      else fire(lang==="pt"?`Erro: ${err?.message || code}`:`Error: ${err?.message || code}`, "warn");
    }
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

  const doSignIn = async () => {
    const email = fEmail.trim().toLowerCase();
    if (!email || !fPassword) { fire(t.fillAllFields,"warn"); return; }
    try {
      const cred = await signInWithEmailAndPassword(auth, email, fPassword);
      // Load the user profile from Firestore so we have name, role, etc.
      const snap = await getDoc(doc(db, "users", cred.user.uid));
      if (snap.exists()) {
        const profile = snap.data();
        setUsers(prev => ({...prev, [email]: { ...profile, uid: cred.user.uid }}));
        fire(`${t.welcomeBack}, ${profile.name}!`);
      } else {
        // Auth user without a profile — shouldn't happen in normal flow
        fire(t.welcomeBack);
      }
      resetForm();
      // currentUser will be set by onAuthStateChanged
    } catch (err) {
      const code = err?.code || "";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
        fire(t.invalidLogin,"warn");
      } else if (code === "auth/too-many-requests") {
        fire(lang==="pt"?"Muitas tentativas. Tenta novamente daqui a uns minutos.":"Too many attempts. Try again in a few minutes.","warn");
      } else {
        fire(lang==="pt"?`Erro: ${err?.message || code}`:`Error: ${err?.message || code}`, "warn");
      }
    }
  };

  // Admin login — admin is a regular Firebase user with role: "admin" in their profile.
  // First admin is set up the first time someone uses this flow (no admin exists yet).
  const doAdminLogin = async () => {
    const email = fEmail.trim().toLowerCase();
    if (!email || !fPassword) { fire(t.fillAllFields,"warn"); return; }

    if (!adminAccount) {
      // First-time setup — create the admin account in Firebase Auth + Firestore
      if (fPassword.length < 6) { fire(lang==="pt"?"Palavra-passe precisa de pelo menos 6 caracteres":"Password needs at least 6 characters","warn"); return; }
      if (fPassword !== fConfirm) { fire(t.passwordsMatch,"warn"); return; }
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, fPassword);
        const adminProfile = {
          name: lang==="pt" ? "Administrador" : "Administrator",
          username: "admin",
          email,
          phone: "",
          joinedAt: fmt(lisbonNow()),
          role: "admin",
        };
        await setDoc(doc(db, "users", cred.user.uid), adminProfile);
        setAdminAccount({ email, uid: cred.user.uid }); // password no longer stored
        fire(lang==="pt"?"Conta admin criada! ✓":"Admin account created! ✓");
        resetForm();
      } catch (err) {
        const code = err?.code || "";
        if (code === "auth/email-already-in-use") fire(t.emailExists, "warn");
        else if (code === "auth/invalid-email") fire(lang==="pt"?"Email inválido":"Invalid email", "warn");
        else if (code === "auth/weak-password") fire(lang==="pt"?"Palavra-passe muito fraca (mín. 6 caracteres)":"Password too weak (min 6 chars)", "warn");
        else fire(lang==="pt"?`Erro: ${err?.message || code}`:`Error: ${err?.message || code}`, "warn");
      }
      return;
    }

    // Subsequent admin logins — sign in via Firebase and check the role flag
    try {
      const cred = await signInWithEmailAndPassword(auth, email, fPassword);
      const snap = await getDoc(doc(db, "users", cred.user.uid));
      if (snap.exists() && snap.data().role === "admin") {
        fire("Admin ✓");
        resetForm();
        // currentUser will be set by onAuthStateChanged
      } else {
        // This Firebase user exists but isn't an admin — sign them out
        await fbSignOut(auth);
        fire(t.invalidAdmin,"warn");
      }
    } catch (err) {
      fire(t.invalidAdmin,"warn");
    }
  };

  // Admin: update own credentials — for now only email change is supported through this UI.
  // Password change for admin is via the same "Forgot password" flow (Firebase email reset).
  const updateAdminCredentials = async (newEmail, currentPassword, newPassword) => {
    fire(lang==="pt"?"Para alterar email/palavra-passe usa o reset por email":"To change email/password use the email reset","warn");
  };

  const doLogout = async () => {
    try { await fbSignOut(auth); } catch (e) { /* ignore */ }
    setCurrentUser(null);
    resetForm();
    setAuthMode("client");
    setAuthView("login");
  };

  // Client: edit own profile
  const openEditProfile = () => {
    setEpName(me?.name || "");
    setEpPhone(me?.phone || "");
    setEpBdayDay(me?.bdayDay ? String(me.bdayDay) : "");
    setEpBdayMonth(me?.bdayMonth ? String(me.bdayMonth) : "");
    setEpCurrentPwd(""); setEpNewPwd(""); setEpConfirmPwd("");
    setShowEditProfile(true);
  };
  const saveEditProfile = async () => {
    if (!epName.trim()) { fire(t.fillAllFields,"warn"); return; }
    const existing = users[currentUser] || {};
    const updates = {
      name: epName.trim(),
      phone: epPhone.trim(),
      bdayDay: epBdayDay ? parseInt(epBdayDay,10) : null,
      bdayMonth: epBdayMonth ? parseInt(epBdayMonth,10) : null,
    };
    // Note: password change is now done via the "Forgot password" flow (Firebase email reset).
    // The old password fields in this modal are kept for backward compatibility but ignored.
    if (epNewPwd) {
      fire(lang==="pt"?"Para alterar a palavra-passe usa 'Recuperar palavra-passe' no ecrã de login":"To change password use 'Forgot password' on the login screen","warn");
      return;
    }
    try {
      // Update the document in Firestore — onSnapshot will refresh local `users`
      if (existing.uid) {
        await updateDoc(doc(db, "users", existing.uid), updates);
      } else {
        fire(lang==="pt"?"Conta sem ID Firebase":"Account missing Firebase ID","warn");
        return;
      }
      setShowEditProfile(false);
      fire(lang==="pt"?"Perfil atualizado ✓":"Profile updated ✓");
    } catch (err) {
      fire(lang==="pt"?`Erro: ${err?.message}`:`Error: ${err?.message}`, "warn");
    }
  };

  // Admin: schedule editing
  const upsertSlot = () => {
    if (!scheduleEditTime.trim() || !scheduleEditName.trim()) { fire(t.fillAllFields,"warn"); return; }
    const newSlot = { time: scheduleEditTime.trim(), name: scheduleEditName.trim(), tag: scheduleEditTag.trim() || null, instructor: scheduleEditInstructor || null };
    setSchedule(prev => {
      const next = { ...prev };
      if (showScheduleEditor === "new") {
        next[scheduleEditDay] = [...(next[scheduleEditDay]||[]), newSlot].sort((a,b)=>a.time.localeCompare(b.time));
      } else if (showScheduleEditor && typeof showScheduleEditor === "object") {
        const { day, idx } = showScheduleEditor;
        next[day] = next[day].map((s,i)=>i===idx?newSlot:s).sort((a,b)=>a.time.localeCompare(b.time));
      }
      return next;
    });
    setShowScheduleEditor(null);
    fire(lang==="pt"?"Aula atualizada ✓":"Class saved ✓");
  };
  const deleteSlot = (day, idx) => {
    if (!confirm(lang==="pt"?"Apagar esta aula? As marcações existentes serão mantidas.":"Delete this class? Existing bookings stay.")) return;
    setSchedule(prev => {
      const next = { ...prev };
      next[day] = next[day].filter((_,i)=>i!==idx);
      return next;
    });
    fire(lang==="pt"?"Aula removida":"Class removed","warn");
  };

  // Admin: edit package option price/label
  const updatePackageOption = (pkgKey, optId, field, value) => {
    setPackages(prev => {
      const next = { ...prev };
      const cat = { ...next[pkgKey] };
      if (cat.groups) {
        cat.groups = cat.groups.map(g => ({
          ...g,
          opts: g.opts.map(o => o.id === optId ? { ...o, [field]: value } : o),
        }));
      } else if (cat.opts) {
        cat.opts = cat.opts.map(o => o.id === optId ? { ...o, [field]: value } : o);
      }
      next[pkgKey] = cat;
      return next;
    });
  };

  // Booking
  const bookClass = async (day,slot,targetDate=null) => {
    const d = targetDate || nextOccurrenceOfDay(day);
    if (!isAdmin && !isOpen(day,slot.time)) { fire(t.bookingClosed,"warn"); return; }
    if (spotsLeft(day,slot.time,d)<=0) { fire(t.classFull,"warn"); return; }
    if (isBookedBy(day,slot.time,currentUser,d)) { fire(t.alreadyBooked,"warn"); return; }
    const sk = slotKey(day, slot.time, d);
    const dateStr = isoDate(d);

    // ADMIN bypasses all credit checks (can book anyone freely)
    if (!isAdmin) {
      const userPkgs = myPkgsFor(currentUser);
      const { pkg: usable, reason } = findUsablePackage(userPkgs, slot.name, d);
      if (!usable) {
        if (reason === "none") fire(t.noCreditDesc,"warn");
        else if (reason === "wrongType") fire(t.noCreditForType,"warn");
        else if (reason === "notPaid") fire(t.pkgNotPaid,"warn");
        else if (reason === "expired") fire(t.pkgExpired,"warn");
        else if (reason === "weekLimit") fire(t.pkgWeeklyLimit,"warn");
        else if (reason === "noSessionsLeft") fire(t.pkgNoSessionsLeft,"warn");
        else fire(t.noCreditDesc,"warn");
        return;
      }
      // Write booking to Firestore — onSnapshot will refresh the local bookings state
      try {
        await addDoc(collection(db, "bookings"), {
          email: currentUser,
          classKey: sk,
          classDate: dateStr,
          day,
          time: slot.time,
          className: slot.name,
          ts: new Date().toISOString(),
        });
        // Log session into the chosen package
        const newSession = {id:Date.now(), date:fmt(d), class:slot.name, time:slot.time, day, classDate:dateStr, bookedTs:d.getTime()};
        await updateDoc(doc(db, "clientPackages", usable.id), {
          sessions: [...(usable.sessions||[]), newSession],
        });
        fire(`${t.bookedAnd} ${PACKAGES[usable.pkgKey]?.label} ✓`);
      } catch (err) {
        fire(lang==="pt"?`Erro: ${err?.message}`:`Error: ${err?.message}`, "warn");
      }
      return;
    }

    // ADMIN PATH — book without credit check
    try {
      await addDoc(collection(db, "bookings"), {
        email: currentUser,
        classKey: sk,
        classDate: dateStr,
        day,
        time: slot.time,
        className: slot.name,
        ts: new Date().toISOString(),
        byAdmin: true,
      });
      fire(`${slot.time} ${slot.name} ${lang==="pt"?"marcado!":"booked!"}`);
    } catch (err) {
      fire(lang==="pt"?`Erro: ${err?.message}`:`Error: ${err?.message}`, "warn");
    }
  };

  // Book the same class for N upcoming weeks. Validates each week independently.
  const bookRecurring = async (day, slot, weeks) => {
    if (!weeks || weeks <= 0) return;
    let booked = 0, skipped = 0;
    const occurrences = [];
    for (let w = 0; w < weeks; w++) {
      occurrences.push(dateForDayInWeek(day, weekOffset + w));
    }

    // Track planned booking writes and per-package session updates
    const bookingWrites = [];  // array of {sk, dateStr, occDate}
    const pkgUpdates = {};  // pkgId -> updated sessions array
    // Working copy of bookings + clientPkgs so credit & spot checks see prior bookings in this loop
    const workingBookings = { ...bookings };
    const workingPkgs = { [currentUser]: (clientPkgs[currentUser]||[]).map(p => ({...p, sessions: [...(p.sessions||[])]})) };

    for (const occDate of occurrences) {
      const sk = slotKey(day, slot.time, occDate);
      const dateStr = isoDate(occDate);
      if ((workingBookings[sk]||[]).find(b => b.email === currentUser)) { skipped++; continue; }
      if ((workingBookings[sk]||[]).length >= MAX_SPOTS(slot.name)) { skipped++; continue; }
      const { pkg: usable } = findUsablePackage(workingPkgs[currentUser], slot.name, occDate);
      if (!usable) { skipped++; continue; }
      workingBookings[sk] = [...(workingBookings[sk]||[]), {email: currentUser, ts: new Date().toISOString(), classDate: dateStr}];
      const newSession = {id: Date.now()+Math.random(), date: fmt(occDate), class: slot.name, time: slot.time, day, classDate: dateStr, bookedTs: occDate.getTime()};
      workingPkgs[currentUser] = workingPkgs[currentUser].map(p => p.id === usable.id
        ? {...p, sessions: [...(p.sessions||[]), newSession]}
        : p);
      pkgUpdates[usable.id] = workingPkgs[currentUser].find(p => p.id === usable.id).sessions;
      bookingWrites.push({ sk, dateStr, occDate });
      booked++;
    }

    // Commit booking writes + package updates to Firestore in parallel
    try {
      await Promise.all([
        ...bookingWrites.map(({sk, dateStr}) => addDoc(collection(db, "bookings"), {
          email: currentUser,
          classKey: sk,
          classDate: dateStr,
          day,
          time: slot.time,
          className: slot.name,
          ts: new Date().toISOString(),
          recurring: true,
        })),
        ...Object.entries(pkgUpdates).map(([pkgId, sessions]) =>
          updateDoc(doc(db, "clientPackages", pkgId), { sessions })
        ),
      ]);
    } catch (err) {
      console.error("Recurring booking failed:", err);
      fire(lang==="pt"?`Erro: ${err?.message}`:`Error: ${err?.message}`, "warn");
      return;
    }
    setShowRecurringModal(null);

    if (booked > 0) {
      fire(`✓ ${booked} ${booked===1?t.weekN:t.weeksN} ${t.recurringResult}${skipped>0?` · ${skipped} ${t.recurringSkipped}`:""}`);
    } else {
      fire(t.recurringSkipped, "warn");
    }
  };

  const cancelBooking = async (day,time,email=currentUser,dateOverride=null) => {
    const d = dateOverride || nextOccurrenceOfDay(day);
    if (!isAdmin && !isOpen(day,time)) { fire(t.cancellationClosed,"warn"); return; }
    const sk = slotKey(day,time,d);
    const dateStr = isoDate(d);
    // Find this user's booking doc in Firestore for this slot and delete it
    const existingBooking = (bookings[sk] || []).find(b => b.email === email);
    if (existingBooking?.firestoreId) {
      try {
        await deleteDoc(doc(db, "bookings", existingBooking.firestoreId));
      } catch (err) {
        console.error("Failed to delete booking:", err);
        fire(lang==="pt"?`Erro: ${err?.message}`:`Error: ${err?.message}`, "warn");
        return;
      }
    }
    // Return credit: find the package + session and update in Firestore
    const userList = clientPkgs[email];
    if (userList) {
      for (const p of userList) {
        const idx = (p.sessions||[]).findIndex(s =>
          (s.classDate ? s.classDate === dateStr && s.time===time : s.day===day && s.time===time)
        );
        if (idx !== -1) {
          const newSessions = [...p.sessions];
          newSessions.splice(idx,1);
          try {
            await updateDoc(doc(db, "clientPackages", p.id), { sessions: newSessions });
          } catch (err) {
            console.error("Failed to refund credit:", err);
          }
          break;
        }
      }
    }
    // Notify the next person on the waitlist (if any) — update Firestore
    const queue = waitlist[sk] || [];
    if (queue.length > 0 && !queue[0].notified && queue[0].firestoreId) {
      try {
        await updateDoc(doc(db, "waitlist", queue[0].firestoreId), {
          notified: true,
          notifiedTs: Date.now(),
        });
      } catch (err) {
        console.error("Failed to notify waitlist:", err);
      }
    }
    fire(t.bookingCancelled,"warn");
  };

  // ── WAITLIST ──────────────────────────────────────────────────────
  // When someone is notified that a spot is available, they have this much time to confirm
  // before the offer expires and the next person gets notified.
  const WAITLIST_TIMEOUT_MS = 2 * 60 * 60 * 1000; // 2 hours

  // Process every waitlist slot to:
  //  - Detect expired notifications (notifiedTs + WAITLIST_TIMEOUT_MS < now)
  //  - Remove the expired person from the queue (delete Firestore doc)
  //  - Notify the next person in line (update Firestore doc)
  // Runs whenever app loads and every minute; idempotent (safe to call repeatedly).
  const processWaitlistTimeouts = async () => {
    const now = Date.now();
    const deletes = [];
    const notifies = [];
    for (const [sk, queue] of Object.entries(waitlist || {})) {
      if (!queue || queue.length === 0) continue;
      let q = [...queue];
      // Cascade through expired notifications: if head expired, drop and notify the next
      while (q.length > 0 && q[0].notified && q[0].notifiedTs && (q[0].notifiedTs + WAITLIST_TIMEOUT_MS) < now) {
        const expired = q.shift();
        if (expired.firestoreId) deletes.push(expired.firestoreId);
        if (q.length > 0 && !q[0].notified && q[0].firestoreId) {
          notifies.push(q[0].firestoreId);
          // Mark locally so we don't re-process in this same loop iteration if multiple expire
          q[0] = { ...q[0], notified: true, notifiedTs: now };
        }
      }
    }
    // Run Firestore writes in parallel — onSnapshot will update local state
    try {
      await Promise.all([
        ...deletes.map(id => deleteDoc(doc(db, "waitlist", id))),
        ...notifies.map(id => updateDoc(doc(db, "waitlist", id), { notified: true, notifiedTs: now })),
      ]);
    } catch (err) {
      console.error("Waitlist timeout processing failed:", err);
    }
  };

  // Run on mount and again every minute while app is open, so timeouts fire even if
  // the user just sits on the page for a long time.
  useEffect(() => {
    processWaitlistTimeouts(); // immediate on load
    const interval = setInterval(processWaitlistTimeouts, 60 * 1000); // every 1 min
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitlist]);

  const joinWaitlist = async (day, time, dateOverride=null) => {
    const d = dateOverride || nextOccurrenceOfDay(day);
    const sk = slotKey(day, time, d);
    const dateStr = isoDate(d);
    const queue = waitlist[sk] || [];
    if (queue.find(w => w.email === currentUser)) {
      fire(lang==="pt"?"Já estás na lista de espera":"Already on the waitlist","warn");
      return;
    }
    const slot = (SCHEDULE[day]||[]).find(s => s.time === time);
    try {
      await addDoc(collection(db, "waitlist"), {
        email: currentUser,
        classKey: sk,
        classDate: dateStr,
        day,
        time,
        className: slot?.name || "",
        joinedTs: Date.now(),
        notified: false,
        notifiedTs: null,
      });
      fire(lang==="pt"?"Adicionado à lista de espera ✓":"Added to waitlist ✓");
    } catch (err) {
      fire(lang==="pt"?`Erro: ${err?.message}`:`Error: ${err?.message}`, "warn");
    }
  };

  const leaveWaitlist = async (day, time, email = currentUser, dateOverride=null) => {
    const sk = slotKey(day, time, dateOverride);
    const queue = waitlist[sk] || [];
    const entry = queue.find(w => w.email === email);
    if (!entry?.firestoreId) {
      fire(lang==="pt"?"Não estás na lista":"Not on waitlist","warn");
      return;
    }
    const wasNotifiedHead = queue[0]?.email === email && queue[0]?.notified;
    const next = queue[1];
    try {
      const ops = [deleteDoc(doc(db, "waitlist", entry.firestoreId))];
      // If the person leaving was the notified head, promote the next person
      if (wasNotifiedHead && next?.firestoreId && !next.notified) {
        ops.push(updateDoc(doc(db, "waitlist", next.firestoreId), {
          notified: true,
          notifiedTs: Date.now(),
        }));
      }
      await Promise.all(ops);
      fire(lang==="pt"?"Removido da lista":"Removed from waitlist","warn");
    } catch (err) {
      fire(lang==="pt"?`Erro: ${err?.message}`:`Error: ${err?.message}`, "warn");
    }
  };

  const myWaitlistEntry = (day, time, dateOverride=null) => {
    const sk = slotKey(day, time, dateOverride);
    return (waitlist[sk] || []).find(w => w.email === currentUser) || null;
  };

  const waitlistTimeLeft = (day, time, email, dateOverride=null) => {
    const sk = slotKey(day, time, dateOverride);
    const queue = waitlist[sk] || [];
    const entry = queue.find(w => w.email === email);
    if (!entry || !entry.notified || !entry.notifiedTs) return null;
    const remaining = (entry.notifiedTs + WAITLIST_TIMEOUT_MS) - Date.now();
    return remaining > 0 ? remaining : 0;
  };

  // Format the time left in a friendly way: "1h 23m" or "45m" or "expired"
  const formatTimeLeft = (ms) => {
    if (ms == null) return "";
    if (ms <= 0) return lang==="pt" ? "expirado" : "expired";
    const totalMin = Math.ceil(ms / 60000);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const acceptWaitlistOffer = async (day, time, dateOverride=null) => {
    const d = dateOverride || nextOccurrenceOfDay(day);
    const sk = slotKey(day, time, d);
    const dateStr = isoDate(d);
    const slot = (SCHEDULE[day]||[]).find(s=>s.time===time);
    if (!slot) { fire("Class not found","warn"); return; }
    const tl = waitlistTimeLeft(day, time, currentUser, d);
    if (tl != null && tl <= 0) {
      fire(lang==="pt"?"O tempo para confirmar expirou":"Confirmation time expired","warn");
      processWaitlistTimeouts();
      return;
    }
    if (spotsLeft(day, time, d) <= 0) {
      fire(lang==="pt"?"Já não há lugares":"No spots available anymore","warn");
      const myEntry = (waitlist[sk] || []).find(w => w.email === currentUser);
      if (myEntry?.firestoreId) {
        try { await deleteDoc(doc(db, "waitlist", myEntry.firestoreId)); } catch (e) {}
      }
      return;
    }
    const userPkgs = myPkgsFor(currentUser);
    const { pkg: usable, reason } = findUsablePackage(userPkgs, slot.name, d);
    if (!usable) {
      fire(reason==="notPaid"?t.pkgNotPaid:reason==="expired"?t.pkgExpired:t.noCreditDesc,"warn");
      return;
    }
    // Log session in Firestore
    const newSession = {id:Date.now(), date:fmt(d), class:slot.name, time:slot.time, day, classDate:dateStr, bookedTs:d.getTime()};
    try {
      // Write booking to Firestore
      await addDoc(collection(db, "bookings"), {
        email: currentUser,
        classKey: sk,
        classDate: dateStr,
        day,
        time: slot.time,
        className: slot.name,
        ts: new Date().toISOString(),
        fromWaitlist: true,
      });
      await updateDoc(doc(db, "clientPackages", usable.id), {
        sessions: [...(usable.sessions||[]), newSession],
      });
    } catch (err) {
      console.error("Failed to accept waitlist offer:", err);
      fire(lang==="pt"?`Erro: ${err?.message}`:`Error: ${err?.message}`, "warn");
      return;
    }
    // Remove this user from waitlist in Firestore
    const myEntry = (waitlist[sk] || []).find(w => w.email === currentUser);
    if (myEntry?.firestoreId) {
      try { await deleteDoc(doc(db, "waitlist", myEntry.firestoreId)); } catch (e) {}
    }
    setPendingWaitlistOffer(null);
    fire(`✓ ${slot.time} ${slot.name} ${lang==="pt"?"marcada!":"booked!"}`);
  };

  const adminAddBooking = async (day, time, email, dateOverride=null) => {
    const d = dateOverride || nextOccurrenceOfDay(day);
    const sk = slotKey(day, time, d);
    const dateStr = isoDate(d);
    if (isBookedBy(day, time, email, d)) { fire(t.alreadyBookedOrFull, "warn"); return; }
    if (spotsLeft(day, time, d) <= 0) { fire(t.alreadyBookedOrFull, "warn"); return; }

    const queue = waitlist[sk] || [];
    const isCuttingLine = queue.length > 0 && !queue.find(w => w.email === email);
    if (isCuttingLine) {
      const msg = lang==="pt"
        ? `⚠️ Há ${queue.length} pessoa${queue.length>1?"s":""} na lista de espera para esta aula.\n\nAdicionar ${getUserName(email)} mesmo assim?\n\n(As pessoas em fila não serão avisadas.)`
        : `⚠️ There ${queue.length>1?"are":"is"} ${queue.length} person${queue.length>1?"s":""} on the waitlist for this class.\n\nAdd ${getUserName(email)} anyway?\n\n(Waitlist members won't be notified.)`;
      if (!confirm(msg)) return;
    }

    const slot = (SCHEDULE[day]||[]).find(s => s.time === time);
    try {
      await addDoc(collection(db, "bookings"), {
        email,
        classKey: sk,
        classDate: dateStr,
        day,
        time,
        className: slot?.name || "",
        ts: new Date().toISOString(),
        byAdmin: true,
        priorWaitlistCount: queue.length,
      });
    } catch (err) {
      fire(lang==="pt"?`Erro: ${err?.message}`:`Error: ${err?.message}`, "warn");
      return;
    }

    // If the added user was in the waitlist, remove them and promote next person if needed
    const existingEntry = queue.find(w => w.email === email);
    if (existingEntry?.firestoreId) {
      const wasNotifiedHead = queue[0]?.email === email && queue[0]?.notified;
      const next = queue[1];
      try {
        const ops = [deleteDoc(doc(db, "waitlist", existingEntry.firestoreId))];
        if (wasNotifiedHead && next?.firestoreId && !next.notified) {
          ops.push(updateDoc(doc(db, "waitlist", next.firestoreId), {
            notified: true,
            notifiedTs: Date.now(),
          }));
        }
        await Promise.all(ops);
      } catch (err) {
        console.error("Failed to clean waitlist:", err);
      }
    }

    if (isCuttingLine) {
      fire(`${getUserName(email)} ${t.addedTo} ${time} (${lang==="pt"?"à frente de":"ahead of"} ${queue.length})`,"warn");
    } else {
      fire(`${getUserName(email)} ${t.addedTo} ${time}`);
    }
  };

  // ── NO-SHOW ───────────────────────────────────────────────────────
  const markNoShow = (email, day, time, note="", dateOverride=null) => {
    const d = dateOverride || nextOccurrenceOfDay(day);
    const sk = slotKey(day, time, d);
    const key = `${email}|${sk}`;
    setNoShows(prev => ({...prev, [key]: { date: fmt(d), day, time, note, classDate: isoDate(d) }}));
    fire(lang==="pt"?"No-show registado":"No-show recorded","warn");
  };
  const unmarkNoShow = (email, day, time, dateOverride=null) => {
    const d = dateOverride || nextOccurrenceOfDay(day);
    const sk = slotKey(day, time, d);
    const key = `${email}|${sk}`;
    setNoShows(prev => {
      const next = {...prev};
      delete next[key];
      return next;
    });
    fire(lang==="pt"?"Removido":"Removed");
  };
  const isNoShow = (email, day, time, dateOverride=null) => {
    return !!noShows[`${email}|${slotKey(day,time,dateOverride)}`];
  };
  const noShowsFor = (email) => {
    return Object.entries(noShows)
      .filter(([k]) => k.startsWith(`${email}|`))
      .map(([k, v]) => v);
  };

  // ── PRIVATE NOTES (admin only) ────────────────────────────────────
  const saveClientNote = (email, text) => {
    setClientNotes(prev => ({...prev, [email]: text}));
    fire(lang==="pt"?"Notas guardadas":"Notes saved");
  };

  // ── BIRTHDAY HELPERS ───────────────────────────────────────────────
  const isBirthdayToday = (u) => {
    if (!u?.bdayDay || !u?.bdayMonth) return false;
    const now = lisbonNow();
    return now.getDate() === u.bdayDay && (now.getMonth()+1) === u.bdayMonth;
  };
  const daysUntilBday = (u) => {
    if (!u?.bdayDay || !u?.bdayMonth) return null;
    const now = lisbonNow();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let next = new Date(now.getFullYear(), u.bdayMonth-1, u.bdayDay);
    if (next < todayMidnight) {
      next = new Date(now.getFullYear()+1, u.bdayMonth-1, u.bdayDay);
    }
    return Math.round((next - todayMidnight) / (24*60*60*1000));
  };
  const upcomingBirthdays = (withinDays = 30) => {
    return Object.values(users)
      .filter(u => u.bdayDay && u.bdayMonth)
      .map(u => ({...u, daysUntil: daysUntilBday(u)}))
      .filter(u => u.daysUntil != null && u.daysUntil <= withinDays)
      .sort((a,b) => a.daysUntil - b.daysUntil);
  };

  // ── INSTRUCTORS ────────────────────────────────────────────────────
  const addInstructor = (name) => {
    const trimmed = (name||"").trim();
    if (!trimmed) return;
    if (instructors.includes(trimmed)) { fire(lang==="pt"?"Já existe":"Already exists","warn"); return; }
    setInstructors(prev => [...prev, trimmed]);
    setNewInstructorName("");
    fire(`+ ${trimmed} ✓`);
  };
  const removeInstructor = (name) => {
    if (!confirm(lang==="pt"?`Remover ${name}? Aulas associadas ficam sem instrutora.`:`Remove ${name}? Classes will lose their instructor.`)) return;
    setInstructors(prev => prev.filter(i => i !== name));
    setSchedule(prev => {
      const next = {...prev};
      for (const day of Object.keys(next)) {
        next[day] = (next[day]||[]).map(slot => slot.instructor === name ? {...slot, instructor: null} : slot);
      }
      return next;
    });
    fire(`- ${name}`,"warn");
  };

  // ── FREEZE / PAUSA DE PACOTE ──────────────────────────────────────
  // Freezing extends the package validity by the same number of days,
  // so the user keeps the days they had when the freeze started.
  const freezePackage = async (email, pkgId, days, reason="") => {
    if (!days || days <= 0) { fire(lang==="pt"?"Insere um número válido":"Enter a valid number","warn"); return; }
    const now = Date.now();
    const endTs = now + days*24*60*60*1000;
    // Save freeze state in localStorage (admin-only metadata for now)
    setFreezes(prev => ({...prev, [pkgId]: { startTs: now, endTs, days, reason, email }}));
    try {
      // Extend validity by the freeze period — this is the canonical user-visible effect
      const p = (clientPkgs[email]||[]).find(p => p.id === pkgId);
      const newExtra = (p?.extraValidityDays || 0) + days;
      await updateDoc(doc(db, "clientPackages", pkgId), { extraValidityDays: newExtra });
      fire(`❄️ ${lang==="pt"?"Pacote pausado":"Package frozen"} ✓`);
    } catch (err) {
      fire(lang==="pt"?`Erro: ${err?.message}`:`Error: ${err?.message}`, "warn");
    }
  };
  const unfreezePackage = (email, pkgId) => {
    const f = freezes[pkgId];
    if (!f) return;
    setFreezes(prev => {
      const next = {...prev};
      delete next[pkgId];
      return next;
    });
    fire(`☀️ ${lang==="pt"?"Pacote despausado":"Package unfrozen"} ✓`);
  };
  const isFrozen = (pkgId) => {
    const f = freezes[pkgId];
    if (!f) return false;
    return Date.now() < f.endTs;
  };
  const freezeInfo = (pkgId) => freezes[pkgId];

  // Packages
  const addPackage = async () => {
    if (!selClientForPkg) { fire("Select a client","warn"); return; }
    const opt = getOpts(selPkgKey).find(o=>o.id===selOptId)||getOpts(selPkgKey)[0];
    const entry = mkEntry(selPkgKey, opt);
    // Remove the local `id` — Firestore will generate its own document ID.
    // Add the email so we can group by client.
    delete entry.id;
    entry.email = selClientForPkg;
    try {
      await addDoc(collection(db, "clientPackages"), entry);
      setShowPkgModal(false);
      fire(`${t.packageAdded} ${getUserName(selClientForPkg)}!`);
    } catch (err) {
      fire(lang==="pt"?`Erro: ${err?.message}`:`Error: ${err?.message}`, "warn");
    }
  };

  const markPaid = async (email,pkgId) => {
    const now = lisbonNow();
    try {
      await updateDoc(doc(db, "clientPackages", pkgId), {
        paid: true,
        paidDate: fmt(now),
        paidTs: now.getTime(),
      });
      fire(t.paymentMarked);
    } catch (err) {
      fire(lang==="pt"?`Erro: ${err?.message}`:`Error: ${err?.message}`, "warn");
    }
  };

  // Admin: unmark a payment (e.g. mistake correction)
  const unmarkPaid = async (email,pkgId) => {
    try {
      await updateDoc(doc(db, "clientPackages", pkgId), {
        paid: false,
        paidDate: null,
        paidTs: null,
      });
      fire(lang==="pt"?"Pagamento removido":"Payment unmarked","warn");
    } catch (err) {
      fire(lang==="pt"?`Erro: ${err?.message}`:`Error: ${err?.message}`, "warn");
    }
  };

  // Admin: add extra credits to an existing package (e.g. bonus)
  const addExtraCredits = async (email,pkgId,extra) => {
    if (!extra || extra <= 0) { fire(lang==="pt"?"Insere um número válido":"Enter a valid number","warn"); return; }
    try {
      // Find the current package in local state to know whether to update qty or extraSessions
      const p = (clientPkgs[email]||[]).find(p => p.id === pkgId);
      if (!p) { fire(lang==="pt"?"Pacote não encontrado":"Package not found","warn"); return; }
      const updates = p.qty != null
        ? { qty: p.qty + extra }
        : { extraSessions: (p.extraSessions||0) + extra };
      await updateDoc(doc(db, "clientPackages", pkgId), updates);
      fire(`+${extra} ${lang==="pt"?"créditos adicionados":"credits added"} ✓`);
    } catch (err) {
      fire(lang==="pt"?`Erro: ${err?.message}`:`Error: ${err?.message}`, "warn");
    }
  };

  // Admin: extend validity by N days
  const extendValidity = async (email,pkgId,days) => {
    if (!days || days <= 0) { fire(lang==="pt"?"Insere um número válido de dias":"Enter a valid number of days","warn"); return; }
    try {
      const p = (clientPkgs[email]||[]).find(p => p.id === pkgId);
      if (!p) { fire(lang==="pt"?"Pacote não encontrado":"Package not found","warn"); return; }
      await updateDoc(doc(db, "clientPackages", pkgId), {
        extraValidityDays: (p.extraValidityDays||0) + days,
      });
      fire(`+${days} ${lang==="pt"?"dias adicionados":"days added"} ✓`);
    } catch (err) {
      fire(lang==="pt"?`Erro: ${err?.message}`:`Error: ${err?.message}`, "warn");
    }
  };

  // Admin: grant a free bonus package (with custom validity in days)
  const grantBonusPackage = async (email, classType, qty, validityDays) => {
    if (!qty || qty <= 0) { fire(lang==="pt"?"Insere um número válido":"Enter a valid number","warn"); return; }
    const now = lisbonNow();
    const pkgKey = classType === "reformer" ? "reformer" : classType === "mat" ? "mat" : "combo";
    const optId = `bonus_${classType}_${Date.now()}`;
    const validityStr = validityDays && validityDays > 0
      ? `${validityDays} day${validityDays>1?"s":""}`
      : null;
    // For combo bonuses, qty must be even
    const finalQty = classType === "combo" && qty % 2 !== 0 ? qty - (qty%2) : qty;
    const bonusEntry = {
      email,
      pkgKey,
      optId,
      label: `🎁 ${lang==="pt"?"Bónus":"Bonus"}: ${finalQty} ${classType === "reformer" ? "Reformer" : classType === "mat" ? "Mat" : "Combo"}`,
      qty: finalQty,
      price: 0,
      validity: validityStr,
      note: lang==="pt"?"Cortesia do estúdio":"Studio courtesy",
      paid: true,
      paidDate: fmt(now),
      paidTs: now.getTime(),
      startDate: fmt(now),
      purchaseTs: now.getTime(),
      sessions: [],
      isBonus: true,
    };
    try {
      await addDoc(collection(db, "clientPackages"), bonusEntry);
      fire(`🎁 ${lang==="pt"?"Bónus atribuído":"Bonus granted"} ✓`);
    } catch (err) {
      fire(lang==="pt"?`Erro: ${err?.message}`:`Error: ${err?.message}`, "warn");
    }
  };

  const removePkg = async (email,pkgId) => {
    if (!confirm(lang==="pt"?"Remover este pacote?":"Remove this package?")) return;
    try {
      await deleteDoc(doc(db, "clientPackages", pkgId));
      fire(t.packageRemoved,"warn");
    } catch (err) {
      fire(lang==="pt"?`Erro: ${err?.message}`:`Error: ${err?.message}`, "warn");
    }
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
        <button onClick={()=>setDarkMode(d=>!d)} style={{position:"absolute",top:14,right:14,background:"none",border:"none",fontSize:18,cursor:"pointer",padding:6}} title={darkMode?t.lightMode:t.darkMode}>{darkMode?"☀️":"🌙"}</button>
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
              <h3 style={{margin:"0 0 14px",fontSize:16,color:C.wine,textAlign:"center",fontFamily:"Georgia,serif"}}>
                {adminAccount ? t.adminLogin : (lang==="pt"?"Configurar Admin":"Admin Setup")}
              </h3>
              {!adminAccount && (
                <p style={{margin:"-8px 0 12px",fontSize:11,color:C.textLight,textAlign:"center",lineHeight:1.5}}>
                  {lang==="pt"
                    ? "Primeira utilização. Cria a conta de administrador. Esta operação só pode ser feita uma vez."
                    : "First-time setup. Create the admin account. This can only be done once."}
                </p>
              )}
              <input value={fEmail} onChange={e=>setFEmail(e.target.value)} placeholder={t.adminEmail} style={S.input} type="email"/>
              <input value={fPassword} onChange={e=>setFPassword(e.target.value)} placeholder={t.adminPassword} style={S.input} type="password" onKeyDown={e=>e.key==="Enter"&&adminAccount&&doAdminLogin()}/>
              {!adminAccount && (
                <input value={fConfirm} onChange={e=>setFConfirm(e.target.value)} placeholder={t.confirmPassword} style={S.input} type="password" onKeyDown={e=>e.key==="Enter"&&doAdminLogin()}/>
              )}
              <button onClick={doAdminLogin} style={S.wineBtn}>
                {adminAccount ? t.enter : (lang==="pt"?"Criar Admin":"Create Admin")}
              </button>
              {adminAccount && (
                <button onClick={()=>{setAuthView("forgot");resetForm();}} style={{...S.linkBtn,fontSize:11,marginTop:8}}>{t.forgotPassword}</button>
              )}
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
              <div style={{display:"flex",gap:6,marginBottom:6}}>
                <input value={fBdayDay} onChange={e=>setFBdayDay(e.target.value.replace(/\D/g,"").slice(0,2))} placeholder={t.day} style={{...S.input,flex:1,marginBottom:0}} type="number" min="1" max="31"/>
                <input value={fBdayMonth} onChange={e=>setFBdayMonth(e.target.value.replace(/\D/g,"").slice(0,2))} placeholder={t.month} style={{...S.input,flex:1,marginBottom:0}} type="number" min="1" max="12"/>
              </div>
              <div style={{fontSize:10,color:C.textLight,marginBottom:8,textAlign:"center"}}>🎂 {t.bdayOptional}</div>
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
          <button onClick={()=>setShowInstructorsModal(true)} style={{...S.linkBtn,fontSize:14,margin:0,padding:0}} title={t.manageInstructors}>👩‍🏫</button>
          <button onClick={()=>setShowAdminSettings(true)} style={{...S.linkBtn,fontSize:14,margin:0,padding:0}} title={t.adminSettings}>⚙</button>
          <button onClick={()=>setDarkMode(d=>!d)} style={{...S.linkBtn,fontSize:14,margin:0,padding:0}} title={darkMode?t.lightMode:t.darkMode}>{darkMode?"☀️":"🌙"}</button>
          <button onClick={()=>setLang(l=>l==="en"?"pt":"en")} style={{...S.linkBtn,fontSize:11,margin:0,padding:0}}>{lang==="en"?"🇵🇹":"🇬🇧"}</button>
          <button onClick={doLogout} style={{...S.outlineBtn,fontSize:12}}>{t.exit}</button>
        </div>
      </div>

      {/* Admin nav */}
      <div style={S.nav}>
        {[["schedule",t.classBookings],["packages",t.clientPackages],["clients",t.allClients],["manageSchedule",t.manageSchedule],["managePackages",t.managePackages]].map(([v,lb])=>(
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

        {/* Upcoming birthdays widget */}
        {(() => {
          const ups = upcomingBirthdays(14);
          if (ups.length === 0) return null;
          return (
            <div style={{...S.card,padding:"12px 14px",marginBottom:18,borderLeft:`4px solid ${C.amber}`,background:C.amberPale}}>
              <div style={{fontSize:11,color:C.amber,fontWeight:"bold",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>🎂 {t.upcomingBdays}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {ups.map((u,i)=>(
                  <span key={i} onClick={()=>{setViewingClient(u.email);setAdminTab("clients");}} style={{...S.pill,background:"#fff",color:C.amber,border:`1px solid ${C.amberBorder}`,cursor:"pointer",padding:"4px 10px",fontSize:11}}>
                    {u.daysUntil===0?"🎉 ":""}{u.name} · {u.daysUntil===0?(lang==="pt"?"hoje":"today"):`${u.daysUntil}d`}
                  </span>
                ))}
              </div>
            </div>
          );
        })()}

        {/* SCHEDULE TAB */}
        {adminTab==="schedule" && (
          <div>
            {DAYS.map(day=>(
              <div key={day} style={{marginBottom:18}}>
                <div style={S.adminDayHead}>{dayLabel(day,lang)}</div>
                {SCHEDULE[day].map((slot,i)=>{
                  const attBookings = (bookings[slotKey(day,slot.time)]||[]);
                  const att = attBookings.map(b=>b.email);
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
                                {att.map((email,j)=>{
                                  const ns = isNoShow(email,day,slot.time);
                                  const bk = attBookings[j];
                                  const wasCutLine = bk?.byAdmin && (bk?.priorWaitlistCount||0) > 0;
                                  const tooltipMsg = wasCutLine
                                    ? (lang==="pt"
                                        ? `Adicionado por admin (à frente de ${bk.priorWaitlistCount} na lista de espera)`
                                        : `Added by admin (ahead of ${bk.priorWaitlistCount} on waitlist)`)
                                    : bk?.byAdmin
                                      ? (lang==="pt"?"Adicionado por admin":"Added by admin")
                                      : "";
                                  return (
                                    <span key={j} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:12,fontSize:11,background:ns?C.redPale:C.winePale,color:ns?C.red:C.wine,border:`1px solid ${ns?C.redBorder:C.borderMid}`,textDecoration:ns?"line-through":"none"}}>
                                      <span onClick={()=>{setViewingClient(email);setAdminTab("clients");}} style={{cursor:"pointer",textDecoration:ns?"line-through":"underline"}}>{getUserName(email)}</span>
                                      {bk?.byAdmin && (
                                        <span title={tooltipMsg} style={{fontSize:9,color:wasCutLine?C.amber:C.textLight,fontStyle:"italic"}}>
                                          {wasCutLine ? `★${bk.priorWaitlistCount}` : "★"}
                                        </span>
                                      )}
                                      {ns
                                        ? <button onClick={()=>unmarkNoShow(email,day,slot.time)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:10,padding:"0 2px"}} title={t.unmarkNoShow}>↺</button>
                                        : <button onClick={()=>{if(confirm(t.confirmNoShowQ))markNoShow(email,day,slot.time);}} style={{background:"none",border:"none",color:C.amber,cursor:"pointer",fontSize:10,padding:"0 2px"}} title={t.markNoShow}>⚠</button>
                                      }
                                      <button onClick={()=>cancelBooking(day,slot.time,email)} style={{background:"none",border:"none",color:C.textLight,cursor:"pointer",fontSize:13,padding:0,lineHeight:1}} title={t.cancel}>×</button>
                                    </span>
                                  );
                                })}
                              </div>
                            ) : <div style={{fontSize:11,color:C.textLight,marginTop:3}}>{t.noBookings}</div>}
                            {/* Waitlist for this slot */}
                            {(() => {
                              const sk = slotKey(day,slot.time);
                              const queue = waitlist[sk] || [];
                              if (queue.length === 0) return null;
                              return (
                                <div style={{marginTop:8,paddingTop:6,borderTop:`1px dashed ${C.border}`}}>
                                  <div style={{fontSize:9,color:C.textLight,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>⏳ {t.waitlistFor} ({queue.length})</div>
                                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                                    {queue.map((w,j)=>{
                                      const tl = w.notified ? waitlistTimeLeft(day, slot.time, w.email) : null;
                                      return (
                                        <span key={j} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:12,fontSize:10,background:w.notified?C.amberPale:C.surfaceAlt,color:w.notified?C.amber:C.textMid,border:`1px solid ${w.notified?C.amberBorder:C.border}`}}>
                                          {j+1}. {getUserName(w.email)}
                                          {w.notified && tl != null && <span style={{fontSize:9}}>⏰ {formatTimeLeft(tl)}</span>}
                                          <button onClick={()=>leaveWaitlist(day,slot.time,w.email)} style={{background:"none",border:"none",color:C.textLight,cursor:"pointer",fontSize:11,padding:0,lineHeight:1}}>×</button>
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{fontSize:15,fontWeight:"bold",color:left===0?C.red:C.wine}}>{MAX_SPOTS(slot.name)-left}/{MAX_SPOTS(slot.name)}</div>
                          <div style={{fontSize:9,color:C.textLight,marginBottom:5}}>{lang==="pt"?"marcados":"booked"}</div>
                          <select onChange={e=>{if(e.target.value){adminAddBooking(day,slot.time,e.target.value);e.target.value="";}}} style={{fontSize:10,padding:"3px 6px",borderRadius:8,border:`1px solid ${C.border}`,background:C.surfaceAlt,color:C.textMid,fontFamily:"Georgia,serif",cursor:"pointer",maxWidth:120}}>
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
                      {u.bdayDay && u.bdayMonth ? (
                        <>
                          <div style={{color:C.textLight}}>🎂 {t.birthday}:</div>
                          <div style={{color:C.text}}>
                            {String(u.bdayDay).padStart(2,"0")}/{String(u.bdayMonth).padStart(2,"0")}
                            {isBirthdayToday(u) && <span style={{marginLeft:8,color:C.amber,fontWeight:"bold"}}>{t.bdayToday}</span>}
                          </div>
                        </>
                      ) : null}
                      <div style={{color:C.textLight}}>{t.joined}:</div><div style={{color:C.text}}>{u.joinedAt}</div>
                    </div>
                  </div>

                  {/* Private notes (admin only) */}
                  <div style={S.sectionLabel}>📝 {t.privateNotes}</div>
                  <div style={{...S.card,padding:"14px 16px",marginBottom:18}}>
                    <textarea
                      value={clientNotes[u.email] || ""}
                      onChange={e=>setClientNotes(prev=>({...prev,[u.email]:e.target.value}))}
                      placeholder={t.notesPlaceholder}
                      rows={4}
                      style={{...S.input,resize:"vertical",fontFamily:"Georgia,serif",fontSize:12,lineHeight:1.5,marginBottom:0}}
                    />
                    <div style={{fontSize:10,color:C.textLight,marginTop:6,fontStyle:"italic"}}>
                      {lang==="pt"?"Visível apenas para o admin. Auto-guardado.":"Visible only to admin. Auto-saved."}
                    </div>
                  </div>

                  {/* No-show history */}
                  {(() => {
                    const list = noShowsFor(u.email);
                    if (list.length === 0) return null;
                    return (
                      <>
                        <div style={S.sectionLabel}>⚠️ {t.noShowHistory} ({list.length})</div>
                        <div style={{...S.card,padding:"12px 16px",marginBottom:18}}>
                          {list.sort((a,b)=>b.date.localeCompare(a.date)).map((ns,i)=>(
                            <div key={i} style={{fontSize:12,color:C.textMid,padding:"4px 0",borderBottom:i<list.length-1?`1px dashed ${C.border}`:"none"}}>
                              <span style={{color:C.red,fontWeight:"bold"}}>{ns.date}</span> · {t.days[ns.day]} {ns.time}
                            </div>
                          ))}
                        </div>
                      </>
                    );
                  })()}

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
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:18,marginBottom:8}}>
                    <div style={{...S.sectionLabel,margin:0}}>{t.myPackages}</div>
                    <button onClick={()=>{setShowBonusPkgModal(true);setBonusType("reformer");setBonusQty("");setBonusValidityDays("30");}} style={{...S.outlineBtn,fontSize:11,padding:"5px 10px"}}>{t.grantBonus}</button>
                  </div>
                  {userPkgs.length===0
                    ? <div style={{...S.card,padding:18,textAlign:"center",color:C.textLight}}>{t.noPackagesYet}</div>
                    : userPkgs.map((p,i)=>{
                        const pkg = PACKAGES[p.pkgKey];
                        const valid = pkgIsValid(p);
                        const daysLeft = pkgDaysLeft(p);
                        const sessionsLeft = pkgSessionsLeft(p);
                        const isComboType = p.pkgKey === "combo";
                        return (
                          <div key={i} style={{...S.card,marginBottom:10,borderLeft:`4px solid ${pkg.color}`,padding:"12px 14px",opacity:!valid?.7:1}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,flexWrap:"wrap"}}>
                              <div style={{flex:1,minWidth:200}}>
                                <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",marginBottom:3}}>
                                  <span style={{fontSize:13,color:C.text,fontWeight:"bold"}}>{pkg.icon} {p.label}</span>
                                  {p.isBonus&&<span style={{...S.pill,background:C.tealPale,color:C.teal,border:`1px solid ${C.tealBorder}`}}>🎁 {lang==="pt"?"Bónus":"Bonus"}</span>}
                                  {!p.paid&&<span style={{...S.pill,background:C.amberPale,color:C.amber,border:`1px solid ${C.amberBorder}`}}>{t.notPaidYet}</span>}
                                  {!valid&&<span style={{...S.pill,background:C.redPale,color:C.red,border:`1px solid ${C.redBorder}`}}>{t.expired}</span>}
                                </div>
                                <div style={{fontSize:11,color:C.textLight,marginTop:2}}>
                                  {t.started} {p.startDate}
                                  {p.paid && p.paidDate && ` · ${t.paidOn} ${p.paidDate}`}
                                </div>
                                {/* Credits info */}
                                <div style={{marginTop:7,display:"flex",gap:6,flexWrap:"wrap"}}>
                                  {isComboType && p.qty ? (
                                    <>
                                      <span style={{...S.pill,background:C.winePale,color:C.wine,border:`1px solid ${C.borderMid}`}}>🛏️ {comboTypeLeft(p,"reformer")} {t.classesLeft}</span>
                                      <span style={{...S.pill,background:C.greenPale,color:C.green,border:`1px solid ${C.greenBorder}`}}>🧘 {comboTypeLeft(p,"mat")} {t.classesLeft}</span>
                                    </>
                                  ) : sessionsLeft !== Infinity ? (
                                    <span style={{...S.pill,background:C.surfaceAlt,color:C.textMid,border:`1px solid ${C.border}`}}>{sessionsLeft} {t.classesLeft} ({p.sessions.length}/{(p.qty||0)+(p.extraSessions||0)})</span>
                                  ) : null}
                                  {daysLeft != null && (
                                    <span style={{...S.pill,background:daysLeft<=7?C.amberPale:C.surfaceAlt,color:daysLeft<=7?C.amber:C.textMid,border:`1px solid ${daysLeft<=7?C.amberBorder:C.border}`}}>
                                      {valid?`${daysLeft} ${t.daysRemaining}`:t.expired}
                                    </span>
                                  )}
                                  {(p.extraValidityDays||0)>0 && (
                                    <span style={{...S.pill,background:C.tealPale,color:C.teal,border:`1px solid ${C.tealBorder}`}}>+{p.extraValidityDays} {lang==="pt"?"dias bónus":"bonus days"}</span>
                                  )}
                                </div>
                              </div>
                              <div style={{textAlign:"right"}}>
                                <div style={{fontSize:15,fontWeight:"bold",color:p.paid?C.green:C.amber}}>€{p.price}</div>
                              </div>
                            </div>
                            {/* Action buttons */}
                            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:10,paddingTop:9,borderTop:`1px solid ${C.border}`}}>
                              {!p.paid
                                ? <button onClick={()=>markPaid(viewingClient,p.id)} style={{...S.greenBtn,fontSize:11,padding:"5px 10px",marginTop:0}}>✓ {t.markPaid}</button>
                                : <button onClick={()=>unmarkPaid(viewingClient,p.id)} style={{...S.outlineBtn,fontSize:11,padding:"5px 10px",color:C.amber,borderColor:C.amberBorder}}>{t.unmarkPaid}</button>
                              }
                              <button onClick={()=>{setShowExtraCreditsModal(p.id);setExtraCreditsAmount("");}} style={{...S.outlineBtn,fontSize:11,padding:"5px 10px"}}>{t.extraCredits}</button>
                              <button onClick={()=>{setShowExtendValidityModal(p.id);setExtendDaysAmount("");}} style={{...S.outlineBtn,fontSize:11,padding:"5px 10px"}}>{t.extendValidity}</button>
                              {isFrozen(p.id)
                                ? <button onClick={()=>unfreezePackage(viewingClient,p.id)} style={{...S.outlineBtn,fontSize:11,padding:"5px 10px",color:C.blue,borderColor:C.blueBorder}}>{t.unfreeze}</button>
                                : <button onClick={()=>{setShowFreezeModal(p.id);setFreezeDays("");setFreezeReason("");}} style={{...S.outlineBtn,fontSize:11,padding:"5px 10px"}}>{t.freeze}</button>
                              }
                              <button onClick={()=>removePkg(viewingClient,p.id)} style={{...S.outlineBtn,fontSize:11,padding:"5px 10px",color:C.red,borderColor:C.redBorder}}>{t.remove}</button>
                            </div>
                            {/* Freeze status banner */}
                            {isFrozen(p.id) && (() => {
                              const f = freezeInfo(p.id);
                              const daysLeft = Math.ceil((f.endTs - Date.now())/(24*60*60*1000));
                              return (
                                <div style={{marginTop:8,padding:"7px 11px",background:C.bluePale,border:`1px solid ${C.blueBorder}`,borderRadius:7,fontSize:11,color:C.blue}}>
                                  ❄️ {t.frozenStatus} · {t.frozenUntil} {fmt(new Date(f.endTs))} ({daysLeft}{t.daysShortLabel})
                                  {f.reason && <div style={{fontSize:10,color:C.textLight,marginTop:2,fontStyle:"italic"}}>{f.reason}</div>}
                                </div>
                              );
                            })()}
                            {/* Sessions log */}
                            {p.sessions.length>0 && (
                              <div style={{marginTop:9,paddingTop:9,borderTop:`1px solid ${C.border}`}}>
                                <div style={{fontSize:10,color:C.textLight,textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>{t.sessionsLogTitle}</div>
                                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                                  {p.sessions.map((s,j)=>(
                                    <span key={j} style={{...S.pill,background:C.surfaceAlt,color:C.textMid,border:`1px solid ${C.border}`,fontSize:10}}>
                                      {j+1}. {s.date} · {s.class} {s.time}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
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
                        const userBookings = DAYS.flatMap(d=>(SCHEDULE[d]||[]).filter(s=>isBookedBy(d,s.time,u.email)).length>0?[1]:[]).length;
                        const userPkgsAll = myPkgsFor(u.email);
                        const activePkgs = userPkgsAll.filter(p=>p.paid && pkgIsValid(p));
                        const unpaidCount = userPkgsAll.filter(p=>!p.paid).length;
                        const totalCreditsLeft = activePkgs.reduce((sum,p)=>{
                          const left = pkgSessionsLeft(p);
                          return left===Infinity ? sum : sum + Math.max(0,left);
                        },0);
                        // Soonest expiry
                        const soonestExpiry = activePkgs
                          .map(p=>pkgDaysLeft(p))
                          .filter(d=>d!=null)
                          .sort((a,b)=>a-b)[0];
                        const hasNotes = !!(clientNotes[u.email] && clientNotes[u.email].trim());
                        const noShowCount = noShowsFor(u.email).length;
                        return (
                          <div key={u.email} onClick={()=>setViewingClient(u.email)} style={{...S.card,padding:"14px 16px",cursor:"pointer",borderLeft:`4px solid ${hasNotes?C.amber:C.wine}`,transition:"transform .15s"}}
                            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                            onMouseLeave={e=>e.currentTarget.style.transform=""}>
                            <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:10}}>
                              <div style={{width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${C.wineLight},${C.wine})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#fff",fontWeight:"bold",flexShrink:0}}>
                                {u.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                              </div>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{fontSize:14,color:C.text,fontWeight:"bold",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:5}}>
                                  {u.name}
                                  {hasNotes && <span title={t.healthFlag} style={{fontSize:13}}>⚠️</span>}
                                </div>
                                <div style={{fontSize:11,color:C.textLight,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>@{u.username}</div>
                              </div>
                            </div>
                            <div style={{fontSize:11,color:C.textLight,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:3}}>{u.email}</div>
                            {u.phone&&<div style={{fontSize:11,color:C.textLight,marginBottom:8}}>📞 {u.phone}</div>}
                            {/* credit/payment summary */}
                            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>
                              {totalCreditsLeft>0 && <span style={{...S.pill,background:C.greenPale,color:C.green,border:`1px solid ${C.greenBorder}`,fontSize:10}}>{totalCreditsLeft} {t.classesLeft}</span>}
                              {soonestExpiry!=null && <span style={{...S.pill,background:soonestExpiry<=7?C.amberPale:C.surfaceAlt,color:soonestExpiry<=7?C.amber:C.textMid,border:`1px solid ${soonestExpiry<=7?C.amberBorder:C.border}`,fontSize:10}}>{t.expiresIn} {soonestExpiry}{t.daysShort}</span>}
                              {unpaidCount>0 && <span style={{...S.pill,background:C.redPale,color:C.red,border:`1px solid ${C.redBorder}`,fontSize:10}}>{unpaidCount} {t.unpaid}</span>}
                              {noShowCount>0 && <span style={{...S.pill,background:C.redPale,color:C.red,border:`1px solid ${C.redBorder}`,fontSize:10}}>⚠ {noShowCount} {t.noShowsCount}</span>}
                            </div>
                            <div style={{display:"flex",gap:14,marginTop:6,paddingTop:8,borderTop:`1px solid ${C.border}`}}>
                              <div><span style={{fontSize:14,fontWeight:"bold",color:C.wine}}>{userBookings}</span><span style={{fontSize:10,color:C.textLight,marginLeft:4}}>{t.bookings}</span></div>
                              <div><span style={{fontSize:14,fontWeight:"bold",color:C.blue}}>{userPkgsAll.length}</span><span style={{fontSize:10,color:C.textLight,marginLeft:4}}>{t.packages}</span></div>
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

        {/* MANAGE SCHEDULE TAB */}
        {adminTab==="manageSchedule" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h2 style={{...S.pageTitle,margin:0}}>{t.manageSchedule}</h2>
              <button onClick={()=>{setShowScheduleEditor("new");setScheduleEditDay("Monday");setScheduleEditTime("");setScheduleEditName("Reformer");setScheduleEditTag("");setScheduleEditInstructor("");}} style={{...S.wineBtn,padding:"8px 14px",fontSize:12,marginTop:0}}>
                {t.addClass}
              </button>
            </div>
            {DAYS.map(day=>(
              <div key={day} style={{marginBottom:18}}>
                <div style={S.adminDayHead}>{t.days[day]}</div>
                {(SCHEDULE[day]||[]).length===0
                  ? <div style={{padding:"10px 14px",fontSize:11,color:C.textLight,fontStyle:"italic"}}>{lang==="pt"?"Sem aulas":"No classes"}</div>
                  : SCHEDULE[day].map((slot,i)=>(
                      <div key={i} style={{...S.card,marginBottom:6,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
                        <div style={{flex:1}}>
                          <div style={{fontSize:13,color:C.text}}><b style={{color:C.wine}}>{slot.time}</b> · {slot.name}{slot.tag?<span style={{color:C.textLight}}> ✦ {slot.tag}</span>:""}</div>
                          <div style={{fontSize:10,color:C.textLight,marginTop:2}}>
                            {lang==="pt"?"Lugares":"Spots"}: {MAX_SPOTS(slot.name)}
                            {slot.instructor && <span> · 👩‍🏫 {slot.instructor}</span>}
                          </div>
                        </div>
                        <div style={{display:"flex",gap:6}}>
                          <button onClick={()=>{setShowScheduleEditor({day,idx:i});setScheduleEditDay(day);setScheduleEditTime(slot.time);setScheduleEditName(slot.name);setScheduleEditTag(slot.tag||"");setScheduleEditInstructor(slot.instructor||"");}} style={{...S.outlineBtn,fontSize:11,padding:"5px 10px"}}>{t.editClass}</button>
                          <button onClick={()=>deleteSlot(day,i)} style={{...S.outlineBtn,fontSize:11,padding:"5px 10px",color:C.red,borderColor:C.redBorder}}>{t.deleteClass}</button>
                        </div>
                      </div>
                    ))
                }
              </div>
            ))}
          </div>
        )}

        {/* MANAGE PACKAGES TAB */}
        {adminTab==="managePackages" && (
          <div>
            <h2 style={S.pageTitle}>{t.managePackages}</h2>
            <p style={{fontSize:11,color:C.textLight,marginBottom:14,lineHeight:1.5}}>
              {lang==="pt"
                ? "Edita os preços e nomes dos pacotes. As alterações aplicam-se a novos pacotes atribuídos — pacotes já comprados mantêm o preço original."
                : "Edit package prices and labels. Changes apply to new packages assigned — already-bought packages keep their original price."}
            </p>
            {Object.entries(PACKAGES).map(([key,pkg])=>(
              <div key={key} style={{...S.card,padding:"12px 14px",marginBottom:14,borderTop:`3px solid ${pkg.color}`}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
                  <span style={{fontSize:18}}>{pkg.icon}</span>
                  <span style={{fontSize:13,fontWeight:"bold",color:pkg.color}}>{pkg.label}</span>
                </div>
                {pkg.groups
                  ? pkg.groups.map(g=>(
                      <div key={g.name} style={{marginBottom:10}}>
                        <div style={{fontSize:10,color:C.textLight,textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>{g.name}</div>
                        {g.opts.map(o=>(
                          <div key={o.id} style={{display:"flex",gap:7,alignItems:"center",marginBottom:5}}>
                            <input value={o.label} onChange={e=>updatePackageOption(key,o.id,"label",e.target.value)} style={{...S.input,fontSize:12,padding:"6px 10px",margin:0,flex:2}}/>
                            <div style={{display:"flex",alignItems:"center",gap:3}}>
                              <span style={{fontSize:13,color:C.textMid}}>€</span>
                              <input type="number" value={o.price} onChange={e=>updatePackageOption(key,o.id,"price",Number(e.target.value)||0)} style={{...S.input,fontSize:12,padding:"6px 10px",margin:0,width:80,textAlign:"right"}}/>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  : pkg.opts.map(o=>(
                      <div key={o.id} style={{display:"flex",gap:7,alignItems:"center",marginBottom:5}}>
                        <input value={o.label} onChange={e=>updatePackageOption(key,o.id,"label",e.target.value)} style={{...S.input,fontSize:12,padding:"6px 10px",margin:0,flex:2}}/>
                        <div style={{display:"flex",alignItems:"center",gap:3}}>
                          <span style={{fontSize:13,color:C.textMid}}>€</span>
                          <input type="number" value={o.price} onChange={e=>updatePackageOption(key,o.id,"price",Number(e.target.value)||0)} style={{...S.input,fontSize:12,padding:"6px 10px",margin:0,width:80,textAlign:"right"}}/>
                        </div>
                      </div>
                    ))
                }
              </div>
            ))}
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

      {/* ADMIN SETTINGS MODAL */}
      {showAdminSettings && (
        <AdminSettingsModal
          adminAccount={adminAccount}
          lang={lang}
          t={t}
          onClose={()=>setShowAdminSettings(false)}
          onSave={(newEmail,curPwd,newPwd)=>{updateAdminCredentials(newEmail,curPwd,newPwd);setShowAdminSettings(false);}}
        />
      )}

      {/* MANAGE INSTRUCTORS MODAL */}
      {showInstructorsModal && (
        <div style={S.overlay} onClick={()=>setShowInstructorsModal(false)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h3 style={{margin:0,fontSize:16,color:C.text}}>👩‍🏫 {t.manageInstructors}</h3>
              <button onClick={()=>setShowInstructorsModal(false)} style={{background:"none",border:"none",fontSize:20,color:C.textLight,cursor:"pointer"}}>×</button>
            </div>
            <div style={{display:"flex",gap:6,marginBottom:14}}>
              <input value={newInstructorName} onChange={e=>setNewInstructorName(e.target.value)} placeholder={t.instructorName} style={{...S.input,flex:1,marginBottom:0}} onKeyDown={e=>e.key==="Enter"&&addInstructor(newInstructorName)}/>
              <button onClick={()=>addInstructor(newInstructorName)} style={{...S.wineBtn,padding:"10px 14px",fontSize:12,marginTop:0}}>{t.addInstructor}</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {instructors.length === 0
                ? <div style={{fontSize:12,color:C.textLight,textAlign:"center",padding:14}}>{lang==="pt"?"Nenhuma instrutora ainda":"No instructors yet"}</div>
                : instructors.map(name => (
                    <div key={name} style={{...S.card,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:13,color:C.text}}>👩‍🏫 {name}</span>
                      <button onClick={()=>removeInstructor(name)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:13,padding:"4px 8px"}}>×</button>
                    </div>
                  ))
              }
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE EDITOR MODAL */}
      {showScheduleEditor && (
        <div style={S.overlay} onClick={()=>setShowScheduleEditor(null)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h3 style={{margin:0,fontSize:16,color:C.text}}>{showScheduleEditor==="new"?t.addClass:t.editClass}</h3>
              <button onClick={()=>setShowScheduleEditor(null)} style={{background:"none",border:"none",fontSize:20,color:C.textLight,cursor:"pointer"}}>×</button>
            </div>
            <label style={{fontSize:11,color:C.textLight,display:"block",marginBottom:4}}>{lang==="pt"?"Dia":"Day"}</label>
            <select value={scheduleEditDay} onChange={e=>setScheduleEditDay(e.target.value)} style={{...S.input,marginBottom:10}}>
              {DAYS.map(d=><option key={d} value={d}>{t.days[d]}</option>)}
            </select>
            <label style={{fontSize:11,color:C.textLight,display:"block",marginBottom:4}}>{t.classTime}</label>
            <input value={scheduleEditTime} onChange={e=>setScheduleEditTime(e.target.value)} placeholder="10:00" style={{...S.input,marginBottom:10}}/>
            <label style={{fontSize:11,color:C.textLight,display:"block",marginBottom:4}}>{t.className}</label>
            <select value={scheduleEditName} onChange={e=>setScheduleEditName(e.target.value)} style={{...S.input,marginBottom:10}}>
              <option value="Reformer">Reformer</option>
              <option value="Mat">Mat</option>
              <option value="Dynamic Mat">Dynamic Mat</option>
              <option value="Mat Pilates">Mat Pilates</option>
            </select>
            <label style={{fontSize:11,color:C.textLight,display:"block",marginBottom:4}}>{t.classTag}</label>
            <select value={scheduleEditTag} onChange={e=>setScheduleEditTag(e.target.value)} style={{...S.input,marginBottom:10}}>
              <option value="">— {lang==="pt"?"Nenhuma":"None"} —</option>
              <option value="Power Flow">Power Flow</option>
              <option value="Back pain & injury">Back pain & injury</option>
              <option value="Mom & Baby">Mom & Baby</option>
              <option value="Beginner">Beginner</option>
            </select>
            <label style={{fontSize:11,color:C.textLight,display:"block",marginBottom:4}}>👩‍🏫 {t.instructor}</label>
            <select value={scheduleEditInstructor} onChange={e=>setScheduleEditInstructor(e.target.value)} style={{...S.input,marginBottom:14}}>
              <option value="">— {t.noInstructor} —</option>
              {instructors.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setShowScheduleEditor(null)} style={{...S.outlineBtn,flex:1,padding:"10px"}}>{t.cancelAction}</button>
              <button onClick={upsertSlot} style={{...S.wineBtn,flex:1,padding:"10px",marginTop:0}}>{t.saveChanges}</button>
            </div>
          </div>
        </div>
      )}

      {/* EXTRA CREDITS MODAL */}
      {showExtraCreditsModal && (
        <div style={S.overlay} onClick={()=>setShowExtraCreditsModal(null)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h3 style={{margin:0,fontSize:16,color:C.text}}>{t.extraCredits}</h3>
              <button onClick={()=>setShowExtraCreditsModal(null)} style={{background:"none",border:"none",fontSize:20,color:C.textLight,cursor:"pointer"}}>×</button>
            </div>
            <p style={{margin:"0 0 14px",fontSize:12,color:C.textLight,lineHeight:1.5}}>
              {lang==="pt"?"Adicionar aulas extra a este pacote como cortesia:":"Add extra classes to this package as a courtesy:"}
            </p>
            <input type="number" value={extraCreditsAmount} onChange={e=>setExtraCreditsAmount(e.target.value)} placeholder="3" style={{...S.input,marginBottom:14}} autoFocus/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setShowExtraCreditsModal(null)} style={{...S.outlineBtn,flex:1,padding:"10px"}}>{t.cancelAction}</button>
              <button onClick={()=>{addExtraCredits(viewingClient,showExtraCreditsModal,parseInt(extraCreditsAmount,10));setShowExtraCreditsModal(null);setExtraCreditsAmount("");}} style={{...S.wineBtn,flex:1,padding:"10px",marginTop:0}}>{t.saveChanges}</button>
            </div>
          </div>
        </div>
      )}

      {/* EXTEND VALIDITY MODAL */}
      {showExtendValidityModal && (
        <div style={S.overlay} onClick={()=>setShowExtendValidityModal(null)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h3 style={{margin:0,fontSize:16,color:C.text}}>{t.extendValidity}</h3>
              <button onClick={()=>setShowExtendValidityModal(null)} style={{background:"none",border:"none",fontSize:20,color:C.textLight,cursor:"pointer"}}>×</button>
            </div>
            <p style={{margin:"0 0 14px",fontSize:12,color:C.textLight,lineHeight:1.5}}>
              {lang==="pt"?"Adicionar dias à validade deste pacote:":"Add days to this package's validity:"}
            </p>
            <input type="number" value={extendDaysAmount} onChange={e=>setExtendDaysAmount(e.target.value)} placeholder="14" style={{...S.input,marginBottom:14}} autoFocus/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setShowExtendValidityModal(null)} style={{...S.outlineBtn,flex:1,padding:"10px"}}>{t.cancelAction}</button>
              <button onClick={()=>{extendValidity(viewingClient,showExtendValidityModal,parseInt(extendDaysAmount,10));setShowExtendValidityModal(null);setExtendDaysAmount("");}} style={{...S.wineBtn,flex:1,padding:"10px",marginTop:0}}>{t.saveChanges}</button>
            </div>
          </div>
        </div>
      )}

      {/* FREEZE PACKAGE MODAL */}
      {showFreezeModal && (
        <div style={S.overlay} onClick={()=>setShowFreezeModal(null)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h3 style={{margin:0,fontSize:16,color:C.text}}>❄️ {t.freezeMembership}</h3>
              <button onClick={()=>setShowFreezeModal(null)} style={{background:"none",border:"none",fontSize:20,color:C.textLight,cursor:"pointer"}}>×</button>
            </div>
            <p style={{margin:"0 0 14px",fontSize:12,color:C.textLight,lineHeight:1.5}}>
              {lang==="pt"?"Pausa este pacote. A validade é estendida pelo mesmo número de dias.":"Pause this package. Validity is extended by the same number of days."}
            </p>
            <label style={{fontSize:11,color:C.textLight,display:"block",marginBottom:4}}>{t.freezeDays}</label>
            <input type="number" value={freezeDays} onChange={e=>setFreezeDays(e.target.value)} placeholder="14" style={{...S.input,marginBottom:10}} autoFocus/>
            <label style={{fontSize:11,color:C.textLight,display:"block",marginBottom:4}}>{t.freezeReason}</label>
            <input value={freezeReason} onChange={e=>setFreezeReason(e.target.value)} placeholder={t.freezeReasonPlaceholder} style={{...S.input,marginBottom:14}}/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setShowFreezeModal(null)} style={{...S.outlineBtn,flex:1,padding:"10px"}}>{t.cancelAction}</button>
              <button onClick={()=>{freezePackage(viewingClient,showFreezeModal,parseInt(freezeDays,10),freezeReason);setShowFreezeModal(null);setFreezeDays("");setFreezeReason("");}} style={{...S.wineBtn,flex:1,padding:"10px",marginTop:0}}>{t.saveChanges}</button>
            </div>
          </div>
        </div>
      )}
      {/* BONUS PACKAGE MODAL */}
      {showBonusPkgModal && (
        <div style={S.overlay} onClick={()=>setShowBonusPkgModal(false)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h3 style={{margin:0,fontSize:16,color:C.text}}>{t.grantBonus}</h3>
              <button onClick={()=>setShowBonusPkgModal(false)} style={{background:"none",border:"none",fontSize:20,color:C.textLight,cursor:"pointer"}}>×</button>
            </div>
            <p style={{margin:"0 0 14px",fontSize:12,color:C.textLight,lineHeight:1.5}}>
              {lang==="pt"?`Pacote de cortesia para ${getUserName(viewingClient)}:`:`Courtesy package for ${getUserName(viewingClient)}:`}
            </p>
            <label style={{fontSize:11,color:C.textLight,display:"block",marginBottom:4}}>{t.bonusType}</label>
            <select value={bonusType} onChange={e=>setBonusType(e.target.value)} style={{...S.input,marginBottom:10}}>
              <option value="reformer">🛏️ Reformer</option>
              <option value="mat">🧘 Mat</option>
              <option value="combo">🔀 Combo (Reformer + Mat)</option>
            </select>
            <label style={{fontSize:11,color:C.textLight,display:"block",marginBottom:4}}>{t.bonusQty}</label>
            <input type="number" value={bonusQty} onChange={e=>setBonusQty(e.target.value)} placeholder="3" style={{...S.input,marginBottom:10}}/>
            <label style={{fontSize:11,color:C.textLight,display:"block",marginBottom:4}}>{t.bonusValidity}</label>
            <input type="number" value={bonusValidityDays} onChange={e=>setBonusValidityDays(e.target.value)} placeholder="30" style={{...S.input,marginBottom:14}}/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setShowBonusPkgModal(false)} style={{...S.outlineBtn,flex:1,padding:"10px"}}>{t.cancelAction}</button>
              <button onClick={()=>{grantBonusPackage(viewingClient,bonusType,parseInt(bonusQty,10),parseInt(bonusValidityDays,10));setShowBonusPkgModal(false);setBonusQty("");}} style={{...S.wineBtn,flex:1,padding:"10px",marginTop:0}}>{t.saveChanges}</button>
            </div>
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
          <button onClick={()=>setDarkMode(d=>!d)} style={{...S.linkBtn,fontSize:14,margin:0,padding:0}} title={darkMode?t.lightMode:t.darkMode}>{darkMode?"☀️":"🌙"}</button>
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
            {/* Birthday banner */}
            {me && isBirthdayToday(me) && (
              <div style={{...S.card,marginBottom:14,padding:"14px 18px",background:`linear-gradient(135deg,${C.winePale},${C.amberPale})`,borderLeft:`4px solid ${C.amber}`,textAlign:"center"}}>
                <div style={{fontSize:24,marginBottom:4}}>🎂🎉</div>
                <div style={{fontSize:14,color:C.wine,fontWeight:"bold"}}>{t.happyBirthday} {me.name.split(" ")[0]}!</div>
                <div style={{fontSize:11,color:C.textMid,marginTop:3}}>{lang==="pt"?"De toda a equipa Noa Pilates 💕":"From the entire Noa Pilates team 💕"}</div>
              </div>
            )}
            {/* Credit summary header — shows status of the user's packages */}
            {(()=>{
              const userPkgs = myPkgsFor(currentUser);
              const validPkgs = userPkgs.filter(p=>p.paid && pkgIsValid(p));
              if (validPkgs.length === 0) {
                return (
                  <div style={{...S.card,marginBottom:14,borderLeft:`4px solid ${C.amber}`,padding:"12px 16px",background:C.amberPale}}>
                    <div style={{fontSize:13,color:C.amber,fontWeight:"bold",marginBottom:4}}>⚠️ {t.noCreditTitle}</div>
                    <div style={{fontSize:12,color:C.textMid,lineHeight:1.5}}>{t.noCreditDesc}</div>
                  </div>
                );
              }
              return (
                <div style={{marginBottom:14,display:"flex",flexDirection:"column",gap:7}}>
                  {validPkgs.map((p,idx)=>{
                    const pkg = PACKAGES[p.pkgKey];
                    const daysLeft = pkgDaysLeft(p);
                    const allowance = membershipWeeklyAllowance(p);
                    const isMember = p.pkgKey === "membership";
                    const usedThisWeek = isMember ? membershipUsedInWeekOf(p, lisbonNow()) : 0;
                    return (
                      <div key={idx} style={{...S.card,borderLeft:`4px solid ${pkg.color}`,padding:"10px 14px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:13,color:pkg.color,fontWeight:"bold"}}>{pkg.icon} {p.label}</div>
                            <div style={{fontSize:11,color:C.textLight,marginTop:2}}>
                              {isMember
                                ? (allowance===Infinity
                                    ? `Unlimited`
                                    : (p.optId==="combo_m"
                                        ? `1 Reformer + 1 Mat / ${lang==="pt"?"semana":"week"}`
                                        : `${allowance}× / ${lang==="pt"?"semana":"week"} · ${usedThisWeek}/${allowance===Infinity?"∞":allowance} ${t.weekUsed}`))
                                : p.pkgKey==="combo"
                                  ? (()=>{
                                      const refLeft = comboTypeLeft(p,"reformer");
                                      const matLeft = comboTypeLeft(p,"mat");
                                      return `🛏️ ${refLeft} Reformer · 🧘 ${matLeft} Mat`;
                                    })()
                                  : `${pkgSessionsLeft(p)} ${t.classesLeft}`}
                            </div>
                          </div>
                          {daysLeft != null && (
                            <div style={{textAlign:"right",fontSize:11,color:daysLeft<=7?C.red:C.textLight}}>
                              {t.expiresIn} {daysLeft}{t.daysShort}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {/* Show unpaid pending packages too as warning */}
                  {userPkgs.filter(p=>!p.paid).map((p,idx)=>{
                    const pkg = PACKAGES[p.pkgKey];
                    return (
                      <div key={`u${idx}`} style={{...S.card,borderLeft:`4px solid ${C.amber}`,padding:"10px 14px",background:C.amberPale}}>
                        <div style={{fontSize:12,color:C.amber}}>⚠️ {pkg.icon} {p.label} — {t.pendingPayment}</div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* Week navigation */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10,padding:"6px 4px"}}>
              <button onClick={()=>setWeekOffset(Math.max(0, weekOffset-1))} disabled={weekOffset===0} style={{background:"none",border:"none",fontSize:18,color:weekOffset===0?C.borderMid:C.wine,cursor:weekOffset===0?"not-allowed":"pointer",padding:"4px 8px"}}>‹</button>
              <div style={{fontSize:11,color:C.textMid,fontWeight:weekOffset===0?"bold":"normal"}}>
                {weekOffset===0 ? t.thisWeek : weekOffset===1 ? t.nextWeek : `${t.inWeeks} ${weekOffset} ${weekOffset===1?t.weekN:t.weeksN}`}
              </div>
              <button onClick={()=>setWeekOffset(Math.min(3, weekOffset+1))} disabled={weekOffset>=3} style={{background:"none",border:"none",fontSize:18,color:weekOffset>=3?C.borderMid:C.wine,cursor:weekOffset>=3?"not-allowed":"pointer",padding:"4px 8px"}}>›</button>
            </div>

            <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
              {DAYS.map(day=>{
                const dDate = dateForDayInWeek(day, weekOffset);
                const hasMine = SCHEDULE[day].some(s=>isBookedBy(day,s.time,currentUser,dDate));
                return (
                  <button key={day} onClick={()=>setSelectedDay(day)} style={{flexShrink:0,padding:"8px 12px",borderRadius:18,fontSize:11,fontFamily:"Georgia,serif",cursor:"pointer",background:selectedDay===day?C.wine:"#fff",color:selectedDay===day?"#fff":C.textMid,border:selectedDay===day?"none":`1px solid ${C.border}`,fontWeight:selectedDay===day?"bold":"normal",position:"relative"}}>
                    {shortDayLabel(day,lang,weekOffset)}
                    {hasMine&&<span style={{position:"absolute",top:3,right:3,width:5,height:5,borderRadius:"50%",background:C.green}}/>}
                  </button>
                );
              })}
            </div>

            <div style={{fontSize:15,color:C.wine,fontWeight:"bold",marginBottom:13,letterSpacing:.5}}>
              {dayLabel(selectedDay,lang,weekOffset)}
            </div>

            {SCHEDULE[selectedDay].map((slot,i)=>{
              const targetDate = dateForDayInWeek(selectedDay, weekOffset);
              const left = spotsLeft(selectedDay,slot.time,targetDate);
              const booked = isBookedBy(selectedDay,slot.time,currentUser,targetDate);
              const full = left===0&&!booked;
              const open = isOpen(selectedDay,slot.time);
              const locked = !open&&!booked;
              const cs = CLASS_STYLE[slot.name]||CLASS_STYLE.Reformer;
              const ts = slot.tag?(TAG_STYLE[slot.tag]||{}):null;

              // Credit check for this specific slot
              const userPkgs = myPkgsFor(currentUser);
              const { pkg: usable, reason: creditReason } = booked || full || locked
                ? { pkg:null, reason:"skip" }
                : findUsablePackage(userPkgs, slot.name, targetDate);
              const noCredit = !booked && !full && !locked && !usable;
              const creditMsg = noCredit
                ? (creditReason==="wrongType" ? t.noCreditForType
                  : creditReason==="notPaid" ? t.pkgNotPaid
                  : creditReason==="expired" ? t.pkgExpired
                  : creditReason==="weekLimit" ? t.pkgWeeklyLimit
                  : creditReason==="noSessionsLeft" ? t.pkgNoSessionsLeft
                  : t.contactToBook)
                : null;

              // Waitlist info (use targetDate for the slot key)
              const slotKeyVal = slotKey(selectedDay, slot.time, targetDate);
              const waitEntry = (waitlist[slotKeyVal] || []).find(w => w.email === currentUser) || null;
              const queue = waitlist[slotKeyVal] || [];
              const waitPosition = waitEntry ? queue.findIndex(w => w.email === currentUser) + 1 : 0;
              const hasOffer = waitEntry?.notified && spotsLeft(selectedDay, slot.time, targetDate) > 0 && queue[0]?.email === currentUser;

              return (
                <div key={i} style={{...S.card,marginBottom:9,borderLeft:`4px solid ${booked?C.green:hasOffer?C.amber:full||locked||noCredit?C.borderMid:cs.color}`,opacity:(full||locked||noCredit)&&!booked&&!waitEntry?.7:1,animation:`fadeUp .28s ease ${i*.07}s both`}}>
                  <div style={{display:"flex",alignItems:"center",gap:11,padding:"12px 15px"}}>
                    <div style={{width:42,flexShrink:0,fontSize:14,fontWeight:"bold",color:booked?C.green:locked||noCredit?C.textLight:cs.color}}>{slot.time}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
                        <span style={{fontSize:13,color:C.text}}>{slot.name}</span>
                        {slot.tag&&<span style={{...S.pill,background:ts.bg,color:ts.color,border:`1px solid ${ts.border}`}}>✦ {slot.tag}</span>}
                        {slot.instructor&&<span style={{...S.pill,background:C.surfaceAlt,color:C.textMid,border:`1px solid ${C.border}`,fontSize:10}}>👩‍🏫 {slot.instructor}</span>}
                      </div>
                      <div style={{display:"flex",gap:7,marginTop:5,alignItems:"center",flexWrap:"wrap"}}>
                        <span style={{fontSize:11,color:C.textLight}}>⏱ {slot.tag==="Mom & Baby"?t.momBabyDuration:t.oneHour}</span>
                        <span style={{...S.pill,background:booked?C.greenPale:locked||full?C.redPale:left<=2?C.amberPale:C.surfaceAlt,color:booked?C.green:locked||full?C.red:left<=2?C.amber:C.textLight,border:`1px solid ${booked?C.greenBorder:locked||full?C.redBorder:left<=2?C.amberBorder:C.border}`}}>
                          {booked?t.booked:locked?t.closed:full?t.full:`${left} ${t.left}`}
                        </span>
                        {!booked&&open&&!full&&weekOffset===0&&<span style={{fontSize:10,color:C.textLight}}>{deadlineLabel(selectedDay,slot.time,lang)}</span>}
                      </div>
                      {noCredit && !waitEntry && (
                        <div style={{marginTop:6,fontSize:11,color:C.amber,background:C.amberPale,border:`1px solid ${C.amberBorder}`,borderRadius:8,padding:"4px 9px",display:"inline-block"}}>
                          🔒 {creditMsg}
                        </div>
                      )}
                      {waitEntry && !hasOffer && (
                        <div style={{marginTop:6,fontSize:11,color:C.wine,background:C.winePale,border:`1px solid ${C.borderMid}`,borderRadius:8,padding:"4px 9px",display:"inline-block"}}>
                          ⏳ {t.onWaitlist} · {t.waitlistPosition} {waitPosition}/{queue.length}
                        </div>
                      )}
                      {hasOffer && (
                        <div style={{marginTop:6,fontSize:11,color:C.amber,background:C.amberPale,border:`1px solid ${C.amberBorder}`,borderRadius:8,padding:"5px 10px",display:"inline-block",fontWeight:"bold"}}>
                          {t.spotAvailable}
                          {(() => {
                            const tl = waitlistTimeLeft(selectedDay, slot.time, currentUser);
                            if (tl == null) return null;
                            return <span style={{fontWeight:"normal",marginLeft:6,fontSize:10}}>⏰ {t.confirmIn} {formatTimeLeft(tl)}</span>;
                          })()}
                        </div>
                      )}
                    </div>
                    <div style={{flexShrink:0}}>
                      {booked
                        ? open
                          ? <button onClick={()=>cancelBooking(selectedDay,slot.time,currentUser,targetDate)} style={S.cancelBtn}>{t.cancel}</button>
                          : <span style={{...S.pill,background:C.amberPale,color:C.amber,border:`1px solid ${C.amberBorder}`,padding:"5px 10px"}}>{t.locked}</span>
                        : hasOffer
                          ? <div style={{display:"flex",flexDirection:"column",gap:4}}>
                              <button onClick={()=>acceptWaitlistOffer(selectedDay,slot.time,targetDate)} style={{...S.bookBtn,padding:"6px 12px",fontSize:11,background:`linear-gradient(135deg,${C.amber},${C.amberDark||"#b8860b"})`}}>✓ {t.confirmSpot}</button>
                              <button onClick={()=>leaveWaitlist(selectedDay,slot.time,currentUser,targetDate)} style={{...S.cancelBtn,padding:"4px 10px",fontSize:10}}>{t.declineSpot}</button>
                            </div>
                        : waitEntry
                          ? <button onClick={()=>leaveWaitlist(selectedDay,slot.time,currentUser,targetDate)} style={{...S.outlineBtn,padding:"6px 12px",fontSize:11}}>{t.leaveWaitlist}</button>
                        : full && open && !noCredit
                          ? <button onClick={()=>joinWaitlist(selectedDay,slot.time,targetDate)} style={{...S.outlineBtn,padding:"6px 12px",fontSize:11,color:C.wine,borderColor:C.borderMid}}>⏳ {t.joinWaitlist}</button>
                          : <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
                              <button onClick={()=>bookClass(selectedDay,slot,targetDate)} disabled={full||locked||noCredit} style={{...S.bookBtn,opacity:full||locked||noCredit?.4:1,cursor:full||locked||noCredit?"not-allowed":"pointer"}}>{full?t.full:locked?t.closed:noCredit?"🔒":t.book}</button>
                              {!full && !locked && !noCredit && weekOffset < 3 && (
                                <button onClick={()=>{setShowRecurringModal({day:selectedDay,slot,startWeekOffset:weekOffset});setRecurringWeeks(2);}} style={{background:"none",border:"none",color:C.wine,fontSize:9,cursor:"pointer",padding:"2px 6px",textDecoration:"underline"}} title={t.bookRecurring}>🔁 {lang==="pt"?"várias":"more weeks"}</button>
                              )}
                            </div>
                      }
                    </div>
                  </div>
                  <div style={{display:"flex",gap:5,padding:"0 15px 11px",alignItems:"center"}}>
                    {Array.from({length:MAX_SPOTS(slot.name)}).map((_,j)=>(
                      <div key={j} style={{width:7,height:7,borderRadius:"50%",background:j<(MAX_SPOTS(slot.name)-left)?(booked?C.green:C.wine):C.border}}/>
                    ))}
                    <span style={{fontSize:9,color:C.textLight,marginLeft:4}}>{left} {t.left}</span>
                    {queue.length > 0 && <span style={{fontSize:9,color:C.wine,marginLeft:4}}>· ⏳ {queue.length} {t.waitlistFor.toLowerCase()}</span>}
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
                  const valid = pkgIsValid(p);
                  const daysLeft = pkgDaysLeft(p);
                  return (
                    <div key={i} style={{...S.card,marginBottom:13,borderLeft:`4px solid ${pkg.color}`,opacity:!valid?.65:1,animation:`fadeUp .28s ease ${i*.07}s both`}}>
                      <div style={{padding:"13px 15px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:9}}>
                          <div style={{flex:1}}>
                            <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                              <span style={{...S.pill,background:pkg.bg,color:pkg.color,border:`1px solid ${pkg.border}`}}>{pkg.icon} {pkg.label}</span>
                              {finished&&<span style={{...S.pill,background:C.greenPale,color:C.green,border:`1px solid ${C.greenBorder}`}}>{t.done}</span>}
                              {!p.paid&&<span style={{...S.pill,background:C.amberPale,color:C.amber,border:`1px solid ${C.amberBorder}`}}>{t.unpaid}</span>}
                              {!valid&&<span style={{...S.pill,background:C.redPale,color:C.red,border:`1px solid ${C.redBorder}`}}>⏰ {t.pkgExpired}</span>}
                              {valid&&daysLeft!=null&&daysLeft<=7&&<span style={{...S.pill,background:C.amberPale,color:C.amber,border:`1px solid ${C.amberBorder}`}}>{t.expiresIn} {daysLeft}{t.daysShort}</span>}
                            </div>
                            <div style={{fontSize:13,color:C.text,marginTop:6}}>{p.label}</div>
                            <div style={{fontSize:11,color:C.textLight,marginTop:2}}>{t.started} {p.startDate}{p.validity?` · ${p.validity}`:""}</div>
                          </div>
                          <div style={{textAlign:"right",flexShrink:0}}>
                            <div style={{fontSize:19,fontWeight:"bold",color:pkg.color}}>€{p.price}</div>
                            <div style={{fontSize:11,color:p.paid?C.green:C.amber}}>{p.paid?`${t.paid} ${p.paidDate}`:t.pendingPayment}</div>
                          </div>
                        </div>
                        {/* Combo: show per-type counters */}
                        {p.pkgKey==="combo" && p.qty && (
                          <div style={{display:"flex",gap:10,marginBottom:9,fontSize:12,color:C.textMid}}>
                            <div style={{flex:1,padding:"6px 10px",background:C.winePale,borderRadius:7,border:`1px solid ${C.borderMid}`}}>
                              🛏️ Reformer: <b style={{color:C.wine}}>{comboTypeLeft(p,"reformer")}</b> {t.classesLeft}
                            </div>
                            <div style={{flex:1,padding:"6px 10px",background:C.greenPale,borderRadius:7,border:`1px solid ${C.greenBorder}`}}>
                              🧘 Mat: <b style={{color:C.green}}>{comboTypeLeft(p,"mat")}</b> {t.classesLeft}
                            </div>
                          </div>
                        )}
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
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <h2 style={S.pageTitle}>{t.myProfile}</h2>
              <button onClick={openEditProfile} style={{...S.outlineBtn,fontSize:12,padding:"7px 13px"}}>✏️ {t.editProfile}</button>
            </div>

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
                {me.bdayDay && me.bdayMonth ? (
                  <>
                    <div style={{color:C.textLight}}>🎂 {t.birthday}:</div>
                    <div style={{color:C.text}}>
                      {String(me.bdayDay).padStart(2,"0")}/{String(me.bdayMonth).padStart(2,"0")}
                      {isBirthdayToday(me) && <span style={{marginLeft:8,color:C.amber,fontWeight:"bold"}}>🎉 {t.happyBirthday}!</span>}
                    </div>
                  </>
                ) : null}
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

      {/* EDIT PROFILE MODAL (CLIENT) */}
      {showEditProfile && (
        <div style={S.overlay} onClick={()=>setShowEditProfile(false)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h3 style={{margin:0,fontSize:16,color:C.text}}>✏️ {t.editProfile}</h3>
              <button onClick={()=>setShowEditProfile(false)} style={{background:"none",border:"none",fontSize:20,color:C.textLight,cursor:"pointer"}}>×</button>
            </div>
            <label style={{fontSize:11,color:C.textLight,display:"block",marginBottom:4}}>{t.name}</label>
            <input value={epName} onChange={e=>setEpName(e.target.value)} style={{...S.input,marginBottom:10}}/>
            <label style={{fontSize:11,color:C.textLight,display:"block",marginBottom:4}}>{t.phone}</label>
            <input value={epPhone} onChange={e=>setEpPhone(e.target.value)} style={{...S.input,marginBottom:10}} type="tel"/>
            <label style={{fontSize:11,color:C.textLight,display:"block",marginBottom:4}}>🎂 {t.birthday}</label>
            <div style={{display:"flex",gap:6,marginBottom:14}}>
              <input value={epBdayDay} onChange={e=>setEpBdayDay(e.target.value.replace(/\D/g,"").slice(0,2))} placeholder={t.day} style={{...S.input,flex:1,marginBottom:0}} type="number" min="1" max="31"/>
              <input value={epBdayMonth} onChange={e=>setEpBdayMonth(e.target.value.replace(/\D/g,"").slice(0,2))} placeholder={t.month} style={{...S.input,flex:1,marginBottom:0}} type="number" min="1" max="12"/>
            </div>
            <div style={{borderTop:`1px solid ${C.border}`,paddingTop:12,marginBottom:10}}>
              <div style={{fontSize:11,color:C.textLight,marginBottom:8,lineHeight:1.5}}>
                🔐 {lang==="pt"?"Para alterar a palavra-passe, faz logout e usa 'Recuperar palavra-passe' no ecrã de login. Receberás um email para definir uma nova.":"To change your password, log out and use 'Forgot password' on the login screen. You'll receive an email to set a new one."}
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:14}}>
              <button onClick={()=>setShowEditProfile(false)} style={{...S.outlineBtn,flex:1,padding:"10px"}}>{t.cancelAction}</button>
              <button onClick={saveEditProfile} style={{...S.wineBtn,flex:1,padding:"10px",marginTop:0}}>{t.saveProfile}</button>
            </div>
          </div>
        </div>
      )}

      {/* RECURRING BOOKING MODAL */}
      {showRecurringModal && (
        <div style={S.overlay} onClick={()=>setShowRecurringModal(null)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h3 style={{margin:0,fontSize:16,color:C.text}}>🔁 {t.recurringTitle}</h3>
              <button onClick={()=>setShowRecurringModal(null)} style={{background:"none",border:"none",fontSize:20,color:C.textLight,cursor:"pointer"}}>×</button>
            </div>
            <p style={{margin:"0 0 14px",fontSize:12,color:C.textLight,lineHeight:1.5}}>
              {t.recurringDesc}
              <br/>
              <strong style={{color:C.wine}}>{showRecurringModal.slot.time} {showRecurringModal.slot.name}</strong>
              {" "}({t.days[showRecurringModal.day]})
            </p>
            <label style={{fontSize:11,color:C.textLight,display:"block",marginBottom:4}}>{t.recurringWeeksLabel}</label>
            <div style={{display:"flex",gap:6,marginBottom:14}}>
              {[1,2,3,4].map(n=>(
                <button key={n} onClick={()=>setRecurringWeeks(n)} disabled={(showRecurringModal.startWeekOffset||0)+n > 4} style={{flex:1,padding:"10px",borderRadius:8,fontSize:13,fontFamily:"Georgia,serif",cursor:(showRecurringModal.startWeekOffset||0)+n > 4 ? "not-allowed":"pointer",background:recurringWeeks===n?C.wine:"#fff",color:recurringWeeks===n?"#fff":C.textMid,border:`1px solid ${recurringWeeks===n?C.wine:C.border}`,opacity:(showRecurringModal.startWeekOffset||0)+n > 4 ? 0.4 : 1}}>{n}</button>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setShowRecurringModal(null)} style={{...S.outlineBtn,flex:1,padding:"10px"}}>{t.cancelAction}</button>
              <button onClick={()=>bookRecurring(showRecurringModal.day, showRecurringModal.slot, recurringWeeks)} style={{...S.wineBtn,flex:1,padding:"10px",marginTop:0}}>{t.bookAll}</button>
            </div>
          </div>
        </div>
      )}

      <style>{CSS}</style>
    </div>
  );
}

// ── ADMIN SETTINGS MODAL ──────────────────────────────────────────────
function AdminSettingsModal({ adminAccount, lang, t, onClose, onSave }) {
  const [newEmail, setNewEmail] = useState(adminAccount?.email || "");
  const [curPwd, setCurPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const submit = () => {
    if (newPwd && newPwd !== confirmPwd) { alert(lang==="pt"?"Palavras-passe não coincidem":"Passwords don't match"); return; }
    onSave(newEmail, curPwd, newPwd);
  };
  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h3 style={{margin:0,fontSize:16,color:C.text}}>⚙ {t.adminSettings}</h3>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,color:C.textLight,cursor:"pointer"}}>×</button>
        </div>
        <p style={{fontSize:11,color:C.textLight,marginBottom:14,lineHeight:1.5}}>
          {lang==="pt"?"Atualizar email ou palavra-passe do admin. Para confirmar, insere a palavra-passe atual.":"Update admin email or password. Enter current password to confirm."}
        </p>
        <label style={{fontSize:11,color:C.textLight,display:"block",marginBottom:4}}>{t.email}</label>
        <input value={newEmail} onChange={e=>setNewEmail(e.target.value)} type="email" style={{...S.input,marginBottom:10}}/>
        <label style={{fontSize:11,color:C.textLight,display:"block",marginBottom:4}}>{t.currentPassword}</label>
        <input value={curPwd} onChange={e=>setCurPwd(e.target.value)} type="password" style={{...S.input,marginBottom:10}}/>
        <label style={{fontSize:11,color:C.textLight,display:"block",marginBottom:4}}>{t.newPasswordOpt}</label>
        <input value={newPwd} onChange={e=>setNewPwd(e.target.value)} type="password" style={{...S.input,marginBottom:10}}/>
        <input value={confirmPwd} onChange={e=>setConfirmPwd(e.target.value)} placeholder={t.confirmNewPasswordOpt} type="password" style={S.input}/>
        <div style={{display:"flex",gap:8,marginTop:14}}>
          <button onClick={onClose} style={{...S.outlineBtn,flex:1,padding:"10px"}}>{t.cancelAction}</button>
          <button onClick={submit} style={{...S.wineBtn,flex:1,padding:"10px",marginTop:0}}>{t.saveChanges}</button>
        </div>
      </div>
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

  /* DARK MODE OVERRIDES — applied when body has [data-theme="dark"] */
  body[data-theme="dark"] { background:#1a0f14 !important; color:#f0e0e5; }
  body[data-theme="dark"] [style*="background: rgb(255, 255, 255)"],
  body[data-theme="dark"] [style*="background:#fff"],
  body[data-theme="dark"] [style*="background: #fff"] {
    background:#2a1820 !important;
  }
  body[data-theme="dark"] [style*="background: rgb(245, 240, 235)"],
  body[data-theme="dark"] [style*="background:#f5f0eb"] {
    background:#1a0f14 !important;
  }
  body[data-theme="dark"] [style*="background: rgb(250, 247, 244)"],
  body[data-theme="dark"] [style*="background:#faf7f4"] {
    background:#221318 !important;
  }
  body[data-theme="dark"] [style*="color: rgb(61, 31, 40)"],
  body[data-theme="dark"] [style*="color:#3d1f28"] {
    color:#f0e0e5 !important;
  }
  body[data-theme="dark"] [style*="color: rgb(122, 74, 85)"],
  body[data-theme="dark"] [style*="color:#7a4a55"] {
    color:#c8a0b0 !important;
  }
  body[data-theme="dark"] [style*="color: rgb(176, 144, 144)"],
  body[data-theme="dark"] [style*="color:#b09090"] {
    color:#7a5a65 !important;
  }
  body[data-theme="dark"] [style*="border: 1px solid rgb(232, 216, 220)"],
  body[data-theme="dark"] [style*="border:1px solid #e8d8dc"] {
    border-color:#3d2330 !important;
  }
  body[data-theme="dark"] input, body[data-theme="dark"] select, body[data-theme="dark"] textarea {
    background:#221318 !important; color:#f0e0e5 !important; border-color:#3d2330 !important;
  }
  body[data-theme="dark"] ::-webkit-scrollbar-thumb { background:#4a2c3a; }
`;
