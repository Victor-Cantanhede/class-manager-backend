import express from 'express';
import { createClass, getClasses, getClassById, updateClass, deleteClass } from '../controllers/classController';


const router = express.Router();

// 🔹 Criar uma turma
router.post('/', createClass);

// 🔹 Buscar todas as turmas
router.get('/', getClasses);

// 🔹 Buscar uma turma pelo ID
router.get('/:id', getClassById);

// 🔹 Atualizar uma turma
router.put('/:id', updateClass);

// 🔹 Deletar uma turma
router.delete('/:id', deleteClass);


export default router;