import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';

import User from '../models/User';
import CreateConnectionService from '../services/CreateConnectionService';
import Connection from '../models/Connection';

interface RequestCreateConnection {
  user_id: string;
}

export default class ConnectionsController {
  async index(request: Request, response: Response) {
    const connectionsRepository = getRepository(Connection);

    const total = await getConnection()
      .createQueryBuilder()
      .from(Connection, 'c')
      .getCount();

    return response.json({ total });
  }

  async create(request: Request, response: Response) {
    const { user_id }: RequestCreateConnection = request.body;

    try {
      const usersRepository = getRepository(User);

      const user = (await usersRepository.findOne({
        where: {
          id: user_id,
        },
      })) as User;

      const createConnection = new CreateConnectionService();

      await createConnection.execute({
        user_id: user,
      });

      return response.status(201).send();
    } catch (err) {
      return response.status(400).json({
        error: 'Unexpected error while creating new connection',
      });
    }
  }
}
