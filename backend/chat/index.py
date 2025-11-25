import json
import os
from typing import Dict, Any
import psycopg2
import psycopg2.extras

def escape_sql_string(s: str) -> str:
    """Экранирует строки для безопасного использования в SQL"""
    return s.replace("'", "''")

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
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    try:
        conn = psycopg2.connect(database_url)
        conn.autocommit = True
        cur = conn.cursor()
        
        if method == 'GET':
            params = event.get('queryStringParameters', {})
            stream_id = params.get('stream_id')
            limit = int(params.get('limit', 50))
            
            if not stream_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing stream_id'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(f"""
                SELECT id, username, message, created_at
                FROM t_p37705306_strim_boom_project.chat_messages
                WHERE stream_id = {stream_id}
                ORDER BY created_at DESC
                LIMIT {limit}
            """)
            
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
                'body': json.dumps({'messages': messages}),
                'isBase64Encoded': False
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
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            username = escape_sql_string(username)
            message = escape_sql_string(message)
            
            cur.execute(f"""
                INSERT INTO t_p37705306_strim_boom_project.chat_messages (stream_id, user_id, username, message, created_at)
                VALUES ({stream_id}, {user_id}, '{username}', '{message}', CURRENT_TIMESTAMP)
                RETURNING id, username, message, created_at
            """)
            
            msg = cur.fetchone()
            
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
                }),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
