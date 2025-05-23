//Source code generated by AppGPT (www.appgpt.tech)
//to be autogenerated as template, one per resource
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Matches')
export class MatchesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer', { nullable: true })
  player1_id: number;

  @Column('integer', { nullable: true })
  player2_id: number;

  @Column('integer', { nullable: true })
  arena_id: number;

  @Column('integer', { nullable: true })
  winner_id: number;

  @Column('integer', { nullable: true })
  duration: number;

  @Column('date', { nullable: true })
  date: Date;
}
