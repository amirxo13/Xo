export const translations = {
  en: {
    // Header
    appTitle: "XO - Internet Freedom",
    connectionStatus: {
      connected: "Connected",
      disconnected: "Disconnected",
      connecting: "Connecting...",
    },

    // Privacy Notice
    privacyNotice: "Privacy Notice",
    privacyDescription: "This tool generates WireGuard configurations locally. No user data is logged or stored on servers.",

    // Config Generator
    generateConfig: "Generate Configuration",
    serverRegion: "Server Region",
    autoRecommended: "Auto (Recommended)",
    advancedOptions: "Advanced Options",
    dnsServer: "DNS Server",
    mtuSize: "MTU Size",
    enableWarpPlus: "Enable Warp+ (if available)",
    generateConfiguration: "Generate Configuration",
    generatingConfig: "Generating configuration...",

    // Config Tester
    configTesting: "Configuration Testing",
    connectionTest: "Connection Test",
    speedTest: "Speed Test",
    dnsResolution: "DNS Resolution",
    startTesting: "Start Testing",
    configValid: "Configuration Valid",
    pending: "Pending",
    active: "Active",
    resolved: "Resolved",

    // Config Manager
    configFiles: "Configuration Files",
    configurations: "configurations",
    valid: "Valid",
    failed: "Failed",
    generated: "Generated",
    server: "Server",
    speed: "Speed",
    downloadAll: "Download All Valid",
    clearInvalid: "Clear Invalid",

    // Instructions
    setupInstructions: "Setup Instructions",
    importantNotice: "Important Notice",
    noticeDescription: "This tool uses unofficial Cloudflare Warp APIs. Usage may be subject to Cloudflare's terms of service. Check local laws regarding VPN usage in your region.",

    // Actions
    download: "Download",
    copy: "Copy to clipboard",
    delete: "Delete",
    retry: "Retry test",

    // Footer
    madeWith: "Made with ❤️ for privacy",
    noLogging: "No logging",
    privacyPolicy: "Privacy Policy",
    
    // Error Messages
    networkError: "Network connection failed. Please check your internet connection.",
    apiError: "Unable to connect to configuration service. This may be due to network restrictions.",
    iranNetworkNotice: "If you're in Iran, the service may be blocked. Try using a VPN or proxy.",
  },
  fa: {
    // Header
    appTitle: "XO - آزادی اینترنت",
    connectionStatus: {
      connected: "متصل",
      disconnected: "قطع شده",
      connecting: "در حال اتصال...",
    },

    // Privacy Notice
    privacyNotice: "اطلاعیه حریم خصوصی",
    privacyDescription: "این ابزار پیکربندی‌های WireGuard را به صورت محلی تولید می‌کند. هیچ داده کاربری ثبت یا ذخیره نمی‌شود.",

    // Config Generator
    generateConfig: "تولید پیکربندی",
    serverRegion: "منطقه سرور",
    autoRecommended: "خودکار (پیشنهادی)",
    advancedOptions: "گزینه‌های پیشرفته",
    dnsServer: "سرور DNS",
    mtuSize: "اندازه MTU",
    enableWarpPlus: "فعال‌سازی Warp+ (در صورت وجود)",
    generateConfiguration: "تولید پیکربندی",
    generatingConfig: "در حال تولید پیکربندی...",

    // Config Tester
    configTesting: "تست پیکربندی",
    connectionTest: "تست اتصال",
    speedTest: "تست سرعت",
    dnsResolution: "حل‌وفصل DNS",
    startTesting: "شروع تست",
    configValid: "پیکربندی معتبر",
    pending: "در انتظار",
    active: "فعال",
    resolved: "حل شده",

    // Config Manager
    configFiles: "فایل‌های پیکربندی",
    configurations: "پیکربندی",
    valid: "معتبر",
    failed: "ناموفق",
    generated: "تولید شده",
    server: "سرور",
    speed: "سرعت",
    downloadAll: "دانلود همه معتبرها",
    clearInvalid: "پاک‌سازی نامعتبرها",

    // Instructions
    setupInstructions: "دستورالعمل نصب",
    importantNotice: "اطلاعیه مهم",
    noticeDescription: "این ابزار از API های غیررسمی Cloudflare Warp استفاده می‌کند. استفاده ممکن است مشمول شرایط خدمات Cloudflare باشد. قوانین محلی مربوط به استفاده از VPN در منطقه خود را بررسی کنید.",

    // Actions
    download: "دانلود",
    copy: "کپی در کلیپ‌بورد",
    delete: "حذف",
    retry: "تست مجدد",

    // Footer
    madeWith: "با ❤️ برای حریم خصوصی ساخته شده",
    noLogging: "بدون ثبت لاگ",
    privacyPolicy: "سیاست حریم خصوصی",
    
    // Error Messages
    networkError: "اتصال شبکه ناموفق بود. لطفاً اتصال اینترنت خود را بررسی کنید.",
    apiError: "عدم اتصال به سرویس پیکربندی. این ممکن است به دلیل محدودیت‌های شبکه باشد.",
    iranNetworkNotice: "اگر در ایران هستید، سرویس ممکن است مسدود باشد. از VPN یا پروکسی استفاده کنید.",
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
