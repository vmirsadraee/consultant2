import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "fa",
    supportedLngs: ["fa", "en"],
    interpolation: {
      escapeValue: false,
    },
    resources: {
      fa: {
        translation: {
          about: "درباره ما",
          support: "پشتیبانی",
          payments: "پرداخت‌ها",
          financialSummary: "خلاصه مالی",
          basicInfo: "اطلاعات پایه",
          beforeExecution: "قبل از اجرا",
          duringExecution: "حین اجرا",
          expertReview: "نظارت موردی",
          services: "خدمات کارگاهی",
          afterExecution: "بعد از اجرا",
          invoiceStatus: "صورت وضعیت",
          home:"خانه",
        },
      },
      en: {
        translation: {
          home: "Home",
          support: "Support",
          payments: "Payments",
          financialSummary: "Financial Summary",
          basicInfo: "Basic Information",
          beforeExecution: "Before Execution",
          duringExecution: "During Execution",
          expertReview: "Case Reviews",
          services: "Workshop Services",
          afterExecution: "After Execution",
          invoiceStatus: "Invoice Status",
          about: "About Us",
          },
      },
    },
  });

export default i18n;
