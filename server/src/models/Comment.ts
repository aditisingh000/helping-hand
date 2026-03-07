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
import { User } from "./User.js";
import { Event } from "./Event.js";

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid", { name: "event_id" })
  eventId: string;

  @Column("uuid", { name: "user_id" })
  userId: string;

  @ManyToOne(() => Event, (event) => event.comments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "event_id" })
  event: Event;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column("text")
  content: string;

  @Column("uuid", { name: "parent_id", nullable: true })
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
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ type: "timestamp", name: "deleted_at", nullable: true })
  deletedAt: Date;

  @Column({ name: "is_edited", default: false })
  isEdited: boolean;
}
