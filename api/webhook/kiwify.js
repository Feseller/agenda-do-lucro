import { connectToDatabase } from '../lib/mongodb.js';
import { sendWelcomeKiwifyEmail } from '../lib/resend.js';

function generateRandomPassword() {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `Lucro@${digits}`;
}

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

  try {
    const payload = req.body || {};

    // Extrair status do pedido da Kiwify
    const orderStatus = (payload.order_status || payload.status || '').toLowerCase();
    
    // Extrair dados do cliente
    const customer = payload.Customer || payload.customer || {};
    const email = (customer.email || payload.email || payload.customer_email || '').toLowerCase().trim();
    const name = customer.full_name || customer.name || payload.name || payload.customer_name || 'Designer';
    const phone = customer.mobile || customer.phone || payload.mobile || '';

    if (!email) {
      return res.status(400).json({ success: false, error: 'E-mail do comprador não informado' });
    }

    // Identificar automaticamente se a compra ou assinatura é Mensal ou Anual
    const planText = (
      payload.Subscription?.plan?.name ||
      payload.Subscription?.charging_period ||
      payload.Subscription?.frequency ||
      payload.data?.subscription?.plan?.name ||
      payload.data?.subscription?.plan?.frequency ||
      payload.Product?.product_name ||
      payload.product_name ||
      payload.offer_name ||
      payload.Plan?.name ||
      ''
    ).toLowerCase();

    const isMonthly = planText.includes('mensal') || planText.includes('month');
    const detectedPlan = isMonthly ? 'mensal' : 'anual';
    const planLabel = isMonthly ? 'Plano Mensal' : 'Plano Anual';
    const durationDays = isMonthly ? 35 : 370; // Dias com margem de segurança para renovação
    const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    const { db, isConnected } = await connectToDatabase();

    // =======================================================================
    // 1. PEDIDO APROVADO / PAGO / ASSINATURA RENOVADA
    // =======================================================================
    const isPaid = orderStatus === 'paid' || 
                   orderStatus === 'approved' || 
                   orderStatus === 'complete' || 
                   payload.event === 'subscription_renewed' || 
                   !orderStatus;

    if (isPaid) {
      let passwordToEmail = null;
      let existingUser = null;

      if (isConnected) {
        existingUser = await db.collection('users').findOne({ email });
        
        if (existingUser) {
          // Reativar usuário ou renovar assinatura mensal/anual
          await db.collection('users').updateOne(
            { email },
            { 
              $set: { 
                status: 'ativo', 
                plan: detectedPlan,
                billingCycle: detectedPlan,
                expiresAt: expiresAt,
                updatedAt: new Date().toISOString() 
              } 
            }
          );
          passwordToEmail = existingUser.password;
        } else {
          // Criar novo usuário VIP
          passwordToEmail = generateRandomPassword();
          const newUser = {
            id: 'usr-' + Date.now(),
            email: email,
            name: name,
            phone: phone,
            password: passwordToEmail,
            status: 'ativo',
            plan: detectedPlan,
            billingCycle: detectedPlan,
            expiresAt: expiresAt,
            source: 'kiwify',
            studioName: `Studio ${name.split(' ')[0]} VIP`,
            createdAt: new Date().toISOString()
          };
          await db.collection('users').insertOne(newUser);
        }
      } else {
        // Fallback se o MongoDB ainda estiver desconectado
        passwordToEmail = generateRandomPassword();
      }

      // Disparar e-mail de boas-vindas com Login e Senha via Resend
      const appUrl = 'https://agenda-do-lucro-app.vercel.app';

      const emailResult = await sendWelcomeKiwifyEmail({
        name,
        email,
        password: passwordToEmail,
        appUrl,
        planLabel
      });

      console.log(`[Webhook Kiwify]: Acesso ${planLabel} liberado para ${email}. E-mail enviado: ${emailResult.success !== false}`);

      return res.status(200).json({
        success: true,
        message: `Acesso ${planLabel} liberado com sucesso`,
        user: { email, name, plan: detectedPlan, status: 'ativo' },
        emailSent: emailResult.success !== false
      });
    }

    // =======================================================================
    // 2. REEMBOLSO, CHARGEBACK OU CANCELAMENTO: BLOQUEAR ACESSO
    // =======================================================================
    const isRevoked = orderStatus === 'refunded' || 
                      orderStatus === 'chargedback' || 
                      orderStatus === 'canceled' || 
                      payload.event === 'subscription_canceled';

    if (isRevoked && isConnected) {
      await db.collection('users').updateOne(
        { email },
        { $set: { status: 'bloqueado', updatedAt: new Date().toISOString() } }
      );
      return res.status(200).json({ success: true, message: 'Acesso bloqueado por cancelamento/reembolso' });
    }

    return res.status(200).json({ success: true, message: `Evento ignorado (${orderStatus})` });
  } catch (error) {
    console.error('Erro no processamento do Webhook Kiwify:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
