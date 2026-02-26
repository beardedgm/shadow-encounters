const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Monster = require('../models/Monster');
const monsters = require('./monsters.json');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Monster.deleteMany({});
    console.log('Cleared existing monsters');

    const inserted = await Monster.insertMany(monsters);
    console.log(`Seeded ${inserted.length} monsters`);

    await mongoose.connection.close();
    console.log('Done!');
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
