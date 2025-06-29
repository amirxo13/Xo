import { configurations, type Configuration, type InsertConfiguration } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getConfiguration(id: number): Promise<Configuration | undefined>;
  getAllConfigurations(): Promise<Configuration[]>;
  createConfiguration(config: InsertConfiguration): Promise<Configuration>;
  updateConfiguration(id: number, updates: Partial<Configuration>): Promise<Configuration | undefined>;
  deleteConfiguration(id: number): Promise<boolean>;
  deleteInvalidConfigurations(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getConfiguration(id: number): Promise<Configuration | undefined> {
    const [config] = await db.select().from(configurations).where(eq(configurations.id, id));
    return config || undefined;
  }

  async getAllConfigurations(): Promise<Configuration[]> {
    return await db.select().from(configurations).orderBy(configurations.createdAt);
  }

  async createConfiguration(insertConfig: InsertConfiguration): Promise<Configuration> {
    const [config] = await db
      .insert(configurations)
      .values(insertConfig)
      .returning();
    return config;
  }

  async updateConfiguration(id: number, updates: Partial<Configuration>): Promise<Configuration | undefined> {
    const [updated] = await db
      .update(configurations)
      .set(updates)
      .where(eq(configurations.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteConfiguration(id: number): Promise<boolean> {
    const result = await db
      .delete(configurations)
      .where(eq(configurations.id, id));
    return (result.rowCount || 0) > 0;
  }

  async deleteInvalidConfigurations(): Promise<number> {
    const result = await db
      .delete(configurations)
      .where(eq(configurations.isValid, false));
    return result.rowCount || 0;
  }
}

export const storage = new DatabaseStorage();
