import { connectToDatabase } from './lib/mongodb.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { db, isConnected } = await connectToDatabase();

  // =========================================================================
  // GET: Listar Clientes (Filtrado por Designer / Compradora)
  // =========================================================================
  if (req.method === 'GET') {
    if (!isConnected) {
      return res.status(200).json({ success: true, source: 'fallback', data: [] });
    }

    try {
      const userEmail = (req.query.userEmail || req.query.designerEmail || req.query.email || '').toLowerCase().trim();
      
      // Se não informou e-mail de filtro, retorna lista vazia para garantir isolamento total
      if (!userEmail) {
        return res.status(200).json({ success: true, source: 'mongodb', data: [] });
      }

      const clients = await db.collection('clients')
        .find({
          $or: [
            { designerEmail: userEmail },
            { userEmail: userEmail }
          ]
        })
        .sort({ name: 1 })
        .toArray();

      return res.status(200).json({ success: true, source: 'mongodb', data: clients });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // =========================================================================
  // POST / PUT: Cadastrar ou Atualizar Cliente
  // =========================================================================
  if (req.method === 'POST' || req.method === 'PUT') {
    const client = req.body || {};
    if (!client.name) {
      return res.status(400).json({ success: false, error: 'Nome do cliente obrigatório' });
    }

    const clientId = client.id || 'cli-' + Date.now();
    const designerEmail = (client.designerEmail || client.userEmail || '').toLowerCase().trim();

    const clientRecord = {
      ...client,
      id: clientId,
      designerEmail: designerEmail,
      updatedAt: new Date().toISOString()
    };

    if (isConnected) {
      try {
        await db.collection('clients').updateOne(
          { id: clientId },
          { $set: clientRecord },
          { upsert: true }
        );
        return res.status(200).json({ success: true, data: clientRecord, source: 'mongodb' });
      } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
    }

    return res.status(200).json({ success: true, data: clientRecord, source: 'fallback' });
  }

  // =========================================================================
  // DELETE: Excluir Cliente
  // =========================================================================
  if (req.method === 'DELETE') {
    const { id } = req.query || req.body || {};
    if (!id) return res.status(400).json({ success: false, error: 'ID necessário' });

    if (isConnected) {
      try {
        await db.collection('clients').deleteOne({ id });
        return res.status(200).json({ success: true, deleted: id });
      } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
    }

    return res.status(200).json({ success: true, fallback: true, deleted: id });
  }

  return res.status(405).json({ success: false, error: 'Método não permitido' });
}
