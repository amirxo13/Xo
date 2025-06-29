import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WarpApiService } from "./services/warp-api";
import { ConfigTesterService } from "./services/config-tester";
import { generateConfigSchema, testConfigSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const warpApi = new WarpApiService();
  const configTester = new ConfigTesterService();

  // Get all configurations
  app.get("/api/configurations", async (req, res) => {
    try {
      const configurations = await storage.getAllConfigurations();
      res.json(configurations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch configurations" });
    }
  });

  // Generate new configuration
  app.post("/api/configurations/generate", async (req, res) => {
    try {
      const data = generateConfigSchema.parse(req.body);
      
      // Generate config using Warp API
      const warpConfig = await warpApi.generateConfig(data.region, data.warpPlus);
      
      // Create configuration record
      const config = await storage.createConfiguration({
        name: `warp-config-${Date.now()}.conf`,
        privateKey: warpConfig.privateKey,
        publicKey: warpConfig.publicKey,
        endpoint: warpConfig.endpoint,
        dns: data.dns,
        mtu: data.mtu,
        warpPlus: data.warpPlus,
        region: data.region,
        isValid: false, // Will be set after testing
        testResults: null,
      });

      // Generate the actual WireGuard config content
      const configContent = warpApi.formatAsWireGuardConfig(warpConfig, data.dns, data.mtu);
      
      res.json({ 
        configuration: config,
        content: configContent 
      });
    } catch (error) {
      console.error("Config generation error:", error);
      res.status(500).json({ error: "Failed to generate configuration" });
    }
  });

  // Test configuration
  app.post("/api/configurations/test", async (req, res) => {
    try {
      const data = testConfigSchema.parse(req.body);
      
      const config = await storage.getConfiguration(data.configId);
      if (!config) {
        return res.status(404).json({ error: "Configuration not found" });
      }

      // Generate config content for testing
      const warpConfig = {
        privateKey: config.privateKey,
        publicKey: config.publicKey,
        endpoint: config.endpoint,
        addresses: ['10.2.0.2/32'] // Default addresses
      };
      
      const configContent = warpApi.formatAsWireGuardConfig(warpConfig, config.dns, config.mtu);
      
      // Test the configuration
      const testResults = await configTester.testConfiguration(configContent);
      
      // Update configuration with test results
      const updatedConfig = await storage.updateConfiguration(data.configId, {
        isValid: testResults.connectionTest && testResults.dnsResolution,
        testResults: JSON.stringify(testResults),
      });

      res.json({ 
        configuration: updatedConfig,
        testResults 
      });
    } catch (error) {
      console.error("Config testing error:", error);
      res.status(500).json({ error: "Failed to test configuration" });
    }
  });

  // Download configuration file
  app.get("/api/configurations/:id/download", async (req, res) => {
    try {
      const configId = parseInt(req.params.id);
      const config = await storage.getConfiguration(configId);
      
      if (!config) {
        return res.status(404).json({ error: "Configuration not found" });
      }

      const warpConfig = {
        privateKey: config.privateKey,
        publicKey: config.publicKey,
        endpoint: config.endpoint,
        addresses: ['10.2.0.2/32']
      };
      
      const configContent = warpApi.formatAsWireGuardConfig(warpConfig, config.dns, config.mtu);
      
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${config.name}"`);
      res.send(configContent);
    } catch (error) {
      res.status(500).json({ error: "Failed to download configuration" });
    }
  });

  // Delete configuration
  app.delete("/api/configurations/:id", async (req, res) => {
    try {
      const configId = parseInt(req.params.id);
      const deleted = await storage.deleteConfiguration(configId);
      
      if (!deleted) {
        return res.status(404).json({ error: "Configuration not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete configuration" });
    }
  });

  // Delete all invalid configurations
  app.delete("/api/configurations/invalid", async (req, res) => {
    try {
      const deletedCount = await storage.deleteInvalidConfigurations();
      res.json({ deletedCount });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete invalid configurations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
