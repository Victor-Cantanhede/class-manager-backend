import { Request, Response, RequestHandler, NextFunction } from 'express';
import User from '../models/User';
import generateRegistration from '../functions/generateRegistration';
import passwordRules from '../services/rules/passowordRules';
import userNameRules from '../services/rules/userNameRules';
import bcrypt from 'bcrypt';


// Função de autenticação de usuário com tipagem explícita
export const authenticateUser: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userName, password } = req.body;

    // 📌 Valida se ambos os campos foram fornecidos
    if (!userName || !password) {
      res.status(400).json({ message: 'Username e password são obrigatórios!' });
      return;
    }

    // 📌 Verifica se o usuário existe
    const user = await User.findOne({ userName });

    if (!user) {
      res.status(401).json({ message: 'Usuário não encontrado!' });
      return;
    }

    // 📌 Verifica se a senha está correta
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Senha incorreta!' });
      return;
    }

    // Se tudo estiver certo, retorna uma resposta positiva
    res.status(200).json({ message: 'Autenticação bem-sucedida!', user });

  } catch (error) {
    next(error);
  }
};

// 🟢 Criar Usuário
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, tel, userName, password } = req.body;

    // 📌 Validação básica
    if (!name || !email || !tel || !userName || !password) {
      res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
      return;
    }

    // 📌 Verifica se já existe um usuário com o mesmo nome de usuário
    const existingUser = await User.findOne({ userName });

    if (existingUser) {
      res.status(400).json({ message: 'Nome de usuário já cadastrado, altere seu nome de usuário e tente novamente!' });
      return;
    }

    // 📌 Verifica se já existe um usuário com o mesmo email
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      res.status(400).json({ message: `O e-mail "${email}" já foi cadastrado por outro usuário! Volte para a tela de login e recupere seu usuário e senha.` });
      return;
    }

    // 📌 Verifica se já existe um usuário com o mesmo telefone
    const existingTel = await User.findOne({ tel });

    if (existingTel) {
      res.status(400).json({ message: `O número de telefone "${tel}" já foi cadastrado por outro usuário! Verifique seu telefone ou cadastre outro número.` });
      return;
    }

    // 📌 Validação de nome de usuário
    const validateUserNameRules = userNameRules(userName);

    if (validateUserNameRules !== true) {
      res.status(500).json({ message: 'Nome de usuário não atende aos critérios de cadastro', erro: validateUserNameRules });
      return;
    }

    // 📌 Validação de senha forte
    const validatePasswordRules = passwordRules(password);

    if (validatePasswordRules !== true) {
      res.status(500).json({ message: 'Senha não atende aos critérios de cadastro', erro: validatePasswordRules });
      return;
    }

    // 📌 Matrícula e perfil automáticos
    const { registration } = await generateRegistration();
    const userProfile = 'teacher';

    // 📌 Criação do usuário com senha hashada
    const newUser = new User({
      registration,
      name,
      email,
      tel,
      userProfile,
      userName,
      password
    });

    await newUser.save(); // Salva no banco
    res.status(201).json({ message: 'Usuário criado com sucesso!', user: newUser });

  } catch (error) {
    res.status(500).json({ message: `Erro ao criar usuário: ${(error as Error).message}`, error: (error as Error).message });
  }
};

// 🔵 Listar todos os Usuários
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários', error: (error as Error).message });
  }
};

// 🟡 Buscar Usuário por ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário', error: (error as Error).message });
  }
};

// 🟠 Atualizar Usuário
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Remove os campos que não podem ser alterados
    const { registration, email, userProfile, userName, ...updateData } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    res.status(200).json({ message: 'Usuário atualizado!', user: updatedUser });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário', error: (error as Error).message });
  }
};

// 🔴 Deletar Usuário
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    res.status(200).json({ message: 'Usuário deletado!' });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar usuário', error: (error as Error).message });
  }
};