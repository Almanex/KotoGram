import React, { useEffect, useState } from 'react';
import { getStories, getStoryById } from '../api/storyApi';
import { useNavigate } from 'react-router-dom';

function MyStoriesPage() {
    const [stories, setStories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStories = async () => {
            const savedStories = await getStories();
            setStories(savedStories);
        };
        fetchStories();
    }, []);

    const handleEditStory = async (id) => {
        const story = await getStoryById(id);
        // Перенаправляем на страницу редактирования с данными истории
        navigate('/edit', { state: { story } });
    };

    const handleDeleteStory = async (id) => {
        const updatedStories = stories.filter(story => story.id !== id);
        localStorage.setItem('stories', JSON.stringify(updatedStories));
        setStories(updatedStories);
        alert('История успешно удалена!');
    };

    return (
        <div className="my-stories-page">
            <h2>Мои истории</h2>
            {stories.length === 0 ? (
                <p>У вас пока нет сохраненных историй.</p>
            ) : (
                <ul>
                    {stories.map(story => (
                        <li key={story.id}>
                            <h3>{story.name} ({story.age} лет)</h3>
                            <p>{story.content}</p>
                            <button 
                                onClick={() => handleEditStory(story.id)}
                                className="edit-button"
                            >
                                Редактировать
                            </button>
                            <button 
                                onClick={() => handleDeleteStory(story.id)}
                                className="delete-button"
                            >
                                Удалить
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MyStoriesPage; 