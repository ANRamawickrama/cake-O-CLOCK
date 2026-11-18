/**
 * Sets or resets an owner login password.
 *
 * Passwords are stored as bcrypt hashes, so they cannot be read back — this
 * script writes a new one instead.
 *
 * Usage:
 *   npm run owner:reset-password
 *   npm run owner:reset-password -- amasharamawickrama@gmail.com
 *
 * When no email is passed, the script lists the owner accounts and asks which
 * one to update. The password can be typed interactively (hidden) or passed in
 * with the OWNER_PASSWORD environment variable.
 */
const readline = require('readline');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Owner = require('../models/Owner');

const ask = (question) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });

const askHidden = (question) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    // Hide the typed characters, the way a normal password prompt does.
    rl._writeToOutput = (text) => {
      if (text.includes(question)) rl.output.write(text);
      else rl.output.write('');
    };

    rl.question(question, (answer) => {
      rl.output.write('\n');
      rl.close();
      resolve(answer);
    });
  });

const validatePassword = (password) => {
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }
};

(async () => {
  const uri = process.env.MONGO_URI || process.env.mongo;

  if (!uri) {
    console.error('MongoDB connection string missing. Set MONGO_URI in backend/.env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB.\n');

  let email = (process.argv[2] || '').trim().toLowerCase();

  if (!email) {
    const owners = await Owner.find().sort({ email: 1 });

    if (owners.length === 0) {
      console.error('No owner accounts found. Register one at http://localhost:3000/login first.');
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log('Owner accounts:');
    owners.forEach((owner, index) => {
      console.log(`  ${index + 1}) ${owner.email}`);
    });

    const choice = await ask('\nWhich account should the password be reset for? (email): ');
    email = choice.toLowerCase();
  }

  const owner = await Owner.findOne({ email });

  if (!owner) {
    console.error(`No owner found with the email "${email}".`);
    await mongoose.disconnect();
    process.exit(1);
  }

  let password = process.env.OWNER_PASSWORD || '';

  if (!password) {
    password = await askHidden('New password (min 6 characters): ');
  }

  validatePassword(password);

  owner.password = await bcrypt.hash(password, 10);
  await owner.save();

  console.log(`\nPassword updated for ${owner.email}.`);
  console.log('You can now sign in at http://localhost:3000/login');

  await mongoose.disconnect();
  console.log('Done.');
})().catch((error) => {
  console.error('Password reset failed:', error.message);
  process.exit(1);
});