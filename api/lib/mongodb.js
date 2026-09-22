import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let cachedClient = null;
let cachedDb = null;

/**
 * Conexão com cache singleton para Vercel Serverless Functions
 */
export async function connectToDatabase() {
  if (!uri) {
    return { client: null, db: null, isConnected: false };
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb, isConnected: true };
  }

  try {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000
    });

    await client.connect();
    const db = client.db('agenda_do_lucro');

    cachedClient = client;
    cachedDb = db;

    return { client, db, isConnected: true };
  } catch (error) {
    console.warn('MongoDB Atlas indisponível ou não configurado:', error.message);
    return { client: null, db: null, isConnected: false, error: error.message };
  }
}
