#!/usr/bin/env python3
import requests
from PIL import Image
from io import BytesIO
import os

LOGO_URL = 'https://cdn.poehali.dev/files/8af0fa73-0b2f-4c2d-ad5e-cdc9818bab3c.jpg'
PUBLIC_DIR = os.path.join(os.path.dirname(__file__), '..', 'public')
BACKGROUND_COLOR = (10, 10, 10)

SIZES = [
    {'size': 192, 'maskable': False, 'name': 'icon-192.png'},
    {'size': 192, 'maskable': True, 'name': 'icon-192-maskable.png'},
    {'size': 512, 'maskable': False, 'name': 'icon-512.png'},
    {'size': 512, 'maskable': True, 'name': 'icon-512-maskable.png'}
]

def download_image(url):
    print(f'📥 Скачивание логотипа с {url}...')
    response = requests.get(url)
    response.raise_for_status()
    return Image.open(BytesIO(response.content))

def generate_icon(image, size, maskable, output_path):
    if maskable:
        icon_size = int(size * 0.8)
        offset = int(size * 0.1)
    else:
        icon_size = size
        offset = 0
    
    bg = Image.new('RGB', (size, size), BACKGROUND_COLOR)
    
    logo_resized = image.resize((icon_size, icon_size), Image.Resampling.LANCZOS)
    
    if logo_resized.mode == 'RGBA':
        bg.paste(logo_resized, (offset, offset), logo_resized)
    else:
        bg.paste(logo_resized, (offset, offset))
    
    bg.save(output_path, 'PNG')

def main():
    print('🚀 STREAM BOOM - Генерация PWA иконок...\n')
    
    logo_image = download_image(LOGO_URL)
    print('✅ Логотип скачан\n')
    
    for config in SIZES:
        print(f'🎨 Генерация: {config["name"]} ({config["size"]}x{config["size"]}, {"maskable" if config["maskable"] else "any"})')
        output_path = os.path.join(PUBLIC_DIR, config['name'])
        generate_icon(logo_image, config['size'], config['maskable'], output_path)
        print(f'✅ Создан: {config["name"]}\n')
    
    print('🎉 Все иконки успешно созданы в /public/!')

if __name__ == '__main__':
    main()
