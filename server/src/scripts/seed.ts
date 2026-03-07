import "reflect-metadata";
import { AppDataSource } from "../config/data-source.js";
import { EventCategory } from "../models/EventCategory.js";

const categories = [
  {
    name: "volunteer",
    displayName: "Volunteer",
    icon: "hand-holding-heart",
    color: "#FF6B6B",
  },
  {
    name: "social",
    displayName: "Social Gathering",
    icon: "users",
    color: "#4ECDC4",
  },
  {
    name: "educational",
    displayName: "Educational",
    icon: "book",
    color: "#45B7D1",
  },
  {
    name: "sports",
    displayName: "Sports & Fitness",
    icon: "dumbbell",
    color: "#FFA07A",
  },
  {
    name: "arts",
    displayName: "Arts & Culture",
    icon: "palette",
    color: "#9B59B6",
  },
  {
    name: "food",
    displayName: "Food & Dining",
    icon: "utensils",
    color: "#F39C12",
  },
  {
    name: "outdoor",
    displayName: "Outdoor Activities",
    icon: "tree",
    color: "#27AE60",
  },
  {
    name: "other",
    displayName: "Other",
    icon: "ellipsis-h",
    color: "#95A5A6",
  },
];

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection initialized.");

    const categoryRepo = AppDataSource.getRepository(EventCategory);

    for (const cat of categories) {
      // Upsert based on the 'name' column which is unique
      const existing = await categoryRepo.findOneBy({ name: cat.name });
      if (!existing) {
        const newCategory = categoryRepo.create(cat);
        await categoryRepo.save(newCategory);
        console.log(`Created category: ${cat.name}`);
      } else {
        console.log(`Category ${cat.name} already exists. Skipping.`);
      }
    }

    console.log("Seeding complete!");
  } catch (err) {
    console.error("Error during seeding:", err);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

seed();
