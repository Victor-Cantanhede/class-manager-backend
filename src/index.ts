import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';


dotenv.config();
connectDB(); // Conecta com o banco de dados

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes); // Rota de usuários

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('🚀 Class Manager Backend Conectado ao MongoDB!');
});

app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});