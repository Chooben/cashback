import express from 'express'
import cors from 'cors'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url';
import cardRoutes from './routes/cardRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import cashbackRoutes from './routes/cashbackRoutes.js'

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json())


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
})

// Routes
app.use('/card', cardRoutes);
app.use('/category', categoryRoutes);
app.use('/cashback', cashbackRoutes);
app.use('/api', cardRoutes, categoryRoutes, cashbackRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})