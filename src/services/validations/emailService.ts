import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


dotenv.config(); // Para carregar variáveis de ambiente

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Função para enviar código de verificação
export const sendVerificationEmail = async (email: string, code: string): Promise<void> => {
  
  // Configurando mensagem enviada ao e-mail do usuário
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'CÓDIGO DE VALIDAÇÃO - CLASS MANAGER',
    text: `Seu código de validação é ${code}, digite este código no campo solicitado pelo Class Manager!`
  };

  // Enviando mensagem
  await transporter.sendMail(mailOptions);
}