#!/bin/bash

# 해커 굿즈 쇼핑몰 빌드 및 실행 스크립트

echo "🏴‍☠️ 해커 굿즈 쇼핑몰 설정 시작..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 함수 정의
print_step() {
    echo -e "${BLUE}[단계]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[성공]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[경고]${NC} $1"
}

print_error() {
    echo -e "${RED}[오류]${NC} $1"
}

# Docker 설치 확인
print_step "Docker 설치 확인 중..."
if ! command -v docker &> /dev/null; then
    print_error "Docker가 설치되지 않았습니다. https://www.docker.com/get-started에서 설치하세요."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose가 설치되지 않았습니다."
    exit 1
fi

print_success "Docker 환경 확인 완료"

# 기존 컨테이너 정지 및 제거
print_step "기존 컨테이너 정리 중..."
docker-compose down 2>/dev/null || true
docker rm -f hacker-goods-mall 2>/dev/null || true

# 이미지 빌드
print_step "Docker 이미지 빌드 중..."
docker-compose build

if [ $? -eq 0 ]; then
    print_success "이미지 빌드 완료"
else
    print_error "이미지 빌드 실패"
    exit 1
fi

# 컨테이너 시작
print_step "컨테이너 시작 중..."
docker-compose up -d

if [ $? -eq 0 ]; then
    print_success "컨테이너 시작 완료"
else
    print_error "컨테이너 시작 실패"
    exit 1
fi

# 서비스 준비 대기
print_step "서비스 준비 대기 중..."
sleep 5

# 서비스 상태 확인
print_step "서비스 상태 확인 중..."
if curl -s http://localhost:3000 > /dev/null; then
    print_success "서비스가 정상적으로 실행되고 있습니다!"
else
    print_warning "서비스가 아직 준비되지 않았습니다. 조금 더 기다려주세요."
fi

# 정보 출력
echo ""
echo "🎉 해커 굿즈 쇼핑몰 설정 완료!"
echo ""
echo "📋 서비스 정보:"
echo "   - 웹사이트: http://localhost:3000"
echo "   - 컨테이너 이름: hacker-goods-mall"
echo ""
echo "👤 테스트 계정:"
echo "   - 관리자: admin / admin123"
echo "   - 사용자: hacker1 / password123"
echo "   - 테스트: testuser / test123"
echo ""
echo "🔓 보안 테스트 페이지:"
echo "   - http://localhost:3000/vulnerability-test"
echo "   - http://localhost:3000/admin (권한 우회 테스트)"
echo "   - http://localhost:3000/profile (XSS 테스트)"
echo ""
echo "🛠️ 유용한 명령어:"
echo "   - 로그 확인: docker-compose logs -f"
echo "   - 서비스 중지: docker-compose down"
echo "   - 컨테이너 재시작: docker-compose restart"
echo ""
echo "⚠️  주의: 이 사이트는 교육용이며 의도적으로 보안 취약점을 포함하고 있습니다."
echo ""

# 브라우저 열기 (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    print_step "브라우저에서 사이트 열기..."
    open http://localhost:3000
fi
