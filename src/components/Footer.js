import React from 'react';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; 2024 КотоГрам. Все права защищены.</p>
                <div className="footer-links">
                    <a href="/privacy">Политика конфиденциальности</a>
                    <a href="/terms">Условия использования</a>
                    <a href="/contact">Контакты</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer; 