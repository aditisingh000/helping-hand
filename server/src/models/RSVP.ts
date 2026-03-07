import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm";
import { User } from "./User.js";
import { Event } from "./Event.js";

@Entity("rsvps")
@Unique(["eventId", "userId"])
export class RSVP {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid", { name: "event_id" })
  eventId: string;

  @Column("uuid", { name: "user_id" })
  userId: string;

  @ManyToOne(() => Event, (event) => event.rsvps, { onDelete: "CASCADE" })
  @JoinColumn({ name: "event_id" })
  event: Event;

  @ManyToOne(() => User, (user) => user.rsvps, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ length: 20, default: "going" })
  status: string;

  @Column({ name: "guests_count", default: 0 })
  guestsCount: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ type: "timestamp", name: "cancelled_at", nullable: true })
  cancelledAt: Date;
}
