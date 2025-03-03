import asyncio
import base64
import json
import numpy as np
import os
import websockets
import wave
import contextlib
import pygame
from dotenv import load_dotenv #import

load_dotenv() 

# ANSI color codes
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BLUE = "\033[94m"
RESET = "\033[0m"

# We should find right voice here
voices = {"Puck", "Charon", "Kore", "Fenrir", "Aoede"}

# --- Configuration ---
MODEL = 'models/gemini-2.0-flash-exp'
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY") # read from environment variable
if not GOOGLE_API_KEY:
    raise EnvironmentError("GOOGLE_API_KEY environment variable is not set.")
HOST = 'generativelanguage.googleapis.com'
URI = f'wss://{HOST}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key={GOOGLE_API_KEY}'

# Audio parameters
WAVE_CHANNELS = 1  # Mono audio
WAVE_RATE = 24000
WAVE_SAMPLE_WIDTH = 2


@contextlib.contextmanager
def wave_file(filename, channels=WAVE_CHANNELS, rate=WAVE_RATE, sample_width=WAVE_SAMPLE_WIDTH):
    """Context manager for creating and managing wave files."""
    try:
        print(f"{BLUE}Создание WAV файла: {filename}{RESET}")
        print(f"{BLUE}Параметры: каналы={channels}, частота={rate}, битность={sample_width}{RESET}")
        with wave.open(filename, "wb") as wf:
            wf.setnchannels(channels)
            wf.setsampwidth(sample_width)
            wf.setframerate(rate)
            yield wf
        print(f"{GREEN}WAV файл успешно создан: {filename}{RESET}")
    except wave.Error as e:
        print(f"{RED}Ошибка при создании WAV файла '{filename}': {e}{RESET}")
        raise
    except Exception as e:
        print(f"{RED}Неожиданная ошибка при работе с WAV файлом: {e}{RESET}")
        raise


async def audio_playback_task(file_name, stop_event):
    """Plays audio using pygame until stopped."""
    print(f"{BLUE}Инициализация воспроизведения: {file_name}{RESET}")
    try:
        # Проверяем, что файл существует
        if not os.path.exists(file_name):
            print(f"{RED}Файл не найден: {file_name}{RESET}")
            return

        # Получаем информацию о файле
        with wave.open(file_name, 'rb') as wf:
            print(f"{BLUE}Параметры аудио файла:{RESET}")
            print(f"{BLUE}- Каналы: {wf.getnchannels()}{RESET}")
            print(f"{BLUE}- Частота: {wf.getframerate()} Hz{RESET}")
            print(f"{BLUE}- Битность: {wf.getsampwidth() * 8} bit{RESET}")

        # Инициализируем pygame.mixer с нужными параметрами
        pygame.mixer.quit()  # Сначала закрываем, если был открыт
        pygame.mixer.init(frequency=WAVE_RATE, size=-16, channels=WAVE_CHANNELS)
        
        print(f"{BLUE}Загрузка файла в pygame...{RESET}")
        pygame.mixer.music.load(file_name)
        
        print(f"{BLUE}Начало воспроизведения...{RESET}")
        pygame.mixer.music.play()
        
        while pygame.mixer.music.get_busy() and not stop_event.is_set():
            await asyncio.sleep(0.1)
            
        print(f"{GREEN}Воспроизведение успешно завершено{RESET}")
    except pygame.error as e:
        print(f"{RED}Ошибка pygame при воспроизведении: {e}{RESET}")
    except Exception as e:
        print(f"{RED}Неожиданная ошибка при воспроизведении: {e}{RESET}")
        print(f"Тип ошибки: {type(e)}")
        print(f"Детали: {str(e)}")
    finally:
        try:
            pygame.mixer.music.stop()
            pygame.mixer.quit()
            print(f"{BLUE}Ресурсы воспроизведения освобождены{RESET}")
        except:
            pass


async def setup(ws) -> None:
    setup_message = {
        "setup": {
            "model": MODEL,
            "generation_config": {
                "temperature": 0.9,
                "candidate_count": 1,
                "max_output_tokens": 8000,
                "top_p": 1,
                "top_k": 32
            }
        }
    }
    
    print(f"{BLUE}Отправка настроек: {json.dumps(setup_message, indent=2)}{RESET}")
    await ws.send(json.dumps(setup_message))

    raw_response = await ws.recv(decode=False)
    setup_response = json.loads(raw_response.decode("ascii"))
    print(f"{GREEN}Подключено: {setup_response}{RESET}")


async def generate_audio(ws, text_input: str) -> None:
    pygame.mixer.init()

    msg = {
        "client_content": {
            "turns": [{
                "role": "user",
                "parts": [{
                    "text": "[Anleitung: Lesen Sie diesen Text und laden Sie ihn als vritten herunter, ohne einen Kommentar abzugeben.] " + text_input
                }]
            }],
            "turn_complete": True
        }
    }

    print(f"{YELLOW}Отправка текста для озвучивания...{RESET}")
    await ws.send(json.dumps(msg))

    responses = []
    async for raw_response in ws:
        try:
            response = json.loads(raw_response.decode())
            print(f"{BLUE}Получен ответ: {json.dumps(response, indent=2)}{RESET}")

            server_content = response.get("serverContent")
            if server_content is None:
                break

            model_turn = server_content.get("modelTurn")
            if model_turn:
                parts = model_turn.get("parts")
                if parts:
                    for part in parts:
                        if "inlineData" in part and "data" in part["inlineData"]:
                            try:
                                pcm_data = base64.b64decode(part["inlineData"]["data"])
                                audio_chunk = np.frombuffer(pcm_data, dtype=np.int16)
                                print(f"{GREEN}Получен аудио фрагмент: {len(audio_chunk)} сэмплов{RESET}")
                                responses.append(audio_chunk)
                            except Exception as e:
                                print(f"{RED}Ошибка обработки аудио фрагмента: {e}{RESET}")

            turn_complete = server_content.get("turnComplete")
            if turn_complete:
                print(f"{GREEN}Генерация завершена{RESET}")
                break
        except Exception as e:
            print(f"{RED}Ошибка обработки сообщения: {e}{RESET}")
            break

    if responses:
        print(f"{GREEN}Обработка {len(responses)} аудио фрагментов...{RESET}")
        audio_array = np.concatenate(responses)
        file_name = 'output.wav'
        with wave_file(file_name) as wf:
            wf.writeframes(audio_array.tobytes())
        print(f"{GREEN}Аудио сохранено в файл: {file_name}{RESET}")

        stop_event = asyncio.Event()
        try:
            await audio_playback_task(file_name, stop_event)
        except Exception as e:
            print(f"{RED}Ошибка воспроизведения: {e}{RESET}")
    else:
        print(f"{YELLOW}Аудио не получено{RESET}")

    pygame.mixer.quit()  # clean up pygame mixer


async def main():
    print(f"{GREEN}Доступные голоса: {', '.join(voices)}{RESET}")
    default_voice = "Kore"
    print(f"{GREEN}Выбран голос по умолчанию: {default_voice}{RESET}")

    print(f"{BLUE}Подключение к WebSocket...{RESET}")
    async with websockets.connect(URI) as ws:
        await setup(ws)

        test_story = """
        Es war einmal ein kleines Kätzchen namens Fluffy. Er liebte es, mit einem Wollknäuel zu spielen und Sonnenstrahlen zu jagen.
 Eines Tages sah Fluffy einen Schmetterling und beschloss, sich mit ihm anzufreunden. Vorsichtig schlich er sich an sie heran, doch der Schmetterling flog davon.
 Pushok war nicht verärgert, weil er verstand, dass jeder seinen eigenen Lebensweg geht.
 Seitdem ist er weiser geworden und hat viele andere Freunde auf dem Hof ​​gefunden.
        """

        print(f"{YELLOW}Тестовая сказка:{RESET}")
        print(test_story)

        try:
            await generate_audio(ws, test_story)
        except Exception as e:
            print(f"{RED}Произошла ошибка: {e}{RESET}")

        while True:
            text_prompt = input(f"{YELLOW}Введите текст сказки (или 'exit' для выхода): {RESET}")
            if text_prompt.lower() == "exit":
                break

            try:
                await generate_audio(ws, text_prompt)
            except Exception as e:
                print(f"{RED}Произошла ошибка: {e}{RESET}")


if __name__ == "__main__":
    asyncio.run(main())
