import express from "express";
import morgan from "morgan";
import { configDotenv } from "dotenv";
import adminRoutes from "./app/routers/admin.js"
import vendorRoutes from "./app/routers/vendor.js"
import memberRoutes from "./app/routers/member.js"
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";

const app = express();
configDotenv();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ✅ Get __dirname manually (ESM workaround)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ✅ Serve static files from "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors({
  origin: ["https://crmgcc.net", "https://www.crmgcc.net"],
  credentials: true
}));

//Routes
app.use("/api/admin",adminRoutes)
app.use("/api/member",memberRoutes)
app.use("/api/vendor",vendorRoutes)

const port = process.env.PORT || 8000;
app.listen(port, (req, res) => {
  console.log(`Server is running at ${port}`);
});