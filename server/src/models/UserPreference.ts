import { IsUUID, IsInt, IsOptional, IsBoolean, IsDate, IsArray, IsString } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";

import { User } from "./User.js";

@Entity("user_preferences")
export class UserPreference {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id: string;

  @Column("uuid", { name: "user_id", unique: true })
  @IsUUID()
  userId: string;

  @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: import("./User.js").User;

  @Column({ name: "default_radius_km", default: 10 })
  @IsInt()
  defaultRadiusKm: number;

  @Column({ type: "text", array: true, name: "preferred_categories", nullable: true })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preferredCategories: string[];

  @Column({ name: "notification_email", default: true })
  @IsBoolean()
  notificationEmail: boolean;

  @Column({ name: "notification_push", default: true })
  @IsBoolean()
  notificationPush: boolean;

  @Column({ name: "notification_friend_activity", default: true })
  @IsBoolean()
  notificationFriendActivity: boolean;

  @Column({ name: "notification_event_reminder", default: true })
  @IsBoolean()
  notificationEventReminder: boolean;

  @Column({ name: "privacy_show_location", default: true })
  @IsBoolean()
  privacyShowLocation: boolean;

  @Column({ name: "privacy_show_email", default: false })
  @IsBoolean()
  privacyShowEmail: boolean;

  @Column({ name: "privacy_show_phone", default: false })
  @IsBoolean()
  privacyShowPhone: boolean;

  @CreateDateColumn({ name: "created_at" })
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  @IsDate()
  updatedAt: Date;
}
