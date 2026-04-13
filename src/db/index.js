// const { drizzle } = require("drizzle-orm/node-postgres");


// const { Pool } = require("pg");
// require("dotenv").config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// const db = drizzle(pool);

// module.exports = { db };
const { neon } = require("@neondatabase/serverless");
const { drizzle } = require("drizzle-orm/neon-http");
require("dotenv").config();

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql);

module.exports = { db };