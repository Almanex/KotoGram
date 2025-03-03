import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const languages = [
        { code: 'ru', name: 'Русский' },
        { code: 'de', name: 'Deutsch' },
        { code: 'en', name: 'English' }
    ];

    return (
        <div className="language-switcher">
            <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
            >
                {languages.map(({ code, name }) => (
                    <option key={code} value={code}>
                        {name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default LanguageSwitcher; 