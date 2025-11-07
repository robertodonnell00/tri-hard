import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import plansRouter from './routes/plans.js'; 

const app = express();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime(), env: process.env.NODE_ENV || 'dev' });
});

// mount plans routes
app.use('/api/plans', plansRouter);          

const PORT = process.env.PORT || 4000;
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('DB connection failed:', err?.message);
    app.listen(PORT, () => console.log(`API (degraded) on http://localhost:${PORT}`));
  });
