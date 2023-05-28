import { Module } from '@nestjs/common';
import { SensorDataModule } from './sensor-data/sensor-data.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    SensorDataModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'sqlite',
        database: './data/db.sqlite',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
  ],
})
export class AppModule {}
