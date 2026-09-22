import { connectToDatabase } from '../lib/mongodb.js';
import { sendPasswordResetEmail } from '../lib/resend.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Apenas POST' });

  const { email } = req.body || {};
  if (!email) return res.status(400).json({ success: false, error: 'Informe seu e-mail' });

  const cleanEmail = email.toLowerCase().trim();
  const { db, isConnected } = await connectToDatabase();

  const newPassword = 'Lucro@' + Math.floor(1000 + Math.random() * 9000);

  if (isConnected) {
    try {
      const user = await db.collection('users').findOne({ email: cleanEmail });
      if (!user) {
        return res.status(404).json({ success: false, error: 'E-mail não encontrado no sistema' });
      }

      await db.collection('users').updateOne(
        { email: cleanEmail },
        { $set: { password: newPassword, updatedAt: new Date().toISOString() } }
      );

      await sendPasswordResetEmail({
        name: user.name,
        email: cleanEmail,
        newPassword
      });

      return res.status(200).json({ success: true, message: 'Nova senha enviada para o seu e-mail!' });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(200).json({ success: true, message: 'Instruções enviadas para o seu e-mail!' });
}
