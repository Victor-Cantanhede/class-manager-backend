import User from '../models/User';


// Função para gerar matrícula sequencial em formato de string com 6 dígitos
const generateRegistration = async (): Promise<{ registration: string }> => {
  const lastUser = await User.findOne()
    .sort({ registration: -1 })
    .select('registration');

  const lastNumber = lastUser ? parseInt(lastUser.registration) : 0;
  const nextNumber = lastNumber + 1;
  const registration = nextNumber.toString().padStart(6, '0');

  return { registration };
};

export default generateRegistration;