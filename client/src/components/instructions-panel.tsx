import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HelpCircle, ChevronDown, Smartphone, Apple, Monitor, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export function InstructionsPanel() {
  const { t } = useLanguage();
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const instructions = [
    {
      id: "android",
      icon: <Smartphone className="h-5 w-5 text-green-500" />,
      title: "Android (WireGuard App)",
      steps: [
        "Download WireGuard from Google Play Store",
        "Tap the '+' button to add a configuration",
        "Select 'Import from file or archive'",
        "Choose your downloaded .conf file",
        "Tap the toggle to connect",
      ],
    },
    {
      id: "ios",
      icon: <Apple className="h-5 w-5 text-gray-700" />,
      title: "iOS (WireGuard App)",
      steps: [
        "Download WireGuard from App Store",
        "Tap 'Add a tunnel' then 'Create from file or archive'",
        "Import your .conf file from Files app",
        "Toggle the switch to activate the tunnel",
      ],
    },
    {
      id: "desktop",
      icon: <Monitor className="h-5 w-5 text-blue-500" />,
      title: "Desktop (Windows/Mac/Linux)",
      steps: [
        "Install WireGuard from official website",
        "Click 'Add Tunnel' → 'Add tunnel from file'",
        "Select your .conf file",
        "Click 'Activate' to connect",
      ],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <HelpCircle className="h-5 w-5 mr-3 text-blue-500" />
          {t("setupInstructions")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {instructions.map((instruction) => (
            <div key={instruction.id} className="border border-gray-200 rounded-md">
              <Collapsible
                open={openSections.includes(instruction.id)}
                onOpenChange={() => toggleSection(instruction.id)}
              >
                <CollapsibleTrigger className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:bg-gray-50">
                  <div className="flex items-center">
                    {instruction.icon}
                    <span className="font-medium ml-3">{instruction.title}</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openSections.includes(instruction.id) ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                    {instruction.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </div>

        <Alert className="mt-4 border-warning bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertTitle className="text-gray-900">{t("importantNotice")}</AlertTitle>
          <AlertDescription className="text-gray-700 text-sm">
            {t("noticeDescription")}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
