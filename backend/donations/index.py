import json
import os
from typing import Dict, Any
import psycopg2
import psycopg2.extras

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Система донатов для стримеров
    Args: event с httpMethod, body (stream_id, from_user_id, amount, message)
    Returns: HTTP response с подтверждением доната
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
            
            if not stream_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing stream_id'})
                }
            
            cur.execute("""
                SELECT d.id, d.amount, d.message, d.created_at, u.username
                FROM donations d
                LEFT JOIN users u ON d.from_user_id = u.id
                WHERE d.stream_id = %s
                ORDER BY d.created_at DESC
                LIMIT 50
            """, (stream_id,))
            
            donations = []
            for row in cur.fetchall():
                donations.append({
                    'id': row[0],
                    'amount': row[1],
                    'message': row[2],
                    'timestamp': row[3].isoformat() if row[3] else None,
                    'username': row[4] or 'Аноним'
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'donations': donations})
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            stream_id = body_data.get('stream_id')
            from_user_id = body_data.get('from_user_id')
            amount = body_data.get('amount')
            message = body_data.get('message', '')
            
            if not stream_id or not from_user_id or not amount:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'})
                }
            
            cur.execute("SELECT boombucks FROM users WHERE id = %s", (from_user_id,))
            user = cur.fetchone()
            
            if not user or user[0] < amount:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Insufficient boombucks'})
                }
            
            cur.execute("""
                UPDATE users 
                SET boombucks = boombucks - %s 
                WHERE id = %s
            """, (amount, from_user_id))
            
            cur.execute("""
                SELECT user_id FROM streams WHERE id = %s
            """, (stream_id,))
            streamer = cur.fetchone()
            
            if streamer:
                cur.execute("""
                    UPDATE users 
                    SET boombucks = boombucks + %s 
                    WHERE id = %s
                """, (amount, streamer[0]))
            
            cur.execute("""
                INSERT INTO donations (stream_id, from_user_id, amount, message)
                VALUES (%s, %s, %s, %s)
                RETURNING id, amount, message, created_at
            """, (stream_id, from_user_id, amount, message))
            
            donation = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'donation': {
                        'id': donation[0],
                        'amount': donation[1],
                        'message': donation[2],
                        'timestamp': donation[3].isoformat() if donation[3] else None
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