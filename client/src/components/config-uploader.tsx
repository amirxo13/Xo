import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";

interface UploadResult {
  success: boolean;
  message: string;
  configName?: string;
}

export function ConfigUploader() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (configContent: string) => {
      const response = await apiRequest("POST", "/api/configurations/upload", {
        content: configContent
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/configurations"] });
    },
  });

  const parseWireGuardConfig = (content: string) => {
    const lines = content.split('\n');
    const config: any = {
      privateKey: '',
      publicKey: '',
      endpoint: '',
      dns: '1.1.1.1, 1.0.0.1',
      mtu: 1280,
      addresses: []
    };

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
          if (key.toLowerCase() === 'privatekey') config.privateKey = value;
          if (key.toLowerCase() === 'address') config.addresses.push(value);
          if (key.toLowerCase() === 'dns') config.dns = value;
          if (key.toLowerCase() === 'mtu') config.mtu = parseInt(value) || 1280;
        }
        
        if (currentSection === '[peer]') {
          if (key.toLowerCase() === 'publickey') config.publicKey = value;
          if (key.toLowerCase() === 'endpoint') config.endpoint = value;
        }
      }
    }

    return config;
  };

  const processFiles = async (files: FileList) => {
    setUploadResults([]);
    const results: UploadResult[] = [];

    for (const file of Array.from(files)) {
      if (!file.name.endsWith('.conf')) {
        results.push({
          success: false,
          message: language === 'fa' ? `${file.name}: فرمت فایل نامعتبر` : `${file.name}: Invalid file format`
        });
        continue;
      }

      try {
        const content = await file.text();
        const parsedConfig = parseWireGuardConfig(content);
        
        if (!parsedConfig.privateKey || !parsedConfig.publicKey || !parsedConfig.endpoint) {
          results.push({
            success: false,
            message: language === 'fa' ? `${file.name}: کانفیگ ناقص` : `${file.name}: Incomplete configuration`
          });
          continue;
        }

        // Create configuration in database
        await uploadMutation.mutateAsync(content);
        
        results.push({
          success: true,
          message: language === 'fa' ? `${file.name}: بارگذاری موفق` : `${file.name}: Upload successful`,
          configName: file.name
        });

      } catch (error) {
        results.push({
          success: false,
          message: language === 'fa' ? `${file.name}: خطا در بارگذاری` : `${file.name}: Upload failed`
        });
      }
    }

    setUploadResults(results);
    
    const successCount = results.filter(r => r.success).length;
    if (successCount > 0) {
      toast({
        title: language === 'fa' ? "موفقیت" : "Success",
        description: language === 'fa' 
          ? `${successCount} کانفیگ بارگذاری شد`
          : `${successCount} configurations uploaded`,
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Upload className="h-5 w-5 mr-3 text-green-600" />
          {language === 'fa' ? "بارگذاری کانفیگ" : "Upload Configurations"}
          <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
            <FileText className="h-3 w-3 mr-1" />
            .conf
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging 
                ? "border-green-500 bg-green-100 dark:bg-green-900" 
                : "border-green-300 hover:border-green-400"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-sm text-green-700 dark:text-green-300 mb-4">
              {language === 'fa' 
                ? "فایل‌های .conf را اینجا رها کنید یا کلیک کنید"
                : "Drop .conf files here or click to browse"
              }
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {language === 'fa' ? "انتخاب فایل" : "Browse Files"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".conf"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-200">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              {language === 'fa' ? "نحوه دریافت کانفیگ Warp Plus:" : "How to get Warp Plus configs:"}
            </h4>
            <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
              <li>{language === 'fa' ? "به @generatewarpplusbot در تلگرام بروید" : "Go to @generatewarpplusbot on Telegram"}</li>
              <li>{language === 'fa' ? "دستور /start را ارسال کنید" : "Send /start command"}</li>
              <li>{language === 'fa' ? "فایل .conf دریافت شده را اینجا بارگذاری کنید" : "Upload the received .conf file here"}</li>
            </ol>
          </div>

          {uploadResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">
                {language === 'fa' ? "نتایج بارگذاری:" : "Upload Results:"}
              </h4>
              {uploadResults.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center p-2 rounded text-sm ${
                    result.success 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mr-2" />
                  )}
                  {result.message}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}