import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fa" : "en");
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={toggleLanguage}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      <Languages className="h-4 w-4 mr-1" />
      {language === "en" ? "فا" : "EN"}
    </Button>
  );
}
