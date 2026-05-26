const sql = require('./db');

async function test() {
  try {
    const result = await sql`SELECT 1 + 1 AS sum`;
    console.log("SUCCESSFULLY CONNECTED TO SUPABASE POSTGRES!", result);
    process.exit(0);
  } catch (err) {
    console.error("CONNECTION FAILED:", err.message);
    process.exit(1);
  }
}

test();
