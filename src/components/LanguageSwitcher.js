import React from "react";
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    return (
        <div style={{ textAlign: "right", padding: "10px" }}>
            <button onClick={() => changeLanguage("en")}>🇺🇸 English</button>
            <button onClick={() => changeLanguage("fr")}>🇫🇷 Français</button>
        </div>
    );
}

export default LanguageSwitcher;
