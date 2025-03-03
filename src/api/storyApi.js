import i18next from 'i18next';

// Временное решение для хранения историй в localStorage
export const saveStory = async (storyData) => {
    try {
        // Получаем существующие истории
        const stories = JSON.parse(localStorage.getItem('stories') || '[]');
        
        // Создаем новую историю
        const newStory = {
            id: Date.now().toString(),
            ...storyData,
            language: i18next.language
        };

        // Добавляем новую историю в массив
        stories.push(newStory);

        // Сохраняем обновленный массив в localStorage
        localStorage.setItem('stories', JSON.stringify(stories));
        
        // Для отладки
        console.log('Story saved:', newStory);
        
        return newStory;
    } catch (error) {
        console.error('Error saving story:', error);
        throw new Error(i18next.t('errors.saving'));
    }
};

export const getStories = async () => {
    try {
        const stories = JSON.parse(localStorage.getItem('stories') || '[]');
        console.log('Retrieved stories:', stories); // Для отладки
        return stories;
    } catch (error) {
        console.error('Error getting stories:', error);
        throw new Error(i18next.t('errors.loading'));
    }
};

export const getStoryById = async (id) => {
    try {
        const stories = JSON.parse(localStorage.getItem('stories') || '[]');
        return stories.find(story => story.id === id);
    } catch (error) {
        console.error('Error getting story:', error);
        throw error;
    }
};

export const deleteStory = async (id) => {
    try {
        const stories = JSON.parse(localStorage.getItem('stories') || '[]');
        const updatedStories = stories.filter(story => story.id !== id);
        localStorage.setItem('stories', JSON.stringify(updatedStories));
    } catch (error) {
        console.error('Error deleting story:', error);
        throw new Error(i18next.t('errors.deleting'));
    }
}; 