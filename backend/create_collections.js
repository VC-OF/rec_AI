const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'recruitment';

const collections = [
  'users',
  'skill_matrix',
  'resumes',
  'notifications',
  'job_applications',
  'jobs',
  'interviews',
  'company_details',
  'candidates',
  'audit_logs'
];

async function createCollections() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    const db = client.db(dbName);

    // Get existing collections to avoid errors if they already exist
    const existingCollections = await db.listCollections().toArray();
    const existingCollectionNames = existingCollections.map(c => c.name);

    for (const collectionName of collections) {
      if (existingCollectionNames.includes(collectionName)) {
        console.log(`Collection '${collectionName}' already exists.`);
      } else {
        await db.createCollection(collectionName);
        console.log(`Created collection '${collectionName}'`);
      }
    }
    
    console.log('Finished creating all required collections.');
  } catch (err) {
    console.error('Error creating collections:', err);
  } finally {
    await client.close();
  }
}

createCollections();
