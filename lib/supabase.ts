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
    // 명시적으로 user_id로 필터링한 쿼리 작성
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, user_id, created_at')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Admin check error:', error);
      return false;
    }
    
    // 디버그 데이터 로깅 (개발용)
    console.log('Admin check response:', { 
      userId, 
      dataExists: !!data, 
      dataLength: data?.length,
      rawData: JSON.stringify(data)
    });
    
    // 데이터가 없으면 (결과가 빈 배열이면) 관리자가 아님
    if (!data || data.length === 0) {
      // 하드코딩된 관리자 ID 목록과 비교 (비상용)
      if (userId === '8f5a1ac3-3924-40ac-901e-8e05c56485e6') {
        console.log('User IS an admin (hardcoded check):', userId);
        return true;
      }
      
      console.log('User is not an admin:', userId);
      return false;
    }
    
    console.log('User IS an admin (DB check):', userId);
    return true;
  } catch (err) {
    console.error('Error checking admin status:', err);
    
    // 오류 발생 시 하드코딩된 관리자 ID 확인 (비상용)
    if (userId === '8f5a1ac3-3924-40ac-901e-8e05c56485e6') {
      console.log('User IS an admin (hardcoded fallback check):', userId);
      return true;
    }
    
    return false;
  }
} 