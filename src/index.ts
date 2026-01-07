import express from "express";
import dotenv from "dotenv";
import router from "./routes";
import setupSequelize from "./connectionDb/sequilizeSetup";
import { initRedis } from "./redisServices/setup";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { decryptPayloadUse } from "./services/encryptResponseFunction";

dotenv.config();

const app = express();
const port = process.env.PORT ?? 8000;

app.disable("x-powered-by");

app.use(express.static(path.join(__dirname, "public")));

app.use(
  express.urlencoded({
    limit: "1gb",
    extended: true,
  })
);

app.use(cookieParser());

async function retrySetupSequelize(db: string, retries: number = 5, delay: number = 3000): Promise<void> {
  try {
    await setupSequelize(db);
  } catch (err) {
    console.log(`Error connecting to database ${db}:`, err);
    if (retries > 0) {
      console.log(`Retrying connection in ${delay / 1000} seconds...`);
      setTimeout(() => retrySetupSequelize(db, retries - 1, delay), delay);
    } else {
      console.log(`Failed to connect to ${db} after multiple attempts`);
    }
  }
}

app.listen(port, () => {
  const isRedisEnabled = process.env.IS_REDIS_ENABLE === 'true';
  isRedisEnabled && initRedis();
  const dbName = process.env.DB_NAME?.split(',') || [];
  dbName.forEach((db) => {
    retrySetupSequelize(db)
  });
});

const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || [], // Replace with your trusted domains
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow only specific HTTP methods
  allowedHeaders: ["Content-Type", "Authorization", "authorization", "cancelKey", "deniedcancle"], // Specify allowed headers
  credentials: true, // Allow cookies or credentials if needed
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(decryptPayloadUse)

app.use('/api/v1/node', router);

export default app;
