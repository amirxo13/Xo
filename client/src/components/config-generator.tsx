import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, Settings, Wand2 } from "lucide-react";
import { generateConfigSchema, type GenerateConfigRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";

export function ConfigGenerator() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");

  const form = useForm<GenerateConfigRequest>({
    resolver: zodResolver(generateConfigSchema),
    defaultValues: {
      region: "auto",
      dns: "1.1.1.1, 1.0.0.1",
      mtu: 1280,
      warpPlus: false,
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: GenerateConfigRequest) => {
      const response = await apiRequest("POST", "/api/configurations/generate", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/configurations"] });
      toast({
        title: "Success",
        description: "Configuration generated successfully",
      });
      form.reset();
    },
    onError: (error) => {
      let errorMessage = error.message;
      let additionalInfo = "";
      
      // Check if it's a network-related error
      if (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('connect')) {
        errorMessage = t("networkError");
        additionalInfo = t("iranNetworkNotice");
      } else if (error.message.includes('API') || error.message.includes('restrictions')) {
        errorMessage = t("apiError");
        additionalInfo = t("iranNetworkNotice");
      }

      toast({
        title: "خطا / Error",
        description: `${errorMessage} ${additionalInfo}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: GenerateConfigRequest) => {
    setProgress(0);
    setProgressText(t("generatingConfig"));

    // Simulate progress
    const steps = [
      "Connecting to Warp API...",
      "Fetching server endpoints...",
      "Generating key pair...",
      "Creating configuration...",
      "Validating configuration...",
    ];

    for (let i = 0; i < steps.length; i++) {
      setProgressText(steps[i]);
      setProgress((i + 1) * 20);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    generateMutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Settings className="h-5 w-5 mr-3 text-primary" />
          {t("generateConfig")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Settings className="h-4 w-4 mr-1" />
                    {t("serverRegion")}
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="auto">{t("autoRecommended")}</SelectItem>
                      <SelectItem value="us-east">US East</SelectItem>
                      <SelectItem value="us-west">US West</SelectItem>
                      <SelectItem value="eu-central">EU Central</SelectItem>
                      <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="border-t pt-4">
              <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                <CollapsibleTrigger className="flex items-center text-sm text-gray-600 hover:text-gray-800 mb-3">
                  <ChevronRight className={`h-4 w-4 mr-2 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
                  {t("advancedOptions")}
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="dns"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("dnsServer")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mtu"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("mtuSize")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1200}
                            max={1500}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="warpPlus"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm">
                          {t("enableWarpPlus")}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </CollapsibleContent>
              </Collapsible>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={generateMutation.isPending}
            >
              <Wand2 className="h-4 w-4 mr-2" />
              {t("generateConfiguration")}
            </Button>
          </form>
        </Form>

        {generateMutation.isPending && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <div className="flex items-center mb-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-3" />
              <span className="text-sm font-medium">{progressText}</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
