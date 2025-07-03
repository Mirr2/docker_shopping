#!/bin/bash

# 해커 굿즈 쇼핑몰 빌드 스크립트

echo "🔨 해커 굿즈 쇼핑몰 빌드 시작..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}[단계]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[성공]${NC} $1"
}

print_error() {
    echo -e "${RED}[오류]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[경고]${NC} $1"
}

# Node.js 설치 확인
print_step "Node.js 설치 확인 중..."
if ! command -v node &> /dev/null; then
    print_error "Node.js가 설치되지 않았습니다. https://nodejs.org에서 설치하세요."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm이 설치되지 않았습니다."
    exit 1
fi

print_success "Node.js 환경 확인 완료"

# 백엔드 의존성 설치
print_step "백엔드 의존성 설치 중..."
npm install

if [ $? -eq 0 ]; then
    print_success "백엔드 의존성 설치 완료"
else
    print_error "백엔드 의존성 설치 실패"
    exit 1
fi

# 프론트엔드 의존성 설치
print_step "프론트엔드 의존성 설치 중..."
cd frontend
npm install

if [ $? -eq 0 ]; then
    print_success "프론트엔드 의존성 설치 완료"
else
    print_error "프론트엔드 의존성 설치 실패"
    exit 1
fi

# 프론트엔드 빌드
print_step "프론트엔드 빌드 중..."
npm run build

if [ $? -eq 0 ]; then
    print_success "프론트엔드 빌드 완료"
else
    print_error "프론트엔드 빌드 실패"
    exit 1
fi

cd ..

# 디렉토리 생성
print_step "필요한 디렉토리 생성 중..."
mkdir -p data uploads

print_success "디렉토리 생성 완료"

# 서버 실행
print_step "서버 시작 중..."
echo ""
echo "🎉 빌드 완료! 서버를 시작합니다..."
echo ""
echo "📋 서비스 정보:"
echo "   - 웹사이트: http://localhost:5000"
echo "   - 백엔드 API: http://localhost:5000/api"
echo ""
echo "👤 테스트 계정:"
echo "   - 관리자: admin / admin123"
echo "   - 사용자: hacker1 / password123"
echo "   - 테스트: testuser / test123"
echo ""
echo "🔓 보안 테스트 페이지:"
echo "   - http://localhost:5000/vulnerability-test"
echo "   - http://localhost:5000/admin (권한 우회 테스트)"
echo "   - http://localhost:5000/profile (XSS 테스트)"
echo ""
echo "⚠️  주의: 이 사이트는 교육용이며 의도적으로 보안 취약점을 포함하고 있습니다."
echo "   서버를 중지하려면 Ctrl+C를 누르세요."
echo ""

# 브라우저 열기 (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    print_step "브라우저에서 사이트 열기..."
    sleep 2
    open http://localhost:5000 &
fi

# 서버 시작
npm start
