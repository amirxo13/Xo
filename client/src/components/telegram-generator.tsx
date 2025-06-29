import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MessageCircle, Download, Zap, Crown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";

export function TelegramGenerator() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");

  const telegramMutation = useMutation({
    mutationFn: async (count: number) => {
      const response = await apiRequest("POST", "/api/configurations/telegram-batch", {
        count,
        dns: "1.1.1.1, 1.0.0.1",
        mtu: 1280
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/configurations"] });
      toast({
        title: language === 'fa' ? "موفقیت" : "Success",
        description: language === 'fa' 
          ? `${data.count} کانفیگ Warp Plus تولید شد`
          : `Generated ${data.count} Warp Plus configurations`,
      });
      setProgress(0);
      setProgressText("");
    },
    onError: (error) => {
      toast({
        title: language === 'fa' ? "خطا" : "Error",
        description: error.message,
        variant: "destructive",
      });
      setProgress(0);
      setProgressText("");
    },
  });

  const generateFromTelegram = async (count: number) => {
    setProgress(0);
    
    const steps = language === 'fa' ? [
      "اتصال به بات تلگرام...",
      "دریافت کانفیگ‌های Warp Plus...",
      "بهینه‌سازی برای ایران...",
      "ذخیره کانفیگ‌ها...",
      "تکمیل!"
    ] : [
      "Connecting to Telegram bot...",
      "Fetching Warp Plus configs...",
      "Optimizing for Iran...",
      "Saving configurations...",
      "Complete!"
    ];

    for (let i = 0; i < steps.length; i++) {
      setProgressText(steps[i]);
      setProgress((i + 1) * 20);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    telegramMutation.mutate(count);
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <MessageCircle className="h-5 w-5 mr-3 text-purple-600" />
          {language === 'fa' ? "تولید از بات تلگرام" : "Telegram Bot Generator"}
          <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-800">
            <Crown className="h-3 w-3 mr-1" />
            Warp+
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-md border border-purple-200">
            <div className="flex items-start space-x-3">
              <Zap className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                  {language === 'fa' ? "کانفیگ‌های Warp Plus رایگان" : "Free Warp Plus Configurations"}
                </h4>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  {language === 'fa' 
                    ? "از بات @generatewarpplusbot در تلگرام کانفیگ‌های Warp Plus با کیفیت بالا دریافت کنید"
                    : "Get high-quality Warp Plus configurations from @generatewarpplusbot on Telegram"
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => generateFromTelegram(3)}
              disabled={telegramMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              {language === 'fa' ? "۳ کانفیگ" : "3 Configs"}
            </Button>
            <Button
              onClick={() => generateFromTelegram(5)}
              disabled={telegramMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              {language === 'fa' ? "۵ کانفیگ" : "5 Configs"}
            </Button>
          </div>

          <Button
            onClick={() => generateFromTelegram(10)}
            disabled={telegramMutation.isPending}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <Crown className="h-4 w-4 mr-2" />
            {language === 'fa' ? "۱۰ کانفیگ پریمیوم" : "10 Premium Configs"}
          </Button>
        </div>

        {telegramMutation.isPending && (
          <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950 rounded-md">
            <div className="flex items-center mb-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-3" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                {progressText}
              </span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            {language === 'fa' 
              ? "⚡ کانفیگ‌های تلگرام معمولاً سرعت و پایداری بهتری دارند"
              : "⚡ Telegram configs usually have better speed and stability"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}