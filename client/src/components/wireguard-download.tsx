import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Smartphone, Monitor, Apple, Zap, ExternalLink } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export function WireGuardDownload() {
  const { language } = useLanguage();

  const downloadLinks = [
    {
      name: "Windows",
      icon: Monitor,
      url: "https://download.wireguard.com/windows-client/wireguard-installer.exe",
      direct: true,
      description: language === 'fa' ? "ویندوز ۷ و بالاتر" : "Windows 7+",
    },
    {
      name: "Android",
      icon: Smartphone,
      url: "https://play.google.com/store/apps/details?id=com.wireguard.android",
      direct: false,
      description: language === 'fa' ? "گوگل پلی" : "Google Play",
    },
    {
      name: "Android (F-Droid)",
      icon: Smartphone,
      url: "https://f-droid.org/en/packages/com.wireguard.android/",
      direct: false,
      description: language === 'fa' ? "F-Droid (بدون فیلتر)" : "F-Droid (No filter)",
      recommended: true,
    },
    {
      name: "iOS",
      icon: Apple,
      url: "https://apps.apple.com/us/app/wireguard/id1451685025",
      direct: false,
      description: language === 'fa' ? "اپ استور" : "App Store",
    }
  ];

  const handleDownload = (link: typeof downloadLinks[0]) => {
    if (link.direct) {
      // For direct downloads, use fetch to check if accessible
      fetch(link.url, { method: 'HEAD', mode: 'no-cors' })
        .then(() => {
          window.open(link.url, '_blank');
        })
        .catch(() => {
          // If direct fails, open in new tab anyway
          window.open(link.url, '_blank');
        });
    } else {
      window.open(link.url, '_blank');
    }
  };

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Download className="h-5 w-5 mr-3 text-blue-600" />
          {language === 'fa' ? "دانلود WireGuard" : "Download WireGuard"}
          <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
            <Zap className="h-3 w-3 mr-1" />
            {language === 'fa' ? "رایگان" : "Free"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              {language === 'fa' 
                ? "⚠️ در ایران ممکن است نیاز به فیلترشکن برای دانلود داشته باشید"
                : "⚠️ In Iran, you may need a VPN to download WireGuard"
              }
            </p>
          </div>

          <div className="grid gap-3">
            {downloadLinks.map((link, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  link.recommended 
                    ? "border-green-300 bg-green-50 dark:bg-green-950" 
                    : "border-gray-200 bg-white dark:bg-gray-800"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <link.icon className={`h-5 w-5 ${link.recommended ? 'text-green-600' : 'text-gray-600'}`} />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{link.name}</span>
                      {link.recommended && (
                        <Badge className="bg-green-600 text-white text-xs">
                          {language === 'fa' ? "توصیه شده" : "Recommended"}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{link.description}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleDownload(link)}
                  className={link.recommended ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  {language === 'fa' ? "دانلود" : "Download"}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 text-sm">
              {language === 'fa' ? "نحوه استفاده:" : "How to use:"}
            </h4>
            <ol className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
              <li>{language === 'fa' ? "WireGuard را دانلود و نصب کنید" : "Download and install WireGuard"}</li>
              <li>{language === 'fa' ? "فایل کانفیگ .conf را از بالا دانلود کنید" : "Download a .conf config file from above"}</li>
              <li>{language === 'fa' ? "فایل را در WireGuard import کنید" : "Import the file into WireGuard"}</li>
              <li>{language === 'fa' ? "روی Connect کلیک کنید" : "Click Connect"}</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}