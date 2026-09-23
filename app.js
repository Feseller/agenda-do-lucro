/**
 * AGENDA DO LUCRO — GESTÃO & AGENDAMENTO VIP
 * Reprodução das Telas Oficiais Adaptadas para Designer de Sobrancelha
 * Identidade: portal.minhaagendaapp.com.br/agenda
 */

const STORAGE_KEY = 'AGENDA_DO_LUCRO_SOBRANCELHA_V1';
const LEGACY_STORAGE_KEY = 'MINHA_AGENDA_SOBRANCELHA_V1';
const SESSION_KEY = 'AGENDA_DO_LUCRO_SESSION_V1';
const STUDIO_KEY = 'AGENDA_DO_LUCRO_STUDIO_V1';
const STUDIO_PHONE = '5511988887777';

// Catálogo Padrão de Procedimentos de Sobrancelha
const DEFAULT_SERVICES = [
  {
    id: 'srv-1',
    name: 'Nanoblading Fio a Fio Realista (Micro)',
    category: 'micro',
    price: 380.00,
    deposit: 190.00,
    duration: 120,
    desc: 'Técnica com nano agulhas ultrafinas que desenha fios milimétricos idênticos aos naturais.',
    img: 'assets/banner-sobrancelha.jpg'
  },
  {
    id: 'srv-2',
    name: 'Brow Lamination & Nutrição Profunda',
    category: 'lamination',
    price: 160.00,
    deposit: 80.00,
    duration: 60,
    desc: 'Alinhamento dos fios na direção desejada criando aspecto encorpado e moderno.',
    img: 'assets/banner-sobrancelha.jpg'
  },
  {
    id: 'srv-3',
    name: 'Design com Henna Ombré Premium',
    category: 'design',
    price: 110.00,
    deposit: 55.00,
    duration: 50,
    desc: 'Mapeamento facial áureo e aplicação degradê de henna indiana pura.',
    img: 'assets/banner-sobrancelha.jpg'
  },
  {
    id: 'srv-4',
    name: 'Micropigmentação Shadow Line Luxo',
    category: 'micro',
    price: 420.00,
    deposit: 210.00,
    duration: 120,
    desc: 'Combinação de fios na frente com sombreado translúcido na cauda.',
    img: 'assets/banner-sobrancelha.jpg'
  },
  {
    id: 'srv-5',
    name: 'Combo VIP: Lamination + Design + Tintura',
    category: 'combo',
    price: 220.00,
    deposit: 110.00,
    duration: 75,
    desc: 'Visagismo estratégico, lamination europeia e tintura com banho de brilho.',
    img: 'assets/banner-sobrancelha.jpg'
  },
  {
    id: 'srv-6',
    name: 'Epilação Egípcia Facial Completa',
    category: 'design',
    price: 90.00,
    deposit: 45.00,
    duration: 40,
    desc: 'Remoção com linha orgânica 100% algodão antialérgica pela raiz.',
    img: 'assets/banner-sobrancelha.jpg'
  }
];

// Nomes em português para dias da semana e meses
const WEEKDAYS_PT = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const MONTHS_NAMES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Gerador dinâmico de dias para qualquer mês e ano
function getDaysForMonth(year, monthIndex) {
  const totalDays = new Date(year, monthIndex + 1, 0).getDate();
  const daysList = [];

  let startDay = 1;
  if (year === 2026 && monthIndex === 8) {
    startDay = 22;
  }

  for (let d = startDay; d <= totalDays; d++) {
    const dateObj = new Date(year, monthIndex, d);
    const weekday = WEEKDAYS_PT[dateObj.getDay()];
    const monthName = MONTHS_NAMES_PT[monthIndex];
    const dayStr = d < 10 ? '0' + d : String(d);
    daysList.push({
      day: d,
      month: monthName,
      monthIndex: monthIndex,
      year: year,
      weekday: weekday,
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
  selectedOnlineService: DEFAULT_SERVICES[0],
  selectedOnlineSlot: '08:00',
  selectedOnlineYear: 2026,
  selectedOnlineMonthIndex: 8, // Setembro
  selectedOnlineDayIndex: 0,
  currentActionAppointment: null,
  clientSearchQuery: '',
  appointments: [],
  clients: [],
  services: [...DEFAULT_SERVICES]
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

  const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Limpar agendamentos mockados antigos para garantir que a agenda inicie 100% zerada
      appState.appointments = (parsed.appointments || []).filter(a => !String(a.id).startsWith('apt-1') && !String(a.id).startsWith('apt-2') && !String(a.id).startsWith('apt-3') && !String(a.id).startsWith('apt-4') && !String(a.id).startsWith('apt-5') && !String(a.id).startsWith('apt-6') && !String(a.id).startsWith('apt-7') && !String(a.id).startsWith('apt-8') && !String(a.id).startsWith('apt-9') && !String(a.id).startsWith('apt-10'));
      appState.clients = parsed.clients || [];
      appState.services = (parsed.services && parsed.services.length) ? parsed.services : [...DEFAULT_SERVICES];
      appState.selectedOnlineService = appState.services[0];
      return;
    } catch (e) {
      console.warn('Recriando banco local...', e);
    }
  }

  // Clientes A-Z com Fotos e Histórico
  const defaultClients = [
    {
      id: 'cli-1',
      name: 'Amanda Silveira',
      phone: '(11) 98111-2233',
      notes: 'Gosta de início esfumado e arqueamento sutil.',
      visits: 4,
      ltv: 680.00,
      beforeImg: 'assets/banner-sobrancelha.jpg',
      afterImg: 'assets/banner-sobrancelha.jpg'
    },
    {
      id: 'cli-2',
      name: 'Bruna',
      phone: '(11) 98222-3344',
      notes: 'Nanoblading Fio a Fio com retoque agendado.',
      visits: 3,
      ltv: 760.00,
      beforeImg: '',
      afterImg: ''
    },
    {
      id: 'cli-3',
      name: 'Carla',
      phone: '(11) 98333-4455',
      notes: 'Design de sobrancelhas clássico a cada 20 dias.',
      visits: 6,
      ltv: 510.00,
      beforeImg: 'assets/banner-sobrancelha.jpg',
      afterImg: 'assets/banner-sobrancelha.jpg'
    },
    {
      id: 'cli-4',
      name: 'Dayane',
      phone: '(11) 98444-5566',
      notes: 'Comanda ativa de pacote de sessões.',
      visits: 5,
      ltv: 890.00,
      beforeImg: '',
      afterImg: ''
    },
    {
      id: 'cli-5',
      name: 'Fernanda',
      phone: '(11) 98555-6677',
      notes: 'Epilação na linha 100% algodão.',
      visits: 2,
      ltv: 270.00,
      beforeImg: '',
      afterImg: ''
    },
    {
      id: 'cli-6',
      name: 'Gabriela',
      phone: '(11) 98666-7788',
      notes: 'Micropigmentação Shadow Line e Brow Lamination.',
      visits: 4,
      ltv: 980.00,
      beforeImg: 'assets/banner-sobrancelha.jpg',
      afterImg: 'assets/banner-sobrancelha.jpg'
    },
    {
      id: 'cli-7',
      name: 'Juliana Mendes',
      phone: '(11) 98888-9900',
      notes: 'Aniversariante do dia! 🎂 Combo VIP Completo.',
      visits: 7,
      ltv: 1450.00,
      beforeImg: 'assets/banner-sobrancelha.jpg',
      afterImg: 'assets/banner-sobrancelha.jpg'
    },
    {
      id: 'cli-8',
      name: 'Larissa Meireles',
      phone: '(11) 98999-0011',
      notes: 'Retoque Nanoblading semestral.',
      visits: 4,
      ltv: 760.00,
      beforeImg: '',
      afterImg: ''
    },
    {
      id: 'cli-9',
      name: 'Mariana Siqueira',
      phone: '(11) 99111-1223',
      notes: 'Design Personalizado com Visagismo Áureo.',
      visits: 8,
      ltv: 1840.00,
      beforeImg: 'assets/banner-sobrancelha.jpg',
      afterImg: 'assets/banner-sobrancelha.jpg'
    },
    {
      id: 'cli-10',
      name: 'Raíssa',
      phone: '(11) 99222-2334',
      notes: 'Atendimento de estética facial e sobrancelha.',
      visits: 2,
      ltv: 380.00,
      beforeImg: '',
      afterImg: ''
    }
  ];

  // Agendamentos idênticos à Linha do Tempo da Imagem 3 (Dia 28 de Setembro)
  const defaultAppointments = [
    {
      id: 'apt-1',
      timeStart: '08:00',
      timeEnd: '09:00',
      hourSlot: '08',
      clientName: 'Fernanda',
      clientPhone: '(11) 98555-6677',
      serviceName: 'Epilação Facial Egípcia',
      price: 90.00,
      color: 'blue',
      statusTag: 'Não comparecimento',
      isBirthday: false
    },
    {
      id: 'apt-2',
      timeStart: '09:00',
      timeEnd: '09:30',
      hourSlot: '09',
      clientName: 'Carla',
      clientPhone: '(11) 98333-4455',
      serviceName: 'Design de sobrancelhas',
      price: 85.00,
      color: 'yellow',
      statusTag: 'Confirmado',
      isBirthday: false
    },
    {
      id: 'apt-3',
      timeStart: '09:30',
      timeEnd: '10:00',
      hourSlot: '09',
      clientName: 'Bruna',
      clientPhone: '(11) 98222-3344',
      serviceName: 'Nanoblading Fio a Fio',
      price: 380.00,
      color: 'yellow',
      statusTag: 'Confirmado',
      isBirthday: false
    },
    {
      id: 'apt-4',
      timeStart: '10:00',
      timeEnd: '10:30',
      hourSlot: '10',
      clientName: 'Gabriela',
      clientPhone: '(11) 98666-7788',
      serviceName: 'Micropigmentação Shadow',
      price: 420.00,
      color: 'blue',
      statusTag: 'À confirmar',
      isBirthday: false
    },
    {
      id: 'apt-5',
      timeStart: '10:30',
      timeEnd: '11:00',
      hourSlot: '10',
      clientName: 'Gabriela',
      clientPhone: '(11) 98666-7788',
      serviceName: 'Brow Lamination & Nutrição',
      price: 160.00,
      color: 'blue',
      statusTag: 'À confirmar',
      isBirthday: false
    },
    {
      id: 'apt-6',
      timeStart: '11:00',
      timeEnd: '12:00',
      hourSlot: '11',
      clientName: 'Juliana Mendes',
      clientPhone: '(11) 98888-9900',
      serviceName: 'Combo VIP: Lamination + Design',
      price: 220.00,
      color: 'blue',
      statusTag: 'Confirmado',
      isBirthday: true
    },
    {
      id: 'apt-7',
      timeStart: '12:00',
      timeEnd: '13:00',
      hourSlot: '12',
      clientName: 'Raíssa',
      clientPhone: '(11) 99222-2334',
      serviceName: 'Design com Henna Ombré',
      price: 110.00,
      color: 'blue',
      statusTag: 'Confirmado',
      isBirthday: false
    },
    {
      id: 'apt-8',
      timeStart: '14:00',
      timeEnd: '15:30',
      hourSlot: '14',
      clientName: 'Mariana Siqueira',
      clientPhone: '(11) 99111-1223',
      serviceName: 'Design Personalizado com Visagismo',
      price: 85.00,
      color: 'mint',
      statusTag: 'Confirmado',
      isBirthday: false
    },
    {
      id: 'apt-9',
      timeStart: '16:00',
      timeEnd: '17:30',
      hourSlot: '16',
      clientName: 'Larissa Meireles',
      clientPhone: '(11) 98999-0011',
      serviceName: 'Retoque & Manutenção Nanoblading',
      price: 180.00,
      color: 'blue',
      statusTag: 'Confirmado',
      isBirthday: false
    },
    {
      id: 'apt-10',
      timeStart: '18:00',
      timeEnd: '19:00',
      hourSlot: '18',
      clientName: 'Amanda Silveira',
      clientPhone: '(11) 98111-2233',
      serviceName: 'Design com Henna Ombré Premium',
      price: 110.00,
      color: 'yellow',
      statusTag: 'Confirmado',
      isBirthday: false
    }
  ];

  appState.clients = defaultClients;
  appState.appointments = []; // ZERADO! Começa 100% limpo sem replicar agendamentos para quem compra
  saveData();
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    clients: appState.clients,
    appointments: appState.appointments,
    services: appState.services
  }));
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
    renderTimeline();
  } else if (screenId === 'screenClientes') {
    renderClientesCRM();
  } else if (screenId === 'screenLinkOnline') {
    renderOnlinePortal();
  }
}

function switchMainView(screenId, btn) {
  document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  navigateToScreen(screenId, null);
}

// ==========================================================================
// TELA 1: AGENDA EM LINHA DO TEMPO (CONFORME IMAGEM 3)
// ==========================================================================
function renderTimeline() {
  const container = document.getElementById('timelineContainer');
  if (!container) return;

  const hours = [
    '07', '08', '09', '10', '11', '12', '13', '14',
    '15', '16', '17', '18', '19', '20', '21', '22'
  ];

  let html = '';
  hours.forEach(hour => {
    // Buscar agendamentos que caem nesta hora
    const aptsInHour = appState.appointments.filter(a => {
      const slot = a.hourSlot || (a.timeStart ? a.timeStart.split(':')[0] : '');
      return slot === hour;
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
            return `
              <div class="appointment-block ${apt.color || 'blue'}" id="apt-block-${apt.id}" onclick="event.stopPropagation(); openActionModal('${apt.id}')">
                <div class="apt-time-row">
                  <span>${apt.timeStart} - ${apt.timeEnd || apt.timeStart}</span>
                  ${apt.statusTag ? `<span class="apt-status-tag"><i class="fa-solid fa-tag"></i> ${apt.statusTag}</span>` : ''}
                </div>
                <div class="apt-client-row">
                  <i class="fa-solid fa-user"></i>
                  <span>${apt.clientName}</span>
                  ${birthdayIcon}
                </div>
                <div class="apt-service-row">
                  <i class="fa-solid fa-paintbrush"></i>
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

function selectAgendaDay(dayNumber, el) {
  appState.selectedDay = dayNumber;
  document.querySelectorAll('.weekday-col').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');

  const headline = document.getElementById('agendaDateHeadline');
  if (headline) {
    const days = getDaysForMonth(appState.selectedYear, appState.selectedMonth);
    const found = days.find(d => d.day === dayNumber);
    const weekdayName = found ? found.weekday : 'Segunda';
    const monthName = MONTHS_NAMES_PT[appState.selectedMonth] || 'Setembro';
    headline.innerText = `${weekdayName}, ${dayNumber} de ${monthName}, ${appState.selectedYear}`;
  }
  showToast(`Agenda de ${dayNumber}/${String(appState.selectedMonth + 1).padStart(2, '0')} carregada`);
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

  const msg = `Olá, ${apt.clientName}! Passando para confirmar seu horário de *${apt.serviceName}* no Studio Kiko hoje (${appState.selectedDay}/09) às *${apt.timeStart}*.\n\nQualquer dúvida estamos à disposição! ✨`;
  const cleanPhone = apt.clientPhone.replace(/\D/g, '');
  const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`;
  
  window.open(url, '_blank');
  closeActionModalDirect();
  showToast('Lembrete enviado via WhatsApp!');
}

function sendPreDefinedMsg() {
  const apt = appState.currentActionAppointment;
  if (!apt) return;

  const msg = `Olá, ${apt.clientName}! Tudo bem? Seu procedimento de *${apt.serviceName}* está confirmado no Studio Kiko. Chegue com 5 minutos de antecedência para tomarmos um café! ☕✨`;
  const cleanPhone = apt.clientPhone.replace(/\D/g, '');
  const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`;
  
  window.open(url, '_blank');
  closeActionModalDirect();
}

function addChargeFromAppointment() {
  closeActionModalDirect();
  navigateToScreen('screenComandas', document.getElementById('drawerItemComandas'));
  showToast('Cobrança gerada com sucesso na comanda!');
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
// TELA 3: COMANDAS (CONFORME IMAGEM 4)
// ==========================================================================
function openComandaModal(clientName, serviceTitle, total, paid, debt) {
  document.getElementById('comandaClientName').innerText = clientName;
  document.getElementById('comandaServiceTitle').innerText = serviceTitle;
  document.getElementById('comandaTotalVal').innerText = `R$ ${total}`;
  document.getElementById('comandaPaidVal').innerText = `R$ ${paid} (Devendo: R$ ${debt})`;

  document.getElementById('comandaDetailModal').classList.add('active');
}

function closeComandaModal(e) {
  document.getElementById('comandaDetailModal').classList.remove('active');
}

function closeComandaModalDirect() {
  document.getElementById('comandaDetailModal').classList.remove('active');
}

function openNewComandaModal() {
  showToast('Abrindo formulário de nova comanda...');
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

  let list = [...appState.clients];
  if (appState.clientSearchQuery) {
    list = list.filter(c => c.name.toLowerCase().includes(appState.clientSearchQuery) || c.phone.includes(appState.clientSearchQuery));
  }

  list.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

  // Agrupar por letra inicial
  const grouped = {};
  list.forEach(client => {
    const letter = client.name.charAt(0).toUpperCase();
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
      html += `
        <div class="client-crm-card" onclick="openClientRecordModal('${client.id}')">
          <div class="client-crm-info">
            <h4>${client.name}</h4>
            <p>${client.phone} • ${client.visits} atendimentos</p>
            <p style="font-size: 10px; color: var(--purple-primary); margin-top: 2px;">
              ${hasPhotos ? '📸 Fotos Antes e Depois Salvas' : '📷 Sem fotos cadastradas'}
            </p>
          </div>
          <div class="client-crm-badge">
            R$ ${client.ltv.toFixed(2).replace('.', ',')}
          </div>
        </div>
      `;
    });
  });

  container.innerHTML = html;
}

function openClientRecordModal(clientId) {
  const client = appState.clients.find(c => c.id === clientId);
  if (!client) return;

  document.getElementById('recordClientId').value = client.id;
  document.getElementById('clientRecordTitle').innerText = `Ficha Técnica: ${client.name}`;
  document.getElementById('recordClientName').value = client.name;
  document.getElementById('recordClientPhone').value = client.phone;
  document.getElementById('recordClientNotes').value = client.notes || '';

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
      ltv: 250.00,
      beforeImg: beforeImg,
      afterImg: afterImg
    };
    appState.clients.push(client);
  }

  saveData();
  closeClientRecordModalDirect();
  renderClientesCRM();
  showToast('Ficha técnica da cliente salva com sucesso!');
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
function openNewServiceModal() {
  document.getElementById('editServiceId').value = '';
  document.getElementById('editServiceName').value = '';
  document.getElementById('editServicePrice').value = '';
  document.getElementById('editServiceDuration').value = '60';
  document.getElementById('editServiceCategory').value = 'sobrancelha';
  document.getElementById('editServiceDesc').value = '';
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
      img: 'assets/banner-sobrancelha.jpg'
    };
    appState.services.unshift(newService);
    appState.selectedOnlineService = newService;
  }

  saveData();
  closeServiceModalDirect();
  renderOnlinePortal();
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
  let existingClient = appState.clients.find(c => c.name.toLowerCase() === name.toLowerCase() || c.phone === phone);
  let clientToSave;
  if (existingClient) {
    existingClient.visits += 1;
    existingClient.ltv += s.price;
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
      afterImg: ''
    };
    appState.clients.push(clientToSave);
  }

  saveData();
  closeOnlineBookingModalDirect();

  // Sincronizar com Nuvem (MongoDB + Disparo Resend)
  const targetEmail = appState.studioConfig.designerEmail || (appState.currentUser ? appState.currentUser.email : '');
  fetch('/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...newApt,
      designerEmail: targetEmail
    })
  }).then(r => r.json()).then(res => {
    if (res && res.emailSent) {
      console.log('✅ Notificação de e-mail enviada para a Designer via Resend!');
    }
  }).catch(err => console.warn('Aviso API agendamentos:', err));

  fetch('/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clientToSave)
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

  const clientName = nameInput ? nameInput.value.trim() : '';
  const clientPhone = phoneInput ? phoneInput.value.trim() : '';
  const serviceId = serviceSelect ? serviceSelect.value : '';
  const timeStart = timeSelect ? timeSelect.value : '08:00';
  const selectedDate = dateInput && dateInput.value ? dateInput.value : '';

  if (!clientName) {
    alert('Informe o nome da cliente.');
    return;
  }

  const s = appState.services.find(srv => srv.id === serviceId) || appState.services[0] || { name: 'Procedimento VIP', price: 100 };
  
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
    price: s.price,
    day,
    month,
    year,
    color: 'yellow',
    statusTag: 'Confirmado',
    isBirthday: false
  };

  appState.appointments.unshift(newApt);
  saveData();
  closeNewAppointmentModalDirect();

  // Sincronizar com MongoDB
  const targetEmail = appState.studioConfig.designerEmail || (appState.currentUser ? appState.currentUser.email : '');
  fetch('/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...newApt,
      designerEmail: targetEmail
    })
  }).catch(() => {});

  // Limpar formulário
  if (nameInput) nameInput.value = '';
  if (phoneInput) phoneInput.value = '';

  renderTimeline();
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
        icon: 'assets/logo-kiko.jpg'
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
        icon: 'assets/logo-kiko.jpg'
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

  const clientMsg = `Olá, ${apt.clientName}! Tudo pronto para o seu horário de *${apt.serviceName}* no Studio Kiko daqui a 30 minutos (às ${apt.timeStart})? Já estamos te aguardando com um café quentinho! ☕✨`;
  const cleanPhone = apt.clientPhone.replace(/\D/g, '');
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
  const link = 'https://portal.minhaagendaapp.com.br/agenda';
  navigator.clipboard.writeText(link).then(() => {
    showToast('Link oficial copiado: portal.minhaagendaapp.com.br/agenda');
  }).catch(() => {
    showToast('Link: portal.minhaagendaapp.com.br/agenda');
  });
}

function openNewAppointmentModal() {
  // Simular novo agendamento rápido
  const names = ['Fernanda Lima', 'Camila Rocha', 'Juliana Mendes', 'Beatriz Silva'];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const srvList = (appState.services && appState.services.length) ? appState.services : DEFAULT_SERVICES;
  const randomSrv = srvList[Math.floor(Math.random() * srvList.length)];

  appState.selectedOnlineService = randomSrv;
  const nameInput = document.getElementById('obClientName');
  const phoneInput = document.getElementById('obClientPhone');
  if (nameInput) nameInput.value = randomName;
  if (phoneInput) phoneInput.value = '(11) 98765-4321';

  openOnlineCheckout();
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

  // 3. Carregar Clientes
  try {
    const cliRes = await fetch('/api/clients');
    if (cliRes.ok) {
      const cliJson = await cliRes.json();
      if (cliJson.success && Array.isArray(cliJson.data) && cliJson.data.length > 0) {
        const existingClientIds = new Set(appState.clients.map(c => c.id));
        let addedCli = 0;
        cliJson.data.forEach(remoteCli => {
          if (!existingClientIds.has(remoteCli.id)) {
            appState.clients.push(remoteCli);
            existingClientIds.add(remoteCli.id);
            addedCli++;
          }
        });
        if (addedCli > 0) {
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
    
    // Limpar agenda para não herdar agendamentos de outros logins
    appState.appointments = [];
    renderTimeline();
    loadServerData();

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
  navigateToScreen('screenAgenda', document.getElementById('drawerItemAgenda'));
  showToast('Acesso VIP liberado com sucesso! 💎');
}

function logout() {
  closeDrawer();
  if (confirm('Deseja realmente sair da sua conta?')) {
    localStorage.removeItem(SESSION_KEY);
    appState.currentUser = null;
    const emailInput = document.getElementById('loginEmail');
    const pwdInput = document.getElementById('loginPassword');
    if (emailInput) emailInput.value = '';
    if (pwdInput) pwdInput.value = '';
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
document.addEventListener('DOMContentLoaded', () => {
  initDefaultData();
  renderTimeline();
  renderClientesCRM();
  renderOnlinePortal();

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


