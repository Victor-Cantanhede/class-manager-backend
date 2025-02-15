import { Router, Request, Response, RequestHandler } from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';


const router = Router();

// Definindo o tipo RequestHandler
const postHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    await createUser(req, res); // Apenas aguarda a execução da função do controller
    
  } catch (error) {

    console.error('Erro ao criar o usuário', error);
    res.status(500).json({ message: 'Erro ao criar o usuário' });
  }
};

const getHandlerAll: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    await getAllUsers(req, res);

  } catch (error) {

    console.error('Erro ao obter os usuários', error);
    res.status(500).json({ message: 'Erro ao obter os usuários' });
  }
};

const getHandlerById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    await getUserById(req, res);

  } catch (error) {

    console.error('Erro ao obter o usuário', error);
    res.status(500).json({ message: 'Erro ao obter o usuário' });
  }
};

const putHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    await updateUser(req, res);

  } catch (error) {

    console.error('Erro ao atualizar o usuário', error);
    res.status(500).json({ message: 'Erro ao atualizar o usuário' });
  }
};

const deleteHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    await deleteUser(req, res);

  } catch (error) {

    console.error('Erro ao deletar o usuário', error);
    res.status(500).json({ message: 'Erro ao deletar o usuário' });
  }
};

// Agora associamos as rotas às funções
router.post('/', postHandler);
router.get('/', getHandlerAll);
router.get('/:id', getHandlerById);
router.put('/:id', putHandler);
router.delete('/:id', deleteHandler);


export default router;