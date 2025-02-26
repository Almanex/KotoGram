import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CreateStoryPage from './pages/CreateStoryPage';
import EditStoryPage from './pages/EditStoryPage';
import ReadStoryPage from './pages/ReadStoryPage';
import MyStoriesPage from './pages/MyStoriesPage';
import './styles/App.css';

function App() {
    return (
        <Router>
            <div className="app">
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/create" element={<CreateStoryPage />} />
                        <Route path="/edit" element={<EditStoryPage />} />
                        <Route path="/read/:id" element={<ReadStoryPage />} />
                        <Route path="/mystories" element={<MyStoriesPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App; 