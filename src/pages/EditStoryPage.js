import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveStory } from '../api/storyApi';

function EditStoryPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { story } = location.state;

    const [storyData, setStoryData] = useState(story);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStoryData({ ...storyData, [name]: value });
    };

    const handleSaveStory = async () => {
        try {
            await saveStory(storyData);
            alert('История успешно обновлена!');
            navigate('/mystories'); // Перенаправляем на страницу "Мои истории"
        } catch (error) {
            console.error('Error saving story:', error);
            alert('Произошла ошибка при обновлении истории.');
        }
    };

    const handlePlayStory = () => {
        const utterance = new SpeechSynthesisUtterance(storyData.content);
        utterance.lang = 'ru-RU'; // Устанавливаем язык
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="edit-story-page">
            <h2>Редактирование истории</h2>
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
                        Возраст:
                        <input 
                            type="number" 
                            name="age" 
                            value={storyData.age} 
                            onChange={handleInputChange}
                            required 
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
                        />
                    </label>
                </div>
                <button 
                    type="button" 
                    onClick={handleSaveStory}
                >
                    Сохранить изменения
                </button>
                <button 
                    onClick={handlePlayStory}
                    className="play-button"
                >
                    Воспроизвести
                </button>
            </form>
        </div>
    );
}

export default EditStoryPage; 