import React, { useState, useEffect } from 'react';
import { generateContent } from '../api/geminiApi';
import { saveStory } from '../api/storyApi';
import backgroundImage from '../images/background.jpg';

function CreateStoryPage() {
    const pageStyle = {
        '--background-image': `url(${backgroundImage})`
    };

    const [storyData, setStoryData] = useState({
        name: '',
        age: '',
        gender: 'male', // Добавляем пол
        interests: '',
        template: '1'
    });
    const [story, setStory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Добавляем эффект для очистки при размонтировании или изменении истории
    useEffect(() => {
        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
                setIsPlaying(false);
            }
        };
    }, [story]);

    useEffect(() => {
        // Проверяем поддержку Web Speech API
        if (!window.speechSynthesis) {
            setError('Ваш браузер не поддерживает функцию чтения вслух.');
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStoryData({ ...storyData, [name]: value });
    };

    const handleGenerateStory = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await generateContent(storyData);
            setStory(result.content);
        } catch (error) {
            console.error('Error generating story:', error);
            setError('Произошла ошибка при генерации истории. Пожалуйста, попробуйте еще раз.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveStory = async () => {
        try {
            setIsLoading(true);
            const savedStory = await saveStory({
                ...storyData,
                content: story,
                createdAt: new Date().toISOString()
            });
            alert('История успешно сохранена!');
            // Можно добавить редирект на страницу "Мои истории"
        } catch (error) {
            console.error('Error saving story:', error);
            setError('Произошла ошибка при сохранении истории.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePlayStory = () => {
        if (!story) return;

        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            return;
        }

        try {
            // Разбиваем текст на предложения
            const sentences = story.match(/[^.!?]+[.!?]+/g) || [story];
            
            // Создаем очередь для воспроизведения
            sentences.forEach((sentence, index) => {
                const utterance = new SpeechSynthesisUtterance(sentence.trim());
                utterance.lang = 'ru-RU';
                utterance.rate = 0.9;
                utterance.pitch = 1;

                // Для последнего предложения добавляем обработчик окончания
                if (index === sentences.length - 1) {
                    utterance.onend = () => {
                        setIsPlaying(false);
                    };
                }

                utterance.onerror = (event) => {
                    console.error('Speech synthesis error:', event);
                    setIsPlaying(false);
                    setError('Произошла ошибка при воспроизведении истории.');
                };

                window.speechSynthesis.speak(utterance);
            });

            setIsPlaying(true);
        } catch (error) {
            console.error('Error playing story:', error);
            setError('Произошла ошибка при воспроизведении истории.');
            setIsPlaying(false);
        }
    };

    const handlePlayError = (error) => {
        console.error('Error playing story:', error);
        setIsPlaying(false);
        setError('Произошла ошибка при воспроизведении истории. Попробуйте еще раз.');
    };

    return (
        <div className="create-story-page" style={pageStyle}>
            <h2>Создание истории</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label>
                        Имя ребенка:
                        <input 
                            type="text" 
                            name="name" 
                            value={storyData.name} 
                            onChange={handleInputChange}
                            required 
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Пол:
                        <select 
                            name="gender" 
                            value={storyData.gender} 
                            onChange={handleInputChange}
                        >
                            <option value="male">Мальчик</option>
                            <option value="female">Девочка</option>
                        </select>
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Возраст:
                        <input 
                            type="number" 
                            name="age" 
                            value={storyData.age} 
                            onChange={handleInputChange}
                            required 
                            min="1"
                            max="12"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Интересы:
                        <input 
                            type="text" 
                            name="interests" 
                            value={storyData.interests} 
                            onChange={handleInputChange}
                            required 
                            placeholder="Например: космос, динозавры, принцессы"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Тип истории:
                        <select 
                            name="template" 
                            value={storyData.template} 
                            onChange={handleInputChange}
                        >
                            <option value="1">Космические приключения</option>
                            <option value="2">Волшебная сказка</option>
                            <option value="3">Приключения с животными</option>
                            <option value="4">Путешествия во времени</option>
                        </select>
                    </label>
                </div>
                <button 
                    type="button" 
                    onClick={handleGenerateStory}
                    disabled={isLoading}
                >
                    {isLoading ? 'Генерация...' : 'Сгенерировать историю'}
                </button>
            </form>
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            
            {story && (
                <div className="story-container">
                    <h3>Сгенерированная история:</h3>
                    <div className="story-content">
                        {story}
                    </div>
                    <div className="story-actions">
                        <button 
                            onClick={handleSaveStory}
                            disabled={isLoading}
                            className="save-button"
                        >
                            {isLoading ? 'Сохранение...' : 'Сохранить историю'}
                        </button>
                        <button 
                            onClick={() => {/* Добавить функционал редактирования */}}
                            className="edit-button"
                        >
                            Редактировать
                        </button>
                        <button 
                            onClick={handlePlayStory}
                            className={`play-button ${isPlaying ? 'playing' : ''}`}
                            disabled={!story || isLoading}
                        >
                            {isPlaying ? 'Остановить' : 'Воспроизвести'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateStoryPage; 