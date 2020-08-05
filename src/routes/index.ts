import { Router } from 'express';
import ClassesController from '../controllers/ClassesController';

const routes = Router();

const classesControllers = new ClassesController();

routes.get('/classes', classesControllers.index);
routes.post('/classes', classesControllers.create);

export default routes;
