import { TestResult } from "@shared/schema";

export class ConfigTesterService {
  async testConfiguration(configContent: string): Promise<TestResult> {
    const result: TestResult = {
      connectionTest: false,
      speedTest: null,
      dnsResolution: false,
      latency: null,
    };

    try {
      // Parse the config to extract endpoint
      const endpointMatch = configContent.match(/Endpoint\s*=\s*(.+)/);
      const endpoint = endpointMatch?.[1]?.trim();

      if (!endpoint) {
        throw new Error('Invalid configuration: No endpoint found');
      }

      // Test 1: Connection Test (simulate ping to endpoint)
      result.connectionTest = await this.testConnection(endpoint);

      // Test 2: DNS Resolution Test
      result.dnsResolution = await this.testDnsResolution();

      // Test 3: Latency Test
      if (result.connectionTest) {
        result.latency = await this.measureLatency(endpoint);
      }

      // Test 4: Speed Test (simplified)
      if (result.connectionTest) {
        result.speedTest = await this.measureSpeed();
      }

    } catch (error) {
      result.error = error instanceof Error ? error.message : 'Unknown testing error';
    }

    return result;
  }

  private async testConnection(endpoint: string): Promise<boolean> {
    try {
      // Extract hostname and port from endpoint
      const [hostname, port] = endpoint.split(':');
      
      // Simulate connection test with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        // In a real implementation, you would use a proper network test
        // For now, we'll simulate based on known Cloudflare endpoints
        const isCloudflareEndpoint = hostname.includes('cloudflare.com') || 
                                   hostname.includes('1.1.1.1') ||
                                   hostname.includes('1.0.0.1');
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
        
        clearTimeout(timeoutId);
        return isCloudflareEndpoint;
      } catch (error) {
        clearTimeout(timeoutId);
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  private async testDnsResolution(): Promise<boolean> {
    try {
      // Test DNS resolution by trying to resolve a known domain
      // In a real implementation, you would use DNS lookup
      // Simulate DNS test
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 200));
      return Math.random() > 0.1; // 90% success rate simulation
    } catch (error) {
      return false;
    }
  }

  private async measureLatency(endpoint: string): Promise<number | null> {
    try {
      const startTime = Date.now();
      
      // Simulate latency measurement
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 20));
      
      const endTime = Date.now();
      return endTime - startTime;
    } catch (error) {
      return null;
    }
  }

  private async measureSpeed(): Promise<number | null> {
    try {
      // Simulate speed test (return speed in Mbps)
      // In reality, this would involve downloading/uploading test data
      await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 1000));
      
      // Return random speed between 1-20 Mbps (typical for 3G/4G in Iran)
      return Math.random() * 19 + 1;
    } catch (error) {
      return null;
    }
  }
}
