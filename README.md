# KotoGram - Генератор Детских Историй

Веб-приложение для создания персонализированных детских историй с возможностью озвучивания на разных языках.

## Основные возможности

- Создание персонализированных историй с учетом интересов ребенка
- Озвучивание историй на разных языках (русский, английский, немецкий)
- Сохранение историй
- Возможность скачивания аудио файлов
- Адаптивный дизайн для мобильных устройств

## Технологии

### Фронтенд
- React
- Material-UI
- i18next для локализации
- CSS для стилизации

### Бэкенд
- Python Flask
- gTTS (Google Text-to-Speech)
- Flask-CORS для кросс-доменных запросов

## Установка и запуск

### Требования
- Node.js (версия 14 или выше)
- Python (версия 3.7 или выше)
- pip (Python package manager)

### Установка зависимостей

1. Установка frontend зависимостей:
```bash
npm install
```

2. Установка backend зависимостей:
```bash
pip install gtts flask flask-cors
```

### Запуск приложения

1. Запуск сервера Flask:
```bash
python server.py
```

2. Запуск React приложения:
```bash
npm start
```

## Реализация озвучки историй

### Архитектура системы

1. **Frontend компонент (StoryAudioPlayer)**
   - Управляет пользовательским интерфейсом для генерации аудио
   - Обрабатывает сессии пользователей
   - Предоставляет возможность скачивания аудио файлов

2. **Backend сервер (server.py)**
   - Обрабатывает запросы на генерацию аудио
   - Управляет сессиями пользователей
   - Очищает временные файлы

3. **Модуль генерации аудио (web_translator.py)**
   - Использует gTTS для преобразования текста в речь
   - Поддерживает несколько языков
   - Обрабатывает длинные тексты

### Процесс генерации аудио

1. **Инициализация сессии**
   - При загрузке компонента создается уникальная сессия
   - Каждая сессия имеет свою директорию для файлов
   - Сессии автоматически очищаются через час неактивности

2. **Генерация аудио**
   ```javascript
   // Frontend запрос
   const response = await fetch('/api/generate-audio', {
     method: 'POST',
     body: JSON.stringify({
       text,
       language,
       session_id: sessionId
     })
   });
   ```

   ```python
   # Backend обработка
   def translate_text(self, text, output_dir, src_lang):
       tts = gTTS(text=text, lang=src_lang)
       tts.save(output_file)
   ```

3. **Обработка длинных текстов**
   - Тексты разбиваются на части по 5000 символов
   - Каждая часть обрабатывается отдельно
   - Результаты объединяются в один файл

4. **Управление файлами**
   - Файлы сохраняются во временной директории
   - Используются уникальные имена на основе временных меток
   - Автоматическая очистка неиспользуемых файлов

### Поддерживаемые языки

- Русский (ru)
- Английский (en)
- Немецкий (de)

Коды языков автоматически преобразуются в поддерживаемый формат:
```python
language_mapping = {
    'ru': 'ru',
    'en': 'en',
    'de': 'de',
    'ru-RU': 'ru',
    'en-US': 'en',
    'en-GB': 'en',
    'de-DE': 'de'
}
```

### Обработка ошибок

1. **Клиентская часть**
   - Повторные попытки при неудаче (до 3 раз)
   - Информативные сообщения об ошибках
   - Возможность ручного перезапуска генерации

2. **Серверная часть**
   - Логирование всех операций
   - Очистка частично созданных файлов
   - Проверка целостности созданных файлов

### Безопасность

1. **Сессии**
   - Изоляция файлов разных пользователей
   - Автоматическая очистка старых сессий
   - Проверка валидности session_id

2. **Файловая система**
   - Проверка размера файлов
   - Ограничение на типы файлов
   - Безопасные имена файлов

## Рекомендации по развертыванию

1. **Настройка сервера**
   - Установите все зависимости
   - Настройте CORS для вашего домена
   - Убедитесь в наличии прав на создание файлов

2. **Мониторинг**
   - Следите за использованием диска
   - Проверяйте логи на наличие ошибок
   - Мониторьте время генерации аудио

3. **Оптимизация**
   - Настройте кэширование статических файлов
   - Используйте CDN для раздачи аудио файлов
   - Настройте максимальный размер запроса

## Известные ограничения

1. gTTS требует подключения к интернету
2. Ограничение на длину текста (рекомендуется до 5000 символов)
3. Возможны задержки при генерации длинных текстов

## Планы по улучшению

1. Добавление новых языков
2. Улучшение качества озвучки
3. Реализация потокового воспроизведения
4. Кэширование популярных историй 