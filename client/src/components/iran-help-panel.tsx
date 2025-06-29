import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  ChevronDown, 
  Wifi, 
  AlertTriangle, 
  CheckCircle,
  Globe,
  Shield,
  Download,
  Smartphone
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export function IranHelpPanel() {
  const { t, language } = useLanguage();
  const [openSections, setOpenSections] = useState<string[]>(['troubleshooting']);

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const helpSections = [
    {
      id: "troubleshooting",
      icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
      title: language === 'fa' ? "رفع مشکلات شبکه" : "Network Troubleshooting",
      content: [
        {
          title: language === 'fa' ? "اگر برنامه کار نمی‌کند:" : "If the app doesn't work:",
          steps: language === 'fa' ? [
            "ابتدا اتصال اینترنت خود را بررسی کنید",
            "از یک VPN یا پروکسی استفاده کنید",
            "چندین بار تلاش کنید - بعضی اوقات کار می‌کند",
            "ساعات مختلف روز امتحان کنید",
            "DNS خود را به 1.1.1.1 و 1.0.0.1 تغییر دهید"
          ] : [
            "First check your internet connection",
            "Use a VPN or proxy service",
            "Try multiple times - sometimes it works",
            "Try at different times of day",
            "Change your DNS to 1.1.1.1 and 1.0.0.1"
          ]
        }
      ]
    },
    {
      id: "alternatives",
      icon: <Globe className="h-5 w-5 text-blue-500" />,
      title: language === 'fa' ? "راه‌های جایگزین" : "Alternative Methods",
      content: [
        {
          title: language === 'fa' ? "اگر API مسدود است:" : "If API is blocked:",
          steps: language === 'fa' ? [
            "از VPN موقت برای تولید کانفیگ استفاده کنید",
            "کانفیگ‌های تولید شده را ذخیره کنید",
            "VPN را خاموش کنید و کانفیگ‌ها را امتحان کنید",
            "با دوستان کانفیگ‌های کارآمد را به اشتراک بگذارید",
            "هر چند روز یکبار کانفیگ جدید تولید کنید"
          ] : [
            "Use temporary VPN to generate configs",
            "Save generated configurations",
            "Turn off VPN and test the configs",
            "Share working configs with friends",
            "Generate new configs every few days"
          ]
        }
      ]
    },
    {
      id: "usage",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      title: language === 'fa' ? "نحوه استفاده صحیح" : "Proper Usage",
      content: [
        {
          title: language === 'fa' ? "مراحل استفاده:" : "Usage Steps:",
          steps: language === 'fa' ? [
            "ابتدا چند کانفیگ مختلف تولید کنید",
            "هر کانفیگ را تست کنید",
            "کانفیگ‌های معتبر را دانلود کنید",
            "در برنامه WireGuard وارد کنید",
            "بهترین کانفیگ را برای استفاده انتخاب کنید"
          ] : [
            "First generate several different configs",
            "Test each configuration",
            "Download valid configurations",
            "Import into WireGuard app",
            "Choose the best config for daily use"
          ]
        }
      ]
    },
    {
      id: "safety",
      icon: <Shield className="h-5 w-5 text-purple-500" />,
      title: language === 'fa' ? "نکات امنیتی" : "Safety Tips",
      content: [
        {
          title: language === 'fa' ? "نکات مهم امنیتی:" : "Important Safety Notes:",
          steps: language === 'fa' ? [
            "هرگز کلیدهای خصوصی خود را به اشتراک نگذارید",
            "فقط از منابع معتبر کانفیگ دریافت کنید",
            "به‌طور منظم کانفیگ‌های قدیمی را حذف کنید",
            "از چند کانفیگ پشتیبان استفاده کنید",
            "قوانین محلی را رعایت کنید"
          ] : [
            "Never share your private keys",
            "Only get configs from trusted sources",
            "Regularly delete old configurations",
            "Use multiple backup configs",
            "Follow local laws and regulations"
          ]
        }
      ]
    }
  ];

  return (
    <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <HelpCircle className="h-5 w-5 mr-3 text-orange-600" />
          {language === 'fa' ? "راهنمای کاربران ایرانی" : "Guide for Iranian Users"}
          <Badge variant="secondary" className="ml-2 bg-orange-200 text-orange-800">
            {language === 'fa' ? "مهم" : "Important"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 border-orange-300 bg-orange-100 dark:bg-orange-900">
          <Wifi className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800 dark:text-orange-200">
            {language === 'fa' ? "توجه مهم" : "Important Notice"}
          </AlertTitle>
          <AlertDescription className="text-orange-700 dark:text-orange-300 text-sm">
            {language === 'fa' 
              ? "این برنامه برای کاربران ایرانی طراحی شده و ممکن است به دلیل محدودیت‌های شبکه کار نکند. راه‌حل‌های زیر را امتحان کنید."
              : "This app is designed for Iranian users and may not work due to network restrictions. Try the solutions below."
            }
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          {helpSections.map((section) => (
            <div key={section.id} className="border border-orange-200 rounded-md bg-white dark:bg-gray-800">
              <Collapsible
                open={openSections.includes(section.id)}
                onOpenChange={() => toggleSection(section.id)}
              >
                <CollapsibleTrigger className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-orange-50 dark:hover:bg-gray-700 focus:outline-none">
                  <div className="flex items-center">
                    {section.icon}
                    <span className="font-medium ml-3">{section.title}</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openSections.includes(section.id) ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  {section.content.map((item, index) => (
                    <div key={index} className="mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {item.title}
                      </h4>
                      <ol className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-decimal list-inside">
                        {item.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="leading-relaxed">{step}</li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
          <div className="flex items-start space-x-3">
            <Smartphone className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                {language === 'fa' ? "نصب WireGuard" : "Install WireGuard"}
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                {language === 'fa' 
                  ? "برای استفاده از کانفیگ‌ها، ابتدا WireGuard را نصب کنید:"
                  : "To use the configurations, first install WireGuard:"
                }
              </p>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="text-blue-700 border-blue-300 hover:bg-blue-100">
                  <Download className="h-4 w-4 mr-2" />
                  {language === 'fa' ? "دانلود برای اندروید" : "Download for Android"}
                </Button>
                <Button variant="outline" size="sm" className="text-blue-700 border-blue-300 hover:bg-blue-100 ml-2">
                  <Download className="h-4 w-4 mr-2" />
                  {language === 'fa' ? "دانلود برای iOS" : "Download for iOS"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}