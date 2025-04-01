import { Request, Response } from 'express';
import { Student } from '../models/Student';
import { Class } from '../models/Class';
import User from '../models/User';
import mongoose from 'mongoose';


// 🟢 Criar um aluno
export const createStudent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, registration, cpf, name, email, tel } = req.body;

        // 📌 Validação básica (dados obrigatórios)
        if (!userId || !registration || !cpf || !name || !email || !tel) {
            res.status(400).json({ message: 'Ainda há campos a serem preenchidos!' });
            return;
        }

        // 📌 Verifica se o usuário que está cadastrando o aluno é válido
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

        // 📌 Verifica se o nome do aluno possui caracteres válidos
        const validName = /^[A-Za-zÀ-ÿ\s]{1,100}$/.test(name);

        if (!validName) {
            res.status(400).json({ message: 'Erro: Nome inválido!' });
            return;
        }

        // 📌 Verifica se o telefone possui caracteres válidos
        const validTel = /^[0-9]{11}$/.test(tel);

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
        
        // 📌 Verifica se já existe um aluno com a mesma matrícula
        const existingRegistration = await Student.findOne({ registration });

        if (existingRegistration) {
            res.status(400).json({ message: 'Já existe um aluno cadastrado com esta matrícula!' });
            return;
        }

        // 📌 Criação do novo aluno
        const newStudent = new Student({
            registration,
            cpf,
            name,
            email,
            tel,
            linkedTo: userId // Vinculando novo aluno ao usuário
        });
        
        await newStudent.save(); // Salva no banco
        res.status(201).json({ message: 'Aluno cadastrado com sucesso!', student: newStudent });

    } catch (error) {
        res.status(400).json({ message: `Erro ao cadastrar aluno: ${(error as Error).message}`, error: (error as Error).message });
    }
}

// Buscar por todos os alunos
export const getStudents = async (req: Request, res: Response): Promise<void> => {
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

        // 📌 Busca apenas os alunos vinculados ao userId
        const students = await Student.find({ linkedTo: userId });

        if (students.length === 0) {
            res.status(400).json({ message: 'Não existe aluno vinculado a este usuário!' });
            return;
        }

        res.status(200).json(students);

    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar alunos!', error });
    }
}

// Buscar aluno por ID
export const getStudentById = async (req: Request, res: Response): Promise<void> => {
    return; // TESTE
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            res.status(404).json({ message: 'Aluno não encontrado!' });
            return;
        }

        res.status(200).json(student);

    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar aluno!', error });
    }
}

// Atualizar um aluno
export const updateStudent = async (req: Request, res: Response): Promise<void> => {
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

        // 📌 Verifica se o aluno existe e está vinculado ao userId
        const student = await Student.findOne({ _id: id, linkedTo: userId });

        if (!student) {
            res.status(403).json({ message: 'Acesso negado! Você só pode atualizar alunos vinculados a você.' });
            return;
        }

        // 📌 Atualiza o aluno
        const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedStudent) {
            res.status(404).json({ message: 'Aluno não encontrado!' });
            return;
        }

        res.status(200).json({ message: 'Aluno atualizado com sucesso!', updatedStudent });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar aluno!', error });
    }
}

// Deletar um aluno
export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
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

        // 📌 Verifica se o aluno existe e está vinculado ao userId
        const student = await Student.findOne({ _id: id, linkedTo: userId });

        if (!student) {
            res.status(403).json({ message: 'Acesso negado! Você só pode excluir alunos vinculados a você.' });
            return;
        }

        // 📌 Deletando aluno
        const deletedStudent = await Student.findByIdAndDelete(id);

        if (!deletedStudent) {
            res.status(404).json({ message: 'Aluno não encontrado!' });
            return;
        }

        // Remove o aluno de todas as turmas em que ele estiver cadastrado
        await Class.updateMany(
            { students: new mongoose.Types.ObjectId(id) },
            { $pull: { students: new mongoose.Types.ObjectId(id) } }
        );

        res.status(200).json({ message: 'Aluno excluído com sucesso!' });
        
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir aluno!', error });
    }
}