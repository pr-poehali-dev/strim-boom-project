import json
import os
import secrets
from typing import Dict, Any
import psycopg2
import psycopg2.extras
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление стримами (создание, список, обновление)
    Args: event с httpMethod, queryStringParameters, body
    Returns: HTTP response со списком стримов или данными стрима
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        if method == 'GET':
            cur.execute("""
                SELECT s.id, s.title, s.description, s.thumbnail, s.category, 
                       s.is_live, s.viewers_count, s.tts_enabled, s.tts_voice,
                       u.username, u.avatar
                FROM streams s
                JOIN users u ON s.user_id = u.id
                WHERE s.is_live = true
                ORDER BY s.viewers_count DESC
                LIMIT 50
            """)
            
            streams = []
            for row in cur.fetchall():
                streams.append({
                    'id': row[0],
                    'title': row[1],
                    'description': row[2],
                    'thumbnail': row[3],
                    'category': row[4],
                    'isLive': row[5],
                    'viewers': row[6],
                    'ttsEnabled': row[7],
                    'ttsVoice': row[8],
                    'username': row[9],
                    'avatar': row[10]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'streams': streams})
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            user_id = body_data.get('user_id')
            title = body_data.get('title')
            category = body_data.get('category', 'Другое')
            description = body_data.get('description', '')
            thumbnail = body_data.get('thumbnail', 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc')
            
            if not user_id or not title:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing user_id or title'})
                }
            
            stream_key = secrets.token_urlsafe(32)
            
            cur.execute("""
                INSERT INTO streams (user_id, title, description, thumbnail, category, is_live, stream_key, started_at)
                VALUES (%s, %s, %s, %s, %s, true, %s, CURRENT_TIMESTAMP)
                RETURNING id, title, description, thumbnail, category, is_live, viewers_count, stream_key
            """, (user_id, title, description, thumbnail, category, stream_key))
            
            stream = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'stream': {
                        'id': stream[0],
                        'title': stream[1],
                        'description': stream[2],
                        'thumbnail': stream[3],
                        'category': stream[4],
                        'isLive': stream[5],
                        'viewers': stream[6],
                        'streamKey': stream[7]
                    }
                })
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            stream_id = body_data.get('stream_id')
            action = body_data.get('action')
            
            if action == 'stop':
                cur.execute("""
                    UPDATE streams 
                    SET is_live = false, ended_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                """, (stream_id,))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True})
                }
            
            elif action == 'update_viewers':
                viewers_count = body_data.get('viewers_count', 0)
                cur.execute("""
                    UPDATE streams 
                    SET viewers_count = %s
                    WHERE id = %s
                """, (viewers_count, stream_id))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True})
                }
        
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid request'})
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()