import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TestTube, Play, CheckCircle, Wifi, Gauge, Globe } from "lucide-react";
import { type Configuration, type TestResult } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";

interface ConfigTesterProps {
  selectedConfig?: Configuration;
}

export function ConfigTester({ selectedConfig }: ConfigTesterProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<TestResult | null>(null);

  const testMutation = useMutation({
    mutationFn: async (configId: number) => {
      const response = await apiRequest("POST", "/api/configurations/test", { configId });
      return response.json();
    },
    onSuccess: (data) => {
      setTestResults(data.testResults);
      toast({
        title: "Test Complete",
        description: data.testResults.connectionTest ? "Configuration is valid" : "Configuration failed tests",
        variant: data.testResults.connectionTest ? "default" : "destructive",
      });
    },
    onError: (error) => {
      toast({
        title: "Test Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getTestStatus = (test: boolean | null, isPending: boolean) => {
    if (isPending) return { color: "bg-yellow-500", text: t("pending") };
    if (test === true) return { color: "bg-green-500", text: "✓" };
    if (test === false) return { color: "bg-red-500", text: "✗" };
    return { color: "bg-gray-300", text: t("pending") };
  };

  const startTesting = () => {
    if (!selectedConfig) {
      toast({
        title: "No Configuration",
        description: "Please select a configuration to test",
        variant: "destructive",
      });
      return;
    }
    testMutation.mutate(selectedConfig.id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <TestTube className="h-5 w-5 mr-3 text-secondary" />
          {t("configTesting")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div className="flex items-center">
              <Wifi className="h-4 w-4 mr-3 text-gray-400" />
              <span className="text-sm">{t("connectionTest")}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${getTestStatus(testResults?.connectionTest, testMutation.isPending).color}`} />
              <span className="text-xs text-gray-500">
                {getTestStatus(testResults?.connectionTest, testMutation.isPending).text}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div className="flex items-center">
              <Gauge className="h-4 w-4 mr-3 text-gray-400" />
              <span className="text-sm">{t("speedTest")}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${testResults?.speedTest ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-xs text-gray-500">
                {testResults?.speedTest ? `${testResults.speedTest.toFixed(1)} Mbps` : t("pending")}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-3 text-gray-400" />
              <span className="text-sm">{t("dnsResolution")}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${getTestStatus(testResults?.dnsResolution, testMutation.isPending).color}`} />
              <span className="text-xs text-gray-500">
                {getTestStatus(testResults?.dnsResolution, testMutation.isPending).text}
              </span>
            </div>
          </div>
        </div>

        <Button
          className="w-full mt-4 bg-secondary hover:bg-green-700"
          onClick={startTesting}
          disabled={testMutation.isPending || !selectedConfig}
        >
          <Play className="h-4 w-4 mr-2" />
          {t("startTesting")}
        </Button>

        {testResults && testResults.connectionTest && testResults.dnsResolution && (
          <div className="mt-4 p-4 border rounded-md bg-green-50 border-green-200">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-4 w-4 text-secondary mr-2" />
              <span className="font-medium text-gray-900">{t("configValid")}</span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>• Connection: <span className="text-secondary">✓ {t("active")}</span></div>
              {testResults.speedTest && (
                <div>• {t("speed")}: <span className="text-secondary">✓ {testResults.speedTest.toFixed(1)} Mbps</span></div>
              )}
              <div>• DNS: <span className="text-secondary">✓ {t("resolved")}</span></div>
              {testResults.latency && (
                <div>• Latency: <span className="text-secondary">{testResults.latency}ms</span></div>
              )}
            </div>
          </div>
        )}

        {testResults && testResults.error && (
          <div className="mt-4 p-4 border rounded-md bg-red-50 border-red-200">
            <div className="text-sm text-red-700">
              Error: {testResults.error}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
