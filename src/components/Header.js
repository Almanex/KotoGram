import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

function Header() {
    const { t } = useTranslation();

    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <Link to="/">
                        <img src="/logo.png" alt={t('appName')} />
                        <span className="logo-text">{t('appName')}</span>
                    </Link>
                </div>
                <nav className="nav-menu">
                    <Link to="/" className="nav-link">{t('header.home')}</Link>
                    <Link to="/create" className="nav-link">{t('header.create')}</Link>
                    <Link to="/my-stories" className="nav-link">{t('header.myStories')}</Link>
                </nav>
                <LanguageSwitcher />
            </div>
        </header>
    );
}

export default Header; 