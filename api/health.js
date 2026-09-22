import { connectToDatabase } from './lib/mongodb.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { isConnected, error: mongoError } = await connectToDatabase();
  const hasResend = Boolean(process.env.RESEND_API_KEY);
  const designerEmail = process.env.DESIGNER_EMAIL || 'nao_configurado';

  return res.status(200).json({
    app: 'Agenda do Lucro',
    status: 'online',
    version: '2.0.0-prod',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: {
        status: isConnected ? 'connected' : 'offline_fallback',
        error: mongoError || null
      },
      resend: {
        status: hasResend ? 'configured' : 'simulation_mode',
        designerEmail: designerEmail
      },
      hosting: 'Vercel Serverless'
    }
  });
}
