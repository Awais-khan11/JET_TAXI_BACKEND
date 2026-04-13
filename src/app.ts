import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import emailRoutes from './routes/email.routes';

dotenv.config();

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use("/api", emailRoutes);

export default app;
