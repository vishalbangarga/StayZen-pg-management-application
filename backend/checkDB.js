const { db } = require('./config/firebase');

async function check() {
  console.log('Starting DB Check...');
  try {
    const snapshot = await db.collection('pgs').get();
    console.log('Snapshot received. Count:', snapshot.size);
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }
    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data().pg_name);
    });
  } catch (err) {
    console.error('Error getting documents', err);
  } finally {
    process.exit(0);
  }
}

check();
