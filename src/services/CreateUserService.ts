import { getRepository } from 'typeorm';
import User from '../models/User';

interface Request {
  name: string;
  avatar: string;
  whatsapp: string;
  bio: string;
}

class CreateUserService {
  public async execute({
    name,
    avatar,
    whatsapp,
    bio,
  }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const userObject = usersRepository.create({
      name,
      avatar,
      whatsapp,
      bio,
    });

    await usersRepository.save(userObject);

    return userObject;
  }
}

export default CreateUserService;
