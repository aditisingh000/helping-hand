import { Request, Response } from "express";

import { AppDataSource } from "../config/data-source.js";
import { Event } from "../models/Event.js";
import { processBannerImage } from "../utils/image.js";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      category,
      locationAddress,
      latitude,
      longitude,
      dateTime,
      durationMinutes,
      capacity,
    } = req.body;

    // We assume authenticate middleware has run
    const hostId = req.user!.id;

    if (!title || !description || !category || !locationAddress || !dateTime) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const eventRepo = AppDataSource.getRepository(Event);

    const eventData: any = {
      hostId,
      title,
      description,
      category,
      locationAddress,
      dateTime: new Date(dateTime),
      durationMinutes: durationMinutes ? parseInt(durationMinutes) : 120,
      status: "active",
      currentRsvps: 0,
    };

    if (capacity) eventData.capacity = parseInt(capacity);
    if (latitude && longitude) eventData.location = { type: "Point", coordinates: [longitude, latitude] };

    const newEvent = eventRepo.create(eventData);

    await eventRepo.save(newEvent);
    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const eventRepo = AppDataSource.getRepository(Event);
    
    // We can add filtering queries here (category, bounds, etc.)
    const events = await eventRepo.find({
      where: { status: "active" },
      relations: ["host"],
      order: { dateTime: "ASC" },
      take: 50,
    });

    // Strip sensitive host info
    const safeEvents = events.map(event => {
      const { passwordHash: _ph, emailVerificationToken: _evt, passwordResetToken: _prt, ...safeHost } = event.host;
      return { ...event, host: safeHost };
    });

    res.status(200).json(safeEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const eventRepo = AppDataSource.getRepository(Event);

    const event = await eventRepo.findOne({
      where: { id },
      relations: ["host"],
    });

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    const { passwordHash: _ph, emailVerificationToken: _evt, passwordResetToken: _prt, ...safeHost } = event.host;
    
    res.status(200).json({ ...event, host: safeHost });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadEventBanner = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const eventRepo = AppDataSource.getRepository(Event);

    const event = await eventRepo.findOneBy({ id });
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // Only host can upload banner
    if (event.hostId !== req.user!.id) {
      res.status(403).json({ message: "Unauthorized: only the host can update this event's banner" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: "No image file provided" });
      return;
    }

    const bannerUrl = await processBannerImage(req.file.buffer);
    event.bannerUrl = bannerUrl;
    await eventRepo.save(event);

    res.status(200).json({ message: "Event banner uploaded", bannerUrl });
  } catch (error) {
    console.error("Error uploading banner:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
