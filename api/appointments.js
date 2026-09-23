import { connectToDatabase } from './lib/mongodb.js';
import { sendBookingNotificationEmail } from './lib/resend.js';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { db, isConnected } = await connectToDatabase();

  // =========================================================================
  // GET: Listar Agendamentos (Filtrado por Designer / Compradora)
  // =========================================================================
  if (req.method === 'GET') {
    if (!isConnected) {
      return res.status(200).json({ success: true, source: 'fallback', data: [] });
    }

    try {
      const userEmail = (req.query.userEmail || req.query.designerEmail || req.query.email || '').toLowerCase().trim();
      
      // Se não informou e-mail de filtro, retorna vazio para não replicar agendamentos entre contas
      if (!userEmail) {
        return res.status(200).json({ success: true, source: 'mongodb', data: [] });
      }

      const appointments = await db.collection('appointments')
        .find({ 
          $or: [
            { designerEmail: userEmail },
            { userEmail: userEmail }
          ] 
        })
        .sort({ createdAt: -1 })
        .toArray();

      return res.status(200).json({ success: true, source: 'mongodb', data: appointments });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // =========================================================================
  // POST: Criar Novo Agendamento & Disparar Notificação Resend
  // =========================================================================
  if (req.method === 'POST') {
    const apt = req.body || {};
    
    if (!apt.clientName || !apt.serviceName || !apt.timeStart) {
      return res.status(400).json({ success: false, error: 'Dados incompletos para agendamento' });
    }

    const targetEmail = (apt.designerEmail || apt.userEmail || '').toLowerCase().trim();

    const newAppointment = {
      ...apt,
      id: apt.id || 'apt-' + Date.now(),
      designerEmail: targetEmail,
      statusTag: apt.statusTag || 'Agendado Online',
      createdAt: new Date().toISOString()
    };

    let dbSaved = false;
    if (isConnected) {
      try {
        await db.collection('appointments').insertOne(newAppointment);
        dbSaved = true;
      } catch (err) {
        console.error('Erro ao salvar agendamento no MongoDB:', err.message);
      }
    }

    // Notificação por e-mail de agendamento desativada (usuário não precisa receber)
    return res.status(201).json({
      success: true,
      data: newAppointment,
      dbSaved,
      emailSent: false
    });
  }

  // =========================================================================
  // PUT: Atualizar Agendamento
  // =========================================================================
  if (req.method === 'PUT') {
    const { id, ...updates } = req.body || {};
    if (!id) return res.status(400).json({ success: false, error: 'ID necessário' });

    if (isConnected) {
      try {
        await db.collection('appointments').updateOne({ id }, { $set: updates });
        return res.status(200).json({ success: true, updated: id });
      } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
    }

    return res.status(200).json({ success: true, fallback: true, updated: id });
  }

  // =========================================================================
  // DELETE: Excluir Agendamento
  // =========================================================================
  if (req.method === 'DELETE') {
    const { id } = req.query || req.body || {};
    if (!id) return res.status(400).json({ success: false, error: 'ID necessário' });

    if (isConnected) {
      try {
        await db.collection('appointments').deleteOne({ id });
        return res.status(200).json({ success: true, deleted: id });
      } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
    }

    return res.status(200).json({ success: true, fallback: true, deleted: id });
  }

  return res.status(405).json({ success: false, error: 'Método não permitido' });
}
