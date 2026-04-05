import { IsUUID, IsString, IsOptional, IsDate, MaxLength } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm";

import { Event } from "./Event.js";
import { User } from "./User.js";

@Entity("event_reports")
@Unique(["eventId", "reportedBy"])
export class EventReport {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id: string;

  @Column("uuid", { name: "event_id" })
  @IsUUID()
  eventId: string;

  @Column("uuid", { name: "reported_by" })
  @IsUUID()
  reportedBy: string;

  @ManyToOne(() => Event, { onDelete: "CASCADE" })
  @JoinColumn({ name: "event_id" })
  event: import("./Event.js").Event;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "reported_by" })
  reporter: import("./User.js").User;

  @Column({ length: 100 })
  @IsString()
  @MaxLength(100)
  reason: string;

  @Column("text", { nullable: true })
  @IsString()
  @IsOptional()
  description: string;

  @Column({ length: 20, default: "pending" })
  @IsString()
  @MaxLength(20)
  status: string;

  @Column("uuid", { name: "reviewed_by", nullable: true })
  @IsUUID()
  @IsOptional()
  reviewedBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "reviewed_by" })
  reviewer: import("./User.js").User;

  @Column({ type: "timestamp", name: "reviewed_at", nullable: true })
  @IsDate()
  @IsOptional()
  reviewedAt: Date;

  @CreateDateColumn({ name: "created_at" })
  @IsDate()
  createdAt: Date;
}
