import React from 'react';
import { useTranslation } from 'react-i18next';

function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="footer">
            <div className="footer-content">
                <p>{t('footer.rights')}</p>
                <div className="footer-links">
                    <a href="/privacy">{t('footer.privacy')}</a>
                    <a href="/terms">{t('footer.terms')}</a>
                    <a href="/contact">{t('footer.contacts')}</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer; 