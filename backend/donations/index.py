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
            
            if not stream_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing stream_id'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(f"""
                SELECT d.id, d.amount, d.message, d.created_at, u.username
                FROM t_p37705306_strim_boom_project.donations d
                LEFT JOIN t_p37705306_strim_boom_project.users u ON d.from_user_id = u.id
                WHERE d.stream_id = {stream_id}
                ORDER BY d.created_at DESC
                LIMIT 50
            """)
            
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
                'body': json.dumps({'donations': donations}),
                'isBase64Encoded': False
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
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            message = escape_sql_string(message)
            
            cur.execute(f"SELECT boombucks FROM t_p37705306_strim_boom_project.users WHERE id = {from_user_id}")
            user = cur.fetchone()
            
            if not user or user[0] < amount:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Insufficient boombucks'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(f"""
                UPDATE t_p37705306_strim_boom_project.users 
                SET boombucks = boombucks - {amount} 
                WHERE id = {from_user_id}
            """)
            
            cur.execute(f"SELECT user_id FROM t_p37705306_strim_boom_project.streams WHERE id = {stream_id}")
            streamer = cur.fetchone()
            
            if streamer:
                cur.execute(f"""
                    UPDATE t_p37705306_strim_boom_project.users 
                    SET boombucks = boombucks + {amount} 
                    WHERE id = {streamer[0]}
                """)
            
            cur.execute(f"""
                INSERT INTO t_p37705306_strim_boom_project.donations (stream_id, from_user_id, amount, message, created_at)
                VALUES ({stream_id}, {from_user_id}, {amount}, '{message}', CURRENT_TIMESTAMP)
                RETURNING id, amount, message, created_at
            """)
            
            donation = cur.fetchone()
            
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
