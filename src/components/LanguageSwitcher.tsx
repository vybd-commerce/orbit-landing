import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language.startsWith("zh") ? "zh" : "en";

  const toggle = (lang: "en" | "zh") => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="lang-switcher">
      <button
        className={`lang-btn ${current === "en" ? "lang-btn--active" : ""}`}
        onClick={() => toggle("en")}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="lang-divider">|</span>
      <button
        className={`lang-btn ${current === "zh" ? "lang-btn--active" : ""}`}
        onClick={() => toggle("zh")}
        aria-label="切换为中文"
      >
        中文
      </button>
    </div>
  );
}
