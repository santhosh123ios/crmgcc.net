import mysql2 from "mysql2";
import {configDotenv} from "dotenv";

configDotenv()

export const db = mysql2.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
  
  db.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL:", err);
    } else {
      console.log("Connected to MySQL");
    }
  });

//   // db.js
// import mysql2 from "mysql2";
// import { configDotenv } from "dotenv";

// configDotenv(); // Loads the .env file

// export const db = mysql2.createConnection({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to MySQL:", err);
//   } else {
//     console.log("✅ Connected to MySQL");
//   }
// });