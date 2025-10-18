from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests, time, logging
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Story Generator")

# === ✅ ДОБАВЛЯЕМ CORS ЗДЕСЬ ===
origins = [
    "http://localhost:3000",   # твой фронт на Next.js
    "http://127.0.0.1:3000",   # альтернатива, если браузер обращается по IP
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,         # кому разрешаем обращаться
    allow_credentials=True,
    allow_methods=["*"],           # разрешаем все HTTP-методы (GET, POST и т.д.)
    allow_headers=["*"],           # разрешаем все заголовки
)
# === КОНЕЦ БЛОКА CORS ===


# === Конфигурация Higgsfield API ===
BASE_URL = "https://platform.higgsfield.ai"
TEXT2IMG_MODEL = "v1/text2image/nano-banana"   # Text → Image
TEXT2VIDEO_MODEL = "generate/minimax-t2v"      # Text → Video

API_KEY = "a784704c-e4b6-4869-9c97-c9966c429d7f"
API_SECRET = "28881e2e4520cb3c59473de86c24aad03e32d0b9a2d9fdeaa2df62f8f94ccf88"

# === Логирование ===
logging.basicConfig(filename="higgs.log", level=logging.INFO, format="%(asctime)s - %(message)s")


# === Модели запросов ===
class PromptRequest(BaseModel):
    prompt: str


@app.get("/")
def root():
    """Проверка статуса сервера"""
    return {"message": "✅ Story Generator machine"}

class MinimaxRequest(BaseModel):
    image_url: str
    prompt: Optional[str] = None  # опциональный prompt


# 🖼️ 1️⃣ TEXT → IMAGE
@app.post("/generate_image")
def generate_image(data: PromptRequest):
    """Генерация изображения по текстовому описанию"""
    headers = {
        "Content-Type": "application/json",
        "hf-api-key": API_KEY,
        "hf-secret": API_SECRET
    }

    payload = {
        "params": {
            "aspect_ratio": "4:3",
            "input_images": [],
            "prompt": data.prompt
        }
    }

    try:
        res = requests.post(f"{BASE_URL}/{TEXT2IMG_MODEL}", json=payload, headers=headers)
        res.raise_for_status()
        job = res.json()
        job_id = job.get("id")
        logging.info(f"🖼️ Started image generation: {job_id}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при создании изображения: {e}")

    # Polling — ожидание результата
    for _ in range(30):  # ~90 секунд
        time.sleep(3)
        status_res = requests.get(f"{BASE_URL}/v1/job-sets/{job_id}", headers=headers)
        job_data = status_res.json()
        status = job_data["jobs"][0]["status"]

        if status == "completed":
            image_url = job_data["jobs"][0]["results"]["raw"]["url"]
            logging.info(f"✅ Image ready: {image_url}")
            return {"status": "completed", "image_url": image_url}
        elif status == "failed":
            raise HTTPException(status_code=500, detail="Image generation failed")

    raise HTTPException(status_code=408, detail="Таймаут ожидания результата.")

@app.post("/generate_video_minimax")
def generate_video_minimax(data: MinimaxRequest):
    """Создание видео из изображения (Minimax Hailuo 02)."""
    headers = {
        "Content-Type": "application/json",
        "hf-api-key": API_KEY,
        "hf-secret": API_SECRET
    }

    payload = {
        "params": {
            "prompt": data.prompt or "gentle cinematic movement",
            "duration": 6,
            "resolution": "768",
            "input_image": {
                "type": "image_url",
                "image_url": data.image_url
            },
            "enhance_prompt": True
        }
    }

    try:
        res = requests.post(f"{BASE_URL}/v1/image2video/minimax", json=payload, headers=headers)
        res.raise_for_status()
        job = res.json()
        job_id = job.get("id")
        logging.info(f"🎞️ Minimax job created: {job_id}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при создании видео: {e}")

    # Polling (ожидание генерации)
    for _ in range(50):
        time.sleep(5)
        status_res = requests.get(f"{BASE_URL}/v1/job-sets/{job_id}", headers=headers)
        job_data = status_res.json()
        status = job_data["jobs"][0]["status"]

        if status == "completed":
            video_url = job_data["jobs"][0]["results"]["raw"]["url"]
            logging.info(f"✅ Minimax video ready: {video_url}")
            return {
                "status": "completed",
                "video_url": video_url,
                "source_image": data.image_url,
                "prompt": data.prompt
            }
        elif status == "failed":
            raise HTTPException(status_code=500, detail="Minimax video generation failed")

    raise HTTPException(status_code=408, detail="Таймаут ожидания результата.")

# 🎥 2️⃣ TEXT → VIDEO
@app.post("/generate_story")
def generate_story(data: PromptRequest):
    """Создание видео по тексту (Minimax T2V)"""
    headers = {
        "Content-Type": "application/json",
        "hf-api-key": API_KEY,
        "hf-secret": API_SECRET
    }

    payload = {
        "params": {
            "duration": 6,
            "resolution": "768",
            "enable_prompt_optimizier": True,
            "prompt": data.prompt
        }
    }

    try:
        res = requests.post(f"{BASE_URL}/{TEXT2VIDEO_MODEL}", json=payload, headers=headers)
        res.raise_for_status()
        job = res.json()
        job_id = job.get("id")
        logging.info(f"🎬 Started story generation: {job_id}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при создании видео: {e}")

    # Polling — ожидание завершения
    for _ in range(40):  # ~200 секунд
        time.sleep(5)
        status_res = requests.get(f"{BASE_URL}/v1/job-sets/{job_id}", headers=headers)
        job_data = status_res.json()
        status = job_data["jobs"][0]["status"]

        if status == "completed":
            video_url = job_data["jobs"][0]["results"]["raw"]["url"]
            logging.info(f"🎞️ Story video ready: {video_url}")
            return {
                "status": "completed",
                "video_url": video_url,
                "prompt": data.prompt
            }
        elif status == "failed":
            raise HTTPException(status_code=500, detail="Story video generation failed")

    raise HTTPException(status_code=408, detail="Таймаут ожидания результата.")
