#!/bin/bash

# 해커 굿즈 쇼핑몰 중지 스크립트

echo "🛑 해커 굿즈 쇼핑몰 중지 중..."

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

# 컨테이너 중지 및 제거
print_step "컨테이너 중지 중..."
docker-compose down

if [ $? -eq 0 ]; then
    print_success "컨테이너가 성공적으로 중지되었습니다."
else
    echo -e "${RED}[오류]${NC} 컨테이너 중지 실패"
    exit 1
fi

# 이미지 제거 (선택사항)
read -p "Docker 이미지도 제거하시겠습니까? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_step "Docker 이미지 제거 중..."
    docker rmi docker_shopping_hacker-shop 2>/dev/null || true
    print_success "이미지 제거 완료"
fi

echo ""
echo "✅ 해커 굿즈 쇼핑몰이 완전히 중지되었습니다."
echo ""
