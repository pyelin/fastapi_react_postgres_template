from io import BytesIO
from typing import Union

from PIL import Image
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlmodel import Session, text

from .db import engine

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"success": True}


@app.post("/api/rotate-image")
async def rotate_image(file: UploadFile):
    image_data = await file.read()
    img = Image.open(BytesIO(image_data))

    rotated_image = img.rotate(-90, expand=True)

    img_byte_arr = BytesIO()
    format = img.format or 'PNG'
    rotated_image.save(img_byte_arr, format=format)
    img_byte_arr.seek(0)
    return StreamingResponse(img_byte_arr, media_type=f"image/{format.lower()}")