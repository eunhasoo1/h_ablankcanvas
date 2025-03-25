-- 1. user_id에 UNIQUE 제약 조건 추가
ALTER TABLE admin_users ADD CONSTRAINT admin_users_user_id_key UNIQUE (user_id);

-- 2. 관리자 사용자 추가 (제약 조건 추가 후)
INSERT INTO admin_users (user_id)
VALUES ('8f5a1ac3-3924-40ac-901e-8e05c56485e6');

-- 3. 성공적으로 추가되었는지 확인
SELECT * FROM admin_users WHERE user_id = '8f5a1ac3-3924-40ac-901e-8e05c56485e6'; 