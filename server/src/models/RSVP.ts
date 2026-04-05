import { IsUUID, IsString, IsInt, IsOptional, IsDate, MaxLength, Min } from "class-validator";
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

import { Event } from "./Event.js";
import { User } from "./User.js";

@Entity("rsvps")
@Unique(["eventId", "userId"])
export class RSVP {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id: string;

  @Column("uuid", { name: "event_id" })
  @IsUUID()
  eventId: string;

  @Column("uuid", { name: "user_id" })
  @IsUUID()
  userId: string;

  @ManyToOne(() => Event, (event) => event.rsvps, { onDelete: "CASCADE" })
  @JoinColumn({ name: "event_id" })
  event: import("./Event.js").Event;

  @ManyToOne(() => User, (user) => user.rsvps, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: import("./User.js").User;

  @Column({ length: 20, default: "going" })
  @IsString()
  @MaxLength(20)
  status: string;

  @Column({ name: "guests_count", default: 0 })
  @IsInt()
  @Min(0)
  guestsCount: number;

  @CreateDateColumn({ name: "created_at" })
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  @IsDate()
  updatedAt: Date;

  @Column({ type: "timestamp", name: "cancelled_at", nullable: true })
  @IsDate()
  @IsOptional()
  cancelledAt: Date;
}
