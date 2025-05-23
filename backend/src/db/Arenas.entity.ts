//Source code generated by AppGPT (www.appgpt.tech)
//to be autogenerated as template, one per resource
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Arenas')
export class ArenasEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  name: string;

  @Column('text', { nullable: true })
  background_image: string;

  @Column('text', { nullable: true })
  weather: string;

  @Column('integer', { nullable: true })
  unlock_level: number;
}
