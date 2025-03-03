export default {
    translation: {
        appName: 'Skazochki',
        header: {
            home: 'Home',
            create: 'Create Story',
            myStories: 'My Stories'
        },
        home: {
            welcome: 'Welcome to Skazochki!',
            subtitle: 'Create unique stories for your children',
            createButton: 'Create Story',
            features: {
                title: 'App Features',
                personalization: {
                    title: 'Personalization',
                    description: 'Create stories based on your child\'s interests'
                },
                audio: {
                    title: 'Audio Format',
                    description: 'Listen to or read stories with your child'
                },
                collaboration: {
                    title: 'Collaboration',
                    description: 'Create stories together with children'
                }
            }
        },
        createStory: {
            title: 'Создание истории',
            form: {
                childName: 'Имя ребенка',
                gender: {
                    label: 'Пол',
                    male: 'Мальчик',
                    female: 'Девочка'
                },
                age: 'Возраст',
                interests: {
                    label: 'Интересы',
                    placeholder: 'Например: космос, динозавры, принцессы'
                },
                storyType: {
                    label: 'Тип истории',
                    space: 'Космические приключения',
                    magic: 'Волшебная сказка',
                    animals: 'Приключения с животными',
                    time: 'Путешествия во времени'
                }
            },
            buttons: {
                generate: 'Сгенерировать историю',
                generating: 'Генерация...',
                save: 'Сохранить',
                saving: 'Сохранение...',
                play: 'Воспроизвести',
                stop: 'Остановить',
                new: 'Создать новую историю'
            }
        },
        myStories: {
            title: 'Мои истории',
            noStories: 'У вас пока нет сохраненных историй.',
            deleteButton: 'Удалить'
        },
        footer: {
            rights: '© 2024 Skazochki. Все права защищены.',
            privacy: 'Политика конфиденциальности',
            terms: 'Условия использования',
            contacts: 'Контакты'
        },
        errors: {
            generation: 'An error occurred while generating the story. Please try again.',
            saving: 'An error occurred while saving the story.',
            loading: 'Error loading stories.',
            generation: 'Error generating story.',
            noStoryToSave: 'No story to save. Please generate a story first.',
            playback: 'Error playing the story.',
            unsupportedBrowser: 'Your browser does not support text-to-speech.',
            requiredFields: 'Please fill in all required fields',
            audioGeneration: 'An error occurred while creating audio. Please try again.'
        },
        buttons: {
            generating: 'Creating audio...',
            generateAudio: 'Create audio',
            downloadAudio: 'Download audio'
        }
    }
}; 