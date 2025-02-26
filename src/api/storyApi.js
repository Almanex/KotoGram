// Временное решение для хранения историй в localStorage
export const saveStory = async (storyData) => {
    try {
        const stories = JSON.parse(localStorage.getItem('stories') || '[]');
        const newStory = {
            id: Date.now().toString(),
            ...storyData
        };
        stories.push(newStory);
        localStorage.setItem('stories', JSON.stringify(stories));
        return newStory;
    } catch (error) {
        console.error('Error saving story:', error);
        throw error;
    }
};

export const getStories = async () => {
    try {
        const stories = JSON.parse(localStorage.getItem('stories') || '[]');
        return stories;
    } catch (error) {
        console.error('Error getting stories:', error);
        throw error;
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