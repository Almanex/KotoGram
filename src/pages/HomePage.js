import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    const heroStyle = {
        backgroundImage: `url(${process.env.PUBLIC_URL + '/images/background.jpg'})`,
        backgroundSize: '200px 200px',
        backgroundRepeat: 'repeat',
        opacity: 0.9
    };

    return (
        <div className="home-page">
            <section className="hero" style={heroStyle}>
                <h1>Добро пожаловать в Skazochki!</h1>
                <p>Создавайте уникальные истории для ваших детей</p>
                <Link to="/create" className="cta-button">
                    Создать историю
                </Link>
            </section>
            
            <section className="features">
                <h2>Возможности приложения</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>Персонализация</h3>
                        <p>Создавайте истории с учетом интересов вашего ребенка</p>
                    </div>
                    <div className="feature-card">
                        <h3>Аудио-формат</h3>
                        <p>Слушайте истории в профессиональном озвучении</p>
                    </div>
                    <div className="feature-card">
                        <h3>Совместное творчество</h3>
                        <p>Редактируйте истории вместе с детьми</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage; 