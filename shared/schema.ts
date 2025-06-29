import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const configurations = pgTable("configurations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  privateKey: text("private_key").notNull(),
  publicKey: text("public_key").notNull(),
  endpoint: text("endpoint").notNull(),
  dns: text("dns").notNull().default("1.1.1.1, 1.0.0.1"),
  mtu: integer("mtu").notNull().default(1280),
  warpPlus: boolean("warp_plus").notNull().default(false),
  isValid: boolean("is_valid").notNull().default(false),
  testResults: text("test_results"), // JSON string
  createdAt: timestamp("created_at").notNull().defaultNow(),
  region: text("region").notNull().default("auto"),
});

export const insertConfigurationSchema = createInsertSchema(configurations).omit({
  id: true,
  createdAt: true,
});

export const generateConfigSchema = z.object({
  region: z.string().default("auto"),
  dns: z.string().default("1.1.1.1, 1.0.0.1"),
  mtu: z.number().min(1200).max(1500).default(1280),
  warpPlus: z.boolean().default(false),
});

export const testConfigSchema = z.object({
  configId: z.number(),
});

export type Configuration = typeof configurations.$inferSelect;
export type InsertConfiguration = z.infer<typeof insertConfigurationSchema>;
export type GenerateConfigRequest = z.infer<typeof generateConfigSchema>;
export type TestConfigRequest = z.infer<typeof testConfigSchema>;

export interface TestResult {
  connectionTest: boolean;
  speedTest: number | null; // Mbps
  dnsResolution: boolean;
  latency: number | null; // ms
  error?: string;
}
