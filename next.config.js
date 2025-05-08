/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.youtube.com'],
  },
  output: 'export',
  // 이 설정은 public 폴더의 파일들을 out 디렉토리로 복사하게 합니다
  distDir: 'out',
};

module.exports = nextConfig; 