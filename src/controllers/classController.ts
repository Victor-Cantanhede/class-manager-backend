import { Request, Response } from 'express';
import { Class } from '../models/Class';
import { Student, IStudent } from '../models/Student';
import { Instructor } from '../models/Instructor';
import User from '../models/User';
import mongoose from 'mongoose';
import generateClassCode from '../functions/generateClassCode';


// Criar uma turma
export const createClass = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, course, modality, students, startDate, endDate, instructor } = req.body;

        // 📌 Validação básica (dados obrigatórios)
        if (!userId || !course || !modality || !startDate || !endDate) {
            res.status(400).json({ message: 'Ainda há campos a serem preenchidos!' });
            return;
        }

        // 📌 Verifica se o usuário que está cadastrando a turma é válido
        const existingUser = await User.findById(userId);

        if (!existingUser) {
            res.status(400).json({ message: 'Erro: Seu usuário não foi localizado em nossa base de dados!' });
            return;
        }

        // 📌 Verifica se o couse tem quantidade de caracteres válido
        const validCourse = /^.{1,80}$/.test(course);

        if (!validCourse) {
            res.status(400).json({ message: 'Quantidade de caracteres inválido!' });
            return;
        }

        // 📌 Verifica se modalidade é válida
        if (modality === 'presencial' || 'semi-presencial' || 'ead') {
            res.status(400).json({ message: 'Modalidade inválida!' });
            return;
        }

        // 📌 Verifica se todos os alunos existem no banco
        const existingAllStudents = await Promise.all(            
            students.map(async (student: IStudent): Promise<boolean> => {

                const existingStudent = await Student.findOne({ 
                    registration: student.registration,
                    linkedTo: userId
                });
                return !!existingStudent;
            })
        );

        // 📌 Caso o usuário tenha incluído alunos no cadastramento da turma, verifica se os alunos informados existem no banco
        if (students.length > 0 && existingAllStudents.includes(false)) {
            res.status(400).json({ message: 'Erro: Alguns alunos informados não estão cadastrados no sistema!' });
            return;
        }

        // 📌 Verifica se o instrutor foi informado e se é vinculado ao usuário no banco
        if (instructor) {
            const existingInstructor = await Instructor.findOne({
                registration: instructor.registration,
                linkedTo: userId
            });

            if (!existingInstructor) {
                res.status(400).json({ message: 'Erro: Instrutor informado não cadastrado no sistema!' });
                return;
            }
        }

        // 📌 Criação da nova turma
        const newClass = new Class({
            code: generateClassCode(),
            course,
            modality,
            students,
            startDate,
            endDate,
            instructor,
            linkedTo: userId // Vinculando turma ao usuário
        });

        await newClass.save(); // Salva no banco
        res.status(201).json({ message: 'Turma cadastrada com sucesso!', student: newClass });

    } catch (error) {
        res.status(400).json({ message: `Erro ao cadastrar turma: ${(error as Error).message}`, error: (error as Error).message });
    }
}

// Buscar por todas as turmas
export const getClasses = async (req: Request, res: Response): Promise<void> => {
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

        // 📌 Busca apenas as turmas vinculadas ao userId
        const classes = await Class.find({ linkedTo: userId }); 

        if (classes.length === 0) {
            res.status(400).json({ message: 'Não existe turma vinculada a este usuário!' });
            return;
        }

        res.status(200).json(classes);

    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar turmas!', error });
    }
}

// Buscar turma por ID
