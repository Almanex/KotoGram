from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from web_translator import GoogleTranslateWeb
import logging
import os
from pathlib import Path
import atexit
import shutil
import uuid
from datetime import datetime, timedelta
import threading
import time

app = Flask(__name__)
CORS(app)

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Инициализация переводчика
translator = GoogleTranslateWeb()

# Корневая директория для аудио файлов
AUDIO_ROOT = Path('audio_files')
AUDIO_ROOT.mkdir(parents=True, exist_ok=True)

# Словарь для хранения информации о сессиях
sessions = {}

def cleanup_old_sessions():
    """Периодическая очистка старых сессий"""
    while True:
        try:
            current_time = datetime.now()
            sessions_to_remove = []
            
            for session_id, session_data in sessions.items():
                # Удаляем сессии старше 1 часа
                if current_time - session_data['last_access'] > timedelta(hours=1):
                    session_dir = AUDIO_ROOT / session_id
                    if session_dir.exists():
                        shutil.rmtree(session_dir)
                    sessions_to_remove.append(session_id)
            
            for session_id in sessions_to_remove:
                del sessions[session_id]
                
            logger.info(f"Cleaned up {len(sessions_to_remove)} old sessions")
            
        except Exception as e:
            logger.error(f"Error in cleanup thread: {str(e)}")
            
        time.sleep(3600)  # Проверка каждый час

# Запуск потока очистки
cleanup_thread = threading.Thread(target=cleanup_old_sessions, daemon=True)
cleanup_thread.start()

def get_session_dir(session_id):
    """Получение директории для сессии"""
    session_dir = AUDIO_ROOT / session_id
    session_dir.mkdir(parents=True, exist_ok=True)
    return session_dir

@app.route('/api/init-session', methods=['POST'])
def init_session():
    """Инициализация новой сессии"""
    try:
        session_id = str(uuid.uuid4())
        sessions[session_id] = {
            'last_access': datetime.now(),
            'files': []
        }
        get_session_dir(session_id)
        return jsonify({'session_id': session_id}), 200
    except Exception as e:
        logger.error(f"Error initializing session: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-audio', methods=['POST'])
def generate_audio():
    try:
        data = request.get_json()
        
        if not data or 'text' not in data or 'session_id' not in data:
            return jsonify({'error': 'Missing required data'}), 400
            
        session_id = data['session_id']
        if session_id not in sessions:
            return jsonify({'error': 'Invalid session'}), 403
            
        # Обновляем время последнего доступа
        sessions[session_id]['last_access'] = datetime.now()
        
        text = data['text']
        language = data.get('language', 'ru')
        
        logger.info(f"Generating audio for session {session_id}")
        logger.info(f"Language: {language}, Text length: {len(text)}")
        
        session_dir = get_session_dir(session_id)
        
        # Генерация аудио
        success = translator.translate_text(
            text=text,
            output_dir=str(session_dir),
            src_lang=language
        )
        
        if success:
            audio_files = list(session_dir.glob('*.mp3'))
            if not audio_files:
                return jsonify({'error': 'Audio file not found'}), 404
                
            latest_file = max(audio_files, key=lambda x: x.stat().st_mtime)
            
            # Сохраняем информацию о файле в сессии
            sessions[session_id]['files'].append(latest_file.name)
            
            return send_file(
                str(latest_file),
                mimetype='audio/mpeg',
                as_attachment=True,
                download_name=latest_file.name
            )
        else:
            return jsonify({'error': 'Failed to generate audio'}), 500
            
    except Exception as e:
        logger.error(f"Error in generate_audio: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/cleanup-session', methods=['POST'])
def cleanup_session():
    """Очистка файлов сессии"""
    try:
        data = request.get_json()
        if not data or 'session_id' not in data:
            return jsonify({'error': 'Session ID required'}), 400
            
        session_id = data['session_id']
        if session_id not in sessions:
            return jsonify({'error': 'Invalid session'}), 403
            
        session_dir = AUDIO_ROOT / session_id
        if session_dir.exists():
            shutil.rmtree(session_dir)
            session_dir.mkdir(parents=True, exist_ok=True)
            
        del sessions[session_id]
        return jsonify({'message': 'Session cleaned up'}), 200
        
    except Exception as e:
        logger.error(f"Error cleaning up session: {str(e)}")
        return jsonify({'error': str(e)}), 500

def cleanup_all():
    """Очистка всех файлов при выключении сервера"""
    try:
        if AUDIO_ROOT.exists():
            shutil.rmtree(AUDIO_ROOT)
            logger.info("All audio files cleaned up")
    except Exception as e:
        logger.error(f"Error during cleanup: {str(e)}")

# Регистрируем функцию очистки при выключении сервера
atexit.register(cleanup_all)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Эндпоинт для проверки здоровья сервера"""
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000) 