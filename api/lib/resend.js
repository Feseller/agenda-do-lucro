import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Agenda do Lucro <onboarding@resend.dev>';
const FALLBACK_ADMIN_EMAIL = process.env.DESIGNER_EMAIL || 'contato@agendadolucro.com.br';

/**
 * Notificação de agendamento por e-mail desativada (o usuário não deseja receber e-mails de agendamento)
 */
export async function sendBookingNotificationEmail() {
  return { success: true, disabled: true };
}

/**
 * Dispara e-mail de Boas-Vindas com Login e Senha para quem comprou na Kiwify
 */
export async function sendWelcomeKiwifyEmail({
  name,
  email,
  password,
  appUrl,
  planLabel = 'Plano Anual'
}) {
  const loginUrl = appUrl || 'https://agenda-do-lucro-app.vercel.app';
  const firstName = (name || 'Designer').split(' ')[0];
  const isMonthly = (planLabel || '').toLowerCase().includes('mensal');
  const accessDuration = isMonthly 
    ? '1 mês de acesso completo com renovação mensal' 
    : '1 ano completo de acesso ilimitado com suporte VIP';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF5FF; margin: 0; padding: 24px; }
        .card { max-width: 540px; margin: 0 auto; background: #FFFFFF; border-radius: 18px; overflow: hidden; box-shadow: 0 12px 30px rgba(107, 33, 168, 0.15); border: 1px solid #E9D5FF; }
        .header { background: linear-gradient(135deg, #7C3AED 0%, #6B21A8 50%, #4C1D95 100%); padding: 32px 20px; text-align: center; color: #FFFFFF; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 6px 0 0; font-size: 13px; color: #F3E8FF; }
        .content { padding: 28px 24px; }
        .badge { display: inline-block; background: #FEF08A; color: #854D0E; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 20px; margin-bottom: 16px; text-transform: uppercase; }
        .credentials-box { background: #F5EEFD; border: 1.5px solid #D8B4FE; border-radius: 12px; padding: 18px; margin: 20px 0; }
        .cred-item { margin-bottom: 10px; font-size: 14px; }
        .cred-item:last-child { margin-bottom: 0; }
        .cred-label { color: #6B21A8; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
        .cred-value { font-size: 16px; font-weight: 800; color: #1E1B4B; margin-top: 2px; word-break: break-all; }
        .btn-access { display: block; text-align: center; background: linear-gradient(135deg, #7C3AED 0%, #6B21A8 100%); color: #FFFFFF; text-decoration: none; padding: 14px; border-radius: 10px; font-weight: 800; font-size: 15px; margin: 24px 0 10px; box-shadow: 0 4px 14px rgba(107, 33, 168, 0.4); }
        .checklist { font-size: 13px; color: #4B5563; line-height: 1.6; margin: 18px 0; }
        .checklist li { margin-bottom: 6px; }
        .footer { text-align: center; font-size: 11px; color: #9CA3AF; padding: 20px; border-top: 1px solid #F3F4F6; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>💎 AGENDA DO LUCRO</h1>
          <p>Seu Acesso VIP foi Liberado com Sucesso!</p>
        </div>
        <div class="content">
          <div class="badge">⚡ Assinatura ${planLabel} Confirmada via Kiwify</div>
          <h2 style="font-size: 18px; color: #111827; margin: 0 0 10px;">Parabéns, ${firstName}! 🎉</h2>
          <p style="font-size: 14px; color: #4B5563; margin: 0 0 16px; line-height: 1.5;">
            Sua assinatura do <strong>${planLabel} da Agenda do Lucro</strong> foi confirmada com sucesso! Você tem ${accessDuration} para transformar a gestão e os lucros do seu estúdio.
          </p>

          <div class="credentials-box">
            <div class="cred-item">
              <div class="cred-label">Link de Acesso:</div>
              <div class="cred-value"><a href="${loginUrl}" style="color: #6B21A8; text-decoration: underline;">${loginUrl}</a></div>
            </div>
            <div class="cred-item">
              <div class="cred-label">Seu Login:</div>
              <div class="cred-value">${email}</div>
            </div>
            <div class="cred-item">
              <div class="cred-label">Sua Senha Provisória:</div>
              <div class="cred-value" style="font-family: monospace; letter-spacing: 1px; color: #6B21A8;">${password}</div>
            </div>
          </div>

          <a href="${loginUrl}" class="btn-access" target="_blank">
            👉 ACESSAR MINHA AGENDA AGORA
          </a>

          <div class="checklist">
            <strong>O que fazer nos seus primeiros 5 minutos:</strong>
            <ul style="padding-left: 20px; margin-top: 8px;">
              <li>Entre no link com o seu e-mail e a senha acima;</li>
              <li>Acesse <strong>"Sua Página & Link Online"</strong> para conferir seus procedimentos e preços;</li>
              <li>Envie o seu link VIP para as suas clientes agendarem sozinhas!</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          Precisa de suporte? Responda este e-mail.<br>
          © 2026 <strong>Agenda do Lucro</strong> • Gestão Inteligente para Designers de Sucesso
        </div>
      </div>
    </body>
    </html>
  `;

  if (!resend) {
    console.log(`[Resend Simulado]: E-mail de Boas-Vindas Kiwify para ${email} (Senha: ${password})`);
    return { success: true, simulated: true };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: `💎 Seu Acesso VIP ao Agenda do Lucro está Liberado! (Login e Senha)`,
      html: htmlContent
    });
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao enviar boas-vindas via Resend:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Dispara e-mail de recuperação de senha
 */
export async function sendPasswordResetEmail({
  name,
  email,
  newPassword,
  appUrl
}) {
  const loginUrl = appUrl || 'https://agenda-do-lucro.vercel.app';
  const htmlContent = `
    <div style="font-family: sans-serif; padding: 20px; background: #FAF5FF; color: #1F2937;">
      <div style="max-width: 500px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 12px; border: 1px solid #E9D5FF;">
        <h2 style="color: #6B21A8; margin-top: 0;">Recuperação de Senha — Agenda do Lucro</h2>
        <p>Olá, ${name || 'Designer'}! Uma nova senha temporária foi gerada para o seu acesso:</p>
        <div style="background: #F3E8FF; padding: 14px; border-radius: 8px; font-size: 18px; font-weight: bold; font-family: monospace; color: #581C87; text-align: center; margin: 16px 0;">
          ${newPassword}
        </div>
        <p>Acesse <a href="${loginUrl}">${loginUrl}</a> e entre com sua nova senha.</p>
      </div>
    </div>
  `;

  if (!resend) return { success: true, simulated: true };

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: `🔑 Sua Nova Senha — Agenda do Lucro`,
      html: htmlContent
    });
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
