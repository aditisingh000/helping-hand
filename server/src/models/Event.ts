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
import { RSVP } from "./RSVP.js";
import { Comment } from "./Comment.js";

@Entity("events")
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid", { name: "host_id" })
  hostId: string;

  @ManyToOne(() => User, (user) => user.hostedEvents, { onDelete: "CASCADE" })
  @JoinColumn({ name: "host_id" })
  host: User;

  @Column({ length: 255 })
  title: string;

  @Column("text")
  description: string;

  @Column({ length: 50 })
  category: string;

  @Column("geometry", {
    spatialFeatureType: "Point",
    srid: 4326,
  })
  location: any;

  @Column({ name: "location_address", length: 500 })
  locationAddress: string;

  @Column({ type: "timestamp", name: "date_time" })
  dateTime: Date;

  @Column({ name: "duration_minutes", default: 120 })
  durationMinutes: number;

  @Column({ type: "int", nullable: true })
  capacity: number;

  @Column({ name: "current_rsvps", default: 0 })
  currentRsvps: number;

  @Column({ name: "age_min", type: "int", nullable: true })
  ageMin: number;

  @Column({ name: "age_max", type: "int", nullable: true })
  ageMax: number;

  @Column({ name: "banner_url", length: 500, nullable: true })
  bannerUrl: string;

  @Column({ name: "is_recurring", default: false })
  isRecurring: boolean;

  @Column({ name: "recurrence_pattern", length: 100, nullable: true })
  recurrencePattern: string;

  @Column({ length: 20, default: "active" })
  status: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ type: "timestamp", name: "cancelled_at", nullable: true })
  cancelledAt: Date;

  @Column("text", { name: "cancellation_reason", nullable: true })
  cancellationReason: string;

  @OneToMany(() => RSVP, (rsvp) => rsvp.event)
  rsvps: RSVP[];

  @OneToMany(() => Comment, (comment) => comment.event)
  comments: Comment[];
}
