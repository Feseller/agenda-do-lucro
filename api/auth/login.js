import { connectToDatabase } from '../lib/mongodb.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Apenas método POST é permitido' });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Informe e-mail e senha' });
  }

  const cleanEmail = email.toLowerCase().trim();

  // 1. Acesso Mestre de Administrador & Contas de Cliente/Teste VIP
  const validAdmins = [
    { email: 'admin@agendadolucro.com', pwd: ['lucro@2026', 'admin123'] },
    { email: 'araujofernando88@gmail.com', pwd: ['nt0fms2jy2maaoth', 'lucro@2026'] }
  ];

  const validClients = [
    { 
      email: 'cliente@agendadolucro.com', 
      pwd: ['cliente@2026', 'cliente2026', 'lucro@2026', 'vip2026'],
      name: 'Camila Silva',
      studioName: 'Studio Camila Sobrancelhas VIP',
      studioPhone: '(11) 98765-4321',
      plan: 'anual'
    },
    { 
      email: 'teste@agendadolucro.com', 
      pwd: ['teste@2026', 'teste2026', 'lucro@2026', '123456'],
      name: 'Aluna Teste VIP',
      studioName: 'Studio Beleza & Lucro',
      studioPhone: '(11) 99999-8888',
      plan: 'anual'
    }
  ];

  const lowerPwd = (password || '').toLowerCase();

  // Verificar admin
  const adminMatch = validAdmins.find(a => a.email === cleanEmail && a.pwd.includes(lowerPwd));
  if (adminMatch) {
    return res.status(200).json({
      success: true,
      user: {
        id: 'usr-admin',
        email: cleanEmail,
        name: cleanEmail.includes('araujo') ? 'Fernando Araújo' : 'Designer VIP Admin',
        studioName: 'Studio Designer VIP',
        studioPhone: '(11) 98888-7777',
        plan: 'anual',
        role: 'admin'
      }
    });
  }

  // Verificar cliente teste
  const clientMatch = validClients.find(c => c.email === cleanEmail && c.pwd.includes(lowerPwd));
  if (clientMatch) {
    return res.status(200).json({
      success: true,
      user: {
        id: 'usr-cliente-' + cleanEmail.split('@')[0],
        email: clientMatch.email,
        name: clientMatch.name,
        studioName: clientMatch.studioName,
        studioPhone: clientMatch.studioPhone,
        plan: clientMatch.plan,
        role: 'designer'
      }
    });
  }

  // 2. Consulta no MongoDB Atlas
  const { db, isConnected } = await connectToDatabase();

  if (isConnected) {
    try {
      const user = await db.collection('users').findOne({ email: cleanEmail });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'E-mail não cadastrado. Se você comprou via Kiwify, aguarde alguns minutos pela ativação ou contate o suporte.'
        });
      }

      if (user.status === 'bloqueado') {
        return res.status(403).json({
          success: false,
          error: 'Seu acesso foi suspenso ou cancelado. Entre em contato com o suporte da Agenda do Lucro.'
        });
      }

      if (user.password !== password) {
        return res.status(401).json({
          success: false,
          error: 'Senha incorreta. Verifique o e-mail de boas-vindas da Kiwify ou use "Esqueci minha senha".'
        });
      }

      return res.status(200).json({
        success: true,
        user: {
          id: user.id || user._id,
          email: user.email,
          name: user.name,
          studioName: user.studioName || `Studio ${user.name.split(' ')[0]}`,
          studioPhone: user.phone || '(11) 98888-7777',
          plan: user.plan || 'pro'
        }
      });
    } catch (err) {
      console.error('Erro na autenticação MongoDB:', err);
      return res.status(500).json({ success: false, error: 'Erro ao consultar banco de dados' });
    }
  }

  // Fallback se o banco não estiver acessível
  return res.status(200).json({
    success: true,
    fallback: true,
    user: {
      id: 'usr-offline',
      email: cleanEmail,
      name: 'Designer VIP',
      studioName: 'Studio Sobrancelha VIP',
      studioPhone: '(11) 98888-7777',
      plan: 'pro'
    }
  });
}
