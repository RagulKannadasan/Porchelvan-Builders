const fs = require('fs');
const path = require('path');
const sql = require('./db');

async function init() {
  try {
    console.log("Reading schema.sql...");
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    console.log("Executing schema...");
    await sql.unsafe(schema);
    console.log("DATABASE TABLES INITIALIZED SUCCESSFULLY IN SUPABASE!");
    process.exit(0);
  } catch (err) {
    console.error("FAILED TO INITIALIZE DATABASE:", err);
    process.exit(1);
  }
}

init();
