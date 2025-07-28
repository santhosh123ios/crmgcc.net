import mysql2 from "mysql2";
import {configDotenv} from "dotenv";

configDotenv()

export const db = mysql2.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // Optional: 10s timeout for connections
  idleTimeout: 60000     // Optional: idle connections timeout
});

// Check if pool is working
db.getConnection((err, connection) => {
  if (err) {
    console.error("MySQL pool connection failed:", err);
  } else {
    console.log("MySQL pool connected.");
    connection.release(); // important: release it back to pool
  }
});