import json
import os
import hashlib
import secrets
from typing import Dict, Any
import psycopg2
import psycopg2.extras

def escape_sql_string(s: str) -> str:
    """Экранирует строки для безопасного использования в SQL"""
    return s.replace("'", "''")

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Регистрация и авторизация пользователей
    Args: event с httpMethod, body (email, password, username)
    Returns: HTTP response с токеном или ошибкой
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    action = body_data.get('action')
    
    database_url = os.environ.get('DATABASE_URL')
    
    try:
        conn = psycopg2.connect(database_url)
        conn.autocommit = True
        cur = conn.cursor()
        
        if action == 'register':
            username = body_data.get('username')
            email = body_data.get('email')
            password = body_data.get('password')
            
            if not username or not email or not password:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            username = escape_sql_string(username)
            email = escape_sql_string(email)
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            avatar = f'https://api.dicebear.com/7.x/avataaars/svg?seed={escape_sql_string(username)}'
            
            cur.execute(f"SELECT id FROM t_p37705306_strim_boom_project.users WHERE email = '{email}'")
            existing_user = cur.fetchone()
            
            if existing_user:
                cur.execute(f"""
                    UPDATE t_p37705306_strim_boom_project.users 
                    SET username = '{username}', password_hash = '{password_hash}', avatar = '{avatar}' 
                    WHERE email = '{email}' 
                    RETURNING id, username, email, avatar, boombucks
                """)
            else:
                cur.execute(f"""
                    INSERT INTO t_p37705306_strim_boom_project.users (username, email, password_hash, avatar, boombucks) 
                    VALUES ('{username}', '{email}', '{password_hash}', '{avatar}', 0) 
                    RETURNING id, username, email, avatar, boombucks
                """)
            user = cur.fetchone()
            
            token = secrets.token_urlsafe(32)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'token': token,
                    'user': {
                        'id': user[0],
                        'username': user[1],
                        'email': user[2],
                        'avatar': user[3],
                        'boombucks': user[4]
                    }
                }),
                'isBase64Encoded': False
            }
        
        elif action == 'login':
            email = body_data.get('email')
            password = body_data.get('password')
            
            if not email or not password:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing email or password'}),
                    'isBase64Encoded': False
                }
            
            email = escape_sql_string(email)
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            
            cur.execute(f"""
                SELECT id, username, email, avatar, boombucks 
                FROM t_p37705306_strim_boom_project.users 
                WHERE email = '{email}' AND password_hash = '{password_hash}'
            """)
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid credentials'}),
                    'isBase64Encoded': False
                }
            
            token = secrets.token_urlsafe(32)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'token': token,
                    'user': {
                        'id': user[0],
                        'username': user[1],
                        'email': user[2],
                        'avatar': user[3],
                        'boombucks': user[4]
                    }
                }),
                'isBase64Encoded': False
            }
        
        elif action == 'update_profile':
            email = body_data.get('email')
            username = body_data.get('username')
            avatar = body_data.get('avatar')
            
            if not email:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email required'}),
                    'isBase64Encoded': False
                }
            
            email = escape_sql_string(email)
            update_fields = []
            
            if username:
                username = escape_sql_string(username)
                update_fields.append(f"username = '{username}'")
            
            if avatar:
                avatar = escape_sql_string(avatar)
                update_fields.append(f"avatar = '{avatar}'")
            
            if not update_fields:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No fields to update'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(f"""
                UPDATE t_p37705306_strim_boom_project.users 
                SET {', '.join(update_fields)} 
                WHERE email = '{email}' 
                RETURNING id, username, email, avatar, boombucks
            """)
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'User not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'user': {
                        'id': user[0],
                        'username': user[1],
                        'email': user[2],
                        'avatar': user[3],
                        'boombucks': user[4]
                    }
                }),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid action'}),
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
