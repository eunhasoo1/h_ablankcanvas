-- 테이블 구조 확인
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'admin_users';

-- user_id에 UNIQUE 제약 조건 추가 (필요한 경우)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage 
        WHERE table_name = 'admin_users' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE admin_users ADD CONSTRAINT unique_user_id UNIQUE (user_id);
    END IF;
END $$;

-- 테이블이 비어있는지 확인
SELECT COUNT(*) FROM admin_users;

-- 관리자 추가 (존재하지 않는 경우)
INSERT INTO admin_users (user_id)
SELECT '8f5a1ac3-3924-40ac-901e-8e05c56485e6'
WHERE NOT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = '8f5a1ac3-3924-40ac-901e-8e05c56485e6'
);

-- 성공적으로 추가되었는지 확인
SELECT * FROM admin_users; 