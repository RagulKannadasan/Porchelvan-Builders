const postgres = require('postgres');

const connectionString = "postgresql://postgres.ppjnhmxrwgipzwvayhtm:uW1VipQ8jTkqyvLl@aws-0-ap-south-1.pooler.supabase.com:5432/postgres";
const sql = postgres(connectionString);

async function test() {
  try {
    const result = await sql`SELECT 1 + 1 AS sum`;
    console.log("SUCCESSFULLY CONNECTED TO SUPABASE POSTGRES POOLER ON 5432!", result);
    process.exit(0);
  } catch (err) {
    console.error("CONNECTION FAILED:", err);
    process.exit(1);
  }
}

test();
