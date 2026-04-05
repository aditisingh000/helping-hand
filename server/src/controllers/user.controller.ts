import { Request, Response } from "express";

import { AppDataSource } from "../config/data-source.js";
import { Event } from "../models/Event.js";
import { Friendship } from "../models/Friendship.js";
import { RSVP } from "../models/RSVP.js";
import { User } from "../models/User.js";
import { processProfileImage } from "../utils/image.js";

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
      select: ["id", "name", "bio", "avatarUrl", "locationAddress", "createdAt"],
      // Only select public safe fields
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Load Stats:
    // 1. Events Hosted
    const eventRepo = AppDataSource.getRepository(Event);
    const hostedCount = await eventRepo.count({ where: { hostId: id } });

    // 2. Events Attended
    const rsvpRepo = AppDataSource.getRepository(RSVP);
    const attendedCount = await rsvpRepo.count({ where: { userId: id, status: "going" } });

    // 3. Friends Count
    const friendRepo = AppDataSource.getRepository(Friendship);
    const friendsCount = await friendRepo
      .createQueryBuilder("friendship")
      .where(
        "(friendship.userId = :id OR friendship.friendId = :id) AND friendship.status = 'active'",
        { id },
      )
      .getCount();

    res.status(200).json({
      user,
      stats: {
        hosted: hostedCount,
        attended: attendedCount,
        friends: friendsCount,
      },
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    // Users can only update their own profile
    if (req.user?.id !== id) {
      res.status(403).json({ message: "Forbidden. You can only edit your own profile." });
      return;
    }

    const { name, bio, locationAddress } = req.body;

    // We update the user object we attached in middleware
    const user = req.user;

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (locationAddress !== undefined) user.locationAddress = locationAddress;

    const userRepository = AppDataSource.getRepository(User);
    await userRepository.save(user);

    const {
      passwordHash: _ph,
      emailVerificationToken: _evt,
      passwordResetToken: _prt,
      ...userSafeData
    } = user;

    res.status(200).json({ message: "Profile updated successfully", user: userSafeData });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (req.user?.id !== id) {
      res.status(403).json({ message: "Forbidden. You can only edit your own profile." });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: "No image file provided" });
      return;
    }

    // Process using sharp and save to /uploads
    const avatarUrl = await processProfileImage(req.file.buffer);

    const user = req.user;
    user.avatarUrl = avatarUrl;

    const userRepository = AppDataSource.getRepository(User);
    await userRepository.save(user);

    res.status(200).json({ message: "Avatar uploaded successfully", avatarUrl });
  } catch (error) {
    console.error("Upload avatar error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
