import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { IsUUID, IsEmail, IsString, IsOptional, IsBoolean, IsDate, MaxLength } from "class-validator";
import { Event } from "./Event.js";
import { RSVP } from "./RSVP.js";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id: string;

  @Column({ unique: true, length: 255 })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @Column({ name: "password_hash", length: 255 })
  @IsString()
  @MaxLength(255)
  passwordHash: string;

  @Column({ length: 255 })
  @IsString()
  @MaxLength(255)
  name: string;

  @Column("text", { nullable: true })
  @IsString()
  @IsOptional()
  bio: string;

  @Column({ name: "avatar_url", length: 500, nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  avatarUrl: string;

  @Column("geometry", {
    spatialFeatureType: "Point",
    srid: 4326,
    nullable: true,
  })
  @IsOptional()
  location: any;

  @Column({ name: "location_address", length: 500, nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  locationAddress: string;

  @Column({ length: 20, nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone: string;

  @Column("date", { name: "date_of_birth", nullable: true })
  @IsDate()
  @IsOptional()
  dateOfBirth: Date;

  @Column({ name: "email_verified", default: false })
  @IsBoolean()
  emailVerified: boolean;

  @Column({ name: "email_verification_token", length: 255, nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  emailVerificationToken: string;

  @Column({ name: "password_reset_token", length: 255, nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  passwordResetToken: string;

  @Column({ type: "timestamp", name: "password_reset_expires", nullable: true })
  @IsDate()
  @IsOptional()
  passwordResetExpires: Date;

  @CreateDateColumn({ name: "created_at" })
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  @IsDate()
  updatedAt: Date;

  @Column({ type: "timestamp", name: "last_login", nullable: true })
  @IsDate()
  @IsOptional()
  lastLogin: Date;

  @Column({ name: "is_active", default: true })
  @IsBoolean()
  isActive: boolean;

  @Column({ name: "is_admin", default: false })
  @IsBoolean()
  isAdmin: boolean;

  @OneToMany(() => Event, (event) => event.host)
  hostedEvents: Event[];

  @OneToMany(() => RSVP, (rsvp) => rsvp.user)
  rsvps: RSVP[];
}
