import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Event } from "./Event.js";
import { RSVP } from "./RSVP.js";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: "password_hash", length: 255 })
  passwordHash: string;

  @Column({ length: 255 })
  name: string;

  @Column("text", { nullable: true })
  bio: string;

  @Column({ name: "avatar_url", length: 500, nullable: true })
  avatarUrl: string;

  @Column("geometry", {
    spatialFeatureType: "Point",
    srid: 4326,
    nullable: true,
  })
  location: any;

  @Column({ name: "location_address", length: 500, nullable: true })
  locationAddress: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column("date", { name: "date_of_birth", nullable: true })
  dateOfBirth: Date;

  @Column({ name: "email_verified", default: false })
  emailVerified: boolean;

  @Column({ name: "email_verification_token", length: 255, nullable: true })
  emailVerificationToken: string;

  @Column({ name: "password_reset_token", length: 255, nullable: true })
  passwordResetToken: string;

  @Column({ type: "timestamp", name: "password_reset_expires", nullable: true })
  passwordResetExpires: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ type: "timestamp", name: "last_login", nullable: true })
  lastLogin: Date;

  @Column({ name: "is_active", default: true })
  isActive: boolean;

  @Column({ name: "is_admin", default: false })
  isAdmin: boolean;

  @OneToMany(() => Event, (event) => event.host)
  hostedEvents: Event[];

  @OneToMany(() => RSVP, (rsvp) => rsvp.user)
  rsvps: RSVP[];
}
