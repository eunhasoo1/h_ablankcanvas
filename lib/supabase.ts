import { createClient } from '@supabase/supabase-js';

// Supabase 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 개발 디버깅 정보 출력
console.log('Supabase 설정 정보 (URL은 보안상 일부만 표시):', {
  urlPrefix: supabaseUrl.substring(0, 10) + '...',
  hasAnonKey: !!supabaseAnonKey,
  environment: process.env.NODE_ENV,
});

// 설정이 비어있는지 확인하고 콘솔에 로깅 (디버깅 용도)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase 환경 변수가 설정되지 않았습니다!');
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

// 테이블 존재 확인 함수
export async function checkTableExists(tableName: string) {
  try {
    const { data, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('tablename', tableName)
      .eq('schemaname', 'public');
    
    if (error) {
      console.error(`테이블 ${tableName} 존재 확인 실패:`, error);
      return false;
    }
    
    const exists = data && data.length > 0;
    console.log(`테이블 ${tableName} 존재 여부:`, exists);
    return exists;
  } catch (err) {
    console.error(`테이블 ${tableName} 존재 확인 중 오류:`, err);
    return false;
  }
}

// admin_users 테이블 내용 출력 (디버깅용)
export async function listAdminUsers() {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*');
    
    if (error) {
      console.error('관리자 목록 조회 실패:', error);
      return [];
    }
    
    console.log('관리자 목록:', data);
    return data || [];
  } catch (err) {
    console.error('관리자 목록 조회 중 오류:', err);
    return [];
  }
}

// 관리자 권한 확인 함수
export async function isAdmin(userId: string) {
  if (!userId) {
    console.log('Admin check: userId is empty');
    return false;
  }
  
  console.log('Checking admin status for userId:', userId);
  console.log('Using Supabase URL:', supabaseUrl.substring(0, 10) + '...');
  
  try {
    // 먼저 admin_users 테이블이 존재하는지 확인 (디버깅용)
    const tableExists = await checkTableExists('admin_users');
    if (!tableExists) {
      console.error('admin_users 테이블이 존재하지 않습니다!');
    }
    
    // admin_users 테이블 전체 출력 (디버깅용)
    const allAdmins = await listAdminUsers();
    console.log(`전체 관리자 수: ${allAdmins.length}`);
    
    // 명시적으로 user_id로 필터링한 쿼리 작성
    console.log(`관리자 조회 쿼리 실행: user_id = ${userId}`);
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, user_id, created_at')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Admin check error:', error);
      return false;
    }
    
    // 디버그 데이터 로깅 (개발용)
    console.log('Admin check query response:', { 
      userId, 
      dataExists: !!data, 
      dataLength: data?.length,
      data: data
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