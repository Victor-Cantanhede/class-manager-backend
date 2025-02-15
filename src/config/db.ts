import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    console.log('🔍 Lendo .env -> MONGO_URI:', process.env.MONGO_URI);
    
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`📦 Banco conectado: ${conn.connection.host}`);
    
  } catch (error) {
    console.error(`❌ Erro ao conectar: ${(error as Error).message}`);
    process.exit(1); // Encerra o servidor em caso de erro
  }
};

export default connectDB;