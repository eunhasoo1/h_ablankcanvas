import { createClient } from '@supabase/supabase-js';

// Supabase 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 설정이 비어있는지 확인하고 콘솔에 로깅 (디버깅 용도)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase 환경 변수가 설정되지 않았습니다!', { 
    hasUrl: !!supabaseUrl, 
    hasKey: !!supabaseAnonKey 
  });
}

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 연결 테스트 함수
export async function testSupabaseConnection() {
  try {
    const { error } = await supabase.from('admin_users').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('Supabase 연결 테스트 실패:', error);
      return false;
    }
    console.log('Supabase 연결 테스트 성공');
    return true;
  } catch (err) {
    console.error('Supabase 연결 테스트 중 예외 발생:', err);
    return false;
  }
}

// 관리자 권한 확인 함수
export async function isAdmin(userId: string) {
  if (!userId) {
    console.log('Admin check: userId is empty');
    return false;
  }
  
  console.log('Checking admin status for userId:', userId);
  
  try {
    // 연결 테스트 먼저 실행
    const isConnected = await testSupabaseConnection();
    if (!isConnected) {
      console.error('Supabase 연결이 실패하여 admin 확인을 수행할 수 없습니다');
      return false;
    }
    
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Admin check error:', error);
      return false;
    }
    
    console.log('Admin check query result:', { dataExists: !!data, dataLength: data?.length });
    
    // 데이터가 없으면 (결과가 빈 배열이면) 관리자가 아님
    if (!data || data.length === 0) {
      console.log('User is not an admin:', userId);
      return false;
    }
    
    console.log('User IS an admin:', userId);
    return true;
  } catch (err) {
    console.error('Error checking admin status:', err);
    return false;
  }
} 