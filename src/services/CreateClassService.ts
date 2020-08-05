import { getRepository } from 'typeorm';
import Class from '../models/Class';
import User from '../models/User';

interface Request {
  subject: string;
  cost: number;
  user_id: User;
}

class CreateClassService {
  public async execute({ subject, cost, user_id }: Request): Promise<Class> {
    const classesRepository = getRepository(Class);

    const classObject = classesRepository.create({
      subject,
      cost,
      user_id,
    });

    await classesRepository.save(classObject);

    return classObject;
  }
}

export default CreateClassService;
