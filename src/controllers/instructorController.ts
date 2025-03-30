import { Request, Response } from 'express';
import { Instructor } from '../models/Instructor';
import { Class } from '../models/Class';
import User from '../models/User';
import mongoose from 'mongoose';


// Criar um instrutor
export const createInstructor = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, registration, cpf, name, email, tel, specialization } = req.body;

        // 📌 Validação básica (dados obrigatórios)
        if (!userId || !registration || !cpf || !name || !email || !tel || !specialization) {
            res.status(400).json({ message: 'Ainda há campos a serem preenchidos!' });
            return;
        }

        // 📌 Verifica se o usuário que está cadastrando o instrutor é válido
        const existingUser = await User.findById(userId);

        if (!existingUser) {
            res.status(400).json({ message: 'Erro: Seu usuário não foi localizado em nossa base de dados!' });
            return;
        }

        // 📌 Verifica se o CPF possui caracteres válidos
        const validCpf = /^[0-9]{11}$/.test(cpf);

        if (!validCpf) {
            res.status(400).json({ message: 'Erro: CPF inválido! O CPF deve conter 11 dígitos númericos.' });
            return;
        }

        // 📌 Verifica se o nome do instrutor possui caracteres válidos
        const validName = /^[A-Za-zÀ-ÿ\s]{1,100}$/.test(name);

        if (!validName) {
            res.status(400).json({ message: 'Erro: Nome inválido!' });
            return;
        }

        // 📌 Verifica se o telefone possui caracteres válidos
        const validTel = /^[0-9]{15}$/.test(tel);

        if (!validTel) {
            res.status(400).json({ message: 'Erro: Telefone inválido!' });
            return;
        }

        // 📌 Verifica se o e-mail é válido
        const isValidEmail = (email: string): boolean => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return email.length <= 50 && emailRegex.test(email);
        };

        if (!isValidEmail(email)) {
            res.status(400).json({ message: 'E-mail inválido!' });
            return;
        }
        
        // 📌 Verifica se matrícula possui caracteres válidos
        const validRegistration = /^[A-Za-z0-9]{1,30}$/.test(registration);

        if (!validRegistration) {
            res.status(400).json({ message: 'Erro: Matrícula inválida! A matrícula não deve conter caracteres especiais, acentuados ou espaços em branco.' });
            return;
        }

        // 📌 Verifica se já existe um instrutor com a mesma matrícula
        const existingRegistration = await Instructor.findOne({ registration });

        if (existingRegistration) {
            res.status(400).json({ message: 'Já existe um instrutor cadastrado com esta matrícula!' });
            return;
        }

        // 📌 Criação do novo instrutor
        const newInstructor = new Instructor({
            registration,
            cpf,
            name,
            email,
            tel,
            specialization,
            linkedTo: userId // Vinculando novo instrutor ao usuário
        });

        await newInstructor.save(); // Salva no banco
        res.status(201).json({ message: 'Instrutor cadastrado com sucesso!', student: newInstructor });

    } catch (error) {
        res.status(400).json({ message: `Erro ao cadastrar instrutor: ${(error as Error).message}`, error: (error as Error).message });
    }
}

// Buscar todos os instrutores
export const getInstructors = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.query; // Pegamos o userId da query string

        // 📌 Validação: useId foi passado via frontend
        if (!userId) {
            res.status(400).json({ message: 'ID do usuário é obrigatório!' });
            return;
        }

        // 📌 Verifica se o usuário existe no banco de dados
        const existingUser = await User.findById(userId);

        if (!existingUser) {
            res.status(400).json({ message: 'Usuário não encontrado!' });
            return;
        }

        // 📌 Busca apenas os instrutores vinculados ao userId
        const instructors = await Instructor.find({ linkedTo: userId });

        if (instructors.length === 0) {
            res.status(400).json({ message: 'Não existem instrutores vinculados a este usuário!' });
            return;
        }

        res.status(200).json(instructors);

    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar instrutores!', error });
    }
}

// Buscar instrutor por ID
export const getInstructorById = async (req: Request, res: Response): Promise<void> => {
    return; // TESTE
    try {
        const instructor = await Instructor.findById(req.params.id);
        
        if (!instructor) {
            res.status(404).json({ message: 'Instrutor não encontrado!' });
            return;
        }

        res.status(200).json(instructor);

    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar instrutor!', error });
    }
}

// Atualizar um instrutor
export const updateInstructor = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.body;
        const { id } = req.params;

        // 📌 Validação: userId foi informado?
        if (!userId) {
            res.status(400).json({ message: 'O ID do usuário é obrigatório!' });
            return;
        }

        // 📌 Verifica se o usuário existe no banco de dados
        const existingUser = await User.findById(userId);

        if (!existingUser) {
            res.status(404).json({ message: 'Usuário não encontrado!' });
            return;
        }

        // 📌 Verifica se o instrutor existe e está vinculado ao userId
        const instructor = await Instructor.findOne({ _id: id, linkedTo: userId });

        if (!instructor) {
            res.status(403).json({ message: 'Acesso negado! Você só pode atualizar instrutores vinculados a você.' });
            return;
        }

        // 📌 Atualiza o instrutor
        const updatedInstructor = await Instructor.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedInstructor) {
            res.status(404).json({ message: 'Instrutor não encontrado!' });
            return;
        }

        res.status(200).json({ message: 'Instrutor atualizado com sucesso!', updatedInstructor });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar instrutor!', error });
    }
}

// Deletar um instrutor
export const deleteInstructor = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.body;
        const { id } = req.params;

        // 📌 Validação: userId foi informado?
        if (!userId) {
            res.status(400).json({ message: 'O ID do usuário é obrigatório!' });
            return;
        }

        // 📌 Verifica se o usuário existe no banco de dados
        const existingUser = await User.findById(userId);

        if (!existingUser) {
            res.status(404).json({ message: 'Usuário não encontrado!' });
            return;
        }

        // 📌 Verifica se o instrutor existe e está vinculado ao userId
        const instructor = await Instructor.findOne({ _id: id, linkedTo: userId });

        if (!instructor) {
            res.status(403).json({ message: 'Acesso negado! Você só pode excluir instrutores vinculados a você.' });
            return;
        }

        // 📌 Deletando instrutor
        const deletedInstructor = await Instructor.findByIdAndDelete(id);

        if (!deletedInstructor) {
            res.status(404).json({ message: 'Instrutor não encontrado!' });
            return;
        }

        // Remove o instrutor de todas as turmas em que ele estiver cadastrado
        await Class.updateMany(
            { students: new mongoose.Types.ObjectId(id) },
            { $pull: { instructors: new mongoose.Types.ObjectId(id) } }
        );

        res.status(200).json({ message: 'Instrutor excluído com sucesso!' });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir instrutor!', error });
    }
}