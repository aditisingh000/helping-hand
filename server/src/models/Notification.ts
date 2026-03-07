import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User.js";
import { Event } from "./Event.js";

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid", { name: "user_id" })
  userId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ length: 50 })
  type: string;

  @Column({ length: 255 })
  title: string;

  @Column("text")
  message: string;

  @Column("uuid", { name: "related_event_id", nullable: true })
  relatedEventId: string;

  @ManyToOne(() => Event, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "related_event_id" })
  relatedEvent: Event;

  @Column("uuid", { name: "related_user_id", nullable: true })
  relatedUserId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "related_user_id" })
  relatedUser: User;

  @Column({ default: false })
  read: boolean;

  @Column({ type: "timestamp", name: "read_at", nullable: true })
  readAt: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "action_url", length: 500, nullable: true })
  actionUrl: string;
}
