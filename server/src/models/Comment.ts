import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { IsUUID, IsString, IsOptional, IsBoolean, IsDate } from "class-validator";
import { User } from "./User.js";
import { Event } from "./Event.js";

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id: string;

  @Column("uuid", { name: "event_id" })
  @IsUUID()
  eventId: string;

  @Column("uuid", { name: "user_id" })
  @IsUUID()
  userId: string;

  @ManyToOne(() => Event, (event) => event.comments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "event_id" })
  event: Event;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column("text")
  @IsString()
  content: string;

  @Column("uuid", { name: "parent_id", nullable: true })
  @IsUUID()
  @IsOptional()
  parentId: string;

  @ManyToOne(() => Comment, (comment) => comment.replies, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "parent_id" })
  parent: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];

  @CreateDateColumn({ name: "created_at" })
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  @IsDate()
  updatedAt: Date;

  @Column({ type: "timestamp", name: "deleted_at", nullable: true })
  @IsDate()
  @IsOptional()
  deletedAt: Date;

  @Column({ name: "is_edited", default: false })
  @IsBoolean()
  isEdited: boolean;
}
