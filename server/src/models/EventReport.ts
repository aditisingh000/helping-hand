import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm";
import { User } from "./User.js";
import { Event } from "./Event.js";

@Entity("event_reports")
@Unique(["eventId", "reportedBy"])
export class EventReport {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid", { name: "event_id" })
  eventId: string;

  @Column("uuid", { name: "reported_by" })
  reportedBy: string;

  @ManyToOne(() => Event, { onDelete: "CASCADE" })
  @JoinColumn({ name: "event_id" })
  event: Event;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "reported_by" })
  reporter: User;

  @Column({ length: 100 })
  reason: string;

  @Column("text", { nullable: true })
  description: string;

  @Column({ length: 20, default: "pending" })
  status: string;

  @Column("uuid", { name: "reviewed_by", nullable: true })
  reviewedBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "reviewed_by" })
  reviewer: User;

  @Column({ type: "timestamp", name: "reviewed_at", nullable: true })
  reviewedAt: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
