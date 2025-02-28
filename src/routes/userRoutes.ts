import { Router, Request, Response, RequestHandler, NextFunction } from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, authenticateUser, requestEmailVerification, verifyEmailCode } from '../controllers/userController';


const router = Router();


// Rota para criar usuário
const postHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    await createUser(req, res); // Apenas aguarda a execução da função do controller
    
  } catch (error) {

    console.error('Erro ao criar o usuário', error);
    res.status(500).json({ message: 'Erro ao criar o usuário' });
  }
};

// Rota para buscar usuários
const getHandlerAll: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    await getAllUsers(req, res);

  } catch (error) {

    console.error('Erro ao obter os usuários', error);
    res.status(500).json({ message: 'Erro ao obter os usuários' });
  }
};

// Rota para buscar um usuário
const getHandlerById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    await getUserById(req, res);

  } catch (error) {

    console.error('Erro ao obter o usuário', error);
    res.status(500).json({ message: 'Erro ao obter o usuário' });
  }
};

// Rota para atualizar usuário
const putHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    await updateUser(req, res);

  } catch (error) {

    console.error('Erro ao atualizar o usuário', error);
    res.status(500).json({ message: 'Erro ao atualizar o usuário' });
  }
};

// Rota para deletar usuário
const deleteHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    await deleteUser(req, res);

  } catch (error) {

    console.error('Erro ao deletar o usuário', error);
    res.status(500).json({ message: 'Erro ao deletar o usuário' });
  }
};

// Rota de autenticação de login
const postLoginHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await authenticateUser(req, res, next);

  } catch (error) {
    console.error('Erro ao autenticar usuário', error);
    res.status(500).json({ message: 'Erro ao autenticar usuário' });
  }
};

// Rotas para funções CRUD
router.post('/', postHandler);
router.get('/', getHandlerAll);
router.get('/:id', getHandlerById);
router.put('/:id', putHandler);
router.delete('/:id', deleteHandler);

// Rota de login
router.post('/login', postLoginHandler);

// Rota de verificação de email
router.post('/request-email-verification', requestEmailVerification); // Envia código
router.post('/verify-email-code', verifyEmailCode); // Solicita código


export default router;