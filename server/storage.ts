import { configurations, type Configuration, type InsertConfiguration } from "@shared/schema";

export interface IStorage {
  getConfiguration(id: number): Promise<Configuration | undefined>;
  getAllConfigurations(): Promise<Configuration[]>;
  createConfiguration(config: InsertConfiguration): Promise<Configuration>;
  updateConfiguration(id: number, updates: Partial<Configuration>): Promise<Configuration | undefined>;
  deleteConfiguration(id: number): Promise<boolean>;
  deleteInvalidConfigurations(): Promise<number>;
}

export class MemStorage implements IStorage {
  private configurations: Map<number, Configuration>;
  private currentId: number;

  constructor() {
    this.configurations = new Map();
    this.currentId = 1;
  }

  async getConfiguration(id: number): Promise<Configuration | undefined> {
    return this.configurations.get(id);
  }

  async getAllConfigurations(): Promise<Configuration[]> {
    return Array.from(this.configurations.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createConfiguration(insertConfig: InsertConfiguration): Promise<Configuration> {
    const id = this.currentId++;
    const config: Configuration = {
      id,
      name: insertConfig.name,
      privateKey: insertConfig.privateKey,
      publicKey: insertConfig.publicKey,
      endpoint: insertConfig.endpoint,
      dns: insertConfig.dns || "1.1.1.1, 1.0.0.1",
      mtu: insertConfig.mtu || 1280,
      warpPlus: insertConfig.warpPlus || false,
      isValid: insertConfig.isValid || false,
      testResults: insertConfig.testResults || null,
      region: insertConfig.region || "auto",
      createdAt: new Date(),
    };
    this.configurations.set(id, config);
    return config;
  }

  async updateConfiguration(id: number, updates: Partial<Configuration>): Promise<Configuration | undefined> {
    const existing = this.configurations.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.configurations.set(id, updated);
    return updated;
  }

  async deleteConfiguration(id: number): Promise<boolean> {
    return this.configurations.delete(id);
  }

  async deleteInvalidConfigurations(): Promise<number> {
    const invalid = Array.from(this.configurations.values()).filter(config => !config.isValid);
    invalid.forEach(config => this.configurations.delete(config.id));
    return invalid.length;
  }
}

export const storage = new MemStorage();
