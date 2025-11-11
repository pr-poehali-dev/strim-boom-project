import json
import os
from typing import Dict, Any
import psycopg2
import psycopg2.extras

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Чат в реальном времени для стримов
    Args: event с httpMethod, queryStringParameters (stream_id), body (message)
    Returns: HTTP response с сообщениями чата
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
            params = event.get('queryStringParameters', {})
            stream_id = params.get('stream_id')
            limit = int(params.get('limit', 50))
            
            if not stream_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing stream_id'})
                }
            
            cur.execute("""
                SELECT id, username, message, created_at
                FROM chat_messages
                WHERE stream_id = %s
                ORDER BY created_at DESC
                LIMIT %s
            """, (stream_id, limit))
            
            messages = []
            for row in cur.fetchall():
                messages.append({
                    'id': row[0],
                    'username': row[1],
                    'message': row[2],
                    'timestamp': row[3].isoformat() if row[3] else None
                })
            
            messages.reverse()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'messages': messages})
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            stream_id = body_data.get('stream_id')
            user_id = body_data.get('user_id')
            username = body_data.get('username')
            message = body_data.get('message')
            
            if not stream_id or not username or not message:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'})
                }
            
            cur.execute("""
                INSERT INTO chat_messages (stream_id, user_id, username, message)
                VALUES (%s, %s, %s, %s)
                RETURNING id, username, message, created_at
            """, (stream_id, user_id, username, message))
            
            msg = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'message': {
                        'id': msg[0],
                        'username': msg[1],
                        'message': msg[2],
                        'timestamp': msg[3].isoformat() if msg[3] else None
                    }
                })
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
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