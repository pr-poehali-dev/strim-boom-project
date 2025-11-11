import json
import os
from typing import Dict, Any
import psycopg2
import psycopg2.extras
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление транзакциями пользователя (покупки BBS, история)
    Args: event с httpMethod, queryStringParameters (user_id), body
    Returns: HTTP response со списком транзакций или новой транзакцией
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
            user_id = params.get('user_id')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing user_id'})
                }
            
            cur.execute("""
                SELECT id, type, amount, currency, description, status, created_at
                FROM transactions
                WHERE user_id = %s
                ORDER BY created_at DESC
                LIMIT 100
            """, (user_id,))
            
            transactions = []
            for row in cur.fetchall():
                transactions.append({
                    'id': str(row[0]),
                    'type': row[1],
                    'amount': row[2],
                    'currency': row[3],
                    'description': row[4],
                    'status': row[5],
                    'date': row[6].isoformat() if row[6] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'transactions': transactions})
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            user_id = body_data.get('user_id')
            transaction_type = body_data.get('type')
            amount = body_data.get('amount')
            currency = body_data.get('currency')
            description = body_data.get('description', '')
            
            if not user_id or not transaction_type or not amount:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'})
                }
            
            cur.execute("""
                INSERT INTO transactions (user_id, type, amount, currency, description, status)
                VALUES (%s, %s, %s, %s, %s, 'completed')
                RETURNING id, type, amount, currency, description, status, created_at
            """, (user_id, transaction_type, amount, currency, description))
            
            row = cur.fetchone()
            
            if transaction_type == 'buy':
                cur.execute("""
                    UPDATE users 
                    SET boombucks = boombucks + %s
                    WHERE id = %s
                """, (amount, user_id))
            
            conn.commit()
            
            transaction = {
                'id': str(row[0]),
                'type': row[1],
                'amount': row[2],
                'currency': row[3],
                'description': row[4],
                'status': row[5],
                'date': row[6].isoformat() if row[6] else None
            }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'transaction': transaction})
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
