import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { IsUUID, IsString, IsBoolean, IsDate, IsOptional, MaxLength } from "class-validator";
import { User } from "./User.js";
import { Event } from "./Event.js";

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id: string;

  @Column("uuid", { name: "user_id" })
  @IsUUID()
  userId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: import("./User.js").User;

  @Column({ length: 50 })
  @IsString()
  @MaxLength(50)
  type: string;

  @Column({ length: 255 })
  @IsString()
  @MaxLength(255)
  title: string;

  @Column("text")
  @IsString()
  message: string;

  @Column("uuid", { name: "related_event_id", nullable: true })
  @IsUUID()
  @IsOptional()
  relatedEventId: string;

  @ManyToOne(() => Event, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "related_event_id" })
  relatedEvent: import("./Event.js").Event;

  @Column("uuid", { name: "related_user_id", nullable: true })
  @IsUUID()
  @IsOptional()
  relatedUserId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "related_user_id" })
  relatedUser: import("./User.js").User;

  @Column({ default: false })
  @IsBoolean()
  read: boolean;

  @Column({ type: "timestamp", name: "read_at", nullable: true })
  @IsDate()
  @IsOptional()
  readAt: Date;

  @CreateDateColumn({ name: "created_at" })
  @IsDate()
  createdAt: Date;

  @Column({ name: "action_url", length: 500, nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  actionUrl: string;
}
