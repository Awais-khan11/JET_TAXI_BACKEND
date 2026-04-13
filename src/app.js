const express = require('express');
const emailRoutes = require('./routes/email.routes');
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors')



const app = express();
const corsOptions = {
  origin: ["http://localhost:5173"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, 
};
app.use(express.json());
app.use(cors(corsOptions))




app.use("/api",emailRoutes);

module.exports = app;