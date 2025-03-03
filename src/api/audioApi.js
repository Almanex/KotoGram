// Функция для отправки текста на сервер для генерации аудио
export const generateAudio = async (text, language) => {
    try {
        const response = await fetch('/api/generate-audio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text,
                language
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate audio');
        }

        const audioBlob = await response.blob();
        return URL.createObjectURL(audioBlob);
    } catch (error) {
        console.error('Error generating audio:', error);
        throw error;
    }
};

// Функция для получения аудиофайла по ID
export const getAudioFile = async (audioId) => {
    try {
        const response = await fetch(`/api/audio/${audioId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch audio file');
        }
        const audioBlob = await response.blob();
        return URL.createObjectURL(audioBlob);
    } catch (error) {
        console.error('Error fetching audio file:', error);
        throw error;
    }
}; 