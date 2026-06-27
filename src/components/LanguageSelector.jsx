import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  useEffect(() => {
    const currentLang = i18n.language?.startsWith("fa") ? "fa" : "en";
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === "fa" ? "rtl" : "ltr";
  }, [i18n.language]);

  const currentValue = i18n.language?.startsWith("fa") ? "fa" : "en";

  return (
    <select value={currentValue} onChange={changeLanguage}>
      <option value="fa">فارسی</option>
      <option value="en">English</option>
    </select>
  );
}

export default LanguageSelector;
