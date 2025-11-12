import json
import os
import hashlib
import secrets
from typing import Dict, Any
import psycopg2
import psycopg2.extras

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
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    action = body_data.get('action')
    
    database_url = os.environ.get('DATABASE_URL')
    
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        if action == 'register':
            username = body_data.get('username')
            email = body_data.get('email')
            password = body_data.get('password')
            
            if not username or not email or not password:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'})
                }
            
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            avatar = f'https://api.dicebear.com/7.x/avataaars/svg?seed={username}'
            
            cur.execute(
                "SELECT id FROM t_p37705306_strim_boom_project.users WHERE email = %s",
                (email,)
            )
            existing_user = cur.fetchone()
            
            if existing_user:
                cur.execute(
                    "UPDATE t_p37705306_strim_boom_project.users SET username = %s, password_hash = %s, avatar = %s WHERE email = %s RETURNING id, username, email, avatar, boombucks",
                    (username, password_hash, avatar, email)
                )
            else:
                cur.execute(
                    "INSERT INTO t_p37705306_strim_boom_project.users (username, email, password_hash, avatar) VALUES (%s, %s, %s, %s) RETURNING id, username, email, avatar, boombucks",
                    (username, email, password_hash, avatar)
                )
            user = cur.fetchone()
            conn.commit()
            
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
                })
            }
        
        elif action == 'login':
            email = body_data.get('email')
            password = body_data.get('password')
            
            if not email or not password:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing email or password'})
                }
            
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            
            cur.execute(
                "SELECT id, username, email, avatar, boombucks FROM t_p37705306_strim_boom_project.users WHERE email = %s AND password_hash = %s",
                (email, password_hash)
            )
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid credentials'})
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
                })
            }
        
        elif action == 'update_profile':
            email = body_data.get('email')
            username = body_data.get('username')
            avatar = body_data.get('avatar')
            
            if not email:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email required'})
                }
            
            update_fields = []
            params = []
            
            if username:
                update_fields.append('username = %s')
                params.append(username)
            
            if avatar:
                update_fields.append('avatar = %s')
                params.append(avatar)
            
            if not update_fields:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No fields to update'})
                }
            
            params.append(email)
            
            cur.execute(
                f"UPDATE t_p37705306_strim_boom_project.users SET {', '.join(update_fields)} WHERE email = %s RETURNING id, username, email, avatar, boombucks",
                tuple(params)
            )
            user = cur.fetchone()
            conn.commit()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'User not found'})
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
                })
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid action'})
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