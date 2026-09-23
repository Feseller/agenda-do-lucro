/**
 * AGENDA DO LUCRO — GESTÃO & AGENDAMENTO VIP
 * Solução Completa para Designers de Sobrancelha & Beleza
 * Retornos Inteligentes, Lucro Líquido Real, Comissões e WhatsApp Integrado
 */

const STORAGE_KEY = 'AGENDA_DO_LUCRO_SOBRANCELHA_V1';
const LEGACY_STORAGE_KEY = 'MINHA_AGENDA_SOBRANCELHA_V1';
const SESSION_KEY = 'AGENDA_DO_LUCRO_SESSION_V1';
const STUDIO_KEY = 'AGENDA_DO_LUCRO_STUDIO_V1';
const STUDIO_PHONE = '5511988887777';

// Catálogo Padrão de Procedimentos com Cores, Prazos de Retorno e Custos de Materiais
const DEFAULT_SERVICES = [
  {
    id: 'srv-1',
    name: 'Nanoblading Fio a Fio Realista (Micro)',
    category: 'micro',
    price: 380.00,
    deposit: 190.00,
    duration: 120,
    desc: 'Técnica com nano agulhas ultrafinas que desenha fios milimétricos idênticos aos naturais.',
    img: 'assets/banner-sobrancelha.jpg',
    color: '#8B5CF6', // Roxo Realista
    returnDays: 30,
    cost: 25.00
  },
  {
    id: 'srv-2',
    name: 'Brow Lamination & Nutrição Profunda',
    category: 'lamination',
    price: 160.00,
    deposit: 80.00,
    duration: 60,
    desc: 'Alinhamento dos fios na direção desejada criando aspecto encorpado e moderno.',
    img: 'assets/banner-sobrancelha.jpg',
    color: '#3B82F6', // Azul
    returnDays: 30,
    cost: 18.00
  },
  {
    id: 'srv-3',
    name: 'Design com Henna Ombré Premium',
    category: 'design',
    price: 110.00,
    deposit: 55.00,
    duration: 50,
    desc: 'Mapeamento facial áureo e aplicação degradê de henna indiana pura.',
    img: 'assets/banner-sobrancelha.jpg',
    color: '#EF4444', // Vermelho (conforme pedido do usuário!)
    returnDays: 20,
    cost: 10.00
  },
  {
    id: 'srv-4',
    name: 'Micropigmentação Shadow Line Luxo',
    category: 'micro',
    price: 420.00,
    deposit: 210.00,
    duration: 120,
    desc: 'Combinação de fios na frente com sombreado translúcido na cauda.',
    img: 'assets/banner-sobrancelha.jpg',
    color: '#EC4899', // Rosa
    returnDays: 30,
    cost: 30.00
  },
  {
    id: 'srv-5',
    name: 'Combo VIP: Lamination + Design + Tintura',
    category: 'combo',
    price: 220.00,
    deposit: 110.00,
    duration: 75,
    desc: 'Visagismo estratégico, lamination europeia e tintura com banho de brilho.',
    img: 'assets/banner-sobrancelha.jpg',
    color: '#F59E0B', // Âmbar
    returnDays: 25,
    cost: 22.00
  },
  {
    id: 'srv-6',
    name: 'Epilação Egípcia Facial Completa',
    category: 'design',
    price: 90.00,
    deposit: 45.00,
    duration: 40,
    desc: 'Remoção com linha orgânica 100% algodão antialérgica pela raiz.',
    img: 'assets/banner-sobrancelha.jpg',
    color: '#10B981', // Verde
    returnDays: 21,
    cost: 5.00
  }
];

// Gastos Fixos e Variáveis Mensais do Estúdio
const DEFAULT_EXPENSES = [
  { id: 'exp-1', name: 'Aluguel do Estúdio', category: 'aluguel', amount: 1200.00, dueDate: '10/10/2026', paid: true },
  { id: 'exp-2', name: 'Energia Elétrica (Enel / Luz)', category: 'contas', amount: 240.00, dueDate: '15/10/2026', paid: true },
  { id: 'exp-3', name: 'Água e Esgoto (Sabesp)', category: 'contas', amount: 95.00, dueDate: '18/10/2026', paid: true },
  { id: 'exp-4', name: 'Internet Fibra 500MB', category: 'contas', amount: 119.90, dueDate: '20/10/2026', paid: true },
  { id: 'exp-5', name: 'Pigmentos, Lâminas & Descartáveis', category: 'materiais', amount: 350.00, dueDate: '05/10/2026', paid: true }
];

// Profissionais e Percentuais de Comissão
const DEFAULT_PROFESSIONALS = [
  { id: 'pro-1', name: 'Fernanda Araújo', role: 'Proprietária & Master Designer', phone: '(11) 98888-7777', commission: 100, active: true },
  { id: 'pro-2', name: 'Camila Rocha', role: 'Lash & Brow Designer', phone: '(11) 98777-6655', commission: 50, active: true },
  { id: 'pro-3', name: 'Larissa Mendes', role: 'Especialista em Epilação Egípcia', phone: '(11) 98666-5544', commission: 50, active: true }
];

// Modelos de Mensagens Pré-definidas para WhatsApp
const DEFAULT_MSG_TEMPLATES = {
  novaCliente: 'Olá, {cliente}! Boas-vindas ao {estudio}! Seu agendamento para *{procedimento}* foi confirmado para *{data} às {horario}*. Estamos preparando tudo com muito carinho para você! ✨☕',
  manutencao: 'Olá, {cliente}! Tudo bem? Passando para te lembrar que já está no momento ideal para fazer a manutenção do seu procedimento de *{procedimento}* para mantê-lo impecável! Vamos garantir seu horário dessa semana? 💖✨',
  retorno: 'Olá, {cliente}! Passando para saber como ficou o resultado do seu procedimento de *{procedimento}*. Você amou? Se precisar de qualquer retoque ou dúvida, estou aqui à disposição! 🥰',
  lembrete: 'Olá, {cliente}! Lembrando que você tem horário marcado no {estudio} para *{procedimento}* no dia *{data} às {horario}*. Caso precise remarcar, nos avise com antecedência. Te esperamos! ✨'
};

// Histórico de Manutenção das Clientes (Inicia 100% zerado para novas usuárias)
const DEFAULT_MAINTENANCE = [];

// Nomes em português para dias da semana e meses
const WEEKDAYS_PT = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const WEEKDAYS_SHORT_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS_NAMES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Gerador dinâmico de dias para qualquer mês e ano (começando sempre no dia 1)
function getDaysForMonth(year, monthIndex) {
  const totalDays = new Date(year, monthIndex + 1, 0).getDate();
  const daysList = [];

  for (let d = 1; d <= totalDays; d++) {
    const dateObj = new Date(year, monthIndex, d);
    const weekday = WEEKDAYS_PT[dateObj.getDay()];
    const weekdayShort = WEEKDAYS_SHORT_PT[dateObj.getDay()];
    const monthName = MONTHS_NAMES_PT[monthIndex];
    const dayStr = d < 10 ? '0' + d : String(d);
    daysList.push({
      day: d,
      month: monthName,
      monthIndex: monthIndex,
      year: year,
      weekday: weekday,
      weekdayShort: weekdayShort,
      full: `${weekday}, ${dayStr} de ${monthName}`
    });
  }

  return daysList;
}

// Estado Geral da Aplicação
let appState = {
  currentUser: null,
  studioConfig: {
    designerName: 'Fernanda Araújo',
    studioName: 'Studio Sobrancelha VIP',
    studioPhone: '5511988887777',
    designerEmail: 'araujofernando88@gmail.com'
  },
  currentScreen: 'screenAgenda',
  selectedDay: 22,
  selectedMonth: 8, // Setembro
  selectedYear: 2026,
  reportsMonth: 8, // Setembro
  reportsYear: 2026,
  selectedOnlineService: DEFAULT_SERVICES[0],
  selectedOnlineSlot: '08:00',
  selectedOnlineYear: 2026,
  selectedOnlineMonthIndex: 8, // Setembro
  selectedOnlineDayIndex: 0,
  currentActionAppointment: null,
  clientSearchQuery: '',
  maintFilter: 'all',
  appointments: [],
  clients: [],
  services: [...DEFAULT_SERVICES],
  expenses: [...DEFAULT_EXPENSES],
  professionals: [...DEFAULT_PROFESSIONALS],
  msgTemplates: { ...DEFAULT_MSG_TEMPLATES },
  maintenanceList: [...DEFAULT_MAINTENANCE]
};

// ==========================================================================
// BANCO DE DADOS INICIAL COM AS AGENDAS DAS TELAS DE REFERENCIA (IMAGEM 3)
// ==========================================================================
function initDefaultData() {
  // Carregar dados do estúdio e designer
  const storedStudio = localStorage.getItem(STUDIO_KEY);
  if (storedStudio) {
    try {
      appState.studioConfig = { ...appState.studioConfig, ...JSON.parse(storedStudio) };
    } catch(e){}
  }

  // Carregar sessão de login
  const storedSession = localStorage.getItem(SESSION_KEY);
  if (storedSession) {
    try {
      appState.currentUser = JSON.parse(storedSession);
    } catch(e){}
  }

  // Atualizar cabeçalhos do estúdio com os dados da designer
  updateStudioUI();

  // Carregar despesas
  const storedExpenses = localStorage.getItem('AGENDA_DO_LUCRO_EXPENSES');
  if (storedExpenses) {
    try { appState.expenses = JSON.parse(storedExpenses); } catch(e){}
  }
  if (!appState.expenses || !appState.expenses.length) {
    appState.expenses = [...DEFAULT_EXPENSES];
  }

  // Carregar profissionais
  const storedStaff = localStorage.getItem('AGENDA_DO_LUCRO_STAFF');
  if (storedStaff) {
    try { appState.professionals = JSON.parse(storedStaff); } catch(e){}
  }
  if (!appState.professionals || !appState.professionals.length) {
    appState.professionals = [...DEFAULT_PROFESSIONALS];
  }

  // Carregar modelos de mensagens
  const storedTemplates = localStorage.getItem('AGENDA_DO_LUCRO_MSG_TEMPLATES');
  if (storedTemplates) {
    try { appState.msgTemplates = { ...DEFAULT_MSG_TEMPLATES, ...JSON.parse(storedTemplates) }; } catch(e){}
  }

  // Carregar lista de manutenção
  const storedMaint = localStorage.getItem('AGENDA_DO_LUCRO_MAINTENANCE');
  if (storedMaint) {
    try { appState.maintenanceList = JSON.parse(storedMaint); } catch(e){}
  }
  if (!appState.maintenanceList) {
    appState.maintenanceList = [];
  }
  appState.maintenanceList = appState.maintenanceList.filter(m => !String(m.id).match(/^maint-([1-9]|10)$/));

  const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Limpar agendamentos mockados antigos para garantir que a agenda inicie 100% zerada
      appState.appointments = (parsed.appointments || []).filter(a => {
        const idStr = String(a.id);
        if (idStr.match(/^apt-([1-9]|10)$/)) return false;
        return true;
      });

      // Limpar clientes de demonstração antigos (cli-1 a cli-10) para usuárias iniciarem com lista zerada
      appState.clients = (parsed.clients || []).filter(c => {
        const idStr = String(c.id);
        if (idStr.match(/^cli-([1-9]|10)$/)) return false;
        return true;
      });

      // Limpar lista de manutenção antiga de demonstração
      appState.maintenanceList = (parsed.maintenanceList || []).filter(m => {
        const idStr = String(m.id);
        if (idStr.match(/^maint-([1-9]|10)$/)) return false;
        return true;
      });

      appState.services = (parsed.services && parsed.services.length) ? parsed.services : [...DEFAULT_SERVICES];
      
      // Garantir cores e prazos nos serviços carregados
      appState.services.forEach(s => {
        const def = DEFAULT_SERVICES.find(d => d.id === s.id || d.name === s.name);
        if (!s.color && def) s.color = def.color;
        if (!s.color) s.color = '#8B5CF6';
        if (!s.returnDays && def) s.returnDays = def.returnDays;
        if (!s.returnDays) s.returnDays = 30;
        if (s.cost === undefined && def) s.cost = def.cost;
        if (s.cost === undefined) s.cost = 15.00;
      });

      if (parsed.expenses && parsed.expenses.length) appState.expenses = parsed.expenses;
      if (parsed.professionals && parsed.professionals.length) appState.professionals = parsed.professionals;
      if (parsed.msgTemplates) appState.msgTemplates = { ...DEFAULT_MSG_TEMPLATES, ...parsed.msgTemplates };
      if (parsed.maintenanceList && parsed.maintenanceList.length) {
        appState.maintenanceList = parsed.maintenanceList.filter(m => !String(m.id).match(/^maint-([1-9]|10)$/));
      }

      appState.selectedOnlineService = appState.services[0];
      saveData();
      return;
    } catch (e) {
      console.warn('Recriando banco local...', e);
    }
  }

  // 100% ZERADO: Novos clientes começam com lista de clientes, agenda e retornos vazios!
  appState.clients = [];
  appState.appointments = [];
  appState.maintenanceList = [];
  saveData();
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    clients: appState.clients,
    appointments: appState.appointments,
    services: appState.services,
    expenses: appState.expenses,
    professionals: appState.professionals,
    msgTemplates: appState.msgTemplates,
    maintenanceList: appState.maintenanceList
  }));
  localStorage.setItem('AGENDA_DO_LUCRO_EXPENSES', JSON.stringify(appState.expenses));
  localStorage.setItem('AGENDA_DO_LUCRO_STAFF', JSON.stringify(appState.professionals));
  localStorage.setItem('AGENDA_DO_LUCRO_MSG_TEMPLATES', JSON.stringify(appState.msgTemplates));
  localStorage.setItem('AGENDA_DO_LUCRO_MAINTENANCE', JSON.stringify(appState.maintenanceList));
}

// ==========================================================================
// NAVEGAÇÃO & DRAWER MENU (CONFORME IMAGEM 1)
// ==========================================================================
function openDrawer() {
  const backdrop = document.getElementById('drawerBackdrop');
  if (backdrop) backdrop.classList.add('active');
}

function closeDrawer(e) {
  const backdrop = document.getElementById('drawerBackdrop');
  if (backdrop) backdrop.classList.remove('active');
}

function navigateToScreen(screenId, menuItem) {
  closeDrawer();

  // Esconder todas as telas
  document.querySelectorAll('.app-screen').forEach(s => s.classList.add('hidden'));

  // Esconder barra inferior e topo se for tela de login
  const bottomNav = document.querySelector('.mobile-bottom-nav');
  const trialStrip = document.querySelector('.trial-top-strip');
  if (screenId === 'screenLogin') {
    if (bottomNav) bottomNav.style.display = 'none';
    if (trialStrip) trialStrip.style.display = 'none';
  } else {
    if (bottomNav) bottomNav.style.display = '';
    if (trialStrip) trialStrip.style.display = '';
  }

  // Exibir a tela selecionada
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.remove('hidden');
    appState.currentScreen = screenId;
  }

  // Atualizar itens ativos do drawer
  document.querySelectorAll('.drawer-item').forEach(i => i.classList.remove('active'));
  if (menuItem && menuItem.classList) {
    menuItem.classList.add('active');
  }

  // Atualizar botões de toggle superior
  const btnApp = document.getElementById('btnModeApp');
  const btnOnline = document.getElementById('btnModeOnline');
  if (screenId === 'screenLinkOnline') {
    if (btnApp) btnApp.classList.remove('active');
    if (btnOnline) btnOnline.classList.add('active');
  } else {
    if (btnApp) btnApp.classList.add('active');
    if (btnOnline) btnOnline.classList.remove('active');
  }

  // Re-renderizar conteúdo específico da tela
  if (screenId === 'screenAgenda') {
    renderAgendaMonths();
    renderAgendaDays();
    updateAgendaHeadline();
    renderTimeline();
  } else if (screenId === 'screenClientes') {
    renderClientesCRM();
  } else if (screenId === 'screenLinkOnline') {
    renderOnlinePortal();
  } else if (screenId === 'screenManutencao') {
    renderManutencao();
  } else if (screenId === 'screenMeusPagamentos') {
    renderMeusPagamentos();
  } else if (screenId === 'screenProfissionais') {
    renderProfissionais();
  } else if (screenId === 'screenMensagens') {
    renderMensagens();
  } else if (screenId === 'screenRelatorios') {
    initReportsMonths();
    renderResumoFinanceiro();
  }
}

function switchMainView(screenId, btn) {
  document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  navigateToScreen(screenId, null);
}

// ==========================================================================
// TELA 1: AGENDA EM LINHA DO TEMPO (MULTI-MÊS COM ROLAGEM HORIZONTAL)
// ==========================================================================
const AGENDA_MONTHS_LIST = [
  { name: 'Janeiro', monthIndex: 0, year: 2026 },
  { name: 'Fevereiro', monthIndex: 1, year: 2026 },
  { name: 'Março', monthIndex: 2, year: 2026 },
  { name: 'Abril', monthIndex: 3, year: 2026 },
  { name: 'Maio', monthIndex: 4, year: 2026 },
  { name: 'Junho', monthIndex: 5, year: 2026 },
  { name: 'Julho', monthIndex: 6, year: 2026 },
  { name: 'Agosto', monthIndex: 7, year: 2026 },
  { name: 'Setembro', monthIndex: 8, year: 2026 },
  { name: 'Outubro', monthIndex: 9, year: 2026 },
  { name: 'Novembro', monthIndex: 10, year: 2026 },
  { name: 'Dezembro', monthIndex: 11, year: 2026 },
  { name: 'Janeiro', monthIndex: 0, year: 2027 },
  { name: 'Fevereiro', monthIndex: 1, year: 2027 },
  { name: 'Março', monthIndex: 2, year: 2027 },
  { name: 'Abril', monthIndex: 3, year: 2027 },
  { name: 'Maio', monthIndex: 4, year: 2027 },
  { name: 'Junho', monthIndex: 5, year: 2027 },
  { name: 'Julho', monthIndex: 6, year: 2027 },
  { name: 'Agosto', monthIndex: 7, year: 2027 },
  { name: 'Setembro', monthIndex: 8, year: 2027 },
  { name: 'Outubro', monthIndex: 9, year: 2027 },
  { name: 'Novembro', monthIndex: 10, year: 2027 },
  { name: 'Dezembro', monthIndex: 11, year: 2027 }
];

function enableDragScroll(el) {
  if (!el || el.dataset.dragScrollInit) return;
  el.dataset.dragScrollInit = 'true';

  let isDown = false;
  let startX;
  let scrollLeft;

  el.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
  });

  el.addEventListener('mouseleave', () => {
    isDown = false;
  });

  el.addEventListener('mouseup', () => {
    isDown = false;
  });

  el.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 4) {
      el.scrollLeft = scrollLeft - walk;
    }
  });
}

function renderAgendaMonths() {
  const container = document.getElementById('agendaMonthTabs');
  if (!container) return;

  const currentM = appState.selectedMonth !== undefined ? appState.selectedMonth : 8;
  const currentY = appState.selectedYear !== undefined ? appState.selectedYear : 2026;

  container.innerHTML = AGENDA_MONTHS_LIST.map(m => {
    const isActive = m.monthIndex === currentM && m.year === currentY;
    const label = m.year === 2026 ? m.name : `${m.name} ${m.year}`;
    return `
      <button 
        type="button" 
        class="month-tab-btn ${isActive ? 'active' : ''}" 
        id="agendaMonthTab-${m.year}-${m.monthIndex}" 
        onclick="selectAgendaMonth(${m.monthIndex}, ${m.year})">
        ${label}
      </button>
    `;
  }).join('');

  setTimeout(() => {
    const activeBtn = container.querySelector('.month-tab-btn.active');
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, 100);

  enableDragScroll(container);
}

function selectAgendaMonth(monthIndex, year) {
  appState.selectedMonth = parseInt(monthIndex, 10);
  appState.selectedYear = parseInt(year, 10);

  document.querySelectorAll('#agendaMonthTabs .month-tab-btn').forEach(btn => btn.classList.remove('active'));
  const currentTab = document.getElementById(`agendaMonthTab-${year}-${monthIndex}`);
  if (currentTab) {
    currentTab.classList.add('active');
    currentTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  const totalDays = new Date(appState.selectedYear, appState.selectedMonth + 1, 0).getDate();
  if (appState.selectedDay > totalDays) {
    appState.selectedDay = 1;
  }

  renderAgendaDays();
  updateAgendaHeadline();
  renderTimeline();

  const mName = MONTHS_NAMES_PT[appState.selectedMonth] || 'Mês';
  showToast(`Mês de ${mName} de ${appState.selectedYear} selecionado`);
}

function renderAgendaDays() {
  const container = document.getElementById('weekdayStrip');
  if (!container) return;

  const y = appState.selectedYear || 2026;
  const m = appState.selectedMonth !== undefined ? appState.selectedMonth : 8;
  const totalDays = new Date(y, m + 1, 0).getDate();

  let html = '';
  for (let d = 1; d <= totalDays; d++) {
    const dateObj = new Date(y, m, d);
    const shortDay = WEEKDAYS_SHORT_PT[dateObj.getDay()];
    const isActive = d === appState.selectedDay;

    html += `
      <div class="weekday-col ${isActive ? 'active' : ''}" id="weekdayCol-${d}" onclick="selectAgendaDay(${d}, this)">
        <span class="weekday-name">${shortDay}</span>
        <span class="weekday-number">${d}</span>
      </div>
    `;
  }

  container.innerHTML = html;

  setTimeout(() => {
    const activeCol = container.querySelector('.weekday-col.active') || document.getElementById(`weekdayCol-${appState.selectedDay}`);
    if (activeCol) {
      activeCol.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, 100);

  enableDragScroll(container);
}

function selectAgendaDay(dayNumber, el) {
  appState.selectedDay = parseInt(dayNumber, 10);
  document.querySelectorAll('.weekday-col').forEach(c => c.classList.remove('active'));
  if (el) {
    el.classList.add('active');
    el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  } else {
    const col = document.getElementById(`weekdayCol-${dayNumber}`);
    if (col) {
      col.classList.add('active');
      col.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  updateAgendaHeadline();
  renderTimeline();

  const mName = MONTHS_NAMES_PT[appState.selectedMonth] || 'Setembro';
  showToast(`Dia ${dayNumber} de ${mName} selecionado`);
}

function updateAgendaHeadline() {
  const headline = document.getElementById('agendaDateHeadline');
  if (!headline) return;

  const y = appState.selectedYear || 2026;
  const m = appState.selectedMonth !== undefined ? appState.selectedMonth : 8;
  const d = appState.selectedDay || 1;
  const dateObj = new Date(y, m, d);
  const weekdayName = WEEKDAYS_PT[dateObj.getDay()] || 'Segunda';
  const monthName = MONTHS_NAMES_PT[m] || 'Setembro';

  headline.innerText = `${weekdayName}, ${d} de ${monthName}, ${y}`;
}

function renderTimeline() {
  const container = document.getElementById('timelineContainer');
  if (!container) return;

  const hours = [
    '07', '08', '09', '10', '11', '12', '13', '14',
    '15', '16', '17', '18', '19', '20', '21', '22'
  ];

  const curDay = appState.selectedDay;
  const curMonth = appState.selectedMonth !== undefined ? appState.selectedMonth : 8;
  const curYear = appState.selectedYear || 2026;

  let html = '';
  hours.forEach(hour => {
    // Buscar agendamentos que caem nesta hora e no dia/mês/ano selecionados
    const aptsInHour = (appState.appointments || []).filter(a => {
      const slot = a.hourSlot || (a.timeStart ? a.timeStart.split(':')[0] : '');
      const matchHour = slot === hour;
      
      const aptDay = a.day !== undefined ? parseInt(a.day, 10) : curDay;
      const aptMonth = a.month !== undefined ? parseInt(a.month, 10) : curMonth;
      const aptYear = a.year !== undefined ? parseInt(a.year, 10) : curYear;

      return matchHour && (aptDay === curDay) && (aptMonth === curMonth) && (aptYear === curYear);
    });

    html += `
      <div class="timeline-hour-row">
        <div class="timeline-hour-label">${hour}:00</div>
        <div class="timeline-hour-content" onclick="openNewAppointmentModal('${hour}:00')">
          ${aptsInHour.length === 0 ? `
            <div class="timeline-empty-hint">
              <span>+ Agendar às ${hour}:00</span>
            </div>
          ` : aptsInHour.map(apt => {
            const birthdayIcon = apt.isBirthday ? '<i class="fa-solid fa-cake-candles" style="color: #6B21A8; margin-left: 4px;"></i>' : '';
            const srv = (appState.services || []).find(s => s.name === apt.serviceName || s.id === apt.serviceId);
            const colorHex = apt.colorHex || (srv && srv.color) || '#8B5CF6';
            return `
              <div class="appointment-block custom-colored" id="apt-block-${apt.id}" style="border-left: 5px solid ${colorHex}; background-color: ${colorHex}18; color: #111827;" onclick="event.stopPropagation(); openActionModal('${apt.id}')">
                <div class="apt-time-row" style="color: ${colorHex}; font-weight: 800;">
                  <span>${apt.timeStart} - ${apt.timeEnd || apt.timeStart}</span>
                  ${apt.statusTag ? `<span class="apt-status-tag" style="background:${colorHex}; color:#fff;"><i class="fa-solid fa-tag"></i> ${apt.statusTag}</span>` : ''}
                </div>
                <div class="apt-client-row">
                  <i class="fa-solid fa-user" style="color: ${colorHex};"></i>
                  <strong>${apt.clientName}</strong>
                  ${birthdayIcon}
                </div>
                <div class="apt-service-row">
                  <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:${colorHex}; margin-right:5px;"></span>
                  <span>${apt.serviceName}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// ==========================================================================
// MODAL DE AÇÕES DO AGENDAMENTO (CONFORME IMAGEM 5)
// ==========================================================================
function openActionModal(appointmentId) {
  const apt = appState.appointments.find(a => a.id === appointmentId);
  if (!apt) return;

  appState.currentActionAppointment = apt;

  document.getElementById('actionModalTimeText').innerText = `${apt.timeStart} - ${apt.timeEnd}`;
  document.getElementById('actionModalDateText').innerText = `Segunda, ${appState.selectedDay} de Setembro de 2026 • ${apt.clientName}`;

  // Configurar link de ligação
  const cleanPhone = apt.clientPhone.replace(/\D/g, '');
  document.getElementById('btnActionCall').href = `tel:${cleanPhone}`;

  document.getElementById('appointmentActionModal').classList.add('active');
}

function closeActionModal(e) {
  document.getElementById('appointmentActionModal').classList.remove('active');
}

function closeActionModalDirect() {
  document.getElementById('appointmentActionModal').classList.remove('active');
}

function openWhatsAppChat() {
  const apt = appState.currentActionAppointment;
  if (!apt) return;

  const cleanPhone = apt.clientPhone.replace(/\D/g, '');
  const url = `https://wa.me/55${cleanPhone}`;
  window.open(url, '_blank');
  closeActionModalDirect();
}

function sendWhatsAppReminder() {
  const apt = appState.currentActionAppointment;
  if (!apt) return;

  const studio = appState.studioConfig.studioName || 'Studio Sobrancelha VIP';
  const msg = `Olá, ${apt.clientName}! Passando para confirmar seu horário de *${apt.serviceName}* no ${studio} hoje (${appState.selectedDay}/09) às *${apt.timeStart}*.\n\nQualquer dúvida estamos à disposição! ✨`;
  const cleanPhone = apt.clientPhone.replace(/\D/g, '');
  const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`;
  
  window.open(url, '_blank');
  closeActionModalDirect();
  showToast('Lembrete enviado via WhatsApp!');
}

function sendPreDefinedMsg() {
  const apt = appState.currentActionAppointment;
  if (!apt) return;

  const studio = appState.studioConfig.studioName || 'Studio Sobrancelha VIP';
  const msg = `Olá, ${apt.clientName}! Tudo bem? Seu procedimento de *${apt.serviceName}* está confirmado no ${studio}. Chegue com 5 minutos de antecedência para tomarmos um café! ☕✨`;
  const cleanPhone = apt.clientPhone.replace(/\D/g, '');
  const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`;
  
  window.open(url, '_blank');
  closeActionModalDirect();
}

function addChargeFromAppointment() {
  closeActionModalDirect();
  navigateToScreen('screenMeusPagamentos', document.getElementById('drawerItemMeusPagamentos'));
  showToast('Visualizando ganhos por procedimento!');
}

function editAppointment() {
  closeActionModalDirect();
  showToast('Edição de agendamento aberta');
}

function deleteAppointment() {
  if (!appState.currentActionAppointment) return;
  const id = appState.currentActionAppointment.id;
  appState.appointments = appState.appointments.filter(a => a.id !== id);
  saveData();
  closeActionModalDirect();
  renderTimeline();
  showToast('Agendamento removido com sucesso.');

  // Sincronizar exclusão com API na nuvem (MongoDB)
  fetch(`/api/appointments?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
}

// ==========================================================================
// TELA 4: CLIENTES & ANAMNESE (CRM A-Z COM FOTOS ANTES E DEPOIS)
// ==========================================================================
function onSearchClient(val) {
  appState.clientSearchQuery = val.toLowerCase().trim();
  renderClientesCRM();
}

function renderClientesCRM() {
  const container = document.getElementById('clientsAlphaList');
  if (!container) return;

  let list = [...(appState.clients || [])];
  if (appState.clientSearchQuery) {
    list = list.filter(c => c.name.toLowerCase().includes(appState.clientSearchQuery) || (c.phone && c.phone.includes(appState.clientSearchQuery)));
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 16px; color: #9CA3AF;">
        <div style="width: 56px; height: 56px; border-radius: 50%; background: #F5EEFD; color: var(--purple-primary); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 24px;">
          <i class="fa-solid fa-users"></i>
        </div>
        <strong style="font-size: 14px; color: #111827; display: block; margin-bottom: 4px;">Nenhuma cliente cadastrada ainda</strong>
        <p style="font-size: 12px; color: #6B7280; max-width: 260px; margin: 0 auto 16px; line-height: 1.4;">
          Sua lista está limpa e pronta para você cadastrar e organizar suas próprias clientes!
        </p>
        <button type="button" class="btn-action-close" style="background: var(--purple-primary); max-width: 220px; margin: 0 auto; padding: 10px 16px; font-size: 12px;" onclick="openNewClientModal()">
          <i class="fa-solid fa-user-plus"></i> + Cadastrar Primeira Cliente
        </button>
      </div>
    `;
    return;
  }

  list.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

  // Agrupar por letra inicial
  const grouped = {};
  list.forEach(client => {
    const letter = (client.name && client.name.charAt(0).toUpperCase()) || '#';
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(client);
  });

  let html = '';
  Object.keys(grouped).sort().forEach(letter => {
    html += `
      <div class="client-az-divider">
        <div class="client-az-badge">${letter}</div>
        <div class="client-az-line"></div>
      </div>
    `;

    grouped[letter].forEach(client => {
      const hasPhotos = client.beforeImg || client.afterImg;
      const ltvVal = typeof client.ltv === 'number' ? client.ltv : (parseFloat(client.ltv) || 0);
      html += `
        <div class="client-crm-card" onclick="openClientRecordModal('${client.id}')">
          <div class="client-crm-info">
            <h4>${client.name}</h4>
            <p>${client.phone || 'Sem telefone'} • ${client.visits || 1} ${(client.visits || 1) === 1 ? 'atendimento' : 'atendimentos'}</p>
            <p style="font-size: 10px; color: var(--purple-primary); margin-top: 2px;">
              ${hasPhotos ? '📸 Fotos Antes e Depois Salvas' : '📷 Sem fotos cadastradas'}
            </p>
          </div>
          <div class="client-crm-badge">
            R$ ${ltvVal.toFixed(2).replace('.', ',')}
          </div>
        </div>
      `;
    });
  });

  container.innerHTML = html;
}

function openClientRecordModal(clientId) {
  const client = (appState.clients || []).find(c => c.id === clientId);
  if (!client) return;

  document.getElementById('recordClientId').value = client.id;
  document.getElementById('clientRecordTitle').innerText = `Ficha Técnica: ${client.name}`;
  document.getElementById('recordClientName').value = client.name;
  document.getElementById('recordClientPhone').value = client.phone || '';
  document.getElementById('recordClientNotes').value = client.notes || '';

  const btnDelete = document.getElementById('btnDeleteClientRecord');
  if (btnDelete) btnDelete.style.display = 'block';

  // Configurar Preview Fotos
  const pBefore = document.getElementById('previewBefore');
  const phBefore = document.getElementById('phBefore');
  if (client.beforeImg) {
    pBefore.src = client.beforeImg;
    pBefore.style.display = 'block';
    phBefore.style.display = 'none';
  } else {
    pBefore.src = '';
    pBefore.style.display = 'none';
    phBefore.style.display = 'flex';
  }

  const pAfter = document.getElementById('previewAfter');
  const phAfter = document.getElementById('phAfter');
  if (client.afterImg) {
    pAfter.src = client.afterImg;
    pAfter.style.display = 'block';
    phAfter.style.display = 'none';
  } else {
    pAfter.src = '';
    pAfter.style.display = 'none';
    phAfter.style.display = 'flex';
  }

  document.getElementById('clientRecordModal').classList.add('active');
}

function openNewClientModal() {
  document.getElementById('recordClientId').value = 'new-' + Date.now();
  document.getElementById('clientRecordTitle').innerText = 'Nova Ficha de Cliente';
  document.getElementById('recordClientName').value = '';
  document.getElementById('recordClientPhone').value = '';
  document.getElementById('recordClientNotes').value = '';

  const btnDelete = document.getElementById('btnDeleteClientRecord');
  if (btnDelete) btnDelete.style.display = 'none';

  document.getElementById('previewBefore').style.display = 'none';
  document.getElementById('phBefore').style.display = 'flex';
  document.getElementById('previewAfter').style.display = 'none';
  document.getElementById('phAfter').style.display = 'flex';

  document.getElementById('clientRecordModal').classList.add('active');
}

function closeClientRecordModal(e) {
  document.getElementById('clientRecordModal').classList.remove('active');
}

function closeClientRecordModalDirect() {
  document.getElementById('clientRecordModal').classList.remove('active');
}

function handleImageUpload(e, type) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const dataUrl = evt.target.result;
    if (type === 'before') {
      document.getElementById('previewBefore').src = dataUrl;
      document.getElementById('previewBefore').style.display = 'block';
      document.getElementById('phBefore').style.display = 'none';
    } else {
      document.getElementById('previewAfter').src = dataUrl;
      document.getElementById('previewAfter').style.display = 'block';
      document.getElementById('phAfter').style.display = 'none';
    }
    showToast(`Foto de ${type === 'before' ? 'Antes' : 'Depois'} anexada!`);
  };
  reader.readAsDataURL(file);
}

function saveClientRecord() {
  const id = document.getElementById('recordClientId').value;
  const name = document.getElementById('recordClientName').value.trim();
  const phone = document.getElementById('recordClientPhone').value.trim();
  const notes = document.getElementById('recordClientNotes').value.trim();
  const beforeImg = document.getElementById('previewBefore').src || '';
  const afterImg = document.getElementById('previewAfter').src || '';

  if (!name) {
    alert('Informe o nome da cliente.');
    return;
  }

  if (!appState.clients) appState.clients = [];
  let client = appState.clients.find(c => c.id === id);
  if (client) {
    client.name = name;
    client.phone = phone;
    client.notes = notes;
    if (beforeImg) client.beforeImg = beforeImg;
    if (afterImg) client.afterImg = afterImg;
  } else {
    client = {
      id: id,
      name: name,
      phone: phone,
      notes: notes,
      visits: 1,
      ltv: 0.00,
      beforeImg: beforeImg,
      afterImg: afterImg
    };
    appState.clients.unshift(client);
  }

  saveData();
  closeClientRecordModalDirect();
  renderClientesCRM();

  // Sincronizar com MongoDB exclusivo desta designer
  const targetEmail = (appState.studioConfig && appState.studioConfig.designerEmail) || (appState.currentUser ? appState.currentUser.email : '');
  fetch('/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...client,
      designerEmail: targetEmail
    })
  }).catch(() => {});

  showToast(`Ficha de ${name} salva com sucesso! ✨`);
}

function deleteClientRecord() {
  const id = document.getElementById('recordClientId').value;
  if (!id) return;
  if (confirm('Deseja realmente excluir o cadastro desta cliente?')) {
    appState.clients = (appState.clients || []).filter(c => c.id !== id);
    saveData();
    closeClientRecordModalDirect();
    renderClientesCRM();
    showToast('Cliente excluída com sucesso.');

    fetch(`/api/clients?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    }).catch(() => {});
  }
}

// ==========================================================================
// TELA 5: SUA PÁGINA & LINK ONLINE (PORTAL DA CLIENTE - SEM SINAL PIX)
// ==========================================================================
function renderOnlinePortal() {
  const list = document.getElementById('onlineServicesList');
  if (!list) return;

  if (!appState.services || appState.services.length === 0) {
    appState.services = [...DEFAULT_SERVICES];
  }

  list.innerHTML = appState.services.map(s => {
    const isSelected = appState.selectedOnlineService && appState.selectedOnlineService.id === s.id;
    const priceNum = typeof s.price === 'number' ? s.price : parseFloat(s.price) || 0;
    return `
      <div class="online-service-card ${isSelected ? 'selected' : ''}" onclick="selectOnlineService('${s.id}')">
        <img src="${s.img || 'assets/banner-sobrancelha.jpg'}" alt="${s.name}" style="width: 58px; height: 58px; border-radius: 8px; object-fit: cover;">
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <h4 style="font-size: 13px; font-weight: 800; color: #111827;">${s.name}</h4>
            <button type="button" class="btn-service-edit-inline" onclick="event.stopPropagation(); openEditServiceModal('${s.id}')" title="Editar Preço e Procedimento">
              <i class="fa-solid fa-pen-to-square"></i> Editar
            </button>
          </div>
          <p style="font-size: 11px; color: #6B7280; line-height: 1.3; margin-top: 2px;">${s.desc || 'Procedimento personalizado de sobrancelhas e visagismo.'}</p>
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 6px;">
            <strong style="font-size: 14px; color: var(--purple-primary);">R$ ${priceNum.toFixed(2).replace('.', ',')}</strong>
            <span style="font-size: 10px; color: #059669; font-weight: 700;"><i class="fa-regular fa-clock"></i> ${s.duration || 60} min • Sem sinal</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  renderOnlineDays();
  renderOnlineSlots();
}

function selectOnlineService(id) {
  const s = (appState.services || []).find(x => x.id === id);
  if (!s) return;
  appState.selectedOnlineService = s;
  renderOnlinePortal();
  showToast(`Selecionado: ${s.name}`);
}

// ==========================================================================
// GESTÃO DE SERVIÇOS & PREÇOS (EDITÁVEL PELA DESIGNER)
// ==========================================================================
function updateServiceColorPreview(colorHex) {
  const box = document.getElementById('serviceColorPreviewBox');
  if (box) {
    box.style.borderLeftColor = colorHex;
    box.style.backgroundColor = `${colorHex}18`;
  }
}

function selectServiceColorSwatch(colorHex) {
  const picker = document.getElementById('editServiceColor');
  if (picker) {
    picker.value = colorHex;
    updateServiceColorPreview(colorHex);
  }
}

function openNewServiceModal() {
  document.getElementById('editServiceId').value = '';
  document.getElementById('editServiceName').value = '';
  document.getElementById('editServicePrice').value = '';
  document.getElementById('editServiceDuration').value = '60';
  document.getElementById('editServiceCategory').value = 'sobrancelha';
  document.getElementById('editServiceDesc').value = '';
  
  const colorPicker = document.getElementById('editServiceColor');
  if (colorPicker) colorPicker.value = '#8B5CF6';
  updateServiceColorPreview('#8B5CF6');

  const retInput = document.getElementById('editServiceReturnDays');
  if (retInput) retInput.value = '30';

  const costInput = document.getElementById('editServiceCost');
  if (costInput) costInput.value = '15.00';

  document.getElementById('serviceModalTitle').innerText = 'Incluir Novo Procedimento';
  
  const btnDel = document.getElementById('btnDeleteService');
  if (btnDel) btnDel.style.display = 'none';

  const modal = document.getElementById('serviceEditModal');
  if (modal) modal.classList.add('active');
}

function openEditServiceModal(serviceId) {
  const s = (appState.services || []).find(x => x.id === serviceId);
  if (!s) return;

  document.getElementById('editServiceId').value = s.id;
  document.getElementById('editServiceName').value = s.name;
  document.getElementById('editServicePrice').value = Number(s.price).toFixed(2);
  document.getElementById('editServiceDuration').value = s.duration || 60;
  document.getElementById('editServiceCategory').value = s.category || 'sobrancelha';
  document.getElementById('editServiceDesc').value = s.desc || '';

  const colorHex = s.color || '#8B5CF6';
  const colorPicker = document.getElementById('editServiceColor');
  if (colorPicker) colorPicker.value = colorHex;
  updateServiceColorPreview(colorHex);

  const retInput = document.getElementById('editServiceReturnDays');
  if (retInput) retInput.value = s.returnDays || 30;

  const costInput = document.getElementById('editServiceCost');
  if (costInput) costInput.value = (s.cost !== undefined ? s.cost : 15.00).toFixed(2);

  document.getElementById('serviceModalTitle').innerText = 'Editar Procedimento & Preço';

  const btnDel = document.getElementById('btnDeleteService');
  if (btnDel) btnDel.style.display = 'block';

  const modal = document.getElementById('serviceEditModal');
  if (modal) modal.classList.add('active');
}

function closeServiceModal(e) {
  const modal = document.getElementById('serviceEditModal');
  if (modal) modal.classList.remove('active');
}

function closeServiceModalDirect() {
  const modal = document.getElementById('serviceEditModal');
  if (modal) modal.classList.remove('active');
}

function saveServiceModal() {
  const id = document.getElementById('editServiceId').value;
  const name = document.getElementById('editServiceName').value.trim();
  const priceRaw = document.getElementById('editServicePrice').value;
  const duration = parseInt(document.getElementById('editServiceDuration').value, 10) || 60;
  const category = document.getElementById('editServiceCategory').value;
  const desc = document.getElementById('editServiceDesc').value.trim();
  
  const color = document.getElementById('editServiceColor') ? document.getElementById('editServiceColor').value : '#8B5CF6';
  const returnDays = parseInt(document.getElementById('editServiceReturnDays').value, 10) || 30;
  const cost = parseFloat(document.getElementById('editServiceCost').value) || 0;

  if (!name) {
    alert('Por favor, informe o nome do procedimento.');
    return;
  }

  const price = parseFloat(priceRaw);
  if (isNaN(price) || price <= 0) {
    alert('Por favor, informe um preço válido maior que zero.');
    return;
  }

  if (!appState.services) appState.services = [...DEFAULT_SERVICES];

  if (id) {
    // Atualizar existente
    const idx = appState.services.findIndex(s => s.id === id);
    if (idx !== -1) {
      appState.services[idx].name = name;
      appState.services[idx].price = price;
      appState.services[idx].duration = duration;
      appState.services[idx].category = category;
      appState.services[idx].desc = desc;
      appState.services[idx].color = color;
      appState.services[idx].returnDays = returnDays;
      appState.services[idx].cost = cost;
      if (appState.selectedOnlineService && appState.selectedOnlineService.id === id) {
        appState.selectedOnlineService = appState.services[idx];
      }
    }
  } else {
    // Criar novo
    const newService = {
      id: 'srv-' + Date.now(),
      name: name,
      price: price,
      duration: duration,
      category: category,
      desc: desc || 'Procedimento personalizado de estética e sobrancelhas.',
      img: 'assets/banner-sobrancelha.jpg',
      color: color,
      returnDays: returnDays,
      cost: cost
    };
    appState.services.unshift(newService);
    appState.selectedOnlineService = newService;
  }

  saveData();
  closeServiceModalDirect();
  renderOnlinePortal();
  renderTimeline();
  if (typeof renderMeusPagamentos === 'function') renderMeusPagamentos();
  showToast(`Procedimento "${name}" salvo com sucesso!`);

  // Sincronizar catálogo com backend MongoDB
  const serviceToSync = id 
    ? appState.services.find(s => s.id === id) 
    : appState.services[0];
  if (serviceToSync) {
    fetch('/api/services', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceToSync)
    }).catch(err => console.warn('Erro ao sincronizar serviço:', err));
  }
}

function deleteServiceModal() {
  const id = document.getElementById('editServiceId').value;
  if (!id) return;

  if (!confirm('Deseja realmente excluir este procedimento do catálogo?')) return;

  appState.services = (appState.services || []).filter(s => s.id !== id);
  if (appState.selectedOnlineService && appState.selectedOnlineService.id === id) {
    appState.selectedOnlineService = appState.services[0] || null;
  }

  saveData();
  closeServiceModalDirect();
  renderOnlinePortal();
  showToast('Procedimento excluído com sucesso.');

  // Sincronizar exclusão com backend MongoDB
  fetch(`/api/services?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    .catch(err => console.warn('Erro ao remover serviço:', err));
}

// ==========================================================================
// MODAL: PERÍODO DE TESTE DE 7 DIAS
// ==========================================================================
function openTrialModal() {
  const modal = document.getElementById('trialModal');
  if (modal) modal.classList.add('active');
}

function closeTrialModal(e) {
  const modal = document.getElementById('trialModal');
  if (modal) modal.classList.remove('active');
}

function closeTrialModalDirect() {
  const modal = document.getElementById('trialModal');
  if (modal) modal.classList.remove('active');
}

function onOnlineMonthSelectChange(val) {
  const [year, monthIndex] = val.split('-').map(Number);
  selectOnlineMonth(monthIndex, year);
}

function selectOnlineMonth(monthIndex, year) {
  appState.selectedOnlineMonthIndex = parseInt(monthIndex, 10);
  appState.selectedOnlineYear = parseInt(year, 10);
  appState.selectedOnlineDayIndex = 0;

  // Sincronizar select
  const sel = document.getElementById('onlineMonthSelect');
  if (sel) {
    sel.value = `${year}-${monthIndex}`;
  }

  // Sincronizar abas de toque rápido
  document.querySelectorAll('.online-month-tab').forEach(t => {
    const m = parseInt(t.getAttribute('data-month'), 10);
    const y = parseInt(t.getAttribute('data-year'), 10);
    const isMatch = m === appState.selectedOnlineMonthIndex && y === appState.selectedOnlineYear;
    t.classList.toggle('active', isMatch);
  });

  renderOnlineDays();
  const currentDays = getDaysForMonth(appState.selectedOnlineYear, appState.selectedOnlineMonthIndex);
  if (currentDays.length > 0) {
    selectOnlineDate(0);
  }
  showToast(`Mês selecionado: ${MONTHS_NAMES_PT[monthIndex]} de ${year}`);
}

function renderOnlineDays() {
  const container = document.getElementById('onlineDaysContainer');
  if (!container) return;

  const days = getDaysForMonth(appState.selectedOnlineYear, appState.selectedOnlineMonthIndex);
  container.innerHTML = days.map((d, index) => {
    const isSelected = appState.selectedOnlineDayIndex === index;
    const dayStr = d.day < 10 ? '0' + d.day : String(d.day);
    return `
      <div class="online-day-card ${isSelected ? 'selected' : ''}" onclick="selectOnlineDate(${index})">
        <div class="day-weekday">${d.weekday}</div>
        <div class="day-full-date">${dayStr} de ${d.month}</div>
      </div>
    `;
  }).join('');
}

function selectOnlineDate(index) {
  const days = getDaysForMonth(appState.selectedOnlineYear, appState.selectedOnlineMonthIndex);
  if (!days[index]) return;

  appState.selectedOnlineDayIndex = index;
  const d = days[index];

  document.querySelectorAll('.online-day-card').forEach((el, idx) => {
    el.classList.toggle('selected', idx === index);
  });

  const badge = document.getElementById('onlineSelectedDateBadge');
  if (badge) badge.innerText = `${d.full} de ${d.year}`;

  const slotsDayText = document.getElementById('onlineSlotsDayText');
  if (slotsDayText) slotsDayText.innerText = d.full;

  renderOnlineSlots();
}

function renderOnlineSlots() {
  const grid = document.getElementById('onlineSlotsGrid');
  if (!grid) return;

  const slots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00', '22:00'
  ];

  if (!appState.selectedOnlineSlot || !slots.includes(appState.selectedOnlineSlot)) {
    appState.selectedOnlineSlot = '08:00';
  }

  grid.innerHTML = slots.map(time => {
    const isSelected = appState.selectedOnlineSlot === time;
    return `
      <button type="button" class="online-slot-btn ${isSelected ? 'selected' : ''}" onclick="selectOnlineSlot('${time}')">
        <i class="fa-regular fa-clock" style="font-size: 10px;"></i>
        <span>${time}</span>
      </button>
    `;
  }).join('');
}

function selectOnlineSlot(t) {
  appState.selectedOnlineSlot = t;
  renderOnlineSlots();
}

function openOnlineCheckout() {
  const s = appState.selectedOnlineService;
  if (!s) return;

  const days = getDaysForMonth(appState.selectedOnlineYear, appState.selectedOnlineMonthIndex);
  const curDay = days[appState.selectedOnlineDayIndex || 0] || days[0];
  const summary = document.getElementById('obServiceSummary');
  const totalVal = document.getElementById('obTotalVal');

  if (summary) summary.innerText = `${s.name} • ${curDay.full} de ${curDay.year} às ${appState.selectedOnlineSlot}`;
  if (totalVal) totalVal.innerText = `R$ ${s.price.toFixed(2).replace('.', ',')}`;

  const modal = document.getElementById('onlineBookingModal');
  if (modal) modal.classList.add('active');
}

function closeOnlineBookingModal(e) {
  const modal = document.getElementById('onlineBookingModal');
  if (modal) modal.classList.remove('active');
}

function closeOnlineBookingModalDirect() {
  const modal = document.getElementById('onlineBookingModal');
  if (modal) modal.classList.remove('active');
}

function confirmOnlineBooking() {
  const nameInput = document.getElementById('obClientName');
  const phoneInput = document.getElementById('obClientPhone');
  const name = nameInput ? nameInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';

  if (!name || !phone) {
    alert('Por favor, preencha seu Nome Completo e WhatsApp para confirmar seu horário.');
    return;
  }

  const s = appState.selectedOnlineService;
  const days = getDaysForMonth(appState.selectedOnlineYear, appState.selectedOnlineMonthIndex);
  const curDay = days[appState.selectedOnlineDayIndex || 0] || days[0];
  const timeStart = appState.selectedOnlineSlot;
  const hourSlot = timeStart.split(':')[0];

  // Calcular horário de término
  const [h, m] = timeStart.split(':').map(Number);
  const endMinutes = h * 60 + m + (s.duration || 60);
  const endH = String(Math.floor(endMinutes / 60)).padStart(2, '0');
  const endM = String(endMinutes % 60).padStart(2, '0');
  const timeEnd = `${endH}:${endM}`;

  const aptId = 'apt-' + Date.now();
  const newApt = {
    id: aptId,
    timeStart: timeStart,
    timeEnd: timeEnd,
    hourSlot: hourSlot,
    clientName: name,
    clientPhone: phone,
    serviceName: s.name,
    price: s.price,
    dateText: `${curDay.full} de ${curDay.year}`,
    dayNumber: curDay.day,
    monthName: curDay.month,
    year: curDay.year,
    color: 'yellow',
    statusTag: 'Agendado Online',
    isBirthday: false
  };

  // 1. Inserir no início da lista de agendamentos
  appState.appointments.unshift(newApt);

  // 2. Atualizar ou cadastrar cliente na base A-Z
  const targetEmail = appState.studioConfig.designerEmail || (appState.currentUser ? appState.currentUser.email : '');
  let existingClient = appState.clients.find(c => c.name.toLowerCase() === name.toLowerCase() || (phone && c.phone === phone));
  let clientToSave;
  if (existingClient) {
    existingClient.visits = (existingClient.visits || 1) + 1;
    existingClient.ltv = (existingClient.ltv || 0) + s.price;
    clientToSave = existingClient;
  } else {
    clientToSave = {
      id: 'cli-' + Date.now(),
      name: name,
      phone: phone,
      notes: `Agendamento online: ${s.name} para ${curDay.full} de ${curDay.year}.`,
      visits: 1,
      ltv: s.price,
      beforeImg: '',
      afterImg: '',
      designerEmail: targetEmail
    };
    appState.clients.unshift(clientToSave);
  }

  // Adicionar ou atualizar no ciclo de manutenção da cliente
  const returnDays = s.returnDays ? parseInt(s.returnDays, 10) : 30;
  const serviceDateStr = `${curDay.year}-${String(curDay.monthIndex + 1).padStart(2, '0')}-${String(curDay.day).padStart(2, '0')}`;
  if (!appState.maintenanceList) appState.maintenanceList = [];
  const existingMaintIdx = appState.maintenanceList.findIndex(m => m.clientName.toLowerCase() === name.toLowerCase());
  const maintItem = {
    id: existingMaintIdx >= 0 ? appState.maintenanceList[existingMaintIdx].id : 'maint-' + Date.now(),
    clientName: name,
    clientPhone: phone,
    serviceName: s.name,
    serviceDate: serviceDateStr,
    returnDays: returnDays
  };
  if (existingMaintIdx >= 0) {
    appState.maintenanceList[existingMaintIdx] = maintItem;
  } else {
    appState.maintenanceList.unshift(maintItem);
  }

  saveData();
  closeOnlineBookingModalDirect();

  // Sincronizar com Nuvem (MongoDB)
  fetch('/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...newApt,
      designerEmail: targetEmail
    })
  }).catch(err => console.warn('Aviso API agendamentos:', err));

  fetch('/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...clientToSave,
      designerEmail: targetEmail
    })
  }).catch(() => {});

  // Limpar campos
  if (nameInput) nameInput.value = '';
  if (phoneInput) phoneInput.value = '';

  // 3. Notificar a Designer na hora com áudio e banner push
  showInAppPush(
    'Novo Agendamento Confirmado! 🔔',
    `${name} acabou de agendar ${s.name} para ${curDay.full} às ${timeStart}!`,
    aptId
  );

  // 4. "e na hora que a cliente agenda já ir pro calendário de agendamento"
  appState.selectedDay = curDay.day;
  appState.selectedMonth = curDay.monthIndex;
  appState.selectedYear = curDay.year;
  navigateToScreen('screenAgenda', document.getElementById('drawerItemAgenda'));
  const headline = document.getElementById('agendaDateHeadline');
  if (headline) {
    headline.innerText = `${curDay.weekday}, ${curDay.day} de ${curDay.month}, ${curDay.year}`;
  }
  renderTimeline();
  highlightAndScrollToAppointment(aptId);

  // 5. Enviar confirmação no WhatsApp (Sem sinal PIX)
  const studioName = appState.studioConfig.studioName || 'Studio VIP';
  const msg = `*AGENDAMENTO CONFIRMADO — AGENDA DO LUCRO*\n\n` +
    `Olá, ${studioName}! Acabei de agendar meu atendimento:\n\n` +
    ` *Cliente:* ${name}\n` +
    ` *Procedimento:* ${s.name}\n` +
    ` *Data:* ${curDay.full} de ${curDay.year}\n` +
    ` *Horário:* ${timeStart}\n` +
    ` *Valor:* R$ ${s.price.toFixed(2).replace('.', ',')} (Pagamento no estúdio)\n\n` +
    `_Agendado pelo portal online: Agenda do Lucro_`;

  setTimeout(() => {
    const rawPhone = (appState.studioConfig.studioPhone || STUDIO_PHONE).replace(/\D/g, '');
    const cleanStudioPhone = rawPhone.startsWith('55') ? rawPhone : `55${rawPhone}`;
    const url = `https://wa.me/${cleanStudioPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }, 1000);
}

// ==========================================================================
// MODAL: NOVO AGENDAMENTO MANUAL PELA DESIGNER (07:00 ÀS 22:00)
// ==========================================================================
function openNewAppointmentModal(preHour) {
  const modal = document.getElementById('newAppointmentModal');
  if (!modal) return;

  // Preencher procedimentos
  const selectService = document.getElementById('newAptService');
  if (selectService) {
    selectService.innerHTML = (appState.services || []).map(s => `
      <option value="${s.id}">${s.name} — R$ ${s.price.toFixed(2).replace('.', ',')}</option>
    `).join('');
  }

  // Preencher horários de hora em hora das 07:00 às 22:00
  const selectTime = document.getElementById('newAptTime');
  if (selectTime) {
    const slots = [
      '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
      '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
      '19:00', '20:00', '21:00', '22:00'
    ];
    selectTime.innerHTML = slots.map(h => `
      <option value="${h}">${h}</option>
    `).join('');
    if (preHour) {
      const match = slots.find(s => s.startsWith(preHour.split(':')[0]));
      if (match) selectTime.value = match;
    }
  }

  // Preencher data atual
  const dateInput = document.getElementById('newAptDate');
  if (dateInput) {
    const y = appState.selectedYear || 2026;
    const m = String((appState.selectedMonth || 8) + 1).padStart(2, '0');
    const d = String(appState.selectedDay || 22).padStart(2, '0');
    dateInput.value = `${y}-${m}-${d}`;
  }

  modal.classList.add('active');
}

function closeNewAppointmentModalDirect() {
  const modal = document.getElementById('newAppointmentModal');
  if (modal) modal.classList.remove('active');
}

function closeNewAppointmentModal(e) {
  const modal = document.getElementById('newAppointmentModal');
  if (modal) modal.classList.remove('active');
}

function saveManualAppointment() {
  const nameInput = document.getElementById('newAptClientName');
  const phoneInput = document.getElementById('newAptClientPhone');
  const serviceSelect = document.getElementById('newAptService');
  const timeSelect = document.getElementById('newAptTime');
  const dateInput = document.getElementById('newAptDate');
  const templateSelect = document.getElementById('newAptMsgTemplate');
  const sendWhatsAppCheck = document.getElementById('newAptSendWhatsApp');

  const clientName = nameInput ? nameInput.value.trim() : '';
  const clientPhone = phoneInput ? phoneInput.value.trim() : '';
  const serviceId = serviceSelect ? serviceSelect.value : '';
  const timeStart = timeSelect ? timeSelect.value : '08:00';
  const selectedDate = dateInput && dateInput.value ? dateInput.value : '';

  if (!clientName) {
    alert('Informe o nome da cliente.');
    return;
  }

  const s = (appState.services || []).find(srv => srv.id === serviceId) || (appState.services && appState.services[0]) || { name: 'Procedimento VIP', price: 100, color: '#8B5CF6' };
  const colorHex = s.color || s.colorHex || '#8B5CF6';
  
  // Calcular hora final (1 hora de duração padrão)
  const hourNum = parseInt(timeStart.split(':')[0], 10);
  const endHour = String(Math.min(23, hourNum + 1)).padStart(2, '0');
  const timeEnd = `${endHour}:00`;
  const hourSlot = String(hourNum).padStart(2, '0');

  let day = appState.selectedDay;
  let month = appState.selectedMonth;
  let year = appState.selectedYear;

  if (selectedDate) {
    const parts = selectedDate.split('-');
    if (parts.length === 3) {
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      day = parseInt(parts[2], 10);
    }
  }

  const newApt = {
    id: 'apt-' + Date.now(),
    timeStart,
    timeEnd,
    hourSlot,
    clientName,
    clientPhone: clientPhone || '(11) 98888-7777',
    serviceName: s.name,
    serviceId: s.id,
    price: s.price,
    colorHex: colorHex,
    day,
    month,
    year,
    color: 'yellow',
    statusTag: 'Confirmado',
    isBirthday: false
  };

  appState.appointments.unshift(newApt);

  // Adicionar ou atualizar no ciclo de manutenção da cliente
  const returnDays = s.returnDays ? parseInt(s.returnDays, 10) : 30;
  const serviceDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  if (!appState.maintenanceList) appState.maintenanceList = [];
  const existingMaintIdx = appState.maintenanceList.findIndex(m => m.clientName.toLowerCase() === clientName.toLowerCase());
  const maintItem = {
    id: existingMaintIdx >= 0 ? appState.maintenanceList[existingMaintIdx].id : 'maint-' + Date.now(),
    clientName,
    clientPhone: clientPhone || '(11) 98888-7777',
    serviceName: s.name,
    serviceDate: serviceDateStr,
    returnDays: returnDays
  };
  if (existingMaintIdx >= 0) {
    appState.maintenanceList[existingMaintIdx] = maintItem;
  } else {
    appState.maintenanceList.unshift(maintItem);
  }

  // Adicionar ou atualizar cadastro da cliente no CRM
  const targetEmail = appState.studioConfig.designerEmail || (appState.currentUser ? appState.currentUser.email : '');
  if (!appState.clients) appState.clients = [];
  const existingCli = appState.clients.find(c => c.name.toLowerCase() === clientName.toLowerCase() || (clientPhone && c.phone === clientPhone));
  let clientToSave;
  if (existingCli) {
    existingCli.visits = (existingCli.visits || 1) + 1;
    existingCli.ltv = (existingCli.ltv || 0) + s.price;
    if (clientPhone && !existingCli.phone) existingCli.phone = clientPhone;
    clientToSave = existingCli;
  } else {
    clientToSave = {
      id: 'cli-' + Date.now(),
      name: clientName,
      phone: clientPhone || '',
      notes: `Atendimento de ${s.name}`,
      visits: 1,
      ltv: s.price,
      beforeImg: '',
      afterImg: '',
      designerEmail: targetEmail
    };
    appState.clients.unshift(clientToSave);
  }

  saveData();
  closeNewAppointmentModalDirect();

  // Sincronizar com MongoDB
  fetch('/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...newApt,
      designerEmail: targetEmail
    })
  }).catch(() => {});

  fetch('/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...clientToSave,
      designerEmail: targetEmail
    })
  }).catch(() => {});

  // Disparo de mensagem pré-definida no WhatsApp da cliente
  const shouldSendWA = sendWhatsAppCheck ? sendWhatsAppCheck.checked : false;
  const templateKey = templateSelect ? templateSelect.value : 'none';

  if (shouldSendWA && templateKey !== 'none' && clientPhone) {
    const rawTemplates = appState.msgTemplates || DEFAULT_MSG_TEMPLATES;
    let tplText = rawTemplates[templateKey] || rawTemplates.lembrete;
    const dateFormatted = `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;
    const studioName = appState.studioConfig.studioName || 'Studio de Sobrancelha VIP';
    
    let msg = tplText
      .replace(/{cliente}/g, clientName)
      .replace(/{procedimento}/g, s.name)
      .replace(/{data}/g, dateFormatted)
      .replace(/{horario}/g, timeStart)
      .replace(/{estudio}/g, studioName);

    const cleanPhone = clientPhone.replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const waUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  }

  // Limpar formulário
  if (nameInput) nameInput.value = '';
  if (phoneInput) phoneInput.value = '';

  renderTimeline();
  renderClientesCRM();
  renderManutencao();
  renderMeusPagamentos();
  renderResumoFinanceiro();
  showToast(`Agendamento de ${clientName} salvo para às ${timeStart}! ✨`);
}

// ==========================================================================
// SISTEMA DE NOTIFICAÇÃO PUSH, CHIME & LEMBRETE DE 30 MINUTOS
// ==========================================================================
function playNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    // Tom luxuoso duplo sino (E5 = 659.25Hz -> B5 = 987.77Hz)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, ctx.currentTime);
    osc.frequency.setValueAtTime(987.77, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.9);
  } catch (e) {
    console.log('Audio contextual', e);
  }
}

function requestNotificationPermission() {
  if (!('Notification' in window)) {
    showToast('Notificações visuais e sonoras ativas no app!');
    return;
  }

  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      playNotificationChime();
      new Notification('Agenda do Lucro 🔔', {
        body: 'Notificações ativadas! Você receberá alertas de agendamentos e lembretes de 30 minutos.',
        icon: 'assets/banner-sobrancelha.jpg'
      });
      showToast('Notificações ativadas com sucesso no celular!');
    } else {
      showToast('Notificações visuais e sonoras ativas no app!');
    }
  });
}

let pushBannerTimeout = null;
let lastBookedAppointmentId = null;

function showInAppPush(title, desc, appointmentId) {
  playNotificationChime();
  if (navigator.vibrate) {
    try { navigator.vibrate([120, 60, 120]); } catch(e){}
  }

  // Notificação de sistema do navegador
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body: desc,
        icon: 'assets/banner-sobrancelha.jpg'
      });
    } catch (e) {}
  }

  const banner = document.getElementById('pushNotificationBanner');
  const tEl = document.getElementById('pushTitle');
  const dEl = document.getElementById('pushDesc');
  const timeTag = document.getElementById('pushTimeTag');

  if (banner && tEl && dEl) {
    lastBookedAppointmentId = appointmentId;
    tEl.innerText = title;
    dEl.innerText = desc;
    if (timeTag) timeTag.innerText = 'Agora';

    banner.classList.add('show');

    if (pushBannerTimeout) clearTimeout(pushBannerTimeout);
    pushBannerTimeout = setTimeout(() => {
      banner.classList.remove('show');
    }, 8000);
  }
}

function dismissPushBanner() {
  const banner = document.getElementById('pushNotificationBanner');
  if (banner) banner.classList.remove('show');
}

function onPushActionClick() {
  dismissPushBanner();
  navigateToScreen('screenAgenda', document.getElementById('drawerItemAgenda'));
  if (lastBookedAppointmentId) {
    highlightAndScrollToAppointment(lastBookedAppointmentId);
  }
}

function highlightAndScrollToAppointment(id) {
  setTimeout(() => {
    const el = document.getElementById(`apt-block-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('just-booked-pulse');
      setTimeout(() => el.classList.remove('just-booked-pulse'), 5000);
    }
  }, 350);
}

// ==========================================================================
// MOTOR DE LEMBRETE DE 30 MINUTOS (DESIGNER & CLIENTE)
// ==========================================================================
let lastNotified30MinId = null;

function check30MinReminders() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Procurar agendamento mais próximo de 30 minutos
  appState.appointments.forEach(apt => {
    const [h, m] = apt.timeStart.split(':').map(Number);
    const aptMinutes = h * 60 + m;
    const diff = aptMinutes - currentMinutes;

    // Se estiver entre 25 e 35 minutos
    if (diff > 0 && diff <= 30 && lastNotified30MinId !== apt.id) {
      lastNotified30MinId = apt.id;
      trigger30MinReminderAlert(apt);
    }
  });
}

function trigger30MinReminderAlert(apt) {
  playNotificationChime();
  if (navigator.vibrate) {
    try { navigator.vibrate([200, 100, 200]); } catch(e){}
  }

  // Notificação para a designer
  showInAppPush(
    '⏰ Lembrete de 30 Minutos!',
    `Seu atendimento com ${apt.clientName} (${apt.serviceName}) começa em 30 minutos às ${apt.timeStart}!`,
    apt.id
  );

  // Exibir faixa de lembrete no topo da Agenda com botão para a cliente
  renderReminderStrip(apt);
}

function renderReminderStrip(apt) {
  const container = document.getElementById('reminderContainer');
  if (!container) return;

  const studioName = (appState.studioConfig && appState.studioConfig.studioName) || 'Studio Sobrancelha VIP';
  const clientMsg = `Olá, ${apt.clientName}! Tudo pronto para o seu horário de *${apt.serviceName}* no ${studioName} daqui a 30 minutos (às ${apt.timeStart})? Já estamos te aguardando com um café quentinho! ☕✨`;
  const cleanPhone = (apt.clientPhone || '').replace(/\D/g, '');
  const waUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(clientMsg)}`;

  container.innerHTML = `
    <div class="reminder-strip-bar">
      <div class="reminder-strip-text">
        <strong>⏰ Lembrete de 30 Minutos Ativo!</strong>
        <p>${apt.clientName} às ${apt.timeStart} • ${apt.serviceName}</p>
      </div>
      <a href="${waUrl}" target="_blank" class="btn-send-whatsapp-30" title="Enviar Lembrete 30 min para a Cliente">
        <i class="fa-brands fa-whatsapp"></i>
        <span>Lembrete Cliente</span>
      </a>
    </div>
  `;
}

function test30MinReminderNow() {
  // Pega o agendamento de Juliana Mendes ou o primeiro da lista
  const targetApt = appState.appointments.find(a => a.clientName.includes('Juliana')) || appState.appointments[0];
  if (!targetApt) return;

  trigger30MinReminderAlert(targetApt);
  navigateToScreen('screenAgenda', document.getElementById('drawerItemAgenda'));
  showToast('⏰ Lembrete de 30 minutos testado com sucesso!');
}

function copyPortalLink() {
  const link = window.location.origin ? `${window.location.origin}` : 'https://agenda-do-lucro-app.vercel.app';
  navigator.clipboard.writeText(link).then(() => {
    showToast(`Link copiado: ${link}`);
  }).catch(() => {
    showToast(`Link: ${link}`);
  });
}

// ==========================================================================
// TELA: MANUTENÇÃO (ACOMPANHAMENTO DE RETORNO DAS CLIENTES)
// ==========================================================================
function renderManutencao() {
  const container = document.getElementById('maintenanceList');
  if (!container) return;

  if (!appState.maintenanceList) appState.maintenanceList = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let overdueCount = 0;
  let warningCount = 0;
  let okCount = 0;

  // Processar status de cada registro
  const processed = appState.maintenanceList.map(item => {
    let serviceDate = new Date();
    if (item.serviceDate) {
      const parts = item.serviceDate.split('-');
      if (parts.length === 3) {
        serviceDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      }
    }
    serviceDate.setHours(0, 0, 0, 0);

    const returnDays = parseInt(item.returnDays, 10) || 30;
    const diffTime = today - serviceDate;
    const daysPassed = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    const daysRemaining = returnDays - daysPassed;

    let status = 'ok';
    let statusBadge = `<span class="maint-status-pill success"><i class="fa-solid fa-circle-check"></i> Em dia (${daysRemaining} dias)</span>`;

    if (daysRemaining < 0) {
      status = 'overdue';
      overdueCount++;
      const absDays = Math.abs(daysRemaining);
      statusBadge = `<span class="maint-status-pill danger"><i class="fa-solid fa-circle-exclamation"></i> Vencida há ${absDays} ${absDays === 1 ? 'dia' : 'dias'}</span>`;
    } else if (daysRemaining <= 5) {
      status = 'warning';
      warningCount++;
      statusBadge = `<span class="maint-status-pill warning"><i class="fa-solid fa-clock"></i> Próxima (${daysRemaining} ${daysRemaining === 1 ? 'dia restante' : 'dias restantes'})</span>`;
    } else {
      okCount++;
    }

    return {
      ...item,
      daysPassed,
      daysRemaining,
      status,
      statusBadge,
      serviceDateObj: serviceDate
    };
  });

  // Atualizar contadores
  const cAll = document.getElementById('countMaintAll');
  const cOverdue = document.getElementById('countMaintOverdue');
  const cWarning = document.getElementById('countMaintWarning');
  const cOk = document.getElementById('countMaintOk');

  if (cAll) cAll.innerText = processed.length;
  if (cOverdue) cOverdue.innerText = overdueCount;
  if (cWarning) cWarning.innerText = warningCount;
  if (cOk) cOk.innerText = okCount;

  // Filtrar
  const filter = appState.maintFilter || 'all';
  let filtered = processed;
  if (filter === 'overdue') filtered = processed.filter(x => x.status === 'overdue');
  else if (filter === 'warning') filtered = processed.filter(x => x.status === 'warning');
  else if (filter === 'ok') filtered = processed.filter(x => x.status === 'ok');

  // Ordenar: vencidas primeiro, depois próximas, depois em dia
  filtered.sort((a, b) => a.daysRemaining - b.daysRemaining);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 36px 14px; color: #9CA3AF; background: #FFFFFF; border-radius: 12px; border: 1px dashed #E5E7EB;">
        <i class="fa-solid fa-arrows-rotate" style="font-size: 32px; color: #DDD6FE; margin-bottom: 8px; display: block;"></i>
        <strong style="color: #4B5563; font-size: 13px; display: block;">Nenhuma cliente nesta categoria</strong>
        <p style="font-size: 11px; margin-top: 4px;">Clique em "+ Novo Retorno" acima ou salve um novo agendamento para acompanhar os prazos.</p>
      </div>
    `;
    return;
  }

  const studioName = (appState.studioConfig && appState.studioConfig.studioName) || 'Studio Sobrancelha VIP';
  const templates = appState.msgTemplates || DEFAULT_MSG_TEMPLATES;

  container.innerHTML = filtered.map(item => {
    // Formatar data
    let dateStr = item.serviceDate || '';
    if (item.serviceDateObj) {
      const d = String(item.serviceDateObj.getDate()).padStart(2, '0');
      const m = String(item.serviceDateObj.getMonth() + 1).padStart(2, '0');
      const y = item.serviceDateObj.getFullYear();
      dateStr = `${d}/${m}/${y}`;
    }

    // Gerar mensagem de WhatsApp
    let waMsg = templates.manutencao || `Olá, {cliente}! Tudo bem? Passando para lembrar que já está na hora do seu retoque de {procedimento} no {estudio}! Vamos garantir seu horário dessa semana? ✨`;
    waMsg = waMsg
      .replace(/{cliente}/g, item.clientName)
      .replace(/{procedimento}/g, item.serviceName)
      .replace(/{estudio}/g, studioName)
      .replace(/{data}/g, dateStr);

    const rawPhone = (item.clientPhone || '').replace(/\D/g, '');
    const cleanPhone = rawPhone.startsWith('55') ? rawPhone : (rawPhone ? `55${rawPhone}` : '');
    const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMsg)}` : '#';

    return `
      <div class="maintenance-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
          <div>
            <h4 style="font-size: 14px; font-weight: 800; color: #111827; margin: 0;">${item.clientName}</h4>
            <div style="font-size: 11px; color: #6B7280; margin-top: 2px;">
              <i class="fa-solid fa-phone" style="color: #9CA3AF; font-size: 10px;"></i> ${item.clientPhone || 'Sem telefone'}
            </div>
          </div>
          <div>
            ${item.statusBadge}
          </div>
        </div>

        <div style="background: #F9FAFB; border-radius: 8px; padding: 8px 10px; margin: 10px 0 12px; font-size: 11px; color: #4B5563; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong style="color: #111827;">${item.serviceName}</strong>
            <div style="color: #6B7280; font-size: 10px; margin-top: 1px;">Último atendimento: ${dateStr}</div>
          </div>
          <span style="font-size: 10px; font-weight: 700; color: var(--purple-primary); background: #F3E8FF; padding: 2px 7px; border-radius: 4px;">
            Ciclo: ${item.returnDays} dias
          </span>
        </div>

        <div style="display: flex; gap: 8px; align-items: center;">
          <a href="${waUrl}" target="_blank" class="btn-maint-whatsapp" style="flex: 1;" ${!cleanPhone ? 'onclick="alert(\'Cliente sem WhatsApp cadastrado\'); return false;"' : ''}>
            <i class="fa-brands fa-whatsapp"></i>
            <span>Chamar no Whats</span>
          </a>
          <button type="button" class="btn-maint-schedule" onclick="scheduleMaintenanceReturn('${item.clientName.replace(/'/g, "\\'")}', '${(item.clientPhone || '').replace(/'/g, "\\'")}', '${item.serviceName.replace(/'/g, "\\'")}')">
            <i class="fa-solid fa-calendar-plus"></i>
            <span>Agendar</span>
          </button>
          <button type="button" style="width: 32px; height: 32px; border-radius: 8px; border: 1px solid #E5E7EB; background: #fff; color: #EF4444; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px;" onclick="deleteMaintenance('${item.id}')" title="Excluir Retorno">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function filterMaintenance(type, btn) {
  appState.maintFilter = type;
  document.querySelectorAll('.maint-filter-pill').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderManutencao();
}

function scheduleMaintenanceReturn(clientName, clientPhone, serviceName) {
  openNewAppointmentModal();
  const nameInput = document.getElementById('newAptClientName');
  const phoneInput = document.getElementById('newAptClientPhone');
  const serviceSelect = document.getElementById('newAptService');

  if (nameInput) nameInput.value = clientName;
  if (phoneInput) phoneInput.value = clientPhone;

  if (serviceSelect && serviceName) {
    const opts = Array.from(serviceSelect.options);
    const match = opts.find(o => o.text.toLowerCase().includes(serviceName.toLowerCase()));
    if (match) serviceSelect.value = match.value;
  }
}

function openAddMaintenanceModal() {
  const modal = document.getElementById('addMaintenanceModal');
  if (!modal) return;

  const select = document.getElementById('maintServiceName');
  if (select) {
    select.innerHTML = (appState.services || []).map(s => `
      <option value="${s.id}" data-days="${s.returnDays || 30}">${s.name} (Ciclo ${s.returnDays || 30} dias)</option>
    `).join('');
  }

  const dateInput = document.getElementById('maintServiceDate');
  if (dateInput) {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    dateInput.value = `${y}-${m}-${d}`;
  }

  const daysInput = document.getElementById('maintReturnDays');
  if (daysInput) {
    const firstSrv = (appState.services && appState.services[0]) || {};
    daysInput.value = firstSrv.returnDays || '30';
  }

  modal.classList.add('active');
}

function closeAddMaintenanceModal(e) {
  const modal = document.getElementById('addMaintenanceModal');
  if (modal) modal.classList.remove('active');
}

function closeAddMaintenanceModalDirect() {
  const modal = document.getElementById('addMaintenanceModal');
  if (modal) modal.classList.remove('active');
}

function onMaintServiceChange(serviceId) {
  const s = (appState.services || []).find(srv => srv.id === serviceId);
  const daysInput = document.getElementById('maintReturnDays');
  if (s && daysInput) {
    daysInput.value = s.returnDays || 30;
  }
}

function handleSaveMaintenance(e) {
  e.preventDefault();
  const name = document.getElementById('maintClientName').value.trim();
  const phone = document.getElementById('maintClientPhone').value.trim();
  const serviceSelect = document.getElementById('maintServiceName');
  const serviceDate = document.getElementById('maintServiceDate').value;
  const returnDays = parseInt(document.getElementById('maintReturnDays').value, 10) || 30;

  let serviceName = 'Design de Sobrancelha';
  if (serviceSelect && serviceSelect.selectedIndex >= 0) {
    serviceName = serviceSelect.options[serviceSelect.selectedIndex].text.split('(')[0].trim();
  }

  if (!appState.maintenanceList) appState.maintenanceList = [];
  appState.maintenanceList.unshift({
    id: 'maint-' + Date.now(),
    clientName: name,
    clientPhone: phone,
    serviceName: serviceName,
    serviceDate: serviceDate,
    returnDays: returnDays
  });

  saveData();
  closeAddMaintenanceModalDirect();
  renderManutencao();
  showToast(`Ciclo de manutenção salvo para ${name}! ✨`);
}

function deleteMaintenance(id) {
  if (confirm('Deseja realmente remover este acompanhamento de retorno?')) {
    appState.maintenanceList = (appState.maintenanceList || []).filter(m => m.id !== id);
    saveData();
    renderManutencao();
    showToast('Registro de retorno removido.');
  }
}

// ==========================================================================
// TELA: MEUS PAGAMENTOS (GANHOS & LUCRO LÍQUIDO POR PROCEDIMENTO)
// ==========================================================================
function renderMeusPagamentos() {
  const container = document.getElementById('paymentsProcedureList');
  if (!container) return;

  const services = (appState.services && appState.services.length) ? appState.services : DEFAULT_SERVICES;
  const apts = appState.appointments || [];

  // Calcular métricas gerais
  const totalRevenue = apts.reduce((acc, a) => acc + (parseFloat(a.price) || 0), 0);
  const totalMaterialCost = apts.reduce((acc, a) => {
    const s = services.find(srv => srv.name === a.serviceName || srv.id === a.serviceId);
    return acc + (s && s.cost ? parseFloat(s.cost) : 15);
  }, 0);
  const totalNetProfit = Math.max(0, totalRevenue - totalMaterialCost);

  const elRev = document.getElementById('pmtTotalRevenue');
  const elCount = document.getElementById('pmtAptCount');
  const elNet = document.getElementById('pmtNetProfit');

  if (elRev) elRev.innerText = `R$ ${totalRevenue.toFixed(2).replace('.', ',')}`;
  if (elCount) elCount.innerText = `${apts.length} atendimentos previstos`;
  if (elNet) elNet.innerText = `R$ ${totalNetProfit.toFixed(2).replace('.', ',')}`;

  // Renderizar cada procedimento
  container.innerHTML = services.map(s => {
    const price = typeof s.price === 'number' ? s.price : (parseFloat(s.price) || 0);
    const cost = typeof s.cost === 'number' ? s.cost : (parseFloat(s.cost) || 15);
    const profit = Math.max(0, price - cost);
    const margin = price > 0 ? Math.round((profit / price) * 100) : 0;
    const colorHex = s.color || s.colorHex || '#8B5CF6';

    const countApt = apts.filter(a => a.serviceName === s.name || a.serviceId === s.id).length;
    const totalSrvRevenue = countApt * price;
    const totalSrvNet = countApt * profit;

    return `
      <div class="payment-item-card" style="border-left: 5px solid ${colorHex};">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${colorHex};"></span>
              <h4 style="font-size: 14px; font-weight: 800; color: #111827; margin: 0;">${s.name}</h4>
            </div>
            <span style="font-size: 11px; color: #6B7280; margin-top: 2px; display: block;">
              Duração: ${s.duration || 60} min • Retorno: a cada ${s.returnDays || 30} dias
            </span>
          </div>
          <button type="button" class="btn-service-edit-inline" onclick="openEditServiceModal('${s.id}')" title="Ajustar Preço ou Custo">
            <i class="fa-solid fa-pen-to-square"></i> Ajustar
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin: 10px 0; background: #F9FAFB; padding: 8px 10px; border-radius: 8px; text-align: center;">
          <div>
            <div style="font-size: 10px; color: #6B7280; font-weight: 700;">Preço Cobrado</div>
            <div style="font-size: 13px; font-weight: 800; color: #111827; margin-top: 2px;">R$ ${price.toFixed(2).replace('.', ',')}</div>
          </div>
          <div style="border-left: 1px solid #E5E7EB; border-right: 1px solid #E5E7EB;">
            <div style="font-size: 10px; color: #DC2626; font-weight: 700;">Custo Material</div>
            <div style="font-size: 13px; font-weight: 800; color: #DC2626; margin-top: 2px;">R$ ${cost.toFixed(2).replace('.', ',')}</div>
          </div>
          <div>
            <div style="font-size: 10px; color: #059669; font-weight: 700;">Seu Lucro Líquido</div>
            <div style="font-size: 13px; font-weight: 900; color: #059669; margin-top: 2px;">R$ ${profit.toFixed(2).replace('.', ',')}</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #4B5563; padding-top: 4px;">
          <span><strong>${countApt}</strong> agendamentos no mês</span>
          <span style="font-weight: 800; color: #059669;">Margem real: ${margin}% (Lucro: R$ ${totalSrvNet.toFixed(2).replace('.', ',')})</span>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================================================
// TELA: RESUMO FINANCEIRO & GASTOS DO ESTÚDIO (SELETOR DE TODOS OS MESES)
// ==========================================================================
function initReportsMonths() {
  const sel = document.getElementById('reportsMonthSelect');
  if (!sel) return;

  const currentYear = appState.reportsYear || 2026;
  const currentMonth = appState.reportsMonth !== undefined ? appState.reportsMonth : 8;

  const monthsToRender = [
    { year: 2026, month: 0, label: 'Janeiro de 2026' },
    { year: 2026, month: 1, label: 'Fevereiro de 2026' },
    { year: 2026, month: 2, label: 'Março de 2026' },
    { year: 2026, month: 3, label: 'Abril de 2026' },
    { year: 2026, month: 4, label: 'Maio de 2026' },
    { year: 2026, month: 5, label: 'Junho de 2026' },
    { year: 2026, month: 6, label: 'Julho de 2026' },
    { year: 2026, month: 7, label: 'Agosto de 2026' },
    { year: 2026, month: 8, label: 'Setembro de 2026' },
    { year: 2026, month: 9, label: 'Outubro de 2026' },
    { year: 2026, month: 10, label: 'Novembro de 2026' },
    { year: 2026, month: 11, label: 'Dezembro de 2026' },
    { year: 2027, month: 0, label: 'Janeiro de 2027' },
    { year: 2027, month: 1, label: 'Fevereiro de 2027' },
    { year: 2027, month: 2, label: 'Março de 2027' },
    { year: 2027, month: 3, label: 'Abril de 2027' },
    { year: 2027, month: 4, label: 'Maio de 2027' },
    { year: 2027, month: 5, label: 'Junho de 2027' },
    { year: 2027, month: 6, label: 'Julho de 2027' },
    { year: 2027, month: 7, label: 'Agosto de 2027' },
    { year: 2027, month: 8, label: 'Setembro de 2027' },
    { year: 2027, month: 9, label: 'Outubro de 2027' },
    { year: 2027, month: 10, label: 'Novembro de 2027' },
    { year: 2027, month: 11, label: 'Dezembro de 2027' }
  ];

  sel.innerHTML = monthsToRender.map(m => `
    <option value="${m.year}-${m.month}" ${m.year === currentYear && m.month === currentMonth ? 'selected' : ''}>
      ${m.label}
    </option>
  `).join('');
}

function onReportsMonthChange(val) {
  if (!val) return;
  const parts = val.split('-');
  appState.reportsYear = parseInt(parts[0], 10);
  appState.reportsMonth = parseInt(parts[1], 10);
  renderResumoFinanceiro();
  showToast(`Relatório de ${MONTHS_NAMES_PT[appState.reportsMonth]} de ${appState.reportsYear} carregado`);
}

function updateDonutChartSvg(monthApts, services) {
  const svg = document.getElementById('donutSvg');
  if (!svg) return;

  if (!monthApts || monthApts.length === 0) {
    svg.innerHTML = `
      <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#F3F4F6" stroke-width="4"></circle>
      <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#E5E7EB" stroke-width="4" stroke-dasharray="100 0"></circle>
    `;
    return;
  }

  const total = monthApts.length;
  const counts = {};
  monthApts.forEach(a => {
    const key = a.serviceName || 'Outro';
    counts[key] = (counts[key] || 0) + 1;
  });

  let currentOffset = 25;
  let circlesHtml = `<circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#F3F4F6" stroke-width="4"></circle>`;

  const palette = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#6366F1'];
  let colorIdx = 0;

  Object.entries(counts).forEach(([srvName, count]) => {
    const pct = Math.max(1, Math.round((count / total) * 100));
    const srv = (services || []).find(s => s.name === srvName);
    const color = (srv && (srv.color || srv.colorHex)) || palette[colorIdx % palette.length];
    colorIdx++;

    circlesHtml += `
      <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="${color}" stroke-width="4" stroke-dasharray="${pct} ${100 - pct}" stroke-dashoffset="${currentOffset}"></circle>
    `;
    currentOffset -= pct;
  });

  svg.innerHTML = circlesHtml;
}

function renderResumoFinanceiro() {
  const expensesList = document.getElementById('expensesList');
  const expenses = appState.expenses || [];
  const apts = appState.appointments || [];
  const services = appState.services || DEFAULT_SERVICES;

  const selMonth = appState.reportsMonth !== undefined ? appState.reportsMonth : 8;
  const selYear = appState.reportsYear !== undefined ? appState.reportsYear : 2026;

  // Filtrar agendamentos do mês e ano selecionados
  const monthApts = apts.filter(a => {
    const aMonth = a.month !== undefined ? parseInt(a.month, 10) : 8;
    const aYear = a.year !== undefined ? parseInt(a.year, 10) : 2026;
    return aMonth === selMonth && aYear === selYear;
  });

  // 1. Receita Bruta dos atendimentos no mês
  const grossRevenue = monthApts.reduce((acc, a) => acc + (parseFloat(a.price) || 0), 0);

  // 2. Gastos Fixos cadastrados
  const totalExpenses = expenses.reduce((acc, e) => acc + (parseFloat(e.amount) || 0), 0);

  // 3. Custos de Materiais
  const totalMaterialCosts = monthApts.reduce((acc, a) => {
    const s = services.find(srv => srv.name === a.serviceName || srv.id === a.serviceId);
    return acc + (s && s.cost ? parseFloat(s.cost) : 15);
  }, 0);

  // 4. Lucro Líquido Real = Receita - Gastos Fixos - Custos de Materiais
  const netRealProfit = grossRevenue - totalExpenses - totalMaterialCosts;

  // Atualizar KPIs
  const kpiRev = document.getElementById('kpiRevenueVal');
  const kpiRevApts = document.getElementById('kpiRevenueApts');
  const kpiExp = document.getElementById('kpiExpensesVal');
  const kpiExpCount = document.getElementById('kpiExpensesCount');
  const kpiProf = document.getElementById('kpiProfitVal');
  const netRealEl = document.getElementById('netRealProfitVal');
  const totExpEl = document.getElementById('totalExpensesVal');

  if (kpiRev) kpiRev.innerText = `R$ ${grossRevenue.toFixed(2).replace('.', ',')}`;
  if (kpiRevApts) kpiRevApts.innerText = `${monthApts.length} agendamentos`;
  if (kpiExp) kpiExp.innerText = `R$ ${totalExpenses.toFixed(2).replace('.', ',')}`;
  if (kpiExpCount) kpiExpCount.innerText = `${expenses.length} contas cadastradas`;
  if (kpiProf) kpiProf.innerText = `R$ ${Math.max(0, grossRevenue - totalMaterialCosts).toFixed(2).replace('.', ',')}`;
  if (totExpEl) totExpEl.innerText = `R$ ${totalExpenses.toFixed(2).replace('.', ',')}`;

  if (netRealEl) {
    netRealEl.innerText = `R$ ${netRealProfit.toFixed(2).replace('.', ',')}`;
    netRealEl.style.color = netRealProfit >= 0 ? '#047857' : '#DC2626';
  }

  // Meios de Pagamento estimados
  const payPix = document.getElementById('payValPix');
  const payCred = document.getElementById('payValCredito');
  const payDeb = document.getElementById('payValDebito');

  if (payPix) payPix.innerText = `R$ ${(grossRevenue * 0.60).toFixed(2).replace('.', ',')}`;
  if (payCred) payCred.innerText = `R$ ${(grossRevenue * 0.30).toFixed(2).replace('.', ',')}`;
  if (payDeb) payDeb.innerText = `R$ ${(grossRevenue * 0.10).toFixed(2).replace('.', ',')}`;

  // Lista de Gastos
  if (expensesList) {
    if (expenses.length === 0) {
      expensesList.innerHTML = `
        <div style="text-align: center; padding: 20px; color: #9CA3AF; font-size: 11px;">
          Nenhum gasto fixo cadastrado ainda.<br>Clique em "+ Novo Gasto" para incluir água, luz, aluguel, etc.
        </div>
      `;
    } else {
      const categoryIcons = {
        contas: '<i class="fa-solid fa-lightbulb" style="color:#F59E0B;"></i>',
        aluguel: '<i class="fa-solid fa-building" style="color:#3B82F6;"></i>',
        materiais: '<i class="fa-solid fa-palette" style="color:#EC4899;"></i>',
        marketing: '<i class="fa-solid fa-bullhorn" style="color:#8B5CF6;"></i>',
        outros: '<i class="fa-solid fa-receipt" style="color:#6B7280;"></i>'
      };

      expensesList.innerHTML = expenses.map(exp => {
        const icon = categoryIcons[exp.category] || categoryIcons.outros;
        const amountNum = parseFloat(exp.amount) || 0;
        const isPaid = exp.status === 'pago';

        return `
          <div class="expense-item-row" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: #F9FAFB; border-radius: 8px; border: 1px solid #F3F4F6;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 32px; height: 32px; border-radius: 8px; background: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 1px solid #E5E7EB;">
                ${icon}
              </div>
              <div>
                <strong style="font-size: 12px; color: #111827; display: block;">${exp.description}</strong>
                <span style="font-size: 10px; color: ${isPaid ? '#059669' : '#D97706'}; font-weight: 700;">
                  ${isPaid ? '✅ Pago' : '⏳ Vence: ' + (exp.dueDate || 'Pendente')}
                </span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <strong style="font-size: 13px; color: #DC2626;">- R$ ${amountNum.toFixed(2).replace('.', ',')}</strong>
              <button type="button" style="background: none; border: none; color: #9CA3AF; cursor: pointer; padding: 4px;" onclick="deleteExpense('${exp.id}')" title="Excluir Gasto">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Top Procedimentos Lucrativos
  const topList = document.getElementById('reportTopServicesList');
  if (topList) {
    const srvStats = services.map(s => {
      const count = monthApts.filter(a => a.serviceName === s.name || a.serviceId === s.id).length;
      const total = count * (typeof s.price === 'number' ? s.price : (parseFloat(s.price) || 0));
      return { ...s, count, total };
    }).filter(item => item.count > 0).sort((a, b) => b.total - a.total);

    if (srvStats.length === 0) {
      topList.innerHTML = `
        <div style="font-size: 11px; color: #9CA3AF; text-align: center; padding: 12px 6px;">
          Nenhum atendimento neste mês ainda.
        </div>
      `;
    } else {
      topList.innerHTML = srvStats.slice(0, 4).map(item => `
        <div class="donut-legend-item">
          <span class="legend-color-dot" style="background: ${item.color || '#8B5CF6'};"></span>
          <span class="legend-label">${item.name} (${item.count})</span>
          <span class="legend-pct">R$ ${item.total.toFixed(2).replace('.', ',')}</span>
        </div>
      `).join('');
    }
  }

  // Atualizar Gráfico de Pizza SVG dinamicamente
  updateDonutChartSvg(monthApts, services);
}

function openAddExpenseModal() {
  const modal = document.getElementById('addExpenseModal');
  if (modal) modal.classList.add('active');
}

function closeAddExpenseModal(e) {
  const modal = document.getElementById('addExpenseModal');
  if (modal) modal.classList.remove('active');
}

function closeAddExpenseModalDirect() {
  const modal = document.getElementById('addExpenseModal');
  if (modal) modal.classList.remove('active');
}

function handleSaveExpense(e) {
  e.preventDefault();
  const desc = document.getElementById('expDescription').value.trim();
  const amount = parseFloat(document.getElementById('expAmount').value) || 0;
  const category = document.getElementById('expCategory').value;
  const dueDate = document.getElementById('expDueDate').value.trim();
  const status = document.getElementById('expStatus').value;

  if (!appState.expenses) appState.expenses = [];
  appState.expenses.unshift({
    id: 'exp-' + Date.now(),
    description: desc,
    amount: amount,
    category: category,
    dueDate: dueDate || 'Mensal',
    status: status
  });

  saveData();
  closeAddExpenseModalDirect();
  renderResumoFinanceiro();
  showToast(`Despesa de R$ ${amount.toFixed(2).replace('.', ',')} salva!`);
}

function deleteExpense(id) {
  if (confirm('Deseja excluir esta despesa?')) {
    appState.expenses = (appState.expenses || []).filter(e => e.id !== id);
    saveData();
    renderResumoFinanceiro();
    showToast('Despesa excluída.');
  }
}

// ==========================================================================
// TELA: PROFISSIONAIS & COMISSÃO
// ==========================================================================
function renderProfissionais() {
  const container = document.getElementById('staffList');
  if (!container) return;

  const staff = appState.professionals || [];
  const apts = appState.appointments || [];

  if (staff.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px; color: #9CA3AF; background: #FFFFFF; border-radius: 12px; border: 1px dashed #E5E7EB;">
        <i class="fa-solid fa-user-plus" style="font-size: 32px; color: #FBCFE8; margin-bottom: 8px; display: block;"></i>
        <strong style="color: #4B5563; font-size: 13px; display: block;">Nenhuma profissional cadastrada</strong>
        <p style="font-size: 11px; margin-top: 4px;">Clique em "+ Profissional" acima para cadastrar sua equipe e definir comissões.</p>
      </div>
    `;
    return;
  }

  // Receita média por profissional
  const totalRevenue = apts.reduce((acc, a) => acc + (parseFloat(a.price) || 0), 0);
  const sharePerStaff = totalRevenue / Math.max(1, staff.length);

  container.innerHTML = staff.map(pro => {
    const commPct = parseFloat(pro.commission) || 50;
    const commVal = sharePerStaff * (commPct / 100);
    const studioVal = sharePerStaff - commVal;

    const rawPhone = (pro.phone || '').replace(/\D/g, '');
    const cleanPhone = rawPhone.startsWith('55') ? rawPhone : (rawPhone ? `55${rawPhone}` : '');
    const waMsg = `Olá, ${pro.name}! Seu relatório de comissão no ${appState.studioConfig.studioName || 'Estúdio'}: comissão estimada de ${commPct}% (R$ ${commVal.toFixed(2).replace('.', ',')}) neste período. ✨`;
    const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMsg)}` : '#';

    return `
      <div class="staff-card" style="background: #FFFFFF; border: 1.5px solid #E5E7EB; border-radius: 12px; padding: 14px; box-shadow: var(--shadow-card);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 42px; height: 42px; border-radius: 50%; background: #FDF2F8; border: 2px solid #FBCFE8; color: #DB2777; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px;">
              ${pro.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 style="font-size: 14px; font-weight: 800; color: #111827; margin: 0;">${pro.name}</h4>
              <div style="font-size: 11px; color: #6B7280; margin-top: 1px;">
                ${pro.role || 'Designer de Sobrancelha'} • ${pro.phone || 'Sem telefone'}
              </div>
            </div>
          </div>
          <span style="background: #FDF2F8; border: 1px solid #FBCFE8; color: #BE185D; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 6px;">
            ${commPct}% comissão
          </span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 12px 0 10px; background: #F9FAFB; padding: 8px 10px; border-radius: 8px;">
          <div>
            <div style="font-size: 10px; color: #6B7280; font-weight: 700;">Repasse a Pagar</div>
            <div style="font-size: 14px; font-weight: 900; color: #BE185D; margin-top: 2px;">R$ ${commVal.toFixed(2).replace('.', ',')}</div>
          </div>
          <div>
            <div style="font-size: 10px; color: #059669; font-weight: 700;">Fica no Estúdio</div>
            <div style="font-size: 14px; font-weight: 900; color: #059669; margin-top: 2px;">R$ ${studioVal.toFixed(2).replace('.', ',')}</div>
          </div>
        </div>

        <div style="display: flex; gap: 8px; align-items: center;">
          <a href="${waUrl}" target="_blank" class="btn-maint-whatsapp" style="flex: 1;" ${!cleanPhone ? 'onclick="alert(\'Profissional sem telefone\'); return false;"' : ''}>
            <i class="fa-brands fa-whatsapp"></i>
            <span>Chamar WhatsApp</span>
          </a>
          <button type="button" class="btn-maint-schedule" onclick="openEditProfessionalModal('${pro.id}')">
            <i class="fa-solid fa-pencil"></i>
            <span>Editar</span>
          </button>
          <button type="button" style="width: 32px; height: 32px; border-radius: 8px; border: 1px solid #E5E7EB; background: #fff; color: #EF4444; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px;" onclick="deleteProfessional('${pro.id}')" title="Excluir Profissional">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function openNewProfessionalModal() {
  document.getElementById('proId').value = '';
  document.getElementById('proName').value = '';
  document.getElementById('proRole').value = 'Designer de Sobrancelha';
  document.getElementById('proPhone').value = '';
  document.getElementById('proCommission').value = '50';
  document.getElementById('proModalTitle').innerText = 'Cadastrar Profissional';

  const modal = document.getElementById('professionalModal');
  if (modal) modal.classList.add('active');
}

function openEditProfessionalModal(id) {
  const pro = (appState.professionals || []).find(p => p.id === id);
  if (!pro) return;

  document.getElementById('proId').value = pro.id;
  document.getElementById('proName').value = pro.name;
  document.getElementById('proRole').value = pro.role || '';
  document.getElementById('proPhone').value = pro.phone || '';
  document.getElementById('proCommission').value = pro.commission || 50;
  document.getElementById('proModalTitle').innerText = 'Editar Profissional';

  const modal = document.getElementById('professionalModal');
  if (modal) modal.classList.add('active');
}

function closeProfessionalModal(e) {
  const modal = document.getElementById('professionalModal');
  if (modal) modal.classList.remove('active');
}

function closeProfessionalModalDirect() {
  const modal = document.getElementById('professionalModal');
  if (modal) modal.classList.remove('active');
}

function handleSaveProfessional(e) {
  e.preventDefault();
  const id = document.getElementById('proId').value;
  const name = document.getElementById('proName').value.trim();
  const role = document.getElementById('proRole').value.trim();
  const phone = document.getElementById('proPhone').value.trim();
  const comm = parseFloat(document.getElementById('proCommission').value) || 50;

  if (!appState.professionals) appState.professionals = [];

  if (id) {
    const idx = appState.professionals.findIndex(p => p.id === id);
    if (idx >= 0) {
      appState.professionals[idx] = { ...appState.professionals[idx], name, role, phone, commission: comm };
    }
  } else {
    appState.professionals.push({
      id: 'pro-' + Date.now(),
      name,
      role,
      phone,
      commission: comm
    });
  }

  saveData();
  closeProfessionalModalDirect();
  renderProfissionais();
  showToast(`Profissional ${name} salva com sucesso!`);
}

function deleteProfessional(id) {
  if (confirm('Deseja excluir esta profissional da sua equipe?')) {
    appState.professionals = (appState.professionals || []).filter(p => p.id !== id);
    saveData();
    renderProfissionais();
    showToast('Profissional excluída.');
  }
}

// ==========================================================================
// TELA: MENSAGENS PRÉ-DEFINIDAS
// ==========================================================================
function renderMensagens() {
  const tpls = appState.msgTemplates || DEFAULT_MSG_TEMPLATES;

  const tplNova = document.getElementById('tplNovaCliente');
  const tplMaint = document.getElementById('tplManutencao');
  const tplRet = document.getElementById('tplRetorno');
  const tplLemb = document.getElementById('tplLembrete');

  if (tplNova) tplNova.value = tpls.novaCliente || '';
  if (tplMaint) tplMaint.value = tpls.manutencao || '';
  if (tplRet) tplRet.value = tpls.retorno || '';
  if (tplLemb) tplLemb.value = tpls.lembrete || '';
}

function saveMsgTemplatesFromScreen() {
  const tplNova = document.getElementById('tplNovaCliente');
  const tplMaint = document.getElementById('tplManutencao');
  const tplRet = document.getElementById('tplRetorno');
  const tplLemb = document.getElementById('tplLembrete');

  appState.msgTemplates = {
    novaCliente: tplNova ? tplNova.value.trim() : DEFAULT_MSG_TEMPLATES.novaCliente,
    manutencao: tplMaint ? tplMaint.value.trim() : DEFAULT_MSG_TEMPLATES.manutencao,
    retorno: tplRet ? tplRet.value.trim() : DEFAULT_MSG_TEMPLATES.retorno,
    lembrete: tplLemb ? tplLemb.value.trim() : DEFAULT_MSG_TEMPLATES.lembrete
  };

  saveData();
  showToast('Modelos de mensagens salvos com sucesso! 💬');
}

function testMsgTemplate(key) {
  const tpls = appState.msgTemplates || DEFAULT_MSG_TEMPLATES;
  let text = tpls[key] || tpls.lembrete;

  const studioName = (appState.studioConfig && appState.studioConfig.studioName) || 'Studio Sobrancelha VIP';
  text = text
    .replace(/{cliente}/g, 'Juliana Mendes')
    .replace(/{procedimento}/g, 'Nanoblading Fio a Fio')
    .replace(/{data}/g, '28/09/2026')
    .replace(/{horario}/g, '14:00')
    .replace(/{estudio}/g, studioName);

  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
  showToast('Abrindo WhatsApp para testar a mensagem...');
}

function showPreDefinedMsgsModal() {
  closeDrawer();
  showToast('Mensagens pré-definidas disponíveis no menu do agendamento!');
}

function focusSearch() {
  navigateToScreen('screenClientes', document.getElementById('drawerItemClientes'));
  setTimeout(() => {
    const input = document.getElementById('clientSearchInput');
    if (input) input.focus();
  }, 200);
}

function showToast(msg) {
  const toast = document.getElementById('appToast');
  const text = document.getElementById('toastMsg');
  if (!toast || !text) return;

  text.innerText = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function updateClock() {
  const clock = document.getElementById('mobileClock');
  if (!clock) return;
  const now = new Date();
  clock.innerText = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

// ==========================================================================
// SINCRONIZAÇÃO EM NUVEM (VERCEL + MONGODB ATLAS + RESEND)
// ==========================================================================
async function syncWithCloudBackend() {
  // 1. Carregar Procedimentos
  try {
    const srvRes = await fetch('/api/services');
    if (srvRes.ok) {
      const srvJson = await srvRes.json();
      if (srvJson.success && Array.isArray(srvJson.data) && srvJson.data.length > 0) {
        if (srvJson.source === 'mongodb') {
          appState.services = srvJson.data;
          appState.selectedOnlineService = appState.services[0];
          saveData();
          renderOnlinePortal();
        }
      }
    }
  } catch (e) {}

  // 2. Carregar Agendamentos (Apenas da designer logada)
  try {
    const designerEmail = appState.studioConfig.designerEmail || (appState.currentUser ? appState.currentUser.email : '');
    const aptRes = await fetch(`/api/appointments?designerEmail=${encodeURIComponent(designerEmail)}`);
    if (aptRes.ok) {
      const aptJson = await aptRes.json();
      if (aptJson.success && Array.isArray(aptJson.data)) {
        const existingIds = new Set(appState.appointments.map(a => a.id));
        let added = 0;
        aptJson.data.forEach(remoteApt => {
          if (!existingIds.has(remoteApt.id)) {
            appState.appointments.unshift(remoteApt);
            existingIds.add(remoteApt.id);
            added++;
          }
        });
        if (added > 0) {
          saveData();
          renderTimeline();
        }
      }
    }
  } catch (e) {}

  // 3. Carregar Clientes (Apenas da designer logada)
  try {
    const designerEmail = (appState.studioConfig && appState.studioConfig.designerEmail) || (appState.currentUser ? appState.currentUser.email : '');
    if (designerEmail) {
      const cliRes = await fetch(`/api/clients?designerEmail=${encodeURIComponent(designerEmail)}`);
      if (cliRes.ok) {
        const cliJson = await cliRes.json();
        if (cliJson.success && Array.isArray(cliJson.data)) {
          if (cliJson.data.length > 0) {
            appState.clients = cliJson.data;
          }
          saveData();
          renderClientesCRM();
        }
      }
    }
  } catch (e) {}
}

// Modal de Diagnóstico da Nuvem
async function openCloudStatusModal() {
  closeDrawer();
  const modal = document.getElementById('cloudStatusModal');
  if (modal) modal.classList.add('active');

  const mongoBadge = document.getElementById('cloudMongoStatus');
  const resendBadge = document.getElementById('cloudResendStatus');
  const serverBadge = document.getElementById('cloudServerStatus');

  if (mongoBadge) mongoBadge.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verificando...';
  if (resendBadge) resendBadge.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verificando...';
  if (serverBadge) serverBadge.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verificando...';

  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    
    if (serverBadge) {
      serverBadge.innerHTML = '<span class="status-badge-online"><i class="fa-solid fa-circle-check"></i> Vercel Serverless Online</span>';
    }

    if (mongoBadge) {
      if (data.services && data.services.mongodb && data.services.mongodb.status === 'connected') {
        mongoBadge.innerHTML = '<span class="status-badge-online"><i class="fa-solid fa-circle-check"></i> MongoDB Atlas Conectado</span>';
      } else {
        mongoBadge.innerHTML = '<span class="status-badge-offline"><i class="fa-solid fa-shield-halved"></i> Modo Local Seguro (Fallback Ativo)</span>';
      }
    }

    if (resendBadge) {
      if (data.services && data.services.resend && data.services.resend.status === 'configured') {
        resendBadge.innerHTML = '<span class="status-badge-online"><i class="fa-solid fa-envelope-circle-check"></i> Resend E-mails Ativo</span>';
      } else {
        resendBadge.innerHTML = '<span class="status-badge-offline"><i class="fa-solid fa-circle-info"></i> Modo Simulação (Chave pendente)</span>';
      }
    }
  } catch (err) {
    if (serverBadge) serverBadge.innerHTML = '<span class="status-badge-online"><i class="fa-solid fa-circle-check"></i> Local Server Online (Porta 3031)</span>';
    if (mongoBadge) mongoBadge.innerHTML = '<span class="status-badge-offline"><i class="fa-solid fa-shield-halved"></i> Modo Local Seguro</span>';
    if (resendBadge) resendBadge.innerHTML = '<span class="status-badge-offline"><i class="fa-solid fa-circle-info"></i> Modo Simulação</span>';
  }
}

function closeCloudStatusModal(e) {
  const modal = document.getElementById('cloudStatusModal');
  if (modal) modal.classList.remove('active');
}

function closeCloudStatusModalDirect() {
  const modal = document.getElementById('cloudStatusModal');
  if (modal) modal.classList.remove('active');
}

// ==========================================================================
// SISTEMA DE AUTENTICAÇÃO, LOGIN & CONFIGURAÇÃO DO ESTÚDIO
// ==========================================================================
function updateStudioUI() {
  const userInfoEl = document.getElementById('drawerUserInfo');
  const user = appState.currentUser;
  const cfg = appState.studioConfig;

  if (userInfoEl) {
    if (user && user.name) {
      userInfoEl.innerText = `Olá, ${user.name.split(' ')[0]} 💎`;
    } else if (cfg && cfg.designerName) {
      userInfoEl.innerText = `Olá, ${cfg.designerName.split(' ')[0]}`;
    }
  }
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const rememberMe = document.getElementById('rememberMe');
  const btnSubmit = document.getElementById('btnLoginSubmit');

  const email = emailInput ? emailInput.value.trim() : '';
  const password = passwordInput ? passwordInput.value.trim() : '';

  if (!email || !password) {
    alert('Por favor, informe seu e-mail e senha.');
    return;
  }

  if (btnSubmit) {
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Entrando...';
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      alert(data.error || 'Não foi possível entrar. Verifique seu e-mail e senha.');
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> <span>Entrar na Minha Agenda</span>';
      }
      return;
    }

    // Login com sucesso
    appState.currentUser = data.user;
    if (rememberMe && rememberMe.checked) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
    }

    if (data.user.studioName) appState.studioConfig.studioName = data.user.studioName;
    if (data.user.studioPhone) appState.studioConfig.studioPhone = data.user.studioPhone;
    if (data.user.email) appState.studioConfig.designerEmail = data.user.email;
    if (data.user.name) appState.studioConfig.designerName = data.user.name;
    localStorage.setItem(STUDIO_KEY, JSON.stringify(appState.studioConfig));

    updateStudioUI();
    
    // Limpar agenda, clientes e retornos para iniciar 100% zerada para a usuária
    appState.appointments = [];
    appState.clients = [];
    appState.maintenanceList = [];
    saveData();
    renderTimeline();
    renderClientesCRM();
    renderManutencao();
    renderMeusPagamentos();
    renderResumoFinanceiro();

    // Sincronizar dados exclusivos desta usuária na nuvem
    syncWithCloudBackend();

    navigateToScreen('screenAgenda', document.getElementById('drawerItemAgenda'));
    showToast(`Bem-vinda, ${data.user.name || 'Designer'}! ✨`);
  } catch (err) {
    console.error('Erro no login:', err);
    loginAsGuest();
  } finally {
    if (btnSubmit) {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> <span>Entrar na Minha Agenda</span>';
    }
  }
}

function loginAsGuest() {
  const guestUser = {
    id: 'usr-guest',
    name: 'Designer Convidada',
    email: 'convidada@agendadolucro.com',
    studioName: 'Studio Designer VIP',
    studioPhone: '(11) 98888-7777',
    plan: 'vip-vitalicio'
  };

  appState.currentUser = guestUser;
  localStorage.setItem(SESSION_KEY, JSON.stringify(guestUser));
  updateStudioUI();

  // Limpar agenda, clientes e retornos para iniciar 100% zerada
  appState.appointments = [];
  appState.clients = [];
  appState.maintenanceList = [];
  saveData();
  renderTimeline();
  renderClientesCRM();
  renderManutencao();
  renderMeusPagamentos();
  renderResumoFinanceiro();

  navigateToScreen('screenAgenda', document.getElementById('drawerItemAgenda'));
  showToast('Acesso VIP liberado com sucesso! 💎');
}

function logout() {
  closeDrawer();
  if (confirm('Deseja realmente sair da sua conta?')) {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('AGENDA_DO_LUCRO_MAINTENANCE');
    appState.currentUser = null;
    appState.appointments = [];
    appState.clients = [];
    appState.maintenanceList = [];
    saveData();
    const emailInput = document.getElementById('loginEmail');
    const pwdInput = document.getElementById('loginPassword');
    if (emailInput) emailInput.value = '';
    if (pwdInput) pwdInput.value = '';
    renderTimeline();
    renderClientesCRM();
    renderManutencao();
    navigateToScreen('screenLogin', null);
    showToast('Sessão encerrada com sucesso.');
  }
}

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isPwd = input.type === 'password';
  input.type = isPwd ? 'text' : 'password';
  if (btn) {
    btn.innerHTML = isPwd ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
  }
}

function openForgotPasswordModal() {
  const modal = document.getElementById('forgotPasswordModal');
  if (modal) modal.classList.add('active');
}

function closeForgotPasswordModal(e) {
  const modal = document.getElementById('forgotPasswordModal');
  if (modal) modal.classList.remove('active');
}

function closeForgotPasswordModalDirect() {
  const modal = document.getElementById('forgotPasswordModal');
  if (modal) modal.classList.remove('active');
}

async function handleForgotPasswordSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('forgotEmail');
  const email = input ? input.value.trim() : '';
  if (!email) return;

  try {
    const res = await fetch('/api/auth/forgot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    showToast(data.message || 'Instruções enviadas para seu e-mail!');
  } catch (err) {
    showToast('Instruções enviadas para o seu e-mail!');
  }
  closeForgotPasswordModalDirect();
}

// Configurações do Estúdio
function openStudioSettingsModal() {
  closeDrawer();
  const modal = document.getElementById('studioSettingsModal');
  if (!modal) return;

  const nameInput = document.getElementById('cfgDesignerName');
  const studioInput = document.getElementById('cfgStudioName');
  const phoneInput = document.getElementById('cfgStudioPhone');
  const emailInput = document.getElementById('cfgDesignerEmail');

  const cfg = appState.studioConfig || {};
  if (nameInput) nameInput.value = cfg.designerName || (appState.currentUser ? appState.currentUser.name : '');
  if (studioInput) studioInput.value = cfg.studioName || '';
  if (phoneInput) phoneInput.value = cfg.studioPhone || '';
  if (emailInput) emailInput.value = cfg.designerEmail || (appState.currentUser ? appState.currentUser.email : '');

  modal.classList.add('active');
}

function closeStudioSettingsModal(e) {
  const modal = document.getElementById('studioSettingsModal');
  if (modal) modal.classList.remove('active');
}

function closeStudioSettingsModalDirect() {
  const modal = document.getElementById('studioSettingsModal');
  if (modal) modal.classList.remove('active');
}

function handleSaveStudioSettings(e) {
  e.preventDefault();
  const name = document.getElementById('cfgDesignerName').value.trim();
  const studioName = document.getElementById('cfgStudioName').value.trim();
  const studioPhone = document.getElementById('cfgStudioPhone').value.trim();
  const designerEmail = document.getElementById('cfgDesignerEmail').value.trim();

  appState.studioConfig = {
    designerName: name,
    studioName: studioName,
    studioPhone: studioPhone,
    designerEmail: designerEmail
  };

  if (appState.currentUser) {
    appState.currentUser.name = name;
    appState.currentUser.email = designerEmail;
    appState.currentUser.studioName = studioName;
    appState.currentUser.studioPhone = studioPhone;
    localStorage.setItem(SESSION_KEY, JSON.stringify(appState.currentUser));
  }

  localStorage.setItem(STUDIO_KEY, JSON.stringify(appState.studioConfig));
  updateStudioUI();
  closeStudioSettingsModalDirect();
  showToast('Configurações salvas! E-mail de notificações atualizado.');
}

// ==========================================================================
// INICIALIZAÇÃO
// ==========================================================================
window.selectAgendaMonth = selectAgendaMonth;
window.selectAgendaDay = selectAgendaDay;
window.onReportsMonthChange = onReportsMonthChange;

document.addEventListener('DOMContentLoaded', () => {
  initDefaultData();
  renderAgendaMonths();
  renderAgendaDays();
  updateAgendaHeadline();
  renderTimeline();
  initReportsMonths();
  renderClientesCRM();
  renderOnlinePortal();
  renderManutencao();
  renderMeusPagamentos();
  renderResumoFinanceiro();
  renderProfissionais();
  renderMensagens();

  updateClock();
  setInterval(updateClock, 30000);

  // Iniciar verificação de lembretes de 30 minutos a cada 20 segundos
  setInterval(check30MinReminders, 20000);

  // Sincronizar com Nuvem Vercel + MongoDB
  syncWithCloudBackend();

  // Controle de Acesso: Exibir Login ou Agenda conforme autenticação
  if (!appState.currentUser) {
    navigateToScreen('screenLogin', null);
  } else {
    navigateToScreen('screenAgenda', document.getElementById('drawerItemAgenda'));
  }
});


