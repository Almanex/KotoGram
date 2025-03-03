from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.edge.service import Service
from selenium.webdriver.edge.options import Options
from webdriver_manager.microsoft import EdgeChromiumDriverManager
from gtts import gTTS
import time
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GoogleTranslateWeb:
    def __init__(self):
        # Инициализация без браузера, так как используем gTTS
        logger.info("Initializing Google Translate Web")
        
    def translate_text(self, text, output_dir='audio', src_lang='ru'):
        """
        Создает аудио файл из текста используя gTTS
        
        Args:
            text (str): Текст для озвучивания
            output_dir (str): Директория для сохранения аудио файлов
            src_lang (str): Код языка (по умолчанию 'ru')
        """
        if not text:
            logger.error("No text provided")
            return False

        # Создаем директорию для аудио файлов, если её нет
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        try:
            # Генерируем имя файла на основе времени
            filename = f"audio_{int(time.time())}.mp3"
            output_file = os.path.join(output_dir, filename)
            
            logger.info(f"Creating audio file: {output_file}")
            logger.info(f"Text length: {len(text)} characters")
            logger.info(f"Language: {src_lang}")
            
            # Попытка создания аудио с несколькими повторами при неудаче
            max_retries = 3
            last_error = None
            
            for attempt in range(max_retries):
                try:
                    # Создаем объект gTTS
                    tts = gTTS(text=text, lang=src_lang, slow=False)
                    
                    # Сохраняем аудио файл
                    tts.save(output_file)
                    
                    # Проверяем, что файл создан и имеет размер больше 0
                    if os.path.exists(output_file) and os.path.getsize(output_file) > 0:
                        logger.info(f"Audio successfully saved to file: {output_file}")
                        return True
                    else:
                        raise Exception("Generated audio file is empty or not created")
                        
                except Exception as e:
                    last_error = str(e)
                    logger.error(f"Attempt {attempt + 1} failed: {last_error}")
                    
                    # Удаляем файл, если он был создан частично
                    if os.path.exists(output_file):
                        try:
                            os.remove(output_file)
                        except:
                            pass
                            
                    if attempt < max_retries - 1:
                        time.sleep(2)  # Увеличенная пауза перед следующей попыткой
                    else:
                        logger.error("All attempts to generate audio failed")
                        raise Exception(f"Failed to generate audio after {max_retries} attempts. Last error: {last_error}")
                    
        except Exception as e:
            logger.error(f"Error creating audio: {str(e)}")
            return False
    
    def close(self):
        """Метод для совместимости"""
        pass

def main():
    translator = GoogleTranslateWeb()
    
    try:
        text = """Тестовый текст для проверки генерации аудио."""
        
        logger.info(f"Sending text for processing:\n{text}")
        success = translator.translate_text(text)
        
        if success:
            logger.info("Text successfully processed and audio saved")
        else:
            logger.error("Error processing text or saving audio")
            
    except Exception as e:
        logger.error(f"Main execution error: {str(e)}")

if __name__ == "__main__":
    main() 