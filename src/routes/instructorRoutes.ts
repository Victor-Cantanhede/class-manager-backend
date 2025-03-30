import express from 'express';
import { createInstructor, getInstructors, getInstructorById, updateInstructor, deleteInstructor } from '../controllers/instructorController';


const router = express.Router();

// 🔹 Criar um instrutor
router.post('/', createInstructor);

// 🔹 Buscar todos os instrutores
router.get('/', getInstructors);

// 🔹 Buscar um instrutor pelo ID
router.get('/:id', getInstructorById);

// 🔹 Atualizar um instrutor
router.put('/:id', updateInstructor);

// 🔹 Deletar um instrutor
router.delete('/:id', deleteInstructor);


export default router;