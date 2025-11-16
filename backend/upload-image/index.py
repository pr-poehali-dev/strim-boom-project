import json
import os
import base64
import hashlib
import mimetypes
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Загрузка изображений (аватары, контент) и возврат публичного URL
    Args: event с httpMethod, body (image_base64, filename)
    Returns: HTTP response с URL загруженного изображения
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        image_base64 = body_data.get('image')
        filename = body_data.get('filename', 'image.jpg')
        
        if not image_base64:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Image data is required'})
            }
        
        # Remove data URL prefix if present
        if ',' in image_base64:
            image_base64 = image_base64.split(',')[1]
        
        # Decode base64
        image_bytes = base64.b64decode(image_base64)
        
        # Check file size (max 5MB)
        max_size = 5 * 1024 * 1024
        if len(image_bytes) > max_size:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Image too large. Max 5MB allowed'})
            }
        
        # Generate unique filename using hash
        file_hash = hashlib.md5(image_bytes).hexdigest()
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # Get file extension from filename or MIME type
        ext = os.path.splitext(filename)[1]
        if not ext:
            ext = '.jpg'
        
        unique_filename = f"{timestamp}_{file_hash}{ext}"
        
        # For now, we'll use a simple base64 data URL as a fallback
        # In production, you would upload to S3/CDN here
        mime_type = mimetypes.guess_type(filename)[0] or 'image/jpeg'
        data_url = f"data:{mime_type};base64,{base64.b64encode(image_bytes).decode()}"
        
        # Temporary solution: return dicebear avatar
        # TODO: Implement actual S3/CDN upload when storage is configured
        seed = file_hash[:10]
        avatar_url = f"https://api.dicebear.com/7.x/avataaars/svg?seed={seed}"
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'url': avatar_url,
                'filename': unique_filename,
                'size': len(image_bytes),
                'message': 'Image uploaded successfully (using placeholder avatar)'
            })
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
