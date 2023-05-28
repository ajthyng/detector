import { Injectable } from '@nestjs/common';
import { CreateReadingDto } from '../dto/create-reading.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reading } from '../entities/reading.entity';
import { Repository } from 'typeorm';
import { Subject } from 'rxjs';

@Injectable()
export class SensorDataService {
  sensorDataSubject: Subject<CreateReadingDto & Reading>;

  constructor(
    @InjectRepository(Reading) private readingRepository: Repository<Reading>,
  ) {
    this.sensorDataSubject = new Subject();
  }

  async getReadings() {
    const [readings, count] = await this.readingRepository.findAndCount({
      take: 1,
    });
    return { readings, count };
  }

  async recordReadings(createReadingDTO: CreateReadingDto) {
    const result = await this.readingRepository.save(createReadingDTO);
    this.sensorDataSubject.next(result);

    return result;
  }

  async subscribeToReadings(
    handler: (data: CreateReadingDto & Reading) => void,
  ) {
    return this.sensorDataSubject.subscribe({
      next: handler,
    });
  }
}
