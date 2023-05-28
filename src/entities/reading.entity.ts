import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Reading {
  @BeforeInsert()
  generateUUID() {
    this.id = uuidv4();
  }

  @PrimaryGeneratedColumn('uuid')
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  type: string;

  @Column()
  sensor: string;

  @Column()
  value: string;

  @Column()
  units: string;
}
