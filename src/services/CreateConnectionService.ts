import { getRepository } from 'typeorm';
import Connection from '../models/Connection';
import User from '../models/User';

interface Request {
  user_id: User;
}

class CreateConnectionService {
  public async execute({ user_id }: Request): Promise<Connection> {
    const connectionsRepository = getRepository(Connection);

    const connectionObject = connectionsRepository.create({
      user_id,
    });

    await connectionsRepository.save(connectionObject);

    return connectionObject;
  }
}

export default CreateConnectionService;
