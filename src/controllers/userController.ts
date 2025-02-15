import { Request, Response } from 'express';
import User from '../models/User';
import generateRegistration from '../functions/generateRegistration';
import userNameRules from '../services/rules/userNameRules';
import passwordRules from '../services/rules/passowordRules';


// 🟢 Criar Usuário após verificação de e-mail
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, tel, userName, password } = req.body;

    // 📌 Validação básica
    if (!name || !email || !tel || !userName || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    // 📌 Validando regras do nome de usuário
    const validateUserNameRules = userNameRules(userName);

    if (validateUserNameRules === false) {
      return res.status(500).json({ message: 'Erro ao criar usuário', erro: 'O nome de usuário deve conter de 10 a 20 caractere' });
    }

    // 📌 Validação de senha forte
    const validatePasswordRules = passwordRules(password);

    if (validatePasswordRules !== true) {
      return res.status(500).json({ message: 'Erro ao criar usuário', erro: validatePasswordRules });
    }

    // 📌 Matrícula e perfil automáticos
    const { registration } = await generateRegistration();
    const userProfile = 'teacher';

    // 📌 Criação do usuário
    const newUser = new User({
      registration,
      name,
      email,
      tel,
      userProfile,
      userName,
      password,
    });

    await newUser.save(); // Salva no banco
    res.status(201).json({ message: 'Usuário criado com sucesso!', user: newUser });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário', error: (error as Error).message });
  }
};


// 🔵 Listar todos os Usuários
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários', error: (error as Error).message });
  }
};


// 🟡 Buscar Usuário por ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário', error: (error as Error).message });
  }
};


// 🟠 Atualizar Usuário
export const updateUser = async (req: Request, res: Response) => {
  try {
    // Remove os campos que não podem ser alterados
    const { registration, email, userProfile, userName, ...updateData } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({ message: 'Usuário atualizado!', user: updatedUser });

  } catch (error) {

    res.status(500).json({ message: 'Erro ao atualizar usuário', error: (error as Error).message });
  }
};


// 🔴 Deletar Usuário
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({ message: 'Usuário deletado!' });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar usuário', error: (error as Error).message });
  }
};