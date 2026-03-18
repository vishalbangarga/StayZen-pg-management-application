const { db } = require('./config/firebase');

const seedPGs = async () => {
  const pgs = [
    {
      pg_name: 'Elite Living PG',
      location: 'Indiranagar, Bangalore',
      description: 'Premium PG with all amenities for working professionals.',
      contact_number: '+91 98765 43210',
      facilities: ['Wifi', 'AC', 'Food', 'Power Backup'],
      sharing_types: [1, 2],
      owner_id: 'dummy_owner_id',
      price: 8500,
      createdAt: new Date().toISOString()
    },
    {
      pg_name: 'Comfort Stay',
      location: 'Koramangala, Bangalore',
      description: 'Affordable and clean stay for students.',
      contact_number: '+91 88888 77777',
      facilities: ['Wifi', 'Laundry', 'Parking'],
      sharing_types: [2, 3],
      owner_id: 'dummy_owner_id',
      price: 6500,
      createdAt: new Date().toISOString()
    }
  ];

  for (const pg of pgs) {
    await db.collection('pgs').add(pg);
  }
  console.log('Dummy PGs seeded!');
};

seedPGs();
