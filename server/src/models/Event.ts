import {
  IsUUID,
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  IsDate,
  MaxLength,
  Min,
} from "class-validator";
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

import { Comment } from "./Comment.js";
import { RSVP } from "./RSVP.js";
import { User } from "./User.js";

@Entity("events")
export class Event {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id: string;

  @Column("uuid", { name: "host_id" })
  @IsUUID()
  hostId: string;

  @ManyToOne(() => User, (user) => user.hostedEvents, { onDelete: "CASCADE" })
  @JoinColumn({ name: "host_id" })
  host: import("./User.js").User;

  @Column({ length: 255 })
  @IsString()
  @MaxLength(255)
  title: string;

  @Column("text")
  @IsString()
  description: string;

  @Column({ length: 50 })
  @IsString()
  @MaxLength(50)
  category: string;

  @Column("geometry", {
    spatialFeatureType: "Point",
    srid: 4326,
  })
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  location: any;

  @Column({ name: "location_address", length: 500 })
  @IsString()
  @MaxLength(500)
  locationAddress: string;

  @Column({ type: "timestamp", name: "date_time" })
  @IsDate()
  dateTime: Date;

  @Column({ name: "duration_minutes", default: 120 })
  @IsInt()
  @Min(1)
  durationMinutes: number;

  @Column({ type: "int", nullable: true })
  @IsInt()
  @Min(1)
  @IsOptional()
  capacity: number;

  @Column({ name: "current_rsvps", default: 0 })
  @IsInt()
  @Min(0)
  currentRsvps: number;

  @Column({ name: "age_min", type: "int", nullable: true })
  @IsInt()
  @Min(0)
  @IsOptional()
  ageMin: number;

  @Column({ name: "age_max", type: "int", nullable: true })
  @IsInt()
  @Min(0)
  @IsOptional()
  ageMax: number;

  @Column({ name: "banner_url", length: 500, nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  bannerUrl: string;

  @Column({ name: "is_recurring", default: false })
  @IsBoolean()
  isRecurring: boolean;

  @Column({ name: "recurrence_pattern", length: 100, nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  recurrencePattern: string;

  @Column({ length: 20, default: "active" })
  @IsString()
  @MaxLength(20)
  status: string;

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

  @Column("text", { name: "cancellation_reason", nullable: true })
  @IsString()
  @IsOptional()
  cancellationReason: string;

  @OneToMany(() => RSVP, (rsvp) => rsvp.event)
  rsvps: RSVP[];

  @OneToMany(() => Comment, (comment) => comment.event)
  comments: Comment[];
}
