import { AppDataSource } from "../config/data-source.js";
import { User } from "../models/User.js";
import { Event } from "../models/Event.js";
import { RSVP } from "../models/RSVP.js";
import { Comment } from "../models/Comment.js";
import { Friendship } from "../models/Friendship.js";
import { Notification } from "../models/Notification.js";
import { EventCategory } from "../models/EventCategory.js";
import { UserPreference } from "../models/UserPreference.js";
import { EventReport } from "../models/EventReport.js";

export const UserRepository = AppDataSource.getRepository(User).extend({
  // Add custom methods here later
});

export const EventRepository = AppDataSource.getRepository(Event).extend({
  // Add custom methods here later
});

export const RSVPRepository = AppDataSource.getRepository(RSVP).extend({});
export const CommentRepository = AppDataSource.getRepository(Comment).extend({});
export const FriendshipRepository = AppDataSource.getRepository(Friendship).extend({});
export const NotificationRepository = AppDataSource.getRepository(Notification).extend({});
export const EventCategoryRepository = AppDataSource.getRepository(EventCategory).extend({});
export const UserPreferenceRepository = AppDataSource.getRepository(UserPreference).extend({});
export const EventReportRepository = AppDataSource.getRepository(EventReport).extend({});
