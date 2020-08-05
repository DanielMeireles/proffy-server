import { Router } from 'express';

import converHourToMinutes from '../utils/convertHourToMinutes';

import CreateUserService from '../services/CreateUserService';
import CreateClassService from '../services/CreateClassService';
import CreateClassScheduleService from '../services/CreateClassScheduleService';

const routes = Router();

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

interface Request {
  name: string;
  avatar: string;
  whatsapp: string;
  bio: string;
  subject: string;
  cost: number;
  schedule: ScheduleItem[];
}

routes.post('/classes', async (request, response) => {
  const {
    name,
    avatar,
    whatsapp,
    bio,
    subject,
    cost,
    schedule,
  }: Request = request.body;

  try {
    const createUser = new CreateUserService();

    const userObject = await createUser.execute({
      name,
      avatar,
      whatsapp,
      bio,
    });

    const createClass = new CreateClassService();

    const classObject = await createClass.execute({
      subject,
      cost,
      user_id: userObject,
    });

    const createClassSchedule = new CreateClassScheduleService();

    schedule.map(async scheduleItem => {
      await createClassSchedule.execute({
        week_day: scheduleItem.week_day,
        from: converHourToMinutes(scheduleItem.from),
        to: converHourToMinutes(scheduleItem.to),
        class_id: classObject,
      });
    });

    return response.status(201).send();
  } catch (err) {
    return response.status(400).json({
      error: 'Unexpected error while creating new class',
    });
  }
});

export default routes;
