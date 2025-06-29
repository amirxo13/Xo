import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Download, Copy, Trash2, RotateCcw } from "lucide-react";
import { type Configuration } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";

interface ConfigManagerProps {
  onSelectConfig?: (config: Configuration) => void;
}

export function ConfigManager({ onSelectConfig }: ConfigManagerProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: configurations = [], isLoading } = useQuery<Configuration[]>({
    queryKey: ["/api/configurations"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/configurations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/configurations"] });
      toast({ title: "Success", description: "Configuration deleted" });
    },
  });

  const clearInvalidMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/configurations/invalid");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/configurations"] });
      toast({
        title: "Success",
        description: `${data.deletedCount} invalid configurations deleted`,
      });
    },
  });

  const downloadConfig = async (id: number, name: string) => {
    try {
      const response = await fetch(`/api/configurations/${id}/download`);
      if (!response.ok) throw new Error("Download failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({ title: "Success", description: "Configuration downloaded" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download configuration",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (config: Configuration) => {
    // Generate config content for clipboard
    const configContent = `[Interface]
PrivateKey = ${config.privateKey}
Address = 10.2.0.2/32
DNS = ${config.dns}
MTU = ${config.mtu}

[Peer]
PublicKey = ${config.publicKey}
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = ${config.endpoint}
PersistentKeepalive = 25`;

    try {
      await navigator.clipboard.writeText(configContent);
      toast({ title: "Success", description: "Configuration copied to clipboard" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadAllValid = async () => {
    const validConfigs = configurations.filter(config => config.isValid);
    
    for (const config of validConfigs) {
      await downloadConfig(config.id, config.name);
      // Add small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <FolderOpen className="h-5 w-5 mr-3 text-warning" />
            {t("configFiles")}
          </CardTitle>
          <span className="text-sm text-gray-500">
            {configurations.length} {t("configurations")}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {configurations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No configurations yet. Generate one to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {configurations.map((config) => (
              <div
                key={config.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onSelectConfig?.(config)}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      config.isValid ? "bg-green-500" : "bg-red-500"
                    }`}
                    title={config.isValid ? "Valid configuration" : "Invalid configuration"}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{config.name}</span>
                      <Badge variant={config.isValid ? "default" : "destructive"}>
                        {config.isValid ? t("valid") : t("failed")}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {t("generated")}: {new Date(config.createdAt).toLocaleString()} |{" "}
                      {t("server")}: {config.endpoint}
                      {config.testResults && (() => {
                        try {
                          const results = JSON.parse(config.testResults);
                          return results.speedTest ? ` | ${t("speed")}: ${results.speedTest.toFixed(1)} Mbps` : '';
                        } catch {
                          return '';
                        }
                      })()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadConfig(config.id, config.name);
                    }}
                    title={t("download")}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(config);
                    }}
                    title={t("copy")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  {!config.isValid && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement retry test
                      }}
                      title={t("retry")}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMutation.mutate(config.id);
                    }}
                    title={t("delete")}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {configurations.length > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <Button
              className="flex-1"
              onClick={downloadAllValid}
              disabled={!configurations.some(c => c.isValid)}
            >
              <Download className="h-4 w-4 mr-2" />
              {t("downloadAll")}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => clearInvalidMutation.mutate()}
              disabled={clearInvalidMutation.isPending || !configurations.some(c => !c.isValid)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t("clearInvalid")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
