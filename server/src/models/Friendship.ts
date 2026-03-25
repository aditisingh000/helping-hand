import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Check,
} from "typeorm";
import { IsUUID, IsString, IsDate, MaxLength } from "class-validator";
import { User } from "./User.js";

@Entity("friendships")
@Unique(["userId", "friendId"])
@Check(`"user_id" != "friend_id"`)
export class Friendship {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id: string;

  @Column("uuid", { name: "user_id" })
  @IsUUID()
  userId: string;

  @Column("uuid", { name: "friend_id" })
  @IsUUID()
  friendId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: import("./User.js").User;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "friend_id" })
  friend: import("./User.js").User;

  @Column({ length: 20, default: "pending" })
  @IsString()
  @MaxLength(20)
  status: string;

  @CreateDateColumn({ name: "created_at" })
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  @IsDate()
  updatedAt: Date;
}
