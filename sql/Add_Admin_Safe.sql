-- 1. user_id에 UNIQUE 제약 조건 추가 (없는 경우에만)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'admin_users_user_id_key'
    ) THEN
        ALTER TABLE admin_users ADD CONSTRAINT admin_users_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- 2. 관리자 사용자 추가 (이미 존재하지 않는 경우에만)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM admin_users WHERE user_id = '8f5a1ac3-3924-40ac-901e-8e05c56485e6'
    ) THEN
        INSERT INTO admin_users (user_id)
        VALUES ('8f5a1ac3-3924-40ac-901e-8e05c56485e6');
    END IF;
END $$;

-- 3. 성공적으로 추가되었는지 확인
SELECT * FROM admin_users WHERE user_id = '8f5a1ac3-3924-40ac-901e-8e05c56485e6'; 