import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function HomePage() {
    const { t } = useTranslation();

    const heroStyle = {
        backgroundImage: `url(${process.env.PUBLIC_URL + '/images/background.jpg'})`,
        backgroundSize: '200px 200px',
        backgroundRepeat: 'repeat',
        opacity: 0.9
    };

    return (
        <div className="home-page">
            <section className="hero" style={heroStyle}>
                <h1>{t('home.welcome')}</h1>
                <p>{t('home.subtitle')}</p>
                <Link to="/create" className="cta-button">
                    {t('home.createButton')}
                </Link>
            </section>
            
            <section className="features">
                <h2>{t('home.features.title')}</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>{t('home.features.personalization.title')}</h3>
                        <p>{t('home.features.personalization.description')}</p>
                    </div>
                    <div className="feature-card">
                        <h3>{t('home.features.audio.title')}</h3>
                        <p>{t('home.features.audio.description')}</p>
                    </div>
                    <div className="feature-card">
                        <h3>{t('home.features.collaboration.title')}</h3>
                        <p>{t('home.features.collaboration.description')}</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage; 