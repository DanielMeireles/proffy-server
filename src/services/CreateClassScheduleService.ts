import { getRepository } from 'typeorm';
import ClassSchedule from '../models/ClassSchedule';
import Class from '../models/Class';

interface Request {
  week_day: number;
  from: number;
  to: number;
  class_id: Class;
}

class CreateClassScheduleService {
  public async execute({
    week_day,
    from,
    to,
    class_id,
  }: Request): Promise<ClassSchedule> {
    const classSchedulesRepository = getRepository(ClassSchedule);

    const classObject = classSchedulesRepository.create({
      week_day,
      from,
      to,
      class_id,
    });

    await classSchedulesRepository.save(classObject);

    return classObject;
  }
}

export default CreateClassScheduleService;
