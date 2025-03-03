import React, { useEffect, useState, useRef } from 'react';
import { getStories, getStoryById, deleteStory } from '../api/storyApi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

function MyStoriesPage() {
    const [stories, setStories] = useState([]);
    const [expandedStories, setExpandedStories] = useState({}); // Для отслеживания открытых историй
    const [isPlaying, setIsPlaying] = useState({});
    const timeoutIds = useRef({}); // Добавляем ref для хранения таймеров для каждой истории
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchStories = async () => {
            const savedStories = await getStories();
            setStories(savedStories);
            // Инициализируем состояние развернутости для каждой истории
            const initialExpanded = {};
            const initialPlaying = {};
            savedStories.forEach(story => {
                initialExpanded[story.id] = false;
                initialPlaying[story.id] = false;
                timeoutIds.current[story.id] = []; // Инициализируем массив таймеров для каждой истории
            });
            setExpandedStories(initialExpanded);
            setIsPlaying(initialPlaying);
        };
        fetchStories();

        // Очищаем все таймеры при размонтировании компонента
        return () => {
            Object.values(timeoutIds.current).forEach(timeouts => {
                timeouts.forEach(id => clearTimeout(id));
            });
            window.speechSynthesis.cancel();
        };
    }, []);

    const handleEditStory = async (id) => {
        const story = await getStoryById(id);
        // Перенаправляем на страницу редактирования с данными истории
        navigate('/edit', { state: { story } });
    };

    const handlePlayStory = (story) => {
        if (isPlaying[story.id]) {
            window.speechSynthesis.cancel();
            if (timeoutIds.current[story.id]) {
                timeoutIds.current[story.id].forEach(id => clearTimeout(id));
                timeoutIds.current[story.id] = [];
            }
            setIsPlaying(prev => ({ ...prev, [story.id]: false }));
            return;
        }

        try {
            if (timeoutIds.current[story.id]) {
                timeoutIds.current[story.id].forEach(id => clearTimeout(id));
                timeoutIds.current[story.id] = [];
            }

            const currentLang = story.language || i18next.language;
            const voices = window.speechSynthesis.getVoices();
            
            const languageVoices = {
                'ru': ['ru-RU', 'ru'],
                'de': ['de-DE', 'de'],
                'en': ['en-US', 'en-GB', 'en']
            };

            const getPreferredVoice = (langCodes) => {
                const premiumVoice = voices.find(voice => 
                    langCodes.some(code => voice.lang.includes(code)) &&
                    (voice.name.includes('Premium') || 
                     voice.name.includes('Enhanced') || 
                     voice.name.includes('Neural'))
                );
                if (premiumVoice) return premiumVoice;

                const femaleVoice = voices.find(voice => 
                    langCodes.some(code => voice.lang.includes(code)) &&
                    (voice.name.includes('Female') || 
                     voice.name.includes('Woman') || 
                     voice.name.includes('f'))
                );
                if (femaleVoice) return femaleVoice;

                return voices.find(voice => 
                    langCodes.some(code => voice.lang.includes(code))
                );
            };

            const preferredVoice = getPreferredVoice(languageVoices[currentLang] || languageVoices['en']);

            // Улучшенная разбивка текста на предложения без включения знаков препинания
            const sentences = story.content.split(/[.!?]+/).map(sentence => sentence.trim()).filter(Boolean);
            
            let currentIndex = 0;
            sentences.forEach((sentence, index) => {
                const utterance = new SpeechSynthesisUtterance(sentence);
                
                utterance.voice = preferredVoice;
                utterance.lang = preferredVoice ? preferredVoice.lang : languageVoices[currentLang][0];
                utterance.rate = 0.9;
                utterance.pitch = 1.0;
                utterance.volume = 1.0;

                const delay = 800; // Пауза между предложениями
                
                const timeoutId = setTimeout(() => {
                    utterance.onstart = () => {
                        if (currentIndex === 0) {
                            setIsPlaying(prev => ({ ...prev, [story.id]: true }));
                        }
                    };

                    utterance.onend = () => {
                        currentIndex++;
                        if (currentIndex >= sentences.length) {
                            setIsPlaying(prev => ({ ...prev, [story.id]: false }));
                            if (timeoutIds.current[story.id]) {
                                timeoutIds.current[story.id].forEach(id => clearTimeout(id));
                                timeoutIds.current[story.id] = [];
                            }
                        }
                    };

                    utterance.onerror = () => {
                        setIsPlaying(prev => ({ ...prev, [story.id]: false }));
                        if (timeoutIds.current[story.id]) {
                            timeoutIds.current[story.id].forEach(id => clearTimeout(id));
                            timeoutIds.current[story.id] = [];
                        }
                    };

                    window.speechSynthesis.speak(utterance);
                }, index * delay);

                if (!timeoutIds.current[story.id]) {
                    timeoutIds.current[story.id] = [];
                }
                timeoutIds.current[story.id].push(timeoutId);
            });
        } catch (error) {
            console.error('Error playing story:', error);
            setIsPlaying(prev => ({ ...prev, [story.id]: false }));
            if (timeoutIds.current[story.id]) {
                timeoutIds.current[story.id].forEach(id => clearTimeout(id));
                timeoutIds.current[story.id] = [];
            }
        }
    };

    const handleDeleteStory = async (id) => {
        if (window.confirm(t('myStories.confirmDelete'))) {
            await deleteStory(id);
            setStories(stories.filter(story => story.id !== id));
        }
    };

    const toggleStory = (id) => {
        setExpandedStories(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="my-stories-page">
            <h2>{t('myStories.title')}</h2>
            {stories.length === 0 ? (
                <p className="no-stories">{t('myStories.noStories')}</p>
            ) : (
                <div className="stories-list">
                    {stories.map(story => (
                        <div key={story.id} className="story-container">
                            <div className="story-header">
                                <h3 onClick={() => toggleStory(story.id)} className="story-title">
                                    <span className="expand-icon">
                                        {expandedStories[story.id] ? '▼' : '▶'}
                                    </span>
                                    {story.title || t('myStories.defaultTitle', { name: story.name })}
                                </h3>
                                <div className="story-header-buttons">
                                    <button
                                        onClick={() => handlePlayStory(story)}
                                        className={`play-button ${isPlaying[story.id] ? 'playing' : ''}`}
                                    >
                                        {isPlaying[story.id] ? t('createStory.buttons.stop') : t('createStory.buttons.play')}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteStory(story.id)}
                                        className="delete-button"
                                    >
                                        {t('myStories.deleteButton')}
                                    </button>
                                </div>
                            </div>
                            {expandedStories[story.id] && (
                                <div className="story-content">
                                    {story.content}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyStoriesPage; 