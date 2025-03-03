import { GEMINI_API_URL } from '../config';
import i18next from 'i18next';

export const generateContent = async (data) => {
    try {
        const currentLang = i18next.language;
        
        // Нужно добавить поддержку всех языков
        const storyTypes = {
            ru: {
                '1': 'космических приключениях',
                '2': 'волшебном мире',
                '3': 'приключениях с животными',
                '4': 'путешествиях во времени'
            },
            de: {
                '1': 'Weltraum-Abenteuer',
                '2': 'Märchenwelt',
                '3': 'Tierabenteuer',
                '4': 'Zeitreisen'
            },
            en: {
                '1': 'space adventures',
                '2': 'magical world',
                '3': 'animal adventures',
                '4': 'time travel'
            }
        };

        // Добавляем определение пола для каждого языка
        const genderText = {
            ru: {
                male: 'мальчика',
                female: 'девочку'
            },
            de: {
                male: 'einen Jungen',
                female: 'ein Mädchen'
            },
            en: {
                male: 'a boy',
                female: 'a girl'
            }
        };

        const storyType = storyTypes[currentLang]?.[data.template] || storyTypes['en'][data.template];
        const gender = genderText[currentLang]?.[data.gender] || genderText['en'][data.gender];

        // Формируем промпт на соответствующем языке
        const prompts = {
            ru: `Напиши детскую сказку о ${storyType} для ${gender} по имени ${data.name}, которому ${data.age} лет и который любит ${data.interests}. 
                В начале напиши короткое название истории (не более 5 слов), отдели его строкой "НАЗВАНИЕ:", а затем напиши саму историю, отделив ее строкой "ИСТОРИЯ:". 
                История должна быть добрая и увлекательная, подходящая для возраста. Используй только буквы русского алфавита, цифры и простые знаки препинания.`,
             de: `Schreibe eine Kindergeschichte über ${storyType} für ${gender} namens ${data.name}, ${data.age} Jahre alt und mag ${data.interests}. 
                Schreibe am Anfang einen kurzen Titel (nicht mehr als 5 Wörter), trenne ihn mit der Zeile "TITEL:", und dann schreibe die Geschichte selbst, trenne sie mit der Zeile "GESCHICHTE:". 
                Die Geschichte soll gut und unterhaltsam sein, passend für das Alter. Verwende nur Buchstaben, Zahlen und einfache Satzzeichen.`,
            en: `Write a children's story about ${storyType} for ${gender} named ${data.name}, who is ${data.age} years old and loves ${data.interests}. 
                At the beginning write a short title (no more than 5 words), separate it with a line "TITLE:", and then write the story itself, separating it with a line "STORY:". 
                The story should be kind and engaging, suitable for the child's age. Use only letters, numbers, and simple punctuation marks.`
        };

        const prompt = prompts[currentLang] || prompts['en'];

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
        let fullText = result.candidates[0].content.parts[0].text;
        
        // Разделяем название и историю
        const titleMarkers = {
            ru: { start: 'НАЗВАНИЕ:', end: 'ИСТОРИЯ:' },
            de: { start: 'TITEL:', end: 'GESCHICHTE:' },
            en: { start: 'TITLE:', end: 'STORY:' }
        };

        const markers = titleMarkers[currentLang] || titleMarkers.en;
        const titleMatch = fullText.match(new RegExp(`${markers.start}(.*?)${markers.end}`, 's'));
        const title = titleMatch ? titleMatch[1].trim() : '';
        const story = fullText.split(markers.end)[1]?.trim() || fullText;
        
        // Обновляем регулярное выражение для очистки текста с учетом разных алфавитов
        const cleanTextPatterns = {
            ru: /[^\w\s.,!?а-яА-ЯёЁ\-]/g,
            de: /[^\w\s.,!?äöüßÄÖÜ\-]/g,
            en: /[^\w\s.,!?\-]/g
        };
        
        const cleanText = (text, lang) => text.replace(cleanTextPatterns[lang] || cleanTextPatterns.en, '');
        
        return { 
            title: cleanText(title, currentLang),
            content: cleanText(story, currentLang),
            language: currentLang
        };
    } catch (error) {
        console.error('Error fetching data from Gemini API:', error);
        throw error;
    }
}; 