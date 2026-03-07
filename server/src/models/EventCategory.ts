import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("event_categories")
export class EventCategory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 50, unique: true })
  name: string;

  @Column({ name: "display_name", length: 100 })
  displayName: string;

  @Column({ length: 50, nullable: true })
  icon: string;

  @Column({ length: 7, nullable: true })
  color: string;

  @Column("text", { nullable: true })
  description: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
