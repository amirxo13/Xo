import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ConfigGenerator } from "@/components/config-generator";
import { ConfigTester } from "@/components/config-tester";
import { ConfigManager } from "@/components/config-manager";
import { InstructionsPanel } from "@/components/instructions-panel";
import { IranHelpPanel } from "@/components/iran-help-panel";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/hooks/use-language";
import { type Configuration } from "@shared/schema";

export default function Home() {
  const { t } = useLanguage();
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("disconnected");
  const [selectedConfig, setSelectedConfig] = useState<Configuration | undefined>();

  // Simulate connection status updates
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses: Array<typeof connectionStatus> = ["connected", "disconnected", "connecting"];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setConnectionStatus(randomStatus);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500 animate-pulse";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6" />
              <h1 className="text-xl font-semibold">{t("appTitle")}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
                <span className="text-sm">{t(`connectionStatus.${connectionStatus}`)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Privacy Notice */}
        <Alert className="mb-6 border-primary bg-blue-50">
          <Shield className="h-4 w-4 text-primary" />
          <AlertTitle className="text-gray-900">{t("privacyNotice")}</AlertTitle>
          <AlertDescription className="text-gray-700 text-sm">
            {t("privacyDescription")}
          </AlertDescription>
        </Alert>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ConfigGenerator />
          <ConfigTester selectedConfig={selectedConfig} />
        </div>

        <div className="mt-6">
          <ConfigManager onSelectConfig={setSelectedConfig} />
        </div>

        <div className="mt-6">
          <IranHelpPanel />
        </div>

        <div className="mt-6">
          <InstructionsPanel />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <span className="text-sm text-gray-600">© 2024 Oblivion Warp Manager</span>
              <a href="#" className="text-sm text-primary hover:underline">
                {t("privacyPolicy")}
              </a>
              <a href="#" className="text-sm text-primary hover:underline">
                GitHub
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-500">{t("madeWith")}</span>
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">{t("noLogging")}</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
