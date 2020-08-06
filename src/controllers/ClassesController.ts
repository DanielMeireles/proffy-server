import { Request, Response } from 'express';
import { getConnection } from 'typeorm';

import converHourToMinutes from '../utils/convertHourToMinutes';

import CreateUserService from '../services/CreateUserService';
import CreateClassService from '../services/CreateClassService';
import CreateClassScheduleService from '../services/CreateClassScheduleService';
import Class from '../models/Class';
import User from '../models/User';
import ClassSchedule from '../models/ClassSchedule';

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

interface RequestCreateClass {
  name: string;
  avatar: string;
  whatsapp: string;
  bio: string;
  subject: string;
  cost: number;
  schedule: ScheduleItem[];
}

export default class ClassesController {
  async index(request: Request, response: Response) {
    const { week_day, subject, time } = request.query;

    if (!week_day || !subject || !time) {
      return response.status(400).json({
        error: 'Missing filters to search classes',
      });
    }

    const timeInMinutes = converHourToMinutes(time as string);

    const classes = await getConnection()
      .createQueryBuilder()
      .addSelect('u.id', 'user_id')
      .addSelect('u.name', 'name')
      .addSelect('u.avatar', 'avatar')
      .addSelect('u.whatsapp', 'whatsapp')
      .addSelect('u.bio', 'bio')
      .addSelect('c.subject', 'subject')
      .addSelect('c.id', 'class_id')
      .addSelect('c.cost', 'cost')
      .from(Class, 'c')
      .innerJoin(User, 'u', 'c.user_id = u.id')
      .innerJoin(ClassSchedule, 'cs', 'c.id = cs.class_id')
      .where('c.subject = :subject', { subject })
      .andWhere('cs.week_day = :week_day', { week_day })
      .andWhere(':time between cs.from and cs.to', {
        time: timeInMinutes,
      })
      .getRawMany();

    return response.json(classes);
  }

  async create(request: Request, response: Response) {
    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule,
    }: RequestCreateClass = request.body;

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
  }
}
