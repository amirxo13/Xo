import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WarpApiService } from "./services/warp-api";
import { ConfigTesterService } from "./services/config-tester";
import { TelegramBotService } from "./services/telegram-bot";
import { generateConfigSchema, testConfigSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const warpApi = new WarpApiService();
  const configTester = new ConfigTesterService();
  const telegramBot = new TelegramBotService();

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
      
      // Try Telegram bot first for Warp Plus configs, then fallback to Warp API
      let warpConfig;
      let configContent;
      let configName;

      try {
        if (data.warpPlus) {
          // Get Warp Plus config from Telegram bot service
          const botConfig = await telegramBot.getWarpPlusConfig();
          configName = `XO-WarpPlus-${Date.now()}.conf`;
          configContent = telegramBot.formatAsWireGuardConfig(botConfig, data.dns, data.mtu);
          warpConfig = {
            privateKey: botConfig.privateKey,
            publicKey: botConfig.publicKey,
            endpoint: botConfig.endpoint,
            addresses: botConfig.addresses
          };
        } else {
          // Use regular Warp API for free configs
          warpConfig = await warpApi.generateConfig(data.region, data.warpPlus);
          configName = `XO-config-${Date.now()}.conf`;
          configContent = warpApi.formatAsWireGuardConfig(warpConfig, data.dns, data.mtu);
        }
      } catch (telegramError) {
        console.log("Telegram bot failed, using fallback Warp API:", telegramError);
        // Fallback to Warp API
        warpConfig = await warpApi.generateConfig(data.region, data.warpPlus);
        configName = `XO-config-${Date.now()}.conf`;
        configContent = warpApi.formatAsWireGuardConfig(warpConfig, data.dns, data.mtu);
      }
      
      // Create configuration record
      const config = await storage.createConfiguration({
        name: configName,
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

  // Get multiple Warp Plus configurations from Telegram bot
  app.post("/api/configurations/telegram-batch", async (req, res) => {
    try {
      const { count = 5, dns = "1.1.1.1, 1.0.0.1", mtu = 1280 } = req.body;
      
      const botConfigs = await telegramBot.getMultipleConfigs(Math.min(count, 10)); // Max 10 configs
      const configurations = [];

      for (const botConfig of botConfigs) {
        const configName = `XO-TelegramWarp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}.conf`;
        
        const config = await storage.createConfiguration({
          name: configName,
          privateKey: botConfig.privateKey,
          publicKey: botConfig.publicKey,
          endpoint: botConfig.endpoint,
          dns,
          mtu,
          warpPlus: true,
          region: "telegram-bot",
          isValid: false,
          testResults: null,
        });

        const configContent = telegramBot.formatAsWireGuardConfig(botConfig, dns, mtu);
        
        configurations.push({
          configuration: config,
          content: configContent
        });

        // Add small delay to avoid rapid database writes
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      res.json({ 
        success: true,
        count: configurations.length,
        configurations 
      });
    } catch (error) {
      console.error("Telegram batch generation error:", error);
      res.status(500).json({ error: "Failed to generate configurations from Telegram bot" });
    }
  });

  // Upload WireGuard configuration file
  app.post("/api/configurations/upload", async (req, res) => {
    try {
      const { content } = req.body;
      
      if (!content || typeof content !== 'string') {
        return res.status(400).json({ error: "Configuration content is required" });
      }

      // Parse WireGuard configuration
      const lines = content.split('\n');
      let privateKey = '';
      let publicKey = '';
      let endpoint = '';
      let dns = '1.1.1.1, 1.0.0.1';
      let mtu = 1280;
      let currentSection = '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
          currentSection = trimmed.toLowerCase();
          continue;
        }

        if (trimmed.includes('=')) {
          const [key, value] = trimmed.split('=').map(s => s.trim());
          
          if (currentSection === '[interface]') {
            if (key.toLowerCase() === 'privatekey') privateKey = value;
            if (key.toLowerCase() === 'dns') dns = value;
            if (key.toLowerCase() === 'mtu') mtu = parseInt(value) || 1280;
          }
          
          if (currentSection === '[peer]') {
            if (key.toLowerCase() === 'publickey') publicKey = value;
            if (key.toLowerCase() === 'endpoint') endpoint = value;
          }
        }
      }

      if (!privateKey || !publicKey || !endpoint) {
        return res.status(400).json({ error: "Invalid WireGuard configuration: missing required fields" });
      }

      const configName = `XO-Uploaded-${Date.now()}.conf`;
      
      const config = await storage.createConfiguration({
        name: configName,
        privateKey,
        publicKey,
        endpoint,
        dns,
        mtu,
        warpPlus: true, // Assume uploaded configs are Warp Plus
        region: "uploaded",
        isValid: false,
        testResults: null,
      });

      res.json({ 
        success: true,
        configuration: config,
        message: "Configuration uploaded successfully"
      });
    } catch (error) {
      console.error("Config upload error:", error);
      res.status(500).json({ error: "Failed to upload configuration" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
