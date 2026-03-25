import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import { IsUUID, IsString, IsOptional, IsDate, MaxLength } from "class-validator";

@Entity("event_categories")
export class EventCategory {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id: string;

  @Column({ length: 50, unique: true })
  @IsString()
  @MaxLength(50)
  name: string;

  @Column({ name: "display_name", length: 100 })
  @IsString()
  @MaxLength(100)
  displayName: string;

  @Column({ length: 50, nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  icon: string;

  @Column({ length: 7, nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(7)
  color: string;

  @Column("text", { nullable: true })
  @IsString()
  @IsOptional()
  description: string;

  @CreateDateColumn({ name: "created_at" })
  @IsDate()
  createdAt: Date;
}
