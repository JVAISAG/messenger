import { openDB } from 'idb';

let dbPromise;
const ensureDB = () => {
  if (typeof window === 'undefined') {
    throw new Error('Indexed db not available in the server');
  }

  dbPromise = openDB('PrivateKey', 1, {
    upgrade(db) {
      db.createObjectStore('keys');
    },
  });

  return dbPromise;
};

export const storePrivateKeys = async (privateKey, userId) => {
  try {
    const db = await ensureDB();
    await db.put('keys', privateKey, userId);
  } catch (error) {
    console.log('Private Key Error:', error);
  }
};

export async function getPrivateKey(userName) {
  try {
    const db = await ensureDB();
    const key = await db.get('keys', userName);

    if (!key) {
      throw new Error('No key Found');
    }

    return key;
  } catch (error) {
    console.log('Getting Private key Error:', error);
  }
}
