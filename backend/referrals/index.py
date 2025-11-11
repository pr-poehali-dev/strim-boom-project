import json
import os
from typing import Dict, Any
import psycopg2
import psycopg2.extras
from datetime import datetime

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
                SELECT r.id, r.referrer_id, r.referred_user_id, u.username,
                       r.purchase_amount, r.reward_earned, r.status, r.created_at
                FROM referrals r
                JOIN users u ON r.referred_user_id = u.id
                WHERE r.referrer_id = %s
                ORDER BY r.created_at DESC
            """, (user_id,))
            
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
            
            cur.execute("SELECT referral_code FROM users WHERE id = %s", (user_id,))
            referral_code_row = cur.fetchone()
            referral_code = referral_code_row[0] if referral_code_row else None
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'referrals': referrals,
                    'referralCode': referral_code
                })
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
                    'body': json.dumps({'error': 'Missing referrer_id or referred_user_id'})
                }
            
            cur.execute("""
                INSERT INTO referrals (referrer_id, referred_user_id, purchase_amount, status)
                VALUES (%s, %s, %s, 'pending')
                ON CONFLICT (referrer_id, referred_user_id) 
                DO UPDATE SET purchase_amount = referrals.purchase_amount + EXCLUDED.purchase_amount
                RETURNING id, purchase_amount, reward_earned, status
            """, (referrer_id, referred_user_id, purchase_amount))
            
            row = cur.fetchone()
            total_purchase = row[1]
            
            if total_purchase >= 3 and row[3] == 'pending':
                cur.execute("""
                    UPDATE referrals
                    SET status = 'rewarded', reward_earned = 1
                    WHERE referrer_id = %s AND referred_user_id = %s
                """, (referrer_id, referred_user_id))
                
                cur.execute("""
                    UPDATE users
                    SET boombucks = boombucks + 1
                    WHERE id = %s
                """, (referrer_id,))
                
                cur.execute("""
                    INSERT INTO transactions (user_id, type, amount, description, status)
                    VALUES (%s, 'referral_reward', 1, 'Referral reward', 'completed')
                """, (referrer_id,))
            
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
