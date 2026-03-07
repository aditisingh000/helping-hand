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
  id: string;

  @Column("uuid", { name: "user_id", unique: true })
  userId: string;

  @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "default_radius_km", default: 10 })
  defaultRadiusKm: number;

  @Column({ type: "text", array: true, name: "preferred_categories", nullable: true })
  preferredCategories: string[];

  @Column({ name: "notification_email", default: true })
  notificationEmail: boolean;

  @Column({ name: "notification_push", default: true })
  notificationPush: boolean;

  @Column({ name: "notification_friend_activity", default: true })
  notificationFriendActivity: boolean;

  @Column({ name: "notification_event_reminder", default: true })
  notificationEventReminder: boolean;

  @Column({ name: "privacy_show_location", default: true })
  privacyShowLocation: boolean;

  @Column({ name: "privacy_show_email", default: false })
  privacyShowEmail: boolean;

  @Column({ name: "privacy_show_phone", default: false })
  privacyShowPhone: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
