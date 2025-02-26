import { GEMINI_API_URL } from '../config';

export const generateContent = async (data) => {
    try {
        // Обновляем prompt с указанием не использовать специальные символы
        const prompt = `Напиши детскую сказку о приключениях для ребенка по имени ${data.name}, которому ${data.age} лет и который любит ${data.interests}. История должна быть добрая и увлекательная, подходящая для его возраста. Используй только буквы русского алфавита, цифры и простые знаки препинания (точка, запятая, восклицательный и вопросительный знаки). Не используй специальные символы, эмодзи или другие необычные знаки.`;

        // Подготавливаем данные для запроса в правильном формате
        const requestData = {
            contents: [{
                parts: [{ text: prompt }]
            }]
        };

        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        
        // Очищаем текст от возможных специальных символов
        let story = result.candidates[0].content.parts[0].text;
        
        // Заменяем возможные специальные символы на простые аналоги
        story = story.replace(/[^\w\s.,!?а-яА-ЯёЁ\-]/g, '');
        
        return { content: story };
    } catch (error) {
        console.error('Error fetching data from Gemini API:', error);
        throw error;
    }
}; 