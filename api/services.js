import { connectToDatabase } from './lib/mongodb.js';

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
  // GET: Listar Procedimentos do Catálogo
  // =========================================================================
  if (req.method === 'GET') {
    if (!isConnected) {
      return res.status(200).json({ success: true, source: 'fallback', data: DEFAULT_SERVICES });
    }

    try {
      let services = await db.collection('services').find({}).toArray();
      // Se a coleção estiver vazia no MongoDB, inicializar com o catálogo padrão
      if (!services || services.length === 0) {
        await db.collection('services').insertMany(DEFAULT_SERVICES);
        services = DEFAULT_SERVICES;
      }
      return res.status(200).json({ success: true, source: 'mongodb', data: services });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // =========================================================================
  // POST: Cadastrar Novo Procedimento
  // =========================================================================
  if (req.method === 'POST') {
    const srv = req.body || {};
    if (!srv.name || srv.price === undefined) {
      return res.status(400).json({ success: false, error: 'Nome e Preço são obrigatórios' });
    }

    const newService = {
      id: srv.id || 'srv-' + Date.now(),
      name: srv.name,
      price: parseFloat(srv.price),
      duration: parseInt(srv.duration, 10) || 60,
      category: srv.category || 'design',
      desc: srv.desc || 'Procedimento personalizado de estética e sobrancelhas.',
      img: srv.img || 'assets/banner-sobrancelha.jpg',
      createdAt: new Date().toISOString()
    };

    if (isConnected) {
      try {
        await db.collection('services').insertOne(newService);
        return res.status(201).json({ success: true, data: newService, source: 'mongodb' });
      } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
    }

    return res.status(201).json({ success: true, data: newService, source: 'fallback' });
  }

  // =========================================================================
  // PUT: Atualizar Procedimento
  // =========================================================================
  if (req.method === 'PUT') {
    const { id, ...updates } = req.body || {};
    if (!id) return res.status(400).json({ success: false, error: 'ID do serviço obrigatório' });

    if (updates.price !== undefined) updates.price = parseFloat(updates.price);
    if (updates.duration !== undefined) updates.duration = parseInt(updates.duration, 10);
    updates.updatedAt = new Date().toISOString();

    if (isConnected) {
      try {
        await db.collection('services').updateOne({ id }, { $set: updates }, { upsert: true });
        return res.status(200).json({ success: true, updated: id, source: 'mongodb' });
      } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
    }

    return res.status(200).json({ success: true, updated: id, source: 'fallback' });
  }

  // =========================================================================
  // DELETE: Remover Procedimento
  // =========================================================================
  if (req.method === 'DELETE') {
    const { id } = req.query || req.body || {};
    if (!id) return res.status(400).json({ success: false, error: 'ID do serviço obrigatório' });

    if (isConnected) {
      try {
        await db.collection('services').deleteOne({ id });
        return res.status(200).json({ success: true, deleted: id, source: 'mongodb' });
      } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
    }

    return res.status(200).json({ success: true, deleted: id, source: 'fallback' });
  }

  return res.status(405).json({ success: false, error: 'Método não permitido' });
}
