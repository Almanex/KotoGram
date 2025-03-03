import React, { useState, useEffect, useRef } from 'react';
import { generateContent } from '../api/geminiApi';
import { saveStory } from '../api/storyApi';
import { useTranslation } from 'react-i18next';
import backgroundImage from '../images/background.jpg';
import i18next from 'i18next';
import StoryAudioPlayer from '../components/StoryAudioPlayer';

function CreateStoryPage() {
    const { t, i18n } = useTranslation();
    const pageStyle = {
        '--background-image': `url(${backgroundImage})`
    };

    const [storyData, setStoryData] = useState({
        name: '',
        age: '',
        gender: 'male',
        interests: '',
        template: '1'
    });
    const [story, setStory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const [storyTitle, setStoryTitle] = useState('');
    const timeoutIds = useRef([]);

    useEffect(() => {
        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
                setIsPlaying(false);
                timeoutIds.current.forEach(id => clearTimeout(id));
                timeoutIds.current = [];
            }
        };
    }, []);

    useEffect(() => {
        if (!window.speechSynthesis) {
            setError(t('errors.unsupportedBrowser'));
        }
    }, [t]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStoryData({ ...storyData, [name]: value });
    };

    const handleGenerateStory = async () => {
        try {
            if (!storyData.name || !storyData.age || !storyData.interests) {
                setError(t('errors.requiredFields'));
                return;
            }

            setIsLoading(true);
            setError(null);
            const result = await generateContent(storyData);
            setStory(result.content);
            setStoryTitle(result.title);
            setShowForm(false);
        } catch (error) {
            console.error('Error generating story:', error);
            setError(t('errors.generation'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveStory = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            if (!story) {
                setError(t('errors.noStoryToSave'));
                return;
            }

            await saveStory({
                ...storyData,
                title: storyTitle,
                content: story,
                createdAt: new Date().toISOString()
            });

            alert(t('createStory.saveSuccess'));
        } catch (error) {
            console.error('Error saving story:', error);
            setError(t('errors.saving'));
        } finally {
            setIsLoading(false);
        }
    };

    const handlePlayStory = () => {
        if (!story) return;

        if (isPlaying) {
            window.speechSynthesis.cancel();
            timeoutIds.current.forEach(id => clearTimeout(id));
            timeoutIds.current = [];
            setIsPlaying(false);
            return;
        }

        try {
            timeoutIds.current.forEach(id => clearTimeout(id));
            timeoutIds.current = [];

            const currentLang = i18next.language;
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

            const sentences = story.split(/[.!?]+/).map(sentence => sentence.trim()).filter(Boolean);
            
            let currentIndex = 0;
            sentences.forEach((sentence, index) => {
                const utterance = new SpeechSynthesisUtterance(sentence);
                
                utterance.voice = preferredVoice;
                utterance.lang = preferredVoice ? preferredVoice.lang : languageVoices[currentLang][0];
                utterance.rate = 0.9;
                utterance.pitch = 1.0;
                utterance.volume = 1.0;

                const delay = 800;
                
                utterance.onstart = () => {
                    if (currentIndex === 0) setIsPlaying(true);
                };

                utterance.onend = () => {
                    currentIndex++;
                    if (currentIndex >= sentences.length) {
                        setIsPlaying(false);
                        timeoutIds.current.forEach(id => clearTimeout(id));
                        timeoutIds.current = [];
                    }
                };

                utterance.onerror = () => {
                    setIsPlaying(false);
                    setError(t('errors.playback'));
                    timeoutIds.current.forEach(id => clearTimeout(id));
                    timeoutIds.current = [];
                };

                const timeoutId = setTimeout(() => {
                    window.speechSynthesis.speak(utterance);
                }, index * delay);
                
                timeoutIds.current.push(timeoutId);
            });

        } catch (error) {
            console.error('Error playing story:', error);
            setError(t('errors.playback'));
            setIsPlaying(false);
            timeoutIds.current.forEach(id => clearTimeout(id));
            timeoutIds.current = [];
        }
    };

    const handlePlayError = (error) => {
        console.error('Error playing story:', error);
        setIsPlaying(false);
        setError('Произошла ошибка при воспроизведении истории. Попробуйте еще раз.');
    };

    const handleNewStory = () => {
        setStory('');
        setShowForm(true);
        setError(null);
    };

    return (
        <div className="create-story-page" style={pageStyle}>
            <h2>{t('createStory.title')}</h2>
            
            {showForm ? (
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label>
                            {t('createStory.form.childName')} 
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
                            {t('createStory.form.gender.label')}
                            <select 
                                name="gender" 
                                value={storyData.gender} 
                                onChange={handleInputChange}
                            >
                                <option value="male">{t('createStory.form.gender.male')}</option>
                                <option value="female">{t('createStory.form.gender.female')}</option>
                            </select>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            {t('createStory.form.age')} 
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
                            {t('createStory.form.interests.label')} 
                            <input 
                                type="text" 
                                name="interests" 
                                value={storyData.interests} 
                                onChange={handleInputChange}
                                required 
                                placeholder={t('createStory.form.interests.placeholder')}
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            {t('createStory.form.storyType.label')}
                            <select 
                                name="template" 
                                value={storyData.template} 
                                onChange={handleInputChange}
                            >
                                <option value="1">{t('createStory.form.storyType.space')}</option>
                                <option value="2">{t('createStory.form.storyType.magic')}</option>
                                <option value="3">{t('createStory.form.storyType.animals')}</option>
                                <option value="4">{t('createStory.form.storyType.time')}</option>
                            </select>
                        </label>
                    </div>
                    <button 
                        type="button" 
                        onClick={handleGenerateStory}
                        disabled={isLoading}
                    >
                        {isLoading ? t('createStory.buttons.generating') : t('createStory.buttons.generate')}
                    </button>
                </form>
            ) : (
                <button 
                    onClick={handleNewStory}
                    className="new-story-button"
                >
                    {t('createStory.buttons.new')}
                </button>
            )}
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            
            {story && (
                <div className="story-container">
                    <div className="story-header">
                        <h3>{storyTitle}</h3>
                        <div className="story-header-buttons">
                            <button 
                                onClick={handleSaveStory}
                                disabled={isLoading || !story}
                                className="save-button"
                            >
                                {isLoading ? t('createStory.buttons.saving') : t('createStory.buttons.save')}
                            </button>
                        </div>
                    </div>
                    <StoryAudioPlayer 
                        text={story}
                        language={i18n.language}
                    />
                    <div className="story-content">
                        {story}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateStoryPage; 