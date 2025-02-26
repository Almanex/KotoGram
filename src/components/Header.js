import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <Link to="/">
                        <img src="/logo.png" alt="Skazochki" />
                    </Link>
                </div>
                <nav className="nav-menu">
                    <Link to="/" className="nav-link">Главная</Link>
                    <Link to="/create" className="nav-link">Создать историю</Link>
                    <Link to="/mystories" className="nav-link">Мои истории</Link>
                </nav>
            </div>
        </header>
    );
}

export default Header; 