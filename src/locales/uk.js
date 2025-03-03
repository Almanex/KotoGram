export default {
    translation: {
        appName: 'Skazochki',
        header: {
            home: 'Головна',
            create: 'Створити історію',
            myStories: 'Мої історії'
        },
        home: {
            welcome: 'Ласкаво просимо до Skazochki!',
            subtitle: 'Створюйте унікальні історії для ваших дітей',
            createButton: 'Створити історію',
            features: {
                title: 'Можливості додатку',
                personalization: {
                    title: 'Персоналізація',
                    description: 'Створюйте історії з урахуванням інтересів вашої дитини'
                },
                audio: {
                    title: 'Аудіо-формат',
                    description: 'Слухайте або читайте історії разом з дитиною'
                },
                collaboration: {
                    title: 'Спільна творчість',
                    description: 'Створюйте історії разом з дітьми'
                }
            }
        },
        createStory: {
            title: 'Створення історії',
            form: {
                childName: "Ім'я дитини",
                gender: {
                    label: 'Стать',
                    male: 'Хлопчик',
                    female: 'Дівчинка'
                },
                age: 'Вік',
                interests: {
                    label: 'Інтереси',
                    placeholder: 'Наприклад: космос, динозаври, принцеси'
                },
                storyType: {
                    label: 'Тип історії',
                    space: 'Космічні пригоди',
                    magic: 'Чарівна казка',
                    animals: 'Пригоди з тваринами',
                    time: 'Подорожі в часі'
                }
            },
            buttons: {
                generate: 'Згенерувати історію',
                generating: 'Генерація...',
                save: 'Зберегти',
                saving: 'Збереження...',
                play: 'Відтворити',
                stop: 'Зупинити',
                new: 'Створити нову історію'
            },
            saveSuccess: 'Історію успішно збережено!'
        },
        myStories: {
            title: 'Мої історії',
            noStories: 'У вас поки немає збережених історій',
            deleteButton: 'Видалити',
            confirmDelete: 'Ви впевнені, що хочете видалити цю історію?',
            defaultTitle: 'Історія для {name}'
        },
        footer: {
            rights: '© 2024 Skazochki. Всі права захищені.',
            privacy: 'Політика конфіденційності',
            terms: 'Умови використання',
            contacts: 'Контакти'
        },
        errors: {
            generation: 'Сталася помилка при генерації історії. Будь ласка, спробуйте ще раз.',
            saving: 'Сталася помилка при збереженні історії.',
            loading: 'Помилка завантаження історій.',
            deleting: 'Помилка видалення історії.',
            playback: 'Сталася помилка при відтворенні історії.',
            unsupportedBrowser: 'Ваш браузер не підтримує функцію читання вголос.'
        }
    }
}; 