import { Injectable } from '@nestjs/common';
import { CreateReadingDto } from '../dto/create-reading.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reading } from '../entities/reading.entity';
import { In, MoreThan, Repository } from 'typeorm';
import { Subject } from 'rxjs';

@Injectable()
export class SensorDataService {
  sensorDataSubject: Subject<CreateReadingDto & Reading>;

  constructor(
    @InjectRepository(Reading) private readingRepository: Repository<Reading>,
  ) {
    this.sensorDataSubject = new Subject();
  }

  async getReadings(types: string[]) {
    const [readings, count] = await this.readingRepository.findAndCount({
      where: { type: In(types) },
    });
    return { readings, count };
  }

  async recordReadings(createReadingDTO: CreateReadingDto[]) {
    const results = await this.readingRepository.save(createReadingDTO);
    for (const result of results) {
      this.sensorDataSubject.next(result);
    }

    return results;
  }

  async subscribeToReadings(
    handler: (data: CreateReadingDto & Reading) => void,
  ) {
    return this.sensorDataSubject.subscribe({
      next: handler,
    });
  }

  async getAverage(sensor: string, type: string, duration: number) {
    const readings = await this.readingRepository.find({
      where: {
        type,
        sensor,
        createdAt: MoreThan(new Date(Date.now() - duration * 1000)),
      },
    });
    const total = readings.reduce(
      (acc, reading) => acc + parseFloat(reading.value),
      0,
    );

    return total / readings.length;
  }
}
