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
    Business: Управление реферальной системой (получение рефералов, начисление наград)
    Args: event с httpMethod, queryStringParameters (user_id), body
    Returns: HTTP response со списком рефералов или обновлённым рефералом
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
            user_id = params.get('user_id')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing user_id'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(f"""
                SELECT r.id, r.referrer_id, r.referred_user_id, u.username,
                       r.purchase_amount, r.reward_earned, r.status, r.created_at
                FROM t_p37705306_strim_boom_project.referrals r
                JOIN t_p37705306_strim_boom_project.users u ON r.referred_user_id = u.id
                WHERE r.referrer_id = {user_id}
                ORDER BY r.created_at DESC
            """)
            
            referrals = []
            for row in cur.fetchall():
                referrals.append({
                    'id': str(row[0]),
                    'referrerId': row[1],
                    'referredUserId': row[2],
                    'referredUsername': row[3],
                    'purchaseAmount': row[4],
                    'rewardEarned': row[5],
                    'status': row[6],
                    'createdAt': row[7].isoformat() if row[7] else None
                })
            
            cur.execute(f"SELECT referral_code FROM t_p37705306_strim_boom_project.users WHERE id = {user_id}")
            referral_code_row = cur.fetchone()
            referral_code = referral_code_row[0] if referral_code_row else None
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'referrals': referrals,
                    'referralCode': referral_code
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            referrer_id = body_data.get('referrer_id')
            referred_user_id = body_data.get('referred_user_id')
            purchase_amount = body_data.get('purchase_amount', 0)
            
            if not referrer_id or not referred_user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing referrer_id or referred_user_id'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(f"""
                SELECT id, purchase_amount, reward_earned, status
                FROM t_p37705306_strim_boom_project.referrals
                WHERE referrer_id = {referrer_id} AND referred_user_id = {referred_user_id}
            """)
            existing = cur.fetchone()
            
            if existing:
                new_purchase = existing[1] + purchase_amount
                cur.execute(f"""
                    UPDATE t_p37705306_strim_boom_project.referrals
                    SET purchase_amount = {new_purchase}
                    WHERE referrer_id = {referrer_id} AND referred_user_id = {referred_user_id}
                    RETURNING id, purchase_amount, reward_earned, status
                """)
                row = cur.fetchone()
            else:
                cur.execute(f"""
                    INSERT INTO t_p37705306_strim_boom_project.referrals (referrer_id, referred_user_id, purchase_amount, status, created_at)
                    VALUES ({referrer_id}, {referred_user_id}, {purchase_amount}, 'pending', CURRENT_TIMESTAMP)
                    RETURNING id, purchase_amount, reward_earned, status
                """)
                row = cur.fetchone()
            
            total_purchase = row[1]
            status = row[3]
            
            if total_purchase >= 3 and status == 'pending':
                cur.execute(f"""
                    UPDATE t_p37705306_strim_boom_project.referrals
                    SET status = 'rewarded', reward_earned = 1
                    WHERE referrer_id = {referrer_id} AND referred_user_id = {referred_user_id}
                """)
                
                cur.execute(f"""
                    UPDATE t_p37705306_strim_boom_project.users
                    SET boombucks = boombucks + 1
                    WHERE id = {referrer_id}
                """)
                
                cur.execute(f"""
                    INSERT INTO t_p37705306_strim_boom_project.transactions (user_id, type, amount, description, status, created_at)
                    VALUES ({referrer_id}, 'referral_reward', 1, 'Referral reward', 'completed', CURRENT_TIMESTAMP)
                """)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid request'}),
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
