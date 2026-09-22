import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Agenda do Lucro <onboarding@resend.dev>';
const DESIGNER_EMAIL = process.env.DESIGNER_EMAIL || 'contato@agendadolucro.com.br';

/**
 * Dispara e-mail de notificação de novo agendamento para a Designer
 */
export async function sendBookingNotificationEmail({
  clientName,
  clientPhone,
  serviceName,
  price,
  dateText,
  timeStart
}) {
  const priceFormatted = Number(price).toFixed(2).replace('.', ',');
  const cleanPhone = (clientPhone || '').replace(/\D/g, '');
  const waLink = `https://wa.me/55${cleanPhone}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FDF2F8; margin: 0; padding: 24px; }
        .card { max-width: 540px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(124, 58, 237, 0.1); border: 1px solid #FBCFE8; }
        .header { background: linear-gradient(135deg, #9333EA 0%, #7E22CE 100%); padding: 24px 20px; text-align: center; color: #FFFFFF; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 4px 0 0; font-size: 13px; color: #FDF4FF; }
        .content { padding: 24px; }
        .badge { display: inline-block; background: #FEF08A; color: #854D0E; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; margin-bottom: 14px; text-transform: uppercase; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F3F4F6; font-size: 13px; }
        .detail-label { color: #6B7280; font-weight: 600; }
        .detail-value { color: #111827; font-weight: 700; text-align: right; }
        .total-box { background: #FDF2F8; border-radius: 10px; padding: 14px; margin: 18px 0; display: flex; justify-content: space-between; align-items: center; }
        .total-box span { font-size: 13px; font-weight: 700; color: #4B5563; }
        .total-box strong { font-size: 18px; font-weight: 900; color: #9333EA; }
        .btn-wa { display: block; text-align: center; background: #25D366; color: #FFFFFF; text-decoration: none; padding: 12px; border-radius: 10px; font-weight: 800; font-size: 14px; margin-top: 16px; }
        .footer { text-align: center; font-size: 11px; color: #9CA3AF; padding: 16px; border-top: 1px solid #F3F4F6; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>AGENDA DO LUCRO</h1>
          <p>Novo Agendamento Confirmado no Portal VIP</p>
        </div>
        <div class="content">
          <div class="badge">🔔 Agendamento Online</div>
          <p style="font-size: 14px; color: #374151; margin-top: 0;">Olá, Designer! Uma cliente acabou de garantir um horário na sua agenda:</p>
          
          <div class="detail-row">
            <span class="detail-label">Cliente:</span>
            <span class="detail-value">${clientName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">WhatsApp:</span>
            <span class="detail-value">${clientPhone}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Procedimento:</span>
            <span class="detail-value">${serviceName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Data:</span>
            <span class="detail-value">${dateText}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Horário:</span>
            <span class="detail-value">${timeStart}</span>
          </div>

          <div class="total-box">
            <span>Valor a Receber no Estúdio:</span>
            <strong>R$ ${priceFormatted}</strong>
          </div>

          <a href="${waLink}" class="btn-wa" target="_blank">
            💬 Falar com a Cliente no WhatsApp
          </a>
        </div>
        <div class="footer">
          Enviado automaticamente pelo <strong>Agenda do Lucro</strong> • Gestão & Faturamento VIP
        </div>
      </div>
    </body>
    </html>
  `;

  if (!resend) {
    console.log(`[Resend Simulado]: E-mail de novo agendamento para ${DESIGNER_EMAIL} (${clientName} - ${serviceName} às ${timeStart})`);
    return { success: true, simulated: true };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [DESIGNER_EMAIL],
      subject: `🔔 Novo Agendamento: ${clientName} - ${serviceName} (${timeStart})`,
      html: htmlContent
    });
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao enviar e-mail via Resend:', error.message);
    return { success: false, error: error.message };
  }
}
