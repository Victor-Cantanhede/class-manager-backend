import express from 'express';
import { createStudent, getStudents, getStudentById, updateStudent, deleteStudent } from '../controllers/studentController';


const router = express.Router();

// 🔹 Criar um aluno
router.post('/', createStudent);

// 🔹 Buscar todos os alunos
router.get('/', getStudents);

// 🔹 Buscar um aluno pelo ID
router.get('/:id', getStudentById);

// 🔹 Atualizar um aluno
router.put('/:id', updateStudent);

// 🔹 Deletar um aluno
router.delete('/:id', deleteStudent);


export default router;