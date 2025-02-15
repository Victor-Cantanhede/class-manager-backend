import nodemailer from 'nodemailer';


// Constante com as credenciais do serviço de e-mail
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Domínio de e-mail do Class Manager
  auth: {
    user: process.env.EMAIL_USER, // E-mail do Class Manager
    pass: process.env.EMAIL_PASS, // Senha do Class Manager
  },
});

// Função que envia o e-mail com o código
export const sendVerificationEmail = async (email: string, code: string) => {
  try {
    // Envia o e-mail com o código de verificação
    await transporter.sendMail({
      from: '"Login Class Manager" <loginclassmanager@gmail.com>', // Quem está enviando
      to: email, // Para quem vai o e-mail
      subject: 'Seu Código de Verificação', // Assunto
      text: `Seu código de verificação é: ${code}`, // O código no corpo do e-mail
    });

    console.log(`Código de verificação enviado para: ${email}`);
    
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw new Error('Erro ao enviar e-mail');
  }
};