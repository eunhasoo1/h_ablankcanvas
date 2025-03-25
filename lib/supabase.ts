import { createClient } from '@supabase/supabase-js';

// Supabase 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 관리자 권한 확인 함수
export async function isAdmin(userId: string) {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Admin check error:', error);
      return false;
    }
    
    // 데이터가 없으면 (결과가 빈 배열이면) 관리자가 아님
    if (!data || data.length === 0) {
      // 디버그 정보: 개발 단계에서만 사용 (배포 시 제거 고려)
      console.log('User is not an admin:', userId);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error checking admin status:', err);
    return false;
  }
} 